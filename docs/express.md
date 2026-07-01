# Express 全阶段学习手册（初 → 中 → 高）

从零到源码级，一份贯穿 Express 4.x / 5.x 的三阶段学习路径：初级掌握基础用法，中级理解机制，高级实战与优化。

## 目录

**一、🟢 初级入门**
- 0. 从零到 REST API

**二、🟡 中级进阶**
- 1. Express 是什么
- 3. 路由系统
- 4. 请求与响应对象
- 6. 模板与静态资源
- 7. Cookie / Session / JWT
- 11. 与 TypeScript 集成
- 12. 测试
- 13. 项目分层与最佳实践
- 15. 常见面试题

**三、🔴 高级实战**
- 2. 中间件机制 (源码级)
- 5. 错误处理
- 8. 文件上传与流式响应
- 9. 安全实践
- 10. 性能与可扩展性
- 14. Express 5 主要变更

---

## 一、🟢 初级入门

> 面向零基础到能独立写出一个 REST API 的读者。先能跑起来，再谈原理。

### <span class="lv lv-1">初级</span> 0.1 Express 是什么 & 一句话对比

Express 是 Node.js 上最流行的极简 Web 框架，本质是**基于原生 `http` 模块封装的"中间件调度器 + 路由器"**。

| 框架 | 一句话定位 |
| --- | --- |
| 原生 `http` | 只有 req/res，路由/中间件/body 解析全靠自己写 |
| **Express** | 中间件洋葱模型 + 路由 DSL，生态最大最稳，回调风格 |
| Koa | Express 原班人马新作，基于 async/await，更薄更现代 |
| Fastify | 主打高性能 + JSON Schema 校验，插件体系严格 |
| NestJS | 上层框架（默认基于 Express），带 DI、装饰器、模块化架构 |

💡 学 Node Web 开发，Express 依旧是第一课，也是理解 Koa / Nest 的地基。

🎯 记住定位：**Express = 极简 + 生态大 + 中间件模型**。

---

### <span class="lv lv-1">初级</span> 0.2 安装 & Hello World

```bash
mkdir hello-express && cd hello-express
npm init -y
npm i express
```

`app.js`：

```js
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello Express'))

app.listen(3000, () => console.log('http://localhost:3000'))
```

启动 & 验证：

```bash
node app.js
curl http://localhost:3000
# Hello Express
```

💡 `app.listen` 内部就是 `http.createServer(app).listen(...)`，`app` 本质是个 `(req,res)=>void` 函数。

🎯 只要 5 行代码就能跑起一个 HTTP 服务，比原生 `http` 少写大量样板。

---

### <span class="lv lv-1">初级</span> 0.3 路由基础

Express 支持 HTTP 全部动词。路径参数用 `:name`，query 用 `?a=1&b=2`。

```js
app.get('/users', (req, res) => res.json([{ id: 1 }]))
app.post('/users', (req, res) => res.status(201).json({ id: 2 }))
app.put('/users/:id', (req, res) => res.json({ id: req.params.id }))
app.patch('/users/:id', (req, res) => res.json({ patched: true }))
app.delete('/users/:id', (req, res) => res.status(204).end())

// query: /search?kw=js&page=2
app.get('/search', (req, res) => {
  const { kw, page = '1' } = req.query
  res.json({ kw, page: Number(page) })
})
```

测试：

```bash
curl http://localhost:3000/users/42
curl "http://localhost:3000/search?kw=express&page=3"
```

💡 `req.params` 来自路径（**字符串**），`req.query` 来自 URL 查询串（同样是**字符串**，需要手动转数字）。

🎯 REST 风格 = 动词 + 资源路径，Express 让这套映射非常自然。

---

### <span class="lv lv-1">初级</span> 0.4 req / res 常用速查

**req 高频属性**

| 属性 | 含义 | 示例 |
| --- | --- | --- |
| `req.params` | 路径参数 | `/u/:id` → `req.params.id` |
| `req.query` | 查询字符串对象 | `?a=1` → `req.query.a` |
| `req.body` | 请求体（需 body parser） | `{ name: 'x' }` |
| `req.headers` | 请求头对象 | `req.headers['content-type']` |
| `req.method` | HTTP 方法 | `'GET'` |
| `req.url` / `req.originalUrl` | 路径 | `/users?a=1` |
| `req.ip` | 客户端 IP | 需配合 `trust proxy` |

**res 高频方法**

```js
res.send('text')                       // 自动判断类型：字符串→text/html，Buffer→application/octet-stream
res.json({ ok: 1 })                    // 设置 JSON 响应
res.status(404).json({ msg: 'not found' })
res.set('X-Trace', 'abc')              // 设置响应头
res.redirect(302, '/login')            // 重定向
res.sendFile(__dirname + '/a.pdf')     // 发送文件（绝对路径）
res.cookie('token', 'xyz', { httpOnly: true })  // 设置 cookie
res.end()                              // 结束响应（无 body）
```

💡 `res.send` / `res.json` 内部都会调用 `res.end()`，**一次请求只能响应一次**，重复调用会抛 `Cannot set headers after they are sent`。

🎯 记住"链式调用 + 单次响应"，就能写 90% 的 API。

---

### <span class="lv lv-1">初级</span> 0.5 中间件是什么

**比喻**：请求进来像走一条流水线，每一站都是一个中间件，它可以：
- 读/改 `req` 和 `res`；
- 调 `next()` 把请求交给下一站；
- 不调 `next()` 直接响应，流水线终止。

```js
// 日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()  // 关键：不调 next 请求就卡住
})

// 鉴权中间件
app.use((req, res, next) => {
  if (!req.headers.authorization) return res.status(401).send('no token')
  next()
})

app.get('/', (req, res) => res.send('ok'))
```

