// dsh-vidgen-plugin · Host 半区(多提供者 AI 视频/图片生成插件)
// 安装:把 SCRIPTS_DIR 改为本仓库 scripts/ 的绝对路径(或设置环境变量 VIDGEN_SCRIPTS_DIR),然后经 DSH cordis_define 粘贴本文件内容(返回对象)激活。
// 依赖服务: shell、timer(已在 inject 声明)。需要宿主可执行 node(自动探测)。
return {
  inject: ['shell', 'timer'],
  apply(ctx) {
    const VIDEO_MODEL = 'agnes-video-v2.0'
    const IMAGE_MODEL = 'agnes-image-2.1-flash'
    const RATIOS = ['16:9', '9:16', '1:1', '4:3', '3:4']
    const RESOLUTIONS = ['480p', '720p', '1080p']
    const DURATION_FRAMES = { 3: 81, 5: 121, 10: 241, 18: 441 }
    const SIZE_PRESETS = {
      '480p': { '16:9': [832, 448], '9:16': [448, 832], '1:1': [640, 640], '4:3': [736, 552], '3:4': [552, 736] },
      '720p': { '16:9': [1280, 720], '9:16': [720, 1280], '1:1': [960, 960], '4:3': [1088, 832], '3:4': [832, 1088] },
      '1080p': { '16:9': [1920, 1080], '9:16': [1080, 1920], '1:1': [1440, 1440], '4:3': [1632, 1224], '3:4': [1224, 1632] },
    }
    const IMG_SIZES = ['2K', '1K', '1280x720', '1024x1024', '1024x768']
    const IMG_MODELS = ['agnes-image-2.1-flash', 'agnes-image-2.0-flash']
    // ── 脚本目录:请把下面路径改为本仓库 scripts/ 的实际绝对路径(或用环境变量 VIDGEN_SCRIPTS_DIR 覆盖) ──
    const SCRIPTS_DIR = (typeof process !== 'undefined' && process.env && process.env.VIDGEN_SCRIPTS_DIR)
      ? process.env.VIDGEN_SCRIPTS_DIR
      : '/PATH/TO/dsh-vidgen-plugin/scripts'
    const CFG_FILE = SCRIPTS_DIR + '/vidgen-cfg-v3.js'
    const SAVE_FILE = SCRIPTS_DIR + '/vidgen-save-v3.js'
    const HTTP_FILE = SCRIPTS_DIR + '/httpscript.js'
    const CLEAN_FILE = SCRIPTS_DIR + '/cleanscript.js'
    const HIST_FILE = SCRIPTS_DIR + '/histscript.js'

    const history = []
    function upsertHistory(entry) {
      const id = entry.task_id || entry.video_id || ''
      const idx = history.findIndex((h) => h.task_id === id)
      const row = { prompt: entry.prompt || '', task_id: id, video_id: entry.video_id || '', status: entry.status || 'pending', url: entry.url || '', seconds: entry.seconds || '', size: entry.size || '', ts: entry.ts || Date.now() }
      if (idx >= 0) history[idx] = Object.assign({}, history[idx], row)
      else history.unshift(row)
      while (history.length > 12) history.pop()
      schedulePersist()
    }

    let histScheduled = false
    function schedulePersist() {
      if (histScheduled) return
      histScheduled = true
      ctx.timeout(async () => {
        histScheduled = false
        try {
          const binInfo = await resolveNodeBin()
          if (!binInfo.bin) return
          await runNode(binInfo.bin, HIST_FILE, JSON.stringify({ items: history }), 30000)
        } catch (e) {}
      }, 500)
    }
    async function loadHistory() {
      try {
        const binInfo = await resolveNodeBin()
        if (!binInfo.bin) return
        const r = await runNode(binInfo.bin, HIST_FILE, 'read', 30000)
        let j = {}
        try { j = JSON.parse(r.stdout || '{}') } catch (e) { j = {} }
        if (Array.isArray(j.items)) j.items.slice(0, 12).forEach((h) => upsertHistory(h))
      } catch (e) {}
    }

    // ── node 子进程基础设施(所有辅助脚本均为明文文件,位于 scripts/) ──
    let nodeBin = ''
    let nodeTried = []
    async function resolveNodeBin() {
      if (nodeBin) return { bin: nodeBin, tried: nodeTried }
      const candidates = ['node', '/usr/bin/node', '/usr/local/bin/node', '/opt/development/node-v24.15.0-linux-x64/bin/node', '/snap/bin/node']
      for (const bin of candidates) {
        nodeTried.push(bin)
        try {
          const spec = ctx.shell.resolve({ command: bin + ' --version', timeoutMs: 5000, stdoutMaxBytes: 64 * 1024 })
          const res = await ctx.shell.run(spec)
          if (res.exitCode === 0 && (res.stdout && res.stdout.text || '').trim().length > 0) {
            nodeBin = bin
            return { bin: nodeBin, tried: nodeTried }
          }
        } catch (e) {}
      }
      return { bin: '', tried: nodeTried }
    }
    async function runNode(bin, scriptPath, argStr, timeoutMs) {
      const command = bin + ' ' + JSON.stringify(scriptPath) + ' ' + JSON.stringify(argStr || '')
      const spec = ctx.shell.resolve({
        command: command,
        timeoutMs: timeoutMs || 120000,
        stdoutMaxBytes: 4 * 1024 * 1024,
      })
      const res = await ctx.shell.run(spec)
      return {
        exitCode: res.exitCode,
        stdout: (res.stdout && res.stdout.text) || '',
        stderr: (res.stderr && res.stderr.text) || '',
      }
    }

    // ── 配置读取:v3 多提供者(每段 active + providers 列表) ──
    let cfgCache = null
    let cfgCacheAt = 0
    function pickActive(seg) {
      const list = (seg && Array.isArray(seg.providers) ? seg.providers : []).filter((p) => p && p.apiKey)
      const activeId = (seg && seg.activeId && list.some((p) => p.id === seg.activeId)) ? seg.activeId : (list.length ? list[0].id : '')
      const active = list.find((p) => p.id === activeId) || list[0] || null
      return { activeId: activeId || '', providers: list, active: active || null }
    }
    async function readConfig() {
      const now = Date.now()
      if (cfgCache && now - cfgCacheAt < 30000) return cfgCache
      let video = { activeId: '', providers: [], active: null }
      let image = { activeId: '', providers: [], active: null }
      let user = null
      let diag = { step: 'none', error: '' }
      let docPath = ''
      const settings = ctx.get('settings')
      if (settings !== undefined) {
        try { const d = await settings.prepareDocument(); if (d) docPath = String(d) } catch (e) {}
      }
      const binInfo = await resolveNodeBin()
      diag = { step: 'probe', bins: binInfo.tried, bin: binInfo.bin }
      if (!binInfo.bin) {
        diag = Object.assign({}, diag, { error: '找不到可用的 node 二进制' })
      } else {
        let resMeta = null
        try {
          const r = await runNode(binInfo.bin, CFG_FILE, docPath)
          resMeta = { exit: r.exitCode, stderr: String(r.stderr || '').slice(0, 800) }
          const parsed = JSON.parse(r.stdout)
          diag = parsed.diag || diag
          user = parsed.user || user
          if (parsed.video) video = pickActive(parsed.video)
          if (parsed.image) image = pickActive(parsed.image)
        } catch (e) {
          diag = Object.assign({ step: 'subprocess-failed', error: String((e && e.message) || e) }, resMeta || {})
        }
      }
      const decorate = (seg, defModel) => {
        const a = seg.active
        seg.configured = !!(a && a.apiKey)
        seg.model = (a && a.model) || defModel
        seg.apiUrl = (a && a.apiUrl) || ''
        seg.masked = (a && a.apiKey) ? a.apiKey.slice(0, 4) + '…' + a.apiKey.slice(-4) : ''
        seg.source = (a && a.source) || ''
        return seg
      }
      video = decorate(video, VIDEO_MODEL)
      image = decorate(image, IMAGE_MODEL)
      cfgCache = { video, image, user, src: video.source, diag }
      cfgCacheAt = now
      return cfgCache
    }

    // ── HTTP(经子进程 fetch) ──
    async function httpJson(method, url, headers, bodyObj, timeoutMs) {
      const req = { url, method: method || 'GET', headers: headers || {}, body: bodyObj === undefined ? undefined : JSON.stringify(bodyObj) }
      const payload = btoa(JSON.stringify(req))
      const binInfo = await resolveNodeBin()
      if (!binInfo.bin) throw new Error('找不到可用的 node 二进制(尝试过: ' + binInfo.tried.join(', ') + ')')
      const r = await runNode(binInfo.bin, HTTP_FILE, payload, timeoutMs)
      if (!r.stdout && r.exitCode !== 0) {
        throw new Error('API 调用失败 (exit ' + r.exitCode + '): ' + String(r.stderr || '').slice(0, 300))
      }
      let parsed
      try { parsed = JSON.parse(r.stdout) } catch (e) { throw new Error('API 返回异常: ' + r.stdout.slice(0, 300)) }
      if (parsed.netErr) throw new Error('API 网络错误: ' + parsed.netErr)
      return parsed
    }

    function isVideoModel(id) { return /video|kling|wan|seedance|runway|pika|veo|sora|t2v|i2v|jimeng|即梦|可灵|animate/i.test(String(id)) }
    function isImageModel(id) { return /image|dall|flux|sdxl|kandinsky|stable|agnes-image|recraft|imagen|edit|vari/i.test(String(id)) }

    async function apiRequest(method, url, body, timeoutMs, kind) {
      const cfg = await readConfig()
      const seg = (kind === 'image' ? cfg.image : cfg.video)
      const a = seg.active
      if (!a || !a.apiKey) {
        throw new Error('未找到' + (kind === 'image' ? '图片' : '视频') + ' 提供者的 API Key(诊断: ' + JSON.stringify(cfg.diag || {}).slice(0, 400) + ')')
      }
      const r = await httpJson(method, url, { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + a.apiKey }, body, timeoutMs)
      let data = {}
      try { data = JSON.parse(r.text || '{}') } catch (e) { data = {} }
      if (r.status >= 400) {
        const em = data && data.error && (data.error.message || data.error.msg || data.error.code)
        throw new Error('API HTTP ' + r.status + ': ' + String(em || r.text || '').slice(0, 400))
      }
      return data
    }

    // 用指定(或编辑中的)apiUrl/apiKey 拉取模型列表:获取模型按钮专用
    async function listModelsBy(kind, apiUrl, apiKey) {
      const cfg = await readConfig()
      const seg = (kind === 'image' ? cfg.image : cfg.video)
      const url = String(apiUrl || '').trim() || seg.apiUrl || ''
      const key = String(apiKey || '').trim() || (seg.active && seg.active.apiKey) || ''
      if (!url || !key) return { error: '请先填写 API 地址与 Key(编辑框留空则用当前提供者的)' }
      const r = await httpJson('GET', url + '/models', { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key }, undefined, 30000)
      let data = {}
      try { data = JSON.parse(r.text || '{}') } catch (e) { data = {} }
      if (r.status >= 400) {
        const em = data && data.error && (data.error.message || data.error.msg || data.error.code)
        return { error: 'API HTTP ' + r.status + ': ' + String(em || r.text || '').slice(0, 300) }
      }
      const arr = (data && (data.data || data.models)) || []
      const all = arr.map((m) => (m && (m.id || m.model_id)) || '').filter(Boolean).filter((v, i, a) => a.indexOf(v) === i)
      const models = all.filter(kind === 'image' ? isImageModel : isVideoModel)
      return { ok: true, count: all.length, models }
    }

    function buildCreateBody(params, defaultModel) {
      const body = { model: params.model || defaultModel || VIDEO_MODEL, prompt: String(params.prompt || '') }
      if (params.image_url) body.image = String(params.image_url)
      if (params.mode === 'keyframes' && Array.isArray(params.image_urls) && params.image_urls.length > 0) {
        body.extra_body = { image: params.image_urls, mode: 'keyframes' }
      } else if (params.mode) {
        body.mode = String(params.mode)
      }
      const ratio = RATIOS.indexOf(params.ratio) >= 0 ? params.ratio : '16:9'
      const resolution = RESOLUTIONS.indexOf(params.resolution) >= 0 ? params.resolution : '720p'
      const dims = SIZE_PRESETS[resolution][ratio]
      body.width = dims[0]
      body.height = dims[1]
      if (DURATION_FRAMES[params.duration]) body.num_frames = DURATION_FRAMES[params.duration]
      else if (params.num_frames) body.num_frames = Number(params.num_frames)
      if (params.frame_rate) body.frame_rate = Number(params.frame_rate)
      if (params.seed !== undefined && params.seed !== null && params.seed !== '') body.seed = Number(params.seed)
      if (params.negative_prompt) body.negative_prompt = String(params.negative_prompt)
      if (params.steps) body.num_inference_steps = Number(params.steps)
      return body
    }

    function buildImageBody(params, defaultModel) {
      const body = { model: params.model || defaultModel || IMAGE_MODEL, prompt: String(params.prompt || '') }
      const sz = params.size || '2K'
      if (sz === '2K' || sz === '1K') {
        body.size = sz
        if (params.ratio) body.ratio = String(params.ratio)
      } else {
        body.size = sz
      }
      body.extra_body = { response_format: 'url' }
      const imgs = Array.isArray(params.images) ? params.images.filter(Boolean) : []
      if (imgs.length) body.extra_body.image = imgs
      return body
    }

    async function createVideoTask(params) {
      const cfg = await readConfig()
      return await apiRequest('POST', cfg.video.apiUrl + '/videos', buildCreateBody(params, cfg.video.model), 120000, 'video')
    }

    async function pollVideoTask(id) {
      const cfg = await readConfig()
      const origin = cfg.video.apiUrl.replace(/\/v1\/?$/, '')
      const url = origin + '/agnesapi?video_id=' + encodeURIComponent(id) + '&model_name=' + encodeURIComponent(cfg.video.model || VIDEO_MODEL)
      return await apiRequest('GET', url, undefined, 30000, 'video')
    }

    function summarize(data) {
      return {
        task_id: data.task_id || data.id || '',
        video_id: data.video_id || data.task_id || data.id || '',
        status: data.status || 'pending',
        progress: data.progress || 0,
        seconds: data.seconds || '',
        size: data.size || '',
      }
    }

    function completedResult(data, base) {
      const url = (data.metadata && data.metadata.url) || data.url || ''
      const sm = (data.metadata && data.metadata.size_mapping) || data.size_mapping
      const out = {
        task_id: base.task_id, video_id: base.video_id, status: 'completed', progress: 100, url,
        seconds: data.seconds || base.seconds, size: data.size || base.size,
      }
      if (sm) out.size_mapping = sm
      return out
    }

    async function listVideoModels() {
      const cfg = await readConfig()
      if (!cfg.video.configured) {
        return { configured: false, error: '未找到视频提供者 API Key', activeId: cfg.video.activeId, diag: cfg.diag }
      }
      const data = await apiRequest('GET', cfg.video.apiUrl + '/models', undefined, 30000, 'video')
      const arr = (data && (data.data || data.models)) || []
      const ids = arr.map((m) => (m && (m.id || m.model_id)) || '').filter(Boolean)
      const videoIds = ids.filter(isVideoModel)
      return { configured: true, activeId: cfg.video.activeId, provider: cfg.video.source, videoModels: videoIds, allModels: ids }
    }

    async function listImageModels() {
      const cfg = await readConfig()
      if (!cfg.image.configured) {
        return { configured: false, error: '未找到图片提供者 API Key', activeId: cfg.image.activeId, diag: cfg.diag }
      }
      const data = await apiRequest('GET', cfg.image.apiUrl + '/models', undefined, 30000, 'image')
      const arr = (data && (data.data || data.models)) || []
      const ids = arr.map((m) => (m && (m.id || m.model_id)) || '').filter(Boolean)
      const imgIds = ids.filter(isImageModel)
      return { configured: true, activeId: cfg.image.activeId, provider: cfg.image.source, models: imgIds, allModels: ids }
    }

    const listTool = harness.defineTool({
      name: 'list_video_models',
      description: 'List available AI video generation models from the currently active video provider (multi-provider config). Use before generate_video to see valid model names.',
      parameters: {},
      output: {
        schema: {
          type: 'object', additionalProperties: false,
          properties: {
            configured: { type: 'boolean' }, activeId: { type: 'string' }, provider: { type: 'string' },
            videoModels: { type: 'array', items: { type: 'string' } }, allModels: { type: 'array', items: { type: 'string' } },
            error: { type: 'string' }, diag: { type: 'object', additionalProperties: true },
          },
        },
        render: (args, result) => {
          if (!result) return [{ type: 'text', text: '(无结果)' }]
          if (result.error) return [{ type: 'text', text: '❌ ' + result.error + '\n诊断: ' + JSON.stringify(result.diag || {}).slice(0, 1000) }]
          return [{ type: 'text', text: '视频模型(当前提供者 ' + (result.activeId || '?') + '): ' + ((result.videoModels) || []).join(', ') }]
        },
      },
      async execute() {
        try { return await listVideoModels() }
        catch (e) { return { error: String((e && e.message) || e), diag: (await readConfig()).diag } }
      },
    })

    const genTool = harness.defineTool({
      name: 'generate_video',
      description: 'Generate an AI video via the currently active video provider (multi-provider config). Text-to-video by default; pass image_url for image-to-video; pass mode="keyframes" plus image_urls (2-3 public image URLs) for keyframe transition animation. Async task: when wait=true (default) polls until done (up to ~6 min) and returns the final mp4 URL; when wait=false returns immediately with task_id/video_id for poll_video_task.',
      parameters: {
        prompt: { type: 'string', required: true, description: '视频内容描述(建议英文:主体、动作、镜头运动、光线与风格)' },
        model: { type: 'string', description: '视频模型名,默认取当前视频提供者的 model' },
        ratio: { type: 'string', description: '宽高比: 16:9 | 9:16 | 1:1 | 4:3 | 3:4,默认 16:9' },
        resolution: { type: 'string', description: '分辨率档位: 480p | 720p | 1080p,默认 720p' },
        duration: { type: 'number', description: '目标时长(秒): 3 | 5 | 10 | 18,默认 5' },
        mode: { type: 'string', description: '生成模式: 默认文生视频 | keyframes(关键帧过渡,需配合 image_urls) | ti2vid' },
        image_url: { type: 'string', description: '图生视频:首帧图片 URL(可持续链生成或 draw_image)' },
        image_urls: { type: 'array', items: { type: 'string' }, description: '关键帧模式(keyframes):按顺序传入 2-3 张图片 URL 数组(服务端上限 3)' },
        num_frames: { type: 'number', description: '帧数(≤441 且满足 8n+1);指定后忽略 duration' },
        frame_rate: { type: 'number', description: '帧率 1-60,默认 24' },
        seed: { type: 'number', description: '随机种子,用于复现' },
        negative_prompt: { type: 'string', description: '反向提示词(默认由服务端补充)' },
        wait: { type: 'boolean', description: '是否等待生成完成,默认 true' },
      },
      output: {
        schema: {
          type: 'object', additionalProperties: false,
          properties: {
            task_id: { type: 'string' }, video_id: { type: 'string' }, status: { type: 'string' },
            progress: { type: 'number' }, url: { type: 'string' }, seconds: { type: 'string' },
            size: { type: 'string' }, size_mapping: { type: 'object', additionalProperties: true }, hint: { type: 'string' }, error: { type: 'string' },
          },
        },
        render: (args, result) => [{ type: 'text', text: (result && result.hint) || JSON.stringify(result) }],
      },
      async execute(params) {
        const prompt = params && params.prompt
        if (!prompt || !String(prompt).trim()) throw new Error('prompt 不能为空')
        try {
          const created = await createVideoTask(params)
          const base = summarize(created)
          upsertHistory(Object.assign({}, base, { prompt: String(prompt) }))
          if (!(params && params.wait === false)) {
            for (let i = 0; i < 70; i++) {
              await ctx.timeout(5000)
              let t
              try { t = await pollVideoTask(created.video_id || base.task_id) } catch (e) { t = { status: 'pending' } }
              const st = t.status || 'pending'
              if (st === 'completed') {
                const out = completedResult(t, base)
                upsertHistory(Object.assign({}, out, { prompt: String(prompt) }))
                return Object.assign({}, out, { hint: out.url ? ('视频已生成!\n模型: ' + (params.model || 'agnes-video-v2.0') + '\n时长: ' + out.seconds + 's  尺寸: ' + out.size + '\nURL: ' + out.url + '\n请直接输出 Markdown: ![视频](' + out.url + ')') : '视频已生成(未返回 URL)' })
              }
              if (st === 'failed') {
                const em = JSON.stringify(t.error || t).slice(0, 300)
                upsertHistory(Object.assign({}, base, { status: 'failed', prompt: String(prompt) }))
                return Object.assign({}, base, { status: 'failed', error: em, hint: '视频生成失败: ' + em })
              }
            }
            return Object.assign({}, base, { hint: '轮询超时(约6分钟),任务仍在后台进行。可调用 poll_video_task 继续查询: ' + base.task_id })
          }
          return Object.assign({}, base, { hint: '任务已创建(queued/in_progress),完成后调用 poll_video_task 获取视频: ' + base.task_id })
        } catch (e) {
          const em = String((e && e.message) || e)
          return { error: em, hint: '生成失败: ' + em }
        }
      },
    })

    const pollTool = harness.defineTool({
      name: 'poll_video_task',
      description: 'Query the status of an AI video task by task_id/video_id. Returns current status, progress, and the final mp4 URL when completed.',
      parameters: { id: { type: 'string', required: true, description: 'task_id 或 video_id' } },
      output: {
        schema: {
          type: 'object', additionalProperties: false,
          properties: {
            task_id: { type: 'string' }, video_id: { type: 'string' }, status: { type: 'string' },
            progress: { type: 'number' }, url: { type: 'string' }, seconds: { type: 'string' },
            size: { type: 'string' }, size_mapping: { type: 'object', additionalProperties: true }, error: { type: 'string' }, hint: { type: 'string' },
          },
        },
        render: (args, result) => [{ type: 'text', text: (result && result.hint) || JSON.stringify(result) }],
      },
      async execute(params) {
        const id = params && (params.id || params.task_id || params.video_id)
        if (!id) throw new Error('缺少 id')
        try {
          const t = await pollVideoTask(String(id))
          const st = t.status || 'pending'
          const base = summarize(t)
          if (st === 'completed') {
            const out = completedResult(t, base)
            upsertHistory(out)
            return Object.assign({}, out, { hint: out.url ? ('任务已完成!\nURL: ' + out.url) : '任务已完成' })
          }
          if (st === 'failed') {
            const em = JSON.stringify(t.error || t).slice(0, 300)
            upsertHistory(Object.assign({}, base, { status: 'failed' }))
            return Object.assign({}, base, { status: 'failed', error: em, hint: '任务失败: ' + em })
          }
          return Object.assign({}, base, { hint: '任务进行中: ' + st + ' (' + (t.progress || 0) + '%)。稍后再轮询。' })
        } catch (e) {
          const em = String((e && e.message) || e)
          return { error: em, hint: '查询失败: ' + em }
        }
      },
    })

    harness.registerTool(ctx, listTool)
    harness.registerTool(ctx, genTool)
    harness.registerTool(ctx, pollTool)

    // ── Client RPC ──
    let graphData = null
    function provView(seg) {
      return (seg.providers || []).map((p) => ({ id: p.id, name: p.name || p.id, apiUrl: p.apiUrl || '', keyMasked: p.apiKey ? p.apiKey.slice(0, 4) + '…' + p.apiKey.slice(-4) : '', model: p.model || '', source: p.source || '', sys: !!p.sys, active: p.id === seg.activeId }))
    }
    harness.handle('video-config', async () => {
      const cfg = await readConfig()
      return { configured: cfg.video.configured, activeId: cfg.video.activeId, providers: provView(cfg.video), apiUrl: cfg.video.apiUrl, keyMasked: cfg.video.masked, source: cfg.video.source, model: cfg.video.model, user: cfg.user, diag: cfg.diag, ratios: RATIOS, resolutions: RESOLUTIONS, durations: [3, 5, 10, 18] }
    })
    harness.handle('image-config', async () => {
      const cfg = await readConfig()
      return { configured: cfg.image.configured, activeId: cfg.image.activeId, providers: provView(cfg.image), apiUrl: cfg.image.apiUrl, keyMasked: cfg.image.masked, source: cfg.image.source, model: cfg.image.model, user: cfg.user, diag: cfg.diag, sizes: IMG_SIZES, models: IMG_MODELS }
    })
    harness.handle('video-models', async () => {
      try { return await listVideoModels() }
      catch (e) { return { configured: false, error: String((e && e.message) || e), diag: (await readConfig()).diag } }
    })
    harness.handle('image-models', async () => {
      try { return await listImageModels() }
      catch (e) { return { configured: false, error: String((e && e.message) || e), diag: (await readConfig()).diag } }
    })
    harness.handle('video-models-by', async (args) => {
      try { return await listModelsBy('video', args && args.apiUrl, args && args.apiKey) }
      catch (e) { return { error: String((e && e.message) || e) } }
    })
    harness.handle('image-models-by', async (args) => {
      try { return await listModelsBy('image', args && args.apiUrl, args && args.apiKey) }
      catch (e) { return { error: String((e && e.message) || e) } }
    })
    harness.handle('video-generate', async (args) => {
      try {
        const r = summarize(await createVideoTask(args || {}))
        upsertHistory(Object.assign({}, r, { prompt: String((args && args.prompt) || '') }))
        return r
      }
      catch (e) { return { error: String((e && e.message) || e) } }
    })
    harness.handle('image-generate', async (args) => {
      try {
        if (!args || !String(args.prompt || '').trim()) return { error: '请填写生图提示词' }
        const cfg = await readConfig()
        const data = await apiRequest('POST', cfg.image.apiUrl + '/images/generations', buildImageBody(args, cfg.image.model), 240000, 'image')
        const item = data && Array.isArray(data.data) && data.data[0]
        const url = item && (item.url || '')
        if (!url) return { error: '生图接口未返回图片 URL: ' + JSON.stringify(data).slice(0, 300) }
        return { url }
      } catch (e) { return { error: String((e && e.message) || e) } }
    })
    harness.handle('video-poll', async (args) => {
      try {
        const id = args && (args.id || args.task_id || args.video_id)
        if (!id) return { error: '缺少 id' }
        const t = await pollVideoTask(String(id))
        const st = t.status || 'pending'
        const base = summarize(t)
        if (st === 'completed') {
          const out = completedResult(t, base)
          upsertHistory(out)
          return out
        }
        if (st === 'failed') {
          const row = Object.assign({}, base, { status: 'failed', error: JSON.stringify(t.error || t).slice(0, 300) })
          upsertHistory(row)
          return row
        }
        upsertHistory(base)
        return base
      } catch (e) { return { error: String((e && e.message) || e) } }
    })
    harness.handle('video-history', async () => ({ items: history }))
    harness.handle('video-config-save', async (args) => {
      try {
        const binInfo = await resolveNodeBin()
        if (!binInfo.bin) return { ok: false, error: '找不到可用的 node 二进制' }
        const prov = (args && args.provider) || {}
        const payload = JSON.stringify({ op: 'save', kind: 'video', provider: { id: prov.id || '', name: prov.name || '', apiUrl: prov.apiUrl || '', apiKey: prov.apiKey || '', model: prov.model || '' } })
        const r = await runNode(binInfo.bin, SAVE_FILE, payload)
        let j = {}
        try { j = JSON.parse(r.stdout || '{}') } catch (e) { j = { error: r.stdout || r.stderr } }
        if (j.ok) { cfgCache = null; cfgCacheAt = 0; return { ok: true, files: j.files || [] } }
        return { ok: false, error: String(j.error || r.stderr || '保存失败').slice(0, 300) }
      } catch (e) { return { ok: false, error: String((e && e.message) || e) } }
    })
    harness.handle('image-config-save', async (args) => {
      try {
        const binInfo = await resolveNodeBin()
        if (!binInfo.bin) return { ok: false, error: '找不到可用的 node 二进制' }
        const prov = (args && args.provider) || {}
        const payload = JSON.stringify({ op: 'save', kind: 'image', provider: { id: prov.id || '', name: prov.name || '', apiUrl: prov.apiUrl || '', apiKey: prov.apiKey || '', model: prov.model || '' } })
        const r = await runNode(binInfo.bin, SAVE_FILE, payload)
        let j = {}
        try { j = JSON.parse(r.stdout || '{}') } catch (e) { j = { error: r.stdout || r.stderr } }
        if (j.ok) { cfgCache = null; cfgCacheAt = 0; return { ok: true, files: j.files || [] } }
        return { ok: false, error: String(j.error || r.stderr || '保存失败').slice(0, 300) }
      } catch (e) { return { ok: false, error: String((e && e.message) || e) } }
    })
    harness.handle('video-config-set', async (args) => {
      try {
        const binInfo = await resolveNodeBin()
        if (!binInfo.bin) return { ok: false, error: '找不到可用的 node 二进制' }
        const payload = JSON.stringify({ op: 'set', kind: 'video', providerId: (args && args.providerId) || '' })
        const r = await runNode(binInfo.bin, SAVE_FILE, payload)
        let j = {}
        try { j = JSON.parse(r.stdout || '{}') } catch (e) { j = { error: r.stdout || r.stderr } }
        if (j.ok) { cfgCache = null; cfgCacheAt = 0; return { ok: true } }
        return { ok: false, error: String(j.error || r.stderr || '切换失败').slice(0, 300) }
      } catch (e) { return { ok: false, error: String((e && e.message) || e) } }
    })
    harness.handle('image-config-set', async (args) => {
      try {
        const binInfo = await resolveNodeBin()
        if (!binInfo.bin) return { ok: false, error: '找不到可用的 node 二进制' }
        const payload = JSON.stringify({ op: 'set', kind: 'image', providerId: (args && args.providerId) || '' })
        const r = await runNode(binInfo.bin, SAVE_FILE, payload)
        let j = {}
        try { j = JSON.parse(r.stdout || '{}') } catch (e) { j = { error: r.stdout || r.stderr } }
        if (j.ok) { cfgCache = null; cfgCacheAt = 0; return { ok: true } }
        return { ok: false, error: String(j.error || r.stderr || '切换失败').slice(0, 300) }
      } catch (e) { return { ok: false, error: String((e && e.message) || e) } }
    })
    harness.handle('video-config-remove', async (args) => {
      try {
        const binInfo = await resolveNodeBin()
        if (!binInfo.bin) return { ok: false, error: '找不到可用的 node 二进制' }
        const payload = JSON.stringify({ op: 'remove', kind: 'video', providerId: (args && args.providerId) || '' })
        const r = await runNode(binInfo.bin, SAVE_FILE, payload)
        let j = {}
        try { j = JSON.parse(r.stdout || '{}') } catch (e) { j = { error: r.stdout || r.stderr } }
        if (j.ok) { cfgCache = null; cfgCacheAt = 0; return { ok: true } }
        return { ok: false, error: String(j.error || r.stderr || '删除失败').slice(0, 300) }
      } catch (e) { return { ok: false, error: String((e && e.message) || e) } }
    })
    harness.handle('image-config-remove', async (args) => {
      try {
        const binInfo = await resolveNodeBin()
        if (!binInfo.bin) return { ok: false, error: '找不到可用的 node 二进制' }
        const payload = JSON.stringify({ op: 'remove', kind: 'image', providerId: (args && args.providerId) || '' })
        const r = await runNode(binInfo.bin, SAVE_FILE, payload)
        let j = {}
        try { j = JSON.parse(r.stdout || '{}') } catch (e) { j = { error: r.stdout || r.stderr } }
        if (j.ok) { cfgCache = null; cfgCacheAt = 0; return { ok: true } }
        return { ok: false, error: String(j.error || r.stderr || '删除失败').slice(0, 300) }
      } catch (e) { return { ok: false, error: String((e && e.message) || e) } }
    })
    harness.handle('video-config-clear', async () => {
      try {
        const binInfo = await resolveNodeBin()
        if (!binInfo.bin) return { ok: false, error: '找不到可用的 node 二进制' }
        const r = await runNode(binInfo.bin, SAVE_FILE, JSON.stringify({ op: 'clear' }))
        let j = {}
        try { j = JSON.parse(r.stdout || '{}') } catch (e) { j = { error: r.stdout || r.stderr } }
        if (j.ok) { cfgCache = null; cfgCacheAt = 0; return { ok: true, files: j.files || [] } }
        return { ok: false, error: String(j.error || r.stderr || '清除失败').slice(0, 300) }
      } catch (e) { return { ok: false, error: String((e && e.message) || e) } }
    })
    harness.handle('video-graph', async (args) => {
      if (args && args.graph) graphData = args.graph
      return { graph: graphData }
    })

    loadHistory()
  },
}