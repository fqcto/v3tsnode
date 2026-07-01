# uni-app 多端开发全阶段学习手册

> 一套代码，发布到 iOS / Android / Web / 微信小程序 / 支付宝小程序 / 百度小程序 / 字节跳动小程序 / QQ 小程序 / 快应用 / 鸿蒙。
>
> 本手册基于 **uni-app Vue3 + Vite + TypeScript** 版本编写，覆盖「零基础入门」到「大型跨端实战」。

---

## 目录

- 一、🟢 初级入门
  - 1.1 uni-app 是什么 & 跨端方案对比
  - 1.2 CLI vs HBuilderX & 项目结构
  - 1.3 pages.json / manifest.json 关键字段
  - 1.4 三种生命周期（应用/页面/组件）
  - 1.5 Vue3 `<script setup>` 在 uni-app 的写法
  - 1.6 rpx 单位 & 条件编译初步
  - 1.7 内置组件 & API（与 wx.* 对应表）
  - 1.8 路由跳转 & 参数传递
  - 1.9 CSS / SCSS / UnoCSS
- 二、🟡 中级进阶
  - 2.1 easycom 自动引入 & uni_modules
  - 2.2 自定义组件：defineProps / defineEmits / defineExpose
  - 2.3 Pinia 状态管理 + 持久化
  - 2.4 请求封装（拦截器 / Token / 401）
  - 2.5 登录鉴权三端差异
  - 2.6 上传下载 / WebSocket 封装
  - 2.7 组件库选型对比表
  - 2.8 分包 & 预下载
  - 2.9 tabBar 定制
  - 2.10 iconfont 三端方案
- 三、🔴 高级实战
  - 3.1 条件编译深入（文件级/代码级/样式级）
  - 3.2 nvue（Weex）差异 & 何时用
  - 3.3 renderjs
  - 3.4 uni-app x（uts + uvue）
  - 3.5 性能优化专题
  - 3.6 平台差异陷阱清单
  - 3.7 调试与打包
  - 3.8 热更新 wgt / getUpdateManager
  - 3.9 埋点 & 监控
  - 3.10 支付/地图/蓝牙/分享 三端 API 差异映射
  - 3.11 CI/CD：uni-app + GitHub Actions + miniprogram-ci
  - 3.12 常见面试题精选

---

## 一、🟢 初级入门

### 1.1 uni-app 是什么 & 跨端方案对比 <span class="lv lv-1">初级</span>

**uni-app** 是 DCloud 推出的使用 Vue.js 开发所有前端应用的框架，一套代码可发布到多端。

| 维度       | uni-app            | Taro           | React Native | Flutter       |
| ---------- | ------------------ | -------------- | ------------ | ------------- |
| 语法       | Vue2/Vue3/uvue     | React/Vue      | React        | Dart          |
| App 渲染   | WebView/nvue/原生  | 主要 WebView   | 原生桥接     | 自绘引擎 Skia |
| 小程序     | 全平台一等公民     | 全平台         | ❌           | ❌            |
| Web        | ✅                 | ✅             | rn-web       | ✅(Canvas)    |
| 学习曲线   | 低                 | 低             | 中           | 高            |
| 打包体积   | 小                 | 小             | 中           | 大(10MB+)     |
| 中文生态   | 国内小程序最强     | 京东系         | 一般         | 一般          |

💡 目标含微信小程序 → uni-app 几乎是国内最佳；纯原生 App 极致性能 → Flutter/RN。

---

### 1.2 CLI vs HBuilderX & 项目结构 <span class="lv lv-1">初级</span>

**HBuilderX**：官方 IDE，开箱即用，一键云打包，适合个人原型。**CLI（推荐团队）**：

```bash
npx degit dcloudio/uni-preset-vue#vite-ts my-uni-app
cd my-uni-app && pnpm install
pnpm dev:h5            # H5
pnpm dev:mp-weixin     # 微信小程序
```

**Vue3 + Vite 项目结构：**

```
src/
├── main.ts              # 入口（createSSRApp）
├── App.vue              # 根组件
├── manifest.json        # 平台配置
├── pages.json           # 路由 + 全局窗口 + tabBar
├── uni.scss             # 全局 SCSS 变量
├── pages/               # 主包页面
│   ├── index/index.vue
│   └── login/login.vue
├── subpackages/         # 分包
├── components/          # 公共组件（easycom）
├── static/              # 静态资源（原样打包）
├── store/  utils/  api/ hooks/
└── uni_modules/         # 插件市场插件
```

🎯 企业项目走 CLI + VSCode，个人快速验证走 HBuilderX。

---

### 1.3 pages.json / manifest.json 关键字段 <span class="lv lv-1">初级</span>

```json
{
  "pages": [
    { "path": "pages/index/index", "style": { "navigationBarTitleText": "首页" } }
  ],
  "globalStyle": { "navigationBarTextStyle": "black", "navigationBarBackgroundColor": "#F8F8F8" },
  "tabBar": { "list": [{ "pagePath": "pages/index/index", "text": "首页" }] },
  "subPackages": [{ "root": "subpackages/order", "pages": [{ "path": "list/list" }] }]
}
```

| manifest 字段       | 说明                              |
| ------------------- | --------------------------------- |
| `appid`             | DCloud 应用 ID                    |
| `versionName/Code`  | 版本名/号（热更新对比用）         |
| `mp-weixin.appid`   | 微信小程序 AppID                  |
| `app-plus`          | App 端权限、启动图、SDK 配置      |
| `h5.router.mode`    | H5 路由：`hash` 或 `history`      |

💡 **pages.json 管路由，manifest.json 管平台配置**。

---

### 1.4 三种生命周期（应用/页面/组件） <span class="lv lv-1">初级</span>

**应用级（App.vue）：**

```ts
import { onLaunch, onShow, onHide, onError } from '@dcloudio/uni-app'
onLaunch((opts) => console.log('Launch', opts))
onShow(() => console.log('App Show'))
```

**页面级：**

```ts
import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom, onShareAppMessage } from '@dcloudio/uni-app'
onLoad((query) => console.log('参数：', query))
onPullDownRefresh(() => { /* ... */ uni.stopPullDownRefresh() })
onShareAppMessage(() => ({ title: '分享标题', path: '/pages/index/index' }))
```

**时序：** `App onLaunch → App onShow → Page onLoad → onShow → onReady → ... → onHide → onUnload`

💡 Launch 只走一次，Load 每次进页都走，Show 每次可见就走。

---

### 1.5 Vue3 `<script setup>` 在 uni-app 的写法 <span class="lv lv-1">初级</span>

```vue
<template>
  <view class="container">
    <text>{{ count }}</text>
    <button @tap="add">+1</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
const add = () => count.value++
</script>

<style lang="scss" scoped>
.container { padding: 32rpx; }
</style>
```

注意事项：标签用 `view/text/button`；小程序/App 无 `document/window`；`defineProps/defineEmits/defineExpose` 均可用。

🎯 把 uni-app Vue3 当 Vue3 用，只是标签换成小程序组件。

---

