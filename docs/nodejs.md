# Node.js 全阶段学习手册（初 → 中 → 高）

> 从零基础到生产级实战，系统覆盖 Node.js 核心知识体系（基于 Node 20+）。

## 目录

**一、🟢 初级入门**
- 0.1 Node.js 是什么 & 能做什么
- 0.2 安装 & 版本管理
- 0.3 REPL 与执行脚本
- 0.4 Hello World
- 0.5 CommonJS 模块入门
- 0.6 npm 基础
- 0.7 fs 模块常用
- 0.8 path 模块
- 0.9 http 模块：最简服务器
- 0.10 events 模块
- 0.11 process 常用 API
- 0.12 小 CLI 案例

**二、🟡 中级进阶**
- 1. 模块系统：CJS vs ESM
- 2. Buffer 与编码
- 3. 文件系统 & 路径
- 4. 进程与 IPC
- 5. 网络：HTTP/HTTPS/HTTP2/WebSocket
- 6. 错误处理
- 7. 测试

**三、🔴 高级实战**
- 1. 运行时架构
- 2. 事件循环 (Event Loop)
- 3. Stream 流
- 4. Cluster 与 Worker Threads
- 5. 性能与诊断
- 6. 安全
- 7. 工程化与部署
- 8. 常见面试题

---

## 一、🟢 初级入门

### 0.1 Node.js 是什么 & 能做什么

Node.js 是基于 Chrome V8 引擎的 JavaScript **运行时**，让 JS 可以脱离浏览器在服务端运行。

**能做什么：**
- Web 服务器 / API 服务
- CLI 命令行工具
- 构建工具（Vite、Webpack 底层都用 Node）
- 脚本自动化（文件处理、批处理）
- 桌面应用（Electron）
- IoT / 嵌入式场景

**与浏览器 JS 的核心差异：**

| 维度 | 浏览器 | Node.js |
| --- | --- | --- |
| 全局对象 | `window` | `global` / `globalThis` |
| 模块系统 | ESM（`<script type="module">`） | CJS + ESM |
| 文件系统 | 无（沙箱隔离） | `fs` 模块完整访问 |
| 网络 | `fetch` / `WebSocket` | `http` / `net` / `fetch` |
| DOM | 有 | 无 |
| 进程 | 单页面 | `process` 对象，可创建子进程 |

💡 浏览器的 JS 以操作 DOM 为核心，Node.js 以操作系统资源（文件、网络、进程）为核心——同样是 JS，但"世界模型"完全不同。

🎯 思考：如果你只用过浏览器端 JS，想想平时写的哪些代码在 Node 里跑不了？（提示：`document.querySelector`、`localStorage`……）

---

### 0.2 安装 & 版本管理

**直接安装：** 去 [nodejs.org](https://nodejs.org) 下载安装包。

**推荐：版本管理器 nvm / fnm**

```bash
# nvm（macOS / Linux / WSL）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20          # 安装 Node 20
nvm use 20              # 切换到 20
nvm ls                  # 查看已安装版本
nvm alias default 20    # 设为默认版本

# fnm（跨平台，Rust 写的，更快）
fnm install 20
fnm use 20
```

**LTS vs Current：**

| 类型 | 说明 | 适用 |
| --- | --- | --- |
| LTS（长期支持） | 30 个月维护周期，稳定可靠 | 生产环境 |
| Current（当前版） | 最新特性，可能不稳定 | 尝鲜 / 开发 |

💡 团队项目务必统一 Node 版本，推荐在项目根目录放 `.nvmrc` 文件写入版本号（如 `20`），队友 `nvm use` 一键对齐。

🎯 行动：用 `node -v` 确认当前版本，并尝试用 nvm/fnm 切换一次。

---

### 0.3 REPL 与执行脚本

**REPL（交互式解释器）：**

```bash
node            # 进入 REPL
> 1 + 2         # 3
> const fs = require('fs')
> .help         # 查看可用命令
> .exit         # 退出
```

**执行脚本文件：**

```bash
node app.js                  # 执行脚本
node --inspect app.js        # 启用调试
node -e "console.log(1+2)"   # 内联执行
node --watch app.js          # 20+ 文件变更自动重启
```

💡 `node --watch`（Node 20+）替代了 nodemon，零依赖实现文件监听自动重启。

🎯 行动：创建一个 `hello.js`，用 `node hello.js` 运行，再用 `node -e` 内联执行同样逻辑。

---

### 0.4 Hello World

```js
// hello.js
console.log('Hello, Node.js!')

// 命令行参数
console.log('argv:', process.argv)   // [node路径, 脚本路径, ...用户参数]
console.log('参数:', process.argv.slice(2))

// 环境变量
console.log('NODE_ENV:', process.env.NODE_ENV || 'development')
console.log('HOME:', process.env.HOME || process.env.USERPROFILE)
```

```bash
NODE_ENV=production node hello.js foo bar
# Hello, Node.js!
# argv: [ '/.../node', '/.../hello.js', 'foo', 'bar' ]
# 参数: [ 'foo', 'bar' ]
# NODE_ENV: production
```

💡 `process.argv` 前两个元素固定是 Node 路径和脚本路径，用户参数从索引 2 开始。`process.env` 可读取系统环境变量，也可在启动时注入。

🎯 行动：写一个脚本，把 `process.argv[2]` 当作名字输出 `Hello, <名字>!`，然后 `node hello.js Node` 运行它。

---

### 0.5 CommonJS 模块入门

```js
// math.js —— 导出
const PI = 3.14159

function add(a, b) { return a + b }
function multiply(a, b) { return a * b }

// 方式一：逐个挂载
exports.PI = PI
exports.add = add

// 方式二：整体替换（只能用 module.exports）
module.exports = { PI, add, multiply }
```

```js
// app.js —— 导入
const math = require('./math')     // 注意 ./ 前缀，可省略 .js

console.log(math.PI)               // 3.14159
console.log(math.add(1, 2))        // 3
console.log(math.multiply(3, 4))   // 12
```

要点：
- `require()` 是同步的，可在任意位置调用；
- `module.exports` 与 `exports` 不能混用——`exports` 是 `module.exports` 的引用，重新赋值 `module.exports` 后 `exports` 指向旧对象；
- 模块有缓存，`require` 同一模块多次返回同一对象（`require.cache`）。

💡 `exports.xxx = ...` 是往默认对象上挂属性；`module.exports = {...}` 是替换整个导出对象。初学推荐统一用 `module.exports`。

🎯 行动：写一个 `string.js` 模块导出 `capitalize(str)` 和 `reverse(str)`，在另一个文件中 `require` 并调用。

---

### 0.6 npm 基础

```bash
# 初始化项目
npm init -y                       # 快速生成 package.json

# 安装依赖
npm install lodash                # 安装到 dependencies
npm install -D vitest             # 安装到 devDependencies
npm install -g npx                # 全局安装

# 运行脚本
npm run dev                       # 执行 package.json 的 scripts.dev
npm test                          # 等价于 npm run test
npm start                         # 等价于 npm run start

# 其他
npm uninstall lodash              # 卸载
npm outdated                      # 查看过时依赖
npm audit                         # 安全审计
```

**package.json 关键字段：**

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "node --watch app.js",
    "start": "node app.js",
    "test": "vitest"
  },
  "dependencies": {
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "vitest": "^1.0.0"
  },
  "engines": {
    "node": ">=18"
  }
}
```

💡 版本号 `^4.17.21` 表示兼容 `4.x.x`（主版本不变即可），`~4.17.21` 表示兼容 `4.17.x`。生产环境务必提交 `package-lock.json` 锁定精确版本。

🎯 行动：`npm init -y` 创建一个新项目，安装一个依赖，添加一个 `dev` 脚本，然后 `npm run dev` 执行。

---

### 0.7 fs 模块常用

```js
const fs = require('fs')              // 同步 / 回调风格
const fsp = require('fs/promises')    // Promise 风格（推荐）