💡 中间件按 **注册顺序** 执行，路由本身也是中间件，只是带路径匹配。

🎯 记住三件事：**顺序、`next()`、可提前响应**，中间件模型基本吃透。

---

### <span class="lv lv-1">初级</span> 0.6 官方内置中间件

```js
// JSON body 解析：Content-Type: application/json → req.body
app.use(express.json({ limit: '1mb' }))

// 表单 body 解析：Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// 静态资源：把 public/ 目录暴露到 URL 根路径
app.use(express.static('public'))
```

测试：

```bash
curl -X POST http://localhost:3000/echo \
  -H 'Content-Type: application/json' \
  -d '{"name":"jack"}'
```

```js
app.post('/echo', (req, res) => res.json(req.body))
```

💡 不加 `express.json()`，`req.body` 是 `undefined`。这是新手最常见的坑。

🎯 内置三件套：**json / urlencoded / static**，几乎每个项目都要用。

---

### <span class="lv lv-1">初级</span> 0.7 常用第三方中间件

```bash
npm i cors morgan helmet cookie-parser
```

```js
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

app.use(cors())              // 允许跨域（浏览器 CORS）
app.use(morgan('dev'))       // 请求日志：GET / 200 12ms
app.use(helmet())            // 一键设置一批安全响应头（CSP/HSTS 等）
app.use(cookieParser())      // 解析 Cookie → req.cookies
```

| 中间件 | 一句话作用 |
| --- | --- |
| `cors` | 处理跨域预检 & Access-Control-* 响应头 |
| `morgan` | 访问日志输出（开发/生产各有格式） |
| `helmet` | 默认 15 种安全头，防 XSS/点击劫持/嗅探等 |
| `cookie-parser` | 从 `Cookie` 头解析出 `req.cookies` 对象 |

💡 生产建议：`helmet` + `morgan` + `cors` 三件套是起手式。

🎯 别自己造轮子，社区中间件一行接入。

---

### <span class="lv lv-1">初级</span> 0.8 express.Router() 模块化路由

当路由多起来，全塞 `app.js` 会爆炸，用 `Router` 拆分模块。

**目录结构**：

```
src/
├── app.js
└── routes/
    ├── users.js
    └── posts.js
```

`routes/users.js`：

```js
const router = require('express').Router()

router.get('/', (req, res) => res.json([{ id: 1, name: 'Tom' }]))
router.get('/:id', (req, res) => res.json({ id: req.params.id }))
router.post('/', (req, res) => res.status(201).json(req.body))

module.exports = router
```

`routes/posts.js`：

```js
const router = require('express').Router()

router.get('/', (req, res) => res.json([{ id: 1, title: 'Hello' }]))
router.get('/:id', (req, res) => res.json({ id: req.params.id, title: 'X' }))

module.exports = router
```

`app.js`：

```js
const express = require('express')
const app = express()

app.use(express.json())
app.use('/users', require('./routes/users'))   // 挂载到 /users
app.use('/posts', require('./routes/posts'))

app.listen(3000)
```

访问 `/users/1` 实际命中 `routes/users.js` 的 `/:id`。

💡 `Router` 是一个"迷你 app"，同样支持 `.use / .get / .post`，可嵌套。

🎯 一个模块一个 Router，工程可维护性瞬间上一个台阶。

---

### <span class="lv lv-1">初级</span> 0.9 POST /login 最小实现

```js
app.post('/login', (req, res) => {
  const { username, password } = req.body

  // 1. 参数校验
  if (!username || !password) {
    return res.status(400).json({ msg: 'username & password required' })
  }

  // 2. 假登录（真项目要查库 + bcrypt.compare）
  if (username !== 'admin' || password !== '123456') {
    return res.status(401).json({ msg: 'invalid credentials' })
  }

  // 3. 返回 token（真项目用 jsonwebtoken.sign）
  res.json({ token: 'fake-jwt-token-abc123', expiresIn: 3600 })
})
```

测试：

```bash
curl -X POST http://localhost:3000/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"123456"}'
```

💡 校验 → 业务 → 响应，三段式清晰即可，中级章节会讲 `zod` 做参数 schema 校验。

🎯 一个 handler 内部就是"校验 → 处理 → 响应"，是所有接口的通用套路。

---

### <span class="lv lv-1">初级</span> 0.10 静态资源托管

```
project/
├── app.js
└── public/
    ├── index.html
    ├── logo.png
    └── css/style.css
```

```js
app.use(express.static('public'))
```

访问：
- `http://localhost:3000/index.html` → `public/index.html`
- `http://localhost:3000/logo.png` → `public/logo.png`
- `http://localhost:3000/css/style.css` → `public/css/style.css`

带前缀挂载：

```js
app.use('/static', express.static('public'))
// → /static/logo.png
```

💡 `express.static` 内部基于 `serve-static`，自动处理 `Content-Type`、`ETag`、`Last-Modified`。

🎯 前后端不分离的项目直接托管；分离项目改用 nginx/CDN。

---

### <span class="lv lv-1">初级</span> 0.11 环境变量：dotenv + .env

```bash
npm i dotenv
```

`.env`（**不要提交到 Git**，加 `.gitignore`）：

```
PORT=4000
NODE_ENV=development
DB_URL=mysql://root:123@localhost:3306/demo
```

`app.js` 顶部：

```js
require('dotenv').config()

const port = process.env.PORT || 3000
const dbUrl = process.env.DB_URL

app.listen(port, () => console.log(`server on :${port}`))
```