### 1.6 rpx 单位 & 条件编译初步 <span class="lv lv-1">初级</span>

**rpx**：uni-app 响应式单位，**750rpx = 屏幕宽度**。设计稿 750px 时量多少写多少。

**条件编译（编译期宏，非运行时）：**

```vue
<template>
  <!-- #ifdef MP-WEIXIN -->
  <button open-type="getUserInfo">仅微信小程序</button>
  <!-- #endif -->
  <!-- #ifndef H5 -->
  <text>非 H5 才显示</text>
  <!-- #endif -->
</template>

<script setup lang="ts">
// #ifdef APP-PLUS
console.log('只在 App 端执行')
// #endif
</script>

<style lang="scss">
/* #ifdef MP-WEIXIN */
.title { color: green; }
/* #endif */
</style>
```

| 标识        | 含义           | 标识          | 含义         |
| ----------- | -------------- | ------------- | ------------ |
| `H5`        | H5 端          | `MP-ALIPAY`   | 支付宝小程序 |
| `APP-PLUS`  | App(iOS+Android)| `MP-TOUTIAO` | 字节跳动小程序|
| `MP-WEIXIN` | 微信小程序     | `MP`          | 所有小程序   |

💡 条件编译是编译期删代码，最终产物不含其他平台代码。

---

### 1.7 内置组件 & API（与 wx.* 对应表） <span class="lv lv-1">初级</span>

| 组件          | 说明                              |
| ------------- | --------------------------------- |
| `view`        | 相当于 div                        |
| `text`        | 相当于 span（只有它内部可选中文字）|
| `image`       | 图片，支持 mode（aspectFill 等）  |
| `scroll-view` | 可滚动容器                        |
| `rich-text`   | 富文本（小程序不支持 v-html 的替代）|

| uni.*              | wx.*              | 说明       |
| ------------------ | ----------------- | ---------- |
| `uni.request`      | `wx.request`      | 网络请求   |
| `uni.showToast`    | `wx.showToast`    | Toast      |
| `uni.navigateTo`   | `wx.navigateTo`   | 保留栈跳转 |
| `uni.switchTab`    | `wx.switchTab`    | 切换 tab   |
| `uni.setStorageSync`| `wx.setStorageSync`| 同步存储  |
| `uni.uploadFile`   | `wx.uploadFile`   | 上传       |
| `uni.connectSocket`| `wx.connectSocket`| WebSocket  |

🎯 写 uni-app 时把 wx. 全部改成 uni.，逻辑几乎一致。

---

### 1.8 路由跳转 & 参数传递 <span class="lv lv-1">初级</span>

```ts
uni.navigateTo({ url: '/pages/detail/detail?id=123&type=hot' })
// 目标页接收
onLoad((query) => { console.log(query.id, query.type) })

// 复杂对象：eventChannel
uni.navigateTo({
  url: '/pages/detail/detail',
  success(res) { res.eventChannel.emit('acceptData', { user: { id: 1, name: 'Tom' } }) }
})
```

💡 参数太大用 Pinia / eventChannel 传，别硬塞 URL。

---

### 1.9 CSS / SCSS / UnoCSS <span class="lv lv-1">初级</span>

- **SCSS**：`pnpm i -D sass`，SFC 内 `<style lang="scss" scoped>`。
- **全局变量**：`uni.scss` 中定义，无需 import 即可用。
- **UnoCSS**：小程序端需 `unocss-preset-weapp` 做类名转义。

```scss
// uni.scss
$uni-color-primary: #007aff;
$uni-font-size-base: 28rpx;
```

🎯 小程序端 scoped 相当于原生 styleIsolation，天然隔离。

---

## 二、🟡 中级进阶

### 2.1 easycom 自动引入 & uni_modules <span class="lv lv-2">中级</span>

**easycom**：组件放 `components/组件名/组件名.vue`，模板直接 `<组件名 />`，无需 import。

自定义匹配（pages.json）：

```json
{ "easycom": { "autoscan": true, "custom": {
  "^u-(.*)": "@/uni_modules/uview-plus/components/u-$1/u-$1.vue"
} } }
```

**uni_modules**：官方插件规范，安装到 `src/uni_modules/`，自带版本管理。

💡 easycom + uni_modules = uni-app 版 npm，安装即用、零配置。

---

### 2.2 自定义组件：defineProps / defineEmits / defineExpose <span class="lv lv-2">中级</span>

```vue
<!-- MyBtn.vue -->
<script setup lang="ts">
const props = defineProps<{ text: string; type?: 'primary' | 'default' }>()
const emit = defineEmits<{ (e: 'tap', payload: number): void }>()
const onClick = () => emit('tap', Date.now())
defineExpose({ focus: () => console.log('聚焦') })
</script>
<template>
  <button :class="props.type" @tap="onClick">{{ props.text }}</button>
</template>
```

| 场景       | 推荐方案                                       |
| ---------- | ---------------------------------------------- |
| 父子       | props + emit                                   |
| 兄弟       | provide/inject 或共享 ref                       |
| 跨页面     | **Pinia**（首选）                               |
| 一次性事件 | `uni.$emit / uni.$on`（注意 `$off` 防泄漏）    |

🎯 能用 Pinia 就别用 event bus，容易忘 `$off` 导致内存泄漏。

---

### 2.3 Pinia 状态管理 + 持久化 <span class="lv lv-2">中级</span>

```ts
// store/user.ts
import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', {
  state: () => ({ token: '' as string, userInfo: null as null | { id: number; nickname: string } }),
  getters: { isLogin: (s) => !!s.token },
  actions: {
    setToken(t: string) { this.token = t; uni.setStorageSync('token', t) },
    logout() { this.$reset(); uni.removeStorageSync('token') }
  }
})
```

**持久化插件（简易版）：**

```ts
import type { PiniaPluginContext } from 'pinia'
export function piniaUniPersist({ store }: PiniaPluginContext) {
  const key = `pinia-${store.$id}`
  const cache = uni.getStorageSync(key)
  if (cache) store.$patch(cache)
  store.$subscribe((_, state) => uni.setStorageSync(key, JSON.parse(JSON.stringify(state))))
}
```

💡 生产项目推荐 `pinia-plugin-persistedstate-uni`。

---

### 2.4 请求封装（拦截器 / Token / 401） <span class="lv lv-2">中级</span>

```ts
// utils/request.ts
const BASE_URL = import.meta.env.VITE_API_BASE
export function request<T = any>(opts: UniApp.RequestOptions & { loading?: boolean }): Promise<T> {
  return new Promise((resolve, reject) => {
    if (opts.loading) uni.showLoading({ title: '加载中', mask: true })
    const token = useUserStore().token
    uni.request({
      url: BASE_URL + opts.url, method: opts.method || 'GET', data: opts.data,
      header: { Authorization: token ? `Bearer ${token}` : '', ...opts.header },
      success: (res: any) => {
        if (res.statusCode === 200 && res.data.code === 0) return resolve(res.data.data)
        if (res.data.code === 401) { /* 刷新 token 或跳登录 */ }
        uni.showToast({ title: res.data.message || '请求失败', icon: 'none' })
        reject(res.data)
      },
      fail: reject, complete: () => opts.loading && uni.hideLoading()
    })
  })
}
```

