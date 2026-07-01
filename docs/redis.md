# Redis 全阶段学习手册

> 面向前端转全栈的开发者 —— 全栈偏前端，后端为辅

---

## 目录

- [一、🟢 初级入门](#一初级入门)
  - [1.1 Redis 是什么 & 为什么快](#11-redis-是什么--为什么快)
  - [1.2 安装与连接](#12-安装与连接)
  - [1.3 与 MySQL 对比](#13-与-mysql-对比)
  - [1.4 五种基本数据类型详解 + 常用命令](#14-五种基本数据类型详解--常用命令)
  - [1.5 Key 管理与过期策略](#15-key-管理与过期策略)
  - [1.6 redis-cli 常用操作速查](#16-redis-cli-常用操作速查)
  - [1.7 Node.js 连接 Redis](#17-nodejs-连接-redis)
- [二、🟡 中级进阶](#二中级进阶)
  - [2.1 缓存策略](#21-缓存策略cache-aside--readwrite-through--write-behind)
  - [2.2 缓存问题三件套](#22-缓存问题三件套穿透--击穿--雪崩)
  - [2.3 持久化：RDB vs AOF](#23-持久化rdb-快照-vs-aof-日志)
  - [2.4 事务与 Lua 脚本](#24-事务与-lua-脚本)
  - [2.5 发布订阅模式](#25-发布订阅pubsub模式)
  - [2.6 Redis 作为消息队列](#26-redis-作为消息队列list--stream)
  - [2.7 实战：Node.js + Redis Session 存储](#27-实战nodejs--redis-session-存储)
  - [2.8 实战：Node.js + Redis 接口限流](#28-实战nodejs--redis-接口限流滑动窗口)
  - [2.9 实战：Node.js + Redis 排行榜](#29-实战nodejs--redis-排行榜zset)
  - [2.10 数据结构底层原理速览](#210-数据结构底层原理速览)
- [三、🔴 高级实战](#三高级实战)
  - [3.1 主从复制与哨兵](#31-主从复制与哨兵)
  - [3.2 Cluster 分片](#32-cluster-分片)
  - [3.3 面试高频题 12 条](#33-面试高频题-12-条)

---

# 一、🟢 初级入门

---

## 1.1 Redis 是什么 & 为什么快 <span class="lv lv-1">初级</span>

### Redis 是什么？

**R**emote **Di**ctionary **S**erver —— 远程字典服务，一个开源的、基于内存的键值对存储系统。

它既是数据库，也常被当作 **缓存** 和 **消息队列** 使用。

### 为什么快？三大核心原因

```
┌─────────────────────────────────────────────────────────────────┐
│                    Redis 为什么这么快？                          │
│                                                                 │
│  ① 基于内存 —— 数据存内存，读取延迟 ~100ns（纳秒级）            │
│                                                                 │
│     ┌──────────┐        ┌──────────┐                            │
│     │  内存读取 │ ~100ns │  磁盘读取 │ ~10ms                     │
│     │  ████████│        │  █       │                            │
│     └──────────┘        └──────────┘                            │
│     快 ~10万倍                                                   │
│                                                                 │
│  ② 单线程模型 —— 无锁竞争、无上下文切换开销                      │
│                                                                 │
│     多线程:  线程A ──┐                                           │
│              线程B ──┼── 锁竞争 ── 上下文切换 ── 效率↓           │
│              线程C ──┘                                           │
│                                                                 │
│     单线程:  主线程 ── 顺序执行 ── 无锁 ── 无切换 ── 效率↑       │
│                                                                 │
│  ③ IO 多路复用 —— 一个线程监听多个连接，哪个就绪处理哪个         │
│                                                                 │
│     ┌────────┐                                                   │
│     │ Client1│──┐                                                │
│     │ Client2│──┼──► epoll/select ──► 事件循环 ──► 处理就绪事件  │
│     │ Client3│──┘                                                │
│     │  ...   │     一个线程管理上万个连接                          │
│     └────────┘                                                   │
└─────────────────────────────────────────────────────────────────┘
```

> **前端类比**：IO 多路复用 ≈ 浏览器的事件循环（Event Loop），单线程轮流处理多个异步任务。

### 单线程为什么还快？

虽然命令执行是单线程，但：

| 操作 | 是否阻塞主线程 | 说明 |
|------|:---:|------|
| 命令执行 | 是 | 但都是内存操作，极快 |
| 网络读写 | 否 | IO 多路复用，不阻塞 |
| 持久化 | 否 | fork 子进程处理 |
| 删除大 Key | 否 | Redis 4.0+ 异步删除 |

---

## 1.2 安装与连接 <span class="lv lv-1">初级</span>

### 方式一：Docker（推荐）

```bash
# 拉取并运行 Redis
docker run -d \
  --name my-redis \
  -p 6379:6379 \
  redis:7

# 带密码 + 持久化
docker run -d \
  --name my-redis \
  -p 6379:6379 \
  -v redis-data:/data \
  redis:7 --requirepass yourpassword --appendonly yes

# 进入 redis-cli
docker exec -it my-redis redis-cli
```

### 方式二：各系统直接安装

```bash
# ── Mac ──
brew install redis
brew services start redis

# ── Ubuntu/Debian ──
sudo apt update && sudo apt install redis-server -y
sudo systemctl start redis-server

# ── Windows ──
# 方案1: WSL2 + Docker（推荐）
# 方案2: 下载 Windows 移植版 https://github.com/tporadowski/redis/releases
# 方案3: Redis 官方不支持 Windows，建议用 Docker
```

### 连接方式

```bash
# 默认连接 localhost:6379
redis-cli

# 指定地址和端口
redis-cli -h 127.0.0.1 -p 6379

# 带密码
redis-cli -h 127.0.0.1 -p 6379 -a yourpassword

# 连接后测试
127.0.0.1:6379> PING
PONG

# 查看服务器信息
127.0.0.1:6379> INFO server
```

---

## 1.3 与 MySQL 对比 <span class="lv lv-1">初级</span>

| 对比项 | Redis | MySQL |
|:---|:---|:---|
| **类型** | 键值对（NoSQL） | 关系型数据库（RDBMS） |
| **存储** | 内存为主，可持久化到磁盘 | 磁盘为主，Buffer Pool 缓存 |
| **读写速度** | ~10万 QPS | ~数千 QPS |
| **数据结构** | String/Hash/List/Set/ZSet 等 | 表（行+列） |
| **事务** | 简单事务（MULTI）无回滚 | 完整 ACID 事务 |
| **查询** | 按 Key 精确查询 | SQL 灵活查询、JOIN、聚合 |
| **持久化** | RDB/AOF（可选） | 默认持久化 |
| **典型场景** | 缓存、会话、排行榜、限流 | 业务数据存储、复杂查询 |
| **容量** | 受内存限制（GB 级） | 受磁盘限制（TB 级） |

```
┌─────────────────────────────────────────────────────┐
│              前端全栈的典型架构                       │
│                                                     │
│   浏览器 ──► Node.js 服务 ──► Redis（缓存/会话）    │
│                      │                              │
│                      └──► MySQL（持久化存储）        │
│                                                     │
│   热/临时数据 → Redis                                │
│   冷/持久数据 → MySQL                                │
└─────────────────────────────────────────────────────┘
```

---

## 1.4 五种基本数据类型详解 + 常用命令 <span class="lv lv-1">初级</span>

### 速览表

| 类型 | 说明 | 前端类比 | 典型场景 |
|:---|:---|:---|:---|
| **String** | 字符串/数字，最大 512MB | JS string/number | 缓存、计数器、分布式锁 |
| **Hash** | 字段-值映射 | JS Object/Map | 用户信息、商品详情 |
| **List** | 有序可重复列表 | JS Array | 消息队列、最新列表 |
| **Set** | 无序不重复集合 | JS Set | 标签、共同好友、去重 |
| **ZSet** | 有序不重复集合（带分数） | Array + sort | 排行榜、延时队列 |

---

### 1.4.1 String 字符串

```
  Key         Value
┌───────┐   ┌──────────────────┐
│ name  │──►│ "zhangsan"       │
│ age   │──►│ "25"             │  ← 数字也存为字符串
│ token │──►│ "eyJhbG..."      │
└───────┘   └──────────────────┘
```

```bash
# 基础读写
SET name "zhangsan"          # 设置
GET name                     # 获取 → "zhangsan"

# 设置过期（秒）
SETEX verify_code 60 "123456"   # 60秒后自动删除
GET verify_code                  # 60秒内 → "123456"

# 计数器
SET page_views 0
INCR page_views              # → 1
INCR page_views              # → 2
INCRBY page_views 10         # → 12
DECR page_views              # → 11

# 追加
SET greeting "hello"
APPEND greeting " world"     # → "hello world"
STRLEN greeting              # → 11

# 仅当不存在时设置（分布式锁常用）
SETNX lock_key "locked"      # 首次 → 1(成功)
SETNX lock_key "locked"      # 再次 → 0(失败)

# 同时设置多个
MSET k1 "v1" k2 "v2" k3 "v3"
MGET k1 k2 k3                # → ["v1","v2","v3"]
```

---

### 1.4.2 Hash 哈希

```
  Key: user:1001
┌──────────┬──────────────┐
│  Field   │    Value     │
├──────────┼──────────────┤
│  name    │ "zhangsan"   │
│  age     │ "25"         │
│  role    │ "admin"      │
└──────────┴──────────────┘

对比 String 存 JSON:
  SET user:1001 '{"name":"zhangsan","age":"25"}'
  → 修改 age 需要读取→改写→存回（3步）
  Hash 只需 HSET user:1001 age "26"（1步）
```

```bash
# 单字段操作
HSET user:1001 name "zhangsan"      # 设置单字段
HGET user:1001 name                  # → "zhangsan"

# 多字段操作
HMSET user:1001 name "zhangsan" age "25" role "admin"
HMGET user:1001 name age             # → ["zhangsan","25"]

# 获取所有字段
HGETALL user:1001
# → 1) "name"  2) "zhangsan"  3) "age"  4) "25"  5) "role"  6) "admin"

# 删除字段
HDEL user:1001 role

# 检查字段是否存在
HEXISTS user:1001 name               # → 1(存在)

# 只获取所有字段名/值
HKEYS user:1001                       # → ["name","age"]
HVALS user:1001                       # → ["zhangsan","25"]

# 字段值自增
HINCRBY user:1001 age 1              # age → 26
```

---

### 1.4.3 List 列表

```
  Key: tasks
┌─────┬─────┬─────┬─────┐
│ "d" │ "c" │ "b" │ "a" │   ← 有序，可重复
└─────┴─────┴─────┴─────┘
  ▲ LPUSH              RPUSH ▲
  │                          │
  └── 左端（头部）  右端（尾部）┘

  LPOP ▲                    ▲ RPOP
```

```bash
# 从两端推入
LPUSH tasks "task-a" "task-b"   # 左端推入 → ["task-b","task-a"]
RPUSH tasks "task-c"            # 右端推入 → ["task-b","task-a","task-c"]

# 查看范围
LRANGE tasks 0 -1                # 全部 → ["task-b","task-a","task-c"]
LRANGE tasks 0 1                 # → ["task-b","task-a"]

# 从两端弹出
LPOP tasks                       # → "task-b"（左端弹出）
RPOP tasks                       # → "task-c"（右端弹出）

# 获取长度
LLEN tasks                       # → 1

# 阻塞弹出（消息队列用，超时秒数，0=无限等待）
BLPOP queue:email 30             # 30秒内等数据，超时返回nil
BRPOP queue:email 30
```

---

### 1.4.4 Set 集合

```
  Key: tags:article:1
  ┌───────────────────┐
  │  "javascript"     │
  │  "redis"      ●───┼──► 无序，不重复，自动去重
  │  "nodejs"         │
  └───────────────────┘
```

```bash
# 添加 & 查看
SADD tags "javascript" "redis" "nodejs"
SMEMBERS tags                  # → ["javascript","redis","nodejs"]

# 判断成员是否存在
SISMEMBER tags "redis"         # → 1(存在)

# 删除成员
SREM tags "redis"

# 集合运算
SADD set-a "a" "b" "c"
SADD set-b "b" "c" "d"

SINTER set-a set-b             # 交集 → ["b","c"]
SUNION set-a set-b             # 并集 → ["a","b","c","d"]
SDIFF set-a set-b              # 差集 → ["a"]

# 随机弹出一个
SPOP tags                      # 随机返回并删除一个成员

# 集合大小
SCARD tags                     # → 2
```

---

### 1.4.5 ZSet（Sorted Set）有序集合

```
  Key: leaderboard
┌───────┬──────────────┐
│ Score │   Member     │
├───────┼──────────────┤
│  100  │ "player-a"   │   ← 按 Score 排序
│  200  │ "player-b"   │   ← Member 不重复
│  350  │ "player-c"   │   ← Score 可重复
│  500  │ "player-d"   │
└───────┴──────────────┘
```

```bash
# 添加成员（带分数）
ZADD leaderboard 100 "player-a" 200 "player-b" 350 "player-c"

# 按分数范围查询（WITHSCORES 同时返回分数）
ZRANGE leaderboard 0 -1 WITHSCORES
# → ["player-a",100,"player-b",200,"player-c",350]

# 按分数范围查询
ZRANGEBYSCORE leaderboard 100 300 WITHSCORES
# → ["player-a",100,"player-b",200]

# 反向查询（从高到低）
ZREVRANGE leaderboard 0 2 WITHSCORES
# → ["player-c",350,"player-b",200,"player-a",100]

# 查看某个成员的排名（从0开始）
ZRANK leaderboard "player-b"       # → 1（升序排名）

# 查看某个成员的分数
ZSCORE leaderboard "player-b"      # → 200

# 增加分数
ZINCRBY leaderboard 50 "player-b"  # → 250

# 删除成员
ZREM leaderboard "player-a"

# 集合大小
ZCARD leaderboard                   # → 2
```

---

## 1.5 Key 管理与过期策略 <span class="lv lv-1">初级</span>

```bash
# ── 过期时间 ──
SET temp_key "hello" EX 60          # 创建时设置60秒过期
EXPIRE temp_key 120                  # 对已有key设置过期（秒）
EXPIRE temp_key 120000 PX           # 毫秒
TTL temp_key                         # 查看剩余秒数 → 118
PTTL temp_key                        # 查看剩余毫秒数

# 取消过期（变为永久）
PERSIST temp_key

# ── 查看与删除 ──
EXISTS temp_key                      # → 1(存在) / 0(不存在)
DEL temp_key                         # 删除，可删多个: DEL k1 k2 k3
TYPE temp_key                        # → "string" / "hash" / "list" ...

# ── 批量查找 Key ──
KEYS user:*                          # ⚠️ 生产环境慎用！会阻塞
SCAN 0 MATCH user:* COUNT 100        # ✅ 推荐用 SCAN 分批遍历

# ── 重命名 ──
RENAME old_key new_key
```

### 过期删除策略

```
┌─────────────────────────────────────────────────────────┐
│          Redis 过期 Key 的两种删除方式                    │
│                                                         │
│  ① 惰性删除（Lazy Delete）                              │
│     访问 Key 时才检查是否过期 → 过期则删除               │
│     优点：CPU 友好  缺点：可能占内存                     │
│                                                         │
│  ② 定期删除（Periodic Delete）                           │
│     每 100ms 随机抽取一批 Key → 过期则删除               │
│     兼顾 CPU 和内存                                     │
│                                                         │
│  Redis = 惰性 + 定期 两者结合                            │
│                                                         │
│  ⚠ 如果大量 Key 过期但未被访问 → 内存泄漏风险            │
│     → 需配合 maxmemory + 淘汰策略                       │
└─────────────────────────────────────────────────────────┘
```

### 内存淘汰策略（maxmemory-policy）

| 策略 | 说明 | 适用场景 |
|:---|:---|:---|
| `noeviction` | 不淘汰，写入报错（默认） | 数据不能丢失 |
| `allkeys-lru` | 所有 Key 中淘汰最久未用的 | **缓存最常用** |
| `volatile-lru` | 过期 Key 中淘汰最久未用的 | 混合缓存+持久 |
| `allkeys-lfu` | 所有 Key 中淘汰最少使用的 | 热/冷数据分明 |
| `volatile-lfu` | 过期 Key 中淘汰最少使用的 | - |
| `allkeys-random` | 随机淘汰 | 无访问热点 |
| `volatile-random` | 过期 Key 中随机淘汰 | - |
| `volatile-ttl` | 淘汰 TTL 最小的 | 有明确过期需求 |

---

## 1.6 redis-cli 常用操作速查 <span class="lv lv-1">初级</span>

```bash
# ── 连接 ──
redis-cli                            # 默认连接
redis-cli -h host -p port -a pwd     # 完整参数

# ── 信息查看 ──
INFO                                  # 服务器全部信息
INFO memory                           # 内存信息
INFO stats                            # 统计信息
DBSIZE                                # 当前库 Key 数量
CONFIG GET maxmemory                  # 查看配置

# ── 数据库 ──
SELECT 1                              # 切换到 1 号库（共0-15，共16个）
FLUSHDB                               # 清空当前库
FLUSHALL                              # 清空所有库 ⚠️

# ── 调试 ──
DEBUG OBJECT key                      # 查看 Key 内部编码
OBJECT ENCODING key                   # 查看底层编码（ziplist/hashtable等）
SLOWLOG GET 10                        # 查看最近10条慢查询

# ── 客户端 ──
CLIENT LIST                           # 查看连接列表
CLIENT KILL ADDR                      # 踢掉连接

# ── 监控 ──
MONITOR                               # 实时查看所有命令（调试用，生产慎开）
```

---

## 1.7 Node.js 连接 Redis <span class="lv lv-1">初级</span>

### 安装 ioredis

```bash
npm install ioredis
```

### 基础连接与 CRUD

```typescript
// redis-demo.ts
import Redis from 'ioredis'

const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
  password: undefined,     // 无密码留 undefined
  db: 0,                   // 使用0号库
})

// ── String ──
await redis.set('name', 'zhangsan')
const name = await redis.get('name')
console.log(name)  // "zhangsan"

await redis.setex('verify_code', 60, '123456')  // 60秒过期
await redis.incr('page_views')                   // 计数器 +1

// ── Hash ──
await redis.hset('user:1001', 'name', 'zhangsan')
await redis.hset('user:1001', 'age', '25')
await redis.hmset('user:1002', { name: 'lisi', age: '30' })
const user = await redis.hgetall('user:1001')
console.log(user)  // { name: 'zhangsan', age: '25' }

// ── List ──
await redis.lpush('tasks', 'task-a', 'task-b')
await redis.rpush('tasks', 'task-c')
const tasks = await redis.lrange('tasks', 0, -1)
console.log(tasks)  // ["task-b","task-a","task-c"]

// ── Set ──
await redis.sadd('tags', 'javascript', 'redis', 'nodejs')
const isMember = await redis.sismember('tags', 'redis')
console.log(isMember)  // 1

// ── ZSet ──
await redis.zadd('leaderboard', 100, 'player-a', 200, 'player-b')
const top3 = await redis.zrevrange('leaderboard', 0, 2, 'WITHSCORES')
console.log(top3)  // ["player-b","200","player-a","100"]

// ── Key 管理 ──
await redis.expire('name', 300)          // 5分钟过期
const ttl = await redis.ttl('name')      // 剩余秒数
await redis.del('name')                   // 删除

// ── 断开连接 ──
redis.quit()
```

### 连接事件与错误处理

```typescript
const redis = new Redis({ host: '127.0.0.1', port: 6379 })

redis.on('connect', () => console.log('✅ Redis 已连接'))
redis.on('error', (err) => console.error('❌ Redis 错误:', err))
redis.on('close', () => console.log('🔌 Redis 连接关闭'))

// Pipeline 批量执行（减少网络往返）
const pipeline = redis.pipeline()
pipeline.set('k1', 'v1')
pipeline.set('k2', 'v2')
pipeline.get('k1')
pipeline.get('k2')
const results = await pipeline.exec()
// [[null,'OK'],[null,'OK'],[null,'v1'],[null,'v2']]
```

---

# 二、🟡 中级进阶

---

## 2.1 缓存策略：Cache Aside / Read/Write Through / Write Behind <span class="lv lv-2">中级</span>

### ① Cache Aside（旁路缓存）—— 最常用

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│  客户端  │     │  应用层  │     │  数据层  │
└────┬────┘     └────┬────┘     └────┬────┘
     │               │               │
     │  读请求       │               │
     │──────────────►│               │
     │               │──► 查缓存     │
     │               │    命中？     │
     │               │  ┌─YES──────►│──► 返回缓存数据
     │               │  │           │
     │               │  NO         │
     │               │──► 查 DB ──►│
     │               │◄── DB 数据 ──│
     │               │──► 写缓存   │
     │◄── 返回数据 ──│              │
     │               │              │
     │  写请求       │              │
     │──────────────►│              │
     │               │──► 写 DB ──►│
     │               │──► 删缓存   │  ← 注意是删除，不是更新！
     │◄── 返回成功 ──│              │
```

```typescript
// Cache Aside 实现
async function getUser(id: string) {
  const cacheKey = `user:${id}`

  // 1. 先查缓存
  const cached = await redis.get(cacheKey)
  if (cached) return JSON.parse(cached)

  // 2. 缓存未命中，查数据库
  const user = await db.user.findUnique({ where: { id } })
  if (!user) return null

  // 3. 写入缓存，设置过期
  await redis.setex(cacheKey, 300, JSON.stringify(user))
  return user
}

async function updateUser(id: string, data: Partial<User>) {
  // 1. 先更新数据库
  const user = await db.user.update({ where: { id }, data })

  // 2. 再删除缓存（不是更新缓存！）
  await redis.del(`user:${id}`)
  return user
}
```

### ② Read/Write Through（读穿/写穿）

```
Cache Aside:  应用自己管理缓存和数据库的读写
Read/Write Through:  应用只跟缓存交互，缓存层负责同步到数据库

┌────────┐      ┌──────────────┐      ┌─────────┐
│  应用   │─────►│   缓存层      │─────►│ 数据库  │
└────────┘      │ (自动同步DB)  │      └─────────┘
                └──────────────┘
```

- **Read Through**：缓存未命中时，由缓存层自动从 DB 加载
- **Write Through**：写入缓存时，由缓存层同步写入 DB

> Redis 本身不直接支持，需在应用层封装。

### ③ Write Behind（异步回写）

```
┌────────┐      ┌──────────────┐       ┌─────────┐
│  应用   │─────►│   缓存层      │ ──┐   │ 数据库  │
└────────┘      │ (写缓存即可)  │   │   └─────────┘
                └──────────────┘   │       ▲
                                   └── 异步批量写入 ──┘
```

- 写操作只更新缓存，由后台定时/定量批量写入 DB
- 优点：写性能极高；缺点：可能丢数据

### 三种策略对比

| 策略 | 读路径 | 写路径 | 一致性 | 复杂度 | 场景 |
|:---|:---|:---|:---|:---|:---|
| **Cache Aside** | 缓存→DB→回填 | 写DB→删缓存 | 最终一致 | 低 | **最常用** |
| **Read/Write Through** | 缓存层代理读 | 缓存层代理写 | 较强 | 中 | 封装完善时 |
| **Write Behind** | 同 Cache Aside | 只写缓存 | 弱 | 高 | 写多读少 |

---

## 2.2 缓存问题三件套：穿透 / 击穿 / 雪崩 <span class="lv lv-2">中级</span>

```
┌──────────────────────────────────────────────────────────────────┐
│                     缓存问题三件套                                │
│                                                                  │
│  穿透:  请求的数据 DB 里根本没有 → 缓存永远不命中 → DB被打       │
│         🎯 目标不存在的数据                                      │
│                                                                  │
│  击穿:  某个热点 Key 过期瞬间 → 大量请求直达 DB                  │
│         🎯 一个 Key 过期                                         │
│                                                                  │
│  雪崩:  大量 Key 同时过期 → 大量请求直达 DB                      │
│         🎯 一批 Key 同时过期                                     │
│                                                                  │
│         ┌─────┐                                                  │
│  穿透 → │不存在│  击穿 → 1个过期  雪崩 → 批量过期                 │
│         └─────┘                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### ① 缓存穿透

**原因**：查询不存在的数据，缓存无值可存，每次都打 DB。

**解决方案**：

```typescript
// 方案1: 缓存空值（null caching）
async function getUser(id: string) {
  const cacheKey = `user:${id}`
  const cached = await redis.get(cacheKey)

  if (cached !== null) {
    const value = JSON.parse(cached)
    return value === '__NULL__' ? null : value  // 命中空值缓存
  }

  const user = await db.user.findUnique({ where: { id } })

  if (!user) {
    // 缓存空值，短过期时间（防止真实数据被创建后缓存不一致）
    await redis.setex(cacheKey, 60, JSON.stringify('__NULL__'))
    return null
  }

  await redis.setex(cacheKey, 300, JSON.stringify(user))
  return user
}

// 方案2: 布隆过滤器（Bloom Filter）—— 在缓存前加一层过滤
// 用 Redis 的 Bitmap 或 RedisBloom 模块实现
// 不存在的 ID 一定被拦截，存在的可能误判（概率极低）
```

### ② 缓存击穿

**原因**：热点 Key 过期瞬间，大量并发请求直达 DB。

**解决方案**：

```typescript
// 方案1: 互斥锁（setnx）
async function getHotData(key: string) {
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached)

  // 尝试获取锁
  const lockKey = `lock:${key}`
  const locked = await redis.set(lockKey, '1', 'EX', 10, 'NX')

  if (locked) {
    try {
      // 获得锁，查 DB 并回填缓存
      const data = await db.query(key)
      await redis.setex(key, 300, JSON.stringify(data))
      return data
    } finally {
      await redis.del(lockKey)
    }
  } else {
    // 未获锁，短暂等待后重试
    await sleep(100)
    return getHotData(key)  // 递归重试
  }
}

// 方案2: 逻辑过期（不设TTL，在值中存过期时间）
interface CacheItem<T> {
  data: T
  expireAt: number
}

async function getWithLogicalExpiry(key: string) {
  const raw = await redis.get(key)
  if (!raw) return null

  const item: CacheItem<any> = JSON.parse(raw)

  if (Date.now() < item.expireAt) {
    return item.data  // 未过期
  }

  // 已过期 → 异步刷新，先返回旧数据
  const lockKey = `lock:${key}`
  const locked = await redis.set(lockKey, '1', 'EX', 10, 'NX')
  if (locked) {
    // 后台异步刷新
    setTimeout(async () => {
      const data = await db.query(key)
      await redis.set(key, JSON.stringify({
        data,
        expireAt: Date.now() + 300_000,
      }))
      await redis.del(lockKey)
    }, 0)
  }

  return item.data  // 返回旧数据（保证可用性）
}
```

### ③ 缓存雪崩

**原因**：大量 Key 同时过期，或 Redis 宕机。

**解决方案**：

```typescript
// 方案1: 过期时间加随机偏移
function randomExpire(baseSeconds: number, jitterRange = 60) {
  const jitter = Math.floor(Math.random() * jitterRange)
  return baseSeconds + jitter
}

await redis.setex('user:1001', randomExpire(300), JSON.stringify(user))
await redis.setex('user:1002', randomExpire(300), JSON.stringify(user))
// 过期时间在 300~360 秒之间随机分布

// 方案2: 多级缓存（Redis + 本地缓存）
// 方案3: Redis 高可用（主从 + 哨兵）
// 方案4: 限流降级（兜底策略）
```

### 三者速记对比

| 问题 | 触发条件 | 核心解决 | 关键词 |
|:---|:---|:---|:---|
| **穿透** | 数据不存在 | 缓存空值 / 布隆过滤器 | "查不到" |
| **击穿** | 热点 Key 过期 | 互斥锁 / 逻辑过期 | "一个过期" |
| **雪崩** | 批量 Key 过期 | 随机 TTL / 多级缓存 / 高可用 | "一批过期" |

---

## 2.3 持久化：RDB 快照 vs AOF 日志 <span class="lv lv-2">中级</span>

```
┌────────────────────────────────────────────────────────────────┐
│                      Redis 持久化                              │
│                                                                │
│  ┌──────────────┐              ┌──────────────┐                │
│  │   RDB 快照    │              │   AOF 日志    │                │
│  │              │              │              │                │
│  │ 某时刻全量    │              │ 每次写操作    │                │
│  │ 数据快照文件  │              │ 追加到日志    │                │
│  │              │              │              │                │
│  │ save/bgsave  │              │ always/      │                │
│  │              │              │ everysec/no  │                │
│  └──────────────┘              └──────────────┘                │
│                                                                │
│  实际生产建议：RDB + AOF 混合使用                               │
└────────────────────────────────────────────────────────────────┘
```

### 对比表

| 对比项 | RDB | AOF |
|:---|:---|:---|
| **原理** | 定时全量快照 | 追加每条写命令 |
| **文件** | dump.rdb（二进制，紧凑） | appendonly.aof（文本，可读） |
| **恢复速度** | 快（直接加载） | 慢（重放命令） |
| **数据安全** | 可能丢失两次快照间的数据 | 最多丢 1 秒（everysec） |
| **文件大小** | 小（压缩后） | 大（需定期重写 BGREWRITEAOF） |
| **对性能影响** | fork 时短暂影响 | 取决于刷盘策略 |
| **适用场景** | 备份 / 灾恢 | 数据安全要求高 |

### RDB 配置

```bash
# redis.conf
save 900 1       # 900秒内至少1次修改 → 触发bgsave
save 300 10      # 300秒内至少10次修改
save 60 10000    # 60秒内至少10000次修改

rdbcompression yes    # 压缩
rdbfilename dump.rdb  # 文件名
dir ./                # 存储目录
```

### AOF 配置

```bash
# redis.conf
appendonly yes                  # 开启 AOF
appendfilename "appendonly.aof"

# 刷盘策略
appendfsync always    # 每次写入都刷盘 → 最安全，最慢
appendfsync everysec  # 每秒刷盘 → 推荐，最多丢1秒
appendfsync no        # 由OS决定 → 最快，最不安全

# AOF 重写（压缩）
auto-aof-rewrite-percentage 100   # 文件增长100%时重写
auto-aof-rewrite-min-size 64mb    # 最小64MB才重写
```

### Redis 4.0+ 混合持久化

```bash
# redis.conf
aof-use-rdb-preamble yes   # AOF 重写时前半段用 RDB 格式，后半段用 AOF
                            # 兼顾恢复速度和数据安全
```

---

## 2.4 事务与 Lua 脚本 <span class="lv lv-2">中级</span>

### Redis 事务（MULTI / EXEC / WATCH）

```bash
# MULTI 开启事务 → 命令入队 → EXEC 一次性执行
127.0.0.1:6379> MULTI
OK
127.0.0.1:6379> SET account:a 100
QUEUED
127.0.0.1:6379> SET account:b 200
QUEUED
127.0.0.1:6379> EXEC
1) OK
2) OK

# DISCARD 放弃事务
127.0.0.1:6379> MULTI
127.0.0.1:6379> SET foo bar
127.0.0.1:6379> DISCARD   # 取消，命令不执行

# WATCH 乐观锁 —— 监视 Key，执行前若被修改则事务失败
127.0.0.1:6379> WATCH account:a
OK
127.0.0.1:6379> MULTI
127.0.0.1:6379> DECRBY account:a 50
127.0.0.1:6379> INCRBY account:b 50
# 如果另一个客户端修改了 account:a，EXEC 返回 nil（事务失败）
127.0.0.1:6379> EXEC
```

> **注意**：Redis 事务不支持回滚！某条命令失败，其余命令仍会执行。

### Lua 脚本 —— 真正的原子操作

Redis 保证 Lua 脚本执行期间不会被其他命令打断，适合需要原子性的复合操作。

```bash
# 语法: EVAL "lua脚本" key数量 key1 key2 ... arg1 arg2 ...

# 示例: 限流 —— 滑动窗口
EVAL "
  local key = KEYS[1]
  local limit = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  local now = tonumber(ARGV[3])
  redis.call('ZREMRANGEBYSCORE', key, 0, now - window)
  local count = redis.call('ZCARD', key)
  if count < limit then
    redis.call('ZADD', key, now, now .. ':' .. math.random())
    redis.call('EXPIRE', key, window / 1000)
    return 1
  end
  return 0
" 1 rate_limit:user:123 10 60000 1719800000000
```

```typescript
// Node.js 中使用 Lua 脚本
const limitScript = `
  local key = KEYS[1]
  local limit = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  local now = tonumber(ARGV[3])
  redis.call('ZREMRANGEBYSCORE', key, 0, now - window)
  local count = redis.call('ZCARD', key)
  if count < limit then
    redis.call('ZADD', key, now, now .. ':' .. math.random())
    redis.call('EXPIRE', key, window / 1000)
    return 1
  end
  return 0
`

// evalsha 方式（脚本只需发送一次，后续用 SHA1 调用）
const sha = await redis.script('load', limitScript)
const allowed = await redis.evalsha(sha, 1,
  'rate_limit:user:123', '10', '60000', String(Date.now())
)
console.log(allowed)  // 1=允许, 0=拒绝
```

---

## 2.5 发布订阅（PUB/SUB）模式 <span class="lv lv-2">中级</span>

```
┌───────────┐         ┌───────────┐         ┌───────────┐
│ Publisher │         │   Redis   │         │Subscriber │
│  发布者   │────────►│  消息代理  │────────►│  订阅者A  │
└───────────┘  PUBLISH└───────────┘ SUBSCRIBE└───────────┘
                                       ┌───────────┐
                                       │Subscriber │
                                       │  订阅者B  │
                                       └───────────┘

  ⚠ 消息不持久化！订阅者离线期间的消息会丢失
```

```bash
# 终端1: 订阅频道
SUBSCRIBE chat:room1

# 终端2: 发布消息
PUBLISH chat:room1 "hello everyone"

# 订阅多个频道
SUBSCRIBE chat:room1 chat:room2

# 按模式订阅
PSUBSCRIBE chat:*     # 匹配所有 chat: 开头的频道
```

```typescript
// Node.js 发布订阅
import Redis from 'ioredis'

// 订阅者需要单独的连接（订阅模式的连接不能执行普通命令）
const subscriber = new Redis()
const publisher = new Redis()

// 订阅
subscriber.subscribe('chat:room1', 'chat:room2')
subscriber.on('message', (channel, message) => {
  console.log(`[${channel}] ${message}`)
})

// 发布
await publisher.publish('chat:room1', 'Hello from Node.js!')
```

> **PUB/SUB vs 消息队列**：PUB/SUB 是广播模式（所有订阅者都收到），消息队列是竞争消费（一条消息只被一个消费者处理）。

---

## 2.6 Redis 作为消息队列 <span class="lv lv-2">中级</span>

### 方式一：List 实现简单队列

```
生产者 RPUSH ──► [msg1, msg2, msg3] ──► LPOP 消费者
                  ┌──────────────────┐
                  │  queue:emails    │
                  └──────────────────┘
```

```typescript
// 生产者
async function produce(queue: string, message: string) {
  await redis.rpush(queue, message)
}

// 消费者（阻塞式）
async function consume(queue: string) {
  // BLPOP 阻塞等待，超时 0 表示无限等待
  const [, message] = await redis.blpop(queue, 0)
  console.log('收到:', message)
}
```

### 方式二：Stream（Redis 5.0+）—— 更专业的消息队列

```
Stream 数据结构:
┌──────────────────────────────────────────────────────┐
│  stream:orders                                       │
│  ┌─────────────────┬───────────────────────────────┐ │
│  │     Entry ID    │          Fields               │ │
│  ├─────────────────┼───────────────────────────────┤ │
│  │ 1719800000000-0 │ product=iPhone  price=8999   │ │
│  │ 1719800001000-0 │ product=MacBook price=12999  │ │
│  │ 1719800002000-0 │ product=iPad   price=3999    │ │
│  └─────────────────┴───────────────────────────────┘ │
│                                                      │
│  Consumer Group: order-processors                    │
│  ├── Consumer-A: 处理 0-0 ~ ... (pending)           │
│  └── Consumer-B: 处理 ... ~ ... (pending)           │
└──────────────────────────────────────────────────────┘
```

```bash
# 添加消息
XADD stream:orders * product iPhone price 8999
XADD stream:orders * product MacBook price 12999

# 创建消费者组
XGROUP CREATE stream:orders order-processors 0

# 消费者读取
XREADGROUP GROUP order-processors consumer-a COUNT 1 BLOCK 5000 STREAMS stream:orders >

# 确认处理完成
XACK stream:orders order-processors 1719800000000-0

# 查看待处理消息
XPENDING stream:orders order-processors
```

### List vs Stream 对比

| 对比项 | List | Stream |
|:---|:---|:---|
| **消息持久化** | 无（消费即删除） | 有（可保留历史） |
| **消费者组** | 不支持 | 支持 |
| **消息确认** | 不支持 | XACK |
| **消息回溯** | 不支持 | 支持 |
| **阻塞等待** | BLPOP | XREAD BLOCK |
| **适用场景** | 简单队列 | 专业消息队列 |

---

## 2.7 实战：Node.js + Redis Session 存储 <span class="lv lv-2">中级</span>

### 为什么不用内存存 Session？

```
┌─ 内存 Session ─────────────────────────────┐
│  问题1: 重启丢失                            │
│  问题2: 多实例不共享                        │
│                                             │
│  浏览器 ──► Node实例A ── Session在A的内存   │
│  浏览器 ──► Node实例B ── B没有该Session!    │
│                                             │
└─ Redis Session ────────────────────────────┐
│  ✅ 重启不丢失                              │
│  ✅ 多实例共享                              │
│                                             │
│  浏览器 ──► Node实例A ──┐                  │
│  浏览器 ──► Node实例B ──┼──► Redis ── Session│
│                                             │
└─────────────────────────────────────────────┘
```

### Express + express-session + connect-redis

```typescript
// server.ts
import express from 'express'
import session from 'express-session'
import RedisStore from 'connect-redis'
import { createClient } from 'redis'

const app = express()

// 创建 Redis 客户端
const redisClient = createClient({ url: 'redis://localhost:6379' })
await redisClient.connect()

// 配置 Session
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,    // 生产环境设 true（HTTPS）
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,  // 24小时
  },
}))

// 登录
app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await verifyUser(username, password)

  if (user) {
    req.session.userId = user.id
    req.session.username = user.name
    res.json({ message: '登录成功' })
  } else {
    res.status(401).json({ message: '用户名或密码错误' })
  }
})

// 获取当前用户
app.get('/me', (req, res) => {
  if (req.session.userId) {
    res.json({ userId: req.session.userId, username: req.session.username })
  } else {
    res.status(401).json({ message: '未登录' })
  }
})

// 登出
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: '已登出' })
  })
})

app.listen(3000)
```

---

## 2.8 实战：Node.js + Redis 接口限流（滑动窗口） <span class="lv lv-2">中级</span>

```
滑动窗口限流原理（ZSet 实现）:

  时间轴: ─────────────────────────────────►
              │←── 60s 窗口 ──→│
          t-120  t-90  t-60  t-30  t(现在)
                          │         │
                      ┌───┼─────────┼───┐
                      │  score=时间戳   │
                      │  member=唯一ID  │
                      │  ZRANGEBYSCORE  │
                      │  统计窗口内数量  │
                      └─────────────────┘
```

```typescript
// rate-limit.ts
import Redis from 'ioredis'
const redis = new Redis()

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

/**
 * 滑动窗口限流
 * @param key     限流 Key（如 rate_limit:api:user:123）
 * @param limit   窗口内最大请求数
 * @param windowMs 窗口时间（毫秒）
 */
async function slidingWindowLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now()
  const windowStart = now - windowMs

  // Lua 脚本保证原子性
  const result = await redis.eval(
    `
    local key = KEYS[1]
    local limit = tonumber(ARGV[1])
    local window_start = tonumber(ARGV[2])
    local now = tonumber(ARGV[3])
    local window_ms = tonumber(ARGV[4])

    -- 1. 移除窗口外的旧记录
    redis.call('ZREMRANGEBYSCORE', key, 0, window_start)

    -- 2. 统计窗口内请求数
    local count = redis.call('ZCARD', key)

    if count < limit then
      -- 3. 未超限，添加当前请求
      redis.call('ZADD', key, now, now .. ':' .. math.random(1000000))
      redis.call('EXPIRE', key, math.ceil(window_ms / 1000))
      return {1, limit - count - 1, window_start + window_ms}
    end

    return {0, 0, window_start + window_ms}
    `,
    1,
    key,
    String(limit),
    String(window_start),
    String(now),
    String(windowMs)
  ) as [number, number, number]

  return {
    allowed: result[0] === 1,
    remaining: result[1],
    resetAt: result[2],
  }
}

// Express 中间件
function rateLimiter(limit: number, windowMs: number) {
  return async (req: any, res: any, next: any) => {
    const userId = req.session?.userId || req.ip
    const key = `rate_limit:api:${userId}`
    const result = await slidingWindowLimit(key, limit, windowMs)

    res.set({
      'X-RateLimit-Limit': String(limit),
      'X-RateLimit-Remaining': String(result.remaining),
      'X-RateLimit-Reset': String(result.resetAt),
    })

    if (!result.allowed) {
      res.status(429).json({ message: '请求过于频繁，请稍后重试' })
      return
    }

    next()
  }
}

// 使用: 每分钟最多 60 次
app.get('/api/data', rateLimiter(60, 60_000), handler)
```

---

## 2.9 实战：Node.js + Redis 排行榜（ZSet） <span class="lv lv-2">中级</span>

```
排行榜数据流:

  用户得分 ──► ZADD leaderboard 1500 "player-a"
                      │
                      ▼
            ┌──────────────────────┐
            │  ZSet: leaderboard   │
            │  ┌───────┬──────────┐│
            │  │ Score │ Member   ││
            │  ├───────┼──────────┤│
            │  │ 500   │ player-d ││  ← ZREVRANGE 0 2
            │  │ 1200  │ player-c ││     TOP 3
            │  │ 1500  │ player-a ││     ↓
            │  │ 2300  │ player-b ││     player-b
            │  └───────┴──────────┘│     player-a
            └──────────────────────┘     player-c
```

```typescript
// leaderboard.ts
import Redis from 'ioredis'
const redis = new Redis()

const LEADERBOARD_KEY = 'game:leaderboard'

// 更新分数
async function updateScore(playerId: string, score: number) {
  await redis.zadd(LEADERBOARD_KEY, score, playerId)
}

// 增加分数
async function addScore(playerId: string, increment: number) {
  const newScore = await redis.zincrby(LEADERBOARD_KEY, increment, playerId)
  return parseFloat(newScore)
}

// 获取 TOP N（从高到低）
async function getTopN(n: number) {
  const results = await redis.zrevrange(
    LEADERBOARD_KEY, 0, n - 1, 'WITHSCORES'
  )
  // results: ["player-b","2300","player-a","1500",...]

  const leaderboard: { rank: number; playerId: string; score: number }[] = []
  for (let i = 0; i < results.length; i += 2) {
    leaderboard.push({
      rank: Math.floor(i / 2) + 1,
      playerId: results[i],
      score: parseFloat(results[i + 1]),
    })
  }
  return leaderboard
}

// 获取某玩家的排名
async function getPlayerRank(playerId: string) {
  const [rank, score] = await Promise.all([
    redis.zrevrank(LEADERBOARD_KEY, playerId),  // 降序排名（0起）
    redis.zscore(LEADERBOARD_KEY, playerId),
  ])

  if (rank === null) return null
  return {
    rank: rank + 1,  // 转为从1开始
    score: parseFloat(score!),
  }
}

// 获取某玩家周围的排名（分页场景）
async function getAroundPlayer(playerId: string, range: number = 2) {
  const rank = await redis.zrevrank(LEADERBOARD_KEY, playerId)
  if (rank === null) return []

  const start = Math.max(0, rank - range)
  const end = rank + range

  const results = await redis.zrevrange(
    LEADERBOARD_KEY, start, end, 'WITHSCORES'
  )
  return results
}

// ── 使用示例 ──
await updateScore('player-a', 1500)
await updateScore('player-b', 2300)
await updateScore('player-c', 1200)
await updateScore('player-d', 500)
await addScore('player-a', 200)   // player-a → 1700

const top3 = await getTopN(3)
console.log(top3)
// [
//   { rank: 1, playerId: 'player-b', score: 2300 },
//   { rank: 2, playerId: 'player-a', score: 1700 },
//   { rank: 3, playerId: 'player-c', score: 1200 },
// ]

const myRank = await getPlayerRank('player-a')
console.log(myRank)  // { rank: 2, score: 1700 }
```

---

## 2.10 数据结构底层原理速览 <span class="lv lv-2">中级</span>

```
┌────────────────────────────────────────────────────────────┐
│            Redis 数据类型 vs 底层编码                        │
│                                                            │
│  String ──► int       (整数值 ≤ long)                      │
│          ──► embstr   (短字符串 ≤ 44字节)                   │
│          ──► raw      (长字符串 > 44字节)                   │
│                                                            │
│  Hash   ──► ziplist   (字段数 ≤ 128 且值 ≤ 64字节)          │
│          ──► hashtable (超出阈值)                           │
│                                                            │
│  List   ──► quicklist  (ziplist + 链表，Redis 3.2+)         │
│          ──► listpack   (Redis 7.0 替代 ziplist)            │
│                                                            │
│  Set    ──► intset    (全是整数且数量 ≤ 128)                 │
│          ──► hashtable (超出阈值)                           │
│                                                            │
│  ZSet   ──► ziplist   (成员数 ≤ 128 且值 ≤ 64字节)          │
│          ──► skiplist + hashtable (超出阈值)                │
│                                                            │
│  阈值可在 redis.conf 中调整:                                │
│    hash-max-ziplist-entries 128                            │
│    hash-max-ziplist-value 64                               │
│    zset-max-ziplist-entries 128                            │
│    zset-max-ziplist-value 64                               │
└────────────────────────────────────────────────────────────┘
```

### 核心结构简介

#### ziplist（压缩列表）

```
┌──────┬─────┬──────┬──────┬──────┬─────┐
│zlbytes│zltail│zllen│entry1│entry2│zlend│
│ 4B   │ 4B  │ 2B  │ 变长 │ 变长 │ 1B  │
└──────┴─────┴──────┴──────┴──────┴─────┘
  连续内存，省空间，但修改需 realloc
  适合少量元素
```

#### skiplist（跳表）

```
  ZSet 用跳表实现有序 + O(logN) 查找

  Level 3:  ●────────────────────────────────►●
  Level 2:  ●──────────────►●────────────────►●
  Level 1:  ●──────►●──────►●──────►●────────►●
  Level 0:  ●──►●──►●──►●──►●──►●──►●──►●──►●  (完整链表)

  查找时从高层往下，类似二分查找
  空间换时间: O(logN) 查找，O(logN) 插入
```

#### hashtable

```
  与 JS 的 Map/类似，数组 + 链地址法解决哈希冲突

  ┌────┬────┬────┬────┐
  │ 0  │ 1  │ 2  │ 3  │  ← bucket 数组
  └─┬──┴────┴──┬─┴────┘
    │         │
    ▼         ▼
  ┌───┐    ┌───┐
  │k-v│──►│k-v│   ← 链表解决冲突
  └───┘    └───┘

  渐进式 rehash: 不一次性迁移，而是在后续操作中分批迁移
  避免一次性迁移导致阻塞
```

---

# 三、🔴 高级实战

---

## 3.1 主从复制与哨兵 <span class="lv lv-3">高级</span>

### 主从复制

```
┌──────────┐       ┌──────────┐       ┌──────────┐
│  Master  │──────►│  Slave1  │       │  Slave2  │
│  读写     │ sync  │  只读     │◄──────│  只读     │
│  6379    │──────►│  6380    │ sync  │  6381    │
└──────────┘       └──────────┘       └──────────┘

  作用: 读写分离（写Master，读Slave）+ 数据备份
  配置: slaveof master_host master_port（或在redis.conf中）
```

### 哨兵（Sentinel）

```
┌──────────────────────────────────────────┐
│             Sentinel 集群                │
│  ┌─────┐  ┌─────┐  ┌─────┐             │
│  │ S1  │  │ S2  │  │ S3  │  ← 3个哨兵  │
│  └──┬──┘  └──┬──┘  └──┬──┘             │
│     └────────┼────────┘                 │
│              │ 投票：Master 是否客观下线   │
│              │ 多数同意 → 自动故障转移     │
└──────────────┼───────────────────────────┘
               │ 监控
    ┌──────────┼──────────┐
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│ Master │ │ Slave1 │ │ Slave2 │
│ 6379   │ │ 6380   │ │ 6381   │
└────────┘ └────────┘ └────────┘

  Master 宕机 → 哨兵选举新 Master → 通知其他 Slave 切换
```

```bash
# 哨兵配置 sentinel.conf
sentinel monitor mymaster 127.0.0.1 6379 2  # 2个哨兵同意才判定下线
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 10000
sentinel parallel-syncs mymaster 1
```

---

## 3.2 Cluster 分片 <span class="lv lv-3">高级</span>

```
┌────────────────────────────────────────────────────────────┐
│                   Redis Cluster                            │
│                                                            │
│  共 16384 个 Hash Slot，分配到多个 Master 节点             │
│                                                            │
│  Node-A: Slot 0~5460     Node-B: Slot 5461~10922          │
│  Node-C: Slot 10923~16383                                │
│                                                            │
│  ┌─────────┐      ┌─────────┐      ┌─────────┐           │
│  │ Master-A│◄────►│ Master-B│◄────►│ Master-C│           │
│  │ Slot    │ Gossip│ Slot    │ Gossip│ Slot    │           │
│  │ 0-5460  │      │ 5461-   │      │ 10923-  │           │
│  └────┬────┘      │ 10922   │      └────┬────┘           │
│       │           └────┬────┘           │                 │
│  ┌────▼────┐      ┌────▼────┐      ┌────▼────┐           │
│  │ Slave-A │      │ Slave-B │      │ Slave-C │           │
│  └─────────┘      └─────────┘      └─────────┘           │
│                                                            │
│  Key 路由: slot = CRC16(key) % 16384                      │
│  客户端重定向: MOVED / ASK                                 │
└────────────────────────────────────────────────────────────┘
```

```bash
# 创建集群（6节点：3主3从）
redis-cli --cluster create \
  127.0.0.1:7001 127.0.0.1:7002 127.0.0.1:7003 \
  127.0.0.1:7004 127.0.0.1:7005 127.0.0.1:7006 \
  --cluster-replicas 1

# 查看集群信息
redis-cli -p 7001 CLUSTER INFO
redis-cli -p 7001 CLUSTER NODES
```

---

## 3.3 面试高频题 12 条 <span class="lv lv-3">高级</span>

| # | 面试题 | 核心答案 |
|:---:|:---|:---|
| 1 | Redis 为什么快？ | 内存存储 + 单线程无锁 + IO多路复用 |
| 2 | 为什么用单线程？ | 避免锁竞争和上下文切换；内存操作本身极快，瓶颈不在CPU而在网络IO |
| 3 | String 和 Hash 怎么选？ | 需要修改个别字段用 Hash；整体读写用 String |
| 4 | 缓存穿透怎么解决？ | 缓存空值 + 布隆过滤器 |
| 5 | 缓存击穿怎么解决？ | 互斥锁（setnx）+ 逻辑过期 |
| 6 | 缓存雪崩怎么解决？ | 随机TTL + 多级缓存 + 高可用 |
| 7 | RDB 和 AOF 怎么选？ | 生产建议混合持久化：RDB做全量快照 + AOF做增量日志 |
| 8 | Redis 事务和 MySQL 事务区别？ | Redis 不支持回滚，某命令失败不影响其他命令执行 |
| 9 | 如何保证缓存和数据库一致性？ | Cache Aside：先更新DB再删缓存；可加延迟双删或监听binlog |
| 10 | Redis Cluster 的 Slot 数量？ | 16384个Hash Slot，CRC16(key) % 16384 路由 |
| 11 | 大 Key 问题怎么处理？ | 拆分大Key / 使用 UNLINK 异步删除 / 开启 lazyfree |
| 12 | 热点 Key 问题怎么处理？ | 本地缓存 + 热Key分散（加随机后缀） + 读写分离 |

---

> **学习路径建议**：初级 → 做完 1.7 的 Node.js CRUD 练习 → 中级 → 依次实现 2.7/2.8/2.9 三个实战 → 高级 → 理解主从/Cluster 原理 + 刷面试题