// ── 读文件 ──
// 同步（阻塞，少用）
const data = fs.readFileSync('./a.txt', 'utf8')

// 回调
fs.readFile('./a.txt', 'utf8', (err, data) => {
  if (err) throw err
  console.log(data)
})

// Promise（推荐）
const content = await fsp.readFile('./a.txt', 'utf8')

// ── 写文件 ──
await fsp.writeFile('./out.txt', 'Hello', 'utf8')
await fsp.appendFile('./out.txt', '\nWorld', 'utf8')  // 追加

// ── 目录操作 ──
await fsp.mkdir('./logs', { recursive: true })   // 递归创建
const files = await fsp.readdir('./')             // 读取目录
const stat = await fsp.stat('./package.json')     // 文件信息
stat.isFile()       // true
stat.isDirectory()  // false
stat.size           // 字节数

// ── 删除 ──
await fsp.unlink('./tmp.txt')                     // 删文件
await fsp.rm('./dist', { recursive: true })       // 删目录（14.14+）
```

💡 三种风格如何选？——新项目一律用 `fs/promises`（async/await）；脚本工具可用同步方法简单粗暴；回调风格仅在兼容旧库时使用。

🎯 行动：用 `fs/promises` 写一个脚本，读取当前目录的 `package.json`，解析后打印 `name` 和 `version`。

---

### 0.8 path 模块

```js
const path = require('path')

// ── 拼接与解析 ──
path.join('src', 'utils', 'index.js')      // 'src/utils/index.js'（拼相对路径）
path.resolve('src', 'utils', 'index.js')   // '/abs/path/src/utils/index.js'（拼绝对路径）

// ── 提取部分 ──
path.basename('/a/b/c.txt')                // 'c.txt'
path.basename('/a/b/c.txt', '.txt')        // 'c'
path.dirname('/a/b/c.txt')                 // '/a/b'
path.extname('/a/b/c.txt')                 // '.txt'

// ── 当前文件位置 ──
console.log(__dirname)    // 当前文件所在目录的绝对路径
console.log(__filename)   // 当前文件的绝对路径
```

`join` vs `resolve` 区别：
- `join` 只拼接，不解析为绝对路径；
- `resolve` 从右向左拼接，遇到 `/` 开头就当作根路径，最终返回绝对路径。

💡 永远用 `path.join` / `path.resolve` 拼路径，不要手写 `/` 或 `\`——跨平台时 Windows 用 `\`，macOS/Linux 用 `/`，`path` 模块自动处理。

🎯 行动：用 `__dirname` + `path.join` 拼出当前项目 `package.json` 的绝对路径并读取它。

---

### 0.9 http 模块：最简服务器

```js
const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello from Node.js!\n')
})

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/')
})
```

```bash
node server.js
# Server running at http://localhost:3000/

curl http://localhost:3000/
# Hello from Node.js!
```

要点：
- `req` 是可读流（Readable），包含请求信息（url、method、headers）；
- `res` 是可写流（Writable），用于发送响应；
- 生产项目一般用 Express / Fastify / Koa 封装，但理解原生写法是基础。

💡 只需 8 行代码就能跑一个 HTTP 服务——Node 让 Web 开发的门槛降到极低。

🎯 行动：修改上面的服务器，根据 `req.url` 返回不同内容（`/` 返回 Hello，`/api` 返回 JSON）。

---

### 0.10 events 模块

```js
const EventEmitter = require('events')

const emitter = new EventEmitter()

// 监听事件
emitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`)
})

// 监听一次
emitter.once('connect', () => {
  console.log('首次连接！')
})

// 触发事件
emitter.emit('greet', 'Node')     // Hello, Node!
emitter.emit('greet', 'World')    // Hello, World!
emitter.emit('connect')           // 首次连接！
emitter.emit('connect')           // （无输出，once 只触发一次）

// 移除监听
const fn = (data) => console.log(data)
emitter.on('log', fn)
emitter.off('log', fn)            // 移除指定监听器
```

要点：
- Node.js 很多核心模块（`stream`、`http`、`process`）都继承自 `EventEmitter`；
- 如果 `emit('error')` 且没有监听器，进程会崩溃退出——**务必监听 error 事件**。

💡 `EventEmitter` 是 Node 的基石设计模式：发布-订阅。几乎所有异步 I/O 的通知都走事件机制。

🎯 行动：创建一个 `TaskQueue` 类继承 `EventEmitter`，`add(task)` 时 emit `task` 事件，外部用 `on('task', ...)` 处理。

---

### 0.11 process 常用 API

```js
// ── 进程信息 ──
process.pid            // 进程 ID
process.cwd()          // 当前工作目录
process.argv           // 命令行参数数组
process.env            // 环境变量对象
process.version        // Node 版本
process.platform       // 操作系统 ('win32' | 'darwin' | 'linux')

// ── 退出 ──
process.exit(0)        // 正常退出
process.exit(1)        // 异常退出

// ── nextTick（微任务，优先级高于 Promise） ──
process.nextTick(() => {
  console.log('这比 Promise.then 先执行')
})

// ── 全局异常兜底（最后防线） ──
process.on('uncaughtException', (err) => {
  console.error('未捕获异常:', err)
  process.exit(1)       // 记日志后退出，不要继续运行
})

process.on('unhandledRejection', (reason) => {
  console.error('未处理的 Promise 拒绝:', reason)
  process.exit(1)
})
```

💡 `process.nextTick` 的回调在当前操作完成后、下一个事件循环阶段之前执行——优先级比 `Promise.then` 还高。一般不要用它代替 `Promise`，它主要供框架内部使用。

🎯 行动：写一个脚本同时使用 `process.nextTick` 和 `Promise.then`，验证 `nextTick` 先于 `then` 执行。

---

### 0.12 小 CLI 案例

功能：读取当前目录，筛选出大于 1KB 的文件，将列表输出到 `result.txt`。

```js
const fs = require('fs/promises')
const path = require('path')

async function findLargeFiles(dir, threshold = 1024) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const results = []

  for (const entry of entries) {
    if (!entry.isFile()) continue
    const fullPath = path.join(dir, entry.name)
    const stat = await fs.stat(fullPath)
    if (stat.size > threshold) {
      const sizeKB = (stat.size / 1024).toFixed(1)
      results.push(`${entry.name}  (${sizeKB} KB)`)
    }
  }

  if (results.length === 0) {
    console.log('没有大于 1KB 的文件')
    return
  }

  const output = `大于 1KB 的文件（共 ${results.length} 个）：\n${results.join('\n')}\n`
  const outPath = path.join(dir, 'result.txt')
  await fs.writeFile(outPath, output, 'utf8')
  console.log(`已写入 ${outPath}`)
}

findLargeFiles(__dirname).catch(err => {
  console.error('出错了:', err.message)
  process.exit(1)
})
```