🎯 拦截器 = 洋葱模型：请求前加 token/loading，响应后处理 401/toast/关闭 loading。

---

### 2.5 登录鉴权三端差异 <span class="lv lv-2">中级</span>

```ts
// #ifdef MP-WEIXIN
uni.login({ provider: 'weixin', success: async ({ code }) => {
  const { token } = await request({ url: '/auth/wx-login', method: 'POST', data: { code } })
  useUserStore().setToken(token)
}})
// #endif
// #ifdef APP-PLUS
uni.getProvider({ service: 'oauth', success(res) {
  if (res.provider.includes('univerify')) uni.login({ provider: 'univerify' })
}})
// #endif
// #ifdef H5
location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=xxx&redirect_uri=...`
// #endif
```

| 端   | 登录方式                | 依赖             |
| ---- | ----------------------- | ---------------- |
| 小程序 | uni.login + code 换 openid | 微信服务器     |
| App    | 一键登录 / 微信 / Apple ID | uni-id        |
| H5     | 短信 / 密码 / OAuth 跳转  | 自有+微信开放平台 |

💡 推荐 `uni-id`（DCloud 开源身份系统），一次开发多端登录复用。

---

### 2.6 上传下载 / WebSocket 封装 <span class="lv lv-2">中级</span>

**选图上传：**

```ts
const res = await uni.chooseImage({ count: 9, sizeType: ['compressed'] })
const uploads = res.tempFilePaths.map((path) =>
  new Promise((resolve, reject) => {
    uni.uploadFile({ url: '/api/upload', filePath: path, name: 'file',
      success: (r) => resolve(JSON.parse(r.data as string)), fail: reject })
  })
)
await Promise.all(uploads)
```

**WebSocket 心跳重连：**

```ts
class WSClient {
  private task: UniApp.SocketTask | null = null
  private heartTimer: any = null
  private reconnectCount = 0
  constructor(private url: string) { this.connect() }
  private connect() {
    this.task = uni.connectSocket({ url: this.url, complete: () => {} })
    this.task.onOpen(() => { this.reconnectCount = 0; this.startHeartbeat() })
    this.task.onMessage(({ data }) => { if (data === 'pong') return })
    this.task.onClose(() => this.reconnect())
  }
  private startHeartbeat() {
    this.heartTimer = setInterval(() => this.task?.send({ data: 'ping' }), 25000)
  }
  private reconnect() {
    if (this.reconnectCount++ > 5) return
    setTimeout(() => this.connect(), 3000 * this.reconnectCount)
  }
  send(msg: string) { this.task?.send({ data: msg }) }
}
```

💡 心跳周期 25 秒（微信小程序空闲 30 秒断连），重连用指数退避。

---

### 2.7 组件库选型对比 <span class="lv lv-2">中级</span>

| 组件库             | Vue3 | nvue | 特色               |
| ------------------ | ---- | ---- | ------------------ |
| **uview-plus**     | ✅   | 部分 | 老 uView Vue3 版  |
| **wot-design-uni** | ✅   | 部分 | 京东风格，TS 完善  |
| **uni-ui**         | ✅   | ✅   | DCloud 官方，最保险|
| **tmui4**          | ✅   | ✅   | 3D 风格 + 深色主题 |

🎯 H5+小程序 → wot-design-uni；重 App 且需 nvue → uni-ui。

---

### 2.8 分包 & 预下载 <span class="lv lv-2">中级</span>

微信小程序主包 2MB，总包 20MB。

```json
{
  "subPackages": [{ "root": "subpackages/order", "pages": [{ "path": "list/list" }] }],
  "preloadRule": { "pages/index/index": { "network": "wifi", "packages": ["subpackages/order"] } }
}
```

独立分包：`{ "root": "subpackages/promo", "independent": true }`

🎯 低频页面（订单/设置/帮助）放分包，首页高频留主包。

---

### 2.9 tabBar 定制 <span class="lv lv-2">中级</span>

**原生 tabBar**：pages.json 配置，性能最好但样式受限。
**自定义 tabBar**：`"custom": true`，用组件实现。微信小程序需在每个 tab 页 `onShow` 调 `getTabBar().setActive()`。

🎯 需红点/动效/凸起 icon → 自定义 tabBar，否则原生够用。

---

### 2.10 iconfont 三端方案 <span class="lv lv-2">中级</span>

| 端   | 方案                                              |
| ---- | ------------------------------------------------- |
| H5   | 直接引入 `iconfont.css`                           |
| 小程序 | 字体转 base64 内联到 CSS（不支持 @font-face 外链）|
| App  | `uni.loadFontFace({ source: 'url("https://xxx.ttf")' })` |

💡 推荐直接用 SVG 组件（`wd-icon` / `u-icon`），避免字体兼容性坑。

---

## 三、🔴 高级实战

### 3.1 条件编译深入（文件级/代码级/样式级） <span class="lv lv-3">高级</span>

**三种粒度：** 代码块级 `// #ifdef`、文件级 `index.h5.ts`、样式级 `/* #ifdef */`。

**跨端差异抽象（文件级）：**

```
utils/platform/
├── index.ts              # 统一出口
├── index.h5.ts           # H5 实现
├── index.mp-weixin.ts    # 微信小程序实现
└── index.app-plus.ts     # App 实现
```

```ts
export function share() {
  // #ifdef MP-WEIXIN
  return { title: '微信分享' }
  // #endif
  // #ifdef H5
  navigator.share?.({ title: 'H5 分享' })
  // #endif
  // #ifdef APP-PLUS
  plus.share.sendWithSystem({ content: 'App 分享' })
  // #endif
}
```

🎯 单文件条件编译适合 5 行以内差异，超过就拆平台文件。

---

### 3.2 nvue（Weex）差异 & 何时用 <span class="lv lv-3">高级</span>

基于 Weex 的原生渲染，仅 App 端生效。页面文件用 `.nvue` 后缀。

**何时用：** 长列表(>500条) / 地图+直播推流 / 高性能动画。

| 限制                  | 说明                                |
| --------------------- | ----------------------------------- |
| 只支持 flex 布局      | 不能用 float / grid / position(部分)|
| 不支持 `*` 通配符     | 类似小程序                          |
| 不支持伪类/box-shadow | 原生不渲染                          |
| 不能直接引入 vue 组件 | nvue 与 vue 组件隔离                |

💡 首页/详情页用 vue，长列表/直播页用 nvue，混合最优。

---

### 3.3 renderjs <span class="lv lv-3">高级</span>

脚本直接跑在**视图层**，支持 `document / window / echarts`。支持 H5、微信小程序、App-vue。

```vue
<template>
  <view :prop="chartData" :change:prop="renderScript.update" id="chart"></view>
</template>

<script>
export default { data() { return { chartData: [] } } }
</script>

<script module="renderScript" lang="renderjs">
import * as echarts from 'echarts'
export default {
  mounted() { this.chart = echarts.init(document.getElementById('chart')) },
  methods: { update(newVal) { this.chart.setOption({ series: [{ data: newVal }] }) } }
}
</script>
```

