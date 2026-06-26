# v3tsnode · 中高级技术知识库

> 面向**中高级**开发者的本地离线学习手册，覆盖 **Vue 3 / TypeScript / Node.js / Express / MySQL** 五大核心栈，含原理深挖、性能优化、工程实践与高频面试题。

## 📂 目录结构

```
v3tsnode/
├─ index.html          # 浏览器阅读入口（左侧导航 + 右侧大纲 + 全文搜索）
├─ serve.js            # 零依赖本地静态服务器（避开 file:// 限制）
├─ package.json
├─ README.md
└─ docs/
   ├─ vue3.md          # Vue 3 中高级
   ├─ typescript.md    # TypeScript 中高级
   ├─ nodejs.md        # Node.js 中高级
   ├─ express.md       # Express 中高级
   └─ mysql.md         # MySQL 中高级
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

- **左侧文档列表**：5 份技术文档一键切换
- **右侧大纲 (TOC)**：H2/H3/H4 自动生成，滚动联动高亮
- **顶部搜索**：全文实时高亮 + 自动滚动到首个命中
- **代码块**：highlight.js 着色 + 一键复制
- **响应式**：窄屏自动收起 TOC / 侧栏
- **顶部进度条**：阅读位置可视化
- **深色模式**：跟随系统 `prefers-color-scheme`
- **纯前端、零依赖、可离线**：marked + highlight.js 走 jsDelivr CDN

## 🧭 推荐学习路线

| 阶段 | 重点 |
| --- | --- |
| 入门 → 中级 | TS 类型基础 → Vue 3 组合式 → Node 模块/异步 → Express 中间件 → MySQL 索引 |
| 中级 → 高级 | TS 条件类型/infer → Vue 编译/响应式源码 → Node 事件循环/流/Worker → Express 错误模型/安全 → MySQL MVCC/锁/调优 |
| 高级冲刺 | 类型体操、Vapor Mode、Stream backpressure、可观测性、分库分表 / 主从一致性 |

## 📌 文档要点速览

- **Vue 3**：响应式原理、PatchFlag/BlockTree、Composables 设计、Pinia、Router 4、SSR、性能优化、面试题
- **TypeScript**：泛型/约束、条件/分布式、映射/Key Remapping、infer/递归、协逆变、装饰器 (Stage 3)、tsconfig、类型体操
- **Node.js**：事件循环 6 阶段、CJS/ESM 互操作、Stream 背压、Cluster vs Worker、AsyncLocalStorage、性能诊断、安全清单
- **Express**：中间件链原理、Router/param、错误中间件、Cookie/Session/JWT、流式上传/SSE、TS 集成、Express 5 变更
- **MySQL**：InnoDB 物理结构、B+Tree/索引下推/失效、MVCC ReadView、锁规则、redo/undo/binlog 两阶段提交、深分页、分库分表

## 🛠 自定义与扩展

### 添加新文档

1. 在 `docs/` 下新增 `xxx.md`；
2. 编辑 `index.html`，在 `DOCS` 数组添加：

```js
const DOCS = [
  // ...
  { id: 'redis', file: 'docs/redis.md', label: 'Redis', icon: 'R', meta: '数据结构 / 持久化' },
]
```

### 离线 CDN

如需完全离线，下载以下两个文件到本地，把 `<script>` / `<link>` 改为相对路径即可：

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
