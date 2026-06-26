# Express 中高级知识点

> 基于 Express 4.x（兼顾 5.x beta 的变化），覆盖中间件机制、路由、错误处理、性能、安全与最佳实践。

## 目录

- [1. Express 是什么](#1-express-是什么)
- [2. 中间件机制 (源码级)](#2-中间件机制-源码级)
- [3. 路由系统](#3-路由系统)
- [4. 请求与响应对象](#4-请求与响应对象)
- [5. 错误处理](#5-错误处理)
- [6. 模板与静态资源](#6-模板与静态资源)
- [7. Cookie / Session / JWT](#7-cookie--session--jwt)
- [8. 文件上传与流式响应](#8-文件上传与流式响应)
- [9. 安全实践](#9-安全实践)
- [10. 性能与可扩展性](#10-性能与可扩展性)
- [11. 与 TypeScript 集成](#11-与-typescript-集成)
- [12. 测试](#12-测试)
- [13. 项目分层与最佳实践](#13-项目分层与最佳实践)
- [14. Express 5 主要变更](#14-express-5-主要变更)
- [15. 常见面试题](#15-常见面试题)

---

## 1. Express 是什么

Express 是基于 Node 原生 HTTP 模块的极简 Web 框架，核心模型：**洋葱式中间件 + 路由**。生态成熟，但不像 Koa 是基于 async/await，错误传播需手动 `next(err)`（5.x 改善）。

```js
import express from 'express'
const app = express()

app.use(express.json())
app.get('/hello', (req, res) => res.json({ msg: 'hi' }))
app.listen(3000)
```

---

## 2. 中间件机制 (源码级)

中间件即 `(req, res, next) => void` 函数，按 `app.use` / 路由声明顺序排队，`next()` 转下一个，`next(err)` 跳到错误中间件 (4 参数 `(err, req, res, next)`)。

### 2.1 调用栈伪代码

```js
function dispatch(idx) {
  const layer = stack[idx]
  if (!layer || res.headersSent) return
  try {
    layer.handle(req, res, err => {
      if (err) return errDispatch(idx + 1, err)
      dispatch(idx + 1)
    })
  } catch (e) { errDispatch(idx + 1, e) }
}
```

### 2.2 顺序至关重要

```js
app.use(express.json())          // 解析 body
app.use(cors())                  // CORS
app.use(authMiddleware)          // 鉴权
app.use('/api', apiRouter)
app.use(notFoundHandler)         // 404
app.use(errorHandler)            // 错误
```

### 2.3 异步中间件

Express 4.x **不会**自动 catch async 错误，必须手动：

```js
const wrap = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

app.get('/u', wrap(async (req, res) => {
  const user = await db.find()
  res.json(user)
}))
```

或使用 `express-async-errors` / 升级 Express 5。

### 2.4 中间件分类

- **应用级**：`app.use`；
- **路由级**：`router.use`；
- **错误处理**：`(err, req, res, next)`；
- **内置**：`express.json` / `urlencoded` / `static` / `Router`；
- **第三方**：morgan、cors、helmet、cookie-parser…

---

## 3. 路由系统

### 3.1 Router

```js
const router = express.Router({ mergeParams: true })
router.get('/:id', getUser)
router.put('/:id', updateUser)
app.use('/users', router)
```

`mergeParams: true` 允许子 router 访问父级 `req.params`。

### 3.2 路径模式

- `/users/:id` 路径参数 → `req.params.id`；
- `/files/*`（4.x） / `/files/{*splat}`（5.x）通配；
- 正则：`/^\/foo[a-z]+$/`；
- 链式：`router.route('/x').get(...).post(...).put(...)`。

### 3.3 参数预处理 `app.param`

```js
router.param('id', async (req, res, next, id) => {
  req.user = await User.findById(id)
  if (!req.user) return res.sendStatus(404)
  next()
})
```

每个含 `:id` 的路由统一加载，避免重复。

---

## 4. 请求与响应对象

### 4.1 req 关键属性

| 属性 | 说明 |
| --- | --- |
| `req.params` | 路径参数 |
| `req.query` | 查询字符串（4.x 默认 `qs`，5.x `simple`） |
| `req.body` | 解析后的 body（需 body parser） |
| `req.headers` / `req.get(name)` | 头 |
| `req.ip` / `req.ips` | 客户端 IP（启用 `trust proxy`） |
| `req.cookies` / `req.signedCookies` | 需 `cookie-parser` |
| `req.session` | 需 `express-session` |
| `req.is(type)` / `req.accepts(types)` | 内容协商 |
| `req.protocol` / `req.secure` / `req.hostname` | URL 信息 |

### 4.2 res 关键 API

```js
res.status(201).json({ id: 1 })
res.set('X-Trace-Id', id).send('ok')
res.cookie('token', t, { httpOnly: true, secure: true, sameSite: 'lax' })
res.redirect(302, '/login')
res.sendFile(path.resolve('out.pdf'))
res.download('out.zip', 'archive.zip')
res.format({
  json: () => res.json(data),
  html: () => res.render('view', data)
})
res.locals.user = req.user // 可在视图层访问
```

### 4.3 trust proxy

部署在 nginx / CDN 后必须设置，否则 `req.ip` 是反向代理 IP：

```js
app.set('trust proxy', 1)        // 信任第一层
// 或 'loopback', '10.0.0.0/8', true（信任全部，慎用）
```

---

## 5. 错误处理

```js
// 业务错误类
class HttpError extends Error {
  constructor(public status: number, msg: string, public code?: string) { super(msg) }
}

// 错误中间件（必须 4 参）
app.use((err, req, res, next) => {
  const status = err.status ?? 500
  if (status >= 500) logger.error(err)
  res.status(status).json({
    code: err.code ?? 'INTERNAL',
    msg: err.message,
    traceId: req.id
  })
})

// 抛出
throw new HttpError(404, 'user not found', 'USER_NOT_FOUND')
```

要点：
- 流式响应已发送 header 后再 throw，必须 `res.destroy()`，无法再写错误页；
- 监听全局 `unhandledRejection` 防止悄悄丢失。

---

## 6. 模板与静态资源

```js
app.set('views', './views')
app.set('view engine', 'ejs') // pug / hbs / nunjucks

app.get('/', (req, res) => res.render('index', { title: 'home' }))
app.use('/static', express.static('public', { maxAge: '7d', immutable: true }))
```

静态资源生产建议：
- 走 CDN / nginx；
- 文件哈希 + 强缓存 1 年；
- gzip / brotli（`compression` 中间件或反代）。

---

## 7. Cookie / Session / JWT

### 7.1 cookie-parser

```js
import cookieParser from 'cookie-parser'
app.use(cookieParser('signed-secret'))
res.cookie('id', '1', { signed: true, httpOnly: true })
req.signedCookies.id
```

### 7.2 express-session

```js
import session from 'express-session'
import RedisStore from 'connect-redis'

app.use(session({
  store: new RedisStore({ client: redis }),
  secret: 'xxx',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 24*3600*1000 }
}))
```

### 7.3 JWT

```js
import jwt from 'jsonwebtoken'

const token = jwt.sign({ uid }, SECRET, { expiresIn: '15m', algorithm: 'HS256' })
const payload = jwt.verify(token, SECRET, { algorithms: ['HS256'] }) // 必须白名单
```

最佳实践：access token (短 + Authorization 头) + refresh token (httpOnly cookie，黑名单/版本号校验)。

---

## 8. 文件上传与流式响应

### 8.1 multer

```js
import multer from 'multer'
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads',
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, /image\/(png|jpeg)/.test(file.mimetype))
})

app.post('/avatar', upload.single('file'), (req, res) => {
  res.json({ path: req.file?.path })
})
```

### 8.2 流式下载

```js
import { pipeline } from 'node:stream/promises'
import { createReadStream } from 'node:fs'

app.get('/download/:id', async (req, res) => {
  const file = await getFileById(req.params.id)
  res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`)
  res.setHeader('Content-Type', file.mime)
  await pipeline(createReadStream(file.path), res)
})
```

### 8.3 SSE (Server-Sent Events)

```js
app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  const id = setInterval(() => res.write(`data: ${Date.now()}\n\n`), 1000)
  req.on('close', () => clearInterval(id))
})
```

---

## 9. 安全实践

| 风险 | 措施 |
| --- | --- |
| XSS | 模板转义、CSP、`xss-clean` |
| CSRF | `csurf`（已弃，用双 token / sameSite=lax） |
| SQL/NoSQL 注入 | ORM / 预编译；输入校验 |
| 暴力破解 | `express-rate-limit` + Redis |
| 敏感信息 | 不要 log token、密码；env 化配置 |
| 头部 | `helmet()`（CSP、HSTS、X-Frame-Options 等） |
| HPP | `hpp` 防参数污染 |
| 反序列化 | 限 `express.json({ limit: '1mb', strict: true })` |
| 上传 | 校验类型、大小、目录权限、不可执行 |
| 鉴权 | 强算法（argon2/bcrypt）；JWT alg 白名单 |
| 错误回显 | 生产隐藏栈信息 |

```js
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

app.use(helmet({
  contentSecurityPolicy: { directives: { 'default-src': ["'self'"], 'img-src': ["'self'", 'data:', 'https:'] } }
}))

app.use('/api/login', rateLimit({ windowMs: 60_000, max: 5, standardHeaders: true }))
```

---

## 10. 性能与可扩展性

- **`compression()`**：gzip / br；
- **HTTP keep-alive**；
- **`etag`** 静态文件命中 304；
- **`cluster`** + 进程守护；
- **数据库连接池**（mysql2、pg）；
- **缓存**：内存 LRU、Redis、CDN；
- **拆服务**：网关 + 微服务（Express + gRPC / NATS / Kafka）；
- **Worker Threads** 处理 CPU 密集；
- **APM**：OpenTelemetry / SkyWalking / Datadog；
- **graceful shutdown**：

```js
const server = app.listen(3000)
function shutdown() {
  server.close(err => process.exit(err ? 1 : 0))
  setTimeout(() => process.exit(1), 10_000).unref()
}
process.on('SIGTERM', shutdown).on('SIGINT', shutdown)
```

---

## 11. 与 TypeScript 集成

```ts
import express, { Request, Response, NextFunction, RequestHandler } from 'express'

interface AuthedRequest extends Request {
  user?: { id: number; role: string }
}

const auth: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.slice(7)
  if (!token) return res.status(401).end()
  ;(req as AuthedRequest).user = verify(token)
  next()
}

// 全局扩展（推荐写到 src/types/express.d.ts）
declare module 'express-serve-static-core' {
  interface Request {
    id: string
    user?: { id: number; role: string }
  }
}
```

异步处理器类型化：

```ts
type AsyncHandler<P = any, B = any, Q = any> =
  (req: Request<P, any, B, Q>, res: Response, next: NextFunction) => Promise<any>

const wrap = <P, B, Q>(h: AsyncHandler<P, B, Q>): RequestHandler<P, any, B, Q> =>
  (req, res, next) => h(req, res, next).catch(next)
```

---

## 12. 测试

```ts
import request from 'supertest'
import app from '../src/app'

test('GET /hello', async () => {
  const res = await request(app).get('/hello')
  expect(res.status).toBe(200)
  expect(res.body).toEqual({ msg: 'hi' })
})
```

集成测试建议：
- 测试用 SQLite / Testcontainers 起真实 mysql；
- 用 `nock` mock 第三方 HTTP；
- 跑前重置 schema（migrate / truncate）。

---

## 13. 项目分层与最佳实践

```
src/
├── app.ts            // 组装 Express
├── server.ts         // 启动 + 优雅退出
├── config/           // 配置（dotenv + zod 校验）
├── middlewares/      // 鉴权、日志、错误、限流
├── modules/
│   └── user/
│       ├── user.controller.ts
│       ├── user.service.ts
│       ├── user.repo.ts
│       ├── user.schema.ts   // zod
│       └── user.route.ts
├── lib/              // db、redis、logger
├── types/            // 全局类型扩展
└── utils/
```

通用约定：
- **controller** 只做参数校验（zod）+ 调 service + 响应；
- **service** 业务编排，禁直接读写 req/res；
- **repo** 仅数据访问；
- **DTO/VO** 显式定义，避免泄漏内部字段；
- 依赖反转：service 接 repo 接口，便于测试 mock；
- 配置统一从 `config` 读取，禁直接 `process.env`。

```ts
// zod 校验
const CreateUser = z.object({ name: z.string().min(1), age: z.number().int().min(0) })

router.post('/', wrap(async (req, res) => {
  const body = CreateUser.parse(req.body)
  const user = await userService.create(body)
  res.status(201).json(user)
}))
```

---

## 14. Express 5 主要变更

- **自动 catch async 错误**：返回 Promise 的 handler 自动 reject 时走错误中间件；
- 移除 `res.json(status, body)` / `res.jsonp(status, body)` 等签名；
- 路径模式语法变更（path-to-regexp v6 → 7）：通配 `*` 改为命名形式 `*splat`；
- 默认 `req.query` 为 `simple` 解析；
- 节点最低 Node 18。

迁移：检查路由通配符、错误中间件、第三方中间件兼容性。

---

## 15. 常见面试题

1. Express 中间件原理？next 如何串联？
2. 为什么错误中间件必须是 4 个参数？
3. `app.use` vs `app.get` 区别？声明顺序为什么重要？
4. async 错误如何在 4.x 自动处理？
5. `trust proxy` 何时设置？
6. Cookie 的 `httpOnly` / `secure` / `sameSite` 各防什么？
7. JWT 与 Session 在 Express 中怎么选？
8. CSRF 攻击原理？csurf 已弃用怎么办？
9. multer 处理大文件上传需要注意什么？
10. 怎么实现 SSE？为什么不直接用 WebSocket？
11. Express 与 Koa / Fastify / NestJS 的取舍？
12. Express 5 与 4 主要差异？
13. 如何统一异常返回格式与日志 traceId 链路？
14. Express 应用的优雅退出怎么做？
15. 如何分层组织一个中型 Express 项目？

---

> 推荐阅读：Express 官方源码（`router/index.js`、`router/layer.js`、`response.js`）、`expressjs/express` issue 区、《Building APIs with Node.js》。