🎯 图表 / 复杂动画 / canvas 首选 renderjs。

---

### 3.4 uni-app x（uts + uvue） <span class="lv lv-3">高级</span>

DCloud 下一代方案，告别 WebView：**uts** 写一次编译成 Kotlin(Android) + Swift(iOS)；**uvue** 编译成原生 UI 组件树。

```
uni-app (vue)        → H5 / 小程序 / App(WebView 或 nvue)
uni-app x (uvue+uts) → App(纯原生)  ─ 未来扩展到小程序/H5
```

```ts
// utils/hello.uts
export function greet(name: string): string { return `Hello, ${name}` }
// → Android Kotlin: fun greet(name: String): String = "Hello, $name"
```

💡 短期不建议直接上 uni-app x 做生产，等生态稳定；可在 App 端局部页面试点。

---

### 3.5 性能优化：长列表 / 首屏 / 分包 / 图片 / 避免 v-if+v-for <span class="lv lv-3">高级</span>

| 场景         | 优化手段                                       |
| ------------ | ---------------------------------------------- |
| setData 频繁 | 合并数据、局部字段更新                         |
| 长列表       | virtual-list / recycle-view / nvue `<list>`    |
| 首屏白屏     | 骨架屏、静态压缩、预加载数据                   |
| 分包         | 独立分包 + preloadRule                         |
| 图片         | lazy-load、WebP、CDN 尺寸参数                  |
| 重复渲染     | v-for 加 `:key`，**避免 v-if + v-for 混用**    |
| JS 包大      | 三方库按需引入、externals CDN(H5)              |

```vue
<!-- 错误 -->
<view v-for="item in list" v-if="item.active" :key="item.id">
<!-- 正确：计算属性过滤 -->
<view v-for="item in activeList" :key="item.id">
```

🎯 性能优化 = 少渲染 + 少通信。

---

### 3.6 平台差异陷阱清单 <span class="lv lv-3">高级</span>

| 项             | H5       | 小程序          | App-vue  | App-nvue |
| -------------- | -------- | --------------- | -------- | -------- |
| v-html         | ✅       | ❌用 rich-text  | ✅       | ❌       |
| 通配选择器 `*`| ✅       | ❌              | ✅       | ❌       |
| 后代选择器     | ✅       | ⚠️性能差        | ✅       | ❌       |
| CSS 变量       | ✅       | ⚠️部分          | ✅       | ❌       |
| DOM API        | ✅       | ❌              | ✅       | ❌       |
| 网络限制       | CORS     | 需配置合法域名  | 无       | 无       |

💡 陷阱最集中的两端：小程序 + nvue，写代码时同时考虑。

---

### 3.7 调试与打包 <span class="lv lv-3">高级</span>

```bash
pnpm build:h5            # → dist/build/h5/（部署 Nginx/CDN）
pnpm build:mp-weixin     # → dist/build/mp-weixin/（微信开发者工具上传）
```

**App 打包：** 1) HBuilderX 云打包（一键，DCloud 服务器编译）；2) 本地离线打包（Offline SDK + Android Studio / Xcode，适合有原生插件的团队）。

证书要点：Android → applicationId + keystore；iOS → Bundle ID + Developer 证书 + Profile。2023 后应用市场强制隐私协议声明。

🎯 企业项目一律离线打包：可控、可追溯、可接入原生 SDK。

---

### 3.8 热更新 wgt / getUpdateManager <span class="lv lv-3">高级</span>

**App 端 wgt 增量更新：**

```ts
uni.request({ url: '/api/appVersion', success: (res: any) => {
  if (res.data.wgtUrl) {
    uni.downloadFile({ url: res.data.wgtUrl, success: (r) => {
      plus.runtime.install(r.tempFilePath, { force: false }, () => plus.runtime.restart())
    }})
  }
}})
```

**小程序端更新：**

```ts
const mgr = uni.getUpdateManager()
mgr.onUpdateReady(() => {
  uni.showModal({ title: '更新提示', content: '新版本已就绪，是否重启？',
    success: (r) => r.confirm && mgr.applyUpdate() })
})
```

💡 wgt 只能更新 JS/CSS/静态资源，动原生插件必须整包升级。

---

### 3.9 埋点 & 监控 <span class="lv lv-3">高级</span>

```ts
// main.ts
app.config.errorHandler = (err, instance, info) => reportError({ err, info })
// App.vue
onError((err) => reportError({ err, level: 'app' }))

export function reportError(payload: any) {
  const info = uni.getSystemInfoSync()
  uni.request({ url: 'https://collect.xxx.com/log', method: 'POST',
    data: { ...payload, platform: info.platform, version: info.appVersion, time: Date.now() } })
}
```

Sentry：H5 → `@sentry/vue`；小程序/App → `sentry-mini`。日志分级上传采样降本。

🎯 日志分级（fatal/error/warn/info），上传采样降本。

---

### 3.10 支付/地图/蓝牙/分享 三端 API 差异映射 <span class="lv lv-3">高级</span>

| 能力 | 微信小程序               | 支付宝小程序        | App 端             | H5          |
| ---- | ------------------------ | ------------------- | ------------------ | ----------- |
| 支付 | uni.requestPayment(wxpay)| uni.requestPayment(alipay)| 多渠道        | JSAPI 支付  |
| 地图 | `<map>`(腾讯)            | `<map>`(高德)       | 腾讯/百度/高德     | 第三方 SDK  |
| 蓝牙 | uni.openBluetoothAdapter | ⚠️部分              | ✅                 | Web Bluetooth|
| 分享 | onShareAppMessage        | my.getShareInfo     | plus.share         | 分享插件    |
| 推送 | 模板/订阅消息            | 订阅消息            | UniPush 2.0        | Web Push    |

**支付统一封装：**

```ts
export function pay(orderInfo: any) {
  return new Promise((resolve, reject) => {
    uni.requestPayment({
      // #ifdef MP-WEIXIN
      provider: 'wxpay', timeStamp: orderInfo.timeStamp,
      nonceStr: orderInfo.nonceStr, package: orderInfo.package,
      signType: 'MD5', paySign: orderInfo.paySign,
      // #endif
      // #ifdef APP-PLUS
      provider: 'wxpay', orderInfo,
      // #endif
      success: resolve, fail: reject
    })
  })
}
```

💡 原生能力永远在真机上测，模拟器测不出蓝牙/支付/推送。

---

### 3.11 CI/CD：uni-app + GitHub Actions + miniprogram-ci <span class="lv lv-3">高级</span>

```yaml
name: Build & Deploy uni-app
on:
  push:
    branches: [main]

jobs:
  build-h5:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - run: pnpm install && pnpm build:h5
      - run: pnpm dlx ali-oss-cli sync dist/build/h5 /

  build-mp-weixin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install && pnpm build:mp-weixin
      - name: Upload to WeChat
        run: |
          npx miniprogram-ci upload \
            --pp ./dist/build/mp-weixin \
            --pkp ./private.key \
            --appid ${{ secrets.WX_APPID }} \
            --uv 1.0.${{ github.run_number }} \
            --ud "CI Auto Build"
```