💡 `process.env.XXX` 的值**永远是 string**，需要数字要 `Number(...)`，布尔要判断字符串。

🎯 配置外置 → 不同环境（dev / staging / prod）只换 `.env`，代码不动。

---

### <span class="lv lv-1">初级</span> 0.12 热重启：nodemon / tsx --watch

**JS 项目**：

```bash
npm i -D nodemon
npx nodemon app.js
# 或 package.json: "dev": "nodemon app.js"
```

**TypeScript 项目**：

```bash
npm i -D tsx
npx tsx watch src/app.ts
# 或 "dev": "tsx watch src/app.ts"
```

保存文件即自动重启，开发效率翻倍。

💡 生产环境**不要用** nodemon/tsx，用 `pm2` 或 `node dist/app.js`。

🎯 dev 用 watch，prod 用编译产物 + 进程守护。

---

### <span class="lv lv-1">初级</span> 0.13 完整案例：内存 Todo REST API

一个 60 行以内的最小可跑 API，含 GET/POST/PUT/DELETE 四种操作。

```js
const express = require('express')
const app = express()

app.use(express.json())

// 内存"数据库"
let todos = [
  { id: 1, title: '学 Express', done: false },
  { id: 2, title: '写 REST API', done: false }
]
let nextId = 3

// 列表
app.get('/todos', (req, res) => {
  res.json(todos)
})

// 详情
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === Number(req.params.id))
  if (!todo) return res.status(404).json({ msg: 'not found' })
  res.json(todo)
})

// 新建
app.post('/todos', (req, res) => {
  const { title } = req.body
  if (!title) return res.status(400).json({ msg: 'title required' })
  const todo = { id: nextId++, title, done: false }
  todos.push(todo)
  res.status(201).json(todo)
})

// 更新
app.put('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === Number(req.params.id))
  if (!todo) return res.status(404).json({ msg: 'not found' })
  const { title, done } = req.body
  if (title !== undefined) todo.title = title
  if (done !== undefined) todo.done = done
  res.json(todo)
})

// 删除
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id)
  const before = todos.length
  todos = todos.filter(t => t.id !== id)
  if (todos.length === before) return res.status(404).json({ msg: 'not found' })
  res.status(204).end()
})

app.listen(3000, () => console.log('Todo API on http://localhost:3000'))
```

测试脚本：

```bash
curl http://localhost:3000/todos
curl -X POST http://localhost:3000/todos -H 'Content-Type: application/json' -d '{"title":"读文档"}'
curl -X PUT  http://localhost:3000/todos/1 -H 'Content-Type: application/json' -d '{"done":true}'
curl -X DELETE http://localhost:3000/todos/2
```

💡 恭喜！这就是一个完整 REST API 的雏形，剩下的就是把数组换成数据库（MySQL/MongoDB）。

🎯 初级阶段完美收官：**能启动、能路由、会中间件、会 Router、能写 CRUD**。下一步进入中级，理解机制和 TypeScript 化。

---

## 二、🟡 中级进阶

> 从"会用"到"用好"：理解请求响应细节、模块化组织、类型化、测试与分层。

## <span class="lv lv-2">中级</span> 1. Express 是什么

Express 是基于 Node 原生 HTTP 模块的极简 Web 框架，核心模型：**洋葱式中间件 + 路由**。生态成熟，但不像 Koa 是基于 async/await，错误传播需手动 `next(err)`（5.x 改善）。

```js
import express from 'express'
const app = express()

app.use(express.json())
app.get('/hello', (req, res) => res.json({ msg: 'hi' }))
app.listen(3000)
```

---

## <span class="lv lv-2">中级</span> 3. 路由系统

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

## <span class="lv lv-2">中级</span> 4. 请求与响应对象

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

## <span class="lv lv-2">中级</span> 6. 模板与静态资源

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

## <span class="lv lv-2">中级</span> 7. Cookie / Session / JWT

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

## <span class="lv lv-2">中级</span> 11. 与 TypeScript 集成

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

## <span class="lv lv-2">中级</span> 12. 测试

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

## <span class="lv lv-2">中级</span> 13. 项目分层与最佳实践

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

## <span class="lv lv-2">中级</span> 15. 常见面试题

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

## 三、🔴 高级实战

> 深入源码、错误链路、流式与安全、性能调优与 5.x 迁移。

## <span class="lv lv-3">高级</span> 2. 中间件机制 (源码级)

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

## <span class="lv lv-3">高级</span> 5. 错误处理

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

## <span class="lv lv-3">高级</span> 8. 文件上传与流式响应

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

## <span class="lv lv-3">高级</span> 9. 安全实践

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

## <span class="lv lv-3">高级</span> 10. 性能与可扩展性

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

## <span class="lv lv-3">高级</span> 14. Express 5 主要变更

- **自动 catch async 错误**：返回 Promise 的 handler 自动 reject 时走错误中间件；
- 移除 `res.json(status, body)` / `res.jsonp(status, body)` 等签名；
- 路径模式语法变更（path-to-regexp v6 → 7）：通配 `*` 改为命名形式 `*splat`；
- 默认 `req.query` 为 `simple` 解析；
- 节点最低 Node 18。

迁移：检查路由通配符、错误中间件、第三方中间件兼容性。

---

> 推荐阅读：Express 官方源码（`router/index.js`、`router/layer.js`、`response.js`）、`expressjs/express` issue 区、《Building APIs with Node.js》。

---

## <span class="lv lv-3">高级</span> 附录 A：Express 5 + TS 生产级脚手架（2025）

