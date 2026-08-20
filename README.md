# dsh-vidgen-plugin · AI 视频 / 图片生成插件(DSH 动态 Cordis 插件)

为 **DeepSeek Harness(DSH)Web GUI** 开发的多提供者 AI 视频/图片生成插件。
以动态 Cordis 插件形式注入会话:浏览器侧提供 **ComfyUI 风格节点画布工作室** 与 **多提供者设置页**,宿主侧提供视频/图片生成、轮询、模型拉取、配置持久化等 24 个 RPC 方法与 3 个模型工具。

> 本仓库是插件的可安装发布版。功能与已在会话内运行的 `vidgen-1/pkg-6` 等价;仓库内 `plugin/` 两段源码为发布形态(纯文本文件引用,无内嵌 base64 与机器绝对路径),所有辅助脚本明文存放于 `scripts/`。

---

## 功能一览

### 🎬 节点画布工作室(设置页 →「打开生成工作室」或侧边栏 🎬 入口)
- 六种节点:**文生图 / 图生图·多图合成 / 图源 / 文生视频 / 图生视频 / 关键帧**
- 节点连线(拖动节点右侧 🟠 圆点到目标输入),支持 1~4 张参考图的图生图/多图合成,关键帧 2~3 张(实测 3 张可出片)
- 本地图片上传(≤8MB,base64 仅支持图生图链路,视频链路需先经图生图生成平台图)
- 缩放 / 平移 / 全屏悬浮工作室 / 图片点击放大
- 运行单个节点或「⚡ 运行全部」(图片节点按依赖分层并行)
- 生成历史最近 12 条,跨重启保留(宿主侧持久化),支持逐条删除 / 清空
- 画布**自动持久化 + 手动快照**:新画布自动存档,可保存 / 加载 / 删除快照,重启后恢复节点与连线

### ⚙️ 多提供者设置页(设置 → 视频生成)
- **视频 / 图片各自独立**的提供者列表,每段任意多个平台,可随意「⭐ 设为当前」
- 提供者管理:新建 / 保存 / 删除 / 加载当前 / 测试连接 / 清除全部用户提供者
- **🔄 获取模型**:用编辑框填写的 apiUrl + Key(留空则用当前提供者)请求 `GET {apiUrl}/models`,自动过滤出视频/图片模型,下拉选择即填入模型字段(手动写模型不再必要)
- 提供者编辑:名称 / API 地址 / API Key(留空保留原 Key)/ 默认模型

### 🤖 模型工具(供 Agent 直接调用)
- `list_video_models` — 列出当前视频提供者的可用视频模型
- `generate_video` — 文生视频(默认)/ 图生视频(`image_url`)/ 关键帧(`mode="keyframes"` + `image_urls` 2~3 张),`wait=true` 轮询至完成返回 mp4 URL
- `poll_video_task` — 按 task_id / video_id 查询任务状态

### 🌐 API 兼容
OpenAI 风格 `/videos`、`/images/generations`、`/models` 接口。视频轮询走 `{base}/agnesapi?video_id=…&model_name=…`。

---

## 目录结构

```
dsh-vidgen-plugin/
├── package.json           # 官方插件包元数据
├── cordis.patch.yml       # 官方 bundle patch
├── lib/
│   ├── index.js           # 官方 host 入口(由 plugin/host.js 转换:tools + REST /dsh-vidgen/rpc)
│   └── client.js          # 官方 client bundle(ModuleLoader,由 plugin/client.js 转换)
├── plugin/
│   ├── host.js            # 动态宿主半区(返回对象,粘贴进 cordis_define 的 code.host)
│   └── client.js          # 动态浏览器半区(粘贴进 code.client)
├── scripts/               # 宿主子进程辅助脚本(明文,路径由 SCRIPTS_DIR 指定)
│   ├── vidgen-cfg-v3.js   # 配置读取(多提供者 v3)
│   ├── vidgen-save-v3.js  # 配置保存 / 切换 / 删除 / 清除
│   ├── httpscript.js      # 子进程 HTTP(json body 参数化)
│   ├── cleanscript.js     # 清理临时配置
│   ├── histscript.js      # 生成历史持久化(读写)
│   ├── graphscript.js     # 画布持久化(读写)
│   ├── snapscript.js      # 画布快照持久化(读写)
│   └── runner.js          # 旧脚本包装器(已不需要,脚本自带 __arg 可直接 node 调用)
└── README.md
```