关键点：微信公众平台下载上传密钥 → 配置 IP 白名单 → 版本号用 `1.0.${{ github.run_number }}`。

🎯 CI/CD 目标：一次 push，五端全部产出并自动分发到测试渠道。

---

### 3.12 常见面试题精选 <span class="lv lv-3">高级</span>

1. **uni-app 与 Taro 区别？** → uni-app 用 Vue，国内小程序生态更强，插件市场沉淀多。
2. **一套代码多端原理？** → 编译期将 Vue 模板+JS 编译成各端产物；条件编译剔除非目标代码。
3. **rpx / px / vw / rem 区别？** → rpx:750rpx=屏宽(跨端首选)；px:设备像素；vw:视口1%；rem:相对根字号。
4. **onLoad 与 onShow 区别？** → onLoad 初始化执行一次，接收路由参数；onShow 每次可见都执行。
5. **条件编译何时起作用？** → 编译期，不是运行时，最终产物不含其他平台代码。
6. **easycom 原理？** → 编译期扫描目录，匹配组件自动注入 components，省略手动 import。
7. **小程序主包 2MB 满了怎么办？** → 分包 + 独立分包 + preloadRule；图片上 CDN；tree-shake。
8. **nvue 和 vue 页面可以互跳吗？** → 可以；通信推荐 Pinia / eventBus，不建议 URL 传大对象。
9. **多端登录如何统一？** → 抽象登录 provider，条件编译处理不同 API；服务端统一 JWT；推荐 uni-id。
10. **App 端热更新边界？** → wgt 只改 JS/CSS/静态资源；动原生插件/权限/icon 必须整包升级。
11. **Renderjs 与 nvue 区别？** → Renderjs 脚本跑视图层，解决 IPC 卡顿；nvue 是整套原生渲染。
12. **uni-app x 为什么值得关注？** → uvue+uts 编译到原生，性能对标 Flutter，是"下一代 App 引擎"。
13. **微信小程序 v-html 不生效？** → 用 `<rich-text :nodes="html">` 或 mp-html 组件。
14. **首屏骨架屏怎么做？** → loading 态渲染骨架组件，数据返回后切换真实内容。
15. **多平台 API 命名不同如何统一？** → 定义统一接口层，内部条件编译分别调用，业务层零感知。

---

**学习路径：**

```
Week 1  ─ 基础语法 + 项目结构 + 路由 + rpx + 条件编译
Week 2  ─ Pinia + 请求封装 + 登录流程 + easycom + UI 库
Week 3  ─ 分包 + tabBar + 上传/下载 + WebSocket
Week 4  ─ nvue + Renderjs + 性能优化 + 平台陷阱
Week 5  ─ 打包发布 + 热更新 + CI/CD + 监控
Week 6+ ─ uni-app x 尝鲜 + 复杂项目实战
```

💡 学习秘诀：把 uni-app 当「Vue 语法 + 小程序 API + 多端条件编译」三件套，脑子里始终装着"这段代码要在哪几个平台跑"。

---

## <span class="lv lv-3">高级</span> 附录 A：uni-app Vue3 多端商城脚手架（2025）

> 一份可 clone 即跑的 **H5 + 微信小程序 + iOS/Android App** 三端同源商城骨架，覆盖登录 / 首页 / 分类 / 详情 / 购物车 / 订单 / 支付 / 我的完整业务闭环。

💡 定位：不是玩具 demo，而是**能直接改成公司项目的最小可运行版本**——目录、规范、CI/CD、合规、性能优化全部预置。

### A.1 技术栈选型（2025 生产级）
🎯 目标：一份代码 5 端跑（H5 / 微信小程序 / iOS / Android），后续再加鸿蒙 Next。

| 分类 | 选型 | 备注 |
| ---- | ---- | ---- |
| 框架 | uni-app Vue3 + Vite 5 + TS 5.4 | 抛弃 Vue2 + webpack，冷启动快 5-10 倍 |
| 状态 | Pinia 3 + pinia-plugin-persistedstate-uni | setup 语法 + 跨端持久化 |
| UI | wot-design-uni 或 uv-ui + UnoCSS（含 unocss-preset-weapp）| 小程序类名安全 |
| 鉴权 | uni-id 云对象 + JWT | 微信 / App univerify / H5 短信三通道 |
| 支付 | uni.requestPayment 封装 | 微信 / 支付宝 / Apple Pay 统一 |
| 组件 | easycom 自动引入 | 零 import |
| 差异 | 条件编译 `#ifdef / #ifndef` | 三端差异集中管理 |
| 质量 | ESLint 9 flat + Prettier + Vitest | pre-commit lint-staged |
| CI/CD | GitHub Actions | 五端一次 push 全出 |

💡 为什么不选 vue-router？uni-app 路由基于 `pages.json`，用 `uni.navigateTo` 就够，硬塞 vue-router 反而破坏小程序编译。

### A.2 目录结构（分层清晰 · 三端差异集中）
🎯 核心思想：把**平台差异全部关进 `utils/platform/`**，业务层永远只写"一份"代码。

```
mall-uni/
├── src/
│   ├── api/               # request.ts（拦截器/401 刷新/Loading）+ modules/ + types/
│   ├── store/             # Pinia：user.ts cart.ts app.ts
│   ├── hooks/             # useProduct useLogin usePayment useShare useSkeleton
│   ├── components/        # easycom 自动引入：goods-card / empty-state / m-navbar
│   ├── pages/             # 主包 tabBar：index / category / cart / user / login
│   ├── subpackages/       # 分包：goods (detail/search) / order (list/detail/pay) / address
│   ├── utils/
│   │   ├── auth.ts  format.ts  request-queue.ts
│   │   └── platform/      # ⭐ 三端差异唯一栖息地：share/location/pay/download
│   ├── static/  styles/  App.vue  main.ts
│   ├── pages.json  manifest.json
├── uno.config.ts  vite.config.ts  tsconfig.json
├── .github/workflows/deploy.yml
└── package.json
```

💡 **一句话记忆**：`api → store → hooks → components → pages`，业务永远单向依赖，`utils/platform/` 是唯一允许写 `#ifdef` 的角落。

### A.3 uni-id 三端登录统一
🎯 目标：**上层业务只调用 `useLogin().login()`，底层按平台走不同链路，返回统一 JWT**。

- 微信小程序：`uni.login` → code → 云对象换 openid + token（一次授权）
- App：一键登录 univerify（运营商）+ 微信 App 授权兜底（免验证码）
- H5：短信验证码 + 微信公众号 OAuth 跳转（通用兜底）

💡 三端统一 JWT 存 Pinia + storage（`pinia-plugin-persistedstate-uni`），业务组件不感知登录方式差异。

