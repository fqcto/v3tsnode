# v3tsnode · 初 → 中 → 高 全阶段技术知识库

> 一份**面向初级、中级、高级开发者**的本地离线学习手册。
> 覆盖 **前端基础（HTML5 / CSS3 / JavaScript）→ 框架与语言（Vue 3 / TypeScript）→ 后端与数据库（Node.js / Express / MySQL）→ 多端与小程序（微信小程序原生 / uni-app）** 共 **10 份**核心文档。
> 每份文档统一使用 `🟢 初级入门 → 🟡 中级进阶 → 🔴 高级实战` 三段式结构，章节标题带**难度徽章**，代码可直接复制运行。

## 📂 目录结构

```
v3tsnode/
├─ index.html          # 浏览器阅读入口（分组侧栏 + 大纲联动 + 全文搜索 + 难度徽章）
├─ serve.js            # 零依赖本地静态服务器
├─ package.json
├─ README.md
└─ docs/
   # 🌐 前端基础（初 → 高）
   ├─ html5.md          # HTML5：语义化 / 表单 / 多媒体 / Web Components / PWA
   ├─ css3.md           # CSS3：盒模型 / Flex / Grid / 动画 / 容器查询 / :has() / Houdini
   ├─ javascript.md     # JS：语法 / 原型 / 异步 / EventLoop / 手写系列 / V8
   # ⚡ 框架 & 语言（中 → 高）
   ├─ vue3.md           # Vue 3：入门 → 响应式源码 / 编译优化 / Pinia / SSR
   ├─ typescript.md     # TypeScript：入门 → 泛型 / infer / 类型体操
   # 🛠️ 后端 & 数据库
   ├─ nodejs.md         # Node.js：入门 → 事件循环 / 流 / Worker / 性能
   ├─ express.md        # Express：入门 → 中间件 / 安全 / SSE / TS 集成
   ├─ mysql.md          # MySQL：CRUD → InnoDB / MVCC / 锁 / 调优 / 分库分表
   # 📱 多端 & 小程序
   ├─ wxmini.md         # 微信小程序原生：入门 → 分包 / Skyline / 云开发 / 性能
   └─ uniapp.md         # uni-app 多端：入门 → 条件编译 / nvue / renderjs / uni-app x
```

## 🚀 启动方式

### 方式一：本地服务器（推荐）

```bash
# 项目根目录
node serve.js
# → 浏览器打开 http://localhost:5174/
```

也可以用其它静态服务：

```bash
npx serve .                     # http://localhost:3000
python -m http.server 8080      # http://localhost:8080
# VSCode 插件 "Live Server" 右键 index.html → Open with Live Server
```

### 方式二：直接双击 `index.html`

> ⚠️ Chrome / Edge 默认会阻止 `file://` 协议下的本地 `fetch`，导致 md 加载失败。
> 如果出现「加载失败」提示，请改用方式一。Firefox 通常允许同目录加载，可以尝试。

## ✨ 阅读器特性

- **左侧分组侧栏**：4 大分类（前端基础 / 框架语言 / 后端数据库 / 多端小程序）10 份文档一键切换
- **右侧大纲 (TOC)**：H2/H3/H4 自动生成，滚动联动高亮
- **顶部搜索**：全文实时高亮 + 自动滚动到首个命中
- **难度徽章**：每个 H3 章节标题左侧渲染 `🟢 初级 / 🔵 中级 / 🔴 高级` 彩色胶囊
- **代码块**：highlight.js 着色 + 一键复制
- **响应式**：窄屏自动收起 TOC / 侧栏
- **顶部进度条**：阅读位置可视化
- **深色模式**：跟随系统 `prefers-color-scheme`
- **纯前端、零依赖、可离线**：marked + highlight.js 走 jsDelivr CDN

## 🧭 三阶段学习路线

### 🟢 初级（0 → 1，能独立写基础 CRUD 页面）
| 主题 | 关键点 |
| --- | --- |
| HTML5 | 标签基础、表单、a11y、Meta |
| CSS3 | 选择器、盒模型、Flex 基础、单位 |
| JavaScript | 变量、类型、数组/对象方法、DOM、异步入门 |
| Vue 3 | 模板语法、指令、v-model、组件通信、Router 基础 |
| TypeScript | 基本类型、interface / type、函数、类 |
| Node.js | REPL、fs、path、http、CommonJS |
| Express | Hello World、路由、中间件基础、REST 案例 |
| MySQL | 数据库/表操作、CRUD、WHERE/GROUP BY、JOIN 入门 |
| 微信小程序 | 页面结构、生命周期、setData、路由、常用组件 |
| uni-app | pages.json、生命周期、条件编译、组件 |

### 🟡 中级（1 → 3 年，能架构模块、独立带项目）
| 主题 | 关键点 |
| --- | --- |
| HTML5 | 语义化、表单校验、Storage、Canvas、iframe 通信 |
| CSS3 | Grid / 响应式 / 变换动画 / transition / 过渡 |
| JavaScript | 闭包、this、原型链、Promise / async、事件循环 |
| Vue 3 | 组合式 API、Composables、Pinia、性能优化、单测 |
| TypeScript | 泛型、映射类型、keyof / typeof、类型守卫、工具类型 |
| Node.js | 模块系统、异步、错误处理、常用核心模块 |
| Express | 中间件、Router、Cookie/Session/JWT、TS 集成 |
| MySQL | 索引原理、事务、常用函数、备份恢复 |
| 微信小程序 | 自定义组件、Behaviors、登录鉴权、分包、支付 |
| uni-app | easycom、Pinia、请求封装、组件库选型、WebSocket |

