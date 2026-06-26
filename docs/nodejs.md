# Node.js 中高级知识点

> 涵盖事件循环、模块系统、流、Buffer、Worker、性能、安全、调试等核心面试与实战要点（基于 Node 20+）。

## 目录

- [1. 运行时架构](#1-运行时架构)
- [2. 事件循环 (Event Loop)](#2-事件循环-event-loop)
- [3. 模块系统：CJS vs ESM](#3-模块系统cjs-vs-esm)
- [4. Buffer 与编码](#4-buffer-与编码)
- [5. Stream 流](#5-stream-流)
- [6. 文件系统 & 路径](#6-文件系统--路径)
- [7. 进程与 IPC](#7-进程与-ipc)
- [8. Cluster 与 Worker Threads](#8-cluster-与-worker-threads)
- [9. 网络：HTTP/HTTPS/HTTP2/WebSocket](#9-网络httphttpshttp2websocket)
- [10. 错误处理](#10-错误处理)
- [11. 性能与诊断](#11-性能与诊断)
- [12. 安全](#12-安全)
- [13. 测试](#13-测试)
- [14. 工程化与部署](#14-工程化与部署)
- [15. 常见面试题](#15-常见面试题)

---

## 1. 运行时架构

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

## 2. 事件循环 (Event Loop)

### 2.1 阶段 (phase)

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
- **microtask 在每次「宏任务」之间清空**（包括每次 timer 回调之后），不是仅仅“一轮 loop 结束”。
- `process.nextTick` 优先于 microtasks。
- `setImmediate` vs `setTimeout(fn, 0)`：在 IO 回调里 `setImmediate` 一定先；主模块顶层不确定。

### 2.2 经典题

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

## 3. 模块系统：CJS vs ESM

### 3.1 CommonJS

- `require` 同步、可在任意位置；
- 输出值的**拷贝**（`module.exports` 整体替换有效）；
- 文件解析有缓存（`require.cache`）。

```js
// math.cjs
let n = 0
exports.add = () => ++n
exports.n = n          // 拷贝当时的 0
```

### 3.2 ESM

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

### 3.3 解析算法 (NodeNext)

依次：
1. 内置模块（`node:*`）；
2. `package.json` 的 `imports`（私有别名）；
3. `exports`（条件导出 import/require/node/browser/default）；
4. 文件扩展名补全（CJS 自动；ESM 必须显式）。

---

## 4. Buffer 与编码

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

## 5. Stream 流

四种基本流：

| 类型 | 例子 |
| --- | --- |
| Readable | `fs.createReadStream` |
| Writable | `fs.createWriteStream`、`res` |
| Duplex | `net.Socket` |
| Transform | `zlib.createGzip()` |

### 5.1 背压 (backpressure)

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

### 5.2 自定义 Transform

```js
import { Transform } from 'node:stream'

const upper = new Transform({
  transform(chunk, _enc, cb) {
    cb(null, chunk.toString().toUpperCase())
  }
})
```

### 5.3 异步迭代

```js
for await (const chunk of fs.createReadStream('a.txt')) { ... }
```

---

## 6. 文件系统 & 路径

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

## 7. 进程与 IPC

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

## 8. Cluster 与 Worker Threads

### 8.1 Cluster

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

### 8.2 Worker Threads

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

### 8.3 选型

| 场景 | 选型 |
| --- | --- |
| HTTP 横向扩展 | Cluster / PM2 / 进程管理器 |
| CPU 密集 | Worker Threads / 队列 + 子进程 |
| 隔离用户脚本 | vm + Worker |

---

## 9. 网络：HTTP/HTTPS/HTTP2/WebSocket

### 9.1 原生 HTTP server

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

### 9.2 HTTP/2

```js
import http2 from 'node:http2'
const server = http2.createSecureServer({ key, cert })
server.on('stream', (stream, headers) => {
  stream.respond({ ':status': 200, 'content-type': 'text/plain' })
  stream.end('hi')
})
```

### 9.3 fetch / undici

Node 18+ 内置 fetch（基于 undici）；高性能客户端用 `undici.Pool` / `undici.request`。

### 9.4 WebSocket

`ws` 库或原生 `WebSocketStream`（21+ 实验）；要点：
- 维护心跳 (ping/pong)；
- 处理 backpressure；
- 鉴权放 query 或 header；连接前用 `verifyClient`。

---

## 10. 错误处理

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

## 11. 性能与诊断

### 11.1 内置工具

- `--inspect` / `--inspect-brk` + Chrome DevTools；
- `node --prof` + `--prof-process` (V8 profiler)；
- `--cpu-prof` / `--heap-prof`；
- `node:perf_hooks`：`performance.now()`、`PerformanceObserver`；
- `node --trace-warnings` / `--trace-deprecation`；
- `node --report-on-fatalerror`：诊断报告 JSON。

### 11.2 内存泄漏排查

1. `--inspect` → DevTools → Memory → Heap snapshot；
2. 多次快照对比保留对象；
3. 常见泄漏：闭包持有大对象、未解绑 listener、全局 Map 持续增长、`require.cache` 滥用。

### 11.3 性能优化清单

- 使用 stream 处理大数据；
- HTTP keep-alive + connection pool；
- 避免阻塞事件循环（不要在主线程跑加密、JSON.parse 巨大字符串）；
- 缓存（LRU、Redis）；
- 启用 gzip/br；
- 使用 Cluster / PM2 多进程；
- 数据库索引、连接池；
- 监控 `event loop lag`（`perf_hooks.monitorEventLoopDelay`）。

---

## 12. 安全

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

## 13. 测试

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

## 14. 工程化与部署

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

## 15. 常见面试题

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