> 一份可 clone 即跑的 **Express 5 + TypeScript + Prisma + Zod + pino + Swagger + Docker + CI** 完整骨架，覆盖岗位实战全链路：环境校验、分层架构、类型安全校验、双 Token JWT、结构化日志、自动化 API 文档、容器化部署与 CI/CD。所有代码可直接抄进项目。💡 全部围绕"**生产可用**"打磨，不再重复解释语法。

### A.1 技术栈选型（2025 主流稳定组合）

💡 选型原则：**类型端到端 + 生态成熟 + 面试加分 + 部署轻量**。

| 分层 | 选择 | 理由 |
|------|------|------|
| Web 框架 / 语言 / 运行时 | **Express 5.0.1** + TypeScript 5.5+ + Node 20 LTS | async 错误自动捕获、`strict` 全开、内置 fetch/ALS |
| ORM / 校验 | **Prisma 5.x** + **zod 3.23** + `zod-to-openapi` | 端到端类型；schema 一次写、DTO+文档全生成 |
| 日志 / 上下文 | **pino 9** + `pino-http` + `AsyncLocalStorage` | 结构化 JSON、traceId 无侵入透传 |
| JWT / 安全 | **jose 5** + `helmet` + `cors` + `express-rate-limit` + `hpp` | Web Crypto、EdDSA/JWKS；一行加固 |
| 文档 / 测试 | `swagger-ui-express` + **vitest** + `supertest` | 零手写文档；ESM、TS 原生、比 jest 快 5x |
| 构建 / 部署 / CI | `tsx`(dev) + `tsup`(build) + Docker 多阶段 + `pm2` + GitHub Actions | 秒级冷启动、镜像 < 150MB |

🎯 面试常被追问："**为什么不用 Fastify？**" 回答见 A.7 对比表。

### A.2 目录结构（controller / service / repository 分层）

💡 一句话：**外层（route/controller）只管 HTTP，内层（service）只管业务，最底层（repository）只碰数据库**——每一层都可单测。

```bash
express5-ts-starter/
├── prisma/                     # schema.prisma / migrations / seed.ts
├── src/
│   ├── config/env.ts           # zod 校验环境变量
│   ├── plugins/                # logger.ts / openapi.ts / prisma.ts
│   ├── middlewares/            # validate / auth / error / notFound / traceId
│   ├── modules/
│   │   ├── auth/               # dto / service / controller / routes
│   │   ├── user/               # dto / repository / service / controller / routes
│   │   └── post/               # ...
│   ├── utils/                  # asyncLocal.ts / AppError.ts / jwt.ts
│   ├── routes/index.ts         # 汇总所有模块 route
│   ├── app.ts                  # Express app 装配
│   └── server.ts               # 启动 + 优雅退出
├── tests/                      # setup.ts / *.test.ts (vitest + supertest)
├── .env.example / .dockerignore / Dockerfile / docker-compose.yml
├── ecosystem.config.js / tsconfig.json / tsup.config.ts / vitest.config.ts
├── package.json
└── .github/workflows/ci.yml
```

🎯 记忆口诀：**"路由收 → 控制器转 → 服务算 → 仓库存"**，dto 全程护航。

### A.3 关键源码（可直接抄）

💡 以下每一份都精简到"最少但够用"，保留生产必备（错误传播、类型推导、可测试性）。

#### A.3.1 `src/config/env.ts`——环境变量 zod 校验

```ts
import { z } from 'zod';
import 'dotenv/config';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  REDIS_URL:    z.string().url().optional(),
  JWT_ACCESS_SECRET:  z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL:  z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('7d'),
  LOG_LEVEL:   z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  CORS_ORIGIN: z.string().default('*'),
});
const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) { console.error('Invalid env vars:', parsed.error.flatten().fieldErrors); process.exit(1); }

export const env = parsed.data;
export type Env  = z.infer<typeof EnvSchema>;
```

🎯 **启动即校验**——环境错误在 30ms 内挂掉，永远不会带着错误配置跑到线上。

#### A.3.2 `src/app.ts`——应用装配

```ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import { pinoHttp } from 'pino-http';
import { logger } from './plugins/logger';
import { traceIdMiddleware } from './middlewares/traceId';
import { errorHandler } from './middlewares/error';
import { notFound } from './middlewares/notFound';
import { registerRoutes } from './routes';
import { setupSwagger } from './plugins/openapi';
import { env } from './config/env';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);                                       // 反向代理下拿到真实 IP
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(hpp());
  app.use(express.json({ limit: '1mb' }));                          // Express 5 内置 body 解析
  app.use(express.urlencoded({ extended: true }));
  app.use(traceIdMiddleware);
  app.use(pinoHttp({ logger }));
  app.use('/api', rateLimit({ windowMs: 60_000, max: 300 }));       // 全局兜底
  registerRoutes(app);
  setupSwagger(app);
  app.use(notFound);
  app.use(errorHandler);                                            // 必须最后
  return app;
}
```

#### A.3.3 `src/server.ts`——启动 + 优雅退出

```ts
import { createApp } from './app';
import { env } from './config/env';
import { logger } from './plugins/logger';
import { prisma } from './plugins/prisma';

const server = createApp().listen(env.PORT, () => {
  logger.info(`Server ready at http://localhost:${env.PORT}   |   Docs at /docs`);
});

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down...');
  server.close(async () => { await prisma.$disconnect(); process.exit(0); });
  setTimeout(() => process.exit(1), 15_000).unref();          // 15s 强杀兜底
}
['SIGINT', 'SIGTERM'].forEach((s) => process.on(s, () => shutdown(s)));
process.on('unhandledRejection', (err) => logger.error({ err }, 'unhandledRejection'));
process.on('uncaughtException',  (err) => { logger.fatal({ err }, 'uncaughtException'); shutdown('uncaughtException'); });
```

🎯 **优雅退出三件套**：`server.close` + 资源释放 + 兜底强杀，K8s 才会给 200。

#### A.3.4 `src/plugins/logger.ts`——pino + ALS traceId 注入

```ts
import pino from 'pino';
import { env } from '../config/env';
import { asyncLocal } from '../utils/asyncLocal';

