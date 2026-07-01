# Koa 全阶段学习手册

> 面向前端转全栈的开发者 —— "全栈偏前端，后端为辅"

---

## 目录

- [一、🟢 初级入门](#一-初级入门)
  - [1.1 Koa 是什么 & 与 Express 对比](#11-koa-是什么--与-express-对比)
  - [1.2 洋葱模型详解](#12-洋葱模型详解)
  - [1.3 项目初始化](#13-项目初始化)
  - [1.4 Context 对象](#14-context-对象)
  - [1.5 路由设计](#15-路由设计)
  - [1.6 中间件编写](#16-中间件编写)
  - [1.7 静态文件服务](#17-静态文件服务)
  - [1.8 请求体解析与文件上传](#18-请求体解析与文件上传)
  - [1.9 错误处理](#19-错误处理)
  - [1.10 Cookie 与 Session](#110-cookie-与-session)
- [二、🟡 中级进阶](#二-中级进阶)
  - [2.1 JWT 鉴权完整实现](#21-jwt-鉴权完整实现)
  - [2.2 路由模块化与自动加载](#22-路由模块化与自动加载)
  - [2.3 统一响应格式与错误码设计](#23-统一响应格式与错误码设计)
  - [2.4 请求参数校验](#24-请求参数校验)
  - [2.5 日志系统](#25-日志系统)
  - [2.6 跨域处理](#26-跨域处理)
  - [2.7 安全清单](#27-安全清单)
  - [2.8 与 MySQL 集成](#28-与-mysql-集成)
  - [2.9 与 MongoDB 集成](#29-与-mongodb-集成)
  - [2.10 与 Redis 集成](#210-与-redis-集成)
  - [2.11 文件上传进阶](#211-文件上传进阶)
  - [2.12 WebSocket](#212-websocket)
- [三、🔴 高级实战](#三-高级实战)
  - [3.1 Koa 中间件原理源码解读](#31-koa-中间件原理源码解读)
  - [3.2 TypeScript 完整项目脚手架](#32-typescript-完整项目脚手架)
  - [3.3 面试高频题 10 条](#33-面试高频题-10-条)

---

# 一、🟢 初级入门

## 1.1 Koa 是什么 & 与 Express 对比 <span class="lv lv-1">初级</span>

Koa 由 Express 原班团队打造，核心设计：**轻量内核**（不内置路由/模板/Body 解析）、**async/await 原生支持**、**洋葱模型**中间件。

### Koa vs Express 全维度对比

| 维度 | Express | Koa |
|------|---------|-----|
| **哲学** | "电池全含"——开箱即用 | "极简内核"——按需组合 |
| **中间件模型** | 线性（A→B→C） | 洋葱（A→B→C→B→A） |
| **异步处理** | 回调 / Promise 混用 | 原生 async/await |
| **路由** | 内置 `express.Router()` | 需安装 `@koa/router` |
| **Body 解析** | 内置 `express.json()` | 需安装 `koa-bodyparser` |
| **错误处理** | 回调 err 参数 / next(err) | try-catch + app.on('error') |
| **Context** | req / res 分离 | ctx 统一封装 |
| **生态体量** | 极大（10+ 年积累） | 中等（核心中间件齐全） |
| **TS 支持** | 社区 @types/express | 官方提供类型 |
| **适合场景** | 快速原型 / 传统 CRUD | API 服务 / 中间件编排 |

```
选型决策树：

  需要"开箱即用"？ ─是→ Express
       └否↓
  重视中间件编排 & 流控？ ─是→ Koa（洋葱模型）
       └否→ Express
  团队习惯 async/await？ ─是→ Koa（原生支持）
       └否→ Express
```

## 1.2 洋葱模型详解 <span class="lv lv-1">初级</span>

中间件以"洋葱"方式嵌套执行——请求从外到内，响应从内到外：

```
                    请求 Request
                       │
                       ▼
       ┌───────────────────────────────────┐
       │         Middleware A              │
       │   console.log('A-in')            │
       │         ┌───────────────────────┐ │
       │         │    Middleware B       │ │
       │         │  console.log('B-in')  │ │
       │         │     ┌─────────────┐   │ │
       │         │     │      C      │   │ │
       │         │     │ RouteHandler│   │ │
       │         │     └─────────────┘   │ │
       │         │  console.log('B-out') │ │
       │         └───────────────────────┘ │
       │   console.log('A-out')           │
       └───────────────────────────────────┘
                       │
                       ▼
                   响应 Response

执行顺序：A-in → B-in → C-in → C-out → B-out → A-out
```

```js
const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
  console.log('A-in')
  const start = Date.now()
  await next()
  console.log(`A-out [${Date.now() - start}ms]`)
})

app.use(async (ctx, next) => {
  console.log('B-in')
  await next()
  console.log('B-out')
})

app.use(async (ctx) => {
  console.log('C-in')
  ctx.body = 'Hello Koa'
  console.log('C-out')
})

app.listen(3000)
// 输出：A-in → B-in → C-in → C-out → B-out → A-out
```

### 洋葱 vs 线性

```
Express 线性：  req → m1 → m2 → m3 → res
                 （无法在 m1 拿到响应后时机）

Koa 洋葱：      req → m1 → m2 → m3
                    ← m1 ← m2 ← m3 ← res
                 （m1 可轻松拿到响应完成后的时机）
```

## 1.3 项目初始化 <span class="lv lv-1">初级</span>

```bash
mkdir koa-demo && cd koa-demo
npm init -y
npm i koa @koa/router koa-bodyparser koa-static
npm i -D nodemon
```

### 目录结构

```
koa-demo/
├── src/
│   ├── app.js              # 应用入口
│   ├── routes/             # 路由模块
│   ├── middleware/          # 自定义中间件
│   └── controller/         # 控制器
├── public/                 # 静态资源
└── package.json
```

### 最小可运行示例

```js
// src/app.js
const Koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')
const serve = require('koa-static')
const path = require('path')

const app = new Koa()
const router = new Router()

app.use(bodyParser())
app.use(serve(path.join(__dirname, '../public')))

router.get('/', (ctx) => { ctx.body = { msg: 'Koa is running!' } })

app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, () => console.log('http://localhost:3000'))
```

核心依赖一览：

| 包名 | 作用 | 替代方案 |
|------|------|---------|
| `koa` | 框架核心 | — |
| `@koa/router` | 路由 | `koa-router`（旧版） |
| `koa-bodyparser` | JSON/表单解析 | `koa-body`（含文件上传） |
| `koa-static` | 静态文件服务 | `koa-send` |

## 1.4 Context 对象 <span class="lv lv-1">初级</span>

`ctx` 是 Koa 最核心的对象，封装了 request 和 response：

```
┌─────────────── ctx ───────────────┐
│  ctx.request ──┐                  │
│  ctx.url       │ 等价快捷访问      │
│  ctx.method    │                  │
│  ctx.query     │                  │
│  ctx.header    │                  │
│                │                  │
│  ctx.response ─┤                  │
│  ctx.status    │ 等价快捷访问      │
│  ctx.body      │                  │
│  ctx.set()     │                  │
│                │                  │
│  便捷方法 ─────┤                  │
│  ctx.throw(status, msg)           │
│  ctx.assert(cond, status)         │
│  ctx.state  (跨中间件共享)        │
│  ctx.cookies                      │
└───────────────────────────────────┘
```

| 属性/方法 | 来源 | 说明 | 示例 |
|-----------|------|------|------|
| `ctx.query` | request | 查询参数对象 | `{ page: '1' }` |
| `ctx.params` | router | 路径参数 | `{ id: '42' }` |
| `ctx.request.body` | bodyparser | 请求体 | `{ name: 'Tom' }` |
| `ctx.header` | request | 请求头 | `{ authorization: '...' }` |
| `ctx.status` | response | 响应状态码 | `200` / `404` |
| `ctx.body` | response | 响应体 | string / object / Stream |
| `ctx.state` | — | 跨中间件共享数据 | `ctx.state.user = user` |
| `ctx.throw(status, msg)` | — | 抛出 HTTP 错误 | `ctx.throw(404, 'Not Found')` |
| `ctx.assert(cond, status)` | — | 断言不满足则抛 | `ctx.assert(id, 400)` |

```js
// ctx.throw 会自动设置 status 和 body
ctx.throw(403, '无权访问')
// 等价于：ctx.status = 403; ctx.body = { message: '无权访问' }

// 普通throw不会自动设置status
throw new Error('出错了')   // status 会是 500
```

## 1.5 路由设计 <span class="lv lv-1">初级</span>

```js
const Router = require('@koa/router')
const router = new Router()

// RESTful 风格
router.get('/users',       (ctx) => { /* 列表 */ })
router.post('/users',      (ctx) => { /* 创建 */ })
router.get('/users/:id',   (ctx) => { /* 详情 */ })
router.put('/users/:id',   (ctx) => { /* 更新 */ })
router.del('/users/:id',   (ctx) => { /* 删除 */ })

app.use(router.routes())
app.use(router.allowedMethods())  // 自动返回 405 / 501
```

### 参数获取

```js
// 路径参数 /users/42
router.get('/users/:id', (ctx) => { ctx.body = { id: ctx.params.id } })

// 查询参数 /users?page=1&size=10
router.get('/users', (ctx) => {
  const { page = 1, size = 10 } = ctx.query
  ctx.body = { page, size }
})

// 请求体（需 koa-bodyparser）
router.post('/users', (ctx) => {
  const { name, email } = ctx.request.body
  ctx.body = { name, email }
})
```

### 重定向与嵌套路由

```js
// 重定向
router.get('/old', (ctx) => { ctx.redirect('/new') })

// 前缀分组
const users = new Router({ prefix: '/users' })
users.get('/',     (ctx) => { ctx.body = '用户列表' })
users.get('/:id',  (ctx) => { ctx.body = `用户 ${ctx.params.id}` })

const posts = new Router({ prefix: '/posts' })
posts.get('/',     (ctx) => { ctx.body = '文章列表' })

app.use(users.routes())
app.use(posts.routes())
```

```
路由匹配流程：

  客户端请求 GET /users/42
       │
       ▼
  allowedMethods ── 方法不允许 → 405
       │
       ▼
  路由匹配 /users/:id ── 未匹配 → 404
       │
       ▼
  执行 handler，ctx.params.id = '42'
       │
       ▼
  响应结果
```

## 1.6 中间件编写 <span class="lv lv-1">初级</span>

```js
// 通用模板
app.use(async (ctx, next) => {
  // ── 前置逻辑（请求阶段）──
  console.log('请求进入')
  await next()   // ← 交给下一个中间件
  // ── 后置逻辑（响应阶段）──
  console.log('响应返回')
})
```

### 执行顺序

```js
app.use(async (ctx, next) => { console.log(1); await next(); console.log(2) })
app.use(async (ctx, next) => { console.log(3); await next(); console.log(4) })
app.use(async (ctx)        => { console.log(5); ctx.body = 'done'; console.log(6) })
// 输出：1 → 3 → 5 → 6 → 4 → 2

//   1   3   5
//   ────┬───┬───→ 请求方向
//       │   │
//   M1  │M2 │M3
//       │   │
//   ────┴───┴───→ 响应方向
//   2   4   6
```

### 常见中间件与注册顺序

```js
// 1. 计时中间件
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  ctx.set('X-Response-Time', `${Date.now() - start}ms`)
})

// 2. 认证中间件（前置拦截）
app.use(async (ctx, next) => {
  const token = ctx.header.authorization
  if (!token) ctx.throw(401, '未登录')
  ctx.state.user = decodeToken(token)
  await next()
})

// 3. 日志中间件
app.use(async (ctx, next) => {
  await next()
  console.log(`${ctx.method} ${ctx.url} → ${ctx.status}`)
})
```

注册顺序原则（从外到内）：

```
1. 错误处理中间件（最外层兜底）
2. 日志中间件
3. CORS / 安全相关中间件
4. Session / 认证中间件
5. bodyParser / 文件上传
6. 静态文件服务
7. 路由（最内层）
```

## 1.7 静态文件服务 <span class="lv lv-1">初级</span>

```js
const serve = require('koa-static')
const path = require('path')

app.use(serve(path.join(__dirname, '../public'), {
  maxage: 86400000,    // 缓存 1 天
  gzip: true,
  index: 'index.html'
}))
// 访问 http://localhost:3000/css/style.css 即可
```

单文件下载用 `koa-send`：

```js
const send = require('koa-send')
router.get('/download/:name', async (ctx) => {
  await send(ctx, ctx.params.name, { root: path.join(__dirname, '../files') })
})
```

## 1.8 请求体解析与文件上传 <span class="lv lv-1">初级</span>

### koa-bodyparser（JSON / 表单）

```js
const bodyParser = require('koa-bodyparser')
app.use(bodyParser({ enableTypes: ['json', 'form', 'text'], jsonLimit: '1mb' }))

router.post('/api/users', (ctx) => {
  ctx.body = { received: ctx.request.body }
})
```

### koa-body（支持文件上传）

```js
const koaBody = require('koa-body')
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 5 * 1024 * 1024,  // 5MB
    uploadDir: path.join(__dirname, '../uploads'),
    keepExtensions: true
  }
}))

router.post('/upload', (ctx) => {
  const file = ctx.request.files.file
  ctx.body = { name: file.originalFilename, size: file.size }
})
```

### @koa/multer（多文件）

```js
const multer = require('@koa/multer')
const upload = multer({ dest: 'uploads/' })

router.post('/upload/single', upload.single('avatar'), (ctx) => { ctx.body = { file: ctx.file } })
router.post('/upload/multi', upload.array('photos', 3), (ctx) => { ctx.body = { files: ctx.files } })
```

### 解析器对比

| 特性 | koa-bodyparser | koa-body | @koa/multer |
|------|---------------|----------|-------------|
| JSON / 表单 | ✅ | ✅ | ❌ |
| 文件上传 | ❌ | ✅ | ✅ |
| 推荐场景 | 纯 API | API + 上传 | 精细控制上传 |

## 1.9 错误处理 <span class="lv lv-1">初级</span>

三层错误处理架构：

```
第 1 层：try-catch（精确捕获单个路由错误）
  └─ 第 2 层：错误中间件（统一格式化响应）
       └─ 第 3 层：app.on('error')（兜底日志记录）
```

### 全局错误中间件（推荐）

```js
// 放在所有中间件最前面
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = {
      code: ctx.status,
      message: err.message,
      stack: process.env.NODE_ENV === 'dev' ? err.stack : undefined
    }
    ctx.app.emit('error', err, ctx)
  }
})

app.on('error', (err, ctx) => {
  console.error(`[${new Date().toISOString()}] ${ctx.method} ${ctx.url}`)
  console.error(err.stack)
})
```

### 自定义业务错误类

```js
class HttpError extends Error {
  constructor(status, message, code = -1) {
    super(message)
    this.status = status
    this.code = code
  }
}

// 使用
router.get('/vip', (ctx) => {
  if (!ctx.state.user.isVip) throw new HttpError(403, '仅 VIP 可访问', 40301)
  ctx.body = { data: 'VIP 内容' }
})
```

## 1.10 Cookie 与 Session <span class="lv lv-1">初级</span>

### Cookie

```js
// 设置
ctx.cookies.set('token', 'abc123', {
  maxAge: 86400000,    // 1 天
  httpOnly: true,      // JS 不可读（防 XSS）
  secure: true,        // 仅 HTTPS
  sameSite: 'strict',  // 防 CSRF
  signed: true         // 签名防篡改（需 app.keys）
})

// 读取
const token = ctx.cookies.get('token')

// 删除
ctx.cookies.set('token', '', { maxAge: 0 })
```

签名 Cookie 需要设置 `app.keys = ['secret1', 'secret2']`，读取时 `ctx.cookies.get('token', { signed: true })`，篡改则返回 undefined。

### Session（koa-session）

```bash
npm i koa-session
```

```js
const session = require('koa-session')
app.keys = ['session-secret']
app.use(session({ key: 'koa:sess', maxAge: 86400000, httpOnly: true, signed: true }, app))

router.post('/login', (ctx) => { ctx.session.userId = 42; ctx.body = { msg: '登录成功' } })
router.get('/me', (ctx) => {
  if (!ctx.session.userId) ctx.throw(401, '未登录')
  ctx.body = { userId: ctx.session.userId }
})
router.post('/logout', (ctx) => { ctx.session = null; ctx.body = { msg: '已退出' } })
```

| 特性 | Cookie | Session |
|------|--------|---------|
| 存储位置 | 浏览器 | 服务器（内存/Redis） |
| 大小限制 | ~4KB | 无限制 |
| 安全性 | 较低 | 较高（仅存 ID 于 Cookie） |
| 适用场景 | 少量标识/偏好 | 登录态/购物车 |

---

# 二、🟡 中级进阶

## 2.1 JWT 鉴权完整实现 <span class="lv lv-2">中级</span>

```
┌──────────┐  POST /login           ┌──────────┐
│  客户端  │ ────────────────────→  │  服务端  │
│          │ ←────────────────────  │          │
│          │  { token: "eyJhb..." } │          │
└────┬─────┘                        └──────────┘
     │  后续请求 Authorization: Bearer eyJhb...
     ▼
┌──────────┐  携带 token            ┌──────────┐
│  客户端  │ ────────────────────→  │  服务端  │
│          │ ←────────────────────  │          │
│          │  200 / 401             │          │
└──────────┘                        └──────────┘
```

```bash
npm i jsonwebtoken
```

```js
const jwt = require('jsonwebtoken')
const Router = require('@koa/router')
const router = new Router()
const SECRET = 'your-secret-key'

// ── 1. 登录签发 ──
router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body
  const user = await User.findOne({ where: { username } })
  if (!user || !(await user.validatePassword(password))) ctx.throw(401, '用户名或密码错误')

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '2h' })
  ctx.body = { token }
})

// ── 2. 验证中间件（路由守卫） ──
const auth = () => async (ctx, next) => {
  const bearer = ctx.header.authorization
  if (!bearer?.startsWith('Bearer ')) ctx.throw(401, '缺少 Token')
  try {
    ctx.state.user = jwt.verify(bearer.slice(7), SECRET)
    await next()
  } catch (err) {
    ctx.throw(401, err.name === 'TokenExpiredError' ? 'Token 已过期' : 'Token 无效')
  }
}

// ── 3. 角色守卫 ──
const roleGuard = (...roles) => (ctx, next) => {
  if (!roles.includes(ctx.state.user.role)) ctx.throw(403, '权限不足')
  return next()
}

router.get('/profile', auth(), (ctx) => { ctx.body = { user: ctx.state.user } })
router.delete('/users/:id', auth(), roleGuard('admin'), (ctx) => { ctx.body = { msg: '已删除' } })

// ── 4. Token 刷新 ──
router.post('/refresh', auth(), (ctx) => {
  const token = jwt.sign({ id: ctx.state.user.id, role: ctx.state.user.role }, SECRET, { expiresIn: '2h' })
  ctx.body = { token }
})
```

## 2.2 路由模块化与自动加载 <span class="lv lv-2">中级</span>

### 手动模块化

```js
// src/routes/user.js
const Router = require('@koa/router')
const router = new Router({ prefix: '/api/users' })
router.get('/',    (ctx) => { ctx.body = '用户列表' })
router.post('/',   (ctx) => { ctx.body = '创建用户' })
module.exports = router

// src/app.js
const userRouter = require('./routes/user')
const articleRouter = require('./routes/article')
app.use(userRouter.routes())
app.use(articleRouter.routes())
```

### 自动加载（require-directory）

```bash
npm i require-directory
```

```js
const requireDirectory = require('require-directory')
// 自动扫描 routes 目录，逐个注册
requireDirectory(module, './routes', {
  visit: (router) => {
    if (router instanceof require('koa-router')) {
      app.use(router.routes())
    }
  }
})
```

```
src/routes/
├── user.js        → 自动注册 /api/users
├── article.js     → 自动注册 /api/articles
└── admin/
    ├── role.js    → 自动注册 /api/admin/roles
    └── perm.js    → 自动注册 /api/admin/perms
```

## 2.3 统一响应格式与错误码设计 <span class="lv lv-2">中级</span>

```js
// 成功：{ "code": 0, "message": "success", "data": { ... } }
// 失败：{ "code": 40101, "message": "Token 已过期", "data": null }

// 响应封装中间件
app.use(async (ctx, next) => {
  ctx.success = (data = null, message = 'success') => {
    ctx.body = { code: 0, message, data }
  }
  ctx.fail = (code, message) => {
    ctx.status = Math.floor(code / 100)
    ctx.body = { code, message, data: null }
  }
  await next()
})

// 使用
router.get('/users', async (ctx) => { ctx.success(await User.findAll()) })
router.get('/users/:id', async (ctx) => {
  const user = await User.findById(ctx.params.id)
  if (!user) return ctx.fail(40402, '用户不存在')
  ctx.success(user)
})
```

### 错误码规范

```
编码规则：AABCC
  AA = HTTP 状态码前缀（40/50）
  B  = 业务模块（0通用/1用户/2文章）
  CC = 具体错误编号

常用错误码：
  40001  参数校验失败       40101  Token 过期
  40102  Token 无效         40301  权限不足
  40401  资源不存在         40402  用户不存在
  40901  资源冲突           50001  服务器内部错误
```

## 2.4 请求参数校验 <span class="lv lv-2">中级</span>

| 方案 | 特点 | 适合场景 |
|------|------|---------|
| `koa-parameter` | 基于 JSON Schema，Koa 风格 | 简单校验 |
| `Joi` | 功能最全，生态最广 | 复杂校验规则 |
| `Zod` | TS 优先，类型推断 | TS 项目首选 |

### Zod（推荐）

```js
const { z } = require('zod')

const CreateUserSchema = z.object({
  username: z.string().min(2).max(20),
  email:    z.string().email(),
  age:      z.number().int().min(1).max(150).optional(),
  role:     z.enum(['user', 'admin']).default('user')
})

const validate = (schema) => (ctx, next) => {
  const result = schema.safeParse(ctx.request.body)
  if (!result.success) {
    ctx.status = 400
    ctx.body = { code: 40001, message: result.error.errors.map(e => e.message).join('; ') }
    return
  }
  ctx.request.body = result.data
  return next()
}

router.post('/users', validate(CreateUserSchema), (ctx) => { ctx.success(ctx.request.body) })
```

## 2.5 日志系统 <span class="lv lv-2">中级</span>

### koa-logger（开发环境）

```js
const logger = require('koa-logger')
app.use(logger())   // 控制台：← GET /users 200 12ms
```

### winston（生产环境）

```bash
npm i winston
```

```js
const winston = require('winston')
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

// 请求日志中间件
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  logger.info({ method: ctx.method, url: ctx.url, status: ctx.status, duration: Date.now() - start })
})

// 错误日志
app.on('error', (err, ctx) => { logger.error({ error: err.message, stack: err.stack, url: ctx.url }) })
```

日志级别：`error`（需立即处理） > `warn`（警告/降级） > `info`（关键业务） > `http` > `debug`（仅开发）

## 2.6 跨域处理 <span class="lv lv-2">中级</span>

```bash
npm i @koa/cors
```

```js
const cors = require('@koa/cors')
app.use(cors({
  origin: (ctx) => {
    const whitelist = ['https://www.example.com', 'http://localhost:5173']
    return whitelist.includes(ctx.header.origin) ? ctx.header.origin : false
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['X-Total-Count'],
  credentials: true,
  maxAge: 86400
}))
```

```
CORS 流程：
  简单请求（GET/POST/HEAD，无自定义头）→ 直接发送，检查响应头
  非简单请求 → 先 OPTIONS 预检 → 通过后发实际请求
```

## 2.7 安全清单 <span class="lv lv-2">中级</span>

| 中间件 | 防御威胁 | 安装 |
|--------|---------|------|
| `koa-helmet` | XSS / 点击劫持 / MIME 嗅探 | `npm i koa-helmet` |
| `@koa/cors` | 跨域策略 | 已安装 |
| `koa-ratelimit` | 暴力破解 / DDoS | `npm i koa-ratelimit` |
| `koa-xss` | XSS 注入 | `npm i koa-xss` |
| `koa-csrf` | CSRF 攻击 | `npm i koa-csrf` |

```js
const helmet = require('koa-helmet')
const rateLimit = require('koa-ratelimit')
const Redis = require('ioredis')

app.use(helmet())                                    // 安全头集合
app.use(rateLimit({ db: new Redis(), duration: 60000, max: 100, id: (ctx) => ctx.ip }))  // 全局限流

// 登录接口单独限流：15 分钟 5 次
const loginLimiter = rateLimit({ db: new Redis(), duration: 15 * 60 * 1000, max: 5, id: (ctx) => ctx.ip })
router.post('/login', loginLimiter, handleLogin)
```

```
Koa 安全防护全景：
  XSS       → helmet + koa-xss + 输出转义
  CSRF      → koa-csrf / SameSite Cookie
  SQL 注入  → ORM 参数化查询
  暴力破解  → rate-limit + 密码哈希
  点击劫持  → helmet X-Frame-Options
  中间人    → HTTPS + HSTS
  Cookie    → httpOnly + secure + signed
```

## 2.8 与 MySQL 集成 <span class="lv lv-2">中级</span>

### Sequelize（ORM）

```bash
npm i sequelize mysql2
```

```js
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('mydb', 'root', 'password', { host: 'localhost', dialect: 'mysql' })

const User = sequelize.define('User', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  email:    { type: DataTypes.STRING(100), validate: { isEmail: true } },
  password: { type: DataTypes.STRING(200), allowNull: false },
  role:     { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' }
})

await sequelize.sync()

// CRUD
router.get('/users', async (ctx) => {
  const { page = 1, size = 10 } = ctx.query
  const { rows, count } = await User.findAndCountAll({
    offset: (page - 1) * size, limit: +size, attributes: { exclude: ['password'] }
  })
  ctx.success({ list: rows, total: count })
})

router.post('/users', async (ctx) => { ctx.success(await User.create(ctx.request.body)) })
router.put('/users/:id', async (ctx) => { await User.update(ctx.request.body, { where: { id: ctx.params.id } }); ctx.success(null, '更新成功') })
router.del('/users/:id', async (ctx) => { await User.destroy({ where: { id: ctx.params.id } }); ctx.success(null, '删除成功') })
```

### TypeORM（TS 友好）

```bash
npm i typeorm reflect-metadata mysql2
```

```ts
@Entity()
class User {
  @PrimaryGeneratedColumn() id: number
  @Column({ unique: true }) username: string
  @Column() password: string
}
```

| 特性 | Sequelize | TypeORM |
|------|-----------|---------|
| 语言 | JS / TS | TS 优先 |
| 装饰器 | 否 | 是 |
| 适合项目 | JS 项目 / 快速开发 | TS 项目 / 企业级 |

## 2.9 与 MongoDB 集成 <span class="lv lv-2">中级</span>

```bash
npm i mongoose
```

```js
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/mydb')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true },
  avatar:   { type: String, default: '' },
  createdAt:{ type: Date, default: Date.now }
}, { versionKey: false })

const User = mongoose.model('User', userSchema)

router.get('/users', async (ctx) => {
  const { page = 1, size = 10 } = ctx.query
  const list = await User.find().skip((page - 1) * size).limit(+size).select('-__v')
  ctx.success({ list, total: await User.countDocuments() })
})

router.post('/users', async (ctx) => { ctx.success(await User.create(ctx.request.body)) })
```

```
选型：数据结构固定、需要事务 → MySQL + Sequelize
     数据结构灵活、文档型   → MongoDB + Mongoose
     两者都需要             → MySQL 主库 + MongoDB 做日志
```

## 2.10 与 Redis 集成 <span class="lv lv-2">中级</span>

```bash
npm i ioredis
```

```js
const Redis = require('ioredis')
const redis = new Redis({ host: '127.0.0.1', port: 6379 })

// 缓存中间件
const cache = (ttl = 60) => async (ctx, next) => {
  const key = `cache:${ctx.url}`
  const cached = await redis.get(key)
  if (cached) { ctx.body = JSON.parse(cached); ctx.set('X-Cache', 'HIT'); return }
  await next()
  if (ctx.status === 200 && ctx.body) {
    await redis.set(key, JSON.stringify(ctx.body), 'EX', ttl)
    ctx.set('X-Cache', 'MISS')
  }
}

router.get('/articles', cache(30), async (ctx) => { ctx.success(await Article.findAll()) })
```

```
缓存策略流程：
  请求 → Redis 有缓存？
    是 → 返回缓存 (X-Cache:HIT)
    否 → 查数据库 → 写入 Redis (TTL) → 返回 (X-Cache:MISS)
```

常见场景：接口缓存（30s~5min）、验证码（5min）、限流计数（60s）、Session（30min）

## 2.11 文件上传进阶 <span class="lv lv-2">中级</span>

### OSS 直传（前端签名 + 直传 OSS）

```js
// 后端签发上传凭证
router.get('/upload/signature', auth(), (ctx) => {
  const policy = {
    expiration: new Date(Date.now() + 3600000).toISOString(),
    conditions: [['content-length-range', 0, 10 * 1024 * 1024]]
  }
  const base64Policy = Buffer.from(JSON.stringify(policy)).toString('base64')
  const signature = crypto.createHmac('sha1', ossConfig.accessKeySecret).update(base64Policy).digest('base64')

  ctx.success({
    host: `https://${ossConfig.bucket}.${ossConfig.region}.aliyuncs.com`,
    policy: base64Policy, OSSAccessKeyId: ossConfig.accessKeyId, signature,
    dir: `uploads/${ctx.state.user.id}/`
  })
})
// 前端拿到签名后直接 POST 到 OSS（不经过 Node 服务器）
```

### 分片上传

```
大文件 (500MB)
┌───┬───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │ 5 │  每片 5MB，并行上传
└─┬─┴─┬─┴─┬─┴─┬─┴─┬─┘
  ↓   ↓   ↓   ↓   ↓
  服务端临时目录 → 合并分片 → 最终文件
```

```js
// 分片上传
router.post('/upload/chunk', koaBody({ multipart: true }), async (ctx) => {
  const { index, fileId } = ctx.request.body
  const chunkDir = path.join(__dirname, `../temp/${fileId}`)
  await fs.mkdir(chunkDir, { recursive: true })
  await fs.rename(ctx.request.files.chunk.filepath, path.join(chunkDir, `${index}`))
  ctx.success({ index })
})

// 合并
router.post('/upload/merge', async (ctx) => {
  const { fileId, total, filename } = ctx.request.body
  const chunkDir = path.join(__dirname, `../temp/${fileId}`)
  const ws = fs.createWriteStream(path.join(__dirname, `../uploads/${filename}`))
  for (let i = 0; i < total; i++) { ws.write(await fs.readFile(path.join(chunkDir, `${i}`))) }
  ws.end()
  await fs.rm(chunkDir, { recursive: true })
  ctx.success({ url: `/uploads/${filename}` })
})
```

## 2.12 WebSocket <span class="lv lv-2">中级</span>

### Socket.IO（推荐）

```bash
npm i socket.io
```

```js
const Koa = require('koa')
const http = require('http')
const { Server } = require('socket.io')

const app = new Koa()
const server = http.createServer(app.callback())
const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  console.log(`用户连接: ${socket.id}`)

  socket.on('join', (room) => {
    socket.join(room)
    io.to(room).emit('message', `${socket.id} 加入了 ${room}`)
  })

  socket.on('chat', (data) => {
    io.to(data.room).emit('chat', { from: socket.id, msg: data.msg, time: new Date().toLocaleTimeString() })
  })

  socket.on('disconnect', () => { console.log(`用户离开: ${socket.id}`) })
})

server.listen(3000)
```

| 特性 | WebSocket | SSE | 长轮询 |
|------|-----------|-----|--------|
| 方向 | 双向 | 服务端→客户端 | 单次请求 |
| 实时性 | 毫秒级 | 毫秒级 | 秒级 |
| 适用场景 | 聊天/协作 | 通知/推送 | 兼容旧浏览器 |

---

# 三、🔴 高级实战

## 3.1 Koa 中间件原理源码解读 <span class="lv lv-3">高级</span>

Koa 中间件机制全靠 `koa-compose`，核心源码仅 20 行：

```js
// koa-compose 核心源码（简化版）
function compose(middleware) {
  return function (ctx, next) {
    let index = -1
    return dispatch(0)
    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(ctx, () => dispatch(i + 1)))  // next() = dispatch(i+1)
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

```
compose([A, B, C]) 执行过程：

dispatch(0) → A(ctx, () => dispatch(1))
              → dispatch(1) → B(ctx, () => dispatch(2))
                              → dispatch(2) → C(ctx, () => dispatch(3))
                                              → dispatch(3) → Promise.resolve()
                                              → C 后置执行
                              → B 后置执行
              → A 后置执行

本质：递归 + 闭包 = 洋葱模型
```

## 3.2 TypeScript 完整项目脚手架 <span class="lv lv-3">高级</span>

### 项目结构

```
koa-ts-starter/
├── src/
│   ├── app.ts
│   ├── middleware/  error.ts | auth.ts | validate.ts
│   ├── routes/      index.ts | user.ts
│   ├── controller/  user.ts
│   ├── service/     user.ts
│   ├── model/       user.ts
│   └── types/       index.ts
├── tsconfig.json
└── package.json
```

### 扩展 Koa Context 类型

```ts
// src/types/index.ts
import { DefaultState, DefaultContext } from 'koa'

interface IUser { id: number; username: string; role: 'user' | 'admin' }

interface AppState extends DefaultState { user?: IUser }

interface AppContext extends DefaultContext {
  success: (data?: any, msg?: string) => void
  fail: (code: number, msg: string) => void
}

export { AppState, AppContext, IUser }
```

```ts
// src/app.ts
import Koa from 'koa'
import { AppState, AppContext } from './types'
const app = new Koa<AppState, AppContext>()
```

### 三层架构 Controller → Service → Model

```ts
// service/user.ts
class UserService {
  async findById(id: number) { return User.findByPk(id, { attributes: { exclude: ['password'] } }) }
  async create(data: CreateUserDTO) { return User.create(data) }
}
export default new UserService()

// controller/user.ts
import userService from '../service/user'
class UserController {
  async show(ctx: AppContext) {
    const user = await userService.findById(+ctx.params.id)
    if (!user) return ctx.fail(40402, '用户不存在')
    ctx.success(user)
  }
  async create(ctx: AppContext) { ctx.success(await userService.create(ctx.request.body)) }
}
export default new UserController()

// routes/user.ts
const router = new Router({ prefix: '/api/users' })
router.get('/:id', userCtrl.show)
router.post('/', validate(CreateUserSchema), userCtrl.create)
export default router
```

## 3.3 面试高频题 10 条 <span class="lv lv-3">高级</span>

**Q1：Koa 和 Express 的根本区别是什么？**

> 核心区别是中间件模型：Express 线性执行，next() 后无法回到当前中间件；Koa 洋葱模型，await next() 后会继续执行后置逻辑。Koa 还原生支持 async/await。

**Q2：洋葱模型中 next() 被调用两次会怎样？**

> compose 用 index 变量追踪进度，若 next() 被调用两次（i <= index），会 reject 一个 `next() called multiple times` 错误。

**Q3：为什么 Koa 把路由从核心中移除？**

> 极简内核设计——路由并非所有场景都需要（如 WebSocket / 代理），作为中间件按需引入更灵活。

**Q4：ctx.state 的作用？**

> Koa 推荐的跨中间件传递数据的方式，如认证中间件挂 `ctx.state.user`，下游均可读取。

**Q5：Koa 的错误处理为什么比 Express 更优雅？**

> Express 通过 next(err) 传递，需每个中间件检查 err；Koa 用 try-catch + async/await，错误自动冒泡，配合 ctx.throw() 精确控制 HTTP 状态码。

**Q6：如何实现中间件的条件跳过？**

> 不调用 await next() 即可中断后续中间件，如认证失败 ctx.throw(401)，下游不执行。

**Q7：Koa 中如何实现文件流式下载？**

> `ctx.body = fs.createReadStream(filePath)`，Koa 自动流式传输，设置 `Content-Disposition` 头即可。

**Q8：koa-bodyparser 和 koa-body 的区别？**

> bodyparser 只解析 JSON/表单/文本，不支持文件；koa-body 额外支持 multipart 文件上传。纯 API 用前者，涉及上传用后者。

**Q9：Koa 如何做接口版本管理？**

> 推荐路由前缀 `/api/v1/users`、`/api/v2/users`；也可用请求头或目录结构分版本。

**Q10：Koa 如何优雅停机？**

> 监听 SIGTERM/SIGINT，停止接收新连接，等待现有请求处理完毕：`server.close(() => process.exit(0))`，超时强制退出 `setTimeout(() => process.exit(1), 10000)`。
