# v3tsnode · 全栈偏前端技术知识库

<div align="center">

**初级入门 → 中级进阶 → 高级实战**

一份面向「全栈偏前端」开发者的本地离线学习手册  
覆盖从前端基础到后端服务、数据库、缓存、容器化的完整技能树

[![文档数量](https://img.shields.io/badge/文档-15份-blue)](#-文档总览)
[![总行数](https://img.shields.io/badge/总行数-27464行-green)](#-文档总览)
[![三段结构](https://img.shields.io/badge/结构-初→中→高-orange)](#-三段式结构说明)
[![纯静态](https://img.shields.io/badge/纯静态-零依赖-lightgrey)](#-启动方式)

</div>

---

## 📑 目录

- [✨ 阅读器特性](#-阅读器特性)
- [🗺️ 知识体系全景](#️-知识体系全景)
- [📂 目录结构](#-目录结构)
- [📚 文档总览](#-文档总览)
- [🚀 启动方式](#-启动方式)
- [🧭 学习路线](#-学习路线)
- [📌 各文档要点速览](#-各文档要点速览)
- [🛠 自定义与扩展](#-自定义与扩展)
- [🌐 发布到 GitHub Pages](#-发布到-github-pages)
- [📜 License](#-license)

---

## ✨ 阅读器特性

本知识库是**零依赖纯前端**单文件阅读器（`index.html`），双击即可打开，推荐配合本地静态服务器使用。

| 特性 | 说明 |
| --- | --- |
| 📂 **分组侧栏** | 6 大技术分组，15 份文档一键切换，当前文档高亮 |
| 📑 **自动大纲** | 右侧 TOC 由 H2/H3/H4 自动生成，滚动时联动高亮 |
| 🔍 **全文搜索** | 顶部搜索框实时高亮命中词，自动滚动到首个结果 |
| 🏷️ **难度徽章** | 每节标题带 `🟢 初级 / 🔵 中级 / 🔴 高级` 彩色胶囊 |
| 📋 **代码复制** | 所有代码块右上角一键复制，自动提示「✓ 已复制」 |
| 📊 **进度条** | 顶部细线实时显示当前文档阅读进度 |
| 🌙 **深色模式** | 跟随系统 `prefers-color-scheme` 自动切换 |
| 📱 **响应式** | 窄屏自动收起 TOC / 侧栏，移动端可用 |
| 🔗 **锚点跳转** | 标题悬浮显示 `#` 锚点，支持复制链接直达 |
| 📡 **CDN 渲染** | marked 12 + highlight.js 11 走 jsDelivr，无需 npm |

---

## 🗺️ 知识体系全景

```
┌─────────────────────────────────────────────────────────────────┐
│                   全栈偏前端技术体系                              │
├────────────────┬────────────────────────────────────────────────┤
│                │                                                │
│   🌐 前端基础   │  HTML5  ──►  CSS3  ──►  JavaScript            │
│                │  （语义化）   （布局）    （异步/原型/V8）        │
│                │                 ↓                              │
│   ⚡ 框架语言   │           Vue 3  +  TypeScript                 │
│                │        （组合式API/Pinia）（泛型/类型体操）      │
│                │                 ↓                              │
│   🛠️ Node后端  │  Node.js → Express → Koa → NestJS             │
│                │  （事件循环）（中间件）（洋葱）（企业级DI）        │
│                │                 ↓                              │
│   🗄️ 数据存储  │  MySQL  +  MongoDB  +  Redis                   │
│                │  （关系型）  （文档型）  （缓存/队列）            │
│                │                 ↓                              │
│   🐳 DevOps    │              Docker                            │
│                │      （容器/Compose/镜像优化/CI-CD）             │
│                │                 ↓                              │
│   📱 多端      │  微信小程序原生  +  uni-app                     │
│                │  （双线程/Skyline）（条件编译/多端发布）          │
│                │                                                │
└────────────────┴────────────────────────────────────────────────┘
```

**定位：** 以前端为主，后端为辅。前端部分（HTML5/CSS3/JS/Vue3/TS）覆盖完整初→高阶路线；后端部分（Node.js 系列 + 数据库 + Docker）聚焦**全栈开发的实用高频知识点**，让前端开发者能独立交付完整项目。

---

## 📂 目录结构

```
v3tsnode/
├─ index.html               # 浏览器阅读入口（6组侧栏 + 大纲 + 搜索 + 徽章）
├─ serve.js                 # 零依赖本地静态服务器（Node.js 原生）
├─ package.json
├─ README.md
├─ .github/
│  └─ workflows/
│     └─ deploy.yml         # GitHub Pages 自动部署 CI/CD
└─ docs/                    # 15 份 Markdown 文档
   │
   │  # 🌐 前端基础（初 → 高）
   ├─ html5.md              # HTML5：语义化 / 表单 / 多媒体 / Web Components / PWA / CSP
   ├─ css3.md               # CSS3：盒模型 / Flex / Grid / 动画 / 容器查询 / Houdini
   ├─ javascript.md         # JS：语法 / 原型 / 异步 / EventLoop / 手写系列 / V8
   │
   │  # ⚡ 框架 & 语言（中 → 高）
   ├─ vue3.md               # Vue 3：入门 → 响应式源码 / 编译优化 / Pinia / SSR
   ├─ typescript.md         # TypeScript：入门 → 泛型 / infer / 协变逆变 / 类型体操
   │
   │  # 🛠️ Node.js 后端
   ├─ nodejs.md             # Node.js：入门 → 事件循环 / Stream / Worker / 性能
   ├─ express.md            # Express：入门 → 中间件 / JWT / 安全 / SSE / Express 5
   ├─ koa.md                # Koa：洋葱模型 / JWT / 路由模块化 / 校验 / compose 源码
   ├─ nestjs.md             # NestJS：装饰器/DI / 守卫/拦截器 / TypeORM / Swagger
   │
   │  # 🗄️ 数据库 & 缓存
   ├─ mysql.md              # MySQL：CRUD → 索引 / 事务 / InnoDB / MVCC / 分库分表
   ├─ mongodb.md            # MongoDB：文档模型 / Mongoose / 聚合管道 / 事务 / Atlas
   ├─ redis.md              # Redis：5种数据类型 / 缓存策略 / 限流 / 排行榜 / 哨兵
   │
   │  # 🐳 DevOps & 运维
   ├─ docker.md             # Docker：容器 / Dockerfile / Compose / 镜像优化 / CI/CD
   │
   │  # 📱 多端 & 小程序
   ├─ wxmini.md             # 微信小程序：双线程 / 组件 / 登录 / 分包 / Skyline / 云开发
   └─ uniapp.md             # uni-app：条件编译 / nvue / renderjs / uni-app x / CI/CD
```

---

## 📚 文档总览

共 **15 份**文档，**27,464 行**，按难度均分为三段式结构。

| # | 文档 | 所属分组 | 行数 | 难度 | 核心关键词 |
|---|------|----------|------|------|-----------|
| 1 | `html5.md` | 🌐 前端基础 | 2,137 | 初→高 | 语义化、Canvas、PWA、Service Worker、CSP |
| 2 | `css3.md` | 🌐 前端基础 | 1,709 | 初→高 | Flex、Grid、动画、容器查询、`:has()`、Houdini |
| 3 | `javascript.md` | 🌐 前端基础 | 2,328 | 初→高 | 闭包、原型链、Promise、EventLoop、手写、V8 |
| 4 | `vue3.md` | ⚡ 框架语言 | 2,694 | 中→高 | 组合式API、Pinia、响应式源码、PatchFlag、SSR |
| 5 | `typescript.md` | ⚡ 框架语言 | 1,948 | 中→高 | 泛型、infer、工具类型、协变逆变、类型体操 |
| 6 | `nodejs.md` | 🛠️ Node后端 | 1,806 | 初→高 | 事件循环6阶段、Stream背压、Cluster、Worker |
| 7 | `express.md` | 🛠️ Node后端 | 1,730 | 初→高 | 中间件链、Router、JWT、SSE、Express 5 |
| 8 | `koa.md` | 🛠️ Node后端 | 1,221 | 初→高 | 洋葱模型、ctx、JWT、compose源码、TS脚手架 |
| 9 | `nestjs.md` | 🛠️ Node后端 | 1,508 | 初→高 | 装饰器、DI、守卫、拦截器、TypeORM、Swagger |
| 10 | `mysql.md` | 🗄️ 数据库缓存 | 1,688 | 初→高 | 索引、事务、InnoDB、MVCC、锁、redo/undo、分库分表 |
| 11 | `mongodb.md` | 🗄️ 数据库缓存 | 1,886 | 初→高 | Mongoose、聚合管道、事务、Change Streams、副本集 |
| 12 | `redis.md` | 🗄️ 数据库缓存 | 1,616 | 初→高 | 5种数据类型、缓存策略三件套、限流、排行榜、哨兵 |
| 13 | `docker.md` | 🐳 DevOps | 1,732 | 初→高 | Dockerfile、多阶段构建、Compose编排、CI/CD |
| 14 | `wxmini.md` | 📱 多端小程序 | 2,055 | 初→高 | 双线程、setData、分包、Skyline、云开发、隐私协议 |
| 15 | `uniapp.md` | 📱 多端小程序 | 1,406 | 初→高 | 条件编译、nvue、renderjs、uni-app x、CI/CD |

> 每份文档结构统一：`## 一、🟢 初级入门` → `## 二、🟡 中级进阶` → `## 三、🔴 高级实战`

---

## 🚀 启动方式

### 方式一：本地服务器（推荐）

项目内置了零依赖的静态服务器 `serve.js`，只需有 Node.js 即可：

```bash
# 克隆 / 进入项目根目录
node serve.js
# ✅ 浏览器打开 http://localhost:5174/
```

也可以用其他工具：

```bash
npx serve .                       # → http://localhost:3000
npx http-server . -p 8080         # → http://localhost:8080
python -m http.server 8080        # → http://localhost:8080  (Python 3)
# VSCode 插件：右键 index.html → Open with Live Server
```

### 方式二：直接双击 `index.html`

> ⚠️ Chrome / Edge 默认阻止 `file://` 协议下的本地 `fetch()`，导致 Markdown 文件加载失败，页面出现「❌ 加载失败」提示。  
> 如遇此问题请改用**方式一**。Firefox 通常允许同目录加载，可以尝试。

---

## 🧭 学习路线

### 推荐学习顺序（全栈偏前端）

```
Week  1-2   HTML5 + CSS3 基础
Week  3-4   JavaScript 入门 → 异步基础
Week  5-6   Vue 3 入门 + TypeScript 基础
Week  7-8   Node.js + Express 入门，写第一个 REST API
Week  9-10  MySQL 基础 CRUD + Mongoose + MongoDB 基础
Week 11-12  Vue 3 中级（Pinia / 组合式API）+ TypeScript 中级
Week 13-14  Koa 或 NestJS 选一个深入，加上 Redis 缓存
Week 15-16  Docker 入门 → Compose 编排全栈项目
Week 17-18  微信小程序 / uni-app（按需选择）
Week 19+    各技术高级章节，结合实战项目深化
```

---

### 🟢 初级阶段（0 → 1，能独立完成前后端分离 CRUD 项目）

| 文档 | 重点章节 |
| --- | --- |
| HTML5 | 标签语义、表单基础、常用 Meta、无障碍 a11y |
| CSS3 | 盒模型、Flexbox 布局、常用单位（rem/vw/rpx） |
| JavaScript | 变量类型、数组/对象方法、DOM 操作、fetch 异步 |
| Vue 3 | 模板语法、指令、v-model、组件通信、Vue Router 基础 |
| TypeScript | 基本类型、interface / type 别名、函数类型、类 |
| Node.js | fs / path / http 模块、CommonJS 模块系统 |
| Express | Hello World、路由、中间件基础、完整 REST API |
| Koa | 洋葱模型、ctx 对象、路由、中间件编写、错误处理 |
| NestJS | CLI 创建项目、Controller / Service / Module、DTO 校验 |
| MySQL | 建库建表、CRUD、WHERE / GROUP BY / JOIN 基础 |
| MongoDB | 文档模型、CRUD 命令、Mongoose Schema + 基础 CRUD |
| Redis | 5种数据类型命令速查、TTL 过期、ioredis 基础连接 |
| Docker | 镜像/容器概念、常用命令、Dockerfile 基础、Compose 入门 |
| 微信小程序 | 页面四件套、生命周期、setData、路由 API |
| uni-app | pages.json、生命周期、条件编译入门、内置组件 |

---

### 🟡 中级阶段（1 → 3 年，能设计后端模块、独立交付多端项目）

| 文档 | 重点章节 |
| --- | --- |
| HTML5 | 语义化布局、表单高级校验、Canvas、Storage、iframe 通信 |
| CSS3 | Grid 布局、响应式设计、CSS 变量、transition / animation |
| JavaScript | 闭包、this/call/apply/bind、原型链、Promise / async-await、事件循环 |
| Vue 3 | 组合式 API、Composables 复用、Pinia 状态管理、性能优化技巧 |
| TypeScript | 泛型、映射类型、keyof / typeof、类型守卫、工具类型（Partial/Pick/Omit） |
| Node.js | 模块系统原理、异步模式、错误处理、常用内置模块 |
| Express | 中间件链路设计、Router 模块化、JWT 鉴权、Cookie/Session |
| Koa | JWT 完整鉴权、路由模块化、统一响应格式、参数校验、安全清单 |
| NestJS | 守卫/拦截器/管道、TypeORM 集成、JWT 完整流程、Swagger 文档 |
| MySQL | 索引原理、事务 ACID、常用函数、备份恢复、慢查询分析 |
| MongoDB | 聚合管道、populate 关联、事务、数据建模（嵌入 vs 引用）、性能优化 |
| Redis | 缓存策略三件套（穿透/击穿/雪崩）、持久化 RDB/AOF、接口限流、排行榜 |
| Docker | 多阶段构建、Volume 与网络、Compose 编排全栈项目（Node+MySQL+Redis） |
| 微信小程序 | 自定义组件、Behaviors、登录鉴权完整流程、分包、微信支付 |
| uni-app | easycom、Pinia 跨端、请求封装、组件库选型、WebSocket 心跳重连 |

---

### 🔴 高级阶段（3 年+，能定位性能瓶颈、参与架构设计）

| 文档 | 重点章节 |
| --- | --- |
| HTML5 | Web Components、Service Worker/PWA、IndexedDB、CSP 安全策略 |
| CSS3 | 容器查询 `@container`、`:has()` 选择器、Houdini API、`@layer` 层叠管理 |
| JavaScript | V8 引擎/GC、Proxy 实现响应式、手写系列（Promise/深拷贝/防抖节流）、内存排查 |
| Vue 3 | 响应式系统源码（track/trigger）、编译优化（PatchFlag/Block Tree）、SSR/SSG |
| TypeScript | 条件类型 + `infer`、协变逆变、装饰器元编程、复杂类型体操 |
| Node.js | 事件循环 6 阶段、Stream 背压与 pipeline、Cluster/Worker 线程、AsyncLocalStorage |
| Express | 中间件链原理（洋葱 compose）、流式上传/SSE、安全清单、Express 5 变化 |
| Koa | compose 函数源码解读、完整 TypeScript 项目脚手架 |
| NestJS | 动态模块、自定义 Provider、微服务（Redis/RabbitMQ/TCP Transport） |
| MySQL | InnoDB 物理结构、MVCC 多版本并发、锁规则、redo/undo/binlog、深分页、分库分表 |
| MongoDB | 副本集选举与故障转移、分片集群设计、WiredTiger 存储引擎调优 |
| Redis | 主从复制原理、哨兵自动故障转移、Cluster 数据分片 |
| Docker | GitHub Actions CI/CD 全流程、多平台镜像构建、安全加固实践 |
| 微信小程序 | Skyline 渲染引擎、setData 深度优化、云开发 CloudBase、隐私合规落地 |
| uni-app | nvue 原生渲染、renderjs 视图层脚本、uni-app x（uts + uvue）、跨端 CI/CD |

---

## 📌 各文档要点速览

<details>
<summary>🌐 前端基础（3份）</summary>

**HTML5**（2,137 行）  
`初级` 标签语义 / 表单与校验 / 多媒体 / a11y  
`中级` Canvas 绘图 / Storage / iframe 通信 / 懒加载  
`高级` Web Components / Service Worker / IndexedDB / CSP / PWA

**CSS3**（1,709 行）  
`初级` 选择器 / 盒模型 / Flexbox / 单位体系  
`中级` Grid / 响应式 / CSS 变量 / transition & animation  
`高级` 容器查询 `@container` / `:has()` / Houdini / `@layer` / 硬件加速

**JavaScript**（2,328 行）  
`初级` 数据类型 / 数组对象方法 / DOM / 异步入门  
`中级` 闭包 / 原型链 / Promise / async-await / 事件循环  
`高级` V8/GC / Proxy 响应式 / 手写系列（Promise/深拷贝等）/ 内存排查

</details>

<details>
<summary>⚡ 框架 & 语言（2份）</summary>

**Vue 3**（2,694 行）  
`初级` 模板语法 / 指令 / 组件通信 / Vue Router 基础  
`中级` 组合式 API / Composables / Pinia / 性能优化 / 单测  
`高级` 响应式系统源码 / 编译优化 PatchFlag / Block Tree / SSR

**TypeScript**（1,948 行）  
`初级` 基本类型 / interface vs type / 函数 / 类  
`中级` 泛型 / 映射类型 / 工具类型 / 类型守卫 / keyof/typeof  
`高级` 条件类型 + infer / 协变逆变 / 装饰器元编程 / 类型体操

</details>

<details>
<summary>🛠️ Node.js 后端（4份）</summary>

**Node.js**（1,806 行）  
`初级` REPL / fs / path / http / CommonJS 模块  
`中级` 模块系统原理 / 异步模式 / 错误处理 / 内置模块全览  
`高级` 事件循环 6 阶段 / Stream 背压 / Cluster/Worker / AsyncLocalStorage

**Express**（1,730 行）  
`初级` Hello World / REST API / 路由 / 中间件基础  
`中级` 中间件模块化 / JWT / Cookie-Session / TypeScript 集成  
`高级` 中间件链原理 / 流式上传/SSE / 安全清单 / Express 5 新特性

**Koa**（1,221 行）  
`初级` 洋葱模型（ASCII图）/ ctx 全解 / 路由 / 中间件编写  
`中级` JWT 完整鉴权 / 路由模块化 / 参数校验 / 安全配置 / MySQL/MongoDB/Redis 集成  
`高级` compose 函数源码解读 / TypeScript 完整项目脚手架

**NestJS**（1,508 行）  
`初级` CLI 快速上手 / Controller / Service / Module / DTO 校验  
`中级` 守卫/拦截器/管道 / TypeORM + Mongoose 集成 / JWT 全流程 / Swagger  
`高级` 动态模块 / 自定义 Provider / 微服务 Transport（Redis/TCP）

</details>

<details>
<summary>🗄️ 数据库 & 缓存（3份）</summary>

**MySQL**（1,688 行）  
`初级` 建库建表 / CRUD / WHERE / JOIN / 多表查询  
`中级` 索引原理（B+Tree）/ 事务 ACID / 常用函数 / 备份恢复  
`高级` InnoDB 物理结构 / MVCC / 锁规则 / redo/undo/binlog / 分库分表

**MongoDB**（1,886 行）  
`初级` 文档模型 / BSON 类型 / CRUD 全解 / Mongoose Schema + Model  
`中级` 聚合管道（$match/$lookup/$group/$facet）/ populate 关联 / 事务 / 性能优化  
`高级` 副本集与故障转移 / 分片集群设计 / WiredTiger 存储引擎

**Redis**（1,616 行）  
`初级` 为什么快（ASCII原理图）/ 5种数据类型命令速查 / ioredis 基础  
`中级` 缓存穿透/击穿/雪崩解决方案 / RDB/AOF 持久化 / 限流（滑动窗口）/ 排行榜  
`高级` 主从复制原理 / 哨兵自动切换 / Cluster 数据分片

</details>

<details>
<summary>🐳 DevOps & 运维（1份）</summary>

**Docker**（1,732 行）  
`初级` 容器 vs 虚拟机（ASCII对比）/ 镜像/容器/仓库概念 / 14条 Dockerfile 指令 / Compose 入门  
`中级` 多阶段构建 / Volume & 网络模式 / Compose 编排（Node+MySQL+Redis 三服务实战）/ 镜像优化 8 条  
`高级` GitHub Actions CI/CD 完整流水线 / 容器安全加固 / 面试高频 10 题

</details>

<details>
<summary>📱 多端 & 小程序（2份）</summary>

**微信小程序**（2,055 行）  
`初级` 双线程架构（ASCII图）/ 页面四件套 / 生命周期 / setData 性能红线  
`中级` 自定义组件全解 / JWT 登录鉴权完整流程 / 微信支付 / 分包优化  
`高级` Skyline 渲染引擎 / 性能优化清单 / 云开发 CloudBase / 隐私协议合规落地（2023强制）

**uni-app**（1,406 行）  
`初级` CLI vs HBuilderX / pages.json / 三种生命周期 / rpx / 条件编译入门  
`中级` easycom / Pinia 跨端持久化 / 请求封装（401刷新）/ WebSocket 心跳重连  
`高级` 条件编译深入 / nvue 原生渲染 / renderjs 视图层脚本 / uni-app x（uts+uvue）/ CI/CD 五端自动发布

</details>

---

## 🛠 自定义与扩展

### 三段式结构说明

所有文档均遵循以下结构，**写新文档时建议保持一致**：

```md
# XXX 全阶段学习手册

## 目录
（二级章节列表）

---

## 一、🟢 初级入门

### <span class="lv lv-1">初级</span> 1.1 概念介绍

### <span class="lv lv-1">初级</span> 1.2 安装与配置
...

---

## 二、🟡 中级进阶

### <span class="lv lv-2">中级</span> 2.1 核心特性
...

---

## 三、🔴 高级实战

### <span class="lv lv-3">高级</span> 3.1 原理深度
...
```

难度徽章样式（阅读器已内置 CSS）：

| 代码 | 渲染效果 | 使用场景 |
| --- | --- | --- |
| `<span class="lv lv-1">初级</span>` | 🟢 绿色胶囊 | 入门概念、基础语法 |
| `<span class="lv lv-2">中级</span>` | 🔵 蓝色胶囊 | 实战技巧、模式设计 |
| `<span class="lv lv-3">高级</span>` | 🔴 粉色胶囊 | 原理源码、性能调优 |

---

### 添加新文档

**第一步：** 在 `docs/` 下新建 `xxx.md`，按三段式结构编写。

**第二步：** 编辑 `index.html`，在 `GROUPS` 数组的对应分组里追加一条记录：

```js
// index.html 第 ~402 行 GROUPS 数组
{
  title: '🗄️ 数据库 & 缓存',
  docs: [
    { id: 'mysql',   file: 'docs/mysql.md',   label: 'MySQL',   icon: 'M',  meta: '入门 → InnoDB / MVCC / 调优' },
    { id: 'mongodb', file: 'docs/mongodb.md', label: 'MongoDB', icon: '🍃', meta: '文档模型 / Mongoose / 聚合管道' },
    { id: 'redis',   file: 'docs/redis.md',   label: 'Redis',   icon: 'R',  meta: '5种数据类型 / 缓存策略 / 限流' },
    // ↓ 新增示例
    { id: 'elasticsearch', file: 'docs/elasticsearch.md', label: 'Elasticsearch', icon: 'ES', meta: '全文搜索 / 倒排索引' },
  ],
},
```

字段说明：

| 字段 | 说明 |
| --- | --- |
| `id` | 唯一标识，同时是 URL hash（`#/xxx`） |
| `file` | Markdown 文件相对路径 |
| `label` | 侧栏显示名称 |
| `icon` | 侧栏图标（1-2个字符或 emoji） |
| `meta` | 侧栏副标题（简短描述核心内容） |

---

### 离线 CDN（完全脱网使用）

如需在完全无网络环境下使用，把以下 3 个文件下载到本地后修改 `index.html` 中的路径：

```bash
# 下载到 vendor/ 目录
mkdir -p vendor
curl -sLo vendor/marked.min.js        https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js
curl -sLo vendor/highlight.min.js     https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/highlight.min.js
curl -sLo vendor/github-dark.min.css  https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css
```

然后将 `index.html` 中对应 CDN 地址改为 `vendor/xxx` 相对路径即可。

---

## 🌐 发布到 GitHub Pages

仓库已内置 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)，推送 `main` 分支后**自动触发部署**，无需任何额外配置。

### 操作步骤

**1. 推送代码到 GitHub：**

```bash
git init
git add .
git commit -m "init: v3tsnode 知识库"
git branch -M main
git remote add origin https://github.com/<你的用户名>/v3tsnode.git
git push -u origin main
```

**2. 开启 GitHub Pages：**

进入仓库 → **Settings → Pages → Build and deployment → Source**，选择 **`GitHub Actions`**（不要选 `Deploy from a branch`）。

**3. 等待部署完成：**

- 仓库 **Actions** 标签页查看实时进度
- 成功后访问 `https://<你的用户名>.github.io/v3tsnode/`

### Workflow 流程说明

```
push main
    │
    ▼ build job
    ├─ actions/checkout@v4       # 拉取代码
    ├─ Assemble static site      # 复制 index.html + docs/ + README.md → dist/
    ├─ touch dist/.nojekyll      # 防止 GitHub Pages 走 Jekyll 处理
    ├─ actions/configure-pages@v5
    └─ actions/upload-pages-artifact@v3  # 上传产物
    │
    ▼ deploy job（needs: build）
    └─ actions/deploy-pages@v4   # 部署到 Pages 环境
```

> 不需要 `npm install` / 编译——marked 和 highlight.js 走 CDN，仅静态文件复制，约 **10 秒**完成部署。

### 自定义域名

在 workflow 的「Assemble static site」步骤中添加一行：

```yaml
echo "your-domain.com" > dist/CNAME
```

---

## 📜 License

仅供个人学习参考，引用资料归原作者所有。