export const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: 'express5-ts-starter', env: env.NODE_ENV },
  timestamp: pino.stdTimeFunctions.isoTime,
  mixin() {
    // 每条日志自动带上当前请求的 traceId
    const store = asyncLocal.getStore();
    return store?.traceId ? { traceId: store.traceId } : {};
  },
  transport:
    env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:HH:MM:ss.l' } }
      : undefined,
});
```

#### A.3.5 `src/utils/asyncLocal.ts` + `src/middlewares/traceId.ts`

```ts
// utils/asyncLocal.ts
import { AsyncLocalStorage } from 'node:async_hooks';
export interface RequestContext { traceId: string; userId?: string }
export const asyncLocal = new AsyncLocalStorage<RequestContext>();

// middlewares/traceId.ts
import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

export const traceIdMiddleware: RequestHandler = (req, res, next) => {
  // 兼容 W3C Trace Context: traceparent = 00-<trace-id>-<parent-id>-<flags>
  const incoming = req.header('traceparent')?.split('-')[1];
  const traceId  = incoming ?? randomUUID().replace(/-/g, '');
  res.setHeader('x-trace-id', traceId);
  asyncLocal.run({ traceId }, () => next());
};
```

💡 任意 service / repository 里 `asyncLocal.getStore()?.traceId` 就能拿到——**跨异步、无参数透传**。

#### A.3.6 `src/middlewares/validate.ts`——zod 统一校验

```ts
import type { AnyZodObject, ZodEffects } from 'zod';
import type { RequestHandler } from 'express';

type Schema = AnyZodObject | ZodEffects<AnyZodObject>;
export interface ValidateShape { body?: Schema; query?: Schema; params?: Schema }

/** 三段合一校验：任何一段失败就抛 400（交由 error.ts 统一格式化） */
export const validate = (shape: ValidateShape): RequestHandler => async (req, _res, next) => {
  try {
    if (shape.body)   req.body   = await shape.body.parseAsync(req.body);
    if (shape.query)  req.query  = await shape.query.parseAsync(req.query);
    if (shape.params) req.params = await shape.params.parseAsync(req.params);
    next();
  } catch (err) { next(err); }
};
```

🎯 **一个中间件搞定三处校验**，`parseAsync` 后 `req.body` 类型自动收窄。

#### A.3.7 `src/middlewares/auth.ts`——jose JWT 校验

```ts
import type { RequestHandler } from 'express';
import { jwtVerify } from 'jose';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { asyncLocal } from '../utils/asyncLocal';

const secret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);

export const authRequired: RequestHandler = async (req, _res, next) => {
  try {
    const token = req.header('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) throw new AppError(401, 'NO_TOKEN', 'Missing bearer token');
    const { payload } = await jwtVerify(token, secret, { issuer: 'express5-ts-starter', audience: 'web' });
    (req as any).user = { id: payload.sub, role: payload.role };
    const store = asyncLocal.getStore();
    if (store) store.userId = String(payload.sub);
    next();
  } catch { next(new AppError(401, 'INVALID_TOKEN', 'Token invalid or expired')); }
};
```

#### A.3.8 `src/middlewares/error.ts` + `utils/AppError.ts`——统一错误响应

```ts
// utils/AppError.ts
export class AppError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

// middlewares/error.ts
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { asyncLocal } from '../utils/asyncLocal';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const traceId = asyncLocal.getStore()?.traceId;
  req.log?.error({ err, traceId }, 'request error');

  if (err instanceof ZodError)
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid request', details: err.flatten(), traceId });

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') return res.status(409).json({ code: 'DUPLICATE',  message: 'Resource exists',  traceId });
    if (err.code === 'P2025') return res.status(404).json({ code: 'NOT_FOUND',  message: 'Resource missing', traceId });
  }

  if (err instanceof AppError)
    return res.status(err.status).json({ code: err.code, message: err.message, traceId });

  res.status(500).json({ code: 'INTERNAL', message: 'Server error', traceId });
};
```

#### A.3.9 `src/modules/user/user.routes.ts`——一个完整 REST 模块

```ts
import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middlewares/validate';
import { authRequired } from '../../middlewares/auth';
import * as ctrl from './user.controller';

export const UserIdParam    = z.object({ id: z.string().uuid() });
export const CreateUserBody = z.object({
  email: z.string().email(), name: z.string().min(1).max(50), password: z.string().min(8),
});
export const ListUserQuery  = z.object({
  page:    z.coerce.number().int().min(1).default(1),
  size:    z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().optional(),
});

const r = Router();
r.get   ('/',      validate({ query:  ListUserQuery }),                    ctrl.list);
r.get   ('/:id',   validate({ params: UserIdParam }),                      ctrl.detail);
r.post  ('/',      validate({ body:   CreateUserBody }),                   ctrl.create);
r.patch ('/:id',   authRequired, validate({ params: UserIdParam }),        ctrl.update);
r.delete('/:id',   authRequired, validate({ params: UserIdParam }),        ctrl.remove);
export default r;
```

```ts
// user.controller.ts —— 只搬 HTTP，不写业务
import type { RequestHandler } from 'express';
import * as svc from './user.service';

