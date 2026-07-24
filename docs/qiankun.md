# qiankun · Vue3 + ElementPlus + Vite 微前端学习项目

> 一个用于学习微前端的完整 Demo：主应用 + 多个独立子应用，通过 qiankun 注册加载，登录态（token / userInfo）通过全局状态在主子应用间共享。本文从概念到原理再到实战，系统归纳 qiankun 微前端核心知识。

---

## 一、🟢 初级入门

### 1.1 什么是微前端

将一个庞大的单体前端应用拆分为多个**可独立开发、独立测试、独立部署、独立运行**的小应用，再由一个容器（主应用）按需集成运行。类比后端的微服务。

核心目标：**技术栈无关、独立开发部署、增量升级、运行时集成、隔离与通信**。

### 1.2 为什么需要微前端

| 痛点 | 微前端解决方式 |
| --- | --- |
| 单体应用体积膨胀、构建慢 | 拆分后各子应用独立构建，构建时间从小时级降到分钟级 |
| 跨团队/跨技术栈协作困难 | 各子应用可用不同框架（Vue/React/历史 jQuery） |
| 老系统渐进式重构 | 老应用作为子应用接入，新模块用新技术栈，逐步替换 |
| 多业务线复用同一壳 | 主应用统一布局/登录/权限，业务线只关心业务子应用 |
| 独立发布节奏 | 子应用独立 CI/CD，不影响主应用发版 |

### 1.3 微前端 vs 微服务

思想类似（拆分+独立+集成），但微服务在后端按进程/网络隔离，微前端在前端浏览器内集成，要额外解决 **JS/CSS/路由隔离、资源加载、运行时通信** 等前端特有问题。

### 1.4 主流方案对比

| 方案 | 集成方式 | 隔离 | 路由 | 优点 | 缺点 |
| --- | --- | --- | --- | --- | --- |
| **iframe** | 运行时嵌入 | 天然完全隔离（JS/CSS/路由） | 独立 | 最简单、最安全、可接任意应用 | 性能差、通信难、UI 割裂（弹窗无法全屏）、history 破坏 |
| **NPM 包** | 构建时引入 | 无 | 需统一 | 复用简单 | 发布耦合、版本难管、无运行时隔离 |
| **Web Components** | 自定义元素 | Shadow DOM 隔离 CSS | 需处理 | 标准化、框架无关 | 生态弱、JS 隔离需自行实现 |
| **Module Federation（Webpack5 / Vite 插件）** | 构建时 + 运行时 | 弱 | 需协调 | 原生支持代码共享、HMR 友好 | 强依赖构建工具、跨框架支持有限 |
| **qiankun（基于 single-spa）** | 运行时 import-entry | JS 沙箱 + 样式隔离 | activeRule | 接入成本低、生态成熟、生产可用 | Vite 支持需插件、多实例场景有坑 |

> 本项目选 qiankun：成熟、社区大、对老应用接入友好，适合学习微前端核心思想。

### 1.5 qiankun 与 single-spa 的关系

