// 画布快照持久化脚本(与 graphscript/histscript 同风格,直接 node 调用)
// 用法:
//   node snapscript.js list                            → {"items":[快照摘要{key,name,ts,nodes,edges,thumb}]}(不含完整图数据)
//   node snapscript.js save '<JSON>'                   → JSON 形如 {"name":"...","graph":{"nodes":[],"edges":[]}}
//                                                         自动生成 key=s_<毫秒时间戳>_<rand>,最多保留 20 条(超出丢最旧)
//   node snapscript.js read <key>                      → {"graph":{"nodes":[],"edges":[]}, "found":true}
//   node snapscript.js remove <key>                    → {"ok":true,removed:bool}
// 文件目标: ~/.dsh/vidgen-snapshots.json(优先,可写则用) 或 系统临时目录兜底
globalThis.__arg = process.argv[2] || ''
const fs = require('fs')
const path = require('path')
const os = require('os')
const HOME = process.env.HOME || os.homedir()
const CANDIDATES = []
if (HOME) CANDIDATES.push(path.join(HOME, '.dsh', 'vidgen-snapshots.json'))
CANDIDATES.push(path.join(os.tmpdir(), 'vidgen-snapshots.json'))

const MAX_ITEMS = 20

function pickWritable() {
  for (const c of CANDIDATES) {
    try {
      fs.accessSync(path.dirname(c), fs.constants.W_OK)
      return c
    } catch (e) {}
  }
  return ''
}

function loadAll() {
  // 返回 {items:[], file:''} 或 null(无文件)
  for (const c of CANDIDATES) {
    try {
      const j = JSON.parse(fs.readFileSync(c, 'utf8'))
      if (j && Array.isArray(j.items)) { j.file = c; return j }
    } catch (e) {}
  }
  return null
}

function saveAll(all, file) {
  fs.writeFileSync(file, JSON.stringify(all), 'utf8')
}

function summary(item) {
  // 列表摘要:不含完整 graph,避免传输体积过大
  return { key: item.key, name: item.name, ts: item.ts, nodes: item.nodes, edges: item.edges, thumb: item.thumb }
}

const arg = globalThis.__arg
try {
  if (arg === 'list' || arg === '') {
    const all = loadAll() || { items: [] }
    console.log(JSON.stringify({ items: all.items.map(summary), file: all.file || '' }))
  } else if (arg === 'save') {
    const dataStr = process.argv[3] || ''
    const data = JSON.parse(dataStr)
    if (!data || !data.graph || !Array.isArray(data.graph.nodes)) {
      console.log(JSON.stringify({ ok: false, error: '缺少 graph 数据' }))
      process.exit(0)
    }
    const file = pickWritable()
    if (!file) {
      console.log(JSON.stringify({ ok: false, error: 'no writable target dir' }))
      process.exit(0)
    }
    let all = loadAll() || { items: [] }
    const key = 's_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
    const nodeCount = data.graph.nodes.length
    // 提取第一张可见结果图作为预览(图源 url / 生图 outUrl / 视频 resultUrl)
    let thumb = ''
    for (const n of data.graph.nodes || []) {
      if (!n || !n.data) continue
      const u = n.type === 'image' ? String(n.data.url || '').trim()
        : n.type === 'text2image' || n.type === 'image2image' ? String(n.data.outUrl || '').trim()
        : String(n.data.resultUrl || '').trim()
      if (u && u.indexOf('data:') !== 0) { thumb = u; break }
    }
    const item = {
      key,
      name: String(data.name || ('画布快照 ' + new Date().toLocaleString('zh-CN', { hour12: false }))),
      ts: Date.now(),
      nodes: nodeCount,
      edges: Array.isArray(data.graph.edges) ? data.graph.edges.length : 0,
      thumb,
      graph: data.graph,
    }
    all.items.unshift(item)
    while (all.items.length > MAX_ITEMS) all.items.pop()
    saveAll(all, file)
    console.log(JSON.stringify({ ok: true, key, file, item: summary(item) }))
  } else if (arg === 'read') {
    const key = (process.argv[3] || '').trim()
    if (!key) {
      console.log(JSON.stringify({ graph: null, error: '缺少 key' }))
      process.exit(0)
    }
    const all = loadAll()
    const item = all && all.items.find((i) => i.key === key)
    if (!item) {
      console.log(JSON.stringify({ graph: null, found: false, error: '快照不存在: ' + key }))
      process.exit(0)
    }
    console.log(JSON.stringify({ graph: item.graph || { nodes: [], edges: [] }, found: true }))
  } else if (arg === 'remove') {
    const key = (process.argv[3] || '').trim()
    const file = pickWritable()
    if (!file) {
      console.log(JSON.stringify({ ok: false, error: 'no writable target dir' }))
      process.exit(0)
    }
    const all = loadAll() || { items: [] }
    const before = all.items.length
    all.items = all.items.filter((i) => i.key !== key)
    saveAll(all, file)
    console.log(JSON.stringify({ ok: true, removed: all.items.length !== before }))
  } else {
    console.log(JSON.stringify({ ok: false, error: '未知操作: ' + arg }))
  }
} catch (e) {
  console.log(JSON.stringify({ ok: false, error: String((e && e.message) || e) }))
}