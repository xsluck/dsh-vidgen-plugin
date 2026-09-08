# dsh-vidgen-plugin · DSH 官方插件包

为 **DeepSeek Harness(DSH)** Web GUI 开发的 AI 视频/图片生成插件,以官方插件包形式安装。

- **host**:`lib/index.js` —— 注册 `tools / webServer / settings / shell`,暴露 24 个 RPC + 3 个 agent 工具,服务端口 `POST /dsh-vidgen/rpc`
- **client**:`lib/client.js` —— `window.__ModuleLoader__` 风格,挂载侧栏入口 / 设置卡 / 工作室 overlay / 工具面板 slots
- **scripts**:`scripts/*.js` —— 子进程辅助(配置读写 / 画布快照 / 历史 / HTTP / 清理),无第三方依赖,纯 Node 调用

---

## 安装(DSH 官方方式)

### 1. 把仓库放到本地(任意位置)

```bash
git clone https://github.com/xsluck/dsh-vidgen-plugin.git
cd dsh-vidgen-plugin
```

### 2. 用 pnpm link 装进当前 DSH profile

```bash
# 进入 DSH profile 的 package.json 目录
cd ~/.dsh/profiles/web
```

把仓库加进 `dependencies` + `dsh.profile.bundles`:

```json
{
  "dependencies": {
    "dsh-vidgen-plugin": "link:/绝对路径/到/dsh-vidgen-plugin"
  },
  "dsh": {
    "profile": {
      "bundles": ["dsh-vidgen-plugin"]
    }
  }
}
```

然后:

```bash
pnpm install   # 建立 symlink
```

### 3. 重启 DSH

```bash
npx @deepseek-ai/dsh web
```

重启后:
- 侧栏 footer 多一个 🎬 入口(打开生成工作室)
- 设置页多一段「视频生成」卡片(多提供者配置)
- agent 工具列表多三个:`list_video_models` / `generate_video` / `poll_video_task`

> ⚠️ 修改 `lib/` 或 `scripts/` 后必须重启才会生效 —— 这是官方插件方式的标准生命周期。

---

## 功能

### 🎬 节点画布工作室
- 六种节点:**文生图 / 图生图·多图合成 / 图源 / 文生视频 / 图生视频 / 关键帧**
- 节点连线(拖右侧 🟠 圆点);**1 张 = 图生图,2+ 张 = 多图合成**(图生图与多图合成共用 `extra_body.image` 数组)
- 关键帧 2~3 张(实测 3 张可出片)
- 本地图片上传(≤8MB,base64 仅支持图生图链路;视频链路需先经图生图转平台图)
- 缩放 / 平移 / 全屏悬浮工作室 / 图片点击放大
- 单节点运行 + 「⚡ 运行全部」(图片节点按依赖层并行)
- 生成历史最近 12 条,跨重启保留
- **画布快照**:新画布自动存档,可保存 / 加载 / 删除快照(最多 20 份)

### ⚙️ 多提供者设置页
- 视频 / 图片**各自独立**的提供者列表,每段任意多个平台,可「⭐ 设为当前」
- 提供者管理:新建 / 保存 / 删除 / 加载当前 / 测试连接 / 清除全部用户提供者
- 「🔄 获取模型」:用编辑框的 apiUrl + Key(留空则用当前)请求 `GET {apiUrl}/models`,自动过滤出视频/图片模型;**拉到后第一个自动填入默认模型**(无需手动选)
- 系统兜底场景下保存默认模型时,**自动从当前 active 注入 apiKey**(无需用户重复填 Key)
- 配置文件:`~/.dsh/vidgen-config.json`(优先)或系统临时目录
- 读取优先级:用户提供者(active) → settings.yaml(dsh-video / dsh-imagegen 段) → 生图插件 draw-config.json → 系统兜底

### 🤖 模型工具(供 Agent 直接调用)
- `list_video_models` — 列出当前视频提供者的可用视频模型
- `generate_video` — 文生视频(默认)/ 图生视频(`image_url`)/ 关键帧(`mode="keyframes"` + `image_urls` 2~3 张);`wait=true` 时轮询至完成,返回 mp4 URL
- `poll_video_task` — 按 `task_id` / `video_id` 查询任务状态

### 🌐 API 兼容
OpenAI 风格 `/videos`、`/images/generations`、`/models` 接口。视频轮询走 `{base}/agnesapi?video_id=…&model_name=…`。

---

## 目录结构

```
dsh-vidgen-plugin/
├── package.json           # 官方插件包元数据(dsh.bundle.patch + client.inject + dependencies)
├── cordis.patch.yml       # 官方 bundle patch(注入 vidgen plugin row)
├── lib/
│   ├── index.js           # 官方 host 入口(tools + REST /dsh-vidgen/rpc)
│   └── client.js          # 官方 client bundle(ModuleLoader)
├── scripts/               # 宿主子进程辅助脚本(纯 Node,无第三方依赖)
│   ├── vidgen-cfg-v3.js   # 配置读取(多提供者 v3)
│   ├── vidgen-save-v3.js  # 配置保存 / 切换 / 删除 / 清除
│   ├── httpscript.js      # 子进程 HTTP(json body 参数化,支持 stdin)
│   ├── cleanscript.js     # 清理临时配置
│   ├── histscript.js      # 生成历史持久化
│   ├── graphscript.js     # 画布持久化
│   ├── snapscript.js      # 画布快照持久化
│   └── runner.js          # 旧脚本包装器
└── README.md
```

---

## 开发

### 语法检查
```bash
npm test   # 等价于 node --check lib/index.js && node --check lib/client.js
```

### 调试子进程脚本
任一脚本支持两种 payload 传参方式:
- 命令行:`node script.js '<base64 payload>'`(小 payload 方便)
- stdin:`echo '<base64 payload>' | node script.js`(大 payload / 含特殊字符推荐,自动规避 ARG_MAX 与 shell 转义)

### 数据文件位置
| 内容 | 路径 |
|---|---|
| 配置(多提供者) | `~/.dsh/vidgen-config.json` |
| 画布快照 | `~/.dsh/vidgen-snapshots.json` |
| 生成历史 | `~/.dsh/vidgen-history.json` |
| 当前画布 | `~/.dsh/vidgen-graph.json` |

(都优先写到 `~/.dsh/`,无权限则回退到系统临时目录)

---

## 卸载

```bash
cd ~/.dsh/profiles/web
# 移除 package.json 里的 dsh-vidgen-plugin dependency + dsh.profile.bundles 里的同名项
pnpm install
```

重启 DSH 即可彻底下线。

---

## License

MIT