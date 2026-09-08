;(async()=>{
  // payload 优先从 argv[2] 读(命令行,兼容老调用);否则从 stdin 读(base64 字符串)
  // stdin 方式消除命令行 ARG_MAX / shell 转义对长 payload / 含特殊字符 UTF-8 payload 的影响
  let arg = process.argv[2] || ''
  if (!arg && process.stdin && !process.stdin.isTTY) {
    const chunks = []
    process.stdin.on('data', (c) => chunks.push(c))
    await new Promise((res) => process.stdin.on('end', res))
    arg = Buffer.concat(chunks).toString('utf8')
  }
  let q
  try {
    q = JSON.parse(Buffer.from(arg, 'base64').toString('utf8'))
  } catch (e) {
    process.stdout.write(JSON.stringify({ netErr: 'invalid payload (' + String((e && e.message) || e) + ') argc=' + arg.length + ' preview=' + arg.slice(0, 80) }))
    process.exit(1)
  }
  let r
  try {
    r = await fetch(q.url, { method: q.method || 'GET', headers: q.headers || {}, body: q.body })
  } catch (e) {
    process.stdout.write(JSON.stringify({ netErr: String((e && e.message) || e) }))
    process.exit(1)
  }
  const t = await r.text()
  process.stdout.write(JSON.stringify({ status: r.status, text: t }))
})()