```ts
// src/hooks/useLogin.ts
import { useUserStore } from '@/store/user'
import { loginByCode, loginByUniverify } from '@/api/modules/user'

export function useLogin() {
  const user = useUserStore()
  async function login() {
    // #ifdef MP-WEIXIN
    const { code } = await uni.login({ provider: 'weixin' })
    const { token, userInfo } = await loginByCode(code)
    user.setLogin(token, userInfo); return
    // #endif
    // #ifdef APP-PLUS
    try {
      const info = await uni.login({ provider: 'univerify' })
      const { token, userInfo } = await loginByUniverify(info.authResult)
      user.setLogin(token, userInfo); return
    } catch {
      const wx = await uni.login({ provider: 'weixin' })
      const { token, userInfo } = await loginByCode(wx.code)
      user.setLogin(token, userInfo); return
    }
    // #endif
    // #ifdef H5
    uni.navigateTo({ url: '/pages/login/sms' })
    // #endif
  }
  const logout = () => { user.clear(); uni.reLaunch({ url: '/pages/login/login' }) }
  return { login, logout, isLogin: () => !!user.token }
}
```

### A.4 关键源码（可直接复制到项目）
#### A.4.1 `src/main.ts` — 应用启动 + 全局错误捕获

```ts
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate-uni'
import 'uno.css'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  pinia.use(piniaPersist)
  app.use(pinia)

  app.config.errorHandler = (err, _inst, info) => {
    console.error('[GlobalError]', err, info)
    uni.$emit('app:error', { err, info })  // 上报 Sentry / 自研平台
  }
  // #ifdef H5
  window.addEventListener('unhandledrejection', (e) => console.error('[UnhandledRejection]', e.reason))
  // #endif

  return { app }
}
```

💡 `createSSRApp` 不是给 SSR 用的——是 uni-app Vue3 的固定写法，别改成 `createApp`。

#### A.4.2 `src/manifest.json` — 三端配置精简版

```json
{
  "name": "mall-uni", "appid": "__UNI__XXXXXXX", "versionName": "1.0.0", "versionCode": "100",
  "app-plus": {
    "modules": { "Payment": {}, "Share": {}, "OAuth": {}, "Push": {} },
    "distribute": {
      "android": { "minSdkVersion": 23, "targetSdkVersion": 34 },
      "ios": { "urlschemewhitelist": ["weixin", "alipay"] },
      "sdkConfigs": {
        "oauth": { "weixin": { "appid": "wxxxx" }, "univerify": {} },
        "payment": { "weixin": { "appid": "wxxxx" }, "alipay": {} }
      }
    }
  },
  "mp-weixin": {
    "appid": "wxaaaaaaaaaaaaaaaa",
    "setting": { "es6": true, "minified": true },
    "requiredPrivateInfos": ["getLocation", "chooseLocation"],
    "__usePrivacyCheck__": true,
    "lazyCodeLoading": "requiredComponents"
  },
  "h5": { "title": "潮购商城", "router": { "mode": "history", "base": "/" } }
}
```

🎯 `__usePrivacyCheck__: true` 是 2024 起微信小程序**强制的隐私协议弹窗**开关，不加会拒审。

#### A.4.3 `src/pages.json` — tabBar + 分包 + 预加载

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^wd-(.*)": "wot-design-uni/components/wd-$1/wd-$1.vue",
      "^m-(.*)": "@/components/m-$1/m-$1.vue"
    }
  },
  "pages": [
    { "path": "pages/index/index", "style": { "navigationStyle": "custom" } },
    { "path": "pages/category/category", "style": { "navigationBarTitleText": "分类" } },
    { "path": "pages/cart/cart", "style": { "navigationBarTitleText": "购物车" } },
    { "path": "pages/user/user", "style": { "navigationStyle": "custom" } },
    { "path": "pages/login/login", "style": { "navigationBarTitleText": "登录" } }
  ],
  "subPackages": [
    { "root": "subpackages/goods", "pages": [{ "path": "detail" }, { "path": "search" }] },
    { "root": "subpackages/order", "pages": [{ "path": "list" }, { "path": "detail" }, { "path": "pay" }] }
  ],
  "preloadRule": {
    "pages/index/index": { "network": "all", "packages": ["subpackages/goods"] },
    "pages/user/user":   { "network": "all", "packages": ["subpackages/order"] }
  },
  "tabBar": {
    "color": "#7A7E83", "selectedColor": "#FF3B30", "backgroundColor": "#FFFFFF",
    "list": [
      { "pagePath": "pages/index/index",       "text": "首页",  "iconPath": "static/tab/home.png", "selectedIconPath": "static/tab/home-a.png" },
      { "pagePath": "pages/category/category", "text": "分类",  "iconPath": "static/tab/cate.png", "selectedIconPath": "static/tab/cate-a.png" },
      { "pagePath": "pages/cart/cart",         "text": "购物车", "iconPath": "static/tab/cart.png", "selectedIconPath": "static/tab/cart-a.png" },
      { "pagePath": "pages/user/user",         "text": "我的",  "iconPath": "static/tab/user.png", "selectedIconPath": "static/tab/user-a.png" }
    ]
  }
}
```

💡 `preloadRule` 是**首屏进入主包后台预下载分包**的关键，让用户点进详情秒开，别忘配。

#### A.4.4 `src/api/request.ts` — 拦截器（Token + 401 刷新 + Loading 计数）

```ts
import { useUserStore } from '@/store/user'

const BASE_URL = import.meta.env.VITE_API_BASE
let loadingCount = 0
let refreshing: Promise<string> | null = null

const showLoading = () => { if (loadingCount++ === 0) uni.showLoading({ title: '加载中', mask: true }) }
const hideLoading = () => { if (--loadingCount <= 0) { loadingCount = 0; uni.hideLoading() } }

function refreshToken(): Promise<string> {
  if (refreshing) return refreshing
  const user = useUserStore()
  refreshing = new Promise<string>((resolve, reject) => {
    uni.request({
      url: BASE_URL + '/auth/refresh', method: 'POST',
      data: { refreshToken: user.refreshToken },
      success: (res: any) => res.data?.code === 0
        ? (user.setToken(res.data.data.token), resolve(res.data.data.token))
        : reject(res),
      fail: reject, complete: () => { refreshing = null },
    })
  })
  return refreshing
}

export interface Req {
  url: string; method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any; header?: Record<string, string>; loading?: boolean; _retry?: boolean
}