---

## 安装

### 方式 A:官方插件包(推荐)

```bash
dsh plugin add /path/to/dsh-vidgen-plugin --profile web
# 或本地 link 依赖:
# cd ~/.dsh/profiles/web && pnpm add link:/path/to/dsh-vidgen-plugin
```

- host 入口为 `lib/index.js`,client 为 `lib/client.js`,REST RPC 地址 `/dsh-vidgen/rpc`。
- `SCRIPTS_DIR` 默认相对包内 `scripts/` 解析;如脚本放在其他位置,用环境变量 `VIDGEN_SCRIPTS_DIR` 覆盖。

### 方式 B:动态 Cordis 插件(原位)

1. 将本仓库 `scripts/` 放到任意目录(或直接克隆本仓库),确保其中脚本文件齐全。
2. 打开 `plugin/host.js`,把顶部常量改为你机器上的实际路径:

   ```js
   const SCRIPTS_DIR = '/PATH/TO/dsh-vidgen-plugin/scripts'
   ```

   或设置环境变量 `VIDGEN_SCRIPTS_DIR` 覆盖(两者都不配会回退到占位路径,启动失败并报错)。

3. 在 DSH Web GUI 里,经 `cordis_define` 创建插件:
   - `code.host` = `plugin/host.js` 全文(`return { … }` 对象)
   - `code.client` = `plugin/client.js` 全文(同样是以 `return { … }` 结尾的包体)
   - 然后 `cordis_run` 激活。首次会请求授权,允许后刷新页面。

4. 入口:**设置 → 视频生成**(提供者配置 + 「打开生成工作室」),侧边栏底部 🎬 按钮可直接打开工作室悬浮窗。

### 依赖
- DSH 宿主需可执行 `node`(自动探测常见路径,也可改 `resolveNodeBin()` 的候选列表加入你的 node 路径)。
- 浏览器端依赖 DSH 提供的 React 与 `slots` 服务(官方 client inject: `dsh-client-runtime` + `dsh-client-ui-slots`)。

---

## 配置链(读取优先级)

1. **用户提供者**: `~/.dsh/vidgen-config.json`(优先)
   ```json
   {
     "video": {
       "activeId": "prov-a",
       "providers": [{ "id": "prov-a", "name": "平台A", "apiUrl": "https://xxx/v1", "apiKey": "sk-...", "model": "agnes-video-v2.0" }]
     },
     "image": { "activeId": "sys", "providers": [] }
   }
   ```
   写入由设置页完成;每段任意多提供者;无用户提供者时回退 2~4。
2. settings.yaml 的 `dsh-video`(视频)/ `dsh-imagegen`(图片)段。
3. 生图插件 `draw-config.json`(图片段兜底)。
4. 系统兜底("sys" 提供者,内置公开测试模型,无 Key 时 API 调用会被拒绝并给出明确诊断)。

> ⚠️ 存储策略:**never 往仓库提交任何真实 API Key**。Key 只出现在本机 `~/.dsh/vidgen-config.json` 与 DSH 的 settings 文件里。

---

## 生成参数

| 参数 | 说明 |
| --- | --- |
| 宽高比 | 16:9 / 9:16 / 1:1 / 4:3 / 3:4 |
| 分辨率 | 480p / 720p / 1080p |
| 时长 | 3 / 5 / 10 / 18 秒(帧数 81 / 121 / 241 / 441) |
| 帧率 | 1–60,默认 24 |
| 种子 / 推理步数 / 反向提示词 | 可选高级参数 |

---

## 说明与免责

- 本插件由 DeepSeek Harness 的动态 Cordis 插件机制驱动:源码定义在会话内、经用户授权后运行于当前进程,不修改宿主配置。
- 各平台的 API 由用户自行配置与付费;插件不内置任何第三方 API Key。
- 生成消耗 API 额度,失败会返回含状态码与错误文案的诊断信息。
```