💡 这 30 行代码综合运用了 `fs/promises`、`path`、`process`、async/await、错误处理——是一个完整的小工具，也是 Node.js 脚本自动化的典型范式。

🎯 挑战：扩展为递归扫描子目录（提示：`entry.isDirectory()` + 递归调用），并在结果中显示相对路径。

---

## 二、🟡 中级进阶

### <span class="lv lv-2">中级</span> 1. 模块系统：CJS vs ESM

#### 1.1 CommonJS

- `require` 同步、可在任意位置；
- 输出值的**拷贝**（`module.exports` 整体替换有效）；
- 文件解析有缓存（`require.cache`）。

```js
// math.cjs
let n = 0
exports.add = () => ++n
exports.n = n          // 拷贝当时的 0
```

#### 1.2 ESM

- `import` 静态、顶层异步（top-level await）；
- 输出**绑定**（live binding），导入侧能看到导出侧后续变化；
- 文件后缀必须显式（`.js` / `.mjs`），目录需 `package.json` 中 `"type": "module"`；
- 异步加载，与 CJS 互操作有限：CJS 中用 `import('esm-pkg')` 动态导入。

```js
// pkg/package.json
{
  "type": "module",
  "exports": {
    ".": { "import": "./esm/index.js", "require": "./cjs/index.cjs" }
  }
}
```

#### 1.3 解析算法 (NodeNext)

依次：
1. 内置模块（`node:*`）；
2. `package.json` 的 `imports`（私有别名）；
3. `exports`（条件导出 import/require/node/browser/default）；
4. 文件扩展名补全（CJS 自动；ESM 必须显式）。

---

### <span class="lv lv-2">中级</span> 2. Buffer 与编码

```js
const a = Buffer.from('你好', 'utf8') // <Buffer e4 bd a0 e5 a5 bd>
a.toString('hex') // 'e4bda0e5a5bd'
a.length         // 6 字节，不是字符数
```

要点：
- `Buffer.allocUnsafe(n)` 不清零，性能高但需自行覆盖；
- `Buffer` 是 `Uint8Array` 的子类，可直接传给浏览器端用的 TypedArray API；
- 拼接大量 buffer 用 `Buffer.concat([...])`，不要用字符串拼接（避免编码错乱）；
- TextEncoder / TextDecoder 是跨平台标准 API，推荐替代纯 `toString`。

---

### <span class="lv lv-2">中级</span> 3. 文件系统 & 路径

```js
import { readFile, writeFile, watch } from 'node:fs/promises'
import path from 'node:path'

const file = path.resolve(import.meta.dirname, '../data/a.json') // 20+
const data = JSON.parse(await readFile(file, 'utf8'))
```

要点：
- 旧 `__dirname` / `__filename` 在 ESM 不可用，使用 `import.meta.url` 或 20+ 的 `import.meta.dirname`；
- 大文件用流，不要 `readFile`；
- 跨平台：`path.posix` / `path.win32` 显式指定。

---

### <span class="lv lv-2">中级</span> 4. 进程与 IPC

```js
import { spawn, exec, execFile, fork } from 'node:child_process'

const ls = spawn('ls', ['-la'])
ls.stdout.on('data', d => process.stdout.write(d))

const child = fork('./worker.js')          // 仅 Node 文件，自动建立 IPC 通道
child.send({ task: 'crunch' })
child.on('message', msg => console.log(msg))
```

| API | 适用 |
| --- | --- |
| `spawn` | 大量 stdout（流） |
| `exec` | 一次性、buffer 化结果（注意 maxBuffer） |
| `execFile` | 不走 shell，更安全 |
| `fork` | Node 子进程 + IPC |

`process.on('SIGTERM', ...)` 做优雅关闭：关闭 server、等连接 drain、再 `process.exit(0)`。

---

### <span class="lv lv-2">中级</span> 5. 网络：HTTP/HTTPS/HTTP2/WebSocket

#### 5.1 原生 HTTP server

```js
import http from 'node:http'
const server = http.createServer((req, res) => {
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify({ ok: true }))
})
server.listen(3000)
```

- `req` 是 Readable 流；`res` 是 Writable 流；
- Keep-Alive 默认开启 (Node 18+)；
- HTTP/1.1 管线化已废弃，改用 HTTP/2 多路复用。

#### 5.2 HTTP/2

```js
import http2 from 'node:http2'
const server = http2.createSecureServer({ key, cert })
server.on('stream', (stream, headers) => {
  stream.respond({ ':status': 200, 'content-type': 'text/plain' })
  stream.end('hi')
})
```

#### 5.3 fetch / undici

Node 18+ 内置 fetch（基于 undici）；高性能客户端用 `undici.Pool` / `undici.request`。

#### 5.4 WebSocket

`ws` 库或原生 `WebSocketStream`（21+ 实验）；要点：
- 维护心跳 (ping/pong)；
- 处理 backpressure；
- 鉴权放 query 或 header；连接前用 `verifyClient`。

---

### <span class="lv lv-2">中级</span> 6. 错误处理

1. **同步**：`try/catch`；
2. **回调**：error-first 约定；
3. **Promise**：`await + try/catch` 或 `.catch`；
4. **EventEmitter**：监听 `error`，否则进程崩溃；
5. **未捕获异常**：`process.on('uncaughtException' | 'unhandledRejection')` 仅做日志 + 退出，不要继续运行（状态可能损坏）。

```js
process.on('unhandledRejection', e => {
  log.error('unhandledRejection', e)
  process.exit(1)
})
```

`AsyncLocalStorage` 在异步上下文中传递 traceId / userId，无需层层透传：

```js
import { AsyncLocalStorage } from 'node:async_hooks'
export const ctx = new AsyncLocalStorage()

app.use((req, _res, next) => ctx.run({ traceId: req.id }, next))
log(`...`, ctx.getStore()?.traceId)
```

---

### <span class="lv lv-2">中级</span> 7. 测试

- **node:test**（内置 18+）+ `node --test --watch`；
- **Vitest**：与 ESM/TS 友好；
- **Jest**：成熟生态；
- E2E：`supertest`（HTTP）、Playwright；
- 测试金字塔：单元 > 集成 > E2E；
- mock：`vi.mock` / `node:test` 的 `mock`。

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'

test('add', () => {
  assert.equal(1 + 2, 3)
})
```

---

## 三、🔴 高级实战

### <span class="lv lv-3">高级</span> 1. 运行时架构

```
┌────────────────────────────────────────────┐
│              Your JS Code                  │
├────────────────────────────────────────────┤
│   Node.js APIs (fs, net, stream, ...)      │
├──────────────────┬─────────────────────────┤
│      V8         │   libuv  (event loop,    │
│  (JIT, GC)      │    thread pool, async)   │
├─────────────────┴──────────────────────────┤
│   c-ares / OpenSSL / zlib / nghttp2 ...    │
└────────────────────────────────────────────┘
```

- **V8**：执行 JS，有内存隔离的 Isolate。
- **libuv**：跨平台异步 IO；线程池（默认 4，UV_THREADPOOL_SIZE 调整）。
- **C++ Bindings**：将 V8 与 libuv / 系统 API 桥接。

---

### <span class="lv lv-3">高级</span> 2. 事件循环 (Event Loop)

#### 2.1 阶段 (phase)

```
┌───────────────┐
│   timers      │ → setTimeout / setInterval 回调
├───────────────┤
│  pending cb   │ → 上轮未处理的系统 IO 回调
├───────────────┤
│ idle, prepare │ → 内部使用
├───────────────┤
│     poll      │ → 拉取新 IO 事件，执行 IO 回调
├───────────────┤
│    check      │ → setImmediate
├───────────────┤
│  close cb     │ → socket.on('close') 等
└───────────────┘
   每阶段间清空：
   • process.nextTick 队列
   • Promise microtasks (queueMicrotask)
