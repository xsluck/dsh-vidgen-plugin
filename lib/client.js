// dsh-vidgen-plugin client — official DSH ModuleLoader bundle
// Converted from pkg-6 dynamic client full text (cordis_define code.client):
// - window.__ModuleLoader__.load wrapper
// - styles.insert -> installStyles (ctx.effect cleanup)
// - host.call -> rpc('/dsh-vidgen/rpc')
// - ctx.timeout -> setTimeout
window.__ModuleLoader__.load({
  id: 'dsh-vidgen-plugin',
  factory: (require) => {
    'use strict'
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })

    const React = require('react')

    function installStyles() {
      const css = `.vidgen-card{font-family:inherit;color:var(--text-1,#1f2328);}
.vidgen-card .vg-title{font-weight:600;font-size:14px;margin:0 0 10px;}
.vidgen-card .vg-warn{background:rgba(255,180,0,.12);border:1px solid rgba(255,180,0,.4);border-radius:8px;padding:8px 10px;font-size:12px;margin-bottom:10px;}
.vidgen-card .vg-cfgline{font-size:11px;opacity:.75;margin:0 0 8px;}
.vidgen-card .vg-cfgline b{opacity:1;}
.vidgen-card .vg-row{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0;}
.vidgen-card .vg-field{display:flex;flex-direction:column;gap:3px;flex:1;min-width:100px;}
.vidgen-card .vg-field label{font-size:11px;opacity:.7;}
.vidgen-card textarea.vg-input,.vidgen-card select.vg-input,.vidgen-card input.vg-input{border:1px solid var(--border-1,rgba(128,128,128,.35));border-radius:8px;background:var(--bg-2,rgba(128,128,128,.06));color:inherit;padding:6px 8px;font:inherit;font-size:13px;box-sizing:border-box;width:100%;}
.vidgen-card textarea.vg-input{min-height:64px;resize:vertical;}
.vidgen-card .vg-btn{background:var(--accent-1,#2f6fed);color:#fff;border:none;border-radius:8px;padding:8px 14px;font:inherit;font-size:13px;cursor:pointer;}
.vidgen-card .vg-btn:disabled{opacity:.45;cursor:default;}
.vidgen-card .vg-sec-btn{background:var(--bg-2,rgba(128,128,128,.05));border:1px solid var(--border-1,rgba(128,128,128,.45));border-radius:8px;color:inherit;font:inherit;font-size:12px;cursor:pointer;padding:7px 12px;white-space:nowrap;transition:border-color .15s,color .15s,background .15s;}
.vidgen-card .vg-sec-btn:hover{border-color:#2f6fed;color:#2f6fed;background:rgba(47,111,237,.07);}
.vidgen-card .vg-sec-btn.danger:hover{border-color:#e5484d;color:#e5484d;background:rgba(229,72,77,.07);}
.vidgen-card .vg-sec-btn:disabled{opacity:.45;cursor:default;}
.vidgen-card .vg-btnrow{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px;}
.vidgen-card .vg-status{font-size:12px;opacity:.85;margin:8px 0;white-space:pre-wrap;}
.vidgen-card .vg-error{color:#e5484d;font-size:12px;margin:6px 0;}
/* ── 节点画布 ── */
.vg-canvas-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;}
.vg-palette{display:flex;gap:6px;flex-wrap:wrap;}
.vg-pal-btn{background:transparent;border:1px solid var(--border-1,rgba(128,128,128,.4));border-radius:7px;color:inherit;font:inherit;font-size:11px;cursor:pointer;padding:4px 9px;white-space:nowrap;}
.vg-pal-btn:hover{border-color:#2f6fed;color:#2f6fed;}
.vg-canvas-wrap{position:relative;flex:1;overflow:hidden;border:1px solid var(--border-1,rgba(128,128,128,.25));border-radius:12px;background:var(--bg-2,rgba(128,128,128,.05));min-height:420px;touch-action:none;user-select:none;}
.vg-world{position:absolute;left:0;top:0;transform-origin:0 0;}
.vg-node{position:absolute;width:250px;background:var(--bg-1,#fff);border:1px solid var(--border-1,rgba(128,128,128,.4));border-radius:10px;box-shadow:0 6px 18px rgba(0,0,0,.12);}
.vg-node.sel{border-color:#2f6fed;box-shadow:0 0 0 2px rgba(47,111,237,.35);}
.vg-node-head{display:flex;align-items:center;gap:6px;padding:6px 8px;font-size:12px;font-weight:600;cursor:grab;border-bottom:1px solid var(--border-1,rgba(128,128,128,.2));}
.vg-node-head:active{cursor:grabbing;}
.vg-node-x{margin-left:auto;background:transparent;border:none;color:inherit;cursor:pointer;font-size:12px;opacity:.6;border-radius:4px;padding:2px 6px;}
.vg-node-x:hover{opacity:1;background:rgba(128,128,128,.15);}
.vg-node-body{padding:8px;display:flex;flex-direction:column;gap:6px;font-size:12px;}
.vg-nfld{display:flex;flex-direction:column;gap:2px;}
.vg-nfld label{font-size:10px;opacity:.6;}
.vg-nfld input,.vg-nfld select,.vg-nfld textarea{font:inherit;font-size:12px;border:1px solid var(--border-1,rgba(128,128,128,.35));border-radius:6px;background:var(--bg-2,rgba(128,128,128,.06));color:inherit;padding:4px 6px;box-sizing:border-box;width:100%;}
.vg-nfld textarea{min-height:44px;resize:vertical;}
.vg-up-btn{background:transparent;border:1px solid var(--border-1,rgba(128,128,128,.35));border-radius:6px;color:inherit;font:inherit;font-size:12px;cursor:pointer;padding:2px 8px;flex:none;}
.vg-up-btn:hover{border-color:#2f6fed;color:#2f6fed;}
.vg-node-foot{display:flex;align-items:center;gap:6px;padding:6px 8px;border-top:1px solid var(--border-1,rgba(128,128,128,.2));font-size:11px;}
.vg-run-btn{background:var(--accent-1,#2f6fed);color:#fff;border:none;border-radius:6px;padding:4px 10px;font:inherit;font-size:11px;cursor:pointer;}
.vg-sock{position:absolute;width:12px;height:12px;border-radius:50%;border:2px solid var(--bg-1,#fff);cursor:crosshair;z-index:5;box-sizing:border-box;}
.vg-sock-out{background:#f0a020;right:-7px;}
.vg-sock-in{background:#3b9eff;left:-7px;}
.vg-sock:hover{transform:scale(1.35);}
.vg-node video{width:100%;border-radius:6px;background:#000;max-height:150px;display:block;}
.vg-node img.vg-imgout{width:100%;border-radius:6px;background:#000;max-height:150px;display:block;object-fit:cover;}
.vg-thumb{width:44px;height:30px;object-fit:cover;border-radius:5px;background:#000;flex:none;border:1px solid var(--border-1,rgba(128,128,128,.3));}
.vg-frame-row{display:flex;align-items:center;gap:6px;border:1px solid var(--border-1,rgba(128,128,128,.25));border-radius:7px;padding:5px 6px;position:relative;min-height:40px;}
.vg-status-chip{font-size:10px;border-radius:99px;padding:1px 7px;}
.vg-chip-run{background:rgba(219,171,9,.18);color:#b08800;}
.vg-chip-ok{background:rgba(46,160,67,.15);color:#2ea043;}
.vg-chip-err{background:rgba(229,72,77,.14);color:#e5484d;}
.vg-empty-hint{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:13px;opacity:.45;pointer-events:none;text-align:center;line-height:2;}
.vg-zoom-ctl{position:absolute;right:10px;bottom:10px;display:flex;gap:4px;align-items:center;}
.vg-zoom-ctl button{background:var(--bg-1,#fff);border:1px solid var(--border-1,rgba(128,128,128,.4));border-radius:6px;color:inherit;font:inherit;font-size:13px;cursor:pointer;width:26px;height:26px;line-height:1;}
.vg-notice{font-size:11px;opacity:.7;margin:6px 2px 0;min-height:14px;}
.vg-hist-strip{display:flex;gap:8px;overflow-x:auto;padding:6px 2px 2px;align-items:center;}
.vg-hist-item{position:relative;flex:none;}
.vg-hist-item video,.vg-hist-item img{width:110px;height:62px;object-fit:cover;border-radius:6px;background:#000;cursor:pointer;display:block;}
.vg-hist-del{position:absolute;top:2px;right:2px;width:18px;height:18px;line-height:1;font-size:11px;padding:0;border:none;border-radius:99px;color:#fff;background:rgba(0,0,0,.55);cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:.85;}
.vg-hist-del:hover{background:#e5484d;opacity:1;}
.vg-hist-empty{font-size:11px;opacity:.5;padding:6px 2px;}
/* 画布快照列表 */
.vg-snap-list{max-height:150px;overflow-y:auto;padding:4px 2px;display:flex;flex-direction:column;gap:6px;}
.vg-snap-item{display:flex;align-items:center;gap:8px;border:1px solid var(--border-1,rgba(128,128,128,.25));border-radius:8px;padding:6px 8px;position:relative;}
.vg-snap-item:hover{border-color:rgba(47,111,237,.5);}
/* 全屏悬浮工作室 */
.vg-overlay-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:1000;pointer-events:auto;}
.vg-overlay-card{width:min(1180px,96vw);height:92vh;display:flex;flex-direction:column;background:var(--bg-1,#fff);color:var(--text-1,#1f2328);border:1px solid var(--border-1,rgba(128,128,128,.35));border-radius:14px;box-shadow:0 24px 60px rgba(0,0,0,.35);padding:14px 16px;pointer-events:auto;}
.vg-overlay-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;gap:8px;}
.vg-overlay-close{background:transparent;border:none;color:inherit;font-size:16px;cursor:pointer;padding:4px 8px;border-radius:6px;}
.vg-overlay-close:hover{background:var(--bg-2,rgba(128,128,128,.1));}
/* 图片放大预览 */
.vg-zoomable{cursor:zoom-in;}
.vg-lightbox{position:fixed;inset:0;background:rgba(0,0,0,.82);display:flex;align-items:center;justify-content:center;z-index:1300;cursor:zoom-out;pointer-events:auto;}
.vg-lightbox img{max-width:92vw;max-height:92vh;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,.5);cursor:default;}
.vg-lb-close{position:fixed;top:16px;right:20px;background:rgba(255,255,255,.14);border:none;color:#fff;font-size:16px;width:36px;height:36px;border-radius:50%;cursor:pointer;z-index:1301;}
.vg-lb-cap{position:fixed;bottom:14px;left:0;right:0;text-align:center;color:#fff;opacity:.75;font-size:12px;z-index:1301;pointer-events:none;}
/* 应用内确认弹窗(替代浏览器原生 confirm) */
.vg-confirm-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:1600;pointer-events:auto;}
.vg-confirm-card{width:min(400px,92vw);background:var(--bg-1,#fff);color:var(--text-1,#1f2328);border:1px solid var(--border-1,rgba(128,128,128,.35));border-radius:12px;box-shadow:0 20px 50px rgba(0,0,0,.35);padding:16px 18px;pointer-events:auto;}
.vg-confirm-title{font-weight:600;font-size:14px;margin-bottom:8px;}
.vg-confirm-msg{font-size:12.5px;opacity:.9;line-height:1.8;white-space:pre-wrap;margin-bottom:16px;word-break:break-word;}
.vg-confirm-ok{background:#e5484d;color:#fff;border:none;border-radius:8px;padding:8px 16px;font:inherit;font-size:13px;cursor:pointer;}
.vg-confirm-ok:hover{background:#d93a3f;}
.vg-confirm-cancel{background:var(--bg-2,rgba(128,128,128,.05));border:1px solid var(--border-1,rgba(128,128,128,.45));border-radius:8px;color:inherit;font:inherit;font-size:13px;cursor:pointer;padding:8px 16px;}
.vg-confirm-cancel:hover{border-color:#2f6fed;color:#2f6fed;}
/* ── 侧边栏 footer.action:任何包含我们占位 wrapper 的 flex 容器强制 wrap —— ──
   footerActions(横向)变为换行后:我们的 wrapper 占一行,官方 Cordis 按钮落到第二行 → 上下两行互不挤压。
   命中的祖先(footArea / sidebar root)均为纵向 flex,wrap 无副作用。 ── */
div:has(.vidgen-foot-wrap){flex-wrap:wrap !important;align-items:stretch !important}
.vidgen-foot-wrap{flex:0 0 100% !important;width:100% !important;box-sizing:border-box;min-width:0}`
      const style = document.createElement('style')
      style.textContent = css
      document.head.appendChild(style)
      return () => style.remove()
    }

    async function rpc(name, args) {
      const res = await fetch('/dsh-vidgen/rpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, args: args || {} }),
      })
      let data = {}
      try { data = await res.json() } catch (e) {}
      if (!res.ok) throw new Error(data && data.error ? data.error : `RPC ${name} failed: HTTP ${res.status}`)
      return data
    }

    function apply(ctx) {
    ctx.effect(installStyles, 'dsh-vidgen-plugin: styles')


    // ── 全局确认弹窗 store(替代 window.confirm;返回 Promise<boolean>) ──
    const confirmStore = (() => {
      let state = null
      const listeners = new Set()
      return {
        get: () => state,
        confirm: (opts) => new Promise((resolve) => {
          state = { title: (opts && opts.title) || '确认操作', message: (opts && opts.message) || '', okText: (opts && opts.okText) || '确定删除', resolve }
          listeners.forEach((fn) => fn(state))
        }),
        answer: (ok) => {
          const s = state
          if (!s) return
          state = null
          listeners.forEach((fn) => fn(null))
          s.resolve(!!ok)
        },
        subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn) },
      }
    })()
    function ConfirmDialog() {
      const el = React.createElement
      const [state, setState] = React.useState(confirmStore.get())
      React.useEffect(() => confirmStore.subscribe(setState), [])
      if (!state) return null
      return el('div', { className: 'vg-confirm-backdrop', onClick: () => confirmStore.answer(false) }, [
        el('div', { className: 'vg-confirm-card', onClick: (e) => e.stopPropagation() }, [
          el('div', { className: 'vg-confirm-title' }, state.title),
          el('div', { className: 'vg-confirm-msg' }, state.message),
          el('div', { style: { display: 'flex', gap: 10, justifyContent: 'flex-end' } }, [
            el('button', { className: 'vg-confirm-cancel', onClick: () => confirmStore.answer(false) }, '取消'),
            el('button', { className: 'vg-confirm-ok', onClick: () => confirmStore.answer(true) }, state.okText || '确定'),
          ]),
        ]),
      ])
    }
    const askConfirm = (title, message, okText) => confirmStore.confirm({ title, message, okText })

    const openStore = (() => {
      let value = false
      const listeners = new Set()
      return {
        get: () => value,
        set: (v) => { value = v; listeners.forEach((fn) => fn(value)) },
        subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn) },
      }
    })()
    function useOpen() {
      const [v, setV] = React.useState(openStore.get())
      React.useEffect(() => openStore.subscribe(setV), [])
      return v
    }

    // ── 节点画布工作室(ComfyUI 风格:文生图/图生图·多图合成/图源/文生视频/图生视频/关键帧) ──
    const NODE_TYPES = {
      image: { title: '图源', icon: '🖼️', color: '#9d3bf0' },
      text2image: { title: '文生图', icon: '🎨', color: '#e0245e' },
      image2image: { title: '图生图/多图合成', icon: '🖌️', color: '#c026d3' },
      text2video: { title: '文生视频', icon: '📝', color: '#2f6fed' },
      image2video: { title: '图生视频', icon: '🎥', color: '#0d9f6e' },
      keyframes: { title: '关键帧', icon: '🎞️', color: '#d97706' },
    }
    const IMG_SIZES = ['2K', '1K', '1280x720', '1024x1024', '1024x768']
    const IMG_MODELS = ['agnes-image-2.1-flash', 'agnes-image-2.0-flash']
    const IMG_REF_KEYS = ['ref1', 'ref2', 'ref3', 'ref4']
    const KF_FRAME_COUNT = 3
    const DEFAULT_DATA = {
      image: { url: '' },
      text2image: { prompt: '', size: '2K', ratio: '16:9', model: '', outUrl: '' },
      image2image: { prompt: '', size: '2K', ratio: '16:9', model: '', ref1: '', ref2: '', ref3: '', ref4: '', outUrl: '' },
      text2video: { prompt: '', ratio: '16:9', resolution: '720p', duration: 5, model: '', frame_rate: 24, seed: '', steps: '', negative: '', resultUrl: '' },
      image2video: { prompt: '', ratio: '16:9', resolution: '720p', duration: 5, model: '', frame_rate: 24, seed: '', steps: '', negative: '', directUrl: '', resultUrl: '', resultSeconds: '', resultSize: '' },
      keyframes: { prompt: '', ratio: '16:9', resolution: '720p', duration: 5, model: '', frame_rate: 24, seed: '', steps: '', negative: '', resultUrl: '' },
    }

    function NodeStudio() {
      const el = React.createElement
      const [nodes, setNodes] = React.useState([])
      const [edges, setEdges] = React.useState([])
      const [pan, setPan] = React.useState({ x: 60, y: 40 })
      const [zoom, setZoom] = React.useState(1)
      const [runs, setRuns] = React.useState({})
      const [cfg, setCfg] = React.useState(null)
      const [imgCfg, setImgCfg] = React.useState(null)
      const [models, setModels] = React.useState([])
      const [history, setHistory] = React.useState([])
      const [snapshots, setSnapshots] = React.useState([])
      const [pending, setPending] = React.useState(null)
      const [selEdge, setSelEdge] = React.useState(null)
      const [selNode, setSelNode] = React.useState(null)
      const [notice, setNotice] = React.useState('')
      const [adv, setAdv] = React.useState({})
      const [zoomImg, setZoomImg] = React.useState(null)
      const canvasRef = React.useRef(null)
      const sockRefs = React.useRef({})
      const [sockPos, setSockPos] = React.useState({})
      const dragRef = React.useRef(null)
      const panRef = React.useRef(pan); panRef.current = pan
      const zoomRef = React.useRef(zoom); zoomRef.current = zoom
      // 每个节点独立序号(修复并发节点互相误判过期);实时结果表(执行链读取最新结果,修复闭包旧值)
      const seqRef = React.useRef({})
      const seqImgRef = React.useRef({})
      const liveRef = React.useRef({ outUrl: {}, resultUrl: {} })

      const isDataUrl = (u) => String(u || '').trim().indexOf('data:') === 0
      const modelOptions = models.length ? models : ['agnes-video-v2.0']
      const refreshHistory = () => {
        rpc('video-history', {}).then((r) => { if (r && Array.isArray(r.items)) setHistory(r.items) }).catch(() => {})
      }
      const refreshSnapshots = () => {
        rpc('vidgen-snapshot-list', {}).then((r) => { if (r && Array.isArray(r.items)) setSnapshots(r.items) }).catch(() => {})
      }
      const pickLocalFile = (onData) => {
        let inp = document.createElement('input')
        inp.type = 'file'
        inp.accept = 'image/*'
        inp.style.display = 'none'
        inp.onchange = () => {
          const f = inp.files && inp.files[0]
          try { document.body.removeChild(inp) } catch (e) {}
          if (!f) return
          if (f.size > 8 * 1024 * 1024) { setNotice('⚠️ 图片过大(>8MB),请压缩后再上传'); return }
          setNotice('⏳ 载入本地图片中…')
          const fr = new FileReader()
          fr.onload = () => { onData(String(fr.result || '')); setNotice('✅ 已载入本地图片') }
          fr.onerror = () => { setNotice('❌ 图片读取失败') }
          fr.readAsDataURL(f)
        }
        document.body.appendChild(inp)
        inp.click()
      }

      React.useEffect(() => {
        rpc('video-config', {}).then(setCfg).catch(() => {})
        rpc('image-config', {}).then(setImgCfg).catch(() => {})
        rpc('video-models', {}).then((r) => { if (r && Array.isArray(r.videoModels)) setModels(r.videoModels) }).catch(() => {})
        rpc('video-graph', {}).then((r) => {
          const g = r && r.graph
          if (g && Array.isArray(g.nodes) && g.nodes.length) {
            setNodes(g.nodes)
            setEdges(Array.isArray(g.edges) ? g.edges : [])
          }
        }).catch(() => {})
        refreshHistory()
        refreshSnapshots()
      }, [])

      React.useEffect(() => {
        if (nodes.length === 0 && edges.length === 0) return
        rpc('video-graph', { graph: { nodes, edges } }).catch(() => {})
      }, [nodes, edges])

      React.useLayoutEffect(() => {
        const cv = canvasRef.current
        if (!cv) return
        const cr = cv.getBoundingClientRect()
        const map = {}
        Object.keys(sockRefs.current).forEach((k) => {
          const elm = sockRefs.current[k]
          if (!elm || !elm.isConnected) return
          const r = elm.getBoundingClientRect()
          map[k] = { wx: (r.left + r.width / 2 - cr.left - pan.x) / zoom, wy: (r.top + r.height / 2 - cr.top - pan.y) / zoom }
        })
        setSockPos(map)
      }, [nodes, edges, pending, pan, zoom, runs])

      React.useEffect(() => {
        const cv = canvasRef.current
        if (!cv) return
        const onWheel = (e) => {
          e.preventDefault()
          const z0 = zoomRef.current
          const p0 = panRef.current
          const nz = Math.min(2.5, Math.max(0.35, z0 * (e.deltaY < 0 ? 1.12 : 0.89)))
          const r = cv.getBoundingClientRect()
          const ex = e.clientX - r.left
          const ey = e.clientY - r.top
          const wx = (ex - p0.x) / z0
          const wy = (ey - p0.y) / z0
          setZoom(nz)
          setPan({ x: ex - wx * nz, y: ey - wy * nz })
        }
        cv.addEventListener('wheel', onWheel, { passive: false })
        return () => cv.removeEventListener('wheel', onWheel)
      }, [])

      const clientToWorld = (cx, cy) => {
        const r = canvasRef.current.getBoundingClientRect()
        return { wx: (cx - r.left - panRef.current.x) / zoomRef.current, wy: (cy - r.top - panRef.current.y) / zoomRef.current }
      }

      const addNode = (type) => {
        const cv = canvasRef.current
        let w = 900, h = 500
        if (cv) { const r = cv.getBoundingClientRect(); w = r.width; h = r.height }
        const id = 'n' + Math.random().toString(36).slice(2, 9)
        const cx = (w / 2 - panRef.current.x) / zoomRef.current - 125
        const cy = (h / 2 - panRef.current.y) / zoomRef.current - 60 + (Math.random() * 60 - 30)
        const data = {}
        Object.keys(DEFAULT_DATA[type]).forEach((k) => { data[k] = DEFAULT_DATA[type][k] })
        setNodes((ns) => ns.concat([{ id, type, x: Math.round(cx), y: Math.round(cy), data }]))
        setNotice('已添加「' + NODE_TYPES[type].title + '」节点')
        return id
      }

      const setNodeData = (nid, key, val) => setNodes((ns) => ns.map((n) => (n.id === nid ? Object.assign({}, n, { data: Object.assign({}, n.data, { [key]: val }) }) : n)))

      const removeNode = (nid) => {
        setNodes((ns) => ns.filter((n) => n.id !== nid))
        setEdges((es) => es.filter((ed) => ed.from.nid !== nid && ed.to.nid !== nid))
        setRuns((r) => { const c = Object.assign({}, r); delete c[nid]; return c })
        delete liveRef.current.outUrl[nid]
        delete liveRef.current.resultUrl[nid]
        if (selNode === nid) setSelNode(null)
      }

      // 从历史恢复为画布节点:图片 → 图源节点;视频 → 图生视频节点(带已完成结果)
      const restoreFromHistory = (h) => {
        if (!h || !h.url) return
        const id = addNode(h.kind === 'image' ? 'image' : 'image2video')
        setNodes((ns) => ns.map((n) => {
          if (n.id !== id) return n
          const data = Object.assign({}, n.data)
          if (h.kind === 'image') data.url = h.url
          else { data.prompt = h.prompt || ''; data.resultUrl = h.url; data.resultSeconds = h.seconds || ''; data.resultSize = h.size || '' }
          return Object.assign({}, n, { data })
        }))
        setSelNode(id)
        setNotice(h.kind === 'image' ? '✅ 已从历史恢复「🖼️ 图源」节点,拖动 🟠 圆点继续连接' : '✅ 已从历史恢复「🎥 图生视频」节点(已完成的视频可直接播放;想重新生成可改提示词或连接新首帧)')
      }

      const removeHistory = async (h) => {
        if (!h) return
        const ok = await askConfirm('删除历史记录', '确定删除这条历史记录吗?\n删除后不可恢复,仅删除列表记录,不影响已生成的图片/视频文件。', '删除')
        if (!ok) return
        rpc('video-history-remove', { task_id: h.task_id || '' }).then((r) => {
          if (r && r.ok) { setNotice('🗑 已删除历史记录'); refreshHistory() }
          else setNotice('⚠️ 删除失败: ' + String((r && r.error) || '未知'))
        }).catch(() => { setNotice('⚠️ 删除历史失败') })
      }

      const clearHistory = async () => {
        const ok = await askConfirm('清空全部历史', '确定清空全部生成历史吗?\n将删除历史列表中的全部记录,不影响画布节点与已生成的图片/视频文件。\n\n此操作不可恢复。', '全部清空')
        if (!ok) return
        rpc('video-history-clear', {}).then((r) => {
          if (r && r.ok) { setNotice('🗑 已清空全部历史记录'); refreshHistory() }
          else setNotice('⚠️ 清空失败: ' + String((r && r.error) || '未知'))
        }).catch(() => { setNotice('⚠️ 清空历史失败') })
      }

      // ── 画布快照:保存 / 新建 / 恢复 / 删除 ──
      const saveSnapshotNow = async (name) => {
        await rpc('video-graph', { graph: { nodes, edges } }).catch(() => {})
        return rpc('vidgen-snapshot-save', { name: name || '' })
      }
      const saveSnapshot = async () => {
        if (!nodes.length && !edges.length) { setNotice('画布为空,无需保存快照'); return }
        const ok = await askConfirm('保存画布快照', '将当前整个画布(节点 + 连线 + 参数 + 已生成结果)保存为一份快照。\n快照可随时点击恢复,最多保留 20 份。', '保存')
        if (!ok) return
        const r = await saveSnapshotNow('手动快照 ' + new Date().toLocaleString('zh-CN', { hour12: false })).catch(() => null)
        if (r && r.ok) { setNotice('✅ 画布快照已保存'); refreshSnapshots() }
        else setNotice('⚠️ 保存失败: ' + String((r && r.error) || '未知'))
      }
      const newCanvas = async () => {
        if (!nodes.length && !edges.length) {
          setNodes([]); setEdges([]); setRuns({}); liveRef.current = { outUrl: {}, resultUrl: {} }
          setNotice('已新建空白画布')
          return
        }
        const ok = await askConfirm('新建画布', '将当前画布自动保存为一份快照,然后清空开始新的画布。\n若自动存档失败将不会清空当前画布。', '保存并新建')
        if (!ok) return
        const r = await saveSnapshotNow('新建画布前自动存档 ' + new Date().toLocaleString('zh-CN', { hour12: false })).catch(() => null)
        if (!r || !r.ok) { setNotice('⚠️ 自动存档失败,未清空画布: ' + String((r && r.error) || '未知')); return }
        refreshSnapshots()
        setNodes([]); setEdges([]); setRuns({}); setSelEdge(null); setSelNode(null); setPending(null)
        liveRef.current = { outUrl: {}, resultUrl: {} }
        rpc('video-graph', { graph: { nodes: [], edges: [] } }).catch(() => {})
        setNotice('✅ 已保存快照并新建空白画布')
      }
      const restoreSnapshot = async (it) => {
        if (!it) return
        const ok = await askConfirm('恢复画布快照', '将当前画布替换为该快照「' + (it.name || it.key) + '」。\n当前画布内容将丢失(除非先手动保存)。', '覆盖恢复')
        if (!ok) return
        const r = await rpc('vidgen-snapshot-load', { key: it.key }).catch(() => null)
        if (!r || !r.graph) { setNotice('⚠️ 恢复失败: ' + String((r && r.error) || '未知')); return }
        const g = r.graph || {}
        setNodes(Array.isArray(g.nodes) ? g.nodes : [])
        setEdges(Array.isArray(g.edges) ? g.edges : [])
        setRuns({}); setSelEdge(null); setSelNode(null); setPending(null)
        liveRef.current = { outUrl: {}, resultUrl: {} }
        rpc('video-graph', { graph: g }).catch(() => {})
        setNotice('✅ 已恢复画布快照(' + (g.nodes ? g.nodes.length : 0) + ' 节点)')
      }
      const removeSnapshot = async (it) => {
        if (!it) return
        const ok = await askConfirm('删除画布快照', '确定删除快照「' + (it.name || it.key) + '」吗?\n删除后不可恢复。', '删除')
        if (!ok) return
        rpc('vidgen-snapshot-remove', { key: it.key }).then((r) => {
          if (r && r.ok) { setNotice('🗑 已删除画布快照'); refreshSnapshots() }
          else setNotice('⚠️ 删除失败')
        }).catch(() => { setNotice('⚠️ 删除快照失败') })
      }

      const startNodeDrag = (e, nid) => {
        e.stopPropagation()
        if (e.target && e.target.closest && e.target.closest('.vg-node-x')) return
        setSelNode(nid)
        const n = nodes.find((x) => x.id === nid)
        if (!n) return
        dragRef.current = { mode: 'node', nid, sx: e.clientX, sy: e.clientY, ox: n.x, oy: n.y }
        try { e.currentTarget.setPointerCapture(e.pointerId) } catch (err) {}
      }
      const onNodeDrag = (e, nid) => {
        const d = dragRef.current
        if (!d || d.mode !== 'node' || d.nid !== nid) return
        const dz = zoomRef.current || 1
        setNodes((ns) => ns.map((n) => (n.id === nid ? Object.assign({}, n, { x: Math.round(d.ox + (e.clientX - d.sx) / dz), y: Math.round(d.oy + (e.clientY - d.sy) / dz) }) : n)))
      }
      const endNodeDrag = () => { dragRef.current = null }

      const startEdgeDrag = (e, nid) => {
        e.stopPropagation()
        const w = clientToWorld(e.clientX, e.clientY)
        dragRef.current = { mode: 'edge', from: { nid, side: 'out', name: 'image' } }
        setPending(Object.assign({ from: { nid, side: 'out', name: 'image' } }, w))
        try { e.currentTarget.setPointerCapture(e.pointerId) } catch (err) {}
      }
      const moveEdgeDrag = (e) => {
        const d = dragRef.current
        if (!d || d.mode !== 'edge') return
        setPending(Object.assign({}, pending, clientToWorld(e.clientX, e.clientY)))
      }
      const endEdgeDrag = (e) => {
        const d = dragRef.current
        if (!d || d.mode !== 'edge') return
        const t = document.elementFromPoint(e.clientX, e.clientY)
        const hit = t && t.closest ? t.closest('[data-sock-in]') : null
        if (hit) tryAddEdge(d.from, { nid: hit.getAttribute('data-nid'), side: 'in', name: hit.getAttribute('data-port') })
        dragRef.current = null
        setPending(null)
      }

      const isImgGen = (n) => !!n && (n.type === 'text2image' || n.type === 'image2image')
      const hasImgResult = (n) => {
        if (!n) return false
        if (n.type === 'image') return !!String(n.data.url || '').trim()
        if (isImgGen(n)) return !!(liveRef.current.outUrl[n.id] || String(n.data.outUrl || '').trim())
        return false
      }
      const tryAddEdge = (from, to) => {
        if (!from || !to || !to.nid || !to.name) return
        const src = nodes.find((n) => n.id === from.nid)
        const dst = nodes.find((n) => n.id === to.nid)
        if (!src || !dst) return
        if (from.nid === to.nid) { setNotice('不能连接到自身节点'); return }
        if (edges.some((ed) => ed.to.nid === to.nid && ed.to.name === to.name)) { setNotice('该输入端口已有连线'); return }
        const isImgSrc = src.type === 'image' || src.type === 'text2image' || src.type === 'image2image'
        const ok = isImgSrc && (
          (dst.type === 'image2video' && to.name === 'image') ||
          (dst.type === 'keyframes' && new RegExp('^image[1-' + KF_FRAME_COUNT + ']$').test(to.name)) ||
          (dst.type === 'image2image' && IMG_REF_KEYS.indexOf(to.name) >= 0)
        )
        if (!ok) { setNotice('⚠️ 只能:图源/文生图/图生图输出 → 图生视频/关键帧(≤' + KF_FRAME_COUNT + '张)/图生图输入'); return }
        setEdges((es) => es.concat([{ id: 'e' + Math.random().toString(36).slice(2, 9), from, to }]))
        setNotice('✅ 已连接: ' + NODE_TYPES[src.type].title + ' → ' + NODE_TYPES[dst.type].title)
        setSelEdge(null)
      }
      const removeEdge = (id) => {
        setEdges((es) => es.filter((x) => x.id !== id))
        if (selEdge === id) setSelEdge(null)
      }

      // 供执行链读取的“实时”源:优先取运行期刚写入的 liveRef,再回落节点数据
      const findSourceUrl = (node, port) => {
        const ed = edges.find((x) => x.to.nid === node.id && x.to.side === 'in' && x.to.name === port)
        if (!ed) return ''
        const src = nodes.find((n) => n.id === ed.from.nid)
        if (!src) return ''
        if (src.type === 'image') return String(src.data.url || '').trim()
        if (src.type === 'text2image' || src.type === 'image2image') return String(liveRef.current.outUrl[src.id] || src.data.outUrl || '').trim()
        return ''
      }
      const findRefUrl = (node, port) => {
        const linked = findSourceUrl(node, port)
        if (linked) return linked
        const directKey = port === 'ref1' ? 'ref1' : port === 'ref2' ? 'ref2' : port === 'ref3' ? 'ref3' : port === 'ref4' ? 'ref4' : ''
        return String(node.data[directKey] || '').trim()
      }

      const buildImageBody = (node) => {
        const b = { model: node.data.model || (imgCfg && imgCfg.model) || 'agnes-image-2.1-flash', prompt: String(node.data.prompt || '') }
        if (!String(node.data.prompt || '').trim()) return { error: '请填写生图/编辑提示词' }
        const sz = node.data.size || '2K'
        if (sz === '2K' || sz === '1K') {
          b.size = sz
          if (node.data.ratio) b.ratio = String(node.data.ratio)
        } else {
          b.size = sz
        }
        b.extra_body = { response_format: 'url' }
        if (node.type === 'image2image') {
          const imgs = []
          for (const p of IMG_REF_KEYS) {
            const u = findRefUrl(node, p)
            if (u) imgs.push(u)
          }
          if (!imgs.length) return { error: '图生图/多图合成至少需要 1 张参考图(连线、URL 或上传本地图)' }
          b.extra_body.image = imgs
        }
        return b
      }

      const resolveBody = (node) => {
        const b = { prompt: String(node.data.prompt || ''), ratio: node.data.ratio || '16:9', resolution: node.data.resolution || '720p', duration: node.data.duration || 5 }
        if (node.data.model) b.model = node.data.model
        if (node.data.frame_rate) b.frame_rate = Number(node.data.frame_rate)
        if (node.data.seed !== '' && node.data.seed !== undefined && node.data.seed !== null) b.seed = Number(node.data.seed)
        if (node.data.steps) b.steps = Number(node.data.steps)
        if (node.data.negative) b.negative_prompt = String(node.data.negative)
        if (node.type === 'image2video') {
          const u = findSourceUrl(node, 'image') || String(node.data.directUrl || '').trim()
          if (!u) return { error: '请连接图源/文生图/图生图节点或填写首帧图片 URL' }
          if (isDataUrl(u)) return { error: '本地上传图(base64)暂不支持直接做视频,请先经 🖌️ 图生图生成平台图再连接' }
          b.image_url = u
        } else if (node.type === 'keyframes') {
          const urls = []
          for (let i = 1; i <= KF_FRAME_COUNT; i++) {
            const u = findSourceUrl(node, 'image' + i)
            if (u) urls.push(u)
          }
          if (urls.length < 2) return { error: '关键帧至少需要连接 2 张图源(按 帧1→帧2... 顺序)' }
          if (urls.length > KF_FRAME_COUNT) return { error: '关键帧最多 ' + KF_FRAME_COUNT + ' 张(服务端上限),当前 ' + urls.length + ' 张' }
          if (urls.some(isDataUrl)) return { error: '关键帧暂不支持本地上传图(base64),请先经 🖌️ 图生图转出平台图再连接' }
          b.mode = 'keyframes'
          b.image_urls = urls
        }
        return b
      }

      const runImageNode = (nid) => {
        const node = nodes.find((n) => n.id === nid)
        if (!node) return null
        const body = buildImageBody(node)
        if (body.error) {
          setRuns((r) => Object.assign({}, r, { [nid]: { status: 'failed', error: body.error } }))
          setNotice('⚠️ ' + body.error)
          return null
        }
        const seq = (seqImgRef.current[nid] = (seqImgRef.current[nid] || 0) + 1)
        setRuns((r) => Object.assign({}, r, { [nid]: { status: 'running', progress: 0 } }))
        setNotice('🎨 正在生成图片(约 0.5~2 分钟,请稍候)…')
        return rpc('image-generate', body).then((r) => {
          if (seq !== seqImgRef.current[nid]) return
          if (!r || r.error) {
            setRuns((rr) => Object.assign({}, rr, { [nid]: { status: 'failed', error: String((r && r.error) || '生图失败') } }))
            return
          }
          liveRef.current.outUrl[nid] = r.url
          setRuns((rr) => Object.assign({}, rr, { [nid]: { status: 'completed', url: r.url } }))
          setNodeData(nid, 'outUrl', r.url)
          setNotice('✅ 图片已生成,拖右侧 🟠 圆点继续连接')
          refreshHistory()
        }).catch((e) => {
          if (seq === seqImgRef.current[nid]) setRuns((rr) => Object.assign({}, rr, { [nid]: { status: 'failed', error: String((e && e.message) || e) } }))
        })
      }

      const runNode = (nid) => {
        const node = nodes.find((n) => n.id === nid)
        if (!node) return
        const body = resolveBody(node)
        if (body.error) {
          setRuns((r) => Object.assign({}, r, { [nid]: { status: 'failed', error: body.error } }))
          setNotice('⚠️ ' + body.error)
          return
        }
        const seq = (seqRef.current[nid] = (seqRef.current[nid] || 0) + 1)
        setRuns((r) => Object.assign({}, r, { [nid]: { status: 'running', progress: 0 } }))
        setNotice('⚡ 已提交: ' + NODE_TYPES[node.type].title)
        rpc('video-generate', body).then((r) => {
          if (seq !== seqRef.current[nid]) return
          if (!r || r.error) {
            setRuns((rr) => Object.assign({}, rr, { [nid]: { status: 'failed', error: String((r && r.error) || '创建任务失败') } }))
            return
          }
          const id = r.task_id || r.video_id || ''
          // 轮询:8 秒基准,若失败(429 限流等)自动退避翻倍,上限 30 秒,成功后回落
          let pollMs = 8000
          const tick = () => {
            rpc('video-poll', { id }).then((p) => {
              if (seq !== seqRef.current[nid]) return
              if (!p) return
              if (p.error) { setRuns((rr) => Object.assign({}, rr, { [nid]: { status: 'failed', error: String(p.error) } })); return }
              const st = p.status || 'pending'
              if (st === 'completed') {
                liveRef.current.resultUrl[nid] = p.url || ''
                setRuns((rr) => Object.assign({}, rr, { [nid]: { status: 'completed', url: p.url || '', seconds: p.seconds || '', size: p.size || '', task_id: id } }))
                // 把生成的视频结果写进节点数据 → 随画布一起持久化,重开后节点上仍显示结果
                setNodeData(nid, 'resultUrl', p.url || '')
                if (p.seconds) setNodeData(nid, 'resultSeconds', p.seconds)
                if (p.size) setNodeData(nid, 'resultSize', p.size)
                refreshHistory()
              } else if (st === 'failed') {
                setRuns((rr) => Object.assign({}, rr, { [nid]: { status: 'failed', error: String(p.error || '生成失败') } }))
              } else {
                setRuns((rr) => Object.assign({}, rr, { [nid]: { status: 'running', progress: p.progress || 0, task_id: id } }))
                if (pollMs > 8000) pollMs = Math.max(8000, Math.round(pollMs / 2))
                setTimeout(tick, pollMs)
              }
            }).catch(() => {
              if (seq !== seqRef.current[nid]) return
              pollMs = Math.min(30000, pollMs * 2)
              setTimeout(tick, pollMs)
            })
          }
          tick()
        }).catch((e) => {
          if (seq === seqRef.current[nid]) setRuns((rr) => Object.assign({}, rr, { [nid]: { status: 'failed', error: String((e && e.message) || e) } }))
        })
      }

      // ── 级联:确保 nid 的整个图片上游链都有结果;缺结果的按依赖层并行补齐,已有结果的跳过 ──
      const ensureAncestors = async (nid) => {
        const need = []
        const visited = {}
        const collect = (id) => {
          if (visited[id]) return
          visited[id] = true
          const node = nodes.find((n) => n.id === id)
          if (!node) return
          edges.forEach((ed) => { if (ed.to.nid === id) collect(ed.from.nid) })
          if (isImgGen(node)) need.push(node)
        }
        collect(nid)
        if (!need.length) return
        const layer = {}
        const calc = (node) => {
          if (layer[node.id] !== undefined) return layer[node.id]
          let m = -1
          edges.forEach((ed) => {
            if (ed.to.nid !== node.id) return
            const src = nodes.find((n) => n.id === ed.from.nid)
            if (src && isImgGen(src)) m = Math.max(m, calc(src))
          })
          layer[node.id] = m + 1
          return m + 1
        }
        need.forEach(calc)
        const maxL = Math.max.apply(null, need.map((n) => layer[n.id]))
        for (let l = 0; l <= maxL; l++) {
          const batch = need.filter((n) => layer[n.id] === l && !hasImgResult(n))
          if (batch.length) {
            setNotice('🔄 自动补跑前序节点(第 ' + (l + 1) + '/' + (maxL + 1) + ' 层,' + batch.length + ' 个,已有结果的已跳过)…')
            await Promise.all(batch.map((n) => runImageNode(n.id)))
          }
        }
      }
      // 节点「⚡ 运行」按钮:图片或视频节点都先确保上游图片链有结果,再运行自身
      const handleRunNode = async (nid) => {
        const node = nodes.find((n) => n.id === nid)
        if (!node) return
        if (node.type === 'image') { setNotice('🖼️ 图源节点无需运行,直接用于连线'); return }
        await ensureAncestors(nid)
        if (isImgGen(node)) runImageNode(nid)
        else runNode(nid)
      }

      const runAll = async () => {
        const imgNodes = nodes.filter(isImgGen)
        const vids = nodes.filter((n) => n.type === 'text2video' || n.type === 'image2video' || n.type === 'keyframes')
        if (imgNodes.length) {
          setNotice('🎨 ' + imgNodes.length + ' 个图片节点按依赖顺序生成中…')
          const layer = {}
          const calc = (nid) => {
            if (layer[nid] !== undefined) return layer[nid]
            const node = nodes.find((n) => n.id === nid)
            if (!isImgGen(node)) return -1
            let depMax = -1
            for (const p of (node.type === 'image2image' ? IMG_REF_KEYS : [])) {
              const ed = edges.find((x) => x.to.nid === nid && x.to.side === 'in' && x.to.name === p)
              if (ed) depMax = Math.max(depMax, calc(ed.from.nid))
            }
            layer[nid] = depMax + 1
            return layer[nid]
          }
          imgNodes.forEach((n) => calc(n.id))
          const maxL = Math.max.apply(null, imgNodes.map((n) => layer[n.id]))
          for (let l = 0; l <= maxL; l++) {
            const batch = imgNodes.filter((n) => layer[n.id] === l)
            if (batch.length) await Promise.all(batch.map((n) => runImageNode(n.id)))
          }
        }
        vids.forEach((n) => runNode(n.id))
        setNotice('⚡ 已运行 ' + imgNodes.length + ' 个图片 + ' + vids.length + ' 个视频节点')
      }
      const clearAll = async () => {
        const ok = await askConfirm('清空画布', '确定清空整个画布吗?\n将删除画布上所有节点与连线(画布状态也会被清除),不可恢复。\n如需保留请先「📸 保存快照」。', '清空画布')
        if (!ok) return
        setNodes([]); setEdges([]); setRuns({}); setSelEdge(null); setSelNode(null); setPending(null)
        liveRef.current = { outUrl: {}, resultUrl: {} }
        rpc('video-graph', { graph: { nodes: [], edges: [] } }).catch(() => {})
        setNotice('画布已清空')
      }

      const sockKey = (nid, side, name) => nid + ':' + side + ':' + name
      const sockRef = (nid, side, name) => (elm) => {
        const k = sockKey(nid, side, name)
        if (elm) sockRefs.current[k] = elm
        else delete sockRefs.current[k]
      }

      const edgePath = (a, b) => {
        const dx = Math.max(30, Math.abs(b.wx - a.wx) / 2)
        return 'M' + a.wx + ',' + a.wy + ' C' + (a.wx + dx) + ',' + a.wy + ' ' + (b.wx - dx) + ',' + b.wy + ' ' + b.wx + ',' + b.wy
      }

      const refRow = (n, p, label, visible) => {
        if (!visible) return null
        const u = findRefUrl(n, p)
        const directKey = p === 'ref1' ? 'ref1' : p === 'ref2' ? 'ref2' : p === 'ref3' ? 'ref3' : p === 'ref4' ? 'ref4' : ''
        return el('div', { className: 'vg-frame-row' }, [
          el('span', { 'data-sock-in': '', 'data-nid': n.id, 'data-port': p, ref: sockRef(n.id, 'in', p), className: 'vg-sock vg-sock-in' }),
          el('span', { style: { fontSize: 10, opacity: .6, width: 30 } }, label),
          u ? el('img', { className: 'vg-thumb vg-zoomable', src: u, onClick: (e) => { e.stopPropagation(); setZoomImg(u) } }) : el('div', { style: { flex: 1, display: 'flex', gap: 4, minWidth: 0, alignItems: 'center' } }, [
            el('input', { type: 'text', placeholder: label + ' URL / 上传', value: n.data[directKey] || '', onChange: (e) => setNodeData(n.id, directKey, e.target.value), style: { flex: 1, font: 'inherit', fontSize: 11, border: '1px solid var(--border-1,rgba(128,128,128,.35))', borderRadius: 5, background: 'var(--bg-2,rgba(128,128,128,.06))', color: 'inherit', padding: '2px 5px', minWidth: 0 } }),
            el('button', { className: 'vg-up-btn', title: '上传本地图片', onClick: (e) => { e.stopPropagation(); pickLocalFile((v) => setNodeData(n.id, directKey, v)) } }, '📁'),
          ]),
        ])
      }

      const renderNode = (n) => {
        const t = NODE_TYPES[n.type]
        const run = runs[n.id]
        const body = []
        if (n.type === 'image') {
          const isLocal = isDataUrl(n.data.url)
          body.push(el('div', { className: 'vg-nfld' }, [
            el('label', null, '图片 URL(或上传本地)'),
            el('div', { style: { display: 'flex', gap: 4 } }, [
              el('input', { type: 'text', style: { flex: 1, minWidth: 0 }, placeholder: 'https://... 或点 📁 上传', value: n.data.url || '', onChange: (e) => setNodeData(n.id, 'url', e.target.value) }),
              el('button', { className: 'vg-up-btn', title: '上传本地图片', onClick: (e) => { e.stopPropagation(); pickLocalFile((v) => setNodeData(n.id, 'url', v)) } }, '📁'),
            ]),
          ]))
          if (n.data.url) body.push(el('img', { className: 'vg-zoomable', src: n.data.url, style: { width: '100%', maxHeight: 130, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-1,rgba(128,128,128,.3))' }, onError: (e) => { e.currentTarget.style.opacity = .35 }, onClick: (e) => { e.stopPropagation(); setZoomImg(n.data.url) } }))
          body.push(el('div', { style: { fontSize: 10, opacity: .55, lineHeight: 1.5 } }, n.data.url
            ? (isLocal ? '本地图可用于 🖌️ 图生图/多图合成;连视频请先经图生图转平台图' : '拖右侧 🟠 圆点连接到「图生视频 / 关键帧 / 图生图」输入·点击图片放大')
            : '拖右侧 🟠 圆点连接到「图生视频 / 关键帧 / 图生图」输入。当前未填图片,连线后也无法生成'))
        } else if (n.type === 'text2image' || n.type === 'image2image') {
          const is2i = n.type === 'image2image'
          if (is2i) {
            IMG_REF_KEYS.forEach((p, i) => body.push(refRow(n, p, '参考' + (i + 1), true)))
            body.push(el('div', { style: { fontSize: 10, opacity: .6, lineHeight: 1.4 } }, '1 张参考 = 图生图改造;2+ 张 = 多图合成(已实测 2/3/4 张)·支持上传本地图'))
          }
          body.push(el('div', { className: 'vg-nfld' }, [el('label', null, is2i ? '编辑/合成提示词' : '生图提示词'), el('textarea', { placeholder: is2i ? '描述期望的编辑/合成效果...' : '主体 + 场景 + 风格 + 光照 + 构图…', value: n.data.prompt || '', onChange: (e) => setNodeData(n.id, 'prompt', e.target.value) })]))
          body.push(el('div', { style: { display: 'flex', gap: 6 } }, [
            el('div', { className: 'vg-nfld', style: { flex: 1 } }, [el('label', null, '尺寸'), el('select', { value: n.data.size || '2K', onChange: (e) => setNodeData(n.id, 'size', e.target.value) }, IMG_SIZES.map((v) => el('option', { key: v, value: v }, v)))]),
            el('div', { className: 'vg-nfld', style: { flex: 1 } }, [el('label', null, '宽高比'), el('select', { value: n.data.ratio || '16:9', onChange: (e) => setNodeData(n.id, 'ratio', e.target.value) }, (cfg && cfg.ratios || ['16:9', '9:16', '1:1', '4:3', '3:4']).map((v) => el('option', { key: v, value: v }, v)))]),
          ]))
          const showAdv = !!adv[n.id]
          body.push(el('div', { className: 'vg-nfld' }, [el('button', { style: { background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 11, opacity: .6, textAlign: 'left', padding: 0 }, onClick: () => setAdv((a) => Object.assign({}, a, { [n.id]: !showAdv })) }, showAdv ? '▾ 收起高级参数' : '▸ 高级参数(模型)')]))
          if (showAdv) {
            body.push(el('div', { className: 'vg-nfld' }, [el('label', null, '模型'), el('select', { value: n.data.model || '', onChange: (e) => setNodeData(n.id, 'model', e.target.value) }, [el('option', { key: '', value: '' }, '默认 ' + ((imgCfg && imgCfg.model) || 'agnes-image-2.1-flash'))].concat(IMG_MODELS.concat((imgCfg && imgCfg.model) ? [imgCfg.model] : []).filter((m, i, a) => a.indexOf(m) === i).map((m) => el('option', { key: m, value: m }, m))))]))
          }
          body.push(el('div', { className: 'vg-node-foot' }, [
            el('button', { className: 'vg-run-btn', onClick: () => handleRunNode(n.id) }, '🎨 生成'),
            run ? (run.status === 'completed' ? el('span', { className: 'vg-status-chip vg-chip-ok' }, '✅ 已生成') : run.status === 'failed' ? el('span', { className: 'vg-status-chip vg-chip-err', title: run.error || '' }, '❌ 失败') : el('span', { className: 'vg-status-chip vg-chip-run' }, '⏳ 生成中')) : (n.data.outUrl ? el('span', { className: 'vg-status-chip vg-chip-ok' }, '✅ 已有结果') : null),
          ]))
          // 恢复后 run 为空:回落到节点数据里的生成结果
          const imgOutUrl = (run && run.status === 'completed' && run.url) ? run.url : ((run && run.status === 'running') ? '' : (liveRef.current.outUrl[n.id] || n.data.outUrl || ''))
          if (imgOutUrl) body.push(el('img', { className: 'vg-imgout vg-zoomable', src: imgOutUrl, onError: (e) => { e.currentTarget.style.opacity = .35 }, onClick: (e) => { e.stopPropagation(); setZoomImg(imgOutUrl) } }))
          if (run && run.status === 'failed') body.push(el('div', { style: { fontSize: 10, color: '#e5484d', wordBreak: 'break-all' } }, String(run.error || '').slice(0, 160)))
          body.push(el('div', { style: { fontSize: 10, opacity: .55, lineHeight: 1.5 } }, '生成后拖右侧 🟠 圆点连接「图生视频 / 关键帧 / 另一个图生图」·点击图片放大'))
        } else {
          if (n.type === 'image2video') {
            const srcUrl = findSourceUrl(n, 'image')
            body.push(el('div', { className: 'vg-frame-row' }, [
              el('span', { 'data-sock-in': '', 'data-nid': n.id, 'data-port': 'image', ref: sockRef(n.id, 'in', 'image'), className: 'vg-sock vg-sock-in', style: { left: -7, top: '50%', marginTop: -6 } }),
              el('span', { style: { fontSize: 10, opacity: .6, width: 34 } }, '首帧'),
              srcUrl ? el('img', { className: 'vg-thumb vg-zoomable', src: srcUrl, onClick: (e) => { e.stopPropagation(); setZoomImg(srcUrl) } }) : el('span', { style: { fontSize: 10, opacity: .45 } }, '未连接图源/生图'),
            ]))
            if (!srcUrl) body.push(el('div', { className: 'vg-nfld' }, [el('label', null, '或直接填首帧 URL'), el('input', { type: 'text', placeholder: 'https://...', value: n.data.directUrl || '', onChange: (e) => setNodeData(n.id, 'directUrl', e.target.value) })]))
          } else if (n.type === 'keyframes') {
            for (let i = 1; i <= KF_FRAME_COUNT; i++) {
              const u = findSourceUrl(n, 'image' + i)
              body.push(el('div', { className: 'vg-frame-row' }, [
                el('span', { 'data-sock-in': '', 'data-nid': n.id, 'data-port': 'image' + i, ref: sockRef(n.id, 'in', 'image' + i), className: 'vg-sock vg-sock-in' }),
                el('span', { style: { fontSize: 10, opacity: .6, width: 30 } }, '帧' + i),
                u ? el('img', { className: 'vg-thumb vg-zoomable', src: u, onClick: (e) => { e.stopPropagation(); setZoomImg(u) } }) : el('span', { style: { fontSize: 10, opacity: .45 } }, '未连接'),
              ]))
            }
            body.push(el('div', { style: { fontSize: 10, opacity: .55, lineHeight: 1.4 } }, '服务端上限: 2~' + KF_FRAME_COUNT + ' 张(实测 ' + KF_FRAME_COUNT + ' 张可出片)·点击帧图放大'))
          }
          body.push(el('div', { className: 'vg-nfld' }, [el('label', null, '提示词'), el('textarea', { placeholder: '视频内容描述(英文更佳)...', value: n.data.prompt || '', onChange: (e) => setNodeData(n.id, 'prompt', e.target.value) })]))
          body.push(el('div', { style: { display: 'flex', gap: 6 } }, [
            el('div', { className: 'vg-nfld', style: { flex: 1 } }, [el('label', null, '宽高比'), el('select', { value: n.data.ratio || '16:9', onChange: (e) => setNodeData(n.id, 'ratio', e.target.value) }, (cfg && cfg.ratios || ['16:9', '9:16', '1:1', '4:3', '3:4']).map((v) => el('option', { key: v, value: v }, v)))]),
            el('div', { className: 'vg-nfld', style: { flex: 1 } }, [el('label', null, '分辨率'), el('select', { value: n.data.resolution || '720p', onChange: (e) => setNodeData(n.id, 'resolution', e.target.value) }, (cfg && cfg.resolutions || ['480p', '720p', '1080p']).map((v) => el('option', { key: v, value: v }, v)))]),
            el('div', { className: 'vg-nfld', style: { flex: 1 } }, [el('label', null, '时长'), el('select', { value: String(n.data.duration || 5), onChange: (e) => setNodeData(n.id, 'duration', Number(e.target.value)) }, (cfg && cfg.durations || [3, 5, 10, 18]).map((v) => el('option', { key: v, value: String(v) }, v + '秒')))]),
          ]))
          const showAdv = !!adv[n.id]
          body.push(el('div', { className: 'vg-nfld' }, [el('button', { style: { background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 11, opacity: .6, textAlign: 'left', padding: 0 }, onClick: () => setAdv((a) => Object.assign({}, a, { [n.id]: !showAdv })) }, showAdv ? '▾ 收起高级参数' : '▸ 高级参数(模型/帧率/种子/步数/反向)')]))
          if (showAdv) {
            body.push(el('div', { className: 'vg-nfld' }, [el('label', null, '模型'), el('select', { value: n.data.model || '', onChange: (e) => setNodeData(n.id, 'model', e.target.value) }, [el('option', { key: '', value: '' }, '默认 ' + ((cfg && cfg.model) || 'agnes-video-v2.0'))].concat(modelOptions.map((m) => el('option', { key: m, value: m }, m))))]))
            body.push(el('div', { style: { display: 'flex', gap: 6 } }, [
              el('div', { className: 'vg-nfld', style: { flex: 1 } }, [el('label', null, '帧率'), el('input', { type: 'number', min: 1, max: 60, value: String(n.data.frame_rate || 24), onChange: (e) => setNodeData(n.id, 'frame_rate', Number(e.target.value)) })]),
              el('div', { className: 'vg-nfld', style: { flex: 1 } }, [el('label', null, '种子'), el('input', { type: 'number', placeholder: '随机', value: n.data.seed || '', onChange: (e) => setNodeData(n.id, 'seed', e.target.value) })]),
            ]))
            body.push(el('div', { className: 'vg-nfld' }, [el('label', null, '推理步数 (num_inference_steps)'), el('input', { type: 'number', placeholder: '默认', value: n.data.steps || '', onChange: (e) => setNodeData(n.id, 'steps', e.target.value) })]))
            body.push(el('div', { className: 'vg-nfld' }, [el('label', null, '反向提示词'), el('input', { type: 'text', placeholder: '避免的内容...', value: n.data.negative || '', onChange: (e) => setNodeData(n.id, 'negative', e.target.value) })]))
          }
          // 恢复后 run 可能为空:回落到节点数据里的视频结果(resultUrl)
          const vidUrl = (run && run.status === 'completed' && run.url) ? run.url : ((run && run.status === 'running') ? '' : (liveRef.current.resultUrl[n.id] || n.data.resultUrl || ''))
          const vidSecs = (run && run.status === 'completed') ? (run.seconds || '') : (n.data.resultSeconds || '')
          const vidSize = (run && run.status === 'completed') ? (run.size || '') : (n.data.resultSize || '')
          body.push(el('div', { className: 'vg-node-foot' }, [
            el('button', { className: 'vg-run-btn', onClick: () => handleRunNode(n.id) }, '⚡ 运行'),
            run ? (run.status === 'completed' ? el('span', { className: 'vg-status-chip vg-chip-ok' }, '✅ ' + vidSecs + 's ' + vidSize) : run.status === 'failed' ? el('span', { className: 'vg-status-chip vg-chip-err', title: run.error || '' }, '❌ 失败') : el('span', { className: 'vg-status-chip vg-chip-run' }, '⏳ ' + (run.progress || 0) + '%')) : (vidUrl ? el('span', { className: 'vg-status-chip vg-chip-ok' }, '✅ 已有结果') : null),
          ]))
          if (vidUrl) body.push(el('video', { controls: true, src: vidUrl, autoPlay: false }))
          if (run && run.status === 'failed') body.push(el('div', { style: { fontSize: 10, color: '#e5484d', wordBreak: 'break-all' } }, String(run.error || '').slice(0, 160)))
        }
        return el('div', { className: 'vg-node' + (selNode === n.id ? ' sel' : ''), style: { left: n.x, top: n.y }, key: n.id }, [
          el('div', { className: 'vg-node-head', style: { borderLeft: '4px solid ' + t.color }, onPointerDown: (e) => startNodeDrag(e, n.id), onPointerMove: (e) => onNodeDrag(e, n.id), onPointerUp: endNodeDrag }, [
            el('span', null, t.icon),
            el('span', { style: { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, t.title),
            el('button', { className: 'vg-node-x', title: '删除节点', onPointerDown: (e) => e.stopPropagation(), onClick: (e) => { e.stopPropagation(); removeNode(n.id) } }, '✕'),
          ]),
          el('div', { className: 'vg-node-body' }, body),
          el('span', { 'data-sock-out': '', 'data-nid': n.id, ref: sockRef(n.id, 'out', 'image'), className: 'vg-sock vg-sock-out', onPointerDown: (e) => startEdgeDrag(e, n.id), onPointerMove: moveEdgeDrag, onPointerUp: endEdgeDrag }),
        ])
      }

      const canvasDown = (e) => {
        if (e.target !== canvasRef.current) return
        dragRef.current = { mode: 'pan', sx: e.clientX, sy: e.clientY, px: panRef.current.x, py: panRef.current.y }
        try { canvasRef.current.setPointerCapture(e.pointerId) } catch (err) {}
        setSelEdge(null); setSelNode(null)
      }
      const canvasMove = (e) => {
        const d = dragRef.current
        if (!d || d.mode !== 'pan') return
        setPan({ x: d.px + (e.clientX - d.sx), y: d.py + (e.clientY - d.sy) })
      }
      const canvasUp = () => { dragRef.current = null }

      const edgeEls = edges.map((ed) => {
        const a = sockPos[sockKey(ed.from.nid, 'out', ed.from.name)]
        const b = sockPos[sockKey(ed.to.nid, 'in', ed.to.name)]
        if (!a || !b) return null
        const d = edgePath(a, b)
        return el('g', { key: ed.id }, [
          el('path', { d, fill: 'none', stroke: selEdge === ed.id ? '#2f6fed' : 'rgba(128,128,128,.6)', strokeWidth: selEdge === ed.id ? 2.5 : 1.6, vectorEffect: 'non-scaling-stroke' }),
          el('path', { d, fill: 'none', stroke: 'transparent', strokeWidth: 14, style: { cursor: 'pointer' }, pointerEvents: 'stroke', onClick: (ev) => { ev.stopPropagation(); setSelEdge(selEdge === ed.id ? null : ed.id) }, onDoubleClick: (ev) => { ev.stopPropagation(); removeEdge(ed.id) } }),
        ])
      })
      let pendPath = null
      if (pending && sockPos[sockKey(pending.from.nid, 'out', pending.from.name)]) {
        const a = sockPos[sockKey(pending.from.nid, 'out', pending.from.name)]
        pendPath = el('path', { d: edgePath(a, { wx: pending.wx, wy: pending.wy }), fill: 'none', stroke: '#2f6fed', strokeWidth: 1.8, strokeDasharray: '6 4', vectorEffect: 'non-scaling-stroke' })
      }

      const canvas = el('div', { className: 'vg-canvas-wrap', ref: canvasRef, onPointerDown: canvasDown, onPointerMove: canvasMove, onPointerUp: canvasUp }, [
        nodes.length === 0 ? el('div', { className: 'vg-empty-hint' }, '空画布\n点击上方「+ 添加节点」开始创作\n🎨 文生图 → 🖌️ 图生图/多图合成 → 🎥 图生 / 🎞️ 关键帧(2~' + KF_FRAME_COUNT + ' 张),一条链直接出视频') : null,
        el('div', { className: 'vg-world', style: { transform: 'translate(' + pan.x + 'px,' + pan.y + 'px) scale(' + zoom + ')' } }, [
          el('svg', { style: { position: 'absolute', left: 0, top: 0, width: 2, height: 2, overflow: 'visible', pointerEvents: 'none' } }, [pendPath].concat(edgeEls)),
          nodes.map(renderNode),
        ]),
        el('div', { className: 'vg-zoom-ctl' }, [
          el('button', { onClick: (e) => { e.stopPropagation(); setZoom(Math.min(2.5, zoom * 1.2)) } }, '+'),
          el('button', { onClick: (e) => { e.stopPropagation(); setZoom(Math.max(0.35, zoom / 1.2)) } }, '−'),
          el('button', { onClick: (e) => { e.stopPropagation(); setZoom(1); setPan({ x: 60, y: 40 }) } }, '⤢'),
        ]),
      ])

      const header = el('div', { className: 'vg-canvas-head' }, [
        el('button', { className: 'vg-pal-btn', onClick: () => addNode('text2image') }, '🎨 + 文生图'),
        el('button', { className: 'vg-pal-btn', onClick: () => addNode('image2image') }, '🖌️ + 图生图'),
        el('button', { className: 'vg-pal-btn', onClick: () => addNode('image') }, '🖼️ + 图源'),
        el('button', { className: 'vg-pal-btn', onClick: () => addNode('text2video') }, '📝 + 文生视频'),
        el('button', { className: 'vg-pal-btn', onClick: () => addNode('image2video') }, '🎥 + 图生视频'),
        el('button', { className: 'vg-pal-btn', onClick: () => addNode('keyframes') }, '🎞️ + 关键帧'),
        el('span', { style: { flex: 1 } }),
        selEdge ? el('button', { className: 'vg-pal-btn', onClick: () => removeEdge(selEdge) }, '🗑 删除连线') : null,
        el('button', { className: 'vg-pal-btn', onClick: saveSnapshot }, '📸 保存快照'),
        el('button', { className: 'vg-pal-btn', onClick: newCanvas }, '➕ 新建画布'),
        el('button', { className: 'vg-pal-btn', onClick: runAll }, '⚡ 运行全部'),
        el('button', { className: 'vg-pal-btn', onClick: clearAll }, '🗑 清空画布'),
      ])

      // 历史条渲染:点击恢复素材为画布节点;右上角 ✕ 删除;顶部右侧「清空历史」
      const hist = history.slice(0, 8).map((h) => {
        const hasResult = !!(h.url && (h.status === 'completed' || h.kind === 'image'))
        const body = hasResult
          ? (h.kind === 'image'
            ? el('img', { src: h.url, alt: '历史图片', title: '点击恢复为画布节点', onClick: (e) => { e.stopPropagation(); restoreFromHistory(h) } })
            : el('video', { src: h.url, preload: 'metadata', muted: true, playsInline: true, title: '点击恢复为画布节点', onClick: (e) => { e.stopPropagation(); restoreFromHistory(h) } }))
          : el('span', { style: { width: 110, height: 62, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, background: 'var(--bg-2,rgba(128,128,128,.06))', borderRadius: 6 } }, '⏳')
        return el('div', { key: h.task_id + h.ts, className: 'vg-hist-item' }, [
          body,
          el('button', { className: 'vg-hist-del', title: '删除该条历史', onClick: (e) => { e.stopPropagation(); removeHistory(h) } }, '✕'),
        ])
      })

      // 画布快照列表:点击恢复整幅画布(覆盖带确认);✕ 删除
      const snapList = snapshots.map((it) => el('div', { key: it.key, className: 'vg-snap-item' }, [
        it.thumb ? el('img', { className: 'vg-thumb', src: it.thumb, onError: (e) => { e.currentTarget.style.display = 'none' } }) : el('span', { style: { width: 44, height: 30, flex: 'none', background: 'var(--bg-2,rgba(128,128,128,.08))', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 } }, '📄'),
        el('div', { style: { flex: 1, minWidth: 0, cursor: 'pointer' }, onClick: () => restoreSnapshot(it) }, [
          el('div', { style: { fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, it.name || it.key),
          el('div', { style: { fontSize: 10, opacity: .55 } }, new Date(it.ts).toLocaleString('zh-CN', { hour12: false }) + ' · ' + it.nodes + ' 节点 / ' + it.edges + ' 连线'),
        ]),
        el('button', { className: 'vg-hist-del', title: '删除该快照', onClick: (e) => { e.stopPropagation(); removeSnapshot(it) } }, '✕'),
      ]))

      let lightbox = null
      if (zoomImg) {
        lightbox = el('div', { className: 'vg-lightbox', onClick: () => setZoomImg(null) }, [
          el('button', { className: 'vg-lb-close', onClick: (e) => { e.stopPropagation(); setZoomImg(null) } }, '✕'),
          el('img', { src: zoomImg, onClick: (e) => e.stopPropagation() }),
          el('div', { className: 'vg-lb-cap' }, '点击空白处或 ✕ 关闭'),
        ])
      }

      return [
        el('div', { className: 'vg-title' }, '🎬 AI 视频生成 · 节点画布'),
        (((cfg && !cfg.configured) || (imgCfg && !imgCfg.configured)) ? el('div', { className: 'vg-warn' }, '⚠️ ' + ((cfg && imgCfg && !cfg.configured && !imgCfg.configured) ? '视频与图片 API 均未配置' : (cfg && !cfg.configured) ? '未配置视频 API' : '未配置图片 API') + '。请到 设置 → 视频生成 中填写并选择提供者。') : null),
        header,
        canvas,
        el('div', { className: 'vg-notice' }, notice),
        // 区块1:结果素材历史(单条图片/视频,可跨画布复用)
        el('div', { style: { borderTop: '1px solid var(--border-1,rgba(128,128,128,.2))', marginTop: 4 } }, [
          el('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 } }, [
            el('span', { className: 'vg-hist-empty' }, '📼 生成历史(自动保留最近 12 条,跨重启)· 点缩略图恢复素材节点,✕ 删单条'),
            el('button', { className: 'vg-sec-btn', style: { padding: '3px 10px', fontSize: 11 }, disabled: history.length === 0, onClick: clearHistory }, '🗑 清空历史'),
          ]),
          history.length === 0
            ? el('span', { className: 'vg-hist-empty' }, '暂无,生成后自动出现在这里')
            : el('div', { className: 'vg-hist-strip' }, hist),
        ]),
        // 区块2:画布快照历史(整幅画布,点击恢复)
        el('div', { style: { borderTop: '1px solid var(--border-1,rgba(128,128,128,.2))', marginTop: 4 } }, [
          el('span', { className: 'vg-hist-empty' }, '🖼️ 画布快照(整幅画布:节点/连线/结果·保留 20 份·点条目恢复,✕ 删除)'),
          snapshots.length === 0
            ? el('span', { className: 'vg-hist-empty' }, '暂无快照。点上方「📸 保存快照」或「➕ 新建画布」时自动生成')
            : el('div', { className: 'vg-snap-list' }, snapList),
        ]),
        lightbox,
        ConfirmDialog(),
      ]
    }

    // ── 设置页:视频 / 图片 各一套多提供者配置(管理提供者 + 获取模型) ──
    function VideoConfig() {
      const el = React.createElement
      const [vCfg, setVCfg] = React.useState(null)
      const [iCfg, setICfg] = React.useState(null)
      const [vEdit, setVEdit] = React.useState({ id: '', name: '', apiUrl: '', apiKey: '', model: '' })
      const [iEdit, setIEdit] = React.useState({ id: '', name: '', apiUrl: '', apiKey: '', model: '' })
      const [vModels, setVModels] = React.useState([])
      const [iModels, setIModels] = React.useState([])
      const [msg, setMsg] = React.useState('')
      const [err, setErr] = React.useState('')
      const [busy, setBusy] = React.useState('')
      const blank = { id: '', name: '', apiUrl: '', apiKey: '', model: '' }
      const provToEdit = (c) => {
        const a = (c && c.providers && c.providers.find((p) => p.id === c.activeId)) || (c && c.providers && c.providers[0]) || null
        return a ? { id: a.id || '', name: a.name || '', apiUrl: a.apiUrl || '', apiKey: '', model: a.model || '' } : Object.assign({}, blank)
      }
      const refresh = (preserveEdit) => {
        rpc('video-config', {}).then((c) => { if (c) { setVCfg(c); if (!preserveEdit) setVEdit(provToEdit(c)) } }).catch(() => {})
        rpc('image-config', {}).then((c) => { if (c) { setICfg(c); if (!preserveEdit) setIEdit(provToEdit(c)) } }).catch(() => {})
      }
      React.useEffect(() => { refresh(false) }, [])
      const complain = (e) => setErr('❌ ' + String((e && e.message) || e))
      const onSave = (kind) => {
        const e = kind === 'video' ? vEdit : iEdit
        if (!String(e.name).trim() && !String(e.apiUrl).trim() && !String(e.apiKey).trim()) { setErr((kind === 'video' ? '视频' : '图片') + ':请先填写名称与 API 信息'); return }
        setBusy('save'); setErr(''); setMsg('')
        rpc(kind === 'video' ? 'video-config-save' : 'image-config-save', { provider: e }).then((r) => {
          setBusy('')
          if (r && r.ok) { setMsg((kind === 'video' ? '✅ 视频' : '✅ 图片') + '提供者已保存并设为当前 ⭐'); refresh(true) }
          else setErr('❌ ' + String((r && r.error) || '保存失败'))
        }).catch(complain)
      }
      const onSetCurrent = (kind, id) => {
        if (!id) return
        setBusy('set'); setErr(''); setMsg('')
        rpc(kind === 'video' ? 'video-config-set' : 'image-config-set', { providerId: id }).then((r) => {
          setBusy('')
          if (r && r.ok) { setMsg((kind === 'video' ? '✅ 视频' : '✅ 图片') + '当前提供者已切换'); refresh(true) }
          else setErr('❌ ' + String((r && r.error) || '切换失败'))
        }).catch(complain)
      }
      const onRemove = (kind, id) => {
        if (!id) return
        const c = kind === 'video' ? vCfg : iCfg
        const p = c && c.providers && c.providers.find((x) => x.id === id)
        if (p && p.sys) { setErr((kind === 'video' ? '视频' : '图片') + ':系统兜底提供者不可删除(保存自己的提供者后即可管理)'); return }
        setBusy('rm'); setErr(''); setMsg('')
        rpc(kind === 'video' ? 'video-config-remove' : 'image-config-remove', { providerId: id }).then((r) => {
          setBusy('')
          if (r && r.ok) { setMsg((kind === 'video' ? '✅ 视频' : '✅ 图片') + '提供者已删除'); refresh(false) }
          else setErr('❌ ' + String((r && r.error) || '删除失败'))
        }).catch(complain)
      }
      const onTest = (kind) => {
        setMsg(''); setErr('')
        rpc(kind === 'video' ? 'video-models' : 'image-models', {}).then((r) => {
          if (r && r.error) setErr('❌ ' + String(r.error))
          else if (kind === 'video' && r && Array.isArray(r.videoModels)) setMsg('✅ 当前视频提供者连接成功。「🔄 获取模型」可拉取模型列表')
          else if (kind === 'image' && r && Array.isArray(r.models)) setMsg('✅ 当前图片提供者连接成功。「🔄 获取模型」可拉取模型列表')
        }).catch(complain)
      }
      const onFetchModels = (kind) => {
        const e = kind === 'video' ? vEdit : iEdit
        setBusy('models'); setErr(''); setMsg('⏳ 正在请求 ' + ((e.apiUrl && e.apiUrl.trim()) || '当前提供者') + ' /models …')
        rpc(kind === 'video' ? 'video-models-by' : 'image-models-by', { apiUrl: e.apiUrl, apiKey: e.apiKey }).then((r) => {
          setBusy('')
          if (r && r.error) { setErr('❌ ' + String(r.error)) }
          else {
            const list = (r && Array.isArray(r.models)) ? r.models : []
            if (kind === 'video') setVModels(list); else setIModels(list)
            setMsg('✅ 获取到 ' + list.length + ' 个' + (kind === 'video' ? '视频' : '图片') + '模型(共 ' + (r && r.count || 0) + ' 个,已过滤)。从下方列表选择即填入')
          }
        }).catch(complain)
      }
      const onPickModel = (kind, v) => {
        if (v) {
          if (kind === 'video') setVEdit(Object.assign({}, vEdit, { model: v }))
          else setIEdit(Object.assign({}, iEdit, { model: v }))
          setMsg('已填入模型: ' + v)
        }
      }
      const onClearAll = async () => {
        // 危险操作:先应用内确认
        const ok = await askConfirm('清除全部用户提供者', '⚠️ 将删除你保存的所有视频/图片提供者(名称、API 地址、Key),且不可恢复。\n\n继续后将回退到系统兜底配置。', '全部清除')
        if (!ok) return
        rpc('video-config-clear', {}).then((r) => {
          if (r && r.ok) { setMsg('已清除全部用户提供者,回退系统兜底'); setVModels([]); setIModels([]); refresh(false) }
          else setErr('❌ ' + String((r && r.error) || '清除失败'))
        }).catch(complain)
      }
      const field = (label, control) => el('div', { className: 'vg-field' }, [el('label', null, label), control])
      const pCard = (kind, title, cfg, edit, setEdit, models, setModels) => {
        const active = cfg && cfg.providers && cfg.providers.find((p) => p.id === cfg.activeId)
        const list = (cfg && cfg.providers) || []
        const setF = (k, v) => setEdit(Object.assign({}, edit, { [k]: v }))
        const isActiveEdit = !!(edit.id && edit.id === (cfg && cfg.activeId))
        return el('div', { style: { border: '1px solid var(--border-1,rgba(128,128,128,.25))', borderRadius: 10, padding: '10px 12px', marginBottom: 10 } }, [
          el('div', { style: { fontWeight: 600, fontSize: 13, marginBottom: 6 } }, title),
          el('div', { className: 'vg-cfgline' }, active
            ? [el('b', null, '✅ 当前使用: ' + (active.name || active.id)), ' 来源: ' + (active.source || '?') + ' · ' + (active.apiUrl || '') + (active.keyMasked ? ' · Key: ' + active.keyMasked : '')]
            : '⚠️ 该类别未配置可用提供者'),
          el('div', { className: 'vg-row' }, [
            el('div', { className: 'vg-field', style: { flex: 2 } }, [
              el('label', null, '管理提供者(选择后在下放编辑)'),
              el('select', { className: 'vg-input', value: edit.id || '', onChange: (e) => {
                const id = e.target.value
                if (!id) { setEdit(Object.assign({}, blank)); return }
                const p = list.find((x) => x.id === id)
                setEdit(p ? { id: p.id, name: p.name || '', apiUrl: p.apiUrl || '', apiKey: '', model: p.model || '' } : Object.assign({}, blank))
              } }, [
                el('option', { key: '', value: '' }, '➕ 新建提供者'),
              ].concat(list.map((p) => el('option', { key: p.id, value: p.id }, (p.name || p.id) + (p.sys ? ' (系统兜底)' : '') + (p.id === cfg.activeId ? ' ⭐当前' : ''))))),
            ]),
            el('div', { className: 'vg-field', style: { flex: 1 } }, [
              el('label', null, '&nbsp;'),
              el('div', { className: 'vg-row' }, [
                el('button', { className: 'vg-sec-btn', disabled: busy === 'set' || !(edit.id && !isActiveEdit), title: edit.id && isActiveEdit ? '已是当前提供者' : '把当前编辑的提供者切换为当前使用', onClick: () => onSetCurrent(kind, edit.id) }, '⭐ 设为当前'),
                el('button', { className: 'vg-sec-btn danger', disabled: busy === 'rm' || !edit.id, title: '删除当前编辑的提供者', onClick: () => onRemove(kind, edit.id) }, '🗑 删除'),
              ]),
            ]),
          ]),
          el('div', { style: { borderTop: '1px dashed var(--border-1,rgba(128,128,128,.25))', margin: '8px 0', paddingTop: 8 } }, [
            el('div', { style: { fontSize: 11, opacity: .65, marginBottom: 6 } }, edit.id
              ? '编辑提供者: ' + (edit.name || edit.id) + (isActiveEdit ? ' (当前使用中)' : ' (已保存;💾 保存后即切换为当前)')
              : '➕ 填写新提供者信息(💾 保存后自动设为当前)'),
            el('div', { style: { display: 'flex', gap: 6 } }, [
              field('名称', el('input', { className: 'vg-input', type: 'text', placeholder: '如: 平台A', value: edit.name, onChange: (e) => setF('name', e.target.value) })),
              field('API 地址 (apiUrl)', el('input', { className: 'vg-input', type: 'text', placeholder: 'https://xxx/v1', value: edit.apiUrl, onChange: (e) => setF('apiUrl', e.target.value) })),
            ]),
            el('div', { style: { display: 'flex', gap: 6 } }, [
              field('API Key(留空保留原 Key)', el('input', { className: 'vg-input', type: 'password', placeholder: active && active.keyMasked && edit.id === active.id ? '当前: ' + active.keyMasked : 'sk-...', value: edit.apiKey, onChange: (e) => setF('apiKey', e.target.value) })),
            ]),
            el('div', { style: { display: 'flex', gap: 6, alignItems: 'flex-start' } }, [
              el('div', { className: 'vg-field', style: { flex: 1 } }, [
                el('label', null, '默认模型(手动输入,或点「🔄 获取模型」从列表选)'),
                el('input', { className: 'vg-input', type: 'text', placeholder: kind === 'video' ? 'agnes-video-v2.0' : 'agnes-image-2.1-flash', value: edit.model, onChange: (e) => setF('model', e.target.value) }),
                models.length ? el('select', { className: 'vg-input', style: { marginTop: 4 }, value: edit.model || '', onChange: (e) => onPickModel(kind, e.target.value) }, [
                  el('option', { key: '', value: '' }, '—— 模型列表(' + models.length + ' 个)选择即填入 ——'),
                ].concat(models.map((m) => el('option', { key: m, value: m }, m)))) : null,
              ]),
              el('button', { className: 'vg-sec-btn', style: { marginTop: 20, flex: 'none' }, disabled: busy === 'models', onClick: () => onFetchModels(kind) }, busy === 'models' ? '⏳ 获取中…' : '🔄 获取模型'),
            ]),
            el('div', { className: 'vg-btnrow' }, [
              el('button', { className: 'vg-btn', disabled: busy === 'save', onClick: () => onSave(kind) }, busy === 'save' ? '保存中…' : '💾 保存并设为当前'),
              el('button', { className: 'vg-sec-btn', onClick: () => setEdit(Object.assign({}, blank)) }, '➕ 新建'),
              el('button', { className: 'vg-sec-btn', onClick: () => { setEdit(provToEdit(cfg)); setModels([]) } }, '↺ 加载当前'),
              el('button', { className: 'vg-sec-btn', disabled: busy === 'test', onClick: () => onTest(kind) }, '🔌 测试当前'),
            ]),
          ]),
        ])
      }
      return [
        el('div', { className: 'vg-title' }, '⚙️ 视频生成 · 多提供者配置(视频/图片各自可存多个平台,自由切换)'),
        pCard('video', '🎬 视频 API 提供者', vCfg, vEdit, setVEdit, vModels, setVModels),
        pCard('image', '🖼️ 图片 API 提供者(生图/图生图/多图合成/参考图)', iCfg, iEdit, setIModels, iModels, setIModels),
        el('div', { className: 'vg-btnrow' }, [
          el('button', { className: 'vg-sec-btn danger', onClick: onClearAll }, '🗑 清除全部用户提供者'),
          el('button', { className: 'vg-sec-btn', onClick: () => openStore.set(true) }, '🎬 打开生成工作室'),
        ]),
        msg ? el('div', { className: 'vg-cfgline', style: { color: '#2ea043', marginTop: 8 } }, msg) : null,
        err ? el('div', { className: 'vg-error' }, err) : null,
        el('div', { style: { marginTop: 10, opacity: .6, fontSize: 11, lineHeight: 1.6 } }, '「🔄 获取模型」会请求编辑框填写的平台地址(留空则用当前提供者的地址与 Key)的 /models 接口,自动过滤出视频/图片模型。配置文件 ~/.dsh/vidgen-config.json(优先)或系统临时目录。读取优先级: 用户提供者(active) → settings.yaml(dsh-video / dsh-imagegen 段) → 生图插件 draw-config.json → 系统兜底。'),
        ConfirmDialog(),
      ]
    }

    function VideoPanel() {
      return React.createElement('div', { className: 'vidgen-card', style: { display: 'flex', flexDirection: 'column' } }, React.createElement(NodeStudio))
    }
    function SettingsStudio() {
      return React.createElement('div', { className: 'vidgen-card' }, React.createElement(VideoConfig))
    }
    function SidebarEntry(props) {
      const el = React.createElement
      const wide = !!(props && props.wide)
      const [hover, setHover] = React.useState(false)
      return el('div', { className: 'vidgen-foot-wrap', style: { display: 'flex', alignItems: 'center' } }, [
        el('button', {
          type: 'button',
          title: 'AI 视频生成工作室',
          'aria-label': 'AI 视频生成工作室',
          onClick: () => openStore.set(true),
          onMouseEnter: () => setHover(true),
          onMouseLeave: () => setHover(false),
          style: {
            display: 'flex', alignItems: 'center', gap: 8,
            flex: 1, width: '100%',
            boxSizing: 'border-box',
            height: 42, margin: 0, padding: '0 10px',
            border: 'none', borderRadius: 12,
            background: hover ? 'var(--dsw-alias-interactive-bg-hover, rgba(128,128,128,.14))' : 'transparent',
            color: 'var(--dsw-alias-label-primary, inherit)',
            fontSize: 14, cursor: 'pointer',
            whiteSpace: 'nowrap', overflow: 'hidden',
          },
        }, [
          el('span', { style: { fontSize: 15, flex: 'none' } }, '🎬'),
          wide ? el('span', { style: { fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, '视频生成') : null,
        ]),
      ])
    }
    function StudioOverlay() {
      const open = useOpen()
      if (!open) return null
      const el = React.createElement
      return el('div', { className: 'vg-overlay-backdrop', onClick: () => openStore.set(false) }, [
        el('div', { className: 'vg-overlay-card', onClick: (e) => e.stopPropagation() }, [
          el('div', { className: 'vg-overlay-head' }, [
            el('span', { style: { fontWeight: 600, fontSize: 14 } }, '🎬 AI 视频生成 · 节点画布工作室'),
            el('button', { className: 'vg-overlay-close', onClick: () => openStore.set(false) }, '✕'),
          ]),
          el('div', { className: 'vidgen-card', style: { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 } }, React.createElement(NodeStudio)),
        ]),
      ])
    }

    const slots = ctx.slots || (ctx.get && ctx.get('slots'))
    if (slots === undefined) return
    slots.inject('tool.view.cordis', () => slots.register(
      { name: 'tool.view.cordis', key: 'self' },
      () => React.createElement(VideoPanel)
    ))
    slots.inject('sidebar.footer.action', () => slots.register(
      { name: 'sidebar.footer.action', id: 'vidgen-studio', order: -10, label: '视频生成' },
      (props) => React.createElement(SidebarEntry, props)
    ))
    slots.inject('settings.section', () => slots.register(
      { name: 'settings.section', id: 'vidgen-studio', order: 50, label: '视频生成' },
      () => React.createElement(SettingsStudio)
    ))
    slots.inject('shell.overlay', () => slots.register(
      { name: 'shell.overlay', id: 'vidgen-studio-overlay', order: 100, label: '视频生成工作室' },
      () => React.createElement(StudioOverlay)
    ))
    }

    exports.inject = ['slots']
    exports.apply = apply
    return module.exports
  },
})