export const list:   RequestHandler = async (req, res) => res.json({ code: 'OK', data: await svc.list(req.query as any) });
export const detail: RequestHandler = async (req, res) => res.json({ code: 'OK', data: await svc.detail(req.params.id) });
export const create: RequestHandler = async (req, res) => res.status(201).json({ code: 'OK', data: await svc.create(req.body) });
export const update: RequestHandler = async (req, res) => res.json({ code: 'OK', data: await svc.update(req.params.id, req.body) });
export const remove: RequestHandler = async (req, res) => { await svc.remove(req.params.id); res.status(204).end(); };
```

```ts
// user.service.ts + user.repository.ts —— 服务层做业务，仓库层封装 prisma
import { prisma } from '../../plugins/prisma';
import { AppError } from '../../utils/AppError';
import bcrypt from 'bcryptjs';

// repository
const repo = {
  list: ({ page, size, keyword }: { page: number; size: number; keyword?: string }) =>
    prisma.$transaction([
      prisma.user.count({ where: keyword ? { name: { contains: keyword } } : {} }),
      prisma.user.findMany({ where: keyword ? { name: { contains: keyword } } : {},
        skip: (page - 1) * size, take: size, orderBy: { createdAt: 'desc' } }),
    ]).then(([total, items]) => ({ total, items })),
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),
  create:   (data: any)  => prisma.user.create({ data }),
  update:   (id: string, data: any) => prisma.user.update({ where: { id }, data }),
  remove:   (id: string) => prisma.user.delete({ where: { id } }),
};

// service
export const list   = (q: any) => repo.list(q);
export const detail = async (id: string) => {
  const u = await repo.findById(id);
  if (!u) throw new AppError(404, 'USER_NOT_FOUND', 'user not found');
  return u;
};
export const create = async (dto: { email: string; name: string; password: string }) =>
  repo.create({ ...dto, password: await bcrypt.hash(dto.password, 10) });
export const update = (id: string, dto: any) => repo.update(id, dto);
export const remove = (id: string) => repo.remove(id);
```

#### A.3.10 `prisma/schema.prisma`

```ts
generator client { provider = "prisma-client-js" }
datasource db    { provider = "postgresql" url = env("DATABASE_URL") }

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  role      String   @default("user")
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
model Post {
  id        String    @id @default(uuid())
  title     String
  content   String
  author    User      @relation(fields: [authorId], references: [id])
  authorId  String
  comments  Comment[]
  createdAt DateTime  @default(now())
}
model Comment {
  id        String   @id @default(uuid())
  body      String
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  createdAt DateTime @default(now())
}
```

#### A.3.11 `tests/user.test.ts`（vitest + supertest）

```ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();
describe('User API', () => {
  it('POST /api/users -> 201', async () => {
    const res = await request(app).post('/api/users').send({ email: 't@x.io', name: 'tom', password: 'secret12' });
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBeDefined();
  });
  it('GET /api/users -> 200 + pagination', async () => {
    const res = await request(app).get('/api/users?page=1&size=10');
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBeGreaterThan(0);
  });
  it('GET /api/users/:id -> 404', async () => {
    const res = await request(app).get(`/api/users/${'0'.repeat(36)}`);
    expect(res.status).toBe(404);
  });
});
```

🎯 vitest 天生 ESM + TS，`vitest --coverage` 一键出报告。

### A.4 JWT 现代化：refresh 双 Token + JWKS + jose

💡 access token 只能存内存/localStorage、**短命 15min**；refresh token 装 **httpOnly cookie**、7 天，登出可撤销。RS256/EdDSA 非对称签名让**校验服务无需知道私钥**，跨服务共享 JWKS。

#### A.4.1 `src/utils/jwt.ts`

```ts
import { SignJWT, jwtVerify, createRemoteJWKSet } from 'jose';
import { env } from '../config/env';

const accessSecret  = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const refreshSecret = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

export const signAccessToken = (payload: { sub: string; role: string }) =>
  new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt()
    .setIssuer('express5-ts-starter').setAudience('web')
    .setExpirationTime(env.JWT_ACCESS_TTL).setJti(crypto.randomUUID())
    .sign(accessSecret);

export const signRefreshToken = (payload: { sub: string }) =>
  new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt()
    .setExpirationTime(env.JWT_REFRESH_TTL).setJti(crypto.randomUUID())
    .sign(refreshSecret);

export const verifyAccess  = (t: string) => jwtVerify(t, accessSecret,  { issuer: 'express5-ts-starter', audience: 'web' });
export const verifyRefresh = (t: string) => jwtVerify(t, refreshSecret);

/** 生产 RS256 + JWKS 示例：跨服务共享公钥、无需私钥即可校验 */
export const verifyByJwks = (token: string) =>
  jwtVerify(token, createRemoteJWKSet(new URL('https://issuer.example.com/.well-known/jwks.json')),
    { issuer: 'https://issuer.example.com', audience: 'web' });
```

#### A.4.2 三个接口：login / refresh / logout

```ts
// modules/auth/auth.controller.ts
import type { RequestHandler } from 'express';
import { signAccessToken, signRefreshToken, verifyRefresh } from '../../utils/jwt';
import { AppError } from '../../utils/AppError';
import { redis } from '../../plugins/prisma'; // 假设导出 redis 单例

export const login: RequestHandler = async (req, res) => {
  const user = await validateUser(req.body.email, req.body.password); // 略
  const access  = await signAccessToken({ sub: user.id, role: user.role });
  const refresh = await signRefreshToken({ sub: user.id });
  res.cookie('rt', refresh, { httpOnly: true, sameSite: 'lax', secure: true, path: '/api/auth', maxAge: 7 * 864e5 });
  res.json({ code: 'OK', data: { accessToken: access } });
};