```

要点：
- **microtask 在每次「宏任务」之间清空**（包括每次 timer 回调之后），不是仅仅"一轮 loop 结束"。
- `process.nextTick` 优先于 microtasks。
- `setImmediate` vs `setTimeout(fn, 0)`：在 IO 回调里 `setImmediate` 一定先；主模块顶层不确定。

#### 2.2 经典题

```js
setTimeout(() => console.log('timeout'), 0)
setImmediate(() => console.log('immediate'))
fs.readFile('a.txt', () => {
  setTimeout(() => console.log('rf-timeout'), 0)
  setImmediate(() => console.log('rf-immediate'))
})
Promise.resolve().then(() => console.log('promise'))
process.nextTick(() => console.log('nextTick'))
console.log('sync')

/*
sync
nextTick
promise
（不确定）timeout / immediate 先后
rf-immediate
rf-timeout
*/
```

---

### <span class="lv lv-3">高级</span> 3. Stream 流

四种基本流：

| 类型 | 例子 |
| --- | --- |
| Readable | `fs.createReadStream` |
| Writable | `fs.createWriteStream`、`res` |
| Duplex | `net.Socket` |
| Transform | `zlib.createGzip()` |

#### 3.1 背压 (backpressure)

```js
const src = fs.createReadStream('big.bin')
const dst = fs.createWriteStream('out.bin')

src.on('data', chunk => {
  if (!dst.write(chunk)) src.pause()       // 写满
})
dst.on('drain', () => src.resume())         // 排空
src.on('end', () => dst.end())
```

更优雅：

```js
import { pipeline } from 'node:stream/promises'
import { createGzip } from 'node:zlib'

await pipeline(
  fs.createReadStream('a.txt'),
  createGzip(),
  fs.createWriteStream('a.txt.gz')
) // 自动处理 error / 关闭
```

#### 3.2 自定义 Transform

```js
import { Transform } from 'node:stream'

const upper = new Transform({
  transform(chunk, _enc, cb) {
    cb(null, chunk.toString().toUpperCase())
  }
})
```

#### 3.3 异步迭代

```js
for await (const chunk of fs.createReadStream('a.txt')) { ... }
```

---

### <span class="lv lv-3">高级</span> 4. Cluster 与 Worker Threads

#### 4.1 Cluster

`cluster` 复用主进程 listen 的 socket，子进程共享端口（轮询调度）。适合 CPU 多核 IO 密集。

```js
import cluster from 'node:cluster'
import os from 'node:os'

if (cluster.isPrimary) {
  os.cpus().forEach(() => cluster.fork())
  cluster.on('exit', () => cluster.fork())
} else {
  startServer()
}
```

#### 4.2 Worker Threads

适合 CPU 密集（加解密、图像、压缩）。共享 ArrayBuffer 通过 `transferList`。

```js
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads'