export function request<T = any>(opts: Req): Promise<T> {
  const user = useUserStore()
  if (opts.loading !== false) showLoading()
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + opts.url, method: opts.method || 'GET', data: opts.data,
      header: { 'Content-Type': 'application/json',
        ...(user.token ? { Authorization: 'Bearer ' + user.token } : {}), ...opts.header },
      success: async (res: any) => {
        if (res.statusCode === 401 && !opts._retry) {
          try { await refreshToken(); resolve(await request({ ...opts, _retry: true })) }
          catch { user.clear(); uni.reLaunch({ url: '/pages/login/login' }); reject(res) }
          return
        }
        if (res.data?.code === 0) resolve(res.data.data)
        else { uni.showToast({ title: res.data?.msg || '请求失败', icon: 'none' }); reject(res.data) }
      },
      fail: (err) => { uni.showToast({ title: '网络异常', icon: 'none' }); reject(err) },
      complete: () => { if (opts.loading !== false) hideLoading() },
    })
  })
}
```

🎯 **Loading 计数器**是并发请求下不闪烁的关键——一次发 5 个请求也只显示一个 loading。

#### A.4.5 `src/store/user.ts` — Pinia setup + 持久化

```ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo { id: number; nickname: string; avatar: string; mobile?: string }

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const refreshToken = ref('')
  const info = ref<UserInfo | null>(null)
  const isLogin = computed(() => !!token.value)

  const setLogin = (t: string, u: UserInfo, rt = '') => { token.value = t; refreshToken.value = rt; info.value = u }
  const setToken = (t: string) => { token.value = t }
  const clear    = () => { token.value = ''; refreshToken.value = ''; info.value = null }

  return { token, refreshToken, info, isLogin, setLogin, setToken, clear }
}, { persist: { key: 'mall_user', paths: ['token', 'refreshToken', 'info'] } })
```

#### A.4.6 `src/hooks/useProduct.ts` — 商品列表分页

```ts
import { ref, reactive } from 'vue'
import { fetchGoodsList } from '@/api/modules/goods'

