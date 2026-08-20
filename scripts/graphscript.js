// 画布状态持久化脚本(与 histscript.js 同风格,直接 node 调用)
// 用法: node graphscript.js read            → 读取并输出 {"graph":{nodes,edges}|null,"file":路径}
//        node graphscript.js '<JSON字符串>'  → 写入 {"graph":{...}} 到磁盘
// 写入目标: ~/.dsh/vidgen-graph.json(优先,可写则用) 或 系统临时目录兜底
globalThis.__arg = process.argv[2] || ''
const fs = require('fs')
const path = require('path')
const os = require('os')
const HOME = process.env.HOME || os.homedir()
const candidates = []
if (HOME) candidates.push(path.join(HOME, '.dsh', 'vidgen-graph.json'))
candidates.push(path.join(os.tmpdir(), 'vidgen-graph.json'))

function pickWritable() {
  for (const c of candidates) {
    try {
      fs.accessSync(path.dirname(c), fs.constants.W_OK)
      return c
    } catch (e) {}
  }
  return ''
}

const arg = globalThis.__arg
try {
  if (arg === 'read' || arg === '') {
    let out = { graph: null, file: '' }
    for (const c of candidates) {
      try {
        const j = JSON.parse(fs.readFileSync(c, 'utf8'))
        if (j && j.graph && Array.isArray(j.graph.nodes)) {
          out = { graph: j.graph, file: c }
          break
        }
      } catch (e) {}
    }
    console.log(JSON.stringify(out))
  } else {
    const file = pickWritable()
    if (!file) {
      console.log(JSON.stringify({ ok: false, error: 'no writable target dir' }))
      process.exit(0)
    }
    // 仅接受合法 JSON,防止写入损坏数据
    JSON.parse(arg)
    fs.writeFileSync(file, arg, 'utf8')
    console.log(JSON.stringify({ ok: true, file }))
  }
} catch (e) {
  console.log(JSON.stringify({ ok: false, error: String((e && e.message) || e) }))
}