if (isMainThread) {
  const w = new Worker(import.meta.filename, { workerData: 1e7 })
  w.on('message', m => console.log('result', m))
} else {
  let s = 0
  for (let i = 0; i < workerData; i++) s += i
  parentPort.postMessage(s)
}
```

#### 4.3 选型

| 场景 | 选型 |
| --- | --- |
| HTTP 横向扩展 | Cluster / PM2 / 进程管理器 |
| CPU 密集 | Worker Threads / 队列 + 子进程 |
| 隔离用户脚本 | vm + Worker |

---

### <span class="lv lv-3">高级</span> 5. 性能与诊断

#### 5.1 内置工具

- `--inspect` / `--inspect-brk` + Chrome DevTools；
- `node --prof` + `--prof-process` (V8 profiler)；
- `--cpu-prof` / `--heap-prof`；
- `node:perf_hooks`：`performance.now()`、`PerformanceObserver`；
- `node --trace-warnings` / `--trace-deprecation`；
- `node --report-on-fatalerror`：诊断报告 JSON。

#### 5.2 内存泄漏排查

1. `--inspect` → DevTools → Memory → Heap snapshot；
2. 多次快照对比保留对象；
3. 常见泄漏：闭包持有大对象、未解绑 listener、全局 Map 持续增长、`require.cache` 滥用。

#### 5.3 性能优化清单

- 使用 stream 处理大数据；
- HTTP keep-alive + connection pool；
- 避免阻塞事件循环（不要在主线程跑加密、JSON.parse 巨大字符串）；
- 缓存（LRU、Redis）；
- 启用 gzip/br；
- 使用 Cluster / PM2 多进程；
- 数据库索引、连接池；
- 监控 `event loop lag`（`perf_hooks.monitorEventLoopDelay`）。

---

### <span class="lv lv-3">高级</span> 6. 安全

- **依赖**：`npm audit`、Snyk、Renovate；锁版本（`package-lock.json`、`pnpm-lock.yaml`）。
- **输入校验**：`zod` / `joi`；防 prototype pollution（`Object.create(null)`、`Map`）。
- **安全头**：`helmet`；
- **CORS** 白名单；
- **CSRF**：双 cookie 或同源策略；
- **JWT**：注意 `alg: none`、algorithm whitelist；refresh token 不要丢前端 localStorage（XSS 风险），用 httpOnly cookie。
- **路径穿越**：`path.resolve` 后检查前缀；
- **shell 注入**：尽量用 `execFile` 而非 `exec`；
- **Rate limit**：`express-rate-limit` / Redis 计数；
- **TLS**：Node 20+ 默认 OpenSSL 3，禁用 TLS 1.0/1.1。

---

### <span class="lv lv-3">高级</span> 7. 工程化与部署

- **包管理**：pnpm（硬链接、workspaces）；monorepo 推荐 pnpm + turbo / nx。
- **Node 版本**：`.nvmrc` / `volta` / `engines`。
- **构建**：tsx / ts-node / swc-node / `node --import tsx`（dev），生产 tsc / tsup / esbuild。
- **环境变量**：`process.env`；20+ 内置 `--env-file=.env`。
- **进程管理**：PM2、systemd、Docker + 健康检查；优雅退出。
- **日志**：`pino`（json 行式，最快）；分 trace/debug/info/warn/error；分级落 ELK / Loki。
- **监控**：OpenTelemetry，APM (Datadog、New Relic、SkyWalking)，Prometheus exporter。
- **容器化**：多阶段构建，`node:20-alpine` 注意 musl 兼容；非 root 运行；只读 fs。
- **可观测**：traceId 贯穿、`AsyncLocalStorage`、health 接口、metrics 接口。

---

### <span class="lv lv-3">高级</span> 8. 常见面试题

1. 事件循环 6 个阶段？microtask 何时执行？
2. `process.nextTick` 与 `Promise.then` 的区别？
3. require 与 import 的差异？live binding 是什么？
4. CJS 和 ESM 互操作怎么写？为什么 ESM 引用 CJS 默认导出在 `.default`？
5. `setTimeout` vs `setImmediate` 的执行顺序？
6. Stream 背压机制？`pipeline` 比 `pipe` 好在哪？
7. Buffer 与 Uint8Array 关系？
8. 怎么调度 CPU 密集任务？Cluster 与 Worker Threads 区别？
9. 怎么排查 Node 内存泄漏？
10. 优雅退出怎么实现？SIGTERM 处理？
11. `unhandledRejection` 处理策略？
12. AsyncLocalStorage 用途？为什么比 `cls-hooked` 更稳？
13. JWT vs Session 在 Node 服务端的取舍？
14. fetch 与 undici 在 Node 中怎么选？
15. Node 启动慢/QPS 上不去时怎么诊断？

---

> 推荐阅读：Node.js 官方 Docs、《Node.js Design Patterns》第 4 版、libuv 文档、`nodejs/diagnostics` 仓库工作组文章。

---

## <span class="lv lv-3">高级</span> 附录 A：Node.js 生产级项目脚手架（2025，Fastify + Prisma + pino + OTel + Docker）

> 一份可 clone 即跑的**现代 Node 后端**骨架，比 Express 更快，直接体现 Node 22 LTS 生态最佳实践。本附录不是 Hello World，而是一份 **"复制粘贴到公司仓库就能生产上线"** 的模板：Fastify（高性能 HTTP）+ Prisma（类型安全 ORM）+ pino（结构化日志）+ OpenTelemetry（可观测性）+ Docker 多阶段（容器化）+ 优雅退出（K8s 友好）。

💡 **为什么不用 Express？** Express 4 仍在维护但 API 老旧、异步错误默认不捕获、性能约为 Fastify 的 40%。2024 年后新项目 90% 会选 Fastify / Hono / Elysia。企业存量 Express 项目可按 A.11 迁移。

### A.1 技术栈选型（2025 主流）

| 层 | 选型 | 备选 | 理由 |
|---|---|---|---|
| Runtime | Node 22 LTS | Bun 1.1、Deno 2 | 生态最全、企业最稳、K8s 认证镜像最多 |
| 包管理 | pnpm 9 + corepack | npm、yarn berry | 磁盘节省 70%、workspace 一等公民 |
| HTTP 框架 | Fastify 4 | Hono、Koa、NestJS | 5.4 万 req/s、schema-first、插件生态成熟 |
| ORM | Prisma 5 | Drizzle、TypeORM | 类型安全、迁移体验最佳、Rust query engine |
| 校验 | zod 3 | valibot、typebox | Fastify 官方 typeProvider、生态最广 |
| 日志 | pino 9 | winston、bunyan | 零依赖、异步 transport、性能第一 |
| 追踪 | @opentelemetry/* | dd-trace、newrelic | 厂商中立、可切换 Jaeger/Tempo/Datadog |
| 测试 | node:test + supertest | vitest、jest | 内置零依赖、启动 < 100ms |
| 构建 | tsup + tsx | esbuild、tsc、swc | tsx 跑 dev、tsup 出 prod bundle |
| 容器 | Docker + distroless | alpine、debian-slim | 攻击面小、镜像 < 100MB |

🎯 **一句话**：**"Fastify 换 Express、Prisma 换 mysql2 手写 SQL、pino 换 console.log、OTel 换裸 log 定位"** —— 四个动作一次做完，团队立即受益。

### A.2 pnpm workspace + corepack + engines / packageManager 字段

💡 **corepack 是什么？** Node 16.9+ 内置，用来**锁死包管理器版本**（比如 pnpm@9.15.0），团队不再出现"我这 pnpm 8、他那 pnpm 9，lockfile 打架"。

**根 `package.json`**：

```json
{
  "name": "acme-backend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22.0.0 <23"
  },
  "packageManager": "pnpm@9.15.0",
  "scripts": {
    "dev": "pnpm --filter @acme/api dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "eslint . --ext .ts",
    "typecheck": "pnpm -r typecheck",
    "prisma:generate": "pnpm --filter @acme/api prisma generate",
    "docker:build": "docker build -t acme-api:latest -f apps/api/Dockerfile ."
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "eslint": "^9.15.0",
    "typescript": "^5.7.0",
    "tsx": "^4.19.0",
    "tsup": "^8.3.0"
  }
}
```

**`pnpm-workspace.yaml`**：

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**`.npmrc`**（团队级约束）：

```
engine-strict=true
save-exact=false
auto-install-peers=true
strict-peer-dependencies=false
```

**首次拉取新项目**（新人 30 秒上手）：

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate   # 或直接读 packageManager 字段
pnpm install
pnpm --filter @acme/api prisma migrate dev
pnpm dev
```

🎯 **规则**：`packageManager` 字段是**唯一真源**，CI/CD、Dockerfile、README 全部只写 `corepack enable`，不再各处写 `npm i -g pnpm@x`。

### A.3 目录结构（monorepo：apps/api + apps/worker + packages/shared）

```
acme-backend/
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .npmrc
├── .env.example
├── docker-compose.yml           # 本地 postgres + redis + jaeger
├── apps/
│   ├── api/                     # HTTP 服务
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── src/
│   │   │   ├── main.ts          # 入口：createServer + start
│   │   │   ├── server.ts        # Fastify app 工厂
│   │   │   ├── config.ts        # zod 环境变量
│   │   │   ├── plugins/
│   │   │   │   ├── logger.ts
│   │   │   │   ├── otel.ts
│   │   │   │   ├── prisma.ts
│   │   │   │   └── error.ts
│   │   │   ├── routes/
│   │   │   │   ├── health.ts
│   │   │   │   └── user.ts
│   │   │   └── shutdown.ts      # 优雅退出
│   │   └── tests/
│   │       └── user.test.ts
│   └── worker/                  # BullMQ / cron 后台任务
│       └── src/main.ts
└── packages/
    └── shared/                  # 跨包共享的 zod schema、常量
        ├── package.json
        └── src/index.ts
```

💡 **单仓 vs 多仓**：3 人以下小团队 → 单仓 monorepo；50 人以上 → 拆多仓 + npm registry。本模板是 monorepo。

### A.4 关键源码

#### A.4.1 `src/config.ts`——zod 校验 env（启动即失败，胜过运行时 undefined）

```ts
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  HOST: z.string().default('0.0.0.0'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  DATABASE_URL: z.string().url(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
  OTEL_SERVICE_NAME: z.string().default('acme-api'),
  SHUTDOWN_TIMEOUT_MS: z.coerce.number().int().default(15_000),
});

export type Env = z.infer<typeof EnvSchema>;

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  // 直接抛，进程退出，K8s 会把你拉起来后再看到明确的错
  console.error('❌ 环境变量校验失败:', z.treeifyError(parsed.error));
  process.exit(1);
}

export const env: Env = parsed.data;
```

💡 **启动即失败原则**：环境变量、数据库连接、配置文件解析这些**不可能在运行时恢复**的错误，必须在启动前 100ms 内暴露。

#### A.4.2 `src/server.ts`——Fastify 创建 + 优雅退出

