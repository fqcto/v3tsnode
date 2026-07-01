# MySQL 全阶段学习手册（初 → 中 → 高）

> 基于 MySQL 8.0+，按初级入门 → 中级进阶 → 高级实战三阶段组织，覆盖从零上手到架构调优的完整知识体系。

## 目录

- [一、🟢 初级入门](#一-初级入门)
  - [0.1 MySQL 是什么 & 关系型 vs 非关系型；常见分支](#01-mysql-是什么--关系型-vs-非关系型常见分支)
  - [0.2 安装：Windows / Mac / Docker 一行启动](#02-安装windows--mac--docker-一行启动)
  - [0.3 客户端：mysql CLI / Workbench / DBeaver](#03-客户端mysql-cli--workbench--dbeaver)
  - [0.4 数据库层级：Server → Database → Table → Row → Column](#04-数据库层级server--database--table--row--column)
  - [0.5 数据库操作：CREATE / USE / SHOW / DROP DATABASE；utf8mb4 vs utf8](#05-数据库操作create--use--show--drop-databaseutf8mb4-vs-utf8)
  - [0.6 表操作 DDL：CREATE TABLE / 常用类型 / 约束 / COMMENT](#06-表操作-ddlcreate-table--常用类型--约束--comment)
  - [0.7 CRUD 四大 SQL：INSERT / SELECT / UPDATE / DELETE](#07-crud-四大-sqlinsert--select--update--delete)
  - [0.8 WHERE 条件：比较 / AND / OR / NOT / IN / BETWEEN / LIKE / IS NULL](#08-where-条件比较--and--or--not--in--between--like--is-null)
  - [0.9 排序 & 分页：ORDER BY / LIMIT offset,count](#09-排序--分页order-by--limit-offsetcount)
  - [0.10 分组 & 聚合：COUNT / SUM / AVG / MAX / MIN / GROUP BY / HAVING](#010-分组--聚合count--sum--avg--max--min--group-by--having)
  - [0.11 多表 JOIN 入门：INNER / LEFT / RIGHT + ON](#011-多表-join-入门inner--left--right--on)
  - [0.12 简单子查询](#012-简单子查询)
  - [0.13 小案例：blog 库 3 表（users / posts / comments），5~6 条 SQL](#013-小案例blog-库-3-表users--posts--comments56-条-sql)
- [二、🟡 中级进阶](#二-中级进阶)
  - [1. 架构总览](#1-架构总览)
  - [2. InnoDB 存储引擎](#2-innodb-存储引擎)
  - [3. 索引深度](#3-索引深度)
  - [4. 事务与 MVCC](#4-事务与-mvcc)
  - [5. 锁机制](#5-锁机制)
  - [6. 日志系统：redo / undo / binlog](#6-日志系统redo--undo--binlog)
  - [7. SQL 执行与优化](#7-sql-执行与优化)
  - [8. 表设计范式与反范式](#8-表设计范式与反范式)
  - [11. 备份恢复](#11-备份恢复)
  - [14. Node.js 接入实战](#14-nodejs-接入实战)
- [三、🔴 高级实战](#三-高级实战)
  - [9. 分库分表与读写分离](#9-分库分表与读写分离)
  - [10. 主从复制与高可用](#10-主从复制与高可用)
  - [12. 性能监控与诊断](#12-性能监控与诊断)
  - [13. 安全](#13-安全)
  - [15. 常见面试题](#15-常见面试题)

---

## 一、🟢 初级入门

### 0.1 MySQL 是什么 & 关系型 vs 非关系型；常见分支

💡 **MySQL** 是最流行的开源**关系型数据库管理系统（RDBMS）**，使用 SQL 语言操作，以表格形式存储数据，支持事务、外键等关系型特性。

**关系型 vs 非关系型**

| 维度 | 关系型（MySQL / PostgreSQL） | 非关系型（MongoDB / Redis / ES） |
| --- | --- | --- |
| 数据模型 | 行列表格，Schema 固定 | 文档 / KV / 列族 / 图，Schema 灵活 |
| 事务 | 强 ACID | 大多弱事务或无 |
| 查询 | SQL，JOIN 丰富 | 各自 DSL，JOIN 有限 |
| 扩展 | 纵向为主 | 横向扩展友好 |
| 适合 | 业务核心数据、强一致性 | 缓存、日志、搜索、大数据 |

🎯 **常见 MySQL 分支**

- **Oracle MySQL**：官方社区版 + 企业版
- **Percona Server**：增强诊断 & 性能工具
- **MariaDB**：由 MySQL 创始人发起，兼容但逐步分化
- **云厂商**：AWS Aurora、阿里 PolarDB、腾讯 TDSQL

---

### 0.2 安装：Windows / Mac / Docker 一行启动

💡 三种常见安装方式，推荐 Docker 最省事。

**Windows**

```bash
# 1. 官网下载 MSI 安装包
#    https://dev.mysql.com/downloads/installer/
# 2. 安装时选择 Server Only，设置 root 密码
# 3. 配置 PATH：C:\Program Files\MySQL\MySQL Server 8.0\bin
```

**Mac**

```bash
# Homebrew
brew install mysql
brew services start mysql
# 首次安全设置
mysql_secure_installation
```

**Docker（推荐）**

```bash
docker run -d \
  --name mysql8 \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0 \
  --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_0900_ai_ci
```

🎯 验证安装

```bash
mysql -uroot -p123456 -e "SELECT VERSION();"
# 输出: 8.0.x
```

---

### 0.3 客户端：mysql CLI / Workbench / DBeaver

💡 连接 MySQL 的常用工具。

| 工具 | 类型 | 特点 |
| --- | --- | --- |
| **mysql CLI** | 命令行 | 自带，轻量，适合运维脚本 |
| **MySQL Workbench** | 图形化（官方） | 建模、管理、迁移一体化 |
| **DBeaver** | 图形化（通用） | 支持多数据库，插件生态丰富 |
| **DataGrip** | IDE（JetBrains） | 智能补全，付费 |
| **Navicat** | 图形化 | 老牌，付费 |

🎯 CLI 快速连接

```bash
# 基本连接
mysql -h 127.0.0.1 -P 3306 -u root -p

# 指定数据库
mysql -u root -p mydb

# 执行单条 SQL
mysql -u root -p -e "SHOW DATABASES;"
```

---

### 0.4 数据库层级：Server → Database → Table → Row → Column

💡 理解 MySQL 的数据组织层级。

```
MySQL Server (实例)
 └── Database (库)
      └── Table (表)
           └── Row (行/记录)
                └── Column (列/字段)
```

🎯 关键概念

- **Server**：一个 mysqld 进程，管理所有库
- **Database**：逻辑命名空间，同一 Server 下库名唯一
- **Table**：数据存储单元，由行和列组成
- **Row**：一条完整记录
- **Column**：字段，定义数据类型与约束

---

### 0.5 数据库操作：CREATE / USE / SHOW / DROP DATABASE；utf8mb4 vs utf8

💡 数据库的增删查切换。

```sql
-- 创建数据库（指定字符集）
CREATE DATABASE blog DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- 切换数据库
USE blog;

-- 查看所有数据库
SHOW DATABASES;

-- 查看当前库信息
SELECT DATABASE();

-- 查看建库语句
SHOW CREATE DATABASE blog;

-- 删除数据库（危险！）
DROP DATABASE IF EXISTS blog;
```

🎯 **utf8mb4 vs utf8**

| 字符集 | 每字符最大字节 | 支持 Emoji | 推荐 |
| --- | --- | --- | --- |
| `utf8` (utf8mb3) | 3 字节 | 不支持 | 不推荐 |
| `utf8mb4` | 4 字节 | 支持 | 推荐 |

> 新项目一律使用 `utf8mb4`，否则 Emoji 和生僻字会写入失败。

---

### 0.6 表操作 DDL：CREATE TABLE / 常用类型 / 约束 / COMMENT

💡 建表是数据库开发的第一步。

**常用数据类型**

| 类型 | 说明 | 示例 |
| --- | --- | --- |
| `INT` | 整型，4 字节 | `age INT` |
| `BIGINT` | 长整型，8 字节 | `id BIGINT` |
| `VARCHAR(N)` | 变长字符串 | `name VARCHAR(50)` |
| `TEXT` | 长文本 | `content TEXT` |
| `DATETIME` | 日期时间 | `created_at DATETIME` |
| `DECIMAL(M,D)` | 精确小数 | `price DECIMAL(10,2)` |
| `TINYINT(1)` | 布尔习惯写法 | `is_active TINYINT(1)` |

**建表示例**

```sql
CREATE TABLE users (
  id         BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  username   VARCHAR(50)  NOT NULL COMMENT '用户名',
  email      VARCHAR(100) NOT NULL COMMENT '邮箱',
  age        INT          DEFAULT 0 COMMENT '年龄',
  is_active  TINYINT(1)   DEFAULT 1 COMMENT '是否启用',
  balance    DECIMAL(10,2) DEFAULT 0.00 COMMENT '余额',
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (id),
  UNIQUE KEY uk_email (email),
  UNIQUE KEY uk_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户表';
```

🎯 **约束一览**

| 约束 | 关键字 | 作用 |
| --- | --- | --- |
| 主键 | `PRIMARY KEY` | 唯一 + 非空 |
| 自增 | `AUTO_INCREMENT` | 主键自动递增 |
| 非空 | `NOT NULL` | 不允许 NULL |
| 默认值 | `DEFAULT` | 插入时未指定则取默认 |
| 唯一 | `UNIQUE` | 值不重复 |
| 注释 | `COMMENT` | 字段/表说明 |

**其他 DDL**

```sql
-- 查看表结构
DESC users;
SHOW CREATE TABLE users\G

-- 修改表
ALTER TABLE users ADD COLUMN phone VARCHAR(20) COMMENT '手机号' AFTER email;
ALTER TABLE users MODIFY COLUMN age INT DEFAULT 0 COMMENT '年龄(0~150)';
ALTER TABLE users DROP COLUMN phone;

-- 删除表
DROP TABLE IF EXISTS users;
```

---

### 0.7 CRUD 四大 SQL：INSERT / SELECT / UPDATE / DELETE

💡 数据的增查改删。

```sql
-- INSERT：插入
INSERT INTO users (username, email, age)
VALUES ('alice', 'alice@example.com', 25);

INSERT INTO users (username, email, age) VALUES
  ('bob', 'bob@example.com', 30),
  ('carol', 'carol@example.com', 28);

-- SELECT：查询
SELECT id, username, age FROM users;
SELECT * FROM users WHERE id = 1;

-- UPDATE：更新
UPDATE users SET age = 26, balance = 100.00 WHERE id = 1;

-- DELETE：删除
DELETE FROM users WHERE id = 2;
```

🎯 注意事项

- `UPDATE` / `DELETE` 务必带 `WHERE`，否则全表修改/删除
- `INSERT` 不指定列名时，值必须与表定义列顺序一致（不推荐）

---

### 0.8 WHERE 条件：比较 / AND / OR / NOT / IN / BETWEEN / LIKE / IS NULL

💡 过滤数据的核心语法。

```sql
-- 比较运算符
SELECT * FROM users WHERE age > 25;
SELECT * FROM users WHERE age >= 25;
SELECT * FROM users WHERE username = 'alice';

-- AND / OR / NOT
SELECT * FROM users WHERE age > 20 AND is_active = 1;
SELECT * FROM users WHERE age < 20 OR age > 40;
SELECT * FROM users WHERE NOT is_active = 0;

-- IN
SELECT * FROM users WHERE age IN (25, 30, 35);

-- BETWEEN（含边界）
SELECT * FROM users WHERE age BETWEEN 20 AND 30;

-- LIKE 模糊匹配
SELECT * FROM users WHERE username LIKE 'a%';    -- 以 a 开头
SELECT * FROM users WHERE username LIKE '%ce';    -- 以 ce 结尾
SELECT * FROM users WHERE email LIKE '%@example%'; -- 包含 @example

-- IS NULL / IS NOT NULL
SELECT * FROM users WHERE phone IS NULL;
SELECT * FROM users WHERE phone IS NOT NULL;
```

🎯 常见陷阱

- `=` 不能判断 `NULL`，必须用 `IS NULL`
- `LIKE '%abc%'` 前导通配符无法利用索引（大表慢）

---

### 0.9 排序 & 分页：ORDER BY / LIMIT offset,count

💡 控制结果顺序与数量。

```sql
-- 升序（默认）/ 降序
SELECT * FROM users ORDER BY age ASC;
SELECT * FROM users ORDER BY age DESC;

-- 多列排序
SELECT * FROM users ORDER BY is_active DESC, age ASC;

-- 分页：LIMIT offset, count
-- 第 1 页（每页 10 条）
SELECT * FROM users ORDER BY id LIMIT 0, 10;
-- 第 2 页
SELECT * FROM users ORDER BY id LIMIT 10, 10;
-- 第 N 页
SELECT * FROM users ORDER BY id LIMIT (N-1)*10, 10;
```

🎯 注意

- `LIMIT` 必须配合 `ORDER BY`，否则结果顺序不确定
- `LIMIT 1000000, 20` 深分页性能差，高级章节有优化方案

---

### 0.10 分组 & 聚合：COUNT / SUM / AVG / MAX / MIN / GROUP BY / HAVING

💡 统计分析必备。

```sql
-- 常用聚合函数
SELECT COUNT(*) FROM users;                         -- 总行数
SELECT COUNT(phone) FROM users;                     -- phone 非 NULL 行数
SELECT SUM(balance) FROM users;                     -- 余额总和
SELECT AVG(age) FROM users;                         -- 平均年龄
SELECT MAX(age), MIN(age) FROM users;               -- 最大/最小年龄

-- GROUP BY 分组
SELECT is_active, COUNT(*) AS cnt, AVG(age) AS avg_age
FROM users
GROUP BY is_active;

-- HAVING 过滤分组结果（WHERE 过滤行，HAVING 过滤组）
SELECT is_active, COUNT(*) AS cnt
FROM users
GROUP BY is_active
HAVING cnt > 5;
```

🎯 执行顺序

```
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

---

### 0.11 多表 JOIN 入门：INNER / LEFT / RIGHT + ON

💡 关联查询是关系型数据库的灵魂。

```
INNER JOIN (交集)        LEFT JOIN (左表全保留)     RIGHT JOIN (右表全保留)
 ┌───┐                   ┌───┐                     ┌───┐
 │╱╲│                   │██╲│                     │╱██│
 └───┘                   └───┘                     └───┘
 A ∩ B                   A 全部 + B 匹配            B 全部 + A 匹配
```

```sql
-- INNER JOIN：只返回两表匹配的行
SELECT u.username, p.title
FROM users u
INNER JOIN posts p ON u.id = p.user_id;

-- LEFT JOIN：左表全保留，右表无匹配则 NULL
SELECT u.username, p.title
FROM users u
LEFT JOIN posts p ON u.id = p.user_id;

-- RIGHT JOIN：右表全保留
SELECT u.username, p.title
FROM users u
RIGHT JOIN posts p ON u.id = p.user_id;
```

🎯 要点

- `ON` 指定关联条件
- 多表 JOIN 时注意别名避免歧义
- 左连接 + `WHERE 右表.id IS NULL` 可查"左表有但右表没有"的记录

---

### 0.12 简单子查询

💡 在一个 SQL 中嵌套另一个查询。

```sql
-- WHERE 中的子查询
SELECT * FROM users
WHERE id IN (SELECT user_id FROM posts WHERE created_at > '2025-01-01');

-- FROM 中的子查询（派生表）
SELECT avg_age FROM (
  SELECT AVG(age) AS avg_age FROM users
) AS t;

-- 标量子查询（返回单个值）
SELECT username, (SELECT COUNT(*) FROM posts WHERE user_id = users.id) AS post_count
FROM users;
```

🎯 子查询 vs JOIN

- 简单场景两者性能接近
- 复杂场景 JOIN 通常更高效
- 相关子查询（引用外层表）可能每行执行一次，注意性能

---

### 0.13 小案例：blog 库 3 表（users / posts / comments），5~6 条 SQL

💡 综合练习：创建博客系统数据库。

```sql
-- 1. 建库
CREATE DATABASE blog DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE blog;

-- 2. 建表
CREATE TABLE users (
  id         BIGINT       NOT NULL AUTO_INCREMENT,
  username   VARCHAR(50)  NOT NULL,
  email      VARCHAR(100) NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

CREATE TABLE posts (
  id         BIGINT       NOT NULL AUTO_INCREMENT,
  user_id    BIGINT       NOT NULL,
  title      VARCHAR(200) NOT NULL,
  content    TEXT,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';

CREATE TABLE comments (
  id         BIGINT       NOT NULL AUTO_INCREMENT,
  post_id    BIGINT       NOT NULL,
  user_id    BIGINT       NOT NULL,
  content    VARCHAR(500) NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_post_id (post_id),
  KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 3. 插入数据
INSERT INTO users (username, email) VALUES
  ('alice', 'alice@blog.com'),
  ('bob', 'bob@blog.com');

INSERT INTO posts (user_id, title, content) VALUES
  (1, 'MySQL 入门', '今天学 MySQL...'),
  (2, 'Node.js 实战', '用 Node 写后端...');

INSERT INTO comments (post_id, user_id, content) VALUES
  (1, 2, '写得好！'),
  (2, 1, '收藏了');

-- 4. 查询：每篇文章的评论数
SELECT p.title, COUNT(c.id) AS comment_count
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id
GROUP BY p.id, p.title;

-- 5. 查询：alice 发了哪些文章及评论
SELECT p.title, c.content AS comment, u.username AS commenter
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id
LEFT JOIN users u ON c.user_id = u.id
WHERE p.user_id = (SELECT id FROM users WHERE username = 'alice');

-- 6. 查询：评论最多的用户
SELECT u.username, COUNT(c.id) AS comment_count
FROM users u
JOIN comments c ON u.id = c.user_id
GROUP BY u.id, u.username
ORDER BY comment_count DESC
LIMIT 1;
```

---

## 二、🟡 中级进阶

### <span class="lv lv-2">中级</span> 1. 架构总览

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

### <span class="lv lv-2">中级</span> 2. InnoDB 存储引擎

#### 2.1 物理结构

- **表空间**：独立表空间 (`innodb_file_per_table=ON`，默认) → 每张表一个 `.ibd`；
- **段 (segment) → 区 (extent，1MB) → 页 (page，16KB) → 行 (row)**；
- **B+Tree 聚簇索引**：叶子页存完整行数据，按主键有序；
- **二级索引**：叶子存 `主键值`，**回表**取数据行。

#### 2.2 行格式

`COMPACT` / `DYNAMIC` (默认) / `COMPRESSED`：DYNAMIC 把超长 VARCHAR/TEXT/BLOB 全部存外溢页，本行只留 20B 指针。

#### 2.3 Buffer Pool

- 按 16KB 页为单位缓存数据/索引；
- 改进版 LRU：`young` / `old` 两段（默认 5/8 yong）+ `innodb_old_blocks_time`，避免大表扫描污染；
- `innodb_buffer_pool_size` 通常设为物理内存 50–75%；
- `innodb_buffer_pool_instances` 拆分锁竞争。

#### 2.4 Change Buffer / Adaptive Hash Index / Doublewrite

- **Change Buffer**：辅助索引插入/更新先缓冲，避免随机 IO（仅非唯一索引）；
- **AHI**：热点索引自动哈希加速等值查询；
- **Doublewrite**：页损坏保护，写两次（系统表空间 + 实际位置），故障恢复时校验。

---

### <span class="lv lv-2">中级</span> 3. 索引深度

#### 3.1 索引类型

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

#### 3.2 最左前缀

联合索引 `(a, b, c)`：
- `WHERE a=1` ✓
- `WHERE a=1 AND b=2` ✓
- `WHERE a=1 AND c=3` 仅 a 走索引；
- `WHERE b=2 AND c=3` ✗（除非有 a 范围）；
- `WHERE a=1 AND b>2 AND c=3` 走 a、b，c 不走（范围之后失效）。

8.0 引入 **Index Skip Scan**，部分场景可跳过最左列；但通常不要依赖。

#### 3.3 索引下推 (ICP)

在引擎层就用索引中能判断的条件过滤，再回表，减少 IO。`EXPLAIN` 看到 `Using index condition` 即生效。

#### 3.4 索引失效场景

- 隐式类型转换：`WHERE phone = 13800000000`（字段是 varchar）；
- 函数 / 表达式：`WHERE DATE(create_at) = '2024-01-01'` → 改成范围；
- 前导通配：`LIKE '%abc'`；
- `OR` 两侧不全有索引；
- `NOT IN` / `<>` 多数情况下不走；
- 索引列被运算：`WHERE a + 1 = 10`；
- 数据分布偏差导致优化器放弃索引（可 `FORCE INDEX` 或 `ANALYZE TABLE`）。

#### 3.5 EXPLAIN 关键列

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

### <span class="lv lv-2">中级</span> 4. 事务与 MVCC

#### 4.1 ACID

- **A**：undo log 回滚；
- **C**：业务 + 约束；
- **I**：锁 + MVCC；
- **D**：redo log + binlog 双写。

#### 4.2 隔离级别

| 级别 | 脏读 | 不可重复读 | 幻读 |
| --- | --- | --- | --- |
| READ UNCOMMITTED | ✓ | ✓ | ✓ |
| READ COMMITTED | ✗ | ✓ | ✓ |
| **REPEATABLE READ** (默认) | ✗ | ✗ | ✗ (InnoDB 用间隙锁解决) |
| SERIALIZABLE | ✗ | ✗ | ✗ |

#### 4.3 MVCC

每行隐藏列：`DB_TRX_ID`（最近修改事务）、`DB_ROLL_PTR`（指向 undo log）、`DB_ROW_ID`（无主键时）。

ReadView：
- **RC**：每条 SELECT 都生成新的 ReadView；
- **RR**：事务首次 SELECT 生成，整个事务复用。

可见性判断：行的 trx_id 是否被 ReadView 视为已提交（小于最小活跃 trx_id 即可见，处于活跃列表内不可见，大于最大下一个 id 也不可见）。

#### 4.4 当前读 vs 快照读

- **快照读**：普通 `SELECT`，走 MVCC；
- **当前读**：`SELECT ... FOR UPDATE | FOR SHARE`、`UPDATE` / `DELETE` / `INSERT`，会加锁取最新版本。

---

### <span class="lv lv-2">中级</span> 5. 锁机制

#### 5.1 锁粒度

- **全局锁**：`FLUSH TABLES WITH READ LOCK` (备份)；
- **表级锁**：`LOCK TABLES`、MDL（元数据锁）；
- **行锁**（InnoDB）。

#### 5.2 InnoDB 行锁种类

| 锁 | 范围 |
| --- | --- |
| Record Lock | 单行索引记录 |
| Gap Lock | 索引前后间隙（防幻读） |
| Next-Key Lock | Record + Gap 组合（默认） |
| Insert Intention Lock | 插入意向 |
| 共享 / 排他 | S / X |

#### 5.3 加锁规则要点 (RR)

1. 锁加在**索引**上，没索引则退化锁全表；
2. 等值查询命中：行锁 + 可能两侧 gap；
3. 等值查询未命中：变 gap lock；
4. 范围查询：next-key 锁覆盖整个区间，包括上界；
5. 唯一索引等值精确命中：仅行锁，不加 gap。

#### 5.4 死锁

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

#### 5.5 元数据锁 (MDL)

DDL 与 DML 互斥，长事务 + DDL 容易堵全库。8.0 支持 `online DDL`，但仍可能阻塞 prepare 阶段；变更前查 `performance_schema.metadata_locks`。

---

### <span class="lv lv-2">中级</span> 6. 日志系统：redo / undo / binlog

| 日志 | 层 | 作用 |
| --- | --- | --- |
| **redo log** | InnoDB 层 | 物理日志，crash recovery (WAL) |
| **undo log** | InnoDB 层 | 回滚 + MVCC |
| **binlog** | Server 层 | 复制 + 时间点恢复 |
| **relay log** | Server 层 | 从库收到主库 binlog 的中转 |
| **slow log** | Server 层 | 慢查询 |
| **error log / general log** | Server 层 | 启动错误 / 全部 SQL |

#### 6.1 两阶段提交 (XA)

```
prepare(redo) → write binlog → commit(redo)
```

- crash 在 prepare 之前：回滚；
- crash 在 prepare 之后、binlog 之前：回滚（redo 标记 prepare，但无 binlog，回滚）；
- crash 在 binlog 写完、commit 之前：判断 binlog 完整 → 提交；
- 保证 redo 与 binlog 一致，主从复制不丢数据。

#### 6.2 三大同步参数

- `innodb_flush_log_at_trx_commit`：1 (默认，每次 commit fsync)、2 (写 OS cache，每秒 fsync)、0 (每秒由后台)；
- `sync_binlog`：1 (每次 commit fsync)、N (累积 N 次)、0 (依赖 OS)；
- 双 1 配置：金融级；高并发可降到 2/100，宕机风险 1 秒数据。

#### 6.3 binlog 格式

- `STATEMENT`：体积小，存在不一致风险；
- `ROW`：行级镜像，安全（推荐）；
- `MIXED`：自动切换。

---

### <span class="lv lv-2">中级</span> 7. SQL 执行与优化

#### 7.1 慢 SQL 排查流程

1. `slow_query_log=ON` + `long_query_time=0.5`；
2. `pt-query-digest` / `mysqldumpslow` 聚合；
3. 对疑点 SQL `EXPLAIN`、`EXPLAIN ANALYZE`；
4. 检查表结构 / 索引 / 数据分布 (`SHOW INDEX FROM t`、`ANALYZE TABLE`)；
5. 必要时 `OPTIMIZER_TRACE`。

#### 7.2 常见优化技巧

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

#### 7.3 深分页方案

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

### <span class="lv lv-2">中级</span> 8. 表设计范式与反范式

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

### <span class="lv lv-2">中级</span> 11. 备份恢复

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

### <span class="lv lv-2">中级</span> 14. Node.js 接入实战

#### 14.1 mysql2

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

#### 14.2 事务

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

#### 14.3 ORM 选型

| 工具 | 风格 | 适合 |
| --- | --- | --- |
| **Prisma** | Schema-first，类型安全 | 业务系统 |
| **Drizzle ORM** | SQL-like + TS 类型推导 | 追求贴近 SQL |
| **TypeORM / MikroORM** | 装饰器实体 | DDD 风格 |
| **Knex** | 查询构造器 | 灵活 SQL |
| **mysql2** + 自封装 | 原生 | 性能极致、SQL 强 |

#### 14.4 常见坑

- `dateStrings: false` 会把 DATETIME 转 JS Date，**时区**易出问题；统一 UTC 或显式时区；
- 大结果集用 `query` 的 stream 模式：`pool.query(...).stream()`；
- BLOB 大字段用流；
- 长连接 + MySQL `wait_timeout` (默认 8h) 不一致 → 启用 keepAlive 或定期 `SELECT 1`；
- `LIMIT ?` 在某些驱动需特殊处理（`mysql2` 8.x 已支持）。

---

## 三、🔴 高级实战

### <span class="lv lv-3">高级</span> 9. 分库分表与读写分离

#### 9.1 拆分维度

- **垂直拆分**：按业务/字段；
- **水平拆分**：按主键 hash / 范围 / 时间；
- **冷热分离**：当前数据热表 + 归档表。

#### 9.2 中间件

- **客户端**：ShardingSphere-JDBC、TDDL；
- **代理**：ShardingSphere-Proxy、ProxySQL、Vitess、MaxScale；
- 自研：路由 + 分布式 ID（Snowflake / Leaf）。

#### 9.3 难点

- 跨库 JOIN：尽量避免，靠 ETL 或反范式；
- 全局唯一 ID：Snowflake / 号段 / UUID v7；
- 分布式事务：XA、TCC、Seata、消息事务表；
- 排序分页：归并多分片，注意性能；
- 平滑扩容：一致性 hash、双写 + 数据迁移。

#### 9.4 读写分离

- 主写从读，靠 binlog 同步；
- 一致性问题：从库延迟 → **强一致读路由** (read your write) 或 master 兜底；
- ProxySQL / MyCAT / DNS / 业务层 hint。

---

### <span class="lv lv-3">高级</span> 10. 主从复制与高可用

#### 10.1 复制模式

| 模式 | 一致性 | 性能 |
| --- | --- | --- |
| **异步**（默认） | 弱 | 高 |
| **半同步** (`rpl_semi_sync`) | 至少一从收 binlog 才返回 | 中 |
| **组复制 (MGR)** / **InnoDB Cluster** | 多数派提交，自动选主 | 中 |
| **MySQL Group Replication** + Router | HA，类 Paxos | 中 |

#### 10.2 GTID

`GTID = source_uuid:transaction_id`，唯一标识事务，断点续传方便，是现代复制必选。

#### 10.3 常见拓扑

- 一主多从；
- 主主互备 + keepalived（双主写需谨慎，建议主备）；
- MHA / Orchestrator 故障切换；
- 云：RDS / PolarDB（共享存储，秒级切换）。

---

### <span class="lv lv-3">高级</span> 12. 性能监控与诊断

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

### <span class="lv lv-3">高级</span> 13. 安全

- 最小权限，按业务库分用户；禁用 `root@%`；
- 强口令 + `caching_sha2_password`（8.0 默认）；
- 网络层：限制 bind-address、走 VPC / SSH 隧道；
- TLS：`require_secure_transport=ON`；
- 审计：`audit_log`、binlog 留痕；
- SQL 注入：业务侧用预编译参数；
- 备份加密、传输加密、敏感字段列加密 (`AES_ENCRYPT` / 应用层 KMS)；
- DDL 高峰期禁用：用 `pt-osc` / `gh-ost` 做无锁变更。

---

### <span class="lv lv-3">高级</span> 15. 常见面试题

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

---

## <span class="lv lv-3">高级</span> 附录 B：MySQL 8.0 现代 SQL & 参数速通（2025）

> 8.0 已不是"5.7 + 小修补"，而是把 Oracle/PG 的分析型能力（CTE、窗口、JSON_TABLE、Hash Join、直方图）和现代化运维（Instant DDL、Clone、MGR、动态 redo）一次给齐。仍然只写 `SELECT * FROM t WHERE ... LIMIT 10 OFFSET 100000` 的团队，在 2025 会被数据量和运维成本吊打。

---

### B.1 CTE（WITH / WITH RECURSIVE）实战

💡 **一句话**：CTE = 命名的临时结果集，比子查询更可读、能自引用（递归）。

#### 普通 CTE：拆解复杂子查询

```sql
-- 旧写法：嵌套子查询，难读
SELECT u.id, u.name, o.total
FROM users u
JOIN (
  SELECT user_id, SUM(amount) AS total
  FROM orders
  WHERE created_at >= '2025-01-01'
  GROUP BY user_id
  HAVING SUM(amount) > 1000
) o ON o.user_id = u.id;

-- CTE 写法：分步骤，可复用
WITH big_buyers AS (
  SELECT user_id, SUM(amount) AS total
  FROM orders
  WHERE created_at >= '2025-01-01'
  GROUP BY user_id
  HAVING SUM(amount) > 1000
)
SELECT u.id, u.name, b.total
FROM users u
JOIN big_buyers b ON b.user_id = u.id;
```

#### 递归 CTE：组织树 / 评论树

```sql
-- 表：employees(id, name, manager_id)
-- 查 CEO（id=1）下面所有层级下属
WITH RECURSIVE org AS (
  -- 锚点：起点
  SELECT id, name, manager_id, 1 AS lvl, CAST(name AS CHAR(1000)) AS path
  FROM employees WHERE id = 1
  UNION ALL
  -- 递归：向下走一层
  SELECT e.id, e.name, e.manager_id, o.lvl + 1,
         CONCAT(o.path, ' > ', e.name)
  FROM employees e
  JOIN org o ON e.manager_id = o.id
)
SELECT * FROM org ORDER BY lvl, id;
```

#### 递归 CTE：生成日期序列（补零）

```sql
WITH RECURSIVE dates(d) AS (
  SELECT DATE '2025-01-01'
  UNION ALL
  SELECT d + INTERVAL 1 DAY FROM dates WHERE d < '2025-01-31'
)
SELECT d.d, COALESCE(t.cnt, 0) AS cnt
FROM dates d
LEFT JOIN (
  SELECT DATE(created_at) day, COUNT(*) cnt FROM orders GROUP BY day
) t ON t.day = d.d;
```

⚠️ 递归深度默认 `cte_max_recursion_depth = 1000`，超深树需要手动调大或加 `WHERE lvl < 100` 兜底。

🎯 CTE = 让 SQL 长得像编程语言的 let/const；递归 CTE 让你不再写存储过程去爬树。

---

### B.2 窗口函数（Window Functions）实战

💡 **一句话**：窗口 = "GROUP BY 但不合并行"，能算排名、累计、移动平均、TOP-N per group。

#### 排名三兄弟

```sql
SELECT
  user_id, score,
  ROW_NUMBER() OVER (ORDER BY score DESC) rn,     -- 1,2,3,4  永远唯一
  RANK()       OVER (ORDER BY score DESC) rk,     -- 1,2,2,4  并列跳号
  DENSE_RANK() OVER (ORDER BY score DESC) dr,     -- 1,2,2,3  并列不跳号
  NTILE(4)     OVER (ORDER BY score DESC) tile    -- 分四桶（分位）
FROM exam;
```

#### LAG / LEAD：与上一行/下一行对比

```sql
-- 每天订单额环比
SELECT
  day, amount,
  LAG(amount, 1) OVER (ORDER BY day) AS prev_day,
  amount - LAG(amount, 1) OVER (ORDER BY day) AS diff
FROM daily_orders;
```

#### 累计 & 移动平均

```sql
SELECT
  day, amount,
  SUM(amount) OVER (ORDER BY day) AS cumulative,          -- 累计
  AVG(amount) OVER (ORDER BY day
                    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ma7  -- 7日均线
FROM daily_orders;
```

#### 经典场景 1：TOP-N per group

```sql
-- 每个分类销量前 3
WITH ranked AS (
  SELECT category_id, product_id, sales,
         ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY sales DESC) rn
  FROM product_sales
)
SELECT * FROM ranked WHERE rn <= 3;
```

#### 经典场景 2：连续登录天数

```sql
-- 用户连续登录段：连续日期的 (date - ROW_NUMBER) 相等
WITH t AS (
  SELECT user_id, login_date,
         DATE_SUB(login_date,
           INTERVAL ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) DAY
         ) AS grp
  FROM user_login
)
SELECT user_id, MIN(login_date) start_d, MAX(login_date) end_d,
       COUNT(*) streak_days
FROM t GROUP BY user_id, grp
HAVING streak_days >= 7;
```

🎯 会窗口后，90% "分组内 TOP-N / 环比 / 留存" 都不再需要写自连接或存储过程。

---

### B.3 JSON 函数 + 多值索引 + 函数索引

💡 **一句话**：MySQL 8.0 的 JSON 已经能建索引（多值索引、函数索引），JSON 列不再是查询黑洞。

#### JSON 基本操作

```sql
CREATE TABLE user_profile (
  id INT PRIMARY KEY,
  data JSON
);

INSERT INTO user_profile VALUES
(1, '{"name":"Tom","tags":["vip","gold"],"age":28,"email":"Tom@X.com"}');

-- 提取字段（三种等价写法）
SELECT
  JSON_EXTRACT(data, '$.name') AS n1,   -- "Tom"（带引号）
  data->'$.name'               AS n2,   -- 同上
  data->>'$.name'              AS n3    -- Tom（无引号，unquote）
FROM user_profile;

-- 修改
UPDATE user_profile
SET data = JSON_SET(data, '$.age', 29, '$.city', 'BJ')
WHERE id = 1;
```

#### JSON_TABLE：JSON 数组变关系表

```sql
SELECT jt.*
FROM user_profile,
  JSON_TABLE(data, '$.tags[*]'
    COLUMNS(
      idx FOR ORDINALITY,
      tag VARCHAR(50) PATH '$'
    )
  ) AS jt
WHERE id = 1;
-- idx=1 tag=vip / idx=2 tag=gold
```

#### 多值索引（Multi-Valued Index）：给 JSON 数组建索引

```sql
ALTER TABLE user_profile
ADD INDEX idx_tags ((CAST(data->'$.tags' AS CHAR(20) ARRAY)));

-- 命中索引的查询：MEMBER OF / JSON_CONTAINS / JSON_OVERLAPS
SELECT * FROM user_profile
WHERE 'vip' MEMBER OF (data->'$.tags');

SELECT * FROM user_profile
WHERE JSON_CONTAINS(data->'$.tags', '"vip"');

EXPLAIN SELECT * FROM user_profile
WHERE JSON_OVERLAPS(data->'$.tags', '["vip","silver"]');
-- key: idx_tags  ← 命中
```

#### 函数索引：给表达式建索引

```sql
-- 大小写不敏感邮箱查询
ALTER TABLE user_profile ADD INDEX idx_email_lower ((LOWER(data->>'$.email')));

SELECT * FROM user_profile
WHERE LOWER(data->>'$.email') = 'tom@x.com';   -- 命中 idx_email_lower
```

⚠️ 多值索引不能作主键 / 外键 / UNIQUE；单查询最多用一个 MV index；每个 JSON 数组最大 index record 由 `innodb_page_size` 决定。

🎯 需要"标签查用户""角色查权限""数组包含"等场景，多值索引是 JSON 列的救命稻草。

---

### B.4 Generated Column（VIRTUAL / STORED）+ 其上索引

💡 **一句话**：把"表达式"物化为列，再对该列建普通索引 —— 是"函数索引"的另一种姿势，兼容更多老版本。

```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY,
  amount DECIMAL(10,2),
  tax_rate DECIMAL(4,3),
  -- VIRTUAL：不占存储、读时计算；可建索引（索引本身是物化的）
  total DECIMAL(12,2) GENERATED ALWAYS AS (amount * (1 + tax_rate)) VIRTUAL,
  -- STORED：写时计算并落盘；节省 CPU、占存储
  created_day DATE GENERATED ALWAYS AS (DATE(created_at)) STORED,
  created_at DATETIME,
  KEY idx_total (total),
  KEY idx_day (created_day)
);
```

#### 拆 JSON 字段建索引

```sql
CREATE TABLE t (
  id INT PRIMARY KEY,
  data JSON,
  city VARCHAR(50) GENERATED ALWAYS AS (data->>'$.city') VIRTUAL,
  KEY idx_city (city)
);
SELECT * FROM t WHERE city = 'BJ';   -- 命中 idx_city
```

#### VIRTUAL vs STORED 选型

| 维度 | VIRTUAL | STORED |
|---|---|---|
| 存储占用 | 不占（仅索引占） | 占空间 |
| 写性能 | 快（不计算） | 慢（每次写要算） |
| 读性能 | 慢一点（要算） | 快 |
| DDL 成本 | ALTER 秒改（Instant） | ALTER 要重建 |
| 建索引 | 支持 | 支持 |
| 推荐 | 表达式简单、写多读少 | 表达式重、读多写少 |

#### 与"函数索引"取舍

- **函数索引**：语法简洁 `INDEX ((expr))`，不产生新列，业务侧不感知。
- **Generated Column**：多了一个"具名列"，业务 SELECT 可直接用，方便复用。
- 一般：只用于加速查询 → 函数索引；业务 SQL 也想直接读结果 → Generated Column。

🎯 别再"查询里到处 SUBSTRING/LOWER"，物化 + 索引一次到位。

---

### B.5 Hash Join（8.0.18+）

💡 **一句话**：非索引等值 JOIN 从 O(N·M) 的 NLJ 变成 O(N+M) 的 Hash Join，OLAP 场景性能起飞。

#### 触发条件

- 8.0.18+ 默认开启
- **等值** JOIN（`a.x = b.x`）
- 两侧至少有一侧**没有可用索引**（否则优化器仍然优先选索引 NLJ）
- 8.0.20+ 起，非等值 & 外连接也可 Hash Join

#### 对比

| 算法 | 复杂度 | 适用 | 备注 |
|---|---|---|---|
| Nested Loop Join (NLJ) | O(N·M) | 有索引、小表驱动 | 传统 |
| Block Nested Loop (BNL) | 好一点的 NLJ | 无索引小表 | 8.0.20 起被 Hash Join 取代 |
| Batched Key Access (BKA) | 优化的 NLJ | 有索引大表 | 需开 `mrr` |
| **Hash Join** | O(N+M) | 大表等值、无索引 | 8.0.18+ 默认 |

#### EXPLAIN 观察

```sql
EXPLAIN FORMAT=TREE
SELECT * FROM orders o JOIN users u ON o.user_id = u.id
WHERE u.city = 'BJ';

-- 输出示例：
-- -> Inner hash join (o.user_id = u.id)
--    -> Table scan on o
--    -> Hash
--       -> Filter: (u.city = 'BJ')
--          -> Table scan on u
```

```sql
-- 8.0.18+ 更好用：真实执行统计
EXPLAIN ANALYZE
SELECT ... ;
-- 输出会有 actual time / rows / loops，能直接看到瓶颈
```

#### Hint 强制

```sql
SELECT /*+ HASH_JOIN(o u) */ *
FROM orders o JOIN users u ON o.user_id = u.id;

-- 反向：禁用
SELECT /*+ NO_HASH_JOIN(o u) */ * ...;
```

⚠️ Hash Join 会用内存（`join_buffer_size`），超限溢出磁盘。OLTP 场景仍然优先建索引走 NLJ；OLAP/报表场景才让 Hash Join 大展身手。

🎯 数据仓/报表 SQL 慢，先看 `EXPLAIN FORMAT=TREE`，没走 Hash Join 就查是不是被强制索引/中间表劣化了。

---

### B.6 Keyset Pagination（游标翻页）通用模板

💡 **一句话**：`OFFSET N` 在 1000 万行后就是灾难；Keyset 用"上一页最后一条的键"作为游标，永远 `WHERE key > ? LIMIT n`，性能不随页码衰减。

#### 单键（有 UNIQUE 索引）

```sql
-- 第一页
SELECT id, title FROM posts
ORDER BY id LIMIT 20;

-- 后续页：last_id 是上一页最后一行的 id
SELECT id, title FROM posts
WHERE id > :last_id
ORDER BY id LIMIT 20;
```

#### 复合键 (created_at, id) —— 处理"时间可能相等"

```sql
-- 索引：INDEX (created_at, id)
-- 第一页
SELECT id, created_at, title FROM posts
ORDER BY created_at DESC, id DESC LIMIT 20;

-- 后续页：last_created_at + last_id
SELECT id, created_at, title FROM posts
WHERE (created_at, id) < (:last_created_at, :last_id)
ORDER BY created_at DESC, id DESC LIMIT 20;

-- 等价展开写法（有些 ORM 不支持行值比较）
SELECT id, created_at, title FROM posts
WHERE created_at < :last_created_at
   OR (created_at = :last_created_at AND id < :last_id)
ORDER BY created_at DESC, id DESC LIMIT 20;
```

#### NULL 处理

```sql
-- 若 created_at 可能为 NULL，用 IS NULL 优先 或 用 COALESCE 规避
SELECT ... WHERE (COALESCE(created_at, '9999-12-31'), id) < (:c, :id) ...
```

#### 双向翻页（上一页）

```sql
-- 上一页：反转排序取一段，再反转结果
SELECT * FROM (
  SELECT id, created_at, title FROM posts
  WHERE (created_at, id) > (:first_created_at, :first_id)
  ORDER BY created_at ASC, id ASC LIMIT 20
) t
ORDER BY created_at DESC, id DESC;
```

#### 对比 benchmark（1000 万行表）

| 方式 | 第 1 页 | 第 100 页 | 第 10000 页 |
|---|---|---|---|
| `LIMIT 20 OFFSET N` | 2 ms | 30 ms | **3800 ms** |
| Keyset | 2 ms | 2 ms | **2 ms** |

⚠️ Keyset 的代价：不能"跳到第 N 页"，只能上一页/下一页。业务多是"信息流"场景，非常合适。

🎯 后台管理需要跳页 → 老老实实 OFFSET + 显示"约 XX 万条"；C 端 feed → 一律 Keyset。

---

### B.7 直方图 & Invisible Index & Instant DDL

💡 **一句话**：MySQL 8.0 三个"运维神器"：直方图让优化器更聪明、Invisible Index 让加索引可回滚、Instant DDL 让 ALTER 秒完成。

#### 直方图（Histogram）

针对**没建索引**的列，告诉优化器数据分布，避免全表扫。

```sql
-- 建直方图（默认 100 桶，可到 1024）
ANALYZE TABLE orders UPDATE HISTOGRAM ON status, city WITH 64 BUCKETS;

-- 查看
SELECT JSON_PRETTY(histogram) FROM information_schema.column_statistics
WHERE table_name = 'orders';

-- 删除
ANALYZE TABLE orders DROP HISTOGRAM ON status;
```

⚠️ 直方图**不会自动更新**，数据变化大时要手动重建。适合值分布不均且不适合建索引的列（如 status 只有 3 个值）。

#### Invisible Index：灰度上线/回滚

```sql
-- 建成"不可见"，优化器忽略；线上不产生副作用
ALTER TABLE orders ADD INDEX idx_status (status) INVISIBLE;

-- 灰度：单个 session 开启验证
SET SESSION optimizer_switch = 'use_invisible_indexes=on';
EXPLAIN SELECT * FROM orders WHERE status = 'PAID';   -- 观察是否更好

-- 全局启用
ALTER TABLE orders ALTER INDEX idx_status VISIBLE;

-- 疑似索引拖慢？先隐藏观察，别 DROP
ALTER TABLE orders ALTER INDEX idx_old INVISIBLE;
```

🎯 生产删索引前，先 INVISIBLE 一周观察；出问题秒回滚，比重建索引快无数倍。

#### Instant DDL（8.0.12+ 起持续增强，8.0.29+ 支持 ADD/DROP 任意列位置）

```sql
-- 秒级：只改元数据，不重建表
ALTER TABLE orders ADD COLUMN remark VARCHAR(200) DEFAULT NULL, ALGORITHM=INSTANT;
ALTER TABLE orders DROP COLUMN remark, ALGORITHM=INSTANT;   -- 8.0.29+
ALTER TABLE orders RENAME COLUMN old_c TO new_c, ALGORITHM=INSTANT;
```

支持 INSTANT 的常见操作：
- 加/删列（8.0.29+）
- 加/删虚拟列
- 修改列默认值
- 修改 ENUM/SET 尾部枚举值
- 重命名列
- 添加/删除生成列表达式

不支持 INSTANT（要 INPLACE 或 COPY）：
- 改列类型/长度
- 加/改主键
- 修改字符集

⚠️ INSTANT DDL 有累计次数上限（默认 64 次，`innodb_instant_alter_columns_max`），超过要 OPTIMIZE TABLE 重建。

---

### B.8 innodb_redo_log_capacity（8.0.30+）+ 生产参数模板

💡 **一句话**：8.0.30 起 redo log 从"两个固定文件"变成"动态总容量"，可在线调整，不再需要重启。

```sql
-- 查看/设置（单位字节，128M ~ 128G）
SHOW VARIABLES LIKE 'innodb_redo_log_capacity';
SET GLOBAL innodb_redo_log_capacity = 8 * 1024 * 1024 * 1024;  -- 8G，动态生效
```

#### 推荐值公式

- `innodb_redo_log_capacity` ≈ **1 分钟的写入量 × 2**（观察 `Innodb_os_log_written` / 60s）
- `innodb_buffer_pool_size` ≈ 物理内存 × **50%~70%**（专用 DB 机器可到 80%）
- `innodb_io_capacity` = SSD 起步 **2000**，NVMe **5000~20000**；`io_capacity_max = 2 × io_capacity`
- `innodb_flush_log_at_trx_commit = 1`（金融）/ `2`（一般 Web）
- `sync_binlog = 1`（安全）/ `1000`（性能，非金融）

#### 生产 my.cnf 模板（64 核 / 256G 内存 / NVMe 服务器）

```ini
[mysqld]
# —— 基础
server_id = 101
port = 3306
default_authentication_plugin = caching_sha2_password
default_time_zone = '+08:00'
character_set_server = utf8mb4
collation_server = utf8mb4_0900_ai_ci

# —— 内存
innodb_buffer_pool_size = 180G
innodb_buffer_pool_instances = 16
innodb_log_buffer_size = 64M
tmp_table_size = 256M
max_heap_table_size = 256M
join_buffer_size = 8M
sort_buffer_size = 4M

# —— 8.0.30+ 动态 redo
innodb_redo_log_capacity = 16G
# 老写法（<8.0.30，已不推荐）：
# innodb_log_file_size = 4G
# innodb_log_files_in_group = 4

# —— IO（NVMe）
innodb_io_capacity = 10000
innodb_io_capacity_max = 20000
innodb_flush_method = O_DIRECT
innodb_flush_neighbors = 0        # SSD 关闭

# —— 事务/持久化
innodb_flush_log_at_trx_commit = 1
sync_binlog = 1
binlog_expire_logs_seconds = 604800
binlog_format = ROW
binlog_row_image = MINIMAL

# —— 并发
max_connections = 4000
thread_pool_size = 64             # 企业版；社区版可用 percona thread pool
innodb_thread_concurrency = 0     # 让 InnoDB 自己调度

# —— 复制（GTID + 并行）
gtid_mode = ON
enforce_gtid_consistency = ON
slave_parallel_type = LOGICAL_CLOCK
slave_parallel_workers = 16
binlog_transaction_dependency_tracking = WRITESET

# —— 慢查询
slow_query_log = 1
long_query_time = 0.5
log_queries_not_using_indexes = 0  # 开了噪声大
```

🎯 一台"新机器"的参数不是抄网上的，而是：**先按公式估 → 上线跑一周 → 再看 `SHOW ENGINE INNODB STATUS`、慢日志、Grafana 曲线微调**。

---

### B.9 分库分表 & 高可用选型矩阵

💡 **一句话**：单库到瓶颈，不是"立刻分库分表"，而是先垂直拆 → 读写分离 → 分区表 → 才是分库分表 / NewSQL。

#### 主流方案对比

| 维度 | ShardingSphere-JDBC | ShardingSphere-Proxy | Vitess | TiDB |
|---|---|---|---|---|
| 接入方式 | 应用 JAR（重侵入） | 独立进程代理（透明） | 独立代理 + Topo | 兼容 MySQL 协议的 NewSQL |
| 语言绑定 | 主要 JVM | 语言无关 | 语言无关 | 语言无关 |
| 分布式事务 | XA / Seata AT | XA / Seata | 2PC（谨慎用） | 原生分布式事务（Percolator） |
| 在线扩容 | 停机迁移 / 手动 | 停机迁移 / 手动 | Reshard 无缝在线 | 自动 rebalance |
| 兼容 MySQL | 高 | 高 | 高（YouTube 出品） | 高（少数语法差异） |
| 运维成本 | 低（jar 依赖） | 中（多一层代理） | 高（复杂拓扑） | 中（自动化好） |
| 存储引擎 | 原生 MySQL | 原生 MySQL | 原生 MySQL | TiKV（LSM） |
| 强一致性 | 需 XA | 需 XA | 分片内一致 | 全局一致（Raft） |
| 适合场景 | 单语言中小规模 | 多语言中大规模 | 超大规模、需在线扩容 | 数据量>10T、需要 HTAP |
| 学习曲线 | 平 | 平 | 陡 | 中 |

#### 什么时候选谁

- **< 1TB / QPS < 5000**：别分库分表。加读写分离 + 分区表 + 索引优化。
- **1TB ~ 10TB / 多语言**：**ShardingSphere-Proxy**（透明、生态成熟）。
- **纯 Java 单语言、追求性能**：**ShardingSphere-JDBC**（无代理跳数）。
- **10TB+ / 需要在线扩容和自动化 sharding**：**Vitess**（YouTube 验证过极端规模）。
- **HTAP（同时要 OLTP + OLAP）/ 强一致大规模**：**TiDB**（NewSQL 一步到位）。
- **金融级 + 传统架构**：**MGR + ProxySQL / MySQL Router**（不分片，靠强节点撑）。

⚠️ 别看到 QPS 3000 就上 TiDB —— 运维复杂度上一个数量级，收益却抵不过。

🎯 决策顺序：**索引优化 → 读写分离 → 分区表 → 归档冷数据 → 才考虑 sharding；能不分就不分**。

---

### B.10 InnoDB Cluster / MGR 冲突检测 & Clone Plugin

💡 **一句话**：InnoDB Cluster = MGR（组复制）+ MySQL Router（路由）+ MySQL Shell（管理），是官方"开箱即用"的高可用方案。

#### 一键建集群（MySQL Shell）

```bash
# 前提：3 台机器已装好 MySQL 8.0，开启 GTID
mysqlsh --uri root@node1:3306

# 进入 mysqlsh 后：
> dba.configureInstance('root@node1:3306')   # 三台都跑
> dba.configureInstance('root@node2:3306')
> dba.configureInstance('root@node3:3306')

> \connect root@node1:3306
> var c = dba.createCluster('prodCluster')
> c.addInstance('root@node2:3306', {recoveryMethod:'clone'})
> c.addInstance('root@node3:3306', {recoveryMethod:'clone'})
> c.status()
```

#### MySQL Router 配置（自动读写分离 + 故障转移）

```bash
mysqlrouter --bootstrap root@node1:3306 --directory /data/router --user mysqlrouter
/data/router/start.sh

# 应用连接：
# 写：mysql -h router-host -P 6446   （转发到 Primary）
# 读：mysql -h router-host -P 6447   （轮询到 Secondary）
```

#### MGR WRITESET + 并行复制 + 冲突检测

```ini
# 每个节点
group_replication_single_primary_mode = ON      # 单主（推荐）；多主要极端谨慎
group_replication_consistency = BEFORE_ON_PRIMARY_FAILOVER
transaction_write_set_extraction = XXHASH64     # 计算 writeset
binlog_transaction_dependency_tracking = WRITESET
slave_parallel_type = LOGICAL_CLOCK
slave_parallel_workers = 16
```

- **WRITESET**：事务的"写集合"（主键 hash）；只要写集合无冲突，两个事务在从库可**并行**回放。
- **冲突检测**：多主模式下，如果两个节点同时改同一行，MGR 用 writeset 判定冲突，**后到者回滚**（乐观并发）。
- 单主模式不涉及冲突，性能与稳定性都远优于多主，**生产强烈推荐单主 + Router 自动 failover**。

#### Clone Plugin：秒建从库（vs xtrabackup）

```sql
-- 目标机上（要变成新从库）
INSTALL PLUGIN clone SONAME 'mysql_clone.so';
SET GLOBAL clone_valid_donor_list = 'donor-host:3306';

-- 一键克隆（会自动重启目标实例）
CLONE INSTANCE FROM 'clone_user'@'donor-host':3306
IDENTIFIED BY 'password';

-- 查看进度
SELECT STATE, BEGIN_TIME, END_TIME, DATA_SPEED, BINLOG_POSITION
FROM performance_schema.clone_progress;
```

#### Clone vs xtrabackup

| 维度 | Clone Plugin | xtrabackup |
|---|---|---|
| 官方支持 | ✅ 官方原生 | ❌ Percona 出品 |
| 一致性 | 事务一致 + GTID | 事务一致 + GTID |
| 速度 | 网络带宽打满，通常快 | 快，但要经过 tar/传输/解压 |
| 操作步骤 | 一条 SQL | backup → transfer → prepare → start |
| 增量备份 | ❌ 不支持 | ✅ 支持 |
| 加密 | ✅ 支持 SSL | ✅ 支持 |
| 场景 | 快速新建/重建从库 | 常规备份 + PITR |

⚠️ Clone 是**全量**克隆，不适合日常备份；日常备份仍然用 xtrabackup + binlog。

🎯 生产标配：**InnoDB Cluster（MGR + Router）做高可用 + Clone Plugin 秒建从库 + xtrabackup 做每日全备 + binlog 做增量 → PITR**。

---

## 附录 B 收官心法

1. **CTE + 窗口函数**：把 SQL 从"能查数据"升级为"能做分析"，别再什么都拉到应用层算。
2. **JSON 索引 + 生成列**：MySQL 8.0 的半结构化能力已经能替代很多"因为要动态字段所以上 MongoDB"的场景。
3. **Hash Join + 直方图**：让 MySQL 在中小型 OLAP 场景可用，别一遇到 JOIN 就分库分表。
4. **Keyset Pagination**：深分页解决方案，写一次终身受益。
5. **Invisible Index + Instant DDL + Clone Plugin**：8.0 三大"运维神器"，把 DBA 从 3AM 电话里救出来。
6. **InnoDB Cluster + Router**：官方高可用方案，不要再自己搭 MHA/Orchestrator 折腾。
7. **参数不是抄的，是量出来的**：`SHOW ENGINE INNODB STATUS`、慢日志、performance_schema 才是真理。

🎯 **一句话总收**：MySQL 8.0 = "80% 的 Oracle 高级特性 + 现代化运维"；只学到 5.7 就去面 2025 岗位，等于拿着诺基亚去讲智能手机。