### 🔴 高级（3 年+，能定位性能瓶颈、参与架构设计）
| 主题 | 关键点 |
| --- | --- |
| HTML5 | Web Components、Service Worker、IndexedDB、CSP |
| CSS3 | 容器查询、`:has()`、Houdini、`@layer`、硬件加速 |
| JavaScript | V8/GC、Proxy 响应式、手写系列、内存排查 |
| Vue 3 | 响应式源码、编译优化（PatchFlag / Block Tree）、SSR |
| TypeScript | 条件类型 + `infer`、协变逆变、装饰器、类型体操 |
| Node.js | 事件循环 6 阶段、Stream 背压、Cluster/Worker、AsyncLocalStorage |
| Express | 中间件链原理、错误模型、流式上传/SSE、Express 5 变更 |
| MySQL | InnoDB 物理结构、MVCC、锁规则、redo/undo/binlog、深分页、分库分表 |
| 微信小程序 | Skyline、性能优化、云开发、setData 深度优化 |
| uni-app | nvue / renderjs / uni-app x、平台差异陷阱、CI/CD |

## 📌 文档要点速览

- **HTML5**：标签基础 → 语义化 & 表单校验 → Web Components / PWA / Service Worker / 安全 CSP
- **CSS3**：选择器盒模型 → Flex/Grid/响应式 → 容器查询 `@container` / `:has()` / Houdini / 硬件加速
- **JavaScript**：类型/语法 → 原型/闭包/异步/事件循环 → V8/手写系列/内存排查/Web APIs
- **Vue 3**：模板/指令/组件 → 组合式 API / Pinia / Router / 性能 → 响应式源码 / PatchFlag / SSR
- **TypeScript**：基本类型/interface → 泛型/工具类型/守卫 → 条件类型/infer/协变逆变/类型体操
- **Node.js**：fs/http/CJS → 模块系统/异步/常用模块 → 事件循环 6 阶段 / 流背压 / Worker / 可观测性
- **Express**：Hello World / REST → 中间件 / JWT / TS → 中间件链原理 / SSE / 安全清单 / Express 5
- **MySQL**：CRUD / JOIN → 索引 / 事务 → InnoDB / MVCC / 锁 / redo/undo/binlog / 分库分表
- **微信小程序**：结构 / 生命周期 → 组件 / 登录 / 分包 → Skyline / 性能 / 云开发 / 面试题
- **uni-app**：跨端结构 / 生命周期 → easycom / Pinia / 请求封装 → 条件编译 / nvue / renderjs / uni-app x

## 🛠 自定义与扩展

### 添加新文档

1. 在 `docs/` 下新增 `xxx.md`（建议同样按 `## 一、🟢 初级入门` / `## 二、🟡 中级进阶` / `## 三、🔴 高级实战` 三段式）；
2. 编辑 `index.html`，在 `GROUPS` 数组对应分组下添加一条：

```js
const GROUPS = [
  // ...
  {
    title: '🌐 前端基础（初 → 高）',
    docs: [
      // ...
      { id: 'redis', file: 'docs/redis.md', label: 'Redis', icon: 'R', meta: '数据结构 / 持久化' },
    ],
  },
]
```

### 难度徽章

在 Markdown 里给章节标题加内联徽章（阅读器已经内置样式）：

```md
### <span class="lv lv-1">初级</span> 1.1 XX 是什么
### <span class="lv lv-2">中级</span> 2.3 XX 深入
### <span class="lv lv-3">高级</span> 3.7 XX 源码剖析
```

### 离线 CDN

如需完全离线，下载以下三个文件到本地，把 `<script>` / `<link>` 改为相对路径即可：

- `https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js`
- `https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/highlight.min.js`
- `https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css`

## 🚀 一键发布到 GitHub Pages

仓库内已带 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)，推送即自动部署。

### 步骤

1. **新建仓库**（例如 `v3tsnode`）并推送代码：

   ```bash
   git init
   git add .
   git commit -m "init: v3tsnode 知识库"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/v3tsnode.git
   git push -u origin main
   ```

2. **GitHub 仓库 → Settings → Pages**：
   - **Build and deployment / Source** 选择 `GitHub Actions`（不要选 `Deploy from a branch`）。

3. 推送 `main` 分支后会自动触发 Actions：
   - **Actions** 标签页查看进度；
   - 成功后访问 `https://<你的用户名>.github.io/v3tsnode/`。

### Workflow 做了什么

- 不需要 `npm install` / 编译（marked、highlight.js 走 CDN）；
- 仅把 `index.html` + `docs/` + `README.md` 复制到 `dist/`；
- 加 `.nojekyll` 防止 Pages 走 Jekyll；
- 通过 `actions/upload-pages-artifact` + `actions/deploy-pages` 完成部署（官方推荐方式，无需 `gh-pages` 分支）。

### 自定义域名

把域名 CNAME 文件放到 `dist/` 即可，在 workflow 的 `Assemble static site` 步骤添加：

```yaml
echo "docs.example.com" > dist/CNAME
```

### 完全离线版本（可选）

CI 阶段把 marked / highlight.js 也下载到本地，再改 `index.html` 的 `<script src>` 为相对路径，可彻底脱离 CDN：

```yaml
- name: Vendor CDN libs
  run: |
    mkdir -p dist/vendor
    curl -sLo dist/vendor/marked.min.js https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js
    curl -sLo dist/vendor/highlight.min.js https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/highlight.min.js
    curl -sLo dist/vendor/github-dark.min.css https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css
    sed -i 's|https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js|vendor/marked.min.js|' dist/index.html
    sed -i 's|https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/highlight.min.js|vendor/highlight.min.js|' dist/index.html
    sed -i 's|https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css|vendor/github-dark.min.css|' dist/index.html
```

## 📜 License

仅供个人学习参考，引用资料归原作者所有。