```ts
import Fastify, { type FastifyInstance } from 'fastify';
import { env } from './config.js';
import loggerPlugin from './plugins/logger.js';
import otelPlugin from './plugins/otel.js';
import prismaPlugin from './plugins/prisma.js';
import errorPlugin from './plugins/error.js';
import healthRoutes from './routes/health.js';
import userRoutes from './routes/user.js';

export async function createServer(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: false,           // 我们自己接管 pino
    trustProxy: true,        // 部署在 nginx / ALB 后面
    disableRequestLogging: true,
    bodyLimit: 1 * 1024 * 1024, // 1MB，防 DoS
    genReqId: (req) => {
      // 优先复用上游 traceparent，其次 X-Request-Id，最后随机
      return (
        (req.headers['x-request-id'] as string) ||
        crypto.randomUUID()
      );
    },
  });

  await app.register(otelPlugin);
  await app.register(loggerPlugin);
  await app.register(errorPlugin);
  await app.register(prismaPlugin);
  await app.register(healthRoutes, { prefix: '/health' });
  await app.register(userRoutes, { prefix: '/api/v1/users' });

  return app;
}
```

**`src/main.ts`**：

```ts
import { createServer } from './server.js';
import { env } from './config.js';
import { setupShutdown } from './shutdown.js';

const app = await createServer();

try {
  await app.listen({ port: env.PORT, host: env.HOST });
  app.log.info({ port: env.PORT }, '🚀 server listening');
} catch (err) {
  app.log.fatal({ err }, 'failed to start');
  process.exit(1);
}

setupShutdown(app);
```

🎯 **top-level await**：`type: "module"` + Node 22 原生支持，不再需要 IIFE 包裹。

#### A.4.3 `src/plugins/logger.ts`——pino + pino-http + AsyncLocalStorage traceId

```ts
import { AsyncLocalStorage } from 'node:async_hooks';
import fp from 'fastify-plugin';
import pino from 'pino';
import { env } from '../config.js';

interface RequestContext {
  traceId: string;
  userId?: string;
}

export const als = new AsyncLocalStorage<RequestContext>();

export const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: env.OTEL_SERVICE_NAME, pid: process.pid },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
    // 每条日志自动注入 traceId
    log: (obj) => {
      const ctx = als.getStore();
      return ctx ? { ...obj, traceId: ctx.traceId, userId: ctx.userId } : obj;
    },
  },
  ...(env.NODE_ENV === 'development' && {
    transport: { target: 'pino-pretty', options: { colorize: true } },
  }),
});

export default fp(async (app) => {
  app.decorate('log', logger);
  app.addHook('onRequest', (req, _reply, done) => {
    als.run({ traceId: req.id }, () => {
      req.log = logger.child({ traceId: req.id });
      done();
    });
  });
  app.addHook('onResponse', (req, reply, done) => {
    req.log.info(
      {
        method: req.method,
        url: req.url,
        statusCode: reply.statusCode,
        duration: reply.elapsedTime,
      },
      'request completed',
    );
    done();
  });
});
```

💡 **AsyncLocalStorage 是 Node 内置**：不需要 `cls-hooked` 那种猴子补丁，Node 14+ 稳定。**任何深层函数**里 `als.getStore()` 拿 traceId，无需层层传参。

#### A.4.4 `src/plugins/otel.ts`——OpenTelemetry auto-instrumentation

```ts
import fp from 'fastify-plugin';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { env } from '../config.js';

let sdk: NodeSDK | null = null;

export function initOtel() {
  if (!env.OTEL_EXPORTER_OTLP_ENDPOINT) return;
  sdk = new NodeSDK({
    resource: new Resource({ [SEMRESATTRS_SERVICE_NAME]: env.OTEL_SERVICE_NAME }),
    traceExporter: new OTLPTraceExporter({ url: `${env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces` }),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false }, // fs 太吵，关掉
      }),
    ],
  });
  sdk.start();
}

export async function shutdownOtel() {
  if (sdk) await sdk.shutdown();
}

export default fp(async (app) => {
  // OTel 必须在其他 require 之前 start，所以真正的 initOtel() 放在 main.ts 之前 preload
  app.addHook('onClose', shutdownOtel);
});
```

🎯 **实际启动**：`node --import ./otel-preload.js src/main.js`，用 `--import` 保证 hook 在所有业务代码前生效。

#### A.4.5 `src/plugins/prisma.ts`——连接池 + 中间件

```ts
import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';
import { env } from '../config.js';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default fp(async (app) => {
  const prisma = new PrismaClient({
    log: env.NODE_ENV === 'development'
      ? ['query', 'warn', 'error']
      : ['warn', 'error'],
    datasources: { db: { url: env.DATABASE_URL } },
  });

  // 慢查询埋点
  prisma.$use(async (params, next) => {
    const start = Date.now();
    const result = await next(params);
    const duration = Date.now() - start;
    if (duration > 200) {
      app.log.warn({ model: params.model, action: params.action, duration }, 'slow query');
    }
    return result;
  });

  await prisma.$connect();
  app.decorate('prisma', prisma);
  app.addHook('onClose', async () => { await prisma.$disconnect(); });
});
```

#### A.4.6 `src/plugins/error.ts`——zod 校验错误统一格式

```ts
import fp from 'fastify-plugin';
import { ZodError } from 'zod';

export default fp(async (app) => {
  app.setErrorHandler((err, req, reply) => {
    if (err instanceof ZodError) {
      return reply.status(422).send({
        error: 'ValidationError',
        message: '请求参数校验失败',
        issues: err.issues,
        traceId: req.id,
      });
    }
    // Prisma 唯一键冲突
    if ((err as any).code === 'P2002') {
      return reply.status(409).send({
        error: 'Conflict',
        message: '资源已存在',
        traceId: req.id,
      });
    }
    req.log.error({ err }, 'unhandled error');
    return reply.status(500).send({
      error: 'InternalServerError',
      message: env.NODE_ENV === 'production' ? '服务器内部错误' : err.message,
      traceId: req.id,
    });
  });
});
```

💡 **错误响应必带 `traceId`**：出问题时用户/前端截图就能反查后端日志，5 分钟定位 vs 5 小时定位的区别。

#### A.4.7 `src/routes/user.ts`——完整 REST（zod schema-first）

```ts
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

const UserDTO = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.date(),
});
const CreateUserBody = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
});
const UpdateUserBody = CreateUserBody.partial();
const IdParam = z.object({ id: z.string().cuid() });

const routes: FastifyPluginAsyncZod = async (app) => {
  app.get('/', {
    schema: { response: { 200: z.array(UserDTO) } },
  }, async () => app.prisma.user.findMany({ take: 100 }));

  app.get('/:id', {
    schema: { params: IdParam, response: { 200: UserDTO, 404: z.object({ error: z.string() }) } },
  }, async (req, reply) => {
    const user = await app.prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return reply.status(404).send({ error: 'not found' });
    return user;
  });

  app.post('/', {
    schema: { body: CreateUserBody, response: { 201: UserDTO } },
  }, async (req, reply) => {
    const user = await app.prisma.user.create({ data: req.body });
    reply.status(201);
    return user;
  });

  app.put('/:id', {
    schema: { params: IdParam, body: UpdateUserBody, response: { 200: UserDTO } },
  }, async (req) => app.prisma.user.update({ where: { id: req.params.id }, data: req.body }));

  app.delete('/:id', {
    schema: { params: IdParam, response: { 204: z.null() } },
  }, async (req, reply) => {
    await app.prisma.user.delete({ where: { id: req.params.id } });
    reply.status(204).send();
  });
};

export default routes;
```

🎯 **schema-first 白赚**：请求校验 + 响应序列化优化（Fastify 会预编译 JSON stringify，比 JSON.stringify 快 2 倍）+ 自动 OpenAPI 文档，三合一。

#### A.4.8 `prisma/schema.prisma`——最小模型

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]  // Docker alpine
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([createdAt])
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@index([authorId, createdAt])
}
```

#### A.4.9 `tests/user.test.ts`——node:test + supertest 端到端

```ts
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createServer } from '../src/server.js';

