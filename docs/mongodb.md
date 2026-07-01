# MongoDB 全阶段学习手册

> 面向前端转全栈开发者 · 定位"全栈偏前端，后端为辅" · 中文编写

---

## 目录

- [一、🟢 初级入门](#一-初级入门)
  - [1.1 MongoDB 是什么 & 与 MySQL 对比](#11-mongodb-是什么--与-mysql-对比)
  - [1.2 安装与连接](#12-安装与连接)
  - [1.3 文档模型：BSON / 嵌套文档 / 数组 / ObjectId](#13-文档模型)
  - [1.4 数据库与集合操作](#14-数据库与集合操作)
  - [1.5 CRUD 操作](#15-crud-操作)
  - [1.6 索引入门](#16-索引入门)
  - [1.7 Mongoose 入门](#17-mongoose-入门)
  - [1.8 Node.js + Mongoose 最小项目](#18-nodejs--mongoose-最小项目)
- [二、🟡 中级进阶](#二-中级进阶)
  - [2.1 聚合管道 Aggregation Pipeline](#21-聚合管道-aggregation-pipeline)
  - [2.2 Mongoose 高级](#22-mongoose-高级)
  - [2.3 数据建模设计模式](#23-数据建模设计模式)
  - [2.4 事务（4.0+）](#24-事务40)
  - [2.5 性能优化](#25-性能优化)
  - [2.6 与 Redis 集成做缓存层](#26-与-redis-集成做缓存层)
  - [2.7 Change Streams](#27-change-streams)
  - [2.8 数据导入导出](#28-数据导入导出)
  - [2.9 MongoDB Atlas 云服务入门](#29-mongodb-atlas-云服务入门)
  - [2.10 实战：完整后端 API 项目结构](#210-实战完整后端-api-项目结构)
- [三、🔴 高级实战](#三-高级实战)
  - [3.1 副本集与分片](#31-副本集与分片)
  - [3.2 WiredTiger 存储引擎](#32-wiredtiger-存储引擎)
  - [3.3 面试高频题 10 条](#33-面试高频题-10-条)

---

## 一、🟢 初级入门

### 1.1 MongoDB 是什么 & 与 MySQL 对比

<span class="lv lv-1">初级</span>

MongoDB 是一款 **文档型 NoSQL 数据库**，数据以 JSON 风格的 BSON 格式存储。每条记录称为"文档（Document）"，若干文档组成"集合（Collection）"，类比 MySQL 的表（Table）。

#### 核心概念类比

```
MySQL              MongoDB
─────────────────────────────
Database      →   Database
Table         →   Collection
Row           →   Document
Column        →   Field
Primary Key   →   _id (ObjectId)
JOIN          →   $lookup / 嵌入文档
```

#### 详细对比表

| 维度         | MySQL                          | MongoDB                              |
| ------------ | ------------------------------ | ------------------------------------ |
| 数据模型     | 关系型，行列结构               | 文档型，嵌套 JSON（BSON）            |
| Schema       | 强 Schema，建表时固定列        | 弱 Schema，同集合文档字段可不同      |
| 查询语言     | SQL（SELECT/JOIN/GROUP BY）    | MQL（find/aggregate pipeline）       |
| 事务         | ACID 完整支持（InnoDB）        | 4.0+ 支持多文档事务，性能稍逊        |
| 扩展方式     | 垂直扩展为主，分库分表复杂     | 原生水平分片（Sharding）             |
| 关联查询     | JOIN 原生支持，性能稳定        | $lookup 实现，或通过嵌入文档避免关联 |
| 适合场景     | 金融、电商订单、强一致性业务   | 内容平台、用户画像、日志、实时应用   |
| 索引         | B-Tree，支持全文/空间索引      | B-Tree，支持全文/地理/TTL/通配符索引 |
| 驱动/ORM     | Sequelize / TypeORM / Prisma   | Mongoose / Prisma（MongoDB adapter） |

#### 何时选 MongoDB？

```
✅ 数据结构灵活，字段频繁变更（如产品属性各异）
✅ 文档天然嵌套，避免多表 JOIN（如订单含商品列表）
✅ 高写入吞吐：日志、埋点、IoT 数据
✅ 快速原型：前端开发者直接操作 JSON，心智负担低
❌ 复杂跨集合事务场景（优先 MySQL）
❌ 强约束财务核算（优先关系型）
```

---

### 1.2 安装与连接

<span class="lv lv-1">初级</span>

#### 方式一：Docker（推荐，最快）

```bash
# 拉取并启动 MongoDB 7.x
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=123456 \
  -v mongo_data:/data/db \
  mongo:7.0

# 进入容器使用 mongosh
docker exec -it mongodb mongosh -u admin -p 123456
```

#### 方式二：Windows 本地安装

```bash
# 1. 下载 MSI：https://www.mongodb.com/try/download/community
# 2. 安装后启动服务
net start MongoDB

# 3. 安装 mongosh（Shell 工具）
# https://www.mongodb.com/try/download/shell
mongosh "mongodb://localhost:27017"
```

#### 方式三：macOS（Homebrew）

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
mongosh
```

#### 方式四：Linux（Ubuntu）

```bash
# 导入公钥
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# 添加源
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] \
  https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt-get update && sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### mongosh 常用命令速查

```js
// 查看版本
db.version()

// 当前数据库
db

// 列出所有数据库
show dbs

// 切换/创建数据库
use myapp

// 查看连接状态
db.runCommand({ connectionStatus: 1 })

// 退出
exit
```

---

### 1.3 文档模型：BSON / 嵌套文档 / 数组 / ObjectId

<span class="lv lv-1">初级</span>

#### BSON 数据类型

```
BSON（Binary JSON）是 MongoDB 存储格式，比 JSON 多了以下类型：
┌─────────────────┬──────────────────────────────────────┐
│ 类型             │ 示例                                 │
├─────────────────┼──────────────────────────────────────┤
│ ObjectId        │ ObjectId("64abc...")  12字节唯一ID    │
│ Date            │ new Date("2024-01-01")                │
│ NumberInt/Long  │ NumberInt(32) / NumberLong(64)        │
│ Decimal128      │ 精确小数，适合货币                    │
│ Binary          │ 二进制数据（文件、图片）              │
│ Regular Expr    │ /pattern/flags                        │
└─────────────────┴──────────────────────────────────────┘
```

#### 典型文档结构示例

```js
// 一个用户文档（包含嵌套文档、数组、ObjectId）
{
  _id: ObjectId("64f1a2b3c4d5e6f7a8b9c0d1"),  // 自动生成的主键
  username: "zhangsan",
  age: 28,
  isActive: true,
  createdAt: new Date("2024-01-15"),
  score: Decimal128("99.95"),

  // 嵌套文档（Embedded Document）
  address: {
    province: "广东",
    city: "深圳",
    zip: "518000"
  },

  // 数组（Array）
  tags: ["nodejs", "mongodb", "vue3"],

  // 对象数组
  orders: [
    { orderId: "ORD001", amount: 299, status: "paid" },
    { orderId: "ORD002", amount: 89,  status: "pending" }
  ],

  // 引用（Reference）—— 存储另一集合的 ObjectId
  roleId: ObjectId("64f1a2b3c4d5e6f7a8b9c0d2")
}
```

#### ObjectId 解析

```js
// ObjectId 由 12 字节组成：
// ┌──────────┬──────────┬──────────┬───────────┐
// │ 4字节时间 │ 3字节机器 │ 3字节进程 │ 3字节计数  │
// │  戳(秒)  │  标识    │    ID    │  器随机值  │
// └──────────┴──────────┴──────────┴───────────┘

const id = new ObjectId("64f1a2b3c4d5e6f7a8b9c0d1")
id.getTimestamp()  // → 2023-09-01T... 可从 _id 提取创建时间！
id.toString()      // → "64f1a2b3c4d5e6f7a8b9c0d1"
```

---

### 1.4 数据库与集合操作

<span class="lv lv-1">初级</span>

```js
// ── 数据库操作 ──────────────────────────────────────────

// 切换/创建数据库（首次插入数据时才真正创建）
use myapp

// 查看当前数据库
db

// 显示所有数据库（有数据的才显示）
show dbs

// 删除当前数据库
db.dropDatabase()


// ── 集合操作 ──────────────────────────────────────────

// 显式创建集合
db.createCollection("users")

// 创建集合并设置选项（上限集合，旧数据自动覆盖）
db.createCollection("logs", {
  capped: true,
  size: 1048576,   // 最大 1MB
  max: 1000        // 最多 1000 条
})

// 查看当前库所有集合
show collections

// 查看集合统计
db.users.stats()

// 重命名集合
db.users.renameCollection("members")

// 删除集合
db.users.drop()

// 查看集合文档数量
db.users.countDocuments()
```

---

### 1.5 CRUD 操作

<span class="lv lv-1">初级</span>

#### 插入（Create）

```js
// insertOne：插入单条文档
db.users.insertOne({
  username: "alice",
  email: "alice@example.com",
  age: 25,
  createdAt: new Date()
})
// 返回：{ acknowledged: true, insertedId: ObjectId("...") }

// insertMany：批量插入
db.users.insertMany([
  { username: "bob",   email: "bob@example.com",   age: 30 },
  { username: "carol", email: "carol@example.com", age: 22 },
  { username: "dave",  email: "dave@example.com",  age: 28 }
])
// 返回：{ acknowledged: true, insertedIds: { '0': ObjectId, '1': ObjectId, ... } }
```

#### 查询（Read）

```js
// ── 基础查询 ──────────────────────────────────────────

// 查询所有文档
db.users.find()

// 查询单条
db.users.findOne({ username: "alice" })

// 条件查询：精确匹配
db.users.find({ age: 25 })


// ── 比较操作符 ────────────────────────────────────────
// $gt  大于    $gte 大于等于
// $lt  小于    $lte 小于等于
// $ne  不等于  $in  在数组中  $nin 不在数组中

db.users.find({ age: { $gt: 20, $lt: 30 } })      // 20 < age < 30
db.users.find({ age: { $in: [22, 25, 28] } })      // age 在列表中
db.users.find({ username: { $regex: /^a/i } })     // 用户名 a 开头（忽略大小写）
db.users.find({ email: { $ne: null } })            // email 不为 null


// ── 逻辑操作符 ────────────────────────────────────────

// $and：且（默认，可省略花括号形式）
db.users.find({ $and: [{ age: { $gt: 20 } }, { age: { $lt: 30 } }] })

// $or：或
db.users.find({ $or: [{ username: "alice" }, { username: "bob" }] })

// $not：非
db.users.find({ age: { $not: { $gt: 30 } } })

// $nor：全不满足
db.users.find({ $nor: [{ age: { $lt: 18 } }, { isActive: false }] })


// ── 投影（只返回指定字段）────────────────────────────

// 1 = 显示，0 = 隐藏（_id 默认显示，需显式排除）
db.users.find({}, { username: 1, email: 1, _id: 0 })

// 嵌套字段投影
db.users.find({}, { "address.city": 1, _id: 0 })


// ── 排序、分页 ────────────────────────────────────────

db.users.find()
  .sort({ age: -1 })     // -1 降序，1 升序
  .skip(10)              // 跳过前 10 条
  .limit(5)              // 最多返回 5 条


// ── 数组查询 ──────────────────────────────────────────

// 数组包含某元素
db.users.find({ tags: "nodejs" })

// 数组包含所有指定元素
db.users.find({ tags: { $all: ["nodejs", "vue3"] } })

// 数组大小
db.users.find({ tags: { $size: 3 } })

// 数组元素满足条件（$elemMatch）
db.users.find({
  orders: { $elemMatch: { amount: { $gt: 200 }, status: "paid" } }
})
```

#### 更新（Update）

```js
// updateOne：更新第一条匹配文档
db.users.updateOne(
  { username: "alice" },
  { $set: { age: 26 } }
)

// updateMany：更新所有匹配文档
db.users.updateMany(
  { isActive: false },
  { $set: { isActive: true, updatedAt: new Date() } }
)

// ── 常用更新操作符 ────────────────────────────────────
// $set      设置字段值
// $unset    删除字段
// $inc      数值增减
// $push     向数组追加元素
// $pull     从数组移除满足条件的元素
// $addToSet 向数组追加（不重复）

// $inc：点赞数 +1
db.posts.updateOne({ _id: postId }, { $inc: { likes: 1 } })

// $push：向 tags 数组追加单个元素
db.users.updateOne({ _id: userId }, { $push: { tags: "react" } })

// $push + $each：批量追加并排序
db.users.updateOne(
  { _id: userId },
  { $push: { tags: { $each: ["ts", "next.js"], $sort: 1 } } }
)

// $pull：移除数组中值为 "vue2" 的元素
db.users.updateOne({ _id: userId }, { $pull: { tags: "vue2" } })

// $unset：删除字段
db.users.updateOne({ _id: userId }, { $unset: { tempField: "" } })

// upsert：不存在则插入
db.users.updateOne(
  { email: "new@example.com" },
  { $set: { username: "newuser", age: 20 } },
  { upsert: true }
)

// replaceOne：完全替换文档（_id 保留）
db.users.replaceOne(
  { username: "alice" },
  { username: "alice", email: "new@example.com", age: 27 }
)
```

#### 删除（Delete）

```js
// deleteOne：删除第一条匹配
db.users.deleteOne({ username: "dave" })

// deleteMany：删除所有匹配
db.users.deleteMany({ isActive: false })

// 删除所有文档（保留集合）
db.users.deleteMany({})

// drop() 删除集合本身（包括索引）
db.users.drop()
```

---

### 1.6 索引入门

<span class="lv lv-1">初级</span>

```
索引作用：
未加索引时 → 全集合扫描（COLLSCAN）性能差
加索引后   → 索引扫描（IXSCAN）定向查找

索引代价：
✅ 加速查询  ❌ 占用磁盘空间  ❌ 写入时维护开销
```

```js
// ── 创建索引 ──────────────────────────────────────────

// 单字段索引（1=升序，-1=降序）
db.users.createIndex({ email: 1 })

// 唯一索引（确保 email 唯一）
db.users.createIndex({ email: 1 }, { unique: true })

// 复合索引（遵循最左前缀原则）
db.users.createIndex({ age: 1, username: 1 })

// 文本索引（全文搜索）
db.posts.createIndex({ title: "text", content: "text" })

// TTL 索引（自动过期，适合 session/日志）
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })

// 稀疏索引（只索引存在该字段的文档）
db.users.createIndex({ phone: 1 }, { sparse: true })


// ── 查看 & 删除索引 ────────────────────────────────────

// 查看集合所有索引
db.users.getIndexes()

// 删除指定索引
db.users.dropIndex("email_1")

// 删除所有索引（_id 索引除外）
db.users.dropIndexes()


// ── explain 分析查询计划 ────────────────────────────────

db.users.find({ email: "alice@example.com" }).explain("executionStats")
// 关注字段：
// winningPlan.stage                    → IXSCAN（好）/ COLLSCAN（差）
// executionStats.nReturned             → 返回文档数
// executionStats.totalDocsExamined     → 扫描文档数（越接近 nReturned 越好）
```

#### 索引选择原则

| 场景                   | 推荐索引类型   |
| ---------------------- | -------------- |
| 精确查询单字段         | 单字段索引     |
| 多字段组合查询/排序    | 复合索引       |
| 全文搜索               | 文本索引       |
| 自动过期数据           | TTL 索引       |
| 地理位置查询           | 2dsphere 索引  |
| 保证字段唯一           | 唯一索引       |

---

### 1.7 Mongoose 入门

<span class="lv lv-1">初级</span>

Mongoose 是 Node.js 最流行的 MongoDB ODM（对象文档映射），提供 Schema 约束、数据验证、中间件等能力。

```bash
npm install mongoose
```

#### 连接数据库

```js
// config/db.js
import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp'

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    })
    console.log('MongoDB 连接成功')
  } catch (err) {
    console.error('MongoDB 连接失败:', err.message)
    process.exit(1)
  }
}

mongoose.connection.on('disconnected', () => console.log('MongoDB 断开连接'))
mongoose.connection.on('error', (err) => console.error('MongoDB 错误:', err))
```

#### Schema 定义

```js
// models/User.js
import mongoose from 'mongoose'

const { Schema } = mongoose

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, '用户名必填'],
      unique: true,
      trim: true,
      minlength: [2, '用户名至少 2 位'],
      maxlength: [20, '用户名最多 20 位'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, '邮箱格式不正确'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,   // 查询默认不返回此字段
    },
    age: {
      type: Number,
      min: [0, '年龄不能为负'],
      max: [150, '年龄超出范围'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'editor'],
      default: 'user',
    },
    tags: [String],          // 字符串数组
    address: {               // 嵌套文档
      province: String,
      city: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,        // 自动添加 createdAt / updatedAt
    versionKey: false,       // 禁用 __v 字段
  }
)

// 虚拟属性：不存入数据库，按需计算
UserSchema.virtual('profile').get(function () {
  return `${this.username}(${this.email})`
})

// 实例方法
UserSchema.methods.greet = function () {
  return `你好，${this.username}！`
}

// 静态方法
UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() })
}

export const User = mongoose.model('User', UserSchema)
```

#### 基础 CRUD

```js
import { User } from './models/User.js'

// 创建
const user = await User.create({
  username: 'alice',
  email: 'alice@example.com',
  password: 'hashed_password',
  age: 25,
})

// 查询
const all    = await User.find({ isActive: true }).select('-password').lean()
const one    = await User.findById(userId)
const byMail = await User.findOne({ email: 'alice@example.com' })

// 分页查询
const page = 1, limit = 10
const users = await User.find()
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit)
  .lean()

// 更新（new:true 返回更新后的文档）
const updated = await User.findByIdAndUpdate(
  userId,
  { $set: { age: 26 } },
  { new: true, runValidators: true }
)

// 删除
await User.findByIdAndDelete(userId)
await User.deleteMany({ isActive: false })

// 统计 / 是否存在
const count  = await User.countDocuments({ role: 'admin' })
const exists = await User.exists({ email: 'alice@example.com' })
```

---

### 1.8 Node.js + Mongoose 最小项目

<span class="lv lv-1">初级</span>

#### 项目结构

```
mini-api/
├── src/
│   ├── app.js          # Express 应用入口
│   ├── db.js           # 数据库连接
│   ├── models/
│   │   └── User.js     # User 模型
│   └── routes/
│       └── users.js    # 用户路由
├── .env
└── package.json
```

```bash
npm init -y
npm install express mongoose dotenv
```

```js
// src/db.js
import mongoose from 'mongoose'

export async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('DB connected')
}
```

```js
// src/models/User.js
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age:   { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const User = mongoose.model('User', UserSchema)
```

```js
// src/routes/users.js
import { Router } from 'express'
import { User } from '../models/User.js'

const router = Router()

// GET /users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().lean()
    res.json({ success: true, data: users })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: '用户不存在' })
    res.json({ success: true, data: user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /users
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json({ success: true, data: user })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// PUT /users/:id
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
    if (!user) return res.status(404).json({ message: '用户不存在' })
    res.json({ success: true, data: user })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// DELETE /users/:id
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: '用户不存在' })
    res.json({ success: true, message: '删除成功' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
```

```js
// src/app.js
import 'dotenv/config'
import express from 'express'
import { connectDB } from './db.js'
import userRoutes from './routes/users.js'

const app = express()
app.use(express.json())
app.use('/api/users', userRoutes)

app.use((err, req, res, next) => {
  res.status(500).json({ message: '服务器错误' })
})

connectDB().then(() => {
  app.listen(3000, () => console.log('Server running on :3000'))
})
```

```ini
# .env
MONGO_URI=mongodb://localhost:27017/miniapp
```

```bash
# 启动
node src/app.js

# 快速测试
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com","age":25}'

curl http://localhost:3000/api/users
```

---

## 二、🟡 中级进阶

### 2.1 聚合管道 Aggregation Pipeline

<span class="lv lv-2">中级</span>

聚合管道是 MongoDB 最强大的数据处理工具，类比 SQL 的 `GROUP BY + JOIN + HAVING`。数据逐阶段流过管道，每阶段对输出进行变换。

```
输入集合
    │
    ▼
┌─────────┐
│ $match  │  过滤（相当于 WHERE）
└────┬────┘
     │
     ▼
┌─────────┐
│ $group  │  分组聚合（相当于 GROUP BY）
└────┬────┘
     │
     ▼
┌─────────┐
│  $sort  │  排序
└────┬────┘
     │
     ▼
┌─────────┐
│$project │  字段投影/重塑
└────┬────┘
     │
     ▼
  结果输出
```

#### 常用阶段速查

| 阶段         | 说明                         | SQL 类比        |
| ------------ | ---------------------------- | --------------- |
| `$match`     | 条件过滤                     | WHERE / HAVING  |
| `$group`     | 分组聚合                     | GROUP BY        |
| `$sort`      | 排序                         | ORDER BY        |
| `$project`   | 字段选取/计算/重命名         | SELECT          |
| `$lookup`    | 关联另一集合                 | LEFT JOIN       |
| `$unwind`    | 展开数组（每个元素一条文档） | 无直接对应      |
| `$limit`     | 限制条数                     | LIMIT           |
| `$skip`      | 跳过条数                     | OFFSET          |
| `$facet`     | 多管道并行（分面统计）       | 多个子查询      |
| `$addFields` | 添加/覆盖字段                | computed column |
| `$count`     | 统计文档数                   | COUNT(*)        |

#### 代码示例

```js
// 示例数据：orders 集合
// { userId, product, category, amount, status, createdAt }

// ── 示例1：统计各分类销售总额
db.orders.aggregate([
  { $match: { status: "paid" } },
  {
    $group: {
      _id: "$category",
      totalAmount: { $sum: "$amount" },
      avgAmount:   { $avg: "$amount" },
      orderCount:  { $sum: 1 },
      maxAmount:   { $max: "$amount" },
    }
  },
  { $sort: { totalAmount: -1 } },
  { $limit: 10 }
])


// ── 示例2：$lookup 关联查询（类 LEFT JOIN）
db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "orders"
    }
  },
  { $addFields: { orderCount: { $size: "$orders" } } },
  { $project: { username: 1, orderCount: 1, _id: 0 } }
])


// ── 示例3：$unwind 展开数组
// posts 集合：{ title, tags: ["a","b","c"] }
db.posts.aggregate([
  { $unwind: "$tags" },
  {
    $group: {
      _id: "$tags",
      postCount: { $sum: 1 }
    }
  },
  { $sort: { postCount: -1 } }
])


// ── 示例4：$project 字段重塑与计算
db.orders.aggregate([
  {
    $project: {
      _id: 0,
      product: 1,
      amount: 1,
      year:     { $year: "$createdAt" },
      month:    { $month: "$createdAt" },
      discount: { $multiply: ["$amount", 0.1] },
      label: {
        $cond: {
          if:   { $gte: ["$amount", 500] },
          then: "大单",
          else: "小单"
        }
      }
    }
  }
])


// ── 示例5：$facet 分面统计（一次查询多维度）
db.products.aggregate([
  {
    $facet: {
      byCategory: [
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ],
      priceRange: [
        {
          $bucket: {
            groupBy: "$price",
            boundaries: [0, 100, 500, 1000, Infinity],
            default: "其他",
            output: { count: { $sum: 1 } }
          }
        }
      ],
      total: [{ $count: "count" }]
    }
  }
])
```

#### Mongoose 中使用聚合

```js
const result = await Order.aggregate([
  { $match: { status: 'paid' } },
  { $group: { _id: '$category', total: { $sum: '$amount' } } },
  { $sort: { total: -1 } }
])
```

---

### 2.2 Mongoose 高级

<span class="lv lv-2">中级</span>

#### 中间件（pre/post Hooks）

```js
// 保存前：密码加密
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// 保存后：记录日志
UserSchema.post('save', function (doc, next) {
  console.log(`新用户注册：${doc.email}`)
  next()
})

// 查询前：自动过滤软删除（this 指向 Query）
UserSchema.pre(/^find/, function (next) {
  this.find({ deletedAt: null })
  next()
})

// findOneAndUpdate 前：触发验证
UserSchema.pre('findOneAndUpdate', function (next) {
  this.options.runValidators = true
  next()
})
```

#### populate 关联查询

```js
// Post 模型中引用 User
const PostSchema = new Schema({
  title:   String,
  content: String,
  author:  { type: Schema.Types.ObjectId, ref: 'User' },
  tags:    [{ type: Schema.Types.ObjectId, ref: 'Tag' }]
})

// 查询时 populate 自动填充关联文档
const post = await Post.findById(postId)
  .populate('author', 'username email -password')
  .populate('tags', 'name color')
  .lean()

// 深度 populate（嵌套二级关联）
const post2 = await Post.findById(postId).populate({
  path: 'author',
  select: 'username',
  populate: { path: 'department', select: 'name' }
})
```

#### 虚拟填充（Virtual Populate）

```js
// 在 User 中虚拟关联 posts（不存储在数据库）
UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author'
})

// 查询时填充
const user = await User.findById(userId).populate('posts', 'title createdAt')

// 需开启 virtuals 序列化
UserSchema.set('toJSON',   { virtuals: true })
UserSchema.set('toObject', { virtuals: true })
```

#### 复合索引与文本索引

```js
// 复合唯一索引
PostSchema.index({ author: 1, slug: 1 }, { unique: true })

// 文本索引（全文搜索，title 权重更高）
PostSchema.index({ title: 'text', content: 'text' }, {
  weights: { title: 10, content: 1 },
  name: 'post_text_index'
})

// 使用文本搜索
const posts = await Post.find(
  { $text: { $search: 'mongodb nodejs' } },
  { score: { $meta: 'textScore' } }
).sort({ score: { $meta: 'textScore' } })
```

---

### 2.3 数据建模设计模式

<span class="lv lv-2">中级</span>

#### 嵌入 vs 引用

```
嵌入（Embed）                      引用（Reference）
──────────────────────────────     ──────────────────────────────
文章中嵌入评论数组                  评论单独集合，存 postId

优点：                             优点：
✅ 单次查询获取所有数据             ✅ 数据独立，可单独查询
✅ 原子性写入                      ✅ 避免文档过大（16MB 限制）
✅ 读性能好                        ✅ 多对多关系清晰

缺点：                             缺点：
❌ 文档可能超过 16MB               ❌ 需要 populate / $lookup
❌ 嵌入数组不便单独查询             ❌ 多次查询性能稍低
❌ 更新嵌套数据较繁琐               ❌ 无跨集合原子操作（需事务）
```

#### 关系建模策略

```js
// ── 一对一（One-to-One）──────────────────────────────────
// 频繁一起读取时：嵌入
{
  _id: ObjectId,
  username: "alice",
  profile: { bio: "...", avatar: "url", birthday: Date }
}


// ── 一对多（One-to-Many）─────────────────────────────────
// 策略1：子文档嵌入（数量少、不超过几十条）
{ _id, title, tags: ["js", "mongodb"] }

// 策略2：父引用（子文档多，需独立查询）
// 评论引用文章 _id
{ _id, postId: ObjectId, content: "..." }

// 策略3：子引用（父文档保存子 _id 数组，数量有限）
{ _id, title, topCommentIds: [ObjectId, ObjectId] }


// ── 多对多（Many-to-Many）────────────────────────────────
// 方式A：双向引用
// user:   { enrolledCourses: [courseId1, courseId2] }
// course: { students: [userId1, userId2] }

// 方式B：中间集合（推荐，需附加属性时）
{
  _id: ObjectId,
  userId:     ObjectId,
  courseId:   ObjectId,
  enrolledAt: Date,
  progress:   80
}
```

#### 建模决策树

```
文档会被单独查询？
  ├── 是 → 独立集合（引用）
  └── 否 → 总是和父文档一起读取？
            ├── 是 → 嵌入
            └── 否 → 数量会超过几十条？
                      ├── 是 → 独立集合（引用）
                      └── 否 → 嵌入数组
```

---

### 2.4 事务（4.0+）

<span class="lv lv-2">中级</span>

MongoDB 4.0 起支持多文档事务（需副本集或分片集群）。

```js
// ── 方式一：withTransaction（推荐，自动重试/回滚）
import mongoose from 'mongoose'

async function transferPoints(fromUserId, toUserId, points) {
  const session = await mongoose.startSession()

  try {
    const result = await session.withTransaction(async () => {
      const fromUser = await User.findById(fromUserId).session(session)
      if (!fromUser || fromUser.points < points) {
        throw new Error('积分不足')
      }

      await User.findByIdAndUpdate(
        fromUserId,
        { $inc: { points: -points } },
        { session }
      )
      await User.findByIdAndUpdate(
        toUserId,
        { $inc: { points: points } },
        { session }
      )
      await PointLog.create([{
        from: fromUserId, to: toUserId, amount: points, createdAt: new Date()
      }], { session })
    })

    return result
  } catch (err) {
    console.error('转账失败，已回滚:', err.message)
    throw err
  } finally {
    session.endSession()
  }
}


// ── 方式二：手动控制事务
async function createOrderWithStock(userId, productId, qty) {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const product = await Product.findById(productId).session(session)
    if (product.stock < qty) throw new Error('库存不足')

    await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: -qty } },
      { session }
    )
    const order = await Order.create([{
      userId, productId, qty, amount: product.price * qty
    }], { session })

    await session.commitTransaction()
    return order[0]
  } catch (err) {
    await session.abortTransaction()
    throw err
  } finally {
    session.endSession()
  }
}
```

> **开发提示**：本地单机 MongoDB 不支持事务，需启动副本集：
> ```bash
> mongod --replSet rs0 --bind_ip localhost
> mongosh --eval "rs.initiate()"
> ```

---

### 2.5 性能优化

<span class="lv lv-2">中级</span>

#### 索引 ESR 原则

```
ESR 原则（Equality → Sort → Range）：
复合索引字段顺序：先等值字段 → 再排序字段 → 最后范围字段

示例查询：{ status: "active", createdAt: { $gt: date } } + 按 age 排序
最优索引：{ status: 1, age: 1, createdAt: 1 }
           ↑ 等值      ↑ 排序    ↑ 范围
```

#### 覆盖查询

```js
// 建立复合索引
db.users.createIndex({ email: 1, username: 1, age: 1 })

// 覆盖查询：返回字段完全来自索引，不读磁盘（_id 必须排除）
db.users.find(
  { email: "alice@example.com" },
  { username: 1, age: 1, _id: 0 }
).explain()
// → IXSCAN，totalDocsExamined: 0
```

#### explain 关键指标

```js
const plan = await User.find({ email: 'test@test.com' }).explain('executionStats')

console.log({
  stage:             plan.executionStats.executionStages.stage,
  nReturned:         plan.executionStats.nReturned,
  totalDocsExamined: plan.executionStats.totalDocsExamined,
  totalKeysExamined: plan.executionStats.totalKeysExamined,
  executionTimeMs:   plan.executionStats.executionTimeMillisEstimate,
})
// 理想状态：stage=IXSCAN，totalDocsExamined ≈ nReturned
```

#### 大集合分页优化

```js
// 深分页（skip 大值时性能差，需扫描前 N 条）
// ❌ await Post.find().skip(9900).limit(100)

// 基于游标分页（推荐）
async function getPostsAfter(lastId, limit = 20) {
  const query = lastId
    ? { _id: { $gt: new mongoose.Types.ObjectId(lastId) } }
    : {}
  return Post.find(query).sort({ _id: 1 }).limit(limit).lean()
}

// 按时间戳游标（配合前端"加载更多"）
async function getPostsBefore(lastCreatedAt, limit = 20) {
  const query = lastCreatedAt
    ? { createdAt: { $lt: new Date(lastCreatedAt) } }
    : {}
  return Post.find(query).sort({ createdAt: -1 }).limit(limit).lean()
}
```

#### 慢查询分析

```js
// 开启慢查询（记录超过 100ms 的操作）
db.setProfilingLevel(1, { slowms: 100 })

// 查看慢查询日志
db.system.profile.find().sort({ ts: -1 }).limit(10).pretty()

// 关闭
db.setProfilingLevel(0)
```

#### 其他优化要点

```
✅ .lean()       返回纯 JS 对象，比 Mongoose 文档快 2-3x
✅ select()      只获取需要的字段，减少网络传输
✅ 数组字段       查询时建索引，避免全文档扫描
✅ 读写分离       读请求路由到副本集 Secondary 节点
✅ 连接池         maxPoolSize 设为 CPU 核数 * 2
✅ 避免大文档     超过 1MB 考虑 GridFS 或对象存储
```

---

### 2.6 与 Redis 集成做缓存层

<span class="lv lv-2">中级</span>

```bash
npm install ioredis
```

```js
// utils/cache.js
import Redis from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379,
  db: 0,
})

/**
 * 通用缓存装饰器
 * @param {string}   key  缓存键
 * @param {Function} fn   数据获取函数（返回 Promise）
 * @param {number}   ttl  过期时间（秒），默认 300s
 */
export async function withCache(key, fn, ttl = 300) {
  const cached = await redis.get(key)
  if (cached) {
    console.log(`[Cache HIT] ${key}`)
    return JSON.parse(cached)
  }

  console.log(`[Cache MISS] ${key}`)
  const data = await fn()
  await redis.set(key, JSON.stringify(data), 'EX', ttl)
  return data
}

export async function invalidateCache(pattern) {
  const keys = await redis.keys(pattern)
  if (keys.length) await redis.del(...keys)
}
```

```js
// routes/posts.js 使用缓存
import { withCache, invalidateCache } from '../utils/cache.js'

// 热门文章（缓存 5 分钟）
router.get('/hot', async (req, res) => {
  const data = await withCache(
    'posts:hot',
    () => Post.find({ status: 'published' }).sort({ views: -1 }).limit(10).lean(),
    300
  )
  res.json({ success: true, data })
})

// 单篇文章（缓存 10 分钟）
router.get('/:id', async (req, res) => {
  const data = await withCache(
    `post:${req.params.id}`,
    () => Post.findById(req.params.id).populate('author', 'username').lean(),
    600
  )
  if (!data) return res.status(404).json({ message: '文章不存在' })
  res.json({ success: true, data })
})

// 更新后清除缓存
router.put('/:id', async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
  await invalidateCache(`post:${req.params.id}`)
  await invalidateCache('posts:hot')
  res.json({ success: true, data: post })
})
```

```
缓存策略对比：
┌──────────────┬────────────────────────────────────────────┐
│ 策略          │ 说明                                       │
├──────────────┼────────────────────────────────────────────┤
│ Cache-Aside  │ 应用层控制，先查缓存再查 DB（上述示例）    │
│ Write-Through│ 写 DB 同时写缓存，保证一致性               │
│ Write-Behind │ 先写缓存，异步写 DB，高性能但有丢失风险    │
│ TTL 过期     │ 设置过期时间自动失效，适合可接受稍旧数据   │
└──────────────┴────────────────────────────────────────────┘
```

---

### 2.7 Change Streams

<span class="lv lv-2">中级</span>

Change Streams 监听集合的实时变更（需副本集），适合实时通知、数据同步、审计日志等场景。

```js
// 监听 orders 集合变更
import mongoose from 'mongoose'

async function watchOrders() {
  const collection = mongoose.connection.collection('orders')

  const changeStream = collection.watch(
    [{ $match: { operationType: { $in: ['insert', 'update'] } } }],
    { fullDocument: 'updateLookup' }  // 更新时返回完整文档
  )

  console.log('开始监听订单变更...')

  changeStream.on('change', (change) => {
    const { operationType, fullDocument, updateDescription } = change

    if (operationType === 'insert') {
      console.log('新订单：', fullDocument)
    }
    if (operationType === 'update') {
      console.log('订单更新，修改字段：', updateDescription.updatedFields)
    }
  })

  changeStream.on('error', (err) => console.error('Change Stream 错误:', err))
}

watchOrders()
```

```js
// 结合 Socket.io 实现实时推送
import { Server } from 'socket.io'

const io = new Server(httpServer)
const changeStream = Order.watch([], { fullDocument: 'updateLookup' })

changeStream.on('change', (change) => {
  if (change.operationType === 'insert') {
    io.emit('new-order', change.fullDocument)
  }
})
```

---

### 2.8 数据导入导出

<span class="lv lv-2">中级</span>

```bash
# ── mongoexport：导出为 JSON / CSV ──────────────────────

# 导出集合为 JSON
mongoexport \
  --uri "mongodb://localhost:27017/myapp" \
  --collection users \
  --out users.json

# 导出为 CSV（指定字段）
mongoexport \
  --uri "mongodb://localhost:27017/myapp" \
  --collection users \
  --type csv \
  --fields username,email,age \
  --out users.csv


# ── mongoimport：导入 JSON / CSV ─────────────────────────

# 从 JSON 导入
mongoimport \
  --uri "mongodb://localhost:27017/myapp" \
  --collection users \
  --file users.json \
  --jsonArray

# 从 CSV 导入
mongoimport \
  --uri "mongodb://localhost:27017/myapp" \
  --collection users \
  --type csv \
  --headerline \
  --file users.csv


# ── mongodump / mongorestore：整库备份恢复 ───────────────

# 备份
mongodump \
  --uri "mongodb://localhost:27017/myapp" \
  --out ./backup/$(date +%Y%m%d)

# 恢复（--drop 先删除现有集合）
mongorestore \
  --uri "mongodb://localhost:27017/myapp" \
  --dir ./backup/20240101/myapp \
  --drop


# ── 集合迁移（旧库 → 新库）─────────────────────────────
mongoexport --uri "mongodb://old-server/db" --collection users --out users.json
mongoimport --uri "mongodb://new-server/db" --collection users --file users.json --jsonArray
```

---

### 2.9 MongoDB Atlas 云服务入门

<span class="lv lv-2">中级</span>

Atlas 是 MongoDB 官方云服务，免费的 M0 集群提供 512MB 存储，适合学习和小项目。

#### 免费集群创建步骤

```
1. 注册 https://www.mongodb.com/cloud/atlas
2. 创建组织 → 创建项目 → Build a Cluster
3. 选择 M0 Free（共享集群）→ 选区域（推荐新加坡 / 东京）
4. 创建集群后：
   - Security → Database Access → 添加数据库用户
   - Security → Network Access → 添加 IP（0.0.0.0/0 允许所有，仅测试用）
5. 点击 Connect → Connect your application → 复制连接串
```

#### Node.js 连接 Atlas

```js
// .env
// MONGO_URI=mongodb+srv://user:pwd@cluster0.xxxxx.mongodb.net/myapp?retryWrites=true&w=majority

import mongoose from 'mongoose'

await mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
```

#### Atlas 特色功能

```
Data Explorer      → 浏览器直接查看 / 编辑数据
Atlas Search       → 全文搜索（基于 Lucene）
Performance Advisor→ 自动推荐索引
Triggers           → 数据库触发器（类 Change Streams）
Vector Search      → AI 向量搜索（RAG 应用必备）
App Services       → 无服务器函数、GraphQL API
```

---

### 2.10 实战：完整后端 API 项目结构

<span class="lv lv-2">中级</span>

#### 项目结构

```
backend-api/
├── src/
│   ├── app.js                  # Express 应用
│   ├── server.js               # HTTP 服务入口
│   ├── config/
│   │   └── db.js               # 数据库连接
│   ├── models/
│   │   ├── User.js             # 用户模型
│   │   └── Post.js             # 文章模型
│   ├── controllers/
│   │   ├── authController.js   # 认证逻辑
│   │   └── postController.js   # 文章逻辑
│   ├── routes/
│   │   ├── auth.js             # /api/auth
│   │   └── posts.js            # /api/posts
│   ├── middlewares/
│   │   ├── auth.js             # JWT 验证中间件
│   │   └── errorHandler.js     # 全局错误处理
│   └── utils/
│       └── apiResponse.js      # 统一响应格式
├── .env
└── package.json
```

```bash
npm install express mongoose jsonwebtoken bcryptjs dotenv
```

#### JWT 验证中间件

```js
// src/middlewares/auth.js
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: '未授权，请先登录' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    next()
  } catch (err) {
    res.status(401).json({ message: 'Token 无效或已过期' })
  }
}
```

#### 认证控制器

```js
// src/controllers/authController.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    const hashed = await bcrypt.hash(password, 12)
    const user = await User.create({ username, email, password: hashed })
    const token = signToken(user._id)
    res.status(201).json({ success: true, token, data: { id: user._id, username } })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: '邮箱或密码错误' })
    }
    res.json({ success: true, token: signToken(user._id) })
  } catch (err) {
    next(err)
  }
}
```

#### 文章控制器（带分页）

```js
// src/controllers/postController.js
import { Post } from '../models/Post.js'

export const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category } = req.query
    const filter = category ? { category } : {}
    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'username')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(+limit)
        .lean(),
      Post.countDocuments(filter)
    ])
    res.json({
      success: true,
      data: posts,
      pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (err) {
    next(err)
  }
}

export const createPost = async (req, res, next) => {
  try {
    const post = await Post.create({ ...req.body, author: req.user._id })
    res.status(201).json({ success: true, data: post })
  } catch (err) {
    next(err)
  }
}
```

#### 全局错误处理

```js
// src/middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({ success: false, message: messages.join('; ') })
  }

  // 重复键错误
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({ success: false, message: `${field} 已存在` })
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || '服务器内部错误'
  })
}
```

---

## 三、🔴 高级实战

### 3.1 副本集与分片

<span class="lv lv-3">高级</span>

#### 副本集（Replica Set）

```
副本集：一组保存相同数据的 MongoDB 实例，提供高可用和读写分离。

┌──────────────────────────────────────────────────┐
│                   Replica Set                    │
│                                                  │
│  ┌──────────┐  Oplog  ┌───────────┐             │
│  │ Primary  │────────▶│ Secondary │             │
│  │（读写）   │────────▶│ Secondary │             │
│  └──────────┘         └───────────┘             │
│       │                                          │
│       │  故障时自动选举新 Primary（Raft 协议）    │
└──────────────────────────────────────────────────┘

推荐配置：1 Primary + 2 Secondary（满足多数投票）
或：      1 Primary + 1 Secondary + 1 Arbiter（仲裁节点，仅投票）
```

```bash
# 本地快速启动单节点副本集（开发用）
mongod --replSet rs0 --bind_ip localhost --port 27017 --dbpath ./data
mongosh --eval "rs.initiate()"
```

```js
// Node.js 连接副本集（读写分离）
await mongoose.connect(
  'mongodb://mongo1:27017,mongo2:27017,mongo3:27017/myapp?replicaSet=rs0',
  { readPreference: 'secondaryPreferred' }  // 读优先走 Secondary
)
```

#### 分片集群（Sharding）

```
分片集群：将数据水平拆分到多个分片，每个分片是一个副本集。

┌─────────────────────────────────────────────────────┐
│                   Sharded Cluster                   │
│                                                     │
│  Client → mongos（路由层）→ Config Server（元数据） │
│                  │                                  │
│          ┌───────┴────────┐                         │
│       Shard 1          Shard 2    ...               │
│    (Replica Set)    (Replica Set)                   │
└─────────────────────────────────────────────────────┘

分片键选择原则：
✅ 高基数（如 userId、deviceId）
✅ 均匀分布，避免写热点
✅ 常作为查询条件（目标分片查询，避免广播查询）
❌ 避免单调递增（如 ObjectId、时间戳，导致写热点在单分片）
```

---

### 3.2 WiredTiger 存储引擎

<span class="lv lv-3">高级</span>

WiredTiger 是 MongoDB 3.2+ 默认存储引擎，主要特性：

```
┌──────────────────────────────────────────────────────┐
│              WiredTiger 关键特性                      │
├──────────────────────┬───────────────────────────────┤
│ 文档级并发控制        │ MVCC（多版本并发，读不阻塞写） │
│ 压缩                 │ snappy/zlib，节省磁盘 50%+    │
│ 检查点（Checkpoint） │ 每 60s 写一次，保证崩溃恢复    │
│ Journal（预写日志）   │ 默认每 100ms 同步一次到磁盘   │
│ WiredTiger Cache     │ 默认占 RAM 的 50% - 1GB       │
└──────────────────────┴───────────────────────────────┘

内存配置建议（mongod.conf）：
  storage:
    wiredTiger:
      engineConfig:
        cacheSizeGB: 4     # 建议：(总RAM - 1GB) / 2

工作原理：
  1. 写操作先写 Journal（WAL）
  2. 数据写入内存 Cache
  3. 每 60s 或 Cache 达阈值触发 Checkpoint，将脏页刷盘
  4. 崩溃恢复时从最近 Checkpoint + Journal 重放
```

---

### 3.3 面试高频题 10 条

<span class="lv lv-3">高级</span>

**Q1：MongoDB 和 MySQL 如何选择？**
> 数据结构灵活多变、读多写多、需要水平扩展 → MongoDB；强事务、复杂 JOIN、数据一致性要求极高 → MySQL。实际项目可组合使用（如用户订单用 MySQL，日志/推荐用 MongoDB）。

**Q2：索引失效的场景有哪些？**
> ① 对索引字段做函数/运算（如 `$where` JavaScript）；② 复合索引未遵循最左前缀；③ 低选择性字段单独加索引（如 boolean）；④ `$ne`、`$nin` 通常不走索引；⑤ 正则非前缀匹配（如 `/.*keyword/`）。

**Q3：explain 中 COLLSCAN 和 IXSCAN 的区别？**
> COLLSCAN 全集合扫描，时间复杂度 O(n)；IXSCAN 索引扫描，近似 O(log n)。生产环境查询应避免 COLLSCAN，通过建立合适索引解决。

**Q4：嵌入文档 vs 引用文档如何选择？**
> 数据总是一起读取、子文档数量有限（<100）、需要原子写入 → 嵌入；子文档数量大、需要独立查询、多对多关系 → 引用。

**Q5：MongoDB 如何保证数据一致性？**
> 单文档操作原生原子性；多文档需使用事务（4.0+，需副本集）；副本集通过 Oplog 保证最终一致；写关注 `{ w: "majority" }` 确保多数节点持久化后才返回成功。

**Q6：聚合管道和 MapReduce 的区别？**
> 聚合管道在 C++ 层原生执行，性能更高；MapReduce 用 JavaScript 执行，MongoDB 5.0+ 已标记为废弃。生产环境应优先使用聚合管道。

**Q7：什么是 Oplog？**
> Oplog（Operations Log）是副本集中 Primary 节点的特殊固定集合（capped collection），记录所有写操作。Secondary 节点拉取 Oplog 进行同步；Change Streams 也基于 Oplog 实现。Oplog 存储在 `local.oplog.rs`。

**Q8：如何处理 MongoDB 中的大文档（>1MB）？**
> 使用 GridFS（MongoDB 内置，将文件分块存入 `fs.files` 和 `fs.chunks`）；或将大字段（图片、富文本）存入对象存储（OSS/S3），数据库只存 URL 和元数据。

**Q9：$lookup 与嵌入文档的性能对比？**
> $lookup 需要跨集合扫描，性能不如嵌入；高频联合查询场景优先嵌入。若必须使用 $lookup，在 `foreignField` 上建索引可大幅提升性能（避免全集合扫描）。

**Q10：MongoDB 内存不足时有哪些优化手段？**
> ① 增加 WiredTiger `cacheSizeGB`；② 只 `select` 需要的字段，减少工作集；③ 建立覆盖索引（索引即数据）；④ 冷数据归档（TTL 索引或手动迁移）；⑤ 升级实例或启用分片横向扩容。

---

> 文档版本：v1.0 · 更新日期：2026-07-01
> 适用版本：MongoDB 6.x / 7.x · Mongoose 7.x / 8.x · Node.js 18+
