# MySQL 中高级知识点

> 基于 MySQL 8.0+，覆盖架构、存储引擎、索引、事务、锁、SQL 调优、高可用、分库分表与运维。

## 目录

- [1. 架构总览](#1-架构总览)
- [2. InnoDB 存储引擎](#2-innodb-存储引擎)
- [3. 索引深度](#3-索引深度)
- [4. 事务与 MVCC](#4-事务与-mvcc)
- [5. 锁机制](#5-锁机制)
- [6. 日志系统：redo / undo / binlog](#6-日志系统redo--undo--binlog)
- [7. SQL 执行与优化](#7-sql-执行与优化)
- [8. 表设计范式与反范式](#8-表设计范式与反范式)
- [9. 分库分表与读写分离](#9-分库分表与读写分离)
- [10. 主从复制与高可用](#10-主从复制与高可用)
- [11. 备份恢复](#11-备份恢复)
- [12. 性能监控与诊断](#12-性能监控与诊断)
- [13. 安全](#13-安全)
- [14. Node.js 接入实战](#14-nodejs-接入实战)
- [15. 常见面试题](#15-常见面试题)

---

## 1. 架构总览

```
 ┌──────────────────────────────┐
 │       Connection Layer        │ 连接、鉴权、线程
 ├──────────────────────────────┤
 │  Server Layer                 │ 解析、优化器、执行器、缓存(8.0 已移除 query cache)
 ├──────────────────────────────┤
 │  Pluggable Storage Engine     │ InnoDB / MyISAM / Memory / Archive
 ├──────────────────────────────┤
 │  File / OS                    │ ibd / ibdata / redo / binlog / undo
 └──────────────────────────────┘
```

一条 SQL 的旅程：
1. 客户端发送 SQL；
2. **连接器**鉴权、维护会话；
3. **分析器** 词法 + 语法分析生成 AST；
4. **优化器** 选择执行计划（索引、JOIN 顺序）；
5. **执行器** 调用存储引擎接口取数据；
6. **存储引擎**（InnoDB）通过 buffer pool 读写页；
7. 写操作走 redo / undo / binlog。

---

## 2. InnoDB 存储引擎

### 2.1 物理结构

- **表空间**：独立表空间 (`innodb_file_per_table=ON`，默认) → 每张表一个 `.ibd`；
- **段 (segment) → 区 (extent，1MB) → 页 (page，16KB) → 行 (row)**；
- **B+Tree 聚簇索引**：叶子页存完整行数据，按主键有序；
- **二级索引**：叶子存 `主键值`，**回表**取数据行。

### 2.2 行格式

`COMPACT` / `DYNAMIC` (默认) / `COMPRESSED`：DYNAMIC 把超长 VARCHAR/TEXT/BLOB 全部存外溢页，本行只留 20B 指针。

### 2.3 Buffer Pool

- 按 16KB 页为单位缓存数据/索引；
- 改进版 LRU：`young` / `old` 两段（默认 5/8 yong）+ `innodb_old_blocks_time`，避免大表扫描污染；
- `innodb_buffer_pool_size` 通常设为物理内存 50–75%；
- `innodb_buffer_pool_instances` 拆分锁竞争。

### 2.4 Change Buffer / Adaptive Hash Index / Doublewrite

- **Change Buffer**：辅助索引插入/更新先缓冲，避免随机 IO（仅非唯一索引）；
- **AHI**：热点索引自动哈希加速等值查询；
- **Doublewrite**：页损坏保护，写两次（系统表空间 + 实际位置），故障恢复时校验。

---

## 3. 索引深度

### 3.1 索引类型

| 类型 | 说明 |
| --- | --- |
| 主键索引（聚簇） | 唯一 + 数据本体 |
| 二级索引（普通/唯一） | 叶子存主键，需回表 |
| 联合索引 | 多列；遵守最左前缀 |
| 覆盖索引 | 查询字段全在索引上，免回表 |
| 前缀索引 | `name(10)`，省空间但不能 ORDER BY |
| 全文索引 | `FULLTEXT`，`MATCH ... AGAINST` |
| 空间索引 | `SPATIAL`，R-Tree |
| 函数索引 (8.0) | `INDEX ((LOWER(email)))` |
| 不可见索引 (8.0) | `INVISIBLE`，灰度验证 |
| 降序索引 (8.0) | `KEY (a DESC, b ASC)` |

### 3.2 最左前缀

联合索引 `(a, b, c)`：
- `WHERE a=1` ✓
- `WHERE a=1 AND b=2` ✓
- `WHERE a=1 AND c=3` 仅 a 走索引；
- `WHERE b=2 AND c=3` ✗（除非有 a 范围）；
- `WHERE a=1 AND b>2 AND c=3` 走 a、b，c 不走（范围之后失效）。

8.0 引入 **Index Skip Scan**，部分场景可跳过最左列；但通常不要依赖。

### 3.3 索引下推 (ICP)

在引擎层就用索引中能判断的条件过滤，再回表，减少 IO。`EXPLAIN` 看到 `Using index condition` 即生效。

### 3.4 索引失效场景

- 隐式类型转换：`WHERE phone = 13800000000`（字段是 varchar）；
- 函数 / 表达式：`WHERE DATE(create_at) = '2024-01-01'` → 改成范围；
- 前导通配：`LIKE '%abc'`；
- `OR` 两侧不全有索引；
- `NOT IN` / `<>` 多数情况下不走；
- 索引列被运算：`WHERE a + 1 = 10`；
- 数据分布偏差导致优化器放弃索引（可 `FORCE INDEX` 或 `ANALYZE TABLE`）。

### 3.5 EXPLAIN 关键列

| 列 | 含义 |
| --- | --- |
| `id` / `select_type` | 子查询层级 |
| `table` / `partitions` | 表 |
| `type` | 访问类型：`system > const > eq_ref > ref > range > index > ALL` |
| `possible_keys` / `key` | 候选索引 / 实际使用 |
| `key_len` | 索引使用字节数（联合索引诊断） |
| `ref` | 与索引比较的列/常量 |
| `rows` / `filtered` | 估算扫描行数 / 过滤百分比 |
| `Extra` | `Using index`、`Using where`、`Using filesort`、`Using temporary`、`Using index condition` |

`EXPLAIN ANALYZE`（8.0.18+）真实执行 + 时间 + 行数。

---

## 4. 事务与 MVCC

### 4.1 ACID

- **A**：undo log 回滚；
- **C**：业务 + 约束；
- **I**：锁 + MVCC；
- **D**：redo log + binlog 双写。

### 4.2 隔离级别

| 级别 | 脏读 | 不可重复读 | 幻读 |
| --- | --- | --- | --- |
| READ UNCOMMITTED | ✓ | ✓ | ✓ |
| READ COMMITTED | ✗ | ✓ | ✓ |
| **REPEATABLE READ** (默认) | ✗ | ✗ | ✗ (InnoDB 用间隙锁解决) |
| SERIALIZABLE | ✗ | ✗ | ✗ |

### 4.3 MVCC

每行隐藏列：`DB_TRX_ID`（最近修改事务）、`DB_ROLL_PTR`（指向 undo log）、`DB_ROW_ID`（无主键时）。

ReadView：
- **RC**：每条 SELECT 都生成新的 ReadView；
- **RR**：事务首次 SELECT 生成，整个事务复用。

可见性判断：行的 trx_id 是否被 ReadView 视为已提交（小于最小活跃 trx_id 即可见，处于活跃列表内不可见，大于最大下一个 id 也不可见）。

### 4.4 当前读 vs 快照读

- **快照读**：普通 `SELECT`，走 MVCC；
- **当前读**：`SELECT ... FOR UPDATE | FOR SHARE`、`UPDATE` / `DELETE` / `INSERT`，会加锁取最新版本。

---

## 5. 锁机制

### 5.1 锁粒度

- **全局锁**：`FLUSH TABLES WITH READ LOCK` (备份)；
- **表级锁**：`LOCK TABLES`、MDL（元数据锁）；
- **行锁**（InnoDB）。

### 5.2 InnoDB 行锁种类

| 锁 | 范围 |
| --- | --- |
| Record Lock | 单行索引记录 |
| Gap Lock | 索引前后间隙（防幻读） |
| Next-Key Lock | Record + Gap 组合（默认） |
| Insert Intention Lock | 插入意向 |
| 共享 / 排他 | S / X |

### 5.3 加锁规则要点 (RR)

1. 锁加在**索引**上，没索引则退化锁全表；
2. 等值查询命中：行锁 + 可能两侧 gap；
3. 等值查询未命中：变 gap lock；
4. 范围查询：next-key 锁覆盖整个区间，包括上界；
5. 唯一索引等值精确命中：仅行锁，不加 gap。

### 5.4 死锁

```sql
SHOW ENGINE INNODB STATUS\G
-- LATEST DETECTED DEADLOCK 节
```

避免：
- 固定加锁顺序；
- 缩短事务；
- 使用合适索引避免锁全表；
- 大事务拆批量；
- `innodb_lock_wait_timeout` 调小及时报错。

### 5.5 元数据锁 (MDL)

DDL 与 DML 互斥，长事务 + DDL 容易堵全库。8.0 支持 `online DDL`，但仍可能阻塞 prepare 阶段；变更前查 `performance_schema.metadata_locks`。

---

## 6. 日志系统：redo / undo / binlog

| 日志 | 层 | 作用 |
| --- | --- | --- |
| **redo log** | InnoDB 层 | 物理日志，crash recovery (WAL) |
| **undo log** | InnoDB 层 | 回滚 + MVCC |
| **binlog** | Server 层 | 复制 + 时间点恢复 |
| **relay log** | Server 层 | 从库收到主库 binlog 的中转 |
| **slow log** | Server 层 | 慢查询 |
| **error log / general log** | Server 层 | 启动错误 / 全部 SQL |

### 6.1 两阶段提交 (XA)

```
prepare(redo) → write binlog → commit(redo)
```

- crash 在 prepare 之前：回滚；
- crash 在 prepare 之后、binlog 之前：回滚（redo 标记 prepare，但无 binlog，回滚）；
- crash 在 binlog 写完、commit 之前：判断 binlog 完整 → 提交；
- 保证 redo 与 binlog 一致，主从复制不丢数据。

### 6.2 三大同步参数

- `innodb_flush_log_at_trx_commit`：1 (默认，每次 commit fsync)、2 (写 OS cache，每秒 fsync)、0 (每秒由后台)；
- `sync_binlog`：1 (每次 commit fsync)、N (累积 N 次)、0 (依赖 OS)；
- 双 1 配置：金融级；高并发可降到 2/100，宕机风险 1 秒数据。

### 6.3 binlog 格式

- `STATEMENT`：体积小，存在不一致风险；
- `ROW`：行级镜像，安全（推荐）；
- `MIXED`：自动切换。

---

## 7. SQL 执行与优化

### 7.1 慢 SQL 排查流程

1. `slow_query_log=ON` + `long_query_time=0.5`；
2. `pt-query-digest` / `mysqldumpslow` 聚合；
3. 对疑点 SQL `EXPLAIN`、`EXPLAIN ANALYZE`；
4. 检查表结构 / 索引 / 数据分布 (`SHOW INDEX FROM t`、`ANALYZE TABLE`)；
5. 必要时 `OPTIMIZER_TRACE`。

### 7.2 常见优化技巧

- **覆盖索引**：把 SELECT 字段全放索引；
- **延迟关联**：`SELECT * FROM t JOIN (SELECT id FROM t WHERE ... LIMIT 100000, 20) x USING(id)` 解决深分页；
- **避免 SELECT \***：减少 IO 与网络；
- **JOIN 顺序**：小表驱动大表；确保被驱动表 ON 列有索引；
- **IN 与 EXISTS**：8.0 优化器普遍持平，写法看可读性；
- **OR → UNION ALL** 触发索引；
- **统计信息**：`ANALYZE TABLE` 更新；
- **大批量 update**：拆 batch，避免长事务/大锁；
- **临时表 / 文件排序**：`Using temporary; Using filesort` 警示，加合适索引或 sort_buffer；
- **窗口函数 + CTE** (8.0)：替代复杂 self-join。

### 7.3 深分页方案

```sql
-- 慢
SELECT * FROM t ORDER BY id LIMIT 1000000, 20;
-- 改：基于上次最大 id
SELECT * FROM t WHERE id > :lastId ORDER BY id LIMIT 20;
-- 或子查询定位主键
SELECT t.* FROM t JOIN (
  SELECT id FROM t ORDER BY create_at LIMIT 1000000, 20
) x USING(id);
```

---

## 8. 表设计范式与反范式

- **三范式**：原子性、依赖主键、消除传递依赖；
- 实战常做**适度反范式**：冗余高频读字段（用户名）、宽表 OLAP；
- 主键：自增 BIGINT 或雪花 ID（避免 UUID v1/v4 写放大）；
- 避免 `NULL` 索引列：增加判断成本；
- 字符集：全库 `utf8mb4` + `utf8mb4_0900_ai_ci`（8.0 默认）；
- 时间戳：`DATETIME(3)` 比 `TIMESTAMP` 更友好（不受时区与 2038 影响）；
- 大字段：拆出附属表或对象存储；
- 软删除：`deleted_at` + 业务索引带条件；
- 分区表：按时间或哈希，配合归档。

---

## 9. 分库分表与读写分离

### 9.1 拆分维度

- **垂直拆分**：按业务/字段；
- **水平拆分**：按主键 hash / 范围 / 时间；
- **冷热分离**：当前数据热表 + 归档表。

### 9.2 中间件

- **客户端**：ShardingSphere-JDBC、TDDL；
- **代理**：ShardingSphere-Proxy、ProxySQL、Vitess、MaxScale；
- 自研：路由 + 分布式 ID（Snowflake / Leaf）。

### 9.3 难点

- 跨库 JOIN：尽量避免，靠 ETL 或反范式；
- 全局唯一 ID：Snowflake / 号段 / UUID v7；
- 分布式事务：XA、TCC、Seata、消息事务表；
- 排序分页：归并多分片，注意性能；
- 平滑扩容：一致性 hash、双写 + 数据迁移。

### 9.4 读写分离

- 主写从读，靠 binlog 同步；
- 一致性问题：从库延迟 → **强一致读路由** (read your write) 或 master 兜底；
- ProxySQL / MyCAT / DNS / 业务层 hint。

---

## 10. 主从复制与高可用

### 10.1 复制模式

| 模式 | 一致性 | 性能 |
| --- | --- | --- |
| **异步**（默认） | 弱 | 高 |
| **半同步** (`rpl_semi_sync`) | 至少一从收 binlog 才返回 | 中 |
| **组复制 (MGR)** / **InnoDB Cluster** | 多数派提交，自动选主 | 中 |
| **MySQL Group Replication** + Router | HA，类 Paxos | 中 |

### 10.2 GTID

`GTID = source_uuid:transaction_id`，唯一标识事务，断点续传方便，是现代复制必选。

### 10.3 常见拓扑

- 一主多从；
- 主主互备 + keepalived（双主写需谨慎，建议主备）；
- MHA / Orchestrator 故障切换；
- 云：RDS / PolarDB（共享存储，秒级切换）。

---

## 11. 备份恢复

| 方法 | 特点 |
| --- | --- |
| `mysqldump` | 逻辑备份，小库友好 |
| `mysqlpump` | 多线程逻辑备份 |
| **xtrabackup** | 物理备份，支持热备、增量 |
| `clone plugin` (8.0) | 在线克隆实例 |
| binlog 增量 | 时间点恢复 (PITR) |

PITR 流程：
1. 全量恢复到 N-1 天的物理备份；
2. 应用 N-1 → 故障时刻的 binlog（`mysqlbinlog --start-position --stop-datetime`）。

---

## 12. 性能监控与诊断

- **show global status** / **show variables**：基础指标；
- **performance_schema**：等待、锁、语句历史；
- **sys schema**：performance_schema 的友好视图；
- 监控指标：QPS、TPS、慢查询率、连接数、Innodb_buffer_pool_hit_rate (>99%)、`Innodb_row_lock_waits`、复制延迟 `Seconds_Behind_Master`；
- 工具：Percona Toolkit（`pt-query-digest`、`pt-online-schema-change`、`pt-archiver`）、Prometheus + mysqld_exporter + Grafana。

```sql
-- 当前长事务
SELECT * FROM information_schema.innodb_trx
ORDER BY trx_started ASC;

-- 阻塞链
SELECT * FROM sys.innodb_lock_waits;
```

---

## 13. 安全

- 最小权限，按业务库分用户；禁用 `root@%`；
- 强口令 + `caching_sha2_password`（8.0 默认）；
- 网络层：限制 bind-address、走 VPC / SSH 隧道；
- TLS：`require_secure_transport=ON`；
- 审计：`audit_log`、binlog 留痕；
- SQL 注入：业务侧用预编译参数；
- 备份加密、传输加密、敏感字段列加密 (`AES_ENCRYPT` / 应用层 KMS)；
- DDL 高峰期禁用：用 `pt-osc` / `gh-ost` 做无锁变更。

---

## 14. Node.js 接入实战

### 14.1 mysql2

```ts
import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'app',
  password: process.env.DB_PWD,
  database: 'app',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  namedPlaceholders: true,
  decimalNumbers: true,
  timezone: '+08:00',
  dateStrings: false
})

// 始终用预编译参数，杜绝注入
const [rows] = await pool.execute<UserRow[]>(
  'SELECT id, name FROM user WHERE id = :id',
  { id: 1 }
)
```

### 14.2 事务

```ts
async function transfer(from: number, to: number, amount: number) {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [[acc]] = await conn.query<any>(
      'SELECT balance FROM account WHERE id=? FOR UPDATE', [from]
    )
    if (acc.balance < amount) throw new Error('余额不足')
    await conn.execute('UPDATE account SET balance=balance-? WHERE id=?', [amount, from])
    await conn.execute('UPDATE account SET balance=balance+? WHERE id=?', [amount, to])
    await conn.commit()
  } catch (e) {
    await conn.rollback()
    throw e
  } finally {
    conn.release()
  }
}
```

### 14.3 ORM 选型

| 工具 | 风格 | 适合 |
| --- | --- | --- |
| **Prisma** | Schema-first，类型安全 | 业务系统 |
| **Drizzle ORM** | SQL-like + TS 类型推导 | 追求贴近 SQL |
| **TypeORM / MikroORM** | 装饰器实体 | DDD 风格 |
| **Knex** | 查询构造器 | 灵活 SQL |
| **mysql2** + 自封装 | 原生 | 性能极致、SQL 强 |

### 14.4 常见坑

- `dateStrings: false` 会把 DATETIME 转 JS Date，**时区**易出问题；统一 UTC 或显式时区；
- 大结果集用 `query` 的 stream 模式：`pool.query(...).stream()`；
- BLOB 大字段用流；
- 长连接 + MySQL `wait_timeout` (默认 8h) 不一致 → 启用 keepAlive 或定期 `SELECT 1`；
- `LIMIT ?` 在某些驱动需特殊处理（`mysql2` 8.x 已支持）。

---

## 15. 常见面试题

1. InnoDB 与 MyISAM 区别？为什么默认是 InnoDB？
2. 聚簇索引 vs 二级索引？为什么主键最好自增？
3. B+Tree 为什么比 B-Tree、Hash 适合数据库？
4. 联合索引的最左前缀？什么情况下索引失效？
5. RR 隔离级别如何避免幻读？间隙锁加在哪里？
6. MVCC 的 ReadView 是怎么工作的？RC 与 RR 在生成时机上的差别？
7. redo log 和 binlog 的区别？两阶段提交保证了什么？
8. `innodb_flush_log_at_trx_commit` 与 `sync_binlog` 不同组合的含义？
9. 死锁如何排查与避免？
10. 千万级表怎么优化分页？
11. 大表加索引/改表如何无锁？
12. 主从延迟原因与排查？怎么做一致性读？
13. 分库分表后跨库 JOIN / 全局 ID / 分布式事务怎么做？
14. 8.0 相比 5.7 主要新特性？（CTE、窗口、不可见索引、原子 DDL、`caching_sha2`、JSON 改进、隐藏列等）
15. 怎么做生产 MySQL 的全量 + 增量备份与时间点恢复？

---

> 推荐阅读：《高性能 MySQL（第 4 版）》、《MySQL 是怎样运行的》、官方 Reference Manual、Percona / Vitess 博客。