let app: Awaited<ReturnType<typeof createServer>>;

before(async () => {
  app = await createServer();
  await app.ready();
});
after(async () => { await app.close(); });

test('POST /api/v1/users creates user', async () => {
  const res = await request(app.server)
    .post('/api/v1/users')
    .send({ email: 'a@b.com', name: 'Alice' });
  assert.equal(res.status, 201);
  assert.equal(res.body.email, 'a@b.com');
});

test('POST with invalid email returns 422', async () => {
  const res = await request(app.server)
    .post('/api/v1/users')
    .send({ email: 'not-an-email', name: 'X' });
  assert.equal(res.status, 422);
  assert.equal(res.body.error, 'ValidationError');
});
```

跑测试：

```bash
node --test --test-reporter=spec --experimental-test-coverage 'tests/**/*.test.ts'
```

💡 **零依赖测试**：不用 jest，启动快 10 倍，CI 里 500ms 完成 200 个测试。

### A.5 Node 22 LTS 新特性速览

- **`node --run script`**：直接跑 `package.json` 里的 script，跳过 npm 启动的 200ms 开销，CI 里累计能省几分钟。
  ```bash
  node --run build   # 等价 npm run build，但快得多
  ```
- **`--env-file=.env`**：原生 dotenv，不再需要 `dotenv/config`。
  ```bash
  node --env-file=.env src/main.js
  ```
- **Permission Model**（实验，22 稳定）：给 Node 进程加沙箱，防止依赖 supply-chain 攻击。
  ```bash
  node --permission --allow-fs-read=./config --allow-net=api.stripe.com src/main.js
  ```
- **原生 TypeScript strip-types**（22.6+ 默认开）：`.ts` 文件可以直接 `node file.ts` 跑，无需 tsx；只 strip 类型不做类型检查，生产仍建议 tsup 打包。
- **内置 `node:sqlite`**（22.5+）：写 CLI 工具再也不用装 `better-sqlite3`。
- **WebSocket client**（22+）：浏览器 `WebSocket` API 直接可用，不再需要 `ws` 包做客户端。
- **`node:test` + `--test-reporter=spec` + `--test-coverage`**：内置测试跑起来跟 jest 一样漂亮。

🎯 **升级建议**：Node 18 → 22 直接跳，18 是旧 LTS，20 只是过渡；22 到 2027 年 4 月才 EOL。

### A.6 undici 深入（fetch 底层）

Node 18+ 的全局 `fetch` 就是 undici 的封装。生产要跑高并发出站请求，必须直接用 undici 拿到池化能力。

**Pool / Agent / setGlobalDispatcher 三层关系**：

```ts
import { Pool, Agent, setGlobalDispatcher } from 'undici';

// 1) Pool：绑定单个 origin，keepAlive + pipelining 复用连接
const pool = new Pool('https://api.stripe.com', {
  connections: 50,           // 池大小
  pipelining: 1,             // HTTP/1.1 pipelining，1 即禁用
  keepAliveTimeout: 30_000,
  keepAliveMaxTimeout: 60_000,
});

// 2) Agent：管理多个 origin 的 Pool，是 fetch 默认 dispatcher
const agent = new Agent({ connections: 100, keepAliveTimeout: 10_000 });
setGlobalDispatcher(agent);  // 现在 global fetch 用这个 agent

// 3) 特定请求指定 pool
const res = await fetch('https://api.stripe.com/v1/charges', { dispatcher: pool });
```

**超时 + 重试 + 熔断**：

```ts
import { fetch } from 'undici';
import pRetry from 'p-retry';
import { circuitBreaker, retry, ConsecutiveBreaker, ExponentialBackoff } from 'cockatiel';

const breaker = circuitBreaker(retry({ maxAttempts: 3, backoff: new ExponentialBackoff() }), {
  halfOpenAfter: 10_000,
  breaker: new ConsecutiveBreaker(5),  // 连续 5 次失败开断路器
});

async function callStripe(url: string) {
  return breaker.execute(async () =>
    fetch(url, {
      signal: AbortSignal.timeout(5000),   // 5 秒超时
      headers: { authorization: `Bearer ${env.STRIPE_KEY}` },
    }),
  );
}
```

💡 **`AbortSignal.timeout(ms)`**：Node 18+ 内置，比手写 `setTimeout + controller.abort()` 干净十倍。

**diagnostics_channel 订阅 undici 事件（APM 埋点核心）**：

```ts
import diagnostics_channel from 'node:diagnostics_channel';

diagnostics_channel.subscribe('undici:request:create', ({ request }) => {
  console.log('[undici] →', request.method, request.origin, request.path);
});
diagnostics_channel.subscribe('undici:request:headers', ({ response, request }) => {
  console.log('[undici] ←', response.statusCode, request.origin, request.path);
});
```

🎯 **面试杀手锏**：说得出 `undici:request:create` / `undici:request:headers` / `undici:client:sendHeaders` / `undici:client:beforeConnect` 这几个 channel，直接甩掉 90% 候选人。

### A.7 corepack + pnpm workspace 完整实操

**新项目从零到跑**：

```bash
mkdir acme-backend && cd acme-backend
corepack enable
corepack use pnpm@9.15.0            # 会写入 packageManager 字段
pnpm init
mkdir -p apps/api packages/shared
cat > pnpm-workspace.yaml <<'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
EOF

pnpm --filter @acme/api init
pnpm add -D -w typescript tsx tsup @types/node
pnpm --filter @acme/api add fastify pino @prisma/client zod
pnpm --filter @acme/api add -D prisma vitest
```

**跨包引用（apps/api 依赖 packages/shared）**：

```json
// apps/api/package.json
{
  "name": "@acme/api",
  "dependencies": {
    "@acme/shared": "workspace:*"
  }
}
```

`workspace:*` 是 pnpm 关键字，发布时会自动替换成真实版本号。

💡 **CI 缓存要点**：`~/.local/share/pnpm/store/v3`（Linux）或 `%LOCALAPPDATA%\pnpm\store\v3`（Windows）是 pnpm 全局 content-addressable store，缓存这个目录 CI 提速 3~5 倍。

### A.8 Web Streams 与 Node Stream 互操作

Node 18+ 同时支持 **Node Stream**（老，`stream.Readable`）和 **Web Streams**（新，`ReadableStream`）。fetch 返回的就是 Web Streams。

**Web ReadableStream ↔ node stream.Readable**：

```ts
import { Readable } from 'node:stream';
import { ReadableStream } from 'node:stream/web';

// fetch 返回 Web ReadableStream → 转 Node Readable → pipe 到文件
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