export const refresh: RequestHandler = async (req, res) => {
  const rt = req.cookies?.rt;
  if (!rt) throw new AppError(401, 'NO_REFRESH', 'missing refresh token');
  const { payload } = await verifyRefresh(rt);
  if (await redis.sismember('rt:blacklist', String(payload.jti)))
    throw new AppError(401, 'REFRESH_REVOKED', 'refresh revoked');
  const access = await signAccessToken({ sub: String(payload.sub), role: 'user' });
  res.json({ code: 'OK', data: { accessToken: access } });
};

export const logout: RequestHandler = async (req, res) => {
  const rt = req.cookies?.rt;
  if (rt) {
    const { payload } = await verifyRefresh(rt);
    await redis.sadd('rt:blacklist', String(payload.jti));      // 撤销直到自然过期
    await redis.expire('rt:blacklist', 7 * 86400);
  }
  res.clearCookie('rt', { path: '/api/auth' });
  res.status(204).end();
};
```

🎯 **面试点**：黑名单只装 JTI 而非整个 token，Redis 内存开销可忽略；配合 access 短 TTL，即使被盗 15 分钟后自动失效。

### A.5 pino + traceId 结构化日志

💡 生产环境**永远不要 console.log**。pino 是社区公认最快、体积最小的 JSON logger（Fastify 内置）。

#### A.5.1 定制 pino-http 日志等级 & 字段

```ts
// 在 app.ts 里替换默认 pinoHttp 装配
app.use(pinoHttp({
  logger,
  customLogLevel: (_req, res, err) =>
    err || res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
  serializers: {
    req: (req) => ({ method: req.method, url: req.url, remoteAddress: req.remoteAddress }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
}));
```

#### A.5.2 W3C Trace Context 透传 + 上生产

`traceparent` header 由上游（网关/前端 OpenTelemetry SDK）传入，格式 `00-<32hex trace-id>-<16hex span-id>-<flags>`。已在 `traceIdMiddleware` 中提取；下游调用主动透传：

```ts
import { asyncLocal } from './utils/asyncLocal';
export function tracedFetch(url: string, init: RequestInit = {}) {
  const traceId = asyncLocal.getStore()?.traceId;
  return fetch(url, { ...init,
    headers: { ...init.headers, traceparent: `00-${traceId}-${randomSpanId()}-01` } });
}
```

生产接 ES / Loki：

```bash
node --env-file=.env dist/server.js | pino-elasticsearch --index "app-%{DATE}" --node http://es:9200
```

🎯 一条日志=一次请求全链路可查：`traceId` 串联 Nginx → Node → DB slow log。

### A.6 zod-to-openapi 自动生成 Swagger

💡 **一次 zod schema，四处受益**：请求校验、TS 类型、API 文档、前端 SDK 生成（`openapi-typescript`）。

#### A.6.1 装配

```ts
// src/plugins/openapi.ts
import { OpenAPIRegistry, OpenApiGeneratorV31, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';
import { z } from 'zod';
import { CreateUserBody, ListUserQuery } from '../modules/user/user.routes';

extendZodWithOpenApi(z);
export const registry = new OpenAPIRegistry();

registry.registerPath({
  method: 'get', path: '/api/users', summary: 'List users', tags: ['User'],
  request: { query: ListUserQuery },
  responses: { 200: { description: 'OK', content: { 'application/json': { schema: z.object({
    code: z.string(),
    data: z.object({ total: z.number(), items: z.array(z.object({ id: z.string(), email: z.string(), name: z.string() })) }),
  }) } } } },
});
registry.registerPath({
  method: 'post', path: '/api/users', summary: 'Create user', tags: ['User'],
  request: { body: { content: { 'application/json': { schema: CreateUserBody } } } },
  responses: { 201: { description: 'Created' } },
});

export function setupSwagger(app: Express) {
  const doc = new OpenApiGeneratorV31(registry.definitions).generateDocument({
    openapi: '3.1.0',
    info: { title: 'Express5 TS Starter', version: '1.0.0' },
    servers: [{ url: '/' }],
  });
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc));
  app.get('/openapi.json', (_req, res) => res.json(doc));
}
```

#### A.6.2 生成的 `openapi.json`（片段）

```json
{
  "openapi": "3.1.0",
  "info": { "title": "Express5 TS Starter", "version": "1.0.0" },
  "paths": { "/api/users": { "post": {
    "tags": ["User"], "summary": "Create user",
    "requestBody": { "content": { "application/json": { "schema": {
      "type": "object",
      "properties": {
        "email":    { "type": "string", "format": "email" },
        "name":     { "type": "string", "minLength": 1, "maxLength": 50 },
        "password": { "type": "string", "minLength": 8 }
      },
      "required": ["email", "name", "password"]
    } } } },
    "responses": { "201": { "description": "Created" } }
  } } }
}
```

🎯 前端拿到 `openapi.json` 后直接 `npx openapi-typescript openapi.json -o api.d.ts`——**前后端零手写对接**。

### A.7 与 Fastify / Hono / Elysia 对比选型

💡 三个"新贵"都主打**性能 + Schema-first**，但 Express 5 仍是**招聘量 & 生态第一**。

| 维度 | Express 5 | Fastify 4 | Hono 4 | Elysia (Bun) |
|------|-----------|-----------|--------|--------------|
| Runtime         | Node          | Node          | Node/Bun/Deno/Edge | Bun 优先 |
| 类型友好        | ★★★☆（需自封） | ★★★★（内置 TS） | ★★★★★（端到端）    | ★★★★★    |
| Schema          | zod/joi 外接  | AJV 内置       | zod/valibot 内置    | typebox 内置 |
| req/s（HelloWorld）| ~15k       | ~45k          | ~55k（Node）       | ~90k（Bun） |
| P99 延迟 / 内存 | ~2ms / 55MB   | ~1ms / 40MB   | ~0.8ms / 35MB      | ~0.5ms / 25MB |
| 中间件生态      | ★★★★★（最广） | ★★★★          | ★★★                | ★★       |
| 部署平台        | 任何          | 任何           | CF Workers / Vercel Edge / Deno Deploy | Bun host |
| 招聘匹配度      | ★★★★★         | ★★★★          | ★★★                | ★★       |

🎯 **决策建议**：传统后端 / 团队熟悉度优先 → **Express 5**；纯 API 网关高并发 → **Fastify**；边缘计算 (CF Workers / Vercel Edge) → **Hono**；敢用 Bun / 追求极致 DX → **Elysia**。

### A.8 生产交付形态

💡 三件套：**Docker 镜像 + Compose 联调 + GitHub Actions 全自动**。

#### A.8.1 Dockerfile（多阶段 + 非 root）

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm prisma generate && pnpm build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/dist          ./dist
COPY --from=build --chown=app:app /app/node_modules  ./node_modules
COPY --from=build --chown=app:app /app/prisma        ./prisma
COPY --from=build --chown=app:app /app/package.json  ./
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]
```

#### A.8.2 `docker-compose.yml`（app + postgres + redis）

```yaml
version: '3.9'
services:
  app:
    build: .
    ports: ['3000:3000']
    env_file: .env
    depends_on: { postgres: { condition: service_healthy }, redis: { condition: service_started } }
    restart: unless-stopped
  postgres:
    image: postgres:16-alpine
    environment: { POSTGRES_USER: app, POSTGRES_PASSWORD: app, POSTGRES_DB: app }
    volumes: ['pgdata:/var/lib/postgresql/data']
    healthcheck: { test: ['CMD-SHELL', 'pg_isready -U app'], interval: 5s, retries: 10 }
    ports: ['5432:5432']
  redis:
    image: redis:7-alpine
    ports: ['6379:6379']
volumes: { pgdata: {} }
```

#### A.8.3 `ecosystem.config.js`（PM2 cluster）

```ts
module.exports = {
  apps: [{
    name: 'express5-ts', script: 'dist/server.js',
    instances: 'max', exec_mode: 'cluster',
    max_memory_restart: '512M', kill_timeout: 15000,   // 与 A.3.3 优雅退出兜底一致
    env_production: { NODE_ENV: 'production' },
  }],
};
```

#### A.8.4 `.env.example` + npm scripts

```bash
# .env.example
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://app:app@localhost:5432/app
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=please-change-me-please-change-me
JWT_REFRESH_SECRET=please-change-me-please-change-me
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:5173
```

```json
{
  "scripts": {
    "dev":   "tsx watch src/server.ts",
    "build": "tsup src/server.ts --format esm --dts --clean",
    "start": "node dist/server.js",
    "test":  "vitest",
    "lint":  "eslint . --ext .ts",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed":    "tsx prisma/seed.ts",
    "docker:up":      "docker compose up -d"
  }
}
```

#### A.8.5 GitHub Actions CI（lint → test → build → docker push）

```yaml
name: CI
on: { push: { branches: [main] }, pull_request: { branches: [main] } }

jobs:
  build:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:  { POSTGRES_USER: app, POSTGRES_PASSWORD: app, POSTGRES_DB: app }
        ports: ['5432:5432']
        options: >-
          --health-cmd "pg_isready -U app" --health-interval 5s --health-retries 10
    env:
      DATABASE_URL: postgresql://app:app@localhost:5432/app
      JWT_ACCESS_SECRET:  ci-secret-ci-secret-ci-secret-ci
      JWT_REFRESH_SECRET: ci-secret-ci-secret-ci-secret-ci
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm prisma migrate deploy && pnpm lint && pnpm test && pnpm build

  docker:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: yourorg/express5-ts:latest
          cache-from: type=gha
          cache-to:   type=gha,mode=max
```

🎯 **一次 push = 自动 lint + 迁移 + 测试 + 构建 + 镜像推送**，团队再无"我本地能跑"。

### A.9 常见坑（生产血泪 Top 5）

💡 全是"栽过一次就永远记得"的坑。

1. **Express 5 async 错误传播**：返回 Promise 的 handler 自动走 error middleware，但 handler 内**同步 setTimeout 里抛错**仍无法捕获——回调里必须自己 `try/catch` 或用 `util.promisify`。
2. **body-parser 已内置，别再装**：`app.use(bodyParser.json())` 与 `express.json()` 叠用会导致 `req.body` 被覆盖为 `{}`；只留后者。
3. **helmet 默认 CSP 会挡前端**：vite dev 载入的内联 script 被拦；开发用 `helmet({ contentSecurityPolicy: false })` 或按需配置 `script-src`。
4. **cookie SameSite=None 必须配 Secure + HTTPS**：跨站前端拿 refresh cookie，本地 http 会被浏览器直接丢弃；本地改 `sameSite:'lax'` 或用 mkcert 起 HTTPS。
5. **`express-rate-limit` 在反向代理后取错 IP**：忘 `app.set('trust proxy', 1)` 则所有请求 IP 都是 `127.0.0.1`，一个人触发限流全站瘫；层数要和 Nginx `X-Forwarded-For` 对应。

🎯 学习秘诀：**先跑通 Express 5 最小骨架 → 逐个加 zod/JWT/pino/Swagger → 最后接 Docker/CI**，每一步都是"能落地的最小闭环"，遇到坑再回来对照 A.9。

