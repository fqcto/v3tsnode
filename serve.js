// 极简零依赖静态服务器 —— 解决 file:// 下浏览器禁止本地 fetch 的问题。
// 用法：node serve.js  （默认 http://localhost:5174）
import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { existsSync, statSync } from 'node:fs'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')))
const PORT = Number(process.env.PORT) || 5174
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.md':   'text/markdown; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.ico':  'image/x-icon',
  '.txt':  'text/plain; charset=utf-8',
}

const server = http.createServer(async (req, res) => {
  try {
    const url = decodeURIComponent(req.url.split('?')[0])
    let filePath = path.join(ROOT, url)
    // 防穿越
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403); return res.end('Forbidden')
    }
    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html')
    }
    if (!existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      return res.end('404 Not Found: ' + url)
    }
    const data = await fs.readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    })
    res.end(data)
  } catch (e) {
    res.writeHead(500); res.end('500 ' + e.message)
  }
})

server.listen(PORT, () => {
  console.log(`\n  📚 v3tsnode 知识库已启动`)
  console.log(`  ➜ 浏览器打开 http://localhost:${PORT}/`)
  console.log(`  ➜ 按 Ctrl+C 退出\n`)
})