const res = await fetch('https://example.com/big.zip');
const nodeStream = Readable.fromWeb(res.body as ReadableStream);
await pipeline(nodeStream, createWriteStream('./big.zip'));
```

**大文件流式下载（避免 OOM）**：

```ts
async function downloadLarge(url: string, dest: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  await pipeline(
    Readable.fromWeb(res.body as ReadableStream),
    createWriteStream(dest),
  );
}
// 下载 10GB 文件，内存占用始终 < 50MB
```

**Server-Sent Events（SSE）用 Web Streams 实现**：

```ts
app.get('/events', async (req, reply) => {
  reply.raw.writeHead(200, {
    'content-type': 'text/event-stream',
    'cache-control': 'no-cache',
    connection: 'keep-alive',
  });

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 100; i++) {
        controller.enqueue(`data: ${JSON.stringify({ n: i })}\n\n`);
        await new Promise((r) => setTimeout(r, 1000));
      }
      controller.close();
    },
  });

  await pipeline(Readable.fromWeb(stream), reply.raw);
});
```

🎯 **趋势**：新 API 都在 Web Streams 化（fetch、Response.body、Blob.stream），老代码继续 Node Stream，中间用 `Readable.fromWeb` / `Readable.toWeb` 桥接。

### A.9 Dockerfile 多阶段生产模板

```dockerfile
# ============ Stage 1: deps ============
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ============ Stage 2: build ============
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY . .
RUN pnpm --filter @acme/api prisma generate
RUN pnpm --filter @acme/api build          # 输出到 apps/api/dist
RUN pnpm --filter @acme/api deploy --prod /prod   # 只保留 prod deps

# ============ Stage 3: runtime ============
FROM node:22-alpine AS runtime
RUN apk add --no-cache tini
WORKDIR /app
ENV NODE_ENV=production
ENV NODE_OPTIONS="--enable-source-maps"

COPY --from=build /prod/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/prisma ./prisma

# 非 root 用户
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -s /bin/sh -D nodejs
USER nodejs

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "--enable-source-maps", "dist/main.js"]
```

**镜像体积对比**（同一 Node 22 项目）：

| 基础镜像 | 大小 | 备注 |
|---|---|---|
| `node:22` | ~1.1 GB | 别用 |
| `node:22-slim` | ~250 MB | 兼容性最好 |
| `node:22-alpine` | ~150 MB | 本模板选择 |
| `gcr.io/distroless/nodejs22-debian12` | ~130 MB | 无 shell，最安全 |

💡 **tini/dumb-init 必须要**：容器里 Node 是 PID 1，收不到默认的 `SIGTERM` 处理，也不会 reap 僵尸子进程。tini 一行搞定。

### A.10 优雅退出（K8s preStop 配合）

**`src/shutdown.ts`**：

```ts
import type { FastifyInstance } from 'fastify';
import { env } from './config.js';

export function setupShutdown(app: FastifyInstance) {
  let shuttingDown = false;

  async function shutdown(signal: string) {
    if (shuttingDown) return;
    shuttingDown = true;
    app.log.info({ signal }, '📴 received shutdown signal, closing gracefully...');

    // 强制超时保底：15 秒还没退干净就硬杀
    const forceTimer = setTimeout(() => {
      app.log.fatal('❌ forced shutdown after timeout');
      process.exit(1);
    }, env.SHUTDOWN_TIMEOUT_MS);
    forceTimer.unref();

    try {
      // 1) 停止接受新连接
      await app.close();
      app.log.info('✅ http server closed');
      // 2) app.close 内部会触发 onClose 钩子：prisma disconnect / otel flush
      clearTimeout(forceTimer);
      process.exit(0);
    } catch (err) {
      app.log.error({ err }, 'error during shutdown');
      process.exit(1);
    }
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('uncaughtException', (err) => {
    app.log.fatal({ err }, '💥 uncaughtException');
    shutdown('uncaughtException');
  });
  process.on('unhandledRejection', (reason) => {
    app.log.fatal({ reason }, '💥 unhandledRejection');
    shutdown('unhandledRejection');
  });
}
```

**K8s 配合（deployment.yaml 片段）**：

```yaml
spec:
  terminationGracePeriodSeconds: 30
  containers:
    - name: api
      lifecycle:
        preStop:
          exec:
            # sleep 让 kube-proxy 有时间把 pod 从 Service Endpoints 摘除
            command: ["sh", "-c", "sleep 5"]
      readinessProbe:
        httpGet: { path: /health/ready, port: 3000 }
        periodSeconds: 5
      livenessProbe:
        httpGet: { path: /health/live, port: 3000 }
        periodSeconds: 10
```

**优雅退出完整时序**：

```
t=0    K8s 发 SIGTERM → 同时开始 preStop sleep 5
t=0    Node 收到 SIGTERM → shutdown('SIGTERM')
t=0    app.close() 拒新连接、等已有请求完成
t=5    preStop 结束、pod 从 Endpoints 摘除
t=5-15 已有请求慢慢 drain，Prisma disconnect、OTel flush
t=15   如果还没退→forceTimer 触发→process.exit(1)
t=30   K8s SIGKILL（本模板不应走到这一步）
```

🎯 **`terminationGracePeriodSeconds` > `SHUTDOWN_TIMEOUT_MS`**：给应用留出比 K8s 更短的窗口，确保是 **应用自愿退出**（exit 0）而不是被 K8s SIGKILL（exit 137），这样监控告警不会误报。

💡 **preStop sleep 5 的必要性**：K8s 发 SIGTERM 和 kube-proxy 更新 iptables 是**并发的**，如果不 sleep，可能 pod 已经 close 了但 Service 还在往这里转发流量，造成 5xx 尖峰。

### A.11 Express → Fastify 迁移速查表

| Express 4 | Fastify 4 | 备注 |
|---|---|---|
| `app.use(express.json())` | 默认支持 | 不用写 |
| `app.get('/x', (req, res) => res.json(...))` | `app.get('/x', async () => ({...}))` | return 即 send |
| `app.use(cors())` | `await app.register(fastifyCors)` | 插件模式 |
| `app.use(helmet())` | `await app.register(fastifyHelmet)` | |
| `req.params.id` (any) | `req.params.id` (typed) | zod schema 后自动类型化 |
| `next(err)` | `throw err` | async 直接抛 |
| `express-rate-limit` | `@fastify/rate-limit` | |
| `express-session` | `@fastify/session` | |
| morgan | pino-http（已内置） | |

🎯 **迁移策略**：不追求"一次改完"，用 **`fastify-express` 兼容层**先跑起来，再一个一个 route 替换，两周内完成中型项目切换。

---

💡 **学习秘诀（附录 A 总结）**：Node 项目升级路线 = "**Express 4 → Fastify 4 → 补 pino + OTel + Prisma + Docker**"，每步都能独立带来可测收益（QPS、日志可搜、故障可追、部署可重复），不必等"重写完再看效果"。

🎯 **可执行 checklist（今天就能落地 5 条）**：
1. `package.json` 加 `packageManager` 字段 + `engines.node`，CI 加 `corepack enable`
2. 所有 `console.log` 换成 pino，日志级别用环境变量控制
3. 环境变量用 zod 校验，启动即失败
4. Dockerfile 改多阶段 + 非 root + tini + healthcheck
5. `SIGTERM` handler 实现优雅退出，K8s 加 `preStop sleep 5`