export function useProduct(categoryId?: number) {
  const list = ref<any[]>([])
  const state = reactive({ page: 1, size: 20, loading: false, finished: false })

  async function load(reset = false) {
    if (state.loading || (state.finished && !reset)) return
    if (reset) { state.page = 1; state.finished = false; list.value = [] }
    state.loading = true
    try {
      const res = await fetchGoodsList({ page: state.page, size: state.size, categoryId })
      list.value = reset ? res.items : list.value.concat(res.items)
      state.finished = res.items.length < state.size
      state.page++
    } finally { state.loading = false }
  }

  return { list, state, load, refresh: () => load(true) }
}
```

#### A.4.7 `src/components/goods-card/goods-card.vue`

```vue
<template>
  <view class="goods-card" @tap="goDetail">
    <image class="cover" :src="goods.cover" mode="aspectFill" lazy-load />
    <view class="body">
      <text class="title">{{ goods.title }}</text>
      <view class="row">
        <text class="price">¥{{ formatMoney(goods.price) }}</text>
        <text class="sold">已售 {{ goods.sold }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { formatMoney } from '@/utils/format'
const props = defineProps<{ goods: { id: number; cover: string; title: string; price: number; sold: number } }>()
const goDetail = () => uni.navigateTo({ url: `/subpackages/goods/detail?id=${props.goods.id}` })
</script>

<style lang="scss" scoped>
.goods-card { background: #fff; border-radius: 16rpx; overflow: hidden; }
.cover { width: 100%; height: 340rpx; }
.body  { padding: 16rpx; }
.title { font-size: 28rpx; color: #222; @apply line-clamp-2; }
.row   { display: flex; justify-content: space-between; align-items: center; margin-top: 12rpx; }
.price { color: #ff3b30; font-size: 32rpx; font-weight: 600; }
.sold  { color: #999; font-size: 22rpx; }
</style>
```

#### A.4.8 `src/pages/index/index.vue` — 首页（骨架屏 + 下拉 + 触底）

```vue
<template>
  <view class="page">
    <m-navbar title="潮购商城" />
    <scroll-view scroll-y class="scroll" @scrolltolower="load()"
      refresher-enabled :refresher-triggered="refreshing" @refresherrefresh="onRefresh">
      <template v-if="!list.length && state.loading">
        <view v-for="i in 6" :key="i" class="sk" />
      </template>
      <view v-else class="grid">
        <goods-card v-for="g in list" :key="g.id" :goods="g" />
      </view>
      <view v-if="state.finished" class="finished">— 到底啦 —</view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProduct } from '@/hooks/useProduct'
const { list, state, load, refresh } = useProduct()
const refreshing = ref(false)
onMounted(() => load())
const onRefresh = async () => { refreshing.value = true; await refresh(); refreshing.value = false }
</script>

<style lang="scss" scoped>
.page   { height: 100vh; display: flex; flex-direction: column; }
.scroll { flex: 1; padding: 20rpx; box-sizing: border-box; }
.grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 20rpx; }
.sk     { height: 480rpx; background: linear-gradient(90deg, #eee, #f5f5f5, #eee); border-radius: 16rpx; }
.finished { text-align: center; color: #999; padding: 40rpx 0; font-size: 24rpx; }
</style>
```

#### A.4.9 `src/subpackages/order/pay.vue` — 支付三端封装

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { createPayOrder } from '@/api/modules/pay'

const amount = ref(0), orderId = ref('')
const picked = ref<'wxpay' | 'alipay'>('wxpay')

const methods = computed(() => {
  const arr: { code: 'wxpay' | 'alipay'; name: string }[] = []
  // #ifdef MP-WEIXIN || APP-PLUS
  arr.push({ code: 'wxpay', name: '微信支付' })
  // #endif
  // #ifdef H5 || APP-PLUS
  arr.push({ code: 'alipay', name: '支付宝' })
  // #endif
  return arr
})

async function doPay() {
  const params = await createPayOrder({ orderId: orderId.value, channel: picked.value })
  // #ifdef MP-WEIXIN
  await uni.requestPayment({ provider: 'wxpay', ...params })
  // #endif
  // #ifdef APP-PLUS
  await uni.requestPayment({ provider: picked.value, orderInfo: params.orderInfo })
  // #endif
  // #ifdef H5
  if (picked.value === 'wxpay') location.href = params.mwebUrl
  else document.write(params.form)
  // #endif
  uni.redirectTo({ url: `/subpackages/order/detail?id=${orderId.value}` })
}
onLoad((q: any) => { amount.value = Number(q.amount); orderId.value = q.orderId })
</script>
```

#### A.4.10 `src/utils/platform/share.ts` — 文件级条件编译

```ts
// #ifdef MP-WEIXIN
export function share(opts: { title: string; path: string; imageUrl?: string }) {
  return { title: opts.title, path: opts.path, imageUrl: opts.imageUrl }
}
// #endif
// #ifdef APP-PLUS
export function share(opts: { title: string; href: string; imageUrl?: string }) {
  uni.share({ provider: 'weixin', scene: 'WXSceneSession', type: 0,
    title: opts.title, href: opts.href, imageUrl: opts.imageUrl })
}
// #endif
// #ifdef H5
export function share(opts: { title: string; href: string }) {
  if (navigator.share) return navigator.share({ title: opts.title, url: opts.href })
  uni.setClipboardData({ data: opts.href })
}
// #endif
```

💡 三个 `export function share` 看似冲突，条件编译后**每端只剩一个**，业务方只 `import { share }` 即可。

### A.5 uni-app x（uts + uvue）扩展

🎯 何时用？**只做 Android/iOS 高性能 App**、要原生列表 60fps、或写 uts 原生插件。**小程序/H5 不要碰**，它不编译到那两端。
#### A.5.1 uts 工具函数（一份源码，Kotlin + Swift 双端产物）

```ts
// utssdk/common/format.uts
export function formatMoney(cents: number): string { return (cents / 100).toFixed(2) }

export function md5(input: string): string {
  // #ifdef APP-ANDROID
  const md = kotlinx.security.MessageDigest.getInstance('MD5')
  return md.digest(input.toByteArray()).joinToString('') { String.format('%02x', it) }
  // #endif
  // #ifdef APP-IOS
  return CryptoKit.Insecure.MD5.hash(data: input.data(using: .utf8)!)
    .map { String(format: "%02hhx", $0) }.joined()
  // #endif
}
```

💡 uts 是 **TypeScript 语法**，编译时按平台注入 Kotlin / Swift 语法块——一份代码双端原生性能。

#### A.5.2 uvue 页面示例（列表 + 手势）

```vue
<template>
  <list-view class="list" :bounces="true">
    <list-item v-for="(item, i) in items" :key="i" class="item" @touchstart="onStart" @touchmove="onMove">
      <text class="txt">{{ item.title }}</text>
    </list-item>
  </list-view>
</template>

<script setup lang="uts">
const items = ref<Array<{ title: string }>>([])
for (let i = 0; i < 500; i++) items.value.push({ title: '商品 ' + i })
let startX: number = 0
function onStart(e: TouchEvent) { startX = e.touches[0].pageX }
function onMove(e: TouchEvent)  { if (e.touches[0].pageX - startX < -50) console.log('左滑删除') }
</script>

<style>
.list { flex: 1; }
.item { height: 100px; justify-content: center; padding-left: 20px; }
.txt  { font-size: 16px; color: #222; }
</style>
```

🎯 uvue 用 flex 布局（**没有 rpx，只有 px**），list-view 是原生 RecyclerView / UITableView 的封装，5000 条数据滚动不掉帧。

### A.6 鸿蒙 Next 支持现状（2025）
💡 DCloud 已发布 **uni-app x 对 HarmonyOS Next** 的公测支持，产物为 ArkTS。

- **manifest 关键字段**：`"harmony-arkts": { "harmony_appid": "xxx", "distribute": { "icons": {} } }`
- **当前限制**（2025.07）：仅 uni-app x（uvue）支持鸿蒙 Next，Vue 版本**尚未**支持；`uni.requestPayment / login(univerify)` 需走华为账号 HMS；三方 SDK（微信/支付宝）等待厂商适配；HBuilderX 4.24+ 才能勾选"鸿蒙"编译目标。
- **策略建议**：新项目 App 端若要覆盖鸿蒙 Next，主 App 用 **uni-app x**；老项目继续用 Vue 版本 + 后期迁移。

🎯 一句话：**鸿蒙 Next = uni-app x only**，Vue 老项目暂时观望。

### A.7 打包与合规
#### A.7.1 H5

```bash
pnpm build:h5   # 产物在 dist/build/h5，直接放 Nginx / OSS + CDN
```

Nginx 关键配置（history 路由 + gzip）：

```
server {
  listen 80; root /var/www/mall-h5; gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;
  location / { try_files $uri $uri/ /index.html; }
  location ~* \.(js|css|png|jpg|svg|woff2)$ { expires 30d; add_header Cache-Control "public, immutable"; }
}
```

#### A.7.2 微信小程序（miniprogram-ci 自动上传）

```ts
// scripts/upload-mp.ts
import ci from 'miniprogram-ci'
import pkg from '../package.json'

const project = new ci.Project({
  appid: 'wxaaaaaaaaaaaaaaaa', type: 'miniProgram',
  projectPath: 'dist/build/mp-weixin',
  privateKeyPath: './keys/private.wxaaaaaaaaaaaaaaaa.key',
  ignores: ['node_modules/**/*'],
})
await ci.upload({ project, version: pkg.version, desc: 'ci auto upload',
  setting: { es6: true, minify: true, autoPrefixWXSS: true } })
```

🎯 合规：**微信隐私协议**必须在 mp.weixin.qq.com 后台 → 设置 → 用户隐私保护 提交，才能开启 `__usePrivacyCheck__`。

#### A.7.3 Android 离线打包 / iOS 打包

- **Android**：下载 Offline SDK，Android Studio 打开 `HBuilder-Integrate-AS`，复制 `dist/build/app-plus/` 到 `app/src/main/assets/apps/__UNI__XXX/www`，改 `dcloud_control.xml` appid；`targetSdkVersion 34`（2025 Google Play 强制）；权限**运行时动态申请**。
- **iOS**：Xcode 15+ 打开 HBuilder-Hello-iOS，替换资源、改 bundle id、配 URL Scheme（微信/支付宝）；Archive → App Store Connect → TestFlight；隐私清单 `PrivacyInfo.xcprivacy` **必填**（2024 起苹果强制）。

#### A.7.5 三端合规必做项

| 端 | 合规项 | 缺失后果 |
| -- | ------ | -------- |
| 微信小程序 | `__usePrivacyCheck__` + 后台配置隐私协议 | 拒审 |
| iOS | `PrivacyInfo.xcprivacy` 隐私清单 | 上架失败 |
| Android | 首启隐私弹窗 + targetSdk 34 | Play 拒审 |
| H5 | Cookie 提示（欧盟 GDPR）| 罚款 |

### A.8 CI/CD（GitHub Actions 五端一次 push 全出）

```yaml
name: mall-uni-multi-platform
on: { push: { tags: ['v*'] } }
jobs:
  build:
    runs-on: ubuntu-latest
    strategy: { matrix: { target: [h5, mp-weixin, mp-alipay] } }
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build:${{ matrix.target }}
      - uses: actions/upload-artifact@v4
        with: { name: '${{ matrix.target }}', path: 'dist/build/${{ matrix.target }}' }
  deploy-h5:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with: { name: h5, path: h5-dist }
      - uses: manyuanrong/setup-ossutil@master
        with:
          endpoint: oss-cn-shanghai.aliyuncs.com
          access-key-id: ${{ secrets.OSS_KEY }}
          access-key-secret: ${{ secrets.OSS_SECRET }}
      - run: ossutil cp -rf h5-dist/ oss://mall-h5/ --acl public-read
  upload-mp:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with: { name: mp-weixin, path: dist/build/mp-weixin }
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm i -g miniprogram-ci tsx
      - run: echo "${{ secrets.WX_PRIVATE_KEY }}" > keys/private.wxaaaaaaaaaaaaaaaa.key
      - run: tsx scripts/upload-mp.ts
  build-app-cloud:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: 触发 DCloud 云打包
        run: |
          curl -X POST https://open.dcloud.net.cn/ci/build \
            -H "Authorization: Bearer ${{ secrets.DCLOUD_TOKEN }}" \
            -d '{"appid":"__UNI__XXX","platform":["android","ios"]}'
```

💡 **一次 `git tag v1.0.1 && git push --tags`**，H5 上 OSS、微信小程序上传体验版、App 触发云打包——全自动。

🎯 **学习秘诀**：多端 = "**Vue3 语法 + uni.* API + 条件编译**" 三件套 + "**一个抽象层 `utils/platform/`**" 把差异集中管理。业务代码看不到 `#ifdef`，才算真正驾驭了 uni-app。

