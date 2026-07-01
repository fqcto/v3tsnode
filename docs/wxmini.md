# 微信小程序（原生）全阶段学习手册

> 面向前端 / 全栈开发者的微信小程序（原生）系统性学习文档。全文按 **初级 → 中级 → 高级** 三个阶段组织，涵盖从项目结构、生命周期、组件通信，到分包、Skyline、云开发、性能优化、安全与工程化的完整技能树。默认读者具备 HTML / CSS / JavaScript 基础，不涉及 Taro / uni-app 等跨端框架。

> 阅读建议：初级章节动手抄一遍即可；中级章节请配合 `wx.request` 封装、登录鉴权流程真正实现一次；高级章节需在**真机 + 体验版**下反复验证性能与兼容性。

## 目录

- [一、🟢 初级入门](#一-初级入门)
  - [1.1 小程序是什么 & 与 H5/App 对比](#11-小程序是什么--与-h5app-对比)
  - [1.2 双线程架构](#12-双线程架构)
  - [1.3 环境准备与账号注册](#13-环境准备与账号注册)
  - [1.4 项目结构详解](#14-项目结构详解)
  - [1.5 页面四件套](#15-页面四件套)
  - [1.6 app.json 关键字段](#16-appjson-关键字段)
  - [1.7 WXML 基础语法](#17-wxml-基础语法)
  - [1.8 WXSS 与 rpx 单位](#18-wxss-与-rpx-单位)
  - [1.9 Page 生命周期](#19-page-生命周期)
  - [1.10 App 生命周期](#110-app-生命周期)
  - [1.11 data 与 setData](#111-data-与-setdata)
  - [1.12 路由 API 对比](#112-路由-api-对比)
  - [1.13 常用组件速查](#113-常用组件速查)
  - [1.14 常用 API 速查](#114-常用-api-速查)
- [二、🟡 中级进阶](#二-中级进阶)
  - [2.1 自定义组件全解](#21-自定义组件全解)
  - [2.2 组件通信全景](#22-组件通信全景)
  - [2.3 Behaviors 混入](#23-behaviors-混入)
  - [2.4 slot / abstractNode / externalClasses / styleIsolation](#24-slot--abstractnode--externalclasses--styleisolation)
  - [2.5 template vs Component 取舍](#25-template-vs-component-取舍)
  - [2.6 wx.request 的 Promise 化封装](#26-wxrequest-的-promise-化封装)
  - [2.7 网络：uploadFile / downloadFile / WebSocket](#27-网络uploadfile--downloadfile--websocket)
  - [2.8 本地存储与安全](#28-本地存储与安全)
  - [2.9 登录鉴权完整流程](#29-登录鉴权完整流程)
  - [2.10 支付流程与常见坑](#210-支付流程与常见坑)
  - [2.11 Canvas 2D（新版）与海报生成](#211-canvas-2d新版与海报生成)
  - [2.12 分包 subpackages](#212-分包-subpackages)
  - [2.13 自定义 TabBar](#213-自定义-tabbar)
  - [2.14 事件系统进阶](#214-事件系统进阶)
  - [2.15 WXS 用法与场景](#215-wxs-用法与场景)
- [三、🔴 高级实战](#三-高级实战)
  - [3.1 性能优化清单](#31-性能优化清单)
  - [3.2 渲染层原理与双线程通信开销](#32-渲染层原理与双线程通信开销)
  - [3.3 Skyline 渲染引擎](#33-skyline-渲染引擎)
  - [3.4 云开发 CloudBase 最小 Demo](#34-云开发-cloudbase-最小-demo)
  - [3.5 插件与订阅消息](#35-插件与订阅消息)
  - [3.6 分享三件套：会话 / 朋友圈 / 海报](#36-分享三件套会话--朋友圈--海报)
  - [3.7 蓝牙 / 地理位置 / 传感器](#37-蓝牙--地理位置--传感器)
  - [3.8 小程序容器差异对比](#38-小程序容器差异对比)
  - [3.9 工程化：TypeScript / npm / ESLint](#39-工程化typescript--npm--eslint)
  - [3.10 常见坑与调试技巧](#310-常见坑与调试技巧)
  - [3.11 安全：签名 / 篡改 / 服务端校验](#311-安全签名--篡改--服务端校验)
  - [3.12 面试高频题 15 条](#312-面试高频题-15-条)

---

## 一、🟢 初级入门

### <span class="lv lv-1">初级</span> 1.1 小程序是什么 & 与 H5/App 对比

微信小程序是一种**运行在微信客户端内**的应用形态，不需要下载安装、即用即走；其代码包受微信运行时约束，通过 **WXML/WXSS/JS/JSON** 编写，最终由微信客户端在自有渲染层与逻辑层中执行，而非直接跑在浏览器里。

| 对比维度 | 小程序（原生） | H5（浏览器网页） | 原生 App |
| --- | --- | --- | --- |
| 运行环境 | 微信客户端 | 浏览器 | iOS / Android 系统 |
| 分发方式 | 扫码 / 搜一搜 / 分享 | URL 链接 | 应用商店 |
| 渲染引擎 | WebView + Skyline | WebView / 浏览器内核 | 原生 UIKit / View |
| DOM 访问 | 无（禁用 window/document） | 有 | 无（有 Native View） |
| 系统能力 | 通过 `wx.*` API | 有限（PWA 亦有限） | 完整 |
| 包体积上限 | 主包 2MB，总 30MB | 无 | 数十至数百 MB |
| 更新方式 | 版本审核 + 热更新（客户端拉取） | 刷新即最新 | 商店审核 |
| 开发效率 | 中（受平台约束） | 高 | 低（需双端） |

💡 一句话：小程序是**受微信运行时约束、以标签驱动的准 Web**，比 H5 多了系统能力与生命周期，比 App 少了自由度与包体积。

---

### <span class="lv lv-1">初级</span> 1.2 双线程架构

小程序 **视图层（Render / WebView）** 与 **逻辑层（AppService / JSCore·V8）** 分离，通过 Native 桥进行消息通信。这也是小程序与传统 Web 最本质的差异。

```text
+------------------------+         +------------------------+
|   View Thread (WXML)   |  <--->  | Logic Thread (JS)      |
|   WebView Renderer     | Native  | JSCore (iOS) / V8(And) |
|   WXML + WXSS 渲染      | Bridge  | Page / Component 逻辑   |
|   事件冒泡到逻辑层        |         | setData -> 数据回传给视图 |
+------------------------+         +------------------------+
             |                                |
             +---------- Native Layer --------+
                     wx.* API / 系统能力
```

- 视图层与逻辑层**互相不能直接访问**，一切数据通过 `setData` 序列化 → JSBridge → 视图层反序列化 → diff → 渲染。
- 这也是为什么 `setData` 数据不能太大、频率不能太高：**每次都是跨线程 JSON 序列化**。
- 无 `window` / `document` / `DOM` 对象；`setTimeout` 等基础能力保留。

🎯 记住关键词：**双线程、跨线程通信、setData 是瓶颈**。

---

### <span class="lv lv-1">初级</span> 1.3 环境准备与账号注册

1. 打开 <https://mp.weixin.qq.com> 注册**小程序账号**（个人 / 企业 / 政府 / 媒体）。
2. 登录后 → 「开发」 → 「开发管理」 → 「开发设置」查看 **AppID**（如 `wx1234567890abcdef`）。
3. 下载 **微信开发者工具**（Stable Build）：<https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html>。
4. 首次登录使用绑定的微信扫码。
5. 新建项目 → 选择 AppID（无 AppID 只能用测试号，功能受限，不能真机预览）→ 语言选 JavaScript / TypeScript → 选模板「不使用云服务 / 云开发」。
6. 建议同步安装 Node.js LTS，用于后续 `构建 npm`。

💡 个人号能开发，但**支付、直播、部分开放能力**只对企业号开放。

---

### <span class="lv lv-1">初级</span> 1.4 项目结构详解

```text
my-miniprogram/
├── app.js                # 全局逻辑入口，App({}) 定义
├── app.json              # 全局配置（页面路由、tabBar、窗口样式）
├── app.wxss              # 全局样式
├── project.config.json   # 开发者工具项目配置（AppID、编译选项）
├── project.private.config.json  # 本地私有配置（不入库）
├── sitemap.json          # 微信索引规则（是否允许被搜一搜收录）
├── package.json          # npm 依赖（需构建 npm）
├── tsconfig.json         # 使用 TypeScript 时
├── pages/                # 页面目录
│   ├── index/
│   │   ├── index.wxml
│   │   ├── index.wxss
│   │   ├── index.js
│   │   └── index.json
│   └── logs/
│       ├── logs.wxml
│       ├── logs.wxss
│       ├── logs.js
│       └── logs.json
├── components/           # 自定义组件
│   └── my-card/
│       ├── my-card.wxml
│       ├── my-card.wxss
│       ├── my-card.js
│       └── my-card.json
├── utils/                # 工具函数
│   ├── request.js
│   └── auth.js
├── images/               # 静态资源（尽量走 CDN）
└── miniprogram_npm/      # 构建 npm 后的产物（勿手改）
```

- 一个页面必须四件套 `.wxml / .wxss / .js / .json` **同名同目录**。
- `project.config.json` 保存编译版本、AppID、devtools 版本、`setting.urlCheck` 等，**入库共享**；`project.private.config.json` 是本地私有，通常 `.gitignore`。

🎯 记住：小程序目录**约定大于配置**，改名或漏文件都会直接编译失败。

---

### <span class="lv lv-1">初级</span> 1.5 页面四件套

| 文件 | 作用 | 类比 Web |
| --- | --- | --- |
| `.wxml` | 结构模板 | HTML |
| `.wxss` | 样式 | CSS |
| `.js` | 逻辑（Page/Component 构造器） | JS |
| `.json` | 页面级配置（标题、组件引用、下拉刷新等） | 无 |

```js
// pages/index/index.js
Page({
  data: { title: 'Hello' },
  onLoad(query) { console.log('页面加载', query) },
  onTapBtn() { this.setData({ title: 'Clicked!' }) }
})
```

```wxml
<!-- pages/index/index.wxml -->
<view class="page">
  <text>{{title}}</text>
  <button bindtap="onTapBtn">点我</button>
</view>
```

```wxss
/* pages/index/index.wxss */
.page { padding: 32rpx; }
```

```json
{
  "navigationBarTitleText": "首页",
  "enablePullDownRefresh": true
}
```

💡 页面 `.json` 会**覆盖** `app.json.window` 中的同名字段，颗粒度更细。

---

### <span class="lv lv-1">初级</span> 1.6 app.json 关键字段

```json
{
  "pages": [
    "pages/index/index",
    "pages/logs/logs"
  ],
  "window": {
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "示例小程序",
    "backgroundColor": "#f5f5f5",
    "enablePullDownRefresh": false
  },
  "tabBar": {
    "color": "#999",
    "selectedColor": "#07c160",
    "backgroundColor": "#fff",
    "list": [
      { "pagePath": "pages/index/index", "text": "首页", "iconPath": "images/home.png", "selectedIconPath": "images/home-a.png" },
      { "pagePath": "pages/mine/mine",  "text": "我的", "iconPath": "images/me.png",   "selectedIconPath": "images/me-a.png" }
    ]
  },
  "usingComponents": {
    "my-card": "/components/my-card/my-card"
  },
  "permission": {
    "scope.userLocation": { "desc": "用于展示附近门店" }
  },
  "subpackages": [
    { "root": "packageA", "pages": ["pages/detail/detail"] }
  ],
  "lazyCodeLoading": "requiredComponents"
}
```

- `pages` 数组第一项为**默认启动页**。
- `usingComponents` 放在 `app.json` 里即是**全局组件**（所有页面可用）。
- `permission` 用于需要用户授权的 scope 说明文本，2022 年后**强制必填**。
- `subpackages` 声明分包；`lazyCodeLoading: 'requiredComponents'` 开启按需注入。

🎯 `app.json` 是小程序的**路由表 + 全局样式配置中心**，写错一处直接白屏。

---

### <span class="lv lv-1">初级</span> 1.7 WXML 基础语法

**数据绑定**：

```wxml
<view>{{ user.name }}</view>
<view class="{{active ? 'on' : ''}}">切换</view>
<view style="color:{{color}};">带样式</view>
```

**列表渲染**：

```wxml
<view wx:for="{{list}}" wx:key="id" wx:for-item="item" wx:for-index="idx">
  {{idx}} - {{item.name}}
</view>
```

- `wx:key` **必须**且必须唯一，否则复用 diff 会出错。
- 支持 `wx:key="*this"`（数组本身为 primitive 时）。

**条件渲染**：

```wxml
<view wx:if="{{score >= 90}}">A</view>
<view wx:elif="{{score >= 60}}">B</view>
<view wx:else>C</view>

<view hidden="{{isHidden}}">display: none 版本</view>
```

- `wx:if` 是**惰性渲染**：切换时销毁 / 重建，初次消耗低但频繁切换开销大。
- `hidden` 是 CSS 显隐：初始都创建，切换开销小、初始消耗大。

**模板 template**（已被 Component 大量替代，了解即可）：

```wxml
<template name="userCard">
  <view>{{name}} - {{age}}</view>
</template>
<template is="userCard" data="{{name, age}}" />
```

**事件绑定**：

```wxml
<button bindtap="onTap">冒泡</button>
<button catchtap="onTap">阻止冒泡</button>
<view bind:tap="onTap">冒号语法等价</view>
```

💡 事件冒泡 = `bind*`，阻止冒泡 = `catch*`；`tap` 是小程序里的「点击」，等价于 web 的 click。

---

### <span class="lv lv-1">初级</span> 1.8 WXSS 与 rpx 单位

**rpx（responsive pixel）** 是小程序的响应式单位：

```
1rpx = 屏幕宽度(px) / 750
```

以 iPhone 6（375px 宽）为基准：`750rpx = 375px`，即 `1rpx = 0.5px`。任何屏幕下 `750rpx` 都等于屏幕宽度，所以设计稿可按 750 宽度做，直接抄尺寸。

```wxss
/* app.wxss */
@import "./styles/reset.wxss";

.container {
  width: 750rpx;
  padding: 32rpx 24rpx;
  font-size: 28rpx;
  color: #333;
}
```

**选择器限制**：

- 支持 `.class`、`#id`、`tag`、`::after`、`nth-child` 等常规选择器。
- **不支持** `*` 通配，也不支持属性选择器 `[data-x=1]` 的部分场景（视版本）。
- 组件默认样式隔离，父页面样式**默认穿透不到组件内部**（除非 `styleIsolation` 设置）。

💡 页面尺寸做等比缩放时 **只写 rpx**；边框 1px 想始终物理 1 像素时用 `1px` 而非 `2rpx`。

---

### <span class="lv lv-1">初级</span> 1.9 Page 生命周期

```js
Page({
  data: {},
  onLoad(query) { /* 页面首次加载，query 是路由参数 */ },
  onShow() { /* 每次进入页面（含返回） */ },
  onReady() { /* 首次渲染完成，可以操作节点 */ },
  onHide() { /* 页面被隐藏（跳到别的页面） */ },
  onUnload() { /* 页面被销毁（navigateBack 后本页 unload） */ },
  onPullDownRefresh() { /* 下拉刷新 */ },
  onReachBottom() { /* 上拉触底 */ },
  onShareAppMessage() { return { title: '分享标题', path: '/pages/index/index' } },
  onShareTimeline() { return { title: '朋友圈标题' } },
  onPageScroll(e) { /* 滚动 e.scrollTop，注意性能 */ }
})
```

**调用顺序**（首次进入）：`onLoad → onShow → onReady`。

**再次进入（switchTab / navigateBack）**：只触发 `onShow`。

🎯 `onLoad` 只跑一次，做**参数解析、数据初始化**；`onShow` 每次都跑，做**权限刷新、埋点**。

---

### <span class="lv lv-1">初级</span> 1.10 App 生命周期

```js
// app.js
App({
  globalData: { userInfo: null },
  onLaunch(options) {
    // 冷启动只跑一次
    console.log('场景值:', options.scene)
  },
  onShow(options) { /* 前台切回 */ },
  onHide() { /* 切到后台 */ },
  onError(err) { /* 未捕获异常上报 */ },
  onPageNotFound(res) {
    // 路由不存在时兜底
    wx.reLaunch({ url: '/pages/index/index' })
  },
  onUnhandledRejection(res) { /* Promise 未捕获 */ },
  onThemeChange(res) { /* 系统深浅色切换 */ }
})
```

- `getApp()` 可以在任何页面拿到 `App` 实例，进而访问 `globalData`（**注意：不要用它做响应式共享**，改了不会自动通知视图层）。

💡 全局数据小、变更少可以用 `globalData`；否则用**独立 store / EventBus**。

---

### <span class="lv lv-1">初级</span> 1.11 data 与 setData

```js
Page({
  data: { count: 0, list: [] },
  add() {
    // ✅ 只传变化字段
    this.setData({ count: this.data.count + 1 })
  },
  updateItem(i, name) {
    // ✅ 精确路径更新，避免整个 list 序列化
    this.setData({ [`list[${i}].name`]: name })
  },
  bad() {
    // ❌ 反例：全量传大对象
    this.setData({ list: this.data.list })
  }
})
```

**setData 性能红线**：

- **单次数据量 < 256KB**（超过会被截断报错）。
- **频率 < 30 次/秒**，能合并就合并。
- **只传变化字段**，用路径写法 `a.b.c` 或 `list[0].name`。
- 视图层无关的数据放 `this._xxx` 或普通变量，**不要放 data**。

🎯 一句箴言：**setData 是跨线程序列化，能少调就少调，能小传就小传。**

---

### <span class="lv lv-1">初级</span> 1.12 路由 API 对比

| API | 是否入栈 | 页面栈上限 | tabBar 页可用？ | 说明 |
| --- | --- | --- | --- | --- |
| `wx.navigateTo` | 是（push） | 10 层 | ❌ 不能跳到 tab | 常规跳转，能返回 |
| `wx.redirectTo` | 否（replace 当前） | 无变化 | ❌ | 关闭当前，跳新页 |
| `wx.switchTab` | 关闭非 tab 页 | 只剩 tab | ✅ 仅跳到 tab | 切到 tabBar 页 |
| `wx.navigateBack` | 出栈 | delta 层 | - | 返回上一页 / N 页 |
| `wx.reLaunch` | 清空栈 | 1 | ✅ | 关闭所有页面并跳转 |

```js
wx.navigateTo({
  url: '/pages/detail/detail?id=123&name=abc',
  events: { fromDetail(data) { console.log(data) } },
  success(res) {
    res.eventChannel.emit('fromIndex', { hello: 'world' })
  }
})
```

**取参**：目标页 `onLoad(query)` 里 `query.id === '123'`。

**页面间通信** 推荐 `eventChannel`（如上），比 URL 传 JSON 优雅。

💡 页面栈 10 层是硬上限；深层跳转请用 `redirectTo` 释放栈位。

---

### <span class="lv lv-1">初级</span> 1.13 常用组件速查

| 组件 | 用途 | 关键属性 |
| --- | --- | --- |
| `view` | 通用容器 | `hover-class`、`catchtap` |
| `text` | 文本，可选中 | `selectable`、`space` |
| `image` | 图片 | `mode`（aspectFit/aspectFill/widthFix）、`lazy-load` |
| `button` | 按钮 | `open-type`（getUserInfo/getPhoneNumber/share/contact） |
| `input` | 单行输入 | `type`、`password`、`bindinput`、`confirm-type` |
| `textarea` | 多行输入 | `auto-height`、`maxlength` |
| `scroll-view` | 可滚动容器 | `scroll-y`、`refresher-enabled`、`scroll-into-view` |
| `swiper` | 轮播 | `autoplay`、`interval`、`circular`、`indicator-dots` |
| `picker` | 选择器 | `mode`（selector/multiSelector/date/time/region） |
| `navigator` | 声明式跳转 | `open-type`、`url`、`hover-class` |
| `form` | 表单容器 | `bindsubmit`、`bindreset` |
| `checkbox` / `checkbox-group` | 复选 | `value`、`checked` |
| `radio` / `radio-group` | 单选 | `value` |
| `icon` | 图标 | `type`（success/warn/info/cancel）、`size` |

💡 `image` 默认宽 300px 高 240px，**必须自己设尺寸**；`mode="widthFix"` 常用于自适应高度。

---

### <span class="lv lv-1">初级</span> 1.14 常用 API 速查

```js
// 网络
wx.request({
  url: 'https://api.demo.com/users',
  method: 'GET',
  header: { 'content-type': 'application/json' },
  data: { page: 1 },
  success: (res) => console.log(res.data),
  fail: (err) => console.error(err)
})

// 提示
wx.showToast({ title: '成功', icon: 'success', duration: 1500 })
wx.showModal({ title: '提示', content: '确定删除？', success(res) { if (res.confirm) {} } })
wx.showLoading({ title: '加载中', mask: true })
wx.hideLoading()

// 存储（有同步与异步两版）
wx.setStorageSync('token', 'abc')
const token = wx.getStorageSync('token')
wx.removeStorageSync('token')

// 用户信息（2021 后策略）
// wx.getUserInfo 已不推荐；需 button open-type=getUserProfile
wx.getUserProfile({
  desc: '用于完善会员资料',
  success(res) { console.log(res.userInfo) }
})
```

- `wx.request` 域名必须在**微信公众平台后台**「服务器域名」里配置，且**必须 HTTPS**。开发者工具可勾选「不校验域名」调试。
- Storage 单个 key 上限约 1MB，总量 10MB。

🎯 建议**第一天**就写一个 `utils/request.js` 把 `wx.request` Promise 化，避免后期回调地狱。

---

## 二、🟡 中级进阶

### <span class="lv lv-2">中级</span> 2.1 自定义组件全解

```js
// components/my-card/my-card.js
Component({
  options: {
    styleIsolation: 'isolated',      // 样式隔离
    multipleSlots: true,             // 多 slot
    addGlobalClass: false            // 允许全局类名穿透
  },
  properties: {
    title: { type: String, value: '' },
    price: { type: Number, value: 0, observer(newV, oldV) { /* 属性变化回调 */ } }
  },
  data: { internal: 0 },
  observers: {
    'title, price'(t, p) { console.log('title 或 price 变化', t, p) },
    'user.name'(name) {}
  },
  lifetimes: {
    created() { /* 实例创建，还不能 setData */ },
    attached() { /* 进入页面节点树 */ },
    ready() { /* 组件布局完成 */ },
    moved() {},
    detached() { /* 从节点树移除 */ },
    error(err) {}
  },
  pageLifetimes: {
    show() { /* 组件所在页 show */ },
    hide() {},
    resize() {}
  },
  methods: {
    onBuy() {
      this.triggerEvent('buy', { id: 1 }, { bubbles: false, composed: false })
    }
  }
})
```

```json
{ "component": true }
```

**页面使用**：

```json
{ "usingComponents": { "my-card": "/components/my-card/my-card" } }
```

```wxml
<my-card title="iPhone" price="{{6999}}" bind:buy="onBuy" />
```

💡 组件的 `data` **不响应外部**；外部传的值走 `properties`。`observers` 是 Component 版的 watch，比 `properties.observer` 更强大（可多字段 / 路径 / 通配符）。

---

### <span class="lv lv-2">中级</span> 2.2 组件通信全景

```text
                 父页面 / 父组件
        properties ↓         ↑ triggerEvent
                子组件 A
                    |
               relations / selectComponent
                    |
                子组件 B（兄弟 / 跨层级）
```

| 场景 | 方式 | 示例 |
| --- | --- | --- |
| 父 → 子 | properties | `<child title="a" />` |
| 子 → 父 | triggerEvent + bind | `this.triggerEvent('ok', payload)` |
| 兄弟 | EventBus / 全局 store | 见下方 |
| 跨层级 | `selectComponent` / relations | `this.selectComponent('#child')` |
| 全局 | `getApp().globalData` / MobX-miniprogram / Redux | - |

**极简 EventBus**：

```js
// utils/bus.js
const bus = { map: {} }
export const on  = (k, cb) => (bus.map[k] = bus.map[k] || []).push(cb)
export const off = (k, cb) => bus.map[k] = (bus.map[k] || []).filter(f => f !== cb)
export const emit = (k, d) => (bus.map[k] || []).forEach(f => f(d))
```

**relations（父子组件强绑定，如 tabs / tab-pane）**：

```js
// tabs.js
Component({
  relations: {
    './tab-pane': {
      type: 'child',
      linked(child) { /* 有子组件挂载 */ },
      unlinked(child) {}
    }
  }
})
```

🎯 组件通信首选 `properties + triggerEvent`；跨层级复杂共享上 **全局 store**（推荐 `mobx-miniprogram-bindings`）。

---

### <span class="lv lv-2">中级</span> 2.3 Behaviors 混入

```js
// behaviors/loading.js
export default Behavior({
  data: { loading: false },
  methods: {
    showLoading() { this.setData({ loading: true }) },
    hideLoading() { this.setData({ loading: false }) }
  },
  lifetimes: {
    attached() { console.log('behavior attached') }
  }
})
```

```js
import loading from '../../behaviors/loading'
Component({
  behaviors: [loading],
  methods: {
    async fetchData() {
      this.showLoading()
      // ...
      this.hideLoading()
    }
  }
})
```

- 类似 Vue 2 mixin，可复用 `properties / data / methods / lifetimes / observers`。
- 官方内置 `wx://form-field`、`wx://component-export` 等。

💡 Behavior 冲突时优先级：**组件本身 > 后置 behavior > 前置 behavior**。

---

### <span class="lv lv-2">中级</span> 2.4 slot / abstractNode / externalClasses / styleIsolation

**单 slot**：

```wxml
<!-- my-panel.wxml -->
<view class="panel">
  <slot></slot>
</view>
```

**多 slot（需开启）**：

```js
Component({ options: { multipleSlots: true } })
```

```wxml
<view class="panel">
  <slot name="header"></slot>
  <slot></slot>
  <slot name="footer"></slot>
</view>
```

```wxml
<my-panel>
  <view slot="header">头</view>
  <view>正文</view>
  <view slot="footer">脚</view>
</my-panel>
```

**externalClasses（让父页样式穿透进组件）**：

```js
Component({ externalClasses: ['card-class'] })
```

```wxml
<view class="card-class">内部</view>
```

```wxml
<my-card card-class="my-red" />
```

**styleIsolation**：

| 值 | 组件样式隔离 | 页面样式影响组件 | 组件样式影响页面 |
| --- | --- | --- | --- |
| `isolated`（默认） | 是 | 否 | 否 |
| `apply-shared` | 部分 | ✅ 是 | 否 |
| `shared` | 否 | ✅ 是 | ✅ 是 |

🎯 设计通用 UI 组件用 `isolated + externalClasses`；业务组件想要页面样式复用可用 `apply-shared`。

---

### <span class="lv lv-2">中级</span> 2.5 template vs Component 取舍

| 维度 | `<template>` | `Component` |
| --- | --- | --- |
| 逻辑 | 无（只是模板复用） | 有独立 js/data/methods |
| 样式 | 走页面样式 | 隔离 |
| 生命周期 | 无 | 有 |
| 通信 | 靠父页 data | properties / event |
| 场景 | 纯结构复用（如列表项） | 带交互 / 状态的 UI |

💡 **新项目一律用 Component**，template 仅作历史遗留知识了解。

---

### <span class="lv lv-2">中级</span> 2.6 wx.request 的 Promise 化封装

```js
// utils/request.js
const BASE_URL = 'https://api.demo.com'

const pending = new Map() // 取消重复请求

function getToken() { return wx.getStorageSync('token') }

function toKey(opt) { return `${opt.method}:${opt.url}:${JSON.stringify(opt.data || {})}` }

export function request(options) {
  const opt = {
    method: 'GET',
    header: { 'content-type': 'application/json' },
    ...options,
    url: /^https?:/.test(options.url) ? options.url : BASE_URL + options.url
  }
  const token = getToken()
  if (token) opt.header.Authorization = 'Bearer ' + token

  const key = toKey(opt)
  if (pending.has(key)) pending.get(key).abort()

  if (!opt.hideLoading) wx.showLoading({ title: '加载中', mask: true })

  return new Promise((resolve, reject) => {
    const task = wx.request({
      ...opt,
      success(res) {
        if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode))
        const body = res.data
        if (body.code === 0) return resolve(body.data)
        if (body.code === 401) {
          wx.removeStorageSync('token')
          wx.reLaunch({ url: '/pages/login/login' })
          return reject(new Error('未登录'))
        }
        wx.showToast({ title: body.msg || '请求失败', icon: 'none' })
        reject(new Error(body.msg))
      },
      fail(err) {
        wx.showToast({ title: '网络异常', icon: 'none' })
        reject(err)
      },
      complete() {
        pending.delete(key)
        if (!opt.hideLoading) wx.hideLoading()
      }
    })
    pending.set(key, task)
  })
}

export const get  = (url, data, o = {}) => request({ url, method: 'GET',  data, ...o })
export const post = (url, data, o = {}) => request({ url, method: 'POST', data, ...o })
```

调用：

```js
import { get, post } from '../../utils/request'
async function loadUser() {
  const user = await get('/users/me')
  console.log(user)
}
```

🎯 封装拦截器时一定要处理：**loading 计数、token 失效、重复请求取消、错误 toast、业务码 vs HTTP 状态码**。

---

### <span class="lv lv-2">中级</span> 2.7 网络：uploadFile / downloadFile / WebSocket

**文件上传**：

```js
wx.chooseMedia({
  count: 1, mediaType: ['image'],
  success: (res) => {
    wx.uploadFile({
      url: 'https://api.demo.com/upload',
      filePath: res.tempFiles[0].tempFilePath,
      name: 'file',
      formData: { biz: 'avatar' },
      header: { Authorization: 'Bearer ' + wx.getStorageSync('token') },
      success(r) { console.log(JSON.parse(r.data)) }
    })
  }
})
```

**文件下载**：

```js
wx.downloadFile({
  url: 'https://cdn.demo.com/a.pdf',
  success(res) {
    wx.openDocument({ filePath: res.tempFilePath })
  }
})
```

**WebSocket**：

```js
const socket = wx.connectSocket({ url: 'wss://ws.demo.com/chat' })
wx.onSocketOpen(() => wx.sendSocketMessage({ data: JSON.stringify({ type: 'hello' }) }))
wx.onSocketMessage(msg => console.log(msg.data))
wx.onSocketClose(() => console.log('closed'))
wx.onSocketError(err => console.error(err))
```

- 上传单文件 **≤ 100MB**，下载 **≤ 200MB**（新版更宽松）。
- WebSocket 后台可能被断开，需要**心跳 + 重连**逻辑。

💡 服务器域名（request / uploadFile / downloadFile / socket）都要单独在后台配置，且必须 HTTPS/WSS。

---

### <span class="lv lv-2">中级</span> 2.8 本地存储与安全

- **同步 API**：`wx.setStorageSync / getStorageSync`；异步版加 `Async`。
- **单 key ≤ 1MB，总量 10MB**；超限会静默失败（老版本）或直接 fail。
- 存的是 JSON 序列化后的字符串，函数、循环引用不能存。
- **不要存明文密码、身份证、支付密钥**；`token` 存可以，但要设过期时间。
- 卸载重装、清微信数据、系统清缓存都会导致 Storage 丢失。
- 想安全一点可自行 AES 加密后再写入。

```js
// utils/store.js
export function setItem(k, v, ttl) {
  wx.setStorageSync(k, { v, exp: ttl ? Date.now() + ttl : 0 })
}
export function getItem(k) {
  const r = wx.getStorageSync(k)
  if (!r) return null
  if (r.exp && Date.now() > r.exp) { wx.removeStorageSync(k); return null }
  return r.v
}
```

🎯 Storage 只当**离线缓存和登录态**用，别当数据库。

---

### <span class="lv lv-2">中级</span> 2.9 登录鉴权完整流程

```text
+--------+                                             +---------+           +----------+
| 前端   |                                             | 业务后端 |           | 微信服务 |
+--------+                                             +---------+           +----------+
    | 1. wx.login() 获取 code                              |                        |
    |----------------------------------------------------->|                        |
    | 2. POST /auth/wxlogin { code }                       |                        |
    |----------------------------------------------------->|                        |
    |                                                      | 3. code2Session         |
    |                                                      |------------------------>|
    |                                                      | 4. { openid, session_key, unionid? }
    |                                                      |<------------------------|
    |                                                      | 5. 生成自定义 token / 落库 |
    | 6. { token, userInfo }                               |                        |
    |<-----------------------------------------------------|                        |
    | 7. wx.setStorageSync('token', token)                 |                        |
    | 8. 后续请求 Header: Authorization: Bearer <token>    |                        |
    |----------------------------------------------------->|                        |
```

**前端关键代码**：

```js
// utils/auth.js
import { post } from './request'

export async function login() {
  const { code } = await wx.login()          // 1
  const { token, user } = await post('/auth/wxlogin', { code }) // 2~6
  wx.setStorageSync('token', token)          // 7
  wx.setStorageSync('user', user)
  return user
}

export async function ensureLogin() {
  const token = wx.getStorageSync('token')
  if (!token) return login()
  // 可加 wx.checkSession() 判断 session_key 是否失效
  try { await wx.checkSession() } catch { return login() }
  return wx.getStorageSync('user')
}
```

**要点**：

- `code` 只能用一次、5 分钟过期；用完立即换 `openid + session_key`。
- `session_key` **绝对不能给前端**，只能在服务端持有并用于解密加密数据（如手机号）。
- 自定义 `token` 建议 JWT，2 小时短 + Refresh Token 一周长。

🎯 「拿 code → 后端换 openid → 生成 token → 前端存」这条链路必须能闭着眼默写。

---

### <span class="lv lv-2">中级</span> 2.10 支付流程与常见坑

```text
用户点购买
   ↓ 前端 wx.login → code → 换 openid
   ↓ 调后端 /order/create
后端:
   ↓ 生成商户订单号
   ↓ 调微信统一下单 API (JSAPI) 拿到 prepay_id
   ↓ 服务端二次签名 (paySign)
   ↓ 返回 { timeStamp, nonceStr, package, signType, paySign }
前端 wx.requestPayment(上面 5 个字段)
   ↓ success -> 展示支付成功页
   ↓ fail    -> 用户取消 / 参数错误 / 商户校验失败
微信异步回调后端 notify_url:
   ↓ 验签 + 校验金额 + 幂等落库
   ↓ 更新订单状态
```

```js
const params = await post('/order/create', { skuId: 1 })
wx.requestPayment({
  ...params,
  success: () => wx.redirectTo({ url: '/pages/order/success' }),
  fail:    () => wx.showToast({ title: '支付未完成', icon: 'none' })
})
```

**常见坑**：

- **签名不通过**：多半是 `key` 用错（v2 vs v3 API Key）、字段顺序错、编码不对。
- **金额单位**：微信是**分**，不是元，容易少乘 100。
- **幂等**：微信可能重复通知 `notify_url`，一定要用商户订单号做幂等。
- 前端 `success` 只表示**微信侧已收款**，订单真正完成必须以**后端 notify 校验**为准。

💡 支付所有金额、签名、订单状态**都以服务端为准**，前端只是唤起支付面板。

---

### <span class="lv lv-2">中级</span> 2.11 Canvas 2D（新版）与海报生成

```wxml
<canvas type="2d" id="poster" style="width:600rpx;height:900rpx;"></canvas>
<button bindtap="genPoster">生成海报</button>
```

```js
Page({
  async genPoster() {
    const query = wx.createSelectorQuery()
    query.select('#poster').fields({ node: true, size: true }).exec(async (res) => {
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width  = res[0].width  * dpr
      canvas.height = res[0].height * dpr
      ctx.scale(dpr, dpr)

      // 背景
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, res[0].width, res[0].height)

      // 图片（需要 canvas.createImage）
      const img = canvas.createImage()
      await new Promise((r, j) => { img.onload = r; img.onerror = j; img.src = 'https://cdn.demo.com/a.png' })
      ctx.drawImage(img, 20, 20, 200, 200)

      // 文本
      ctx.fillStyle = '#333'
      ctx.font = '28px sans-serif'
      ctx.fillText('欢迎来到小程序', 20, 260)

      // 导出临时图片
      wx.canvasToTempFilePath({
        canvas,
        success: (r) => {
          wx.saveImageToPhotosAlbum({ filePath: r.tempFilePath })
        }
      })
    })
  }
})
```

**新旧对比**：

| 项 | 旧版 `wx.createCanvasContext` | 新版 `type="2d"` |
| --- | --- | --- |
| 上下文 | 微信自定义 | 原生 Canvas 2D API |
| 图片加载 | `wx.getImageInfo` + `drawImage` | `canvas.createImage()` |
| 性能 | 慢，指令栈 | 直接原生渲染 |
| API 完整度 | 简化版 | 接近浏览器 |

🎯 **一律用 `type="2d"` 新版**，旧版仅维护老项目时才用。

---

### <span class="lv lv-2">中级</span> 2.12 分包 subpackages

```json
{
  "pages": ["pages/index/index"],
  "subpackages": [
    { "root": "packageA", "name": "A", "pages": ["pages/detail/detail"] },
    { "root": "packageB", "name": "B", "pages": ["pages/mine/mine"], "independent": true }
  ],
  "preloadRule": {
    "pages/index/index": { "network": "all", "packages": ["A"] }
  }
}
```

| 类型 | 特点 | 场景 |
| --- | --- | --- |
| **普通分包** | 依赖主包，用户进入分包页时下载 | 二级页、活动页 |
| **独立分包** `independent: true` | 不依赖主包，可单独启动，加载最快 | 广告落地页、扫码活动页 |
| **分包预下载** `preloadRule` | 主包某页进入后偷偷下载指定分包 | 用户大概率会进的详情页 |

**硬性限制**：

- **单个分包 ≤ 2MB**，**主包 ≤ 2MB**，**总包 ≤ 30MB**。
- 主包放：`app.*`、tabBar 页面、必要公共资源。
- 分包不能引用其他分包的组件（除非在主包）。
- 独立分包不能访问主包的 `App` 实例、`globalData`。

💡 **主包只保留启动必需**，几乎所有业务页面都应放分包。

---

### <span class="lv lv-2">中级</span> 2.13 自定义 TabBar

**app.json**：

```json
{
  "tabBar": {
    "custom": true,
    "list": [
      { "pagePath": "pages/index/index", "text": "首页" },
      { "pagePath": "pages/mine/mine",  "text": "我的" }
    ]
  }
}
```

**新建 `custom-tab-bar/index` 组件（路径固定！）**：

```wxml
<!-- custom-tab-bar/index.wxml -->
<cover-view class="tabbar">
  <cover-view wx:for="{{list}}" wx:key="pagePath" bindtap="switchTab" data-path="/{{item.pagePath}}">
    <cover-image src="{{selected === index ? item.selectedIconPath : item.iconPath}}" />
    <cover-view>{{item.text}}</cover-view>
  </cover-view>
</cover-view>
```

```js
Component({
  data: {
    selected: 0,
    list: [
      { pagePath: 'pages/index/index', text: '首页', iconPath: '/i/h.png', selectedIconPath: '/i/h-a.png' },
      { pagePath: 'pages/mine/mine',  text: '我的', iconPath: '/i/m.png', selectedIconPath: '/i/m-a.png' }
    ]
  },
  methods: {
    switchTab(e) { wx.switchTab({ url: e.currentTarget.dataset.path }) }
  }
})
```

在 tab 页 `onShow` 里更新 selected：

```js
onShow() {
  const tabBar = this.getTabBar()
  tabBar && tabBar.setData({ selected: 0 })
}
```

🎯 自定义 TabBar 才能实现「中间凸起按钮、红点、动画、异形」等设计。

---

### <span class="lv lv-2">中级</span> 2.14 事件系统进阶

**冒泡事件**（**默认冒泡**）：`tap / longpress / touchstart / touchmove / touchend / touchcancel`。

**非冒泡事件**（默认不冒泡）：`input / change / submit / focus / blur / scroll` 等表单事件。

**绑定语法**：

| 前缀 | 冒泡 | 特殊 |
| --- | --- | --- |
| `bind` / `bind:` | ✅ 冒泡 | 常规 |
| `catch` / `catch:` | ❌ 阻止冒泡 | 阻止后不再往上派发 |
| `capture-bind:` | ✅ 捕获阶段 | 从外往内 |
| `capture-catch:` | ❌ 捕获阶段阻断 | 后续所有阶段都不派发 |
| `mut-bind:` | ✅ 但互斥 | 同一事件在多个 mut-bind 里**只触发一个**（父子内层优先） |

**事件对象**：

```js
onTap(e) {
  console.log(e.type)              // 'tap'
  console.log(e.currentTarget.dataset.id) // <view data-id="1">
  console.log(e.target)            // 事件源
  console.log(e.detail)            // 组件自定义数据
  console.log(e.touches, e.changedTouches)
}
```

💡 `currentTarget` = 绑定事件的元素；`target` = 真正触发的元素（可能是内部子元素）。传参用 `data-*`，取值用 `e.currentTarget.dataset.xxx`。

---

### <span class="lv lv-2">中级</span> 2.15 WXS 用法与场景

WXS = **WeiXin Script**，运行在**视图层**，不受双线程通信开销影响，用于**模板内的复杂表达式与过滤**。

```wxml
<wxs module="fmt">
  var toFixed = function (n, d) { return n.toFixed(d || 2) }
  var pad = function (n) { return n < 10 ? '0' + n : '' + n }
  var fmtTime = function (ts) {
    var d = getDate(ts)
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
  }
  module.exports = { toFixed: toFixed, fmtTime: fmtTime }
</wxs>

<view>￥{{ fmt.toFixed(price, 2) }}</view>
<view>{{ fmt.fmtTime(createTime) }}</view>
```

**能做什么**：

- 模板过滤（价格、日期、字符串截断）。
- 触摸事件在视图层的**高频响应**（如拖拽），不用 setData 就能改变样式：`<view change:prop="{{fn.onPropChange}}" bind:touchmove="{{fn.onMove}}">`。
- 独立文件 `xxx.wxs`，`<wxs src="./xxx.wxs" module="xxx" />`。

**不能做什么**：

- 不能调用 `wx.*`。
- 不支持 ES6（无 `let/const/arrow`，只能 `var/function`）。
- 不能操作 DOM，也拿不到 Page 实例。

🎯 需要**列表里做一次性大量格式化** 或 **高频交互（拖动跟手）** 时，WXS 是性能救星。

---

## 三、🔴 高级实战

### <span class="lv lv-3">高级</span> 3.1 性能优化清单

**setData 优化**：

- 合并多次 `setData` 为一次。
- 用路径 `list[3].name` 局部更新。
- 单次 payload **< 256KB**；频率 **< 30 次/秒**。
- 视图无关数据放 `this._x`，不放 data。
- 长列表更新用 **diff 后精确 setData**，或使用 skyline 的 `worklet`。

**长列表**：

- 官方 `<recycle-view>`（微信实验组件）或社区 `virtual-list`。
- 分页 + 懒加载 + `image lazy-load`。
- 每个 item 用 `wx:key` 保持复用。

**图片**：

- 使用 **WebP / AVIF** + CDN；`image mode="aspectFill" lazy-load`。
- 首屏图**内联 base64 或本地占位**，避免网络白屏。
- 大图缩略图化 (CDN 参数 `?imageView2/2/w/300`)。

**首屏**：

- 骨架屏（可用 [skeleton-webpack-plugin](https://github.com/famanoder/dwt) 或手撸）。
- 分包 + 分包预下载。
- `app.onLaunch` 里不做重逻辑，登录延后到具体页。

**启动优化**：

- 主包 < 1.5MB，接近 2MB 上限就分包。
- `"lazyCodeLoading": "requiredComponents"` 开启**按需注入**：只加载启动页使用的 Component。
- 独立分包做扫码 / 广告页极速启动。
- 删除无用页面、无用组件、无用图片（微信开发者工具「代码依赖分析」）。

💡 性能优化的核心两条：**减少跨线程通信量** + **减少启动代码包体积**。

---

### <span class="lv lv-3">高级</span> 3.2 渲染层原理与双线程通信开销

```text
逻辑层 (JS)                                    渲染层 (WebView)
  |                                                  |
  |  setData({a: 1})                                 |
  |------ JSON.stringify -------> Native Bridge ---->|
  |                                                  | JSON.parse
  |                                                  | 生成虚拟节点 diff
  |                                                  | patch 到真实 DOM
  |<---- 事件（tap 冒泡）  <----- Native Bridge <-----|
```

- **每次 setData** 都是「序列化 → Native → 反序列化 → diff → 渲染」。**大对象是灾难**。
- 事件回传逻辑层同样跨线程，`onPageScroll` 频率高时应节流；或用 WXS 在视图层内处理。
- 自定义组件是逻辑层里**独立的实例**，其 setData **只影响自己**，因此**拆组件本身就是优化**。

🎯 这一节的**核心结论**：把 UI 抽成小组件、用 WXS 承接高频视图交互、能不 setData 就不 setData。

---

### <span class="lv lv-3">高级</span> 3.3 Skyline 渲染引擎

Skyline 是微信自研的**新一代渲染引擎**，用**原生渲染**替代 WebView，主打丝滑动画与更接近原生的体验。

**开启方式（app.json）**：

```json
{
  "renderer": "skyline",
  "rendererOptions": { "skyline": { "defaultDisplayBlock": true } },
  "componentFramework": "glass-easel",
  "lazyCodeLoading": "requiredComponents"
}
```

或按页启用：

```json
{ "renderer": "skyline" }
```

**Skyline 特点**：

- **worklet**（视图层的 JS 片段，写动画不再跨线程）：`import { shared } from '@vue/vue-mini' 类似`；官方 `WorkletModule`。
- 支持 `grid-view / list-view / snapshot / share-element` 等新组件。
- **性能大幅提升**：滚动、动画、复杂布局。
- 与 WebView 的**布局引擎不同**：不支持所有 CSS 属性，行内块行为不同。

**限制 / 注意**：

- 部分组件（如 `map`、`live-player`）在 Skyline 下行为不同或不支持，需回退 WebView。
- 老组件（`swiper` 的部分属性）行为差异。
- 目前推荐在**基础库 3.x+ + iOS 8.0.30+/Android 8.0.30+** 使用。

💡 新项目建议**页面级选择性开启 Skyline**，保留少数复杂页在 WebView，兼顾兼容与性能。

---

### <span class="lv lv-3">高级</span> 3.4 云开发 CloudBase 最小 Demo

```json
// app.json
{ "cloud": true }
```

```js
// app.js
App({
  onLaunch() {
    wx.cloud.init({ env: 'your-env-id', traceUser: true })
  }
})
```

**调用云函数**：

```js
// cloudfunctions/hello/index.js
const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return { openid: wxContext.OPENID, echo: event.msg }
}
```

```js
// 前端
wx.cloud.callFunction({
  name: 'hello', data: { msg: 'hi' }
}).then(res => console.log(res.result.openid))
```

**云数据库**：

```js
const db = wx.cloud.database()
await db.collection('users').where({ status: 1 }).limit(20).get()
await db.collection('users').add({ data: { name: 'Tom', age: 18 } })
```

**云存储**：

```js
wx.cloud.uploadFile({
  cloudPath: 'avatar/' + Date.now() + '.png',
  filePath: tempFilePath
}).then(r => console.log(r.fileID))
```

**云托管（Cloud Run）**：把 Docker 化的后端一键部署，前端用 `wx.cloud.callContainer` 调用，享受微信身份透传，无需自建鉴权。

💡 云开发适合**中小项目 / 快速原型**；数据量大或需要复杂后端时仍需自建服务。

---

### <span class="lv lv-3">高级</span> 3.5 插件与订阅消息

**插件（plugin）**：把功能封装给多个小程序复用，需在管理后台申请。使用方 `app.json` 声明：

```json
{
  "plugins": {
    "myPlugin": { "version": "1.0.0", "provider": "wxappid-of-plugin" }
  }
}
```

**订阅消息**（模板消息在 2020 年已下线）：

```js
wx.requestSubscribeMessage({
  tmplIds: ['xxxxxxxxxxxxxxxxx'],
  success(res) {
    // res['xxxxxxxxxxxxxxxxx'] === 'accept' / 'reject' / 'ban'
  }
})
```

- 只能在**点击 / 支付完成**等用户主动行为里唤起授权弹窗。
- 用户订阅后，服务端可通过 `subscribeMessage.send` 触达**一次**该模板消息（一次性订阅），需拿到 `openid + tmplId`。
- 长期订阅仅限公共服务类目。

🎯 订阅消息是「主动 + 一次性」，别当推送 SDK 用；营销触达仍需公众号 / 短信。

---

### <span class="lv lv-3">高级</span> 3.6 分享三件套：会话 / 朋友圈 / 海报

**转发给好友 / 群**：

```js
Page({
  onShareAppMessage(res) {
    // res.from = 'button' | 'menu'; res.target = 触发按钮
    return {
      title: '快来看看这个宝藏页',
      path: '/pages/detail/detail?id=1&from=share',
      imageUrl: 'https://cdn.demo.com/share.png'
    }
  }
})
```

**分享朋友圈**（需页面 json 里加 `"onShareTimeline": true` 或在 Page 里定义 `onShareTimeline`）：

```js
onShareTimeline() {
  return { title: '朋友圈标题', query: 'id=1', imageUrl: 'https://cdn.demo.com/tl.png' }
}
```

- 朋友圈打开后**只读预览**，用户点右上角「···→ 打开小程序」才能真正进入。

**生成海报**（见 2.11）：Canvas 2D 画完 → `wx.canvasToTempFilePath` → `wx.saveImageToPhotosAlbum` 或 `wx.previewImage` 长按保存分享。

💡 分享参数一定要在 `path` 里带上**渠道标识**（`from=share`、`inviterId=xxx`）用于埋点与裂变分析。

---

### <span class="lv lv-3">高级</span> 3.7 蓝牙 / 地理位置 / 传感器

**蓝牙**：

```js
wx.openBluetoothAdapter()
wx.startBluetoothDevicesDiscovery({ services: ['FEE0'] })
wx.onBluetoothDeviceFound(res => console.log(res.devices))
wx.createBLEConnection({ deviceId })
wx.getBLEDeviceServices({ deviceId })
wx.notifyBLECharacteristicValueChange({ ... })
wx.onBLECharacteristicValueChange(res => console.log(res.value))
```

**地理位置**（需 `permission.scope.userLocation` + `requiredPrivateInfos`）：

```json
{ "requiredPrivateInfos": ["getLocation", "chooseLocation"] }
```

```js
wx.getLocation({ type: 'gcj02', success(r) { console.log(r.latitude, r.longitude) } })
wx.chooseLocation({ success(r) { console.log(r.address) } })
```

**传感器**：

```js
wx.onAccelerometerChange(res => console.log(res.x, res.y, res.z))
wx.startAccelerometer({ interval: 'game' })

wx.onGyroscopeChange(res => console.log(res.x, res.y, res.z))
wx.startGyroscope({ interval: 'game' })

wx.onCompassChange(res => console.log(res.direction))
wx.startCompass()
```

⚠️ 2022 之后**用户信息 / 位置 / 蓝牙**都需在小程序管理后台申请「隐私接口」并在 `app.json.requiredPrivateInfos` 声明，否则调用直接拒绝。

🎯 硬件类 API 一律先**检查授权、检查支持**，再调用。

---

### <span class="lv lv-3">高级</span> 3.8 小程序容器差异对比

| 平台 | 语言 | 特点 |
| --- | --- | --- |
| 微信小程序 | WXML/WXSS/JS | 生态最强、能力最全 |
| 支付宝小程序 | AXML/ACSS/JS | 与微信语法高度相似，API 名 `my.*`；金融支付强 |
| 字节小程序 | TTML/TTSS/JS | 抖音生态、直播带货强 |
| 百度小程序 | SWAN | 搜索引流；生态较弱 |
| QQ / 京东 / 小红书 | 各家私有 | 类似微信，需具体适配 |

**跨端方案推荐**：

- **Taro 3+**：React/Vue 语法，编译多端，运行时统一。
- **uni-app**：Vue 语法，官方支持多端，插件市场庞大。
- **Rax / Remax**：React 系少数派。

💡 团队若要一次开发多端投放，优先 `Taro` 或 `uni-app`；只做微信生态则原生足够。

---

### <span class="lv lv-3">高级</span> 3.9 工程化：TypeScript / npm / ESLint

**TypeScript**：

- 开发者工具新建时选「TypeScript」，会生成 `tsconfig.json` + `.ts` 页面。
- 全局类型可 `npm i -D miniprogram-api-typings`，`tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "strict": true,
    "types": ["miniprogram-api-typings"],
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  }
}
```

**npm 支持**（微信开发者工具「工具 → 构建 npm」）：

1. 项目根目录 `npm init -y`。
2. `npm i dayjs`。
3. **勾选** `project.config.json.setting.packNpmManually: false`，`packNpmRelationList` 可细化。
4. 菜单栏 → **工具 → 构建 npm** → 会生成 `miniprogram_npm/`。
5. 代码里 `import dayjs from 'dayjs'` 即可。

**ESLint**：

```bash
npm i -D eslint eslint-plugin-miniapp
```

`.eslintrc.js`：

```js
module.exports = {
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
  env: { es2020: true },
  extends: ['eslint:recommended'],
  globals: { wx: 'readonly', App: 'readonly', Page: 'readonly', Component: 'readonly', getApp: 'readonly', getCurrentPages: 'readonly', Behavior: 'readonly' },
  rules: { 'no-console': 'off' }
}
```

**.gitignore 建议**：

```gitignore
node_modules/
miniprogram_npm/
project.private.config.json
.DS_Store
dist/
*.log
```

🎯 TypeScript + npm + ESLint + 分层（api / store / utils / components）是团队协作的**四件套**，必上。

---

### <span class="lv lv-3">高级</span> 3.10 常见坑与调试技巧

**调试**：

- **真机调试**：开发者工具「预览 → 真机调试」，手机扫码后可直接 vConsole + 断点。
- **vConsole**：手机端右下角调试按钮，看 log/network。
- **Network 面板**：注意「请求耗时」里含 DNS + TLS + 首字节。
- **Wxml/Wxss 面板**：类似浏览器 DevTools，可实时改样式。
- **Storage / AppData / Sensor** 面板辅助排查状态。
- **Trace 分析、Audits（体验评分）**：看关键指标。
- **代码依赖分析**：找出无用文件精简包体积。

**版本**：

| 版本 | 说明 | 谁能看 |
| --- | --- | --- |
| 开发版 | 开发者工具 / 真机预览 | 开发者本人 |
| 体验版 | 二维码分享，用于内测 | 管理员添加的体验者 |
| 审核版 | 提交微信后台，审核中 | - |
| 正式版 | 审核通过发布 | 全部用户 |

**审核常见拒绝原因**：

- 页面出现「测试 / demo / TODO / debug」字样。
- 未上线的功能有入口（灰色也算）。
- 涉及金融、医疗、教育等**必须补类目资质**。
- 未接入**用户隐私协议**（2023 强制）：`__wxPrivacyAgreement` / `wx.onNeedPrivacyAuthorization`。
- 分享文案诱导（「转发才能查看」）。
- 上传虚拟商品支付走微信支付（苹果政策）。

💡 隐私协议弹窗**从 2023 年 9 月起强制**，未处理会导致所有小程序 API 报错并被拒。

---

### <span class="lv lv-3">高级</span> 3.11 安全：签名 / 篡改 / 服务端校验

**接口签名（防重放 / 防伪造）**：

```text
signStr = HMAC_SHA256(
  method + '\n' + path + '\n' + timestamp + '\n' + nonce + '\n' + bodyMD5,
  appSecret
)
```

- 前端每个请求带 `X-Ts`（时间戳）、`X-Nonce`（一次性随机串）、`X-Sign`（签名）。
- 服务端校验：`|now - ts| < 60s`、`nonce` 未用过（Redis 短 TTL）、签名一致。
- `appSecret` **不能明文放前端**（会被反编译），可换成**动态密钥**：登录时后端下发短期 key。

**数据校验**：

- 服务端对所有请求做**参数白名单 + 类型校验 + 边界检查**（joi / zod / class-validator）。
- 关键金额、库存、权限**永远以服务端为准**，前端只做展示与体验。
- 客户端提交的 `openid / userId` 一律忽略，从服务端 session 拿。

**反爬 / 反调试**：

- 微信数据接口在**审核期**可能被机器人调用，敏感接口加**登录态校验 + 频控**。
- Skyline 下无法轻易注入脚本，但 WebView 场景要防 XSS（`rich-text` 慎用 `nodes` 里的 `img.onerror` 等）。

🎯 一句话：**永远假设前端代码会被反编译，永远假设网络包会被抓，一切安全靠后端。**

---

### <span class="lv lv-3">高级</span> 3.12 面试高频题 15 条

1. **小程序双线程架构说一下？setData 为什么慢？**  
   视图层 WebView / Skyline，逻辑层 JSCore/V8，通过 Native 桥 JSON 序列化通信；setData 会全量 stringify 后跨线程 diff 渲染，因此频繁 / 大对象都会慢。

2. **`wx:if` 和 `hidden` 区别？**  
   `wx:if` 惰性渲染，切换销毁 / 重建；`hidden` 类似 `display:none`，永远存在。频繁切用 hidden，条件重且切换少用 wx:if。

3. **rpx 是什么？为什么设计稿常按 750 宽？**  
   `1rpx = 屏幕宽度 / 750`，iPhone 6 是 375px 屏，`750rpx = 375px`。设计师按 750px 宽出稿，前端直接按数值抄尺寸即可，天然适配。

4. **页面生命周期顺序？switchTab 会触发 onLoad 吗？**  
   首次：`onLoad → onShow → onReady`；再次进入只触发 `onShow`。tab 页首次进 tab 时才 onLoad，之后 switchTab 不再 onLoad。

5. **navigateTo / redirectTo / switchTab / reLaunch 区别？**  
   见 1.12 表；核心：`navigateTo` 入栈、`redirectTo` 替换、`switchTab` 切 tab 且清非 tab、`reLaunch` 清空栈。

6. **组件通信有哪些方式？**  
   properties（父→子）、triggerEvent（子→父）、EventBus / 全局 store（兄弟）、selectComponent / relations（跨层级）、`globalData`。

7. **登录鉴权完整流程？session_key 能给前端吗？**  
   `wx.login → code → 后端 code2Session 拿 openid + session_key → 生成自定义 token → 前端存 storage → 后续请求带 token`。session_key 绝对不能给前端。

8. **分包 & 独立分包 & 预下载区别？主包上限？**  
   主包 2MB / 单分包 2MB / 总 30MB。普通分包按需下载；独立分包可脱离主包启动；预下载在指定页面进入时静默拉取。

9. **setData 优化都有哪些手段？**  
   合并多次、路径更新、只传变化字段、payload < 256KB、频率 < 30/s、视图无关数据不放 data、拆组件降低影响面。

10. **自定义 TabBar 怎么实现？为何要用？**  
    `app.json.tabBar.custom = true`，新建 `custom-tab-bar/index` 组件；用于中间凸起按钮、红点、动画等原生 tabBar 做不到的效果。

11. **WXS 用来干嘛？为啥比 setData 快？**  
    WXS 运行在视图层，可以做模板过滤和高频交互（拖拽跟手），避免跨线程通信。不能调 `wx.*`，不支持 ES6。

12. **Skyline 是什么？与 WebView 差异？**  
    微信自研原生渲染引擎，性能接近原生；支持 worklet 动画和 `grid-view / list-view` 等新组件；部分老组件行为差异，需页面级评估。

13. **subscribeMessage vs 模板消息？**  
    模板消息 2020 下线；订阅消息是**一次性**（用户点一次授权，后端只能触达一次），必须由用户主动行为触发弹窗。

14. **支付流程谁最重要？**  
    后端：统一下单、签名、异步 notify_url 校验 + 幂等。前端只是 `wx.requestPayment` 唤起。金额单位是分。

15. **小程序有哪些常见性能 / 审核大坑？**  
    - 性能：setData 频繁、图片过大、主包超限、Storage 存整个业务对象。  
    - 审核：demo 字样、未上线功能有入口、无隐私协议、类目不符、诱导分享、苹果侧虚拟支付。

---

## 结语

微信小程序原生开发看似"就是几个文件、几个 API"，实则每一层背后都有平台约束与最佳实践：

- **初级** 关注写得出、跑得起来；
- **中级** 关注抽象、通信、鉴权、支付、分包这些真实项目高频场景；
- **高级** 关注性能、Skyline、云开发、工程化、安全与团队协作。

真正把三阶段吃透，通常需要**至少完成 1 个业务小程序上线 + 1 次性能优化 + 1 次审核过审**的完整闭环。祝你在小程序生态里越走越稳。

> 完 · 建议配合官方文档 <https://developers.weixin.qq.com/miniprogram/dev/framework/> 与「微信开放社区」持续追踪基础库更新。

---

## <span class="lv lv-3">高级</span> 附录 B：隐私协议合规完整落地（2023.09 强制起）

> **2023 年 9 月 15 日起**微信平台强制要求所有小程序处理"用户信息 / 位置 / 相册 / 通讯录 / 蓝牙 / 麦克风 / 摄像头 / 剪贴板"等 API 时必须让用户明示同意隐私协议；未处理会导致 **API 直接调用失败 + 审核被拒**。这是 2025 年上线小程序的**头号强制项**。

💡 **背景补充**：微信团队在 2023 年 8 月 22 日发布《关于小程序隐私保护指引设置的公告》后，社区里出现了大量"莫名其妙 -1 报错"、"getUserProfile 无反应"、"chooseImage 直接 fail"的反馈。归根到底就是没做 B.2 ~ B.4 这几步。别在这上面栽跟头。

### B.1 合规要求速览

- 管理后台 → 设置 → 服务内容声明 → 用户隐私保护指引：申报所有涉及的**处理个人信息用途**
- 提交后审核（一般 1~2 个工作日），通过才生效
- 首次进入小程序需展示隐私协议弹窗（用户勾选/点击同意才能调 API）
- 涉及的 API 名单会随基础库更新（`getUserProfile / getLocation / chooseImage / chooseVideo / getClipboardData / getBluetoothAdapterState / startRecord / chooseAddress / ...`）
- 未成年人 / 儿童个人信息需额外单独条款
- 小程序名称、appid、开发者主体信息必须与协议里保持一致

一张速查表：

| 场景 | 是否必须申报 | 备注 |
|------|--------------|------|
| 只调 `wx.login` 拿 code | 否 | code 不视为个人信息 |
| 调 `wx.getUserProfile` / `getUserInfo` | 是 | 昵称头像属于个人信息 |
| 调 `wx.getLocation` / `chooseLocation` | 是 | 精确位置强敏感 |
| 调 `wx.chooseImage` / `chooseMedia` | 是 | 相册访问 |
| 调 `wx.getClipboardData` | 是 | 2023 年后严查 |
| 集成友盟 / 阿里云 / 腾讯云 IM SDK | 是 | 必须在协议里单列第三方 SDK |
| 使用 `wx.requestSubscribeMessage` | 视情况 | 涉及 openid 用途需说明 |

💡 **常被忽略的坑**：`wx.getClipboardData` 在早期非常"隐蔽"，很多 H5 迁移过来的小程序会用它做 URL 参数解析，2023 年后不申报 = 直接 fail。

🎯 **合规原则**：**收集最少、明示同意、单独授权**，能不申报的 API 就不用。

### B.2 全局配置

**（1）app.json**：低版本基础库需要显式开启，2.32.3 起自动开启。

```json
{
  "pages": ["pages/index/index"],
  "window": {
    "navigationBarTitleText": "隐私合规示例"
  },
  "__usePrivacyCheck__": true,
  "requiredPrivateInfos": [
    "getLocation",
    "chooseLocation",
    "chooseAddress",
    "getClipboardData"
  ],
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于附近门店查询"
    }
  }
}
```

**（2）app.js**：注册全局隐私协议监听。

```js
// app.js
App({
  onLaunch() {
    // 冷启动即预检隐私状态
    if (wx.getPrivacySetting) {
      wx.getPrivacySetting({
        success: (res) => {
          console.log('[privacy] needAuthorization=', res.needAuthorization);
          console.log('[privacy] contractName=', res.privacyContractName);
        },
      });
    }
  },

  globalData: {
    privacyResolves: new Set(), // 排队等待授权的 API resolve
  },
});

// 全局注册：任何调用敏感 API 前都会触发一次
if (wx.onNeedPrivacyAuthorization) {
  wx.onNeedPrivacyAuthorization((resolve, eventInfo) => {
    console.log('[privacy] 触发授权，来源=', eventInfo?.referrer);

    // 通过全局事件通知页面弹窗；页面点击"同意"后调 resolve({ event: 'agree' })
    const app = getApp();
    if (!app.globalData.privacyResolves) app.globalData.privacyResolves = new Set();
    app.globalData.privacyResolves.add(resolve);

    // 广播给当前页面
    const pages = getCurrentPages();
    const current = pages[pages.length - 1];
    if (current && typeof current.showPrivacyPopup === 'function') {
      current.showPrivacyPopup();
    }
  });
}
```

💡 `onNeedPrivacyAuthorization` **只在用户尚未授权时触发**，一旦用户点了"同意"，本次会话内不会再触发。

🎯 记住：`resolve` 一定要在用户明确操作后调用，**不能默认自动 agree**，否则等同于绕过合规，会被审核抓。

### B.3 隐私弹窗组件完整代码

推荐做成一个 `privacy-popup` 自定义组件，多页面复用。

**（1）components/privacy-popup/privacy-popup.wxml**

```wxml
<view class="privacy-mask" wx:if="{{visible}}" catchtouchmove="noop">
  <view class="privacy-dialog">
    <view class="privacy-title">用户隐私保护提示</view>

    <scroll-view class="privacy-content" scroll-y>
      <text>感谢你选择本小程序。为了向你提供服务，我们将根据以下</text>
      <text class="link" bindtap="openContract">《{{contractName}}》</text>
      <text>收集、使用你的个人信息，包括但不限于：\n</text>
      <text>· 微信昵称、头像（用于个人中心展示）\n</text>
      <text>· 位置信息（仅在使用附近门店功能时）\n</text>
      <text>· 相册权限（仅在上传头像、反馈图片时）\n</text>
      <text>· 剪贴板（仅识别分享口令，不上传服务器）\n\n</text>
      <text>你可以在小程序"我的 → 设置"中随时撤回授权。</text>
    </scroll-view>

    <view class="privacy-btns">
      <button class="btn-reject" bindtap="onReject">拒绝</button>
      <button class="btn-agree" bindtap="onAgree" open-type="agreePrivacyAuthorization">
        同意
      </button>
    </view>
  </view>
</view>
```

**（2）components/privacy-popup/privacy-popup.wxss**

```wxss
.privacy-mask {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 9999;
  display: flex; align-items: center; justify-content: center;
}
.privacy-dialog {
  width: 640rpx; background: #fff;
  border-radius: 24rpx; padding: 48rpx 40rpx 32rpx;
  box-sizing: border-box;
}
.privacy-title { font-size: 34rpx; font-weight: 600; text-align: center; margin-bottom: 32rpx; }
.privacy-content { max-height: 520rpx; font-size: 26rpx; line-height: 1.7; color: #555; margin-bottom: 32rpx; }
.privacy-content .link { color: #07c160; }
.privacy-btns { display: flex; gap: 24rpx; }
.privacy-btns button { flex: 1; height: 80rpx; line-height: 80rpx; font-size: 30rpx; border-radius: 40rpx; margin: 0; }
.btn-reject { background: #f2f3f5; color: #666; }
.btn-agree { background: #07c160; color: #fff; }
```

**（3）components/privacy-popup/privacy-popup.js**

```js
Component({
  data: { visible: false, contractName: '' },

  lifetimes: {
    attached() {
      if (!wx.getPrivacySetting) return;
      wx.getPrivacySetting({
        success: (res) => this.setData({ contractName: res.privacyContractName || '用户隐私保护指引' }),
      });
    },
  },

  methods: {
    noop() {},
    show() { this.setData({ visible: true }); },
    hide() { this.setData({ visible: false }); },

    openContract() {
      // 打开隐私协议详情：官方推荐 wx.openPrivacyContract
      wx.openPrivacyContract && wx.openPrivacyContract({
        fail: () => wx.showToast({ title: '协议打开失败', icon: 'none' }),
      });
    },

    onAgree() {
      // button 已用 open-type="agreePrivacyAuthorization"
      // 微信会自动 resolve 所有 onNeedPrivacyAuthorization 排队回调
      const app = getApp();
      app.globalData.privacyResolves && app.globalData.privacyResolves.clear();
      this.hide();
      this.triggerEvent('agree');
    },

    onReject() {
      const app = getApp();
      if (app.globalData.privacyResolves) {
        app.globalData.privacyResolves.forEach((r) => r({ event: 'disagree' }));
        app.globalData.privacyResolves.clear();
      }
      this.hide();
      this.triggerEvent('reject');
      wx.showModal({
        title: '提示',
        content: '不同意隐私协议将无法使用本小程序，是否退出？',
        success: (r) => r.confirm && wx.exitMiniProgram({ success: () => {} }),
      });
    },
  },
});
```

💡 **重点**：同意按钮**必须**用 `open-type="agreePrivacyAuthorization"`，这是微信官方规定的合规写法，普通 `bindtap` 不会被视为有效同意。

🎯 组件挂到每个入口页 wxml 里即可：`<privacy-popup id="privacyPopup" bind:agree="onPrivacyAgree" />`，然后在页面 `showPrivacyPopup()` 方法里 `this.selectComponent('#privacyPopup').show()`。

### B.4 关键 API：wx.onNeedPrivacyAuthorization + wx.requirePrivacyAuthorize

除了 B.2 的全局注册模式，还有**主动预授权**模式——在用户点某个按钮前主动申请。

```js
// pages/index/index.js
Page({
  data: { location: null },

  onReady() { this.popup = this.selectComponent('#privacyPopup'); },
  showPrivacyPopup() { this.popup && this.popup.show(); },

  // 用户点"获取位置"按钮
  async onGetLocation() {
    try {
      await this.ensurePrivacy(); // 主动预授权，会触发 onNeedPrivacyAuthorization
      const res = await wx.getLocation({ type: 'gcj02' });
      this.setData({ location: res });
    } catch (err) {
      console.warn('[getLocation] fail', err);
      wx.showToast({ title: '获取位置失败', icon: 'none' });
    }
  },

  ensurePrivacy() {
    return new Promise((resolve, reject) => {
      if (!wx.requirePrivacyAuthorize) return resolve(); // 老基础库直接放行
      wx.requirePrivacyAuthorize({ success: resolve, fail: reject });
    });
  },

  onPrivacyAgree() { console.log('[privacy] 用户已同意'); },
});
```

💡 `wx.requirePrivacyAuthorize` 与 `wx.onNeedPrivacyAuthorization` 的关系：**前者是"询问是否需要授权"，后者是"授权流程被触发"的事件回调**。二者组合使用可以实现"按需弹窗"，不至于一进小程序就糊脸。

🎯 建议**分场景弹窗**：首页只弹一次基础授权；进入"位置"页再弹位置授权；进入"上传头像"再弹相册授权。用户体验最好、拒绝率最低。

### B.5 wx.getPrivacySetting 状态检测

```js
// utils/privacy.js —— 状态检测 + 三种分支
export function checkPrivacyStatus() {
  return new Promise((resolve) => {
    if (!wx.getPrivacySetting) return resolve({ supported: false, needAuthorization: false });
    wx.getPrivacySetting({
      success: (res) => resolve({
        supported: true,
        needAuthorization: res.needAuthorization,
        contractName: res.privacyContractName,
      }),
      fail: () => resolve({ supported: false, needAuthorization: false }),
    });
  });
}

// app.js onLaunch 内使用
async onLaunch() {
  const s = await checkPrivacyStatus();
  if (!s.supported) return console.log('[privacy] 老基础库/非微信环境，跳过');
  if (s.needAuthorization) console.log('[privacy] 需要授权（未同意或协议更新）');
  else console.log('[privacy] 已授权，继续正常流程');
}
```

💡 当你在管理后台**更新了隐私协议内容**（比如新增了一个第三方 SDK），`needAuthorization` 会自动重新变为 `true`，用户下次进入小程序需要重新同意。这是官方设计，不要绕过。

🎯 上线前用「开发者工具 → 详情 → 本地设置 → 清除模拟器缓存」重复测试三种状态，确保业务代码在任一分支下不崩溃。

### B.6 iOS / Android 差异

- **iOS**：首次调用敏感 API（定位、相册、麦克风）会有**系统级二次弹窗**，即"微信 App 想要访问 XX"，这层是操作系统的，与小程序的隐私协议是叠加关系。
- **Android**：各厂商 ROM 权限差异较大：
  - **华为 EMUI/HarmonyOS**：位置权限有"仅使用期间/始终允许/拒绝"三档
  - **小米 MIUI**：会额外弹"是否禁止后台获取位置"
  - **OPPO ColorOS / vivo OriginOS**：首次获取剪贴板会有 toast 提示
- **剪贴板**：iOS 15+ 会在状态栏显示"XX 从 微信 拷贝"的提示条，如果你的小程序 `getClipboardData` 调用过于频繁，用户投诉率会飙升。

💡 **稳妥策略**：调 `wx.getClipboardData` 前先判断内容是否需要（比如是不是刚从外部跳转进来），不要在 `onShow` 无脑调。

🎯 iOS 系统弹窗被拒后要走 `wx.openSetting` 引导用户去设置里改，而不是硬弹自定义框骚扰用户。

### B.7 内嵌 H5 / iframe 场景的隐私协议

`web-view` 加载第三方 H5 时的合规要点：

```json
// 管理后台需要配置业务域名
{
  "domains": [
    "https://h5.your-domain.com"
  ]
}
```

```js
// H5 页面内如果要通过 JSSDK 调 wx.miniProgram.postMessage
// 传输个人信息，H5 侧也必须在自己的隐私协议里说明
```

- H5 若通过 URL 参数传递 openid、手机号等，需要在小程序隐私指引里申明"通过 web-view 与第三方 H5 交换数据的用途"
- 若 H5 内嵌了埋点 SDK（GA / 神策 / 友盟 H5），也必须在**H5 自己**的隐私协议内单列
- **强烈建议**：涉及个人信息的表单尽量放在原生小程序页面，H5 只做展示

💡 常见踩坑：小程序申报了隐私协议，但内嵌的 H5 没做，用户投诉后监管定性仍然是"小程序主体责任"。

🎯 内嵌页越少越安全；不得已嵌入时把双方协议链接互相引用一次。

### B.8 常见审核拒绝原因（隐私类）

按拒绝频率从高到低排：

1. **未在小程序内展示用户隐私保护指引** —— 首屏没弹窗，或弹窗关闭后仍可继续用。整改：加 B.3 的组件并强制拦截。
2. **协议中未列出实际使用的敏感 API** —— 代码里调了 `getLocation`，但管理后台没勾。整改：审核代码扫描一遍 `wx.get*` 调用，对齐后台勾选项。
3. **协议链接 404 / 打开为空白页** —— 用了自建 H5 但已经下线。整改：优先用官方 `wx.openPrivacyContract`，或托管在稳定域名。
4. **协议里未列出实际集成的第三方 SDK** —— 特别是 UMeng、TalkingData、腾讯移动分析、极光推送。整改：`package.json` / `miniprogram_npm` 里出现的第三方一律申报。
5. **点了"拒绝"仍可继续使用敏感功能** —— 逻辑漏洞：用户拒绝后没有 disable 按钮，还能继续点。整改：全局维护 `hasAgreed` 标志，未同意时 `disabled`。

💡 官方审核后台会明确指出条款编号（如"违反《微信小程序平台运营规范》第 10.6 条"），务必按条款一条条对照修改，不要笼统改。

🎯 二次提交前请用真机（iOS + Android 各一台）冷启动跑一遍全流程，比模拟器可靠。

### B.9 一份现成的隐私协议模板

以下是可直接改用的**《XX 小程序用户隐私保护指引》**模板，把 `XX` 替换成你的小程序名。

```
《XX 小程序用户隐私保护指引》
生效/更新日期：2025 年 XX 月 XX 日

一、我们如何收集和使用你的个人信息
1.1 收集范围：
    a) 账号信息：微信昵称、头像（wx.getUserProfile）
    b) 位置信息：精确地理位置（wx.getLocation，仅用于附近门店查询）
    c) 相机与相册：拍摄或选择照片（wx.chooseMedia，仅用于头像上传与反馈）
    d) 剪贴板：识别邀请码（wx.getClipboardData，本地识别不上传）
    e) 设备信息：机型、系统版本、网络类型（用于统计与故障排查）
1.2 我们不会收集：通讯录、短信内容、通话记录。

二、Cookie 与类似技术
小程序不使用浏览器 Cookie，仅通过 wx.setStorage 保存登录 token 与用户偏好，
可在"我的 → 设置 → 清除缓存"中随时清除。

三、委托处理、共享、转让、公开披露
3.1 委托处理方：XX 云（存储计算）、微信支付、XX 客服，均已签署数据保护协议。
3.2 第三方 SDK 目录：
    | SDK 名称        | 提供方 | 用途     | 收集信息          |
    |-----------------|--------|----------|-------------------|
    | 微信开放数据 SDK | 腾讯  | 登录鉴权 | openid、unionid   |
    | 微信支付 SDK    | 腾讯   | 订单支付 | 交易金额、订单号  |
    | XX 统计 SDK     | XX 公司 | 数据分析 | 设备信息、页面路径 |
3.3 除法律法规明确要求或用户重新授权外，不共享/转让/公开披露。

四、我们如何保护你的个人信息
HTTPS 加密传输 + AES-256 加密存储；最小权限内部访问；账号注销后 15 天内彻底删除。

五、你的权利
- 查阅/复制/更正/删除：在"我的 → 个人信息"中操作
- 撤回授权：在"我的 → 设置 → 隐私权限"中操作
- 注销账号：7 个工作日内完成
- 投诉：privacy@your-domain.com

六、未成年人保护
不主动收集未满 14 周岁儿童个人信息；监护人可联系我们删除相关信息。

七、指引更新
更新后将在小程序内弹窗通知，需重新同意才能继续使用。

八、如何联系我们
开发者：XX 科技有限公司  邮箱：privacy@your-domain.com  电话：400-XXX-XXXX
```

💡 模板里的**第三方 SDK 目录**是最容易被审核挑刺的点，务必对着你的 `miniprogram_npm/` 目录和引入的 `wx.request` 域名一项一项对齐。

🎯 **最后一次核对清单**：
- [ ] 管理后台《隐私保护指引》已提交并审核通过
- [ ] `app.json` 的 `__usePrivacyCheck__` 与 `requiredPrivateInfos` 已配置
- [ ] `app.js` 已注册 `wx.onNeedPrivacyAuthorization`
- [ ] 每个入口页都挂载了 `<privacy-popup />`
- [ ] 同意按钮使用了 `open-type="agreePrivacyAuthorization"`
- [ ] 拒绝分支能优雅退出小程序 / 禁用敏感按钮
- [ ] iOS + Android 真机各跑一遍冷启动流程
- [ ] 隐私协议文本已由法务或至少一位非开发人员通读一遍

🎯 **学习秘诀**：**新项目上线前"隐私协议 → 类目资质 → 服务端域名 → 支付协议"四件套一次做完**，能少一次审核打回。这四项互相独立、都可提前几天并行提交，等你把 UI 走查完它们也差不多下来了。