qiankun 是 [single-spa](https://single-spa.js.org/) 的上层封装：

- single-spa 只解决「子应用加载与生命周期调度」，**不处理隔离**（JS/CSS 都裸奔）。
- qiankun 在其之上补充了 **import-html-entry（HTML/JS/CSS 抓取与执行）** + **JS 沙箱（Proxy/快照）** + **样式隔离** + **全局状态通信** + **预加载**，开箱即用。

### 1.6 项目架构

```
vue_qiankun/
├── main-layout/      # 主应用（布局/登录/菜单 + 子应用容器）  dev:8000
├── sub-purchase/     # 采购子应用（独立 Vue 项目）          dev:8001
├── sub-warehouse/    # 仓库子应用（独立 Vue 项目）          dev:8002
├── sub-sales/        # 销售子应用（独立 Vue 项目）          dev:8003
└── README.md
```

每个 `sub-*` 都是**完全独立的 Vue 项目**（各自 package.json / node_modules / dev server / git 分支），可单独 clone 开发；主应用 `main-layout` 负责整体壳子（Layout + 登录 + 菜单 + 子应用挂载点）。

| 项目 | 角色 | 端口 | qiankun name | 激活规则 activeRule |
| --- | --- | --- | --- | --- |
| main-layout | 主应用 (container) | 8000 | — | — |
| sub-purchase | 子应用 | 8001 | purchase | /purchase |
| sub-warehouse | 子应用 | 8002 | warehouse | /warehouse |
| sub-sales | 子应用 | 8003 | sales | /sales |

### 1.7 主应用 / 子应用

- **主应用（base / container）**：整个微前端的壳，承载布局、登录、菜单，负责注册并加载子应用。本项目中是 `main-layout`。
- **子应用（micro app）**：被主应用按需加载的独立前端应用，本质是「一段入口 HTML + JS + CSS」，由 qiankun 通过 `import-entry-html` 抓取并执行。本项目中是 `sub-purchase / sub-warehouse / sub-sales`。
- **关键区别**：主应用安装 `qiankun` 包并调用 `registerMicroApps / start`；子应用**不安装** qiankun，只导出三个生命周期函数，由 qiankun 调用。

### 1.8 子应用生命周期（必须导出）

qiankun 要求子应用在全局暴露 `bootstrap / mount / unmount`（`update` 可选）：

| 生命周期 | 调用时机 | 职责 |
| --- | --- | --- |
| `bootstrap(props)` | 子应用首次加载，全局只调一次 | 做一次性初始化（如全局变量、SDK） |
| `mount(props)` | activeRule 命中、每次切入时 | 创建 Vue 实例并挂载到 container |
| `unmount(props)` | 切走子应用时 | **必须 `app.unmount()` 销毁实例**，避免重复挂载与内存泄漏 |
| `update(props)` | 子应用 props 变化（可选，少用） | 响应 props 变更 |

本项目用 `vite-plugin-qiankun` 的 `renderWithQiankun` 自动导出这些生命周期（见各子应用 `src/main.js`）。

### 1.9 激活规则 activeRule

qiankun 监听浏览器 URL，当 url 命中某子应用的 `activeRule` 时加载该子应用、卸载其他子应用。本项目用最简单的**路径前缀匹配**：

- url 为 `/purchase/...` → 加载 `purchase`
- url 为 `/warehouse/...` → 加载 `warehouse`
- url 为 `/sales/...` → 加载 `sales`

> 主应用路由对 `/purchase/*` 只挂一个空容器组件 `MicroContainer.vue`（内含 `<div id="subapp-viewport">`），真正内容由 qiankun 注入。

### 1.10 container 挂载点

`container: '#subapp-viewport'` 表示子应用会被渲染进主应用 Layout 内容区的 `<div id="subapp-viewport">`。子应用内部根节点仍叫 `#app`，二者不冲突：主应用 `#app` 是主应用自己挂载点，`#subapp-viewport` 是子应用容器，子应用在容器内查 `#app`。

### 1.11 快速启动

> Node ≥ 18，包管理器用 npm（每个目录独立 install）。

**方式一：一键启动（推荐）**

根目录提供了聚合脚本，一条命令同时拉起主应用 + 三个子应用，日志带颜色前缀聚合到一个终端：

```bash
# 1. 安装根工程工具（仅 concurrently）
npm install

# 2. 安装全部子项目依赖（串行）
npm run install:all

# 3. 一键启动 4 个 dev server
npm run dev          # 或 npm start
```

启动后访问 http://localhost:8000 即可。`Ctrl+C` 一次停止全部。

> Windows 无需安装 concurrently 时，也可双击 `start.bat`：会在 4 个独立 cmd 窗口分别启动各项目，关窗即停。

**方式二：分终端手动启动**

分别打开 4 个终端：

```bash
# 终端1：主应用
cd main-layout && npm install && npm run dev     # http://localhost:8000

# 终端2/3/4：三个子应用
cd sub-purchase  && npm install && npm run dev   # http://localhost:8001
cd sub-warehouse && npm install && npm run dev   # http://localhost:8002
cd sub-sales      && npm install && npm run dev   # http://localhost:8003
```

访问 http://localhost:8000 ，未登录会跳 `/login`，登录后从侧边栏切换采购/仓库/销售，观察子应用加载与全局状态打通。

> 子应用必须全部 dev 起来，主应用才能 fetch 到对应 `//localhost:80xx` 入口；单独访问子应用地址也能独立运行。

### 1.12 验证清单

1. 访问 `http://localhost:8000` → 无 token，跳 `/login`
2. 登录后进入 Layout，顶栏显示当前用户名
3. 点侧边栏「采购」→ `/purchase`，qiankun 加载 sub-purchase，子应用首页显示主应用下发的 token / userInfo（**状态打通**）
4. 子应用内点「采购订单」→ 子应用内部路由 `/purchase/orders` 正常切换
5. 切「仓库」「销售」同理，各自独立子应用渲染
6. 顶栏「退出登录」→ globalState 清空 → 跳 `/login`
7. 直接访问 `http://localhost:8001`（子应用独立运行）也能正常渲染（**子应用可独立开发**）

---

## 二、🟡 中级进阶

### 2.1 Vite 接入方案：vite-plugin-qiankun

qiankun 官方基于 webpack 的 `import-entry-html` 方案，对 Vite 的 ESM 产物天然不兼容。`vite-plugin-qiankun` 解决了三件事：

1. **动态 publicPath**：注入运行时 publicPath，让子应用资源在主应用域名下也能正确加载（替代手写 `__webpack_public_path__` / `public-path.js`）。
2. **导出生命周期**：把 `bootstrap/mount/unmount` 挂到 qiankun 全局对象上，主应用才能拿到。
3. **开发模式兼容**：`useDevMode: true` 让 Vite dev server 的 HMR / ESM 与 qiankun 共存。

子应用 `vite.config.js` 关键配置：

```js
import qiankun from 'vite-plugin-qiankun'

export default defineConfig({
  plugins: [vue(), qiankun('purchase', { useDevMode: true })], // name 必须与主应用注册名一致
  server: { port: 8001, cors: true, origin: 'http://localhost:8001' } // cors + origin 必须开
})
```

- `cors: true`：主应用跨域 fetch 子应用入口 HTML / JS。
- `origin`：让 dev server 返回绝对地址资源，避免主应用加载相对路径 404。

子应用 `main.js` 用 `renderWithQiankun` 导出生命周期，并用 `qiankunWindow.__POWERED_BY_QIANKUN__` 判断是否独立运行：

```js
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/es/helper'

if (!qiankunWindow.__POWERED_BY_QIANKUN__) render()  // 独立运行
renderWithQiankun({ bootstrap, mount, unmount, update })  // qiankun 运行
```

### 2.2 全局状态通信（initGlobalState）

本项目登录态共享方案：主应用用 `initGlobalState` 创建全局状态，子应用通过 mount `props` 订阅 / 修改。

**三个核心 API**

| API | 调用方 | 作用 |
| --- | --- | --- |
| `initGlobalState(state)` | 主应用 | 创建全局状态容器，返回 actions |
| `actions.onGlobalStateChange(cb, immediate)` | 主/子 | 订阅状态变更；`immediate=true` 立即触发一次拿当前值 |
| `actions.setGlobalState(next)` | 主应用 | 修改全局状态并广播 |
| `props.setGlobalState(next)` | 子应用 | 子应用回写（qiankun 会转发给主应用 actions） |
| `actions.getGlobalState()` | 主应用 | 读取当前快照（本项目路由守卫读 token） |

**状态打通时序**

```
1. 用户在主应用 Login.vue 提交
   → actions.setGlobalState({ token, userInfo })
2. qiankun 把 globalState 通过 mount props 下发给当前激活子应用
3. 子应用 mount 中 props.onGlobalStateChange(cb, true)
   → 拿到 token/userInfo，写入本地 reactive（store/global.js 的 localState）
4. 子应用若需回写 → props.setGlobalState({ userInfo }) → 主应用 onGlobalStateChange 同步
5. 主应用路由守卫读 actions.getGlobalState().token 做鉴权
```

**关键代码**

主应用 `main-layout/src/micro/globalState.js`：

```js
import { initGlobalState } from 'qiankun'
const actions = initGlobalState({ token: '', userInfo: null })
export default actions
export const getToken = () => actions.getGlobalState().token
```

子应用 `sub-purchase/src/store/global.js`（mount 时注入）：

```js
export function bindGlobalState(props) {
  props.onGlobalStateChange((state) => {
    if (state.token !== undefined) localState.token = state.token
    if (state.userInfo !== undefined) localState.userInfo = state.userInfo
  }, true) // 立即拿一次当前值
}
```

> 注意：qiankun 的 globalState 是「扁平通知」，适合登录态等少量共享数据；大量业务数据不要走它，应通过接口各自请求。

### 2.3 隔离机制

#### 2.3.1 JS 沙箱（sandbox）

qiankun 默认开启 JS 沙箱，隔离子应用对 `window` 的污染：

- **Legacy（快照沙箱）**：不支持 Proxy 的老浏览器降级用，切走时恢复 window 快照。
- **Proxy 沙箱（默认）**：每个子应用一个 Proxy 代理 window，互不污染。
- `singular`（默认 true）：同一时刻只激活一个子应用；多实例场景设 `singular: false`。

本项目 `start({ sandbox: { experimentalStyleIsolation: true } })`。

#### 2.3.2 样式隔离（experimentalStyleIsolation）

- `experimentalStyleIsolation: true`：给子应用所有样式加 `div[data-qiankun]` 前缀作用域，避免主子样式互相覆盖。
- 代价：子应用内动态插入到 `body` 的弹层（如 ElementPlus 的 `el-message`、`el-dialog` 默认 append-to-body）不会被加前缀，可能样式丢失。

> 如遇子应用弹窗样式丢失，可配置组件 `:append-to="子应用根选择器"` 或临时关闭样式隔离测试。

#### 2.3.3 路由隔离

子应用 `createWebHistory` 的 base 必须与主应用 activeRule 对应：

```js
const isQiankun = !!qiankunWindow.__POWERED_BY_QIANKUN__
createWebHistory(isQiankun ? '/purchase/' : '/')
```

- qiankun 模式下 base = `/purchase/`，子应用内部路由 `/purchase/orders` 才能与主应用 url 同步。
- 独立运行时 base = `/`，可直接访问。

### 2.4 预加载 prefetch

`start({ prefetch: true })` 会在空闲时预加载未激活子应用资源，加速首次切换。本项目学习用设 `false`，便于观察首次加载过程。

### 2.5 部署注意

1. **子应用 entry 地址**：生产环境 `entry` 改为子应用部署后的 URL（如 `https://app.example.com/purchase/`）。
2. **CORS**：子应用服务器需允许主应用域名跨域（响应 `Access-Control-Allow-Origin`）。
3. **静态资源路径**：子应用打包后资源路径需正确，`vite-plugin-qiankun` 已处理动态 publicPath；若用 webpack 子应用需配 `public-path.js` + `__webpack_public_path__`。
4. **history 路由 404**：子应用单独部署时刷新会 404，nginx 需 `try_files $uri $uri/ /index.html`。
5. **base path**：子应用部署在子路径下时，`vite base` 与路由 base 要一致。

### 2.6 常见坑速查

| 现象 | 原因 | 解决 |
| --- | --- | --- |
| 子应用不加载 / 404 | name 不一致 / 子应用未启动 / cors 未开 | 三处 name 对齐；子应用 dev 起来；`server.cors=true, origin=...` |
| 切走再切回报「已挂载」 | unmount 未销毁实例 | `unmount` 内 `app.unmount(); app=null` |
| 子应用样式污染主应用 | 未开样式隔离 | `start({ sandbox:{ experimentalStyleIsolation:true }})` |
| 子应用弹窗（el-dialog）样式丢失 | 弹层 append-to-body 不在样式隔离作用域 | 组件 `:append-to="子应用根选择器"` 或临时关闭隔离测试 |
| 子应用内部路由跳转 404 | 路由 base 与 activeRule 不匹配 | qiankun 下 `createWebHistory('/purchase/')` |
| 直接访问子应用白屏 | 独立运行判断缺失 | `if(!qiankunWindow.__POWERED_BY_QIANKUN__) render()` |
| 主应用刷新丢登录态 | globalState 不持久化（刷新清空） | 本项目为学习演示不持久化；生产可结合 localStorage + 主应用初始化时 setGlobalState |
| 多次 mount 后事件重复绑定 | onGlobalStateChange 在每次 mount 重复注册 | 一般无大碍；如需精确，可用标志位避免重复绑定 |

### 2.7 各模块独立开发协作流程

1. 每个子应用是独立目录/独立 git 仓库（或本仓库的独立分支），开发者只拉所需子应用。
2. 本地：进入对应 `sub-xxx`，`npm install && npm run dev` 独立开发调试（不依赖主应用）。
3. 子应用独立运行时，无主应用 globalState 下发，token/userInfo 为空——如需调试登录态，可在子应用本地 mock `localState`。
4. 联调：主应用 + 各子应用 dev 都启动，主应用侧边栏切换进入子应用。
5. 上线：主应用部署 + 各子应用独立部署，主应用注册表 `entry` 指向子应用生产地址。

### 2.8 本项目文件速查

**主应用 main-layout**

- `src/micro/apps.js` — 子应用注册表（name / entry / activeRule / container）
- `src/micro/globalState.js` — initGlobalState 全局状态
- `src/micro/index.js` — registerMicroApps + start
- `src/router/index.js` — 主路由 + 登录守卫
- `src/layout/index.vue` — 布局（侧边栏 + 顶栏 + `#subapp-viewport`）
- `src/views/Login.vue` — mock 登录页（写 globalState）
- `src/views/MicroContainer.vue` — 子应用挂载点占位

**子应用（以 sub-purchase 为例，其余结构一致）**

- `vite.config.js` — qiankun 插件 + cors
- `src/main.js` — renderWithQiankun 导出生命周期 + 独立运行判断
- `src/store/global.js` — 订阅主应用 globalState 到 localState
- `src/router/index.js` — 路由 base 随 qiankun 模式切换

---

## 三、🔴 高级实战

### 3.1 qiankun 原理深入

#### 3.1.1 子应用加载流程（import-html-entry）

主应用 `start()` 后，qiankun 监听 URL，命中 activeRule 时：

```
1. fetch 子应用 entry URL → 拿到 HTML 字符串
2. 解析 HTML：提取 <script> / <style> / <link> 资源
3. 并发请求所有内联/外链 JS、CSS
4. 把 CSS 收集后注入到子应用容器作用域
5. 执行 JS（在沙箱 Proxy 上下文中执行，隔离 window）
6. 执行后从 window 上取子应用导出的 bootstrap/mount/unmount
7. 调用 bootstrap() → mount(props)，挂载到 container
```

关键点：子应用入口必须是**可被 fetch 的 HTML**，且其中 `<script>` 暴露了生命周期到全局（webpack 子应用挂 `window['xxx']`；vite-plugin-qiankun 挂 `window.moudleQiankunAppLifeCycles`）。

#### 3.1.2 JS 沙箱实现（三种模式）

| 模式 | 开启条件 | 原理 | 适用 |
| --- | --- | --- | --- |
| **LegacySnapshotSandbox（快照沙箱）** | `sandbox.legacy` 或环境不支持 Proxy | 激活时快照 `window` 全量 key；卸载时遍历恢复；**全局只有一份 window，多实例会冲突** | 老浏览器降级 |
| **ProxySandbox（多实例代理沙箱，默认）** | 默认且环境支持 Proxy | 为每个子应用创建独立 `fakeWindow` + Proxy，子应用对 window 的写落在 fakeWindow，读时先查 fakeWindow 再 fallback 真实 window；**支持多实例并存、互不污染** | 现代浏览器主推 |
| **singular 单实例约束** | `singular: true`（默认） | 同一时刻只允许一个子应用激活，简化沙箱切换 | 单实例场景 |

> 本项目默认 Proxy 沙箱 + singular=true。多 tab 同屏多子应用时需 `singular:false` + Proxy 沙箱。

#### 3.1.3 沙箱的边界（什么能隔、什么不能）

- ✅ 能隔离：子应用对 `window` 的**读写**（变量、定时器挂载点、全局函数）。
- ⚠️ 不能隔离：**逃逸 DOM 操作**——子应用直接 `document.body.appendChild`、`document.addEventListener`、`window.addEventListener`、`setInterval` 未清理等会逃逸到真实环境。
- qiankun 对部分逃逸 API（如 `setInterval`、`document.addEventListener`）做了劫持/记录，卸载时自动清理；但**手动绑定到非子应用容器 DOM 的事件不会自动清**，需在 `unmount` 自行解绑。

#### 3.1.4 样式隔离两种模式

| 模式 | 配置 | 原理 | 局限 |
| --- | --- | --- | --- |
| `strictStyleIsolation` | `sandbox.strictStyleIsolation: true` | 用 **Shadow DOM** 包裹子应用，天然样式隔离 | Shadow DOM 内 `el-dialog`/`el-message` 等通过 `Teleport`/`append-to-body` 挂到 body 的弹层在 Shadow 根外，拿不到子应用样式且无法穿透，导致弹层不可见；部分 UI 库不兼容 |
| `experimentalStyleIsolation` | `sandbox.experimentalStyleIsolation: true`（本项目） | 给子应用所有 CSS 选择器加 `div[data-qiankun="name"]` 前缀作用域 | 动态插入 body 的弹层样式仍会丢失（不在作用域内）；运行时插入的 `<style>` 也要重写 |

> 本项目选 experimentalStyleIsolation：兼容性比 Shadow DOM 好，弹层问题用 `:append-to` 规避。

#### 3.1.5 通信机制对比（qiankun 内置 vs 其他）

| 方式 | 适用 | 特点 |
| --- | --- | --- |
| `initGlobalState`（本项目） | 少量共享态（token/userInfo/主题） | 主应用创建，扁平广播，子应用通过 props 订阅/回写；**非响应式、不持久化** |
| `props` 下发 | 父→子单向传值 | 注册时 `props` 传只读数据 / 回调函数 |
| 自定义事件总线 | 复杂通信 | `mitt`/`EventEmitter`，子应用间解耦通信，需自行卸载清理 |
| 共享依赖（externals / MF） | 复用 Vue/Pinia 单例 | 节省体积，但破坏隔离、耦合高 |
| 后端接口 | 业务数据 | 各子应用各自请求，**不推荐走 globalState 传业务数据** |

#### 3.1.6 资源加载与预加载

- **按需加载**：命中 activeRule 才 fetch entry + 资源。
- **预加载 prefetch**：`start({ prefetch: true })` 在首屏子应用 mount 后、浏览器 idle 时，预 fetch 未激活子应用 entry（仅 HTML + JS，不执行），加速后续切换。
- **缓存**：子应用静态资源走浏览器 HTTP 缓存；entry HTML 通常配 `no-cache` 以便发版即时生效。

### 3.2 核心知识点深化

#### 3.2.1 子应用 name 三处一致

1. 主应用 `registerMicroApps` 中的 `name`；
2. 子应用 `vite-plugin-qiankun(name)` 的 `name`；
3. （生产）子应用打包后导出生命周期所挂载的全局 key。

不一致 → 主应用找不到子应用生命周期 → 加载失败 / 404 / 「application died in status LOADING_SOURCE_CODE」。

#### 3.2.2 activeRule 三种写法

| 写法 | 示例 | 说明 |
| --- | --- | --- |
| 字符串前缀 | `'/purchase'` | url 以 `/purchase` 开头即激活（含 `/purchase/xxx`） |
| 字符串数组 | `['/purchase', '/buy']` | 任一前缀命中 |
| 函数 | `(location) => location.pathname.startsWith('/purchase')` | 自定义判断，最灵活 |

> 注意字符串前缀是「startsWith」语义：`/pur` 也会命中 `/purchase`，建议用完整路径段避免误命中。

#### 3.2.3 路由模式与 base 对齐

主应用 history 模式 + 子应用 history 模式时，子应用 `createWebHistory(base)` 的 base 必须 = `activeRule + '/'`，否则子应用内部路由与主应用 url 错位、刷新 404。本项目的 `isQiankun ? '/purchase/' : '/'` 即保证两态正确。

#### 3.2.4 生命周期与实例复用

- `bootstrap` 全程只调一次：放一次性副作用（如注册全局组件、加载 SDK）。
- `mount` 每次切入调用、`unmount` 每次切走调用，**必须配对**，unmount 内销毁实例、清定时器、解绑事件，否则切走后实例残留 → 内存泄漏、切回报「micro app already mounted」。
- 子应用内部**不要在模块顶层做副作用**（如 `setInterval`、`window.addEventListener`），应在 `mount` 注册、`unmount` 清理。

#### 3.2.5 全局状态持久化（刷新不丢登录态）

qiankun globalState 存在内存，**刷新主应用即丢失**。生产方案：

1. 登录成功后同时写 `localStorage`；
2. 主应用启动时从 `localStorage` 读回，调用 `actions.setGlobalState(...)`；
3. 子应用 mount 时 `onGlobalStateChange(cb, true)` 立即拿到；
4. 退出登录时清空 `localStorage` + `setGlobalState({ token:'', userInfo:null })`。

本项目为学习演示未做持久化（刷新会回 `/login`），实现方式见 README 常见坑速查。

#### 3.2.6 应用间依赖与公共库处理

- **不同框架**：各子应用独立技术栈，互不干扰。
- **同一框架多版本**：Vue3 子应用与 Vue2 子应用可并存（各自实例），但 **ElementPlus 等 UI 库多实例会增大体积**。
- **共享方案**：`externals` + CDN、或 Module Federation 共享 `vue`/`pinia` 单例——**牺牲隔离换体积**，需评估。
- **公共方法库**：抽成 NPM 包供各子应用 install，避免 globalState 传业务数据。

#### 3.2.7 子应用独立开发能力

本项目每个子应用支持 `npm run dev` 独立运行（通过 `qiankunWindow.__POWERED_BY_QIANKUN__` 判断）。独立运行时无主应用 globalState 下发，需在子应用本地 mock `localState.token/userInfo` 以调试登录态相关逻辑——这是子应用「可独立开发」的关键。

### 3.3 主流面试题

#### 基础题

**Q1：什么是微前端？解决了什么问题？**
A：把单体前端拆成多个可独立开发/部署/运行的小应用，由主应用运行时集成。解决单体膨胀（构建慢）、跨团队/跨技术栈协作、老系统渐进重构、独立发布等问题。

**Q2：微前端和微服务有什么区别？**
A：思想类似（拆分+独立+集成），但微服务在后端按进程/网络隔离，微前端在前端浏览器内集成，要额外解决 **JS/CSS/路由隔离、资源加载、运行时通信** 等前端特有问题。

**Q3：qiankun 与 single-spa 的关系？**
A：qiankun 基于 single-spa，在其子应用调度能力之上补充了 import-html-entry（资源抓取执行）、JS 沙箱、样式隔离、全局状态、预加载，开箱即用。single-spa 只管加载，不隔离。

**Q4：qiankun 子应用必须导出哪几个生命周期？分别何时调用？**
A：`bootstrap`（首次加载一次）、`mount`（每次切入）、`unmount`（每次切走），`update` 可选。`unmount` 内必须销毁实例避免泄漏。

**Q5：为什么 unmount 里要 `app.unmount()`？不写会怎样？**
A：不销毁则切走后子应用 Vue 实例仍存活，DOM/事件/定时器残留 → 内存泄漏；切回时可能报「micro app already mounted」或重复渲染。

#### 原理题

**Q6：qiankun 是如何加载子应用的？**
A：通过 `import-html-entry`：fetch 子应用 entry HTML → 解析提取 script/style → 并发请求资源 → 在 JS 沙箱上下文中执行 JS → 从全局取子应用导出的生命周期 → 调用 bootstrap→mount 挂载到 container。

**Q7：qiankun 的 JS 沙箱有哪几种？原理是什么？**
A：两种——快照沙箱（LegacySnapshotSandbox，激活前快照 window、卸载时恢复，不支持多实例）和代理沙箱（ProxySandbox，为每个子应用建 fakeWindow + Proxy，写落 fakeWindow 读先查 fakeWindow，支持多实例，默认）。基于环境是否支持 Proxy 选择。

**Q8：Proxy 沙箱能完全隔离吗？有什么不能隔离的？**
A：不能完全隔离。逃逸到真实 DOM 的操作无法隔离：子应用 `document.body.appendChild`、直接 `document.addEventListener`、未清理的 `setInterval`/`window.addEventListener`。qiankun 劫持了部分 API 在卸载时清理，但子应用手动绑到非容器 DOM 的事件需自行在 unmount 解绑。

**Q9：样式隔离有哪两种模式？为什么 Shadow DOM 会和 UI 库冲突？**
A：`strictStyleIsolation`（Shadow DOM 包裹）和 `experimentalStyleIsolation`（选择器加 `div[data-qiankun]` 前缀）。Shadow DOM 内 `el-dialog` 等通过 `Teleport`/`append-to-body` 挂到 body 的弹层在 Shadow 根外，拿不到子应用样式且无法穿透，导致弹层不可见；故选 experimentalStyleIsolation，弹层问题用 `:append-to` 规避。

**Q10：vite-plugin-qiankun 解决了什么问题？为什么 qiankun 对 Vite 不友好？**
A：qiankun 依赖 `import-html-entry` 执行非 ESM 脚本、依赖 webpack 的生命周期挂载和 `__webpack_public_path__` 动态 publicPath；而 Vite dev 用原生 ESM、产物结构不同，二者天然不兼容。插件做了三件事：①运行时注入动态 publicPath；②把生命周期挂到 qiankun 全局（`moudleQiankunAppLifeCycles`）；③`useDevMode` 让 Vite HMR/ESM 与 qiankun 共存。

#### 实战题

**Q11：qiankun 主子应用如何通信？有几种方式？**
A：①`initGlobalState`（主创建、子通过 mount props 的 `onGlobalStateChange`/`setGlobalState` 订阅回写，适合登录态等少量共享）；②`props` 下发只读数据/回调；③自定义事件总线（mitt）；④共享依赖（externals/MF）。业务数据走接口，不走 globalState。

**Q12：主子应用路由如何协调？子应用路由 base 为什么要变？**
A：主应用 history + 子应用 history 时，子应用 `createWebHistory(base)` 的 base 必须 = activeRule + `/`，使子应用内部路由（如 `/purchase/orders`）与主应用 url 同步、刷新不 404。独立运行时 base 应为 `/`，故需按 `__POWERED_BY_QIANKUN__` 切换。

**Q13：子应用加载不出来 / 404，怎么排查？**
A：①三处 name 是否一致；②子应用 dev/部署是否可访问、CORS 是否开（`server.cors:true, origin`）；③entry 地址对不对；④子应用是否导出了生命周期（看 console / 全局对象）；⑤activeRule 是否命中当前 url。

**Q14：刷新主应用后登录态丢失怎么办？**
A：globalState 在内存，刷新即丢。生产做法：登录同时写 localStorage，主应用启动时读回 `setGlobalState`，子应用 mount `onGlobalStateChange(cb,true)` 立即拿；退出时清 localStorage + 清 state。

**Q15：qiankun 的 singular 是什么？什么时候要设 false？**
A：singular=true（默认）表示同一时刻只激活一个子应用，简化沙箱。需要同屏同时展示多个子应用（多 tab/多区域并存）时设 `singular:false`，且必须用 Proxy 沙箱（多实例）。

**Q16：qiankun 与 Module Federation 怎么选？**
A：qiankun 运行时集成、接入老应用友好、隔离强，但 Vite 需插件、多实例有坑；MF 构建时+运行时、原生代码共享、HMR 好，但强依赖 Webpack5/对应 Vite 插件、隔离弱、跨框架受限。老系统接入/异构技术栈选 qiankun；同技术栈新项目追求体积与体验选 MF。

**Q17：子应用独立开发时如何调试登录态？**
A：子应用独立运行时无主应用 globalState，token/userInfo 为空。可在子应用 `store/global.js` 检测独立运行时本地 mock `localState.token/userInfo`，保证脱离主应用也能开发登录态相关逻辑。

**Q18：qiankun 部署有哪些注意点？**
A：①子应用 entry 改生产 URL；②子应用服务器开 CORS 允许主应用域名；③资源路径用动态 publicPath（插件已处理）；④子应用单独部署 history 路由刷新 404，nginx 加 `try_files $uri $uri/ /index.html`；⑤部署在子路径时 `vite base` 与路由 base 一致；⑥entry HTML 配 no-cache 以便发版即时生效。

#### 设计/权衡题

**Q19：iframe、qiankun、Module Federation 各自适用场景？**
A：iframe=完全隔离+任意应用，但体验差、通信难，适合集成第三方/不可控老系统；qiankun=运行时集成+隔离好+接入老应用友好，适合异构技术栈、渐进重构；MF=同构建体系下代码共享、HMR 体验好，适合同技术栈新项目。

**Q20：微前端有哪些核心挑战？**
A：①隔离（JS/CSS/路由）；②通信（主子、子子）；③集成方式（运行时 vs 构建时）；④公共依赖（共享 vs 各自打包）；⑤部署与版本治理；⑥性能（加载、预加载、缓存）；⑦开发体验（独立开发/调试）。各方案都在这几个维度做权衡。

### 3.4 根工程聚合与一键启动（归纳）

为方便本地联调，仓库根目录增加了一个**聚合工程**（非业务代码），用一条命令同时启动主应用 + 全部子应用。

#### 3.4.1 设计思路

- 根 `package.json` 只装一个开发工具 `concurrently`，不引入业务依赖。
- 4 个子项目仍是**完全独立**的 Vue 项目（各自 package.json / node_modules / vite.config），根工程仅作"编排"，不破坏子应用独立性。
- 启动时用 `concurrently` 并行执行 4 个 `npm run dev:xxx`，日志按 `[main]/[purchase]/[warehouse]/[sales]` 前缀 + 颜色聚合到一个终端，`Ctrl+C` 一次停全部。

#### 3.4.2 目录与脚本

```
vue_qiankun/
├── package.json            # 聚合工程
├── start.bat               # Windows 零依赖备选（4 个独立 cmd 窗口）
├── scripts/
│   ├── install-all.js      # 串行安装 4 个子项目依赖
│   └── build-all.js        # 串行构建 4 个项目到各自 dist
├── main-layout/  ...        # 独立子项目
├── sub-purchase/ ...
├── sub-warehouse/ ...
└── sub-sales/ ...
```

| 命令 | 作用 | 实现 |
| --- | --- | --- |
| `npm install` | 安装根工具（concurrently） | package.json devDependencies |
| `npm run install:all` | 串行安装 4 个子项目依赖 | `scripts/install-all.js` 用 `child_process.spawnSync` 逐个 `npm install` |
| `npm run dev` / `npm start` | 并行启动 4 个 dev server，日志聚合 | `concurrently -k -n main,purchase,warehouse,sales` |
| `npm run build:all` | 串行构建 4 个项目 | `scripts/build-all.js` |
| 双击 `start.bat` | 无需装 concurrently，4 个独立窗口启动 | Windows `start cmd /k` |

#### 3.4.3 使用流程

```bash
npm install            # 1. 装根工具 concurrently
npm run install:all    # 2. 装 4 个子项目依赖（仅首次）
npm run dev            # 3. 一键启动，访问 http://localhost:8000
```

#### 3.4.4 关键点

- `concurrently -k`：`-k` 表示任一进程退出则杀掉其他进程，保证 Ctrl+C 全部停干净。
- 子应用 dev 必须都启动，主应用才能 fetch 到 `//localhost:80xx` 入口；一键启动正好解决"忘记起子应用"问题。
- 根工程 `node_modules` 已被 `.gitignore` 忽略（`**/node_modules/`），各子项目 `node_modules` 同样忽略。
- 生产/CI 不用根工程聚合，各子项目仍独立部署；根工程仅服务于本地开发联调。

### 3.5 核心要点一句话归纳

- 主应用装 qiankun 并 `registerMicroApps + start`，子应用**不装** qiankun，只导出 `bootstrap/mount/unmount`。
- 子应用 `name` 在三处必须一致：主应用注册表、vite-plugin-qiankun 参数、（生产）子应用导出。
- 通信走 `initGlobalState`：主应用 set/onGlobalStateChange，子应用通过 mount props 的 `onGlobalStateChange / setGlobalState`。
- 隔离三件套：JS 沙箱（Proxy）、样式隔离（experimentalStyleIsolation）、路由 base 对齐 activeRule。
- 生命周期 `unmount` 必须销毁实例；Vite 子应用用 `vite-plugin-qiankun` 解决动态 publicPath 与生命周期导出。
- 沙箱两种模式：快照沙箱（不支持 Proxy、单实例）vs Proxy 代理沙箱（默认、多实例）；逃逸 DOM 操作（body.appendChild、未清理的定时器/事件）沙箱管不到，需 unmount 自清。
- 样式隔离两种模式：Shadow DOM（strictStyleIsolation，彻底但与弹层 UI 库冲突）vs 选择器前缀（experimentalStyleIsolation，兼容性好，本项目采用）。
- 通信四选一：globalState（少量共享态）/ props（单向下发）/ 事件总线（复杂）/ 共享依赖（externals/MF）；业务数据走接口不进 globalState。
- activeRule 三种写法（字符串前缀 / 数组 / 函数），字符串是 startsWith 语义，用完整路径段避免误命中。
- globalState 非持久化，刷新即丢，生产配 localStorage 回填。
- 选型：老系统渐进重构/异构技术栈 → qiankun；同技术栈新项目追体积/体验 → Module Federation；第三方不可控老系统 → iframe。
- 根工程聚合一键启动：用 concurrently 并行起 4 个独立子项目（`npm run dev`），仅编排不破坏子应用独立性；生产仍各子项目独立部署。
- 每个子应用是独立 Vue 项目，可独立 dev、独立部署、独立拉分支——这就是微前端「独立开发、集成运行」的价值。
