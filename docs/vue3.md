# Vue 3 全阶段学习手册（初 → 中 → 高）

> 覆盖 Vue 3 从零基础到源码剖析全阶段，含组合式 API 入门 / Pinia / Router / 响应式原理 / 编译优化 / SSR。

## 目录

### 一、🟢 初级入门

- 0.1 Vue 是什么、Vue 2 vs Vue 3 简对比
- 0.2 快速上手：`npm create vue@latest`（Vite）项目生成 & 目录结构说明
- 0.3 CDN 引入方式（最小 hello world）
- 0.4 模板语法：文本插值、原始 HTML、属性绑定
- 0.5 常用指令：v-if / v-show / v-for / v-on 及事件修饰符
- 0.6 双向绑定 v-model（文本 / 复选 / 单选 / select / textarea）
- 0.7 计算属性 computed vs 方法 methods vs 侦听器 watch
- 0.8 组件基础：单文件组件 .vue 三段结构、defineProps / defineEmits
- 0.9 组件通信入门：父传子 props、子传父 emit、v-model 组件双向绑定
- 0.10 Vue Router 基础：安装、router-link、router-view、编程式导航
- 0.11 生命周期钩子清单（组合式版本）+ 触发时机时间线
- 0.12 完整案例：TodoList（增删改查 + localStorage 持久化）

### 二、🟡 中级进阶

- 1. 响应式原理
- 2. Composition API 与 `<script setup>`
- 3. 组件通信与依赖注入
- 4. 自定义 Hook（Composables）设计
- 7. 性能优化实践
- 8. Pinia 状态管理
- 9. Vue Router 4 进阶
- 11. 单元测试与 E2E
- 12. 工程化与构建

### 三、🔴 高级实战

- 5. 渲染机制与虚拟 DOM
- 6. 编译时优化
- 10. SSR / Nuxt 3
- 13. 常见面试题

---

## 一、🟢 初级入门

> 适合 0 基础或只会一点 HTML/CSS/JS 的同学，目标：一天上手写页面，一周做出 TodoList。

### <span class="lv lv-1">初级</span> 0.1 Vue 是什么、Vue 2 vs Vue 3 简对比

Vue 是一款渐进式 JavaScript 框架，用来构建**数据驱动**的用户界面。核心理念：你只管写"数据长什么样、模板怎么绑定"，DOM 更新交给 Vue。

**Vue 2 vs Vue 3 简对比：**

| 维度 | Vue 2 | Vue 3 |
| --- | --- | --- |
| 主流 API 风格 | Options API（`data / methods / computed`） | Composition API（`setup / ref / reactive`） |
| 响应式实现 | `Object.defineProperty` | `Proxy` |
| 打包体积 | 较大 | Tree-shakable，更小 |
| 多根节点组件 | ❌ 需要根标签包裹 | ✅ 天然支持 Fragment |
| TS 支持 | 一般（需 vue-class-component） | 原生一等公民 |
| 生命周期 | `beforeCreate/created/...` | `onMounted/onUnmounted/...` |
| 新特性 | - | Teleport、Suspense、defineModel、Vapor Mode |
| 构建工具推荐 | Vue CLI（webpack） | Vite |

**Options API vs 组合式 API 写同一段逻辑：**

```vue
<!-- Vue 2 Options API -->
<script>
export default {
  data() { return { count: 0 } },
  computed: { double() { return this.count * 2 } },
  methods: { inc() { this.count++ } }
}
</script>
```

```vue
<!-- Vue 3 组合式 API -->
<script setup>
import { ref, computed } from 'vue'
const count = ref(0)
const double = computed(() => count.value * 2)
const inc = () => count.value++
</script>
```

💡 一句话：Vue 3 = 更快 + 更小 + 更强的 TS 支持 + 更适合逻辑复用的组合式 API。

---

### <span class="lv lv-1">初级</span> 0.2 快速上手：`npm create vue@latest`（Vite）项目生成 & 目录结构说明

官方脚手架基于 Vite（秒级启动 + HMR），一条命令搞定：

```bash
npm create vue@latest
# 交互式选择：项目名、TypeScript、JSX、Router、Pinia、Vitest、ESLint、Prettier
cd my-vue-app
npm install
npm run dev
```

**典型目录结构：**

```
my-vue-app/
├── index.html          # 入口 HTML（Vite 从这里开始）
├── vite.config.ts      # Vite 配置
├── package.json
├── tsconfig.json
├── public/             # 静态资源，直接原样复制
│   └── favicon.ico
└── src/
    ├── main.ts         # 应用入口：createApp(App).mount('#app')
    ├── App.vue         # 根组件
    ├── assets/         # 会被打包器处理的资源（图片、样式）
    ├── components/     # 通用组件
    ├── views/          # 路由级页面
    ├── router/         # Vue Router 配置
    ├── stores/         # Pinia 状态
    └── composables/    # 自定义 Hook
```

**常用脚本：**

```bash
npm run dev      # 开发（默认 http://localhost:5173）
npm run build    # 生产打包 → dist/
npm run preview  # 本地预览打包后的产物
```

💡 一句话：`npm create vue@latest` 是官方"全家桶"起手式，10 秒生成开箱即用的工程。

---

### <span class="lv lv-1">初级</span> 0.3 CDN 引入方式（最小 hello world，10 行完整 HTML）

不用 Node、不用打包，一个 HTML 文件即可跑：

```html
<!DOCTYPE html>
<html>
<body>
  <div id="app">{{ msg }}</div>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script>
    const { createApp, ref } = Vue
    createApp({ setup: () => ({ msg: ref('Hello Vue 3!') }) }).mount('#app')
  </script>
</body>
</html>
```

用浏览器直接打开即可看到 `Hello Vue 3!`。CDN 版本适合：写 demo、学 API、给老项目局部引入。

💡 一句话：Vue 是"渐进式"的——即使不用 Vite，一个 script 标签也能跑。

---

### <span class="lv lv-1">初级</span> 0.4 模板语法：文本插值 `{{}}`、原始 HTML `v-html`、属性绑定 `v-bind :src`、简写

```vue
<script setup>
import { ref } from 'vue'
const name = ref('小明')
const rawHtml = ref('<span style="color:red">红字</span>')
const imgUrl = ref('/logo.png')
const isDisabled = ref(true)
</script>

<template>
  <!-- 1. 文本插值：支持任意 JS 表达式 -->
  <p>你好 {{ name }}，长度：{{ name.length }}</p>

  <!-- 2. 原始 HTML：会渲染真实标签（注意 XSS 风险） -->
  <p v-html="rawHtml"></p>

  <!-- 3. 属性绑定：v-bind:xxx 简写为 :xxx -->
  <img v-bind:src="imgUrl" />
  <img :src="imgUrl" />

  <!-- 4. 布尔属性：值为 falsy 时属性会被移除 -->
  <button :disabled="isDisabled">按钮</button>

  <!-- 5. 一次性绑定多个属性 -->
  <div v-bind="{ id: 'box', class: 'card' }"></div>
</template>
```

**简写速记：**

| 完整写法 | 简写 |
| --- | --- |
| `v-bind:src="url"` | `:src="url"` |
| `v-on:click="fn"` | `@click="fn"` |
| `v-slot:header` | `#header` |

💡 一句话：`{{}}` 输出文本、`v-html` 输出 HTML、`:` 是 v-bind、`@` 是 v-on。

---

### <span class="lv lv-1">初级</span> 0.5 常用指令：v-if / v-else-if / v-else / v-show 对比表、v-for + key、v-on @click、事件修饰符 .stop / .prevent / .once

**条件渲染：**

```vue
<template>
  <p v-if="score >= 90">优秀</p>
  <p v-else-if="score >= 60">及格</p>
  <p v-else>不及格</p>

  <p v-show="isVisible">这里用 v-show 控制</p>
</template>
```

**v-if vs v-show：**

| 指令 | 原理 | 首次渲染 | 切换成本 | 适用场景 |
| --- | --- | --- | --- | --- |
| `v-if` | 真正插入 / 移除 DOM | 惰性（false 不渲染） | 高（重建组件） | 条件很少改变 |
| `v-show` | 只切换 `display` | 一律渲染 | 低（改 CSS） | 频繁切换 |

**列表渲染 v-for + key：**

```vue
<script setup>
import { ref } from 'vue'
const list = ref([
  { id: 1, name: '苹果' },
  { id: 2, name: '香蕉' },
  { id: 3, name: '橙子' }
])
</script>

<template>
  <ul>
    <li v-for="(item, index) in list" :key="item.id">
      {{ index }} - {{ item.name }}
    </li>
  </ul>
</template>
```

⚠️ `key` 必须唯一且稳定（**别用 index 当 key**），diff 算法靠它复用节点。

**事件监听 + 修饰符：**

```vue
<template>
  <!-- 阻止冒泡 -->
  <div @click="outer">
    <button @click.stop="inner">stop</button>
  </div>

  <!-- 阻止默认行为 -->
  <a href="/login" @click.prevent="goLogin">登录</a>

  <!-- 只触发一次 -->
  <button @click.once="submit">只能点一次</button>

  <!-- 按键修饰符 -->
  <input @keyup.enter="onEnter" />
  <input @keyup.esc="onEsc" />
</template>
```

**修饰符速查：**

| 修饰符 | 等价代码 |
| --- | --- |
| `.stop` | `event.stopPropagation()` |
| `.prevent` | `event.preventDefault()` |
| `.once` | 只触发一次后自动解绑 |
| `.capture` | 事件捕获阶段触发 |
| `.self` | 只有 `event.target === 当前元素` 才触发 |
| `.passive` | 提升移动端滚动性能 |

🎯 面试点：`v-if` 和 `v-for` 同时用在一个元素上时，Vue 3 中 `v-if` 优先级更高（Vue 2 相反）—— 官方建议**分开写**，避免歧义。

---

### <span class="lv lv-1">初级</span> 0.6 双向绑定 v-model（文本 / 复选 / 单选 / select / textarea）

`v-model` 本质：`:value` + `@input` 的语法糖。

```vue
<script setup>
import { ref } from 'vue'
const text = ref('hello')
const isAgree = ref(false)
const hobbies = ref([])
const gender = ref('male')
const city = ref('bj')
const desc = ref('')
</script>

<template>
  <!-- 1. 文本输入 -->
  <input v-model="text" />
  <p>输入的是：{{ text }}</p>

  <!-- 2. 单个复选框（布尔） -->
  <label>
    <input type="checkbox" v-model="isAgree" />
    我同意协议 - 当前：{{ isAgree }}
  </label>

  <!-- 3. 多个复选框（数组） -->
  <label><input type="checkbox" value="读书" v-model="hobbies" />读书</label>
  <label><input type="checkbox" value="打球" v-model="hobbies" />打球</label>
  <label><input type="checkbox" value="旅游" v-model="hobbies" />旅游</label>
  <p>选中：{{ hobbies }}</p>

  <!-- 4. 单选按钮 -->
  <label><input type="radio" value="male" v-model="gender" />男</label>
  <label><input type="radio" value="female" v-model="gender" />女</label>

  <!-- 5. 下拉选择 -->
  <select v-model="city">
    <option value="bj">北京</option>
    <option value="sh">上海</option>
    <option value="gz">广州</option>
  </select>

  <!-- 6. 多行文本 -->
  <textarea v-model="desc" placeholder="自我介绍" />
</template>
```

**常用修饰符：**

| 修饰符 | 作用 |
| --- | --- |
| `.lazy` | 变成 `change` 事件（失焦触发） |
| `.number` | 自动转 Number |
| `.trim` | 自动去首尾空格 |

```vue
<input v-model.number="age" />
<input v-model.trim="username" />
```

💡 一句话：`v-model` 就是"表单元素双向绑定的通用胶水"。

---

### <span class="lv lv-1">初级</span> 0.7 计算属性 computed vs 方法 methods vs 侦听器 watch（三者何时用哪个）

```vue
<script setup>
import { ref, computed, watch } from 'vue'

const firstName = ref('张')
const lastName = ref('三')

// ✅ computed：有缓存，依赖不变不会重新计算
const fullName = computed(() => firstName.value + lastName.value)

// ❌ 方法：每次访问都会执行（无缓存）
const getFullName = () => firstName.value + lastName.value

// ✅ watch：监听某个值变化，执行副作用
watch(firstName, (newV, oldV) => {
  console.log(`firstName 从 ${oldV} 变成 ${newV}`)
})

// 监听多个
watch([firstName, lastName], ([f, l]) => console.log(f, l))

// deep + immediate
const user = ref({ name: '小李', age: 18 })
watch(user, () => console.log('user 深层变了'), { deep: true, immediate: true })
</script>
```

**三者选型指南：**

| 场景 | 推荐 |
| --- | --- |
| 需要**根据现有数据派生**一个新值（如全名、总价） | `computed` |
| 只在事件触发时才算（如点击按钮拼接字符串） | `methods` |
| 数据变化时要**做异步 / 副作用**（发请求、存 localStorage） | `watch` |
| 简单情况，跟踪多个响应式源、自动追踪 | `watchEffect` |

🎯 面试点：`computed` **有缓存**，同步依赖没变时多次访问不会重新执行；`methods` 每次调用都跑。

---

### <span class="lv lv-1">初级</span> 0.8 组件基础：单文件组件 .vue 三段结构、defineProps / defineEmits、`<script setup>` 与选项式对比表

**单文件组件（SFC）三段结构：**

```vue
<script setup>
// 逻辑：ref、computed、函数、生命周期……
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <!-- 视图：HTML + 指令 + 插值 -->
  <button @click="count++">点击 {{ count }}</button>
</template>

<style scoped>
/* 样式：scoped 表示只作用于当前组件 */
button { padding: 8px 16px; }
</style>
```

**`<script setup>` vs 选项式对比：**

| 对比项 | 选项式（Options API） | `<script setup>` |
| --- | --- | --- |
| 定义响应式 | `data() { return { x: 0 } }` | `const x = ref(0)` |
| 计算属性 | `computed: { double() {...} }` | `const double = computed(...)` |
| 方法 | `methods: { fn() {...} }` | `const fn = () => {}` |
| 生命周期 | `mounted() {}` | `onMounted(() => {})` |
| this 指向 | 组件实例 | 无 this |
| 类型推导 | 需 defineComponent 包一层 | 天然 TS 友好 |
| 模板中直接用变量 | 需 `return` | 顶层绑定自动暴露 |

**Props / Emits（编译宏，无需 import）：**

```vue
<script setup>
// 定义 props（带默认值、类型）
const props = defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: 0 }
})

// TS 写法
// const props = defineProps<{ title: string; count?: number }>()

// 定义 emits
const emit = defineEmits(['change', 'delete'])
const handleClick = () => emit('change', 100)
</script>

<template>
  <div>{{ props.title }} - {{ props.count }}</div>
  <button @click="handleClick">触发 change 事件</button>
</template>
```

💡 一句话：SFC = 逻辑 + 模板 + 样式三合一，`<script setup>` 是 Vue 3 官方最推荐的写法。

---

### <span class="lv lv-1">初级</span> 0.9 组件通信入门：父传子 props、子传父 emit、v-model 组件双向绑定

**父传子（Props）：**

```vue
<!-- Parent.vue -->
<script setup>
import Child from './Child.vue'
import { ref } from 'vue'
const msg = ref('来自父组件的问候')
</script>

<template>
  <Child :message="msg" :count="10" />
</template>
```

```vue
<!-- Child.vue -->
<script setup>
defineProps(['message', 'count'])
</script>

<template>
  <p>{{ message }} / {{ count }}</p>
</template>
```

**子传父（Emit）：**

```vue
<!-- Child.vue -->
<script setup>
const emit = defineEmits(['send'])
const notify = () => emit('send', { time: Date.now(), text: '你好爸爸' })
</script>

<template>
  <button @click="notify">通知父组件</button>
</template>
```

```vue
<!-- Parent.vue -->
<script setup>
import Child from './Child.vue'
const handleSend = (payload) => console.log('收到：', payload)
</script>

<template>
  <Child @send="handleSend" />
</template>
```

**组件版 v-model（3.4+ 推荐 defineModel）：**

```vue
<!-- MyInput.vue -->
<script setup>
const value = defineModel()  // 等价于 props: modelValue + emit('update:modelValue')
</script>

<template>
  <input :value="value" @input="value = $event.target.value" />
</template>
```

```vue
<!-- 使用 -->
<script setup>
import MyInput from './MyInput.vue'
import { ref } from 'vue'
const name = ref('')
</script>

<template>
  <MyInput v-model="name" />
  <p>父组件里的 name：{{ name }}</p>
</template>
```

🎯 面试点：Vue 3 里 `v-model` 默认用 `modelValue` + `update:modelValue`；可通过 `v-model:xxx` 支持**多个 v-model**。

---

### <span class="lv lv-1">初级</span> 0.10 Vue Router 基础：安装、router-link、router-view、编程式导航 router.push；一个 3 页面小 Demo（Home / About / User/:id）

**安装：**

```bash
npm install vue-router@4
```

**路由配置 `src/router/index.ts`：**

```ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import User from '@/views/User.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/about', name: 'about', component: About },
    { path: '/user/:id', name: 'user', component: User }
  ]
})

export default router
```

**入口挂载 `src/main.ts`：**

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

**App.vue：**

```vue
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goUser = () => router.push({ name: 'user', params: { id: 123 } })
</script>

<template>
  <nav>
    <router-link to="/">首页</router-link> |
    <router-link to="/about">关于</router-link> |
    <router-link :to="{ name: 'user', params: { id: 42 } }">用户 42</router-link> |
    <button @click="goUser">编程式跳转到 用户 123</button>
  </nav>
  <hr />
  <router-view />
</template>
```

**User.vue（读取动态参数）：**

```vue
<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <h2>用户详情 - id = {{ route.params.id }}</h2>
</template>
```

**编程式导航速查：**

| 方法 | 作用 |
| --- | --- |
| `router.push({...})` | 跳转（历史栈 +1） |
| `router.replace({...})` | 替换当前记录（历史栈不变） |
| `router.back()` / `.forward()` / `.go(-2)` | 前进后退 |

💡 一句话：`router-link` = 声明式跳转，`router.push` = 编程式跳转，`router-view` = 页面容器。

---

### <span class="lv lv-1">初级</span> 0.11 生命周期钩子清单（组合式版本）+ 触发时机 ASCII 时间线

**组合式生命周期钩子：**

```vue
<script setup>
import {
  onBeforeMount, onMounted,
  onBeforeUpdate, onUpdated,
  onBeforeUnmount, onUnmounted,
  onErrorCaptured, onActivated, onDeactivated
} from 'vue'

onBeforeMount(() => console.log('挂载前：DOM 还没创建'))
onMounted(() => console.log('挂载后：DOM 已就绪，可操作 refs'))
onBeforeUpdate(() => console.log('数据变了，DOM 即将更新'))
onUpdated(() => console.log('DOM 已更新完成'))
onBeforeUnmount(() => console.log('组件即将销毁：清理定时器/事件'))
onUnmounted(() => console.log('组件已销毁'))
onErrorCaptured((err) => { console.error(err); return false })
</script>
```

**触发时机 ASCII 时间线：**

```
             ┌──────────────── setup() 执行 ────────────────┐
             │  （代替 beforeCreate / created，无 this）      │
             └───────────────────────┬─────────────────────┘
                                     ▼
                        [响应式数据初始化完成]
                                     │
                                     ▼
                            onBeforeMount()
                                     │
                                     ▼
                       ┌──────────────────────────┐
                       │  编译模板 → 创建 VNode →   │
                       │  挂载真实 DOM              │
                       └────────────┬─────────────┘
                                    ▼
                             onMounted()  ← ✅ 可访问 DOM
                                    │
                        ┌───────────┴───────────┐
                        │  【响应式数据变化】   │
                        ▼                       ▼
                  onBeforeUpdate()        onUpdated()
                        │                       │
                        └────────── 循环 ───────┘
                                    │
                                    ▼
                         onBeforeUnmount()  ← ✅ 清理副作用
                                    │
                                    ▼
                             onUnmounted()
```

**对应关系速查：**

| 选项式 | 组合式 |
| --- | --- |
| `beforeCreate` / `created` | `setup` 内部顶层代码 |
| `beforeMount` | `onBeforeMount` |
| `mounted` | `onMounted` |
| `beforeUpdate` | `onBeforeUpdate` |
| `updated` | `onUpdated` |
| `beforeUnmount` | `onBeforeUnmount` |
| `unmounted` | `onUnmounted` |

🎯 面试点：`onMounted` 才能拿到真实 DOM；发请求可以放 `setup` 顶部或 `onMounted`，取决于是否需要 SSR。

---

### <span class="lv lv-1">初级</span> 0.12 完整案例：TodoList（增删改查 + localStorage 持久化 + `<script setup>` 版本，约 60~80 行完整代码）

一个 70 行左右的完整 TodoList，含：新增、删除、完成切换、编辑、清空已完成、过滤（全部/未完成/已完成）、localStorage 自动持久化。

```vue
<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const list = ref([])                 // { id, text, done }
const input = ref('')
const filter = ref('all')            // all | active | done
const editingId = ref(null)
const editText = ref('')

// 加载
onMounted(() => {
  const raw = localStorage.getItem('todos')
  if (raw) list.value = JSON.parse(raw)
})

// 自动持久化
watch(list, v => localStorage.setItem('todos', JSON.stringify(v)), { deep: true })

// 派生数据
const filtered = computed(() => {
  if (filter.value === 'active') return list.value.filter(t => !t.done)
  if (filter.value === 'done') return list.value.filter(t => t.done)
  return list.value
})
const leftCount = computed(() => list.value.filter(t => !t.done).length)

// 增删改
function add() {
  const text = input.value.trim()
  if (!text) return
  list.value.push({ id: Date.now(), text, done: false })
  input.value = ''
}
function remove(id) { list.value = list.value.filter(t => t.id !== id) }
function toggle(t)  { t.done = !t.done }
function clearDone(){ list.value = list.value.filter(t => !t.done) }
function startEdit(t){ editingId.value = t.id; editText.value = t.text }
function saveEdit(t) { t.text = editText.value.trim() || t.text; editingId.value = null }
</script>

<template>
  <div style="max-width:420px;margin:40px auto;font-family:sans-serif">
    <h2>📝 TodoList</h2>
    <input v-model="input" @keyup.enter="add" placeholder="回车新增一条" style="width:100%;padding:8px" />

    <div style="margin:12px 0">
      <button @click="filter='all'">全部</button>
      <button @click="filter='active'">未完成</button>
      <button @click="filter='done'">已完成</button>
      <span style="float:right">剩余 {{ leftCount }} 项</span>
    </div>

    <ul style="list-style:none;padding:0">
      <li v-for="t in filtered" :key="t.id" style="display:flex;align-items:center;padding:6px 0;border-bottom:1px solid #eee">
        <input type="checkbox" :checked="t.done" @change="toggle(t)" />
        <template v-if="editingId === t.id">
          <input v-model="editText" @keyup.enter="saveEdit(t)" @blur="saveEdit(t)" style="flex:1;margin:0 8px" />
        </template>
        <span v-else @dblclick="startEdit(t)"
              :style="{flex:1,margin:'0 8px',textDecoration:t.done?'line-through':'',color:t.done?'#999':''}">
          {{ t.text }}
        </span>
        <button @click="remove(t.id)">×</button>
      </li>
    </ul>

    <button v-if="list.some(t => t.done)" @click="clearDone">清除已完成</button>
  </div>
</template>
```

**这一个案例把初级知识全串起来了：**

- `ref` / `computed` / `watch` / `onMounted`
- `v-model` / `v-for` + key / `v-if` / `@click` / `@keyup.enter`
- 事件传参、条件渲染、样式绑定
- 副作用管理（`watch` 深度监听 + localStorage）

💡 一句话：能徒手默写这个 TodoList，你就掌握了 80% 的日常 Vue 3 业务开发能力。

---

## 二、🟡 中级进阶

> 适合有一定 Vue 2 / Vue 3 基础，准备进阶到中高级岗位面试与实战的同学。

## <span class="lv lv-2">中级</span> 1. 响应式原理

Vue 3 抛弃 `Object.defineProperty`，使用 `Proxy` + `Reflect` 实现响应式。

### 1.1 核心 API

| API | 用途 | 解包 (template/.value) |
| --- | --- | --- |
| `ref(value)` | 包装基本类型/对象 | template 自动解包，js 需 `.value` |
| `reactive(obj)` | 深层代理对象 | 不需要 `.value` |
| `shallowRef` / `shallowReactive` | 仅顶层响应式 | - |
| `readonly` | 只读代理 | - |
| `computed` | 派生值 | 同 ref |
| `watch` / `watchEffect` | 副作用 | - |
| `toRef` / `toRefs` | 解构保留响应式 | - |

### 1.2 Proxy vs defineProperty

- **Proxy** 拦截 13 种操作（get/set/deleteProperty/has/ownKeys…），可监听新增/删除属性、数组索引和 length 变化。
- **defineProperty** 只能拦截已有属性的 get/set，所以 Vue 2 才有 `Vue.set/$set`。
- Proxy 不递归劫持，访问到深层对象时才创建子 Proxy（**懒代理**），初始化更快、内存更省。

### 1.3 依赖收集 (effect)

```ts
// 简化模型
const targetMap = new WeakMap<object, Map<string|symbol, Set<ReactiveEffect>>>()

function track(target, key) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))
  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set()))
  dep.add(activeEffect)
}

function trigger(target, key) {
  const dep = targetMap.get(target)?.get(key)
  dep?.forEach(effect => effect.scheduler ? effect.scheduler() : effect())
}
```

要点：
- `effect` 执行前把自己挂到全局 `activeEffect`；
- `getter` 触发 `track`，`setter` 触发 `trigger`；
- `WeakMap` 让 target 可被 GC；
- `scheduler` 让组件渲染走异步队列（`queueJob`）。

### 1.4 ref 为什么需要 `.value`

`ref(0)` 包装的是基本类型，JS 没法对原始值做 Proxy，因此用一个对象 `{ value }` 当容器，并用 getter/setter 实现响应式。模板编译时遇到顶层 ref 会自动加 `.value`。

### 1.5 reactive 的限制

- 解构、扩展会丢响应式 → 用 `toRefs`；
- 不能整体替换：`state = newObj` ❌ → 用 `Object.assign` 或重新调用 `reactive`；
- 不能直接代理 Map/Set/WeakMap 之外的类（如 Class 实例需自定义）。

---

## <span class="lv lv-2">中级</span> 2. Composition API 与 `<script setup>`

### 2.1 setup 执行时机

`setup` 在 `beforeCreate` 之前，没有 `this`。`<script setup>` 是编译时语法糖：

```vue
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
defineProps<{ msg: string }>()
defineEmits<{ change: [value: number] }>()
defineExpose({ count })
</script>
```

编译后等价于带 `setup()` 的对象，但模板里直接使用顶层绑定，无需 `return`。

### 2.2 生命周期对应

| Options API | Composition API |
| --- | --- |
| `beforeCreate` / `created` | `setup()` 内顶层代码 |
| `beforeMount` / `mounted` | `onBeforeMount` / `onMounted` |
| `beforeUpdate` / `updated` | `onBeforeUpdate` / `onUpdated` |
| `beforeUnmount` / `unmounted` | `onBeforeUnmount` / `onUnmounted` |
| `errorCaptured` | `onErrorCaptured` |
| - | `onRenderTracked` / `onRenderTriggered` (debug) |
| - | `onActivated` / `onDeactivated` (keep-alive) |
| - | `onServerPrefetch` (SSR) |

### 2.3 编译宏

`defineProps` / `defineEmits` / `defineExpose` / `defineModel` / `defineSlots` / `defineOptions` 都是**编译宏**，不需要 import，运行时不存在。

`defineModel` (3.4+) 简化双向绑定：

```vue
<!-- 子组件 -->
<script setup>
const modelValue = defineModel<string>()
const [first] = defineModel<string>('firstName')
</script>
<input v-model="modelValue" />
```

---

## <span class="lv lv-2">中级</span> 3. 组件通信与依赖注入

| 场景 | 方案 |
| --- | --- |
| 父→子 | `props` |
| 子→父 | `emits` |
| 双向 | `v-model` / `defineModel` |
| 跨层级 | `provide` / `inject` |
| 任意组件 | Pinia / mitt（事件总线） |
| 暴露子方法 | `defineExpose` + `ref` |
| 子组件渲染父 | 作用域插槽 |

### 3.1 provide/inject 类型安全

```ts
// keys.ts
import type { InjectionKey, Ref } from 'vue'
export const ThemeKey: InjectionKey<Ref<'dark' | 'light'>> = Symbol('theme')

// provider
provide(ThemeKey, ref('dark'))

// consumer
const theme = inject(ThemeKey)! // 已知一定存在
```

注意：默认 inject 不响应式，要响应式需 provide ref/reactive 而不是其 `.value`。

### 3.2 透传属性（Fallthrough Attributes）

非 props 的属性（class/style/事件）默认会透传到根元素。多根节点需 `v-bind="$attrs"` 显式绑定，或 `inheritAttrs: false` 关闭。

---

## <span class="lv lv-2">中级</span> 4. 自定义 Hook（Composables）设计

设计原则：
1. 命名 `useXxx`；
2. 返回 ref / reactive，便于解构（`toRefs`）；
3. 内部要管理生命周期（`onUnmounted` 清理副作用）；
4. 支持 SSR 友好：用 `getCurrentInstance()` 判断或避免 window 直接访问。

### 4.1 示例：useFetch

```ts
import { ref, watchEffect, isRef, unref, type Ref } from 'vue'

export function useFetch<T>(url: string | Ref<string>) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  const controller = new AbortController()

  const run = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(unref(url), { signal: controller.signal })
      data.value = await res.json()
    } catch (e) {
      if ((e as Error).name !== 'AbortError') error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  if (isRef(url)) watchEffect(run)
  else run()

  onUnmounted(() => controller.abort())

  return { data, error, loading, refetch: run }
}
```

### 4.2 useEventListener

```ts
export function useEventListener<K extends keyof WindowEventMap>(
  target: Window | Ref<EventTarget | null>,
  event: K,
  cb: (e: WindowEventMap[K]) => void
) {
  onMounted(() => {
    const el = unref(target) ?? window
    el.addEventListener(event, cb as any)
  })
  onUnmounted(() => {
    const el = unref(target) ?? window
    el.removeEventListener(event, cb as any)
  })
}
```

---

## <span class="lv lv-2">中级</span> 7. 性能优化实践

1. **拆分组件**：把易变与稳定结构分离，利用 PatchFlag。
2. **`shallowRef` / `shallowReactive`**：第三方实例（chart、map）只需引用变化即可重渲染。
3. **`v-show` vs `v-if`**：频繁切换用 `v-show`，懒加载用 `v-if`。
4. **大列表**：虚拟滚动（`vue-virtual-scroller` / `vueuse/useVirtualList`）。
5. **`defineAsyncComponent`** + 路由级 `defineAsyncComponent` + `Suspense`。
6. **避免不必要响应式**：常量、字典 freeze 或 markRaw。
7. **图片懒加载**、`requestIdleCallback`、`web worker` 解码大数据。
8. **打包**：`build.target` 指定 esnext，开 `cssCodeSplit`、按路由分 chunk。
9. **`keep-alive`** 缓存路由组件，配合 `include` / `max`。

```ts
import { markRaw } from 'vue'
const map = markRaw(new AMap.Map(...)) // 不会被代理
```

---

## <span class="lv lv-2">中级</span> 8. Pinia 状态管理

### 8.1 Store 写法

```ts
import { defineStore } from 'pinia'

// Setup Store（推荐）
export const useUserStore = defineStore('user', () => {
  const id = ref<number | null>(null)
  const name = ref('')
  const isLogin = computed(() => id.value !== null)

  async function login(payload: LoginDTO) {
    const r = await api.login(payload)
    id.value = r.id; name.value = r.name
  }
  function logout() { id.value = null; name.value = '' }

  return { id, name, isLogin, login, logout }
}, { persist: true })
```

### 8.2 比 Vuex 优点

- 无 mutation，action 同步异步统一；
- 完整 TS 推断；
- 模块即文件，不需要 module 嵌套；
- 体积更小（~1KB），支持 SSR、热更新；
- 插件机制（持久化、撤销重做、日志）。

### 8.3 跨 Store 通信

```ts
const userStore = useUserStore()
const cartStore = useCartStore()
watch(() => userStore.id, () => cartStore.reset())
```

注意：在 setup 外（如路由守卫）使用 `useStore()` 必须传 `pinia` 实例或在 `app.use(pinia)` 之后。

---

## <span class="lv lv-2">中级</span> 9. Vue Router 4 进阶

### 9.1 动态路由 & 懒加载

```ts
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/user/:id(\\d+)',
      component: () => import('@/views/User.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    { path: '/:pathMatch(.*)*', component: NotFound }
  ]
})
```

### 9.2 守卫执行顺序

1. 全局 `beforeEach`；
2. 路由独享 `beforeEnter`；
3. 组件 `beforeRouteEnter`（不能访问 `this`，可用 `next(vm => ...)`）；
4. 解析异步组件；
5. 全局 `beforeResolve`；
6. 全局 `afterEach`；
7. DOM 更新；
8. 触发 mounted / `beforeRouteEnter` 的 next 回调。

### 9.3 滚动行为 + 异步过渡

```ts
scrollBehavior(to, from, savedPosition) {
  if (savedPosition) return savedPosition
  if (to.hash) return { el: to.hash, behavior: 'smooth' }
  return { top: 0 }
}
```

配合 `<router-view v-slot="{ Component }">` + `<Transition>` + `<Suspense>` 做加载态：

```vue
<router-view v-slot="{ Component }">
  <Transition mode="out-in">
    <Suspense>
      <component :is="Component" />
      <template #fallback>Loading...</template>
    </Suspense>
  </Transition>
</router-view>
```

---

## <span class="lv lv-2">中级</span> 11. 单元测试与 E2E

- **Vitest**（推荐）：与 Vite 共享 transform，速度快；`@vue/test-utils` 用于挂载组件。
- **Cypress / Playwright**：E2E。

```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Hello from '@/components/Hello.vue'

describe('Hello', () => {
  it('renders msg', () => {
    const w = mount(Hello, { props: { msg: 'hi' } })
    expect(w.text()).toContain('hi')
  })
})
```

测试 composables 用 `withSetup` 包一层 dummy 组件，或 `effectScope` 手动管理。

---

## <span class="lv lv-2">中级</span> 12. 工程化与构建

- **Vite**：基于原生 ESM + esbuild，支持 HMR；插件机制兼容 Rollup。
- 区分 `dependencies` / `devDependencies`；
- `vite-plugin-checker`：在 dev 时同时跑 `vue-tsc` 类型检查；
- `unplugin-auto-import` + `unplugin-vue-components`：按需引入；
- `vite-plugin-pwa`：PWA；
- 多页应用：`build.rollupOptions.input`；
- 生产排查：`vite build --report` / `rollup-plugin-visualizer`。

---

## 三、🔴 高级实战

> 适合准备源码剖析、性能极限优化、SSR / Nuxt 3 部署以及一线大厂面试的同学。

## <span class="lv lv-3">高级</span> 5. 渲染机制与虚拟 DOM

### 5.1 流程

`template` → **compile**（生成 render 函数） → 运行时执行 render → **VNode 树** → **patch** 真实 DOM。

### 5.2 diff 算法

Vue 3 采用**最长递增子序列 (LIS)** 优化 keyed children diff：

1. 同步处理头尾相同节点；
2. 处理仅新增 / 仅删除；
3. 中间未知顺序部分：建立 `key → newIndex` 映射；
4. 计算需要保留的节点的最长递增子序列，不在 LIS 中的节点才执行 move；
5. 大幅减少 DOM 操作次数。

### 5.3 静态提升 & PatchFlag

```js
// 编译产物（伪代码）
const _hoisted = createVNode('div', null, 'static', -1 /* HOISTED */)
function render() {
  return [_hoisted, createVNode('span', null, ctx.dynamic, 1 /* TEXT */)]
}
```

- 静态节点提升到 render 外，避免重复创建；
- `PatchFlag` 标记动态部分，运行时只比对必要属性（`TEXT=1`、`CLASS=2`、`STYLE=4`、`PROPS=8`、`FULL_PROPS=16`、`HYDRATE_EVENTS=32`、`STABLE_FRAGMENT=64`、`KEYED_FRAGMENT=128`、`UNKEYED_FRAGMENT=256`、`NEED_PATCH=512`、`DYNAMIC_SLOTS=1024`）；
- `Block Tree`：dynamicChildren 数组存储所有带 PatchFlag 的子节点，diff 时跳过静态层级（**Block Tree 拍平**）。

---

## <span class="lv lv-3">高级</span> 6. 编译时优化

| 优化 | 效果 |
| --- | --- |
| Tree-shaking | 全量 API 模块化，按需打包 |
| 静态提升 (hoistStatic) | 静态 VNode 一次创建反复复用 |
| PatchFlag | 跳过静态属性 diff |
| Block Tree | 跳过静态层级 diff |
| 缓存事件回调 (cacheHandlers) | 避免每次渲染重新生成箭头函数 |
| SSR 优化 | 静态字符串拼接，跳过 vnode |

`v-once` / `v-memo` 显式控制渲染缓存：

```vue
<div v-memo="[user.id]"><HeavyChild :user="user" /></div>
```

---

## <span class="lv lv-3">高级</span> 10. SSR / Nuxt 3

- **Hydration**：服务端生成 HTML，浏览器接管事件 → 注意避免 client/server 不一致。
- 数据预取：`onServerPrefetch` 或 Nuxt 的 `useAsyncData` / `useFetch`。
- Nuxt 3 基于 Nitro，自动文件路由、API routes、Server Engine、混合渲染（`routeRules`）。
- Edge SSR：可部署到 Cloudflare / Vercel Edge。

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },          // SSG
    '/admin/**': { ssr: false },        // SPA
    '/api/**': { cors: true },
    '/blog/**': { isr: 60 }             // ISR
  }
})
```

---

## <span class="lv lv-3">高级</span> 13. 常见面试题

1. Vue 3 响应式原理与 Vue 2 区别？
2. ref 与 reactive 区别？什么时候用哪个？
3. 为什么不能解构 reactive 对象？
4. `watch` 与 `watchEffect` 区别？deep / immediate / flush 选项？
5. `nextTick` 原理？
6. Composition API 解决了什么痛点？
7. `<script setup>` 编译过程？
8. PatchFlag 与 Block Tree 是什么？
9. diff 算法为什么用 LIS？
10. keep-alive 原理与命中规则？
11. Teleport / Suspense 用法？
12. Pinia 为什么取代 Vuex？
13. SSR 的 Hydration 问题怎么排查？
14. v-model 在 Vue 3 中的实现？多个 v-model？
15. 自定义指令在 3.x 中的钩子变化？

---

> 持续学习路线：源码阅读（`@vue/reactivity` → `@vue/runtime-core` → `@vue/compiler-core`）→ 自己实现 Mini-Vue → 阅读 Vapor Mode RFC（无虚拟 DOM 编译方案）。

---

## <span class="lv lv-3">高级</span> 附录 A：Vue 3 全栈脚手架实战（2025）

> 一份「clone 下来就能跑」的中后台管理系统脚手架，覆盖登录鉴权 / 权限路由 / axios 封装 / 组件按需 / 主题切换 / ESLint 9 flat config / Vitest 单测 / CI，直接对标企业实战。

### A.1 技术选型

2024–2025 主流选型清单，全部锁定当前 LTS 版本，避免"装完就报废"：

| 分层 | 选型 | 版本 | 说明 |
| --- | --- | --- | --- |
| 框架 | Vue | 3.4+ | `defineModel` 稳定、Reactivity Transform 移除 |
| 构建 | Vite | 5.x | Rolldown 试验通道可选 |
| 语言 | TypeScript | 5.4+ | `verbatimModuleSyntax` 强制类型导入 |
| 状态 | Pinia | 3.x | setup 语法 + persistedstate |
| 路由 | Vue Router | 4.4+ | 动态路由 + 类型化 meta |
| UI | Element Plus | 2.7+ | 按需 + 主题 CSS Var |
| 请求 | axios | 1.7+ | 拦截器 + refresh token |
| 工具 | VueUse | 10+ | 响应式工具集合 |
| 按需 | unplugin-auto-import / unplugin-vue-components | latest | 组件与 API 零手写 import |
| Lint | ESLint | 9 flat | 干掉 `.eslintrc` |
| 格式 | Prettier | 3.x | 与 ESLint 9 共存 |
| 单测 | Vitest | 1.6+ | 与 Vite 共享配置 |
| E2E | Playwright | 1.44+ | 官方推荐 |
| 图表 | ECharts | 5.5 | 手动按需 |
| 包管理 | pnpm | 9.x | workspace + 硬链接 |

💡 选型口诀：**能装 5.x 就不装 4.x，能上 flat config 就不留 rc**，早升级早解脱。

### A.2 目录结构（ASCII 树）

```bash
v3-admin-scaffold/
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions：lint + test + build + deploy
├── .env.development                # 开发环境变量
├── .env.production                 # 生产环境变量
├── .env.staging                    # 预发环境变量
├── eslint.config.js                # ESLint 9 flat config
├── prettier.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── auto-imports.d.ts               # 由 unplugin-auto-import 生成
├── components.d.ts                 # 由 unplugin-vue-components 生成
├── public/
│   └── favicon.ico
└── src/
    ├── main.ts                     # 入口：createApp + 插件注册
    ├── App.vue
    ├── shims-vue.d.ts
    ├── vite-env.d.ts
    ├── api/                        # 接口层，按业务领域拆分
    │   ├── modules/
    │   │   ├── user.ts
    │   │   └── system.ts
    │   └── types/
    │       └── user.d.ts
    ├── assets/
    │   ├── icons/
    │   └── styles/
    │       ├── index.scss
    │       ├── variables.scss
    │       └── theme/
    │           ├── light.scss
    │           └── dark.scss
    ├── components/                 # 全局公共组件
    │   ├── SvgIcon/
    │   └── PageTable/
    ├── composables/                # 组合式函数
    │   ├── useTheme.ts
    │   └── usePermission.ts
    ├── directives/
    │   ├── index.ts
    │   └── permission.ts           # v-permission 按钮级权限
    ├── layouts/
    │   ├── default.vue             # 侧栏 + 面包屑 + 用户下拉
    │   └── blank.vue
    ├── router/
    │   ├── index.ts                # 前置守卫 + 动态路由
    │   ├── routes.static.ts        # 静态路由（登录、404）
    │   └── routes.async.ts         # 后端下发的动态路由种子
    ├── stores/
    │   ├── index.ts                # createPinia + persistedstate
    │   ├── user.ts                 # 用户与 token
    │   └── permission.ts           # 菜单 / 按钮权限
    ├── utils/
    │   ├── request.ts              # axios 封装
    │   ├── auth.ts                 # token 存取
    │   └── router-helper.ts        # 动态路由 → RouteRecord
    └── views/
        ├── login/
        │   └── index.vue
        ├── dashboard/
        │   └── index.vue
        └── error/
            ├── 404.vue
            └── 403.vue
```

💡 目录心法：**按"层"拆而不是按"页面"拆**——`api / stores / views / components` 并列，业务模块作为二级目录，人多也不会撞车。

### A.3 关键源码

#### A.3.1 `vite.config.ts`（按需引入 + 环境分层 + 代理）

```ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    base: env.VITE_PUBLIC_PATH || '/',
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
        resolvers: [ElementPlusResolver()],
        dts: 'auto-imports.d.ts',
        eslintrc: { enabled: true },
      }),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
        dts: 'components.d.ts',
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: { additionalData: `@use "@/assets/styles/variables.scss" as *;` },
      },
    },
    server: {
      port: Number(env.VITE_PORT) || 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      target: 'es2020',
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
            echarts: ['echarts'],
          },
        },
      },
    },
  }
})
```

💡 一句话：**代理 + 按需 + 分包**三件事在这里一次配齐，剩下的都是业务。

#### A.3.2 `src/main.ts`（应用启动 + 插件注册）

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import directives from './directives'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/styles/index.scss'

async function bootstrap() {
  const app = createApp(App)
  app.use(pinia)
  app.use(router)
  directives(app)                    // 注册 v-permission 等自定义指令
  app.config.errorHandler = (err, instance, info) => {
    console.error('[GlobalError]', err, info)
    // 生产环境上报 Sentry / 自研监控
  }
  await router.isReady()
  app.mount('#app')
}

bootstrap()
```

💡 用 `bootstrap` 包一层，方便未来插入"首屏权限预取"之类的异步流程。

#### A.3.3 `src/utils/request.ts`（axios 拦截器 + refresh token）

```ts
import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15_000,
})

let isRefreshing = false
let pending: Array<(token: string) => void> = []

service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const user = useUserStore()
  if (user.token) config.headers.Authorization = `Bearer ${user.token}`
  return config
})

service.interceptors.response.use(
  (res) => {
    const { code, data, message } = res.data
    if (code === 0) return data
    ElMessage.error(message || '请求失败')
    return Promise.reject(new Error(message))
  },
  async (error: AxiosError) => {
    const user = useUserStore()
    const original = error.config as AxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      if (!isRefreshing) {
        isRefreshing = true
        try {
          const newToken = await user.refresh()
          pending.forEach((cb) => cb(newToken))
          pending = []
        } finally {
          isRefreshing = false
        }
      }
      return new Promise((resolve) => {
        pending.push((token) => {
          original.headers!.Authorization = `Bearer ${token}`
          resolve(service(original))
        })
      })
    }
    ElMessage.error(error.message)
    return Promise.reject(error)
  },
)

export default service
```

💡 refresh 队列是 axios 封装里最常翻车的地方，务必测「并发 401」用例。

#### A.3.4 `src/router/index.ts`（前置守卫 + 动态路由注入）

```ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'
import { staticRoutes } from './routes.static'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: staticRoutes as RouteRecordRaw[],
  scrollBehavior: () => ({ top: 0 }),
})

const WHITE_LIST = ['/login', '/404', '/403']

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  const user = useUserStore()
  const perm = usePermissionStore()

  if (!user.token) {
    if (WHITE_LIST.includes(to.path)) return next()
    return next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  if (!user.profile) {
    try {
      await user.fetchProfile()
      const routes = await perm.generateRoutes(user.profile!.roles)
      routes.forEach((r) => router.addRoute(r))
      return next({ ...to, replace: true })
    } catch (e) {
      await user.logout()
      return next('/login')
    }
  }
  next()
})

router.afterEach(() => NProgress.done())
export default router
```

💡 记住 `next({ ...to, replace: true })` 这一行——否则动态路由加进去，页面依然是 404。

#### A.3.5 `src/stores/user.ts`（Pinia setup + persistedstate）

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'
import type { UserProfile, LoginPayload } from '@/api/types/user'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string>('')
    const refreshToken = ref<string>('')
    const profile = ref<UserProfile | null>(null)

    async function login(payload: LoginPayload) {
      const { accessToken, refreshToken: rt } = await request.post('/auth/login', payload)
      token.value = accessToken
      refreshToken.value = rt
    }
    async function fetchProfile() {
      profile.value = await request.get<UserProfile>('/user/profile')
    }
    async function refresh(): Promise<string> {
      const { accessToken } = await request.post('/auth/refresh', { refreshToken: refreshToken.value })
      token.value = accessToken
      return accessToken
    }
    async function logout() {
      try { await request.post('/auth/logout') } catch { /* ignore */ }
      token.value = ''; refreshToken.value = ''; profile.value = null
    }
    return { token, refreshToken, profile, login, fetchProfile, refresh, logout }
  },
  {
    persist: {
      pick: ['token', 'refreshToken'],
      storage: localStorage,
    },
  },
)
```

💡 只持久化 token，`profile` 每次刷新重新拉——避免用户改了昵称还看到旧的。

#### A.3.6 `src/directives/permission.ts`（按钮级权限）

```ts
import type { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/user'

function check(binding: DirectiveBinding<string | string[]>): boolean {
  const user = useUserStore()
  const perms = user.profile?.permissions ?? []
  const need = binding.value
  if (!need) return true
  if (Array.isArray(need)) return need.some((p) => perms.includes(p))
  return perms.includes(need)
}

export const permission: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    if (!check(binding)) el.parentNode?.removeChild(el)
  },
  updated(el, binding) {
    if (!check(binding)) el.parentNode?.removeChild(el)
  },
}
```

用法：`<el-button v-permission="'user:delete'">删除</el-button>`

💡 「删」比「隐藏」更安全——`display:none` 用户 F12 就能改回来。

#### A.3.7 `src/layouts/default.vue`（侧栏 + 面包屑 + 用户下拉）

```vue
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'

const route = useRoute()
const router = useRouter()
const user = useUserStore()
const perm = usePermissionStore()

const breadcrumbs = computed(() =>
  route.matched.filter((r) => r.meta?.title).map((r) => ({ title: r.meta!.title as string, path: r.path })),
)

async function handleLogout() {
  await user.logout()
  router.replace('/login')
}
</script>

<template>
  <el-container class="layout">
    <el-aside width="220px">
      <el-menu :default-active="route.path" router>
        <template v-for="m in perm.menus" :key="m.path">
          <el-menu-item :index="m.path">{{ m.meta.title }}</el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="b in breadcrumbs" :key="b.path" :to="{ path: b.path }">
            {{ b.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown @command="handleLogout">
          <span>{{ user.profile?.nickname }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main><router-view v-slot="{ Component }"><component :is="Component" /></router-view></el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout { height: 100vh; }
.header { display: flex; justify-content: space-between; align-items: center; }
</style>
```

💡 用 `route.matched` 做面包屑，天然与嵌套路由同步，不用自己维护栈。

#### A.3.8 `src/views/login/index.vue`（登录页 + 表单校验）

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const form = reactive({ username: '', password: '' })
const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, min: 6, message: '至少 6 位', trigger: 'blur' }],
}
const formRef = ref<FormInstance>()
const loading = ref(false)
const route = useRoute()
const router = useRouter()
const user = useUserStore()

async function onSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    await user.login(form)
    ElMessage.success('登录成功')
    router.replace((route.query.redirect as string) || '/')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login">
    <el-card class="box">
      <h2>V3 Admin 登录</h2>
      <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="onSubmit">
        <el-form-item prop="username"><el-input v-model="form.username" placeholder="用户名" /></el-form-item>
        <el-form-item prop="password"><el-input v-model="form.password" type="password" show-password placeholder="密码" /></el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading" style="width:100%">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login { display: flex; align-items: center; justify-content: center; height: 100vh; background: #f0f2f5; }
.box { width: 380px; }
</style>
```

💡 `router.replace` 而不是 `push`——防止用户按后退键跳回登录页。

#### A.3.9 `src/views/dashboard/index.vue`（欢迎页 + ECharts）

```vue
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([BarChart, GridComponent, TooltipComponent, TitleComponent, CanvasRenderer])

const chartEl = ref<HTMLDivElement>()
let instance: echarts.ECharts | null = null

function render() {
  if (!chartEl.value) return
  instance = echarts.init(chartEl.value)
  instance.setOption({
    title: { text: '本周订单量' },
    tooltip: {},
    xAxis: { data: ['一', '二', '三', '四', '五', '六', '日'] },
    yAxis: {},
    series: [{ name: '订单', type: 'bar', data: [120, 200, 150, 80, 70, 110, 130] }],
  })
}
const onResize = () => instance?.resize()

onMounted(() => { render(); window.addEventListener('resize', onResize) })
onBeforeUnmount(() => { window.removeEventListener('resize', onResize); instance?.dispose() })
</script>

<template>
  <div>
    <h2>Welcome</h2>
    <div ref="chartEl" style="width:100%;height:360px" />
  </div>
</template>
```

💡 ECharts 一定要 `dispose`，否则切页 20 次内存爆炸。

#### A.3.10 `eslint.config.js`（ESLint 9 flat config）

```js
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import autoImport from './.eslintrc-auto-import.json' assert { type: 'json' }

export default [
  { ignores: ['dist', 'node_modules', 'auto-imports.d.ts', 'components.d.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    languageOptions: {
      globals: { ...autoImport.globals },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  prettier,
]
```

💡 记得在 `AutoImport` 里开 `eslintrc.enabled = true`，flat 里 `import` 那份 JSON 才有值。

### A.4 CI/CD（GitHub Actions 一键部署）

`.github/workflows/ci.yml`：

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - name: Install
        run: pnpm install --frozen-lockfile
      - name: Lint
        run: pnpm lint
      - name: Unit test
        run: pnpm test:unit --run
      - name: Build
        run: pnpm build
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with: { name: dist, path: dist }

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist, path: dist }
      - name: Deploy to OSS / S3
        env:
          OSS_KEY: ${{ secrets.OSS_KEY }}
          OSS_SECRET: ${{ secrets.OSS_SECRET }}
        run: npx @aliyun/oss-cli sync dist oss://my-bucket/admin --delete
```

💡 build 与 deploy 拆两个 job，PR 只跑 build——省 CI 分钟数还能防误发。

### A.5 常见坑与调试

1. **接口跨域**：dev 用 vite proxy，prod 走 Nginx `proxy_pass`，切勿在生产依赖 `Access-Control-Allow-Origin: *`。排查时先看 `Network → Request URL` 是不是打到了 `/api`。
2. **环境变量泄露**：`VITE_` 前缀的变量会打包进 bundle，密钥类东西**只能**放后端。误用 `VITE_APP_SECRET` 存在客户端等同裸奔。
3. **权限指令未生效**：`v-permission` 依赖 `user.profile.permissions`，如果动态路由生成早于 profile 请求，按钮就会全部渲染。解决办法：`fetchProfile` 完成后再 `generateRoutes`。
4. **生产 CDN 加载失败**：`vite.config.ts` 的 `base` 必须与部署路径一致；若走 CDN 子路径，还需给 `publicPath` 和 `router` 的 `history` 传同一个值，否则刷新 404。
5. **ESLint 9 与旧插件不兼容**：常见报错 `context.getScope is not a function`。方案：升级 `eslint-plugin-vue` 到 9.26+、`typescript-eslint` 到 7+，或用 `@eslint/compat` 的 `fixupPluginRules` 兼容旧插件。

🎯 学习秘诀：先跑通再改造，每个改造对应一次 commit，一个月能吃透整个前端工程化。

---

## <span class="lv lv-3">高级</span> 附录 B：Vue 3.4+ / Vapor / 生态 2025 现状

Vue 3.4（Slam Dunk）在 2023 年底发布，带来编译器重写与 `defineModel` 稳定；3.5 强化了响应式系统与 SSR；3.6（2025 年内陆续 alpha/beta）把 **Vapor Mode** 从实验推向可用。整个生态也在经历 Vite 6 / Nuxt 4 / Pinia 3 / oxlint 的第二次跃迁。本附录只讲**新东西**，老 API 请回上文查。

### B.1 `defineModel` 全用法（3.4 稳定）

`defineModel` 是编译宏，等价于 `props: { modelValue }` + `emits: ['update:modelValue']` + 内部 computed 双向代理，一行顶十行。

#### 单值最简

```vue
<!-- MyInput.vue -->
<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <input v-model="model" />
</template>
```

父组件：

```vue
<MyInput v-model="text" />
```

💡 `defineModel` 返回的是一个 **ref**，直接 `.value` 就能读写；子组件里改它会自动触发父组件的 `update:xxx`。

#### 多个 v-model

```vue
<script setup lang="ts">
const title = defineModel<string>('title', { required: true })
const count = defineModel<number>('count', { default: 0 })
</script>

<template>
  <input v-model="title" />
  <button @click="count++">+1（{{ count }}）</button>
</template>
```

```vue
<UserForm v-model:title="form.title" v-model:count="form.count" />
```

#### 修饰符（modifiers）+ getter/setter 转换

`v-model.trim`、`v-model.number` 这类修饰符 3.4 之前只有内建有效，自定义组件拿不到。现在可以：

```vue
<!-- SearchInput.vue -->
<script setup lang="ts">
const [model, modifiers] = defineModel<string>({
  // 父层写了修饰符时，读值前做转换
  get(v) {
    return v ?? ''
  },
  set(v) {
    let next = v
    if (modifiers.trim) next = next.trim()
    if (modifiers.upper) next = next.toUpperCase()
    return next
  },
})
</script>

<template>
  <input :value="model" @input="model = ($event.target as HTMLInputElement).value" />
</template>
```

父组件：

```vue
<SearchInput v-model.trim.upper="keyword" />
```

💡 修饰符判断放在 `set` 里而不是 `get`，是为了让存进去的值本身就是干净的，避免多处再判。

🎯 学习秘诀：只要子组件的输入需要"输入即整形"（trim/大写/千分位/邮箱小写），第一反应就是 `defineModel` + `set` 拦截，不要再手写 emit。

---

### B.2 `defineOptions` / `defineSlots`（3.3+）

以前 `<script setup>` 想改 `name` / `inheritAttrs` 得再挂一个普通 `<script>`，很丑：

```vue
<script lang="ts">
export default { name: 'MyModal', inheritAttrs: false }
</script>
<script setup lang="ts">/* ... */</script>
```

3.3 之后直接：

```vue
<script setup lang="ts">
defineOptions({
  name: 'MyModal',
  inheritAttrs: false,
})
</script>
```

`defineSlots` 用来给插槽加类型，配合 IDE 自动补全非常爽：

```vue
<script setup lang="ts">
defineSlots<{
  default(props: { row: User; index: number }): any
  header?(props: { title: string }): any
  empty?(): any
}>()
</script>

<template>
  <slot name="header" title="用户列表" />
  <slot v-for="(row, i) in list" :row="row" :index="i" />
  <slot v-if="!list.length" name="empty" />
</template>
```

父组件写 `#default="{ row, index }"` 时，`row` 就直接是 `User`，写错字段编辑器就红。

💡 `defineSlots` **只提供类型**，运行期不做校验；如果需要"必须传某个 slot"，还得自己在模板里判空。

🎯 学习秘诀：`defineOptions` 治丑，`defineSlots` 治乱；组件库作者两个都必开。

---

### B.3 Reactivity Transform 已废弃（3.4 移除）

一句话：**别再学 `$ref` / `$computed` / `$$()` 了**，官方已经**从核心里删除**，`@vue/reactivity-transform` 也进入 archive-only 状态。

#### 为什么废弃

1. **破坏静态可分析性**：`let count = $ref(0)` 语法上是普通变量，但语义上是 ref，工具链（TS server、ESLint、bundler）需要 hack 才能理解。
2. **和 TS 冲突**：`count++` 让人以为是 number，但传给函数时又要 `$$(count)` 装回 ref，心智模型两套。
3. **社区反馈负面**：Evan You 在 3.3 时就标 deprecated，3.4 正式删除。

#### 旧代码迁移

原来：

```ts
let count = $ref(0)
const double = $computed(() => count * 2)
watch(() => count, v => console.log(v))
function passRef() {
  useSomething($$(count))
}
```

改回标准写法：

```ts
const count = ref(0)
const double = computed(() => count.value * 2)
watch(count, v => console.log(v))
function passRef() {
  useSomething(count)
}
```

💡 别惋惜"少写 `.value`"这点便利——`.value` 就是 Vue 响应式的**类型边界**，写多了反而是安全感。看到 `.value` 就知道"这是响应式源"。

🎯 学习秘诀：新代码全部用 `ref` + `.value`；老项目里遇到 `$ref` 就顺手改掉，不要拖到 3.6 之后再动。

---

### B.4 Vapor Mode 现状（3.6 alpha/beta）

Vapor Mode 是 Vue 3.6 引入的**新渲染策略**：**抛弃虚拟 DOM，编译期把模板直接编译成命令式 DOM 操作 + 细粒度响应式订阅**，思路和 SolidJS/Svelte 一致。

#### 为什么要做

- VDOM diff 在小组件上其实是净开销：一次 patch 要遍历整棵 VNode 树。
- 现代 Vue 应用 90% 的更新都是"某个 ref 变了 → 某个 DOM 属性变了"，直接绑定就够，不需要中间层。
- Vapor 编译出的 bundle 通常比 VDOM 版本**小 40%~60%**，运行时也更快。

#### 启用方式（3.6 语法）

**组件级切换**——单文件顶部加宏：

```vue
<!-- Counter.vue -->
<script setup lang="ts" vapor>
import { ref } from 'vue'

const count = ref(0)
function inc() {
  count.value++
}
</script>

<template>
  <button @click="inc">Vapor Counter: {{ count }}</button>
</template>
```

或 `vite.config.ts` 里全局启用（实验性）：

```ts
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      features: {
        vapor: true, // 3.6+ 实验开关
      },
    }),
  ],
}
```

#### 性能收益（Evan You @VueConf 2024 数据）

- 首次渲染：~2× 于 VDOM 模式
- 更新性能：~3× 于 VDOM 模式
- 内存占用：~一半
- 打包体积：runtime-core 从 ~30KB 降到 ~10KB

#### 当前限制

1. **Options API 不支持**：Vapor 只兼容 `<script setup>`。
2. **部分内建组件缺失**：`<Transition>` / `<KeepAlive>` 需要 vapor 版本，正在补齐。
3. **不能跨模式复用**：Vapor 组件和 VDOM 组件可以互相包含，但共享状态时要注意 provide/inject 的一致性。
4. **SSR 支持**：3.6 beta 才开始适配，Nuxt 集成还要等。

#### 对比 SolidJS

| 维度 | Vapor Mode | SolidJS |
|------|-----------|---------|
| 模板语法 | Vue SFC（`<template>`） | JSX |
| 响应式源 | ref/reactive（Proxy） | Signal（函数调用 `count()`） |
| 生态复用 | 完整继承 Vue 生态（Pinia/Router/Nuxt） | 独立生态 |
| 迁移成本 | 现有 Vue 项目局部启用 | 从零重写 |

💡 Vapor 出来后，Vue 就变成了"**同一套语法，两种运行时**"：小组件用 VDOM 灵活，热点组件切 Vapor 提速——这是 React 短期做不到的。

🎯 学习秘诀：**不要为了 Vapor 而 Vapor**。先用 devtools 找到 diff 慢的组件，再局部开 vapor，性能优化的最高境界永远是"改动最少，收益最大"。

---

### B.5 Suspense + `onErrorCaptured` 完整错误边界

`<Suspense>` 3.0 就有，但一直"实验性"，3.4/3.5 稳定后配合 `onErrorCaptured` 才算完整的错误边界方案。

#### 嵌套 Suspense + 骨架屏

```vue
<!-- UserProfilePage.vue -->
<script setup lang="ts">
import { defineAsyncComponent, onErrorCaptured, ref } from 'vue'

const UserCard = defineAsyncComponent(() => import('./UserCard.vue'))
const OrderList = defineAsyncComponent(() => import('./OrderList.vue'))

const error = ref<Error | null>(null)
onErrorCaptured(e => {
  error.value = e as Error
  return false // 阻止继续向上冒泡
})
</script>

<template>
  <div v-if="error" class="error-boundary">
    <h3>页面出错了</h3>
    <pre>{{ error.message }}</pre>
    <button @click="error = null; $forceUpdate()">重试</button>
  </div>

  <Suspense v-else>
    <template #default>
      <div class="profile">
        <UserCard />
        <!-- 内层再套一个 Suspense，让订单列表单独 loading -->
        <Suspense>
          <template #default>
            <OrderList />
          </template>
          <template #fallback>
            <SkeletonList :rows="5" />
          </template>
        </Suspense>
      </div>
    </template>

    <template #fallback>
      <SkeletonPage />
    </template>
  </Suspense>
</template>
```

#### `<script setup>` 内直接 `await`

```vue
<!-- UserCard.vue -->
<script setup lang="ts">
const res = await fetch('/api/user/me')
const user = await res.json()
</script>

<template>
  <div>{{ user.name }}</div>
</template>
```

这种顶层 await 必须被 `<Suspense>` 包起来，否则父组件收不到"未就绪"信号。

💡 `onErrorCaptured` 返回 `false` 才能真正拦截错误；如果返回 `undefined`，异常会继续冒泡到全局 `app.config.errorHandler`。

🎯 学习秘诀：**每个路由页面外层一个 Suspense + errorCaptured**，页面内部再对"重资源"（图表、大列表、第三方 SDK）套一层嵌套 Suspense，用户就再也见不到白屏。

---

### B.6 Pinia 3 breaking & 新最佳实践

Pinia 3（2025 年初正式发布）主要变化：

- **要求 Vue 3.3+**（其实 3.4+ 才舒服）
- **Nuxt 模块**：`@pinia/nuxt` 需 3.x，SSR hydrate 逻辑重写
- **setup store** 里 `hydrate()` 参数改为对象
- **HMR** 由 devtools 接管，`acceptHMRUpdate` 依然是必需的
- **`storeToRefs` 类型改善**：不再把 `actions` 也 ref 化

#### setup store + HMR + hydrate

```ts
// stores/user.ts
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string>('')
    const profile = ref<{ id: number; name: string } | null>(null)

    const isLogin = computed(() => !!token.value)

    async function login(payload: { username: string; password: string }) {
      const { data } = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }).then(r => r.json())
      token.value = data.token
      profile.value = data.profile
    }

    function logout() {
      token.value = ''
      profile.value = null
    }

    return { token, profile, isLogin, login, logout }
  },
  {
    // SSR hydrate 时保留服务端返回的字段
    hydrate(storeState, initialState) {
      storeState.token = initialState.token
      // profile 客户端重新拉取
    },
    persist: {
      // pinia-plugin-persistedstate v4
      pick: ['token'],
      storage: typeof window !== 'undefined' ? localStorage : undefined,
    },
  },
)

// HMR 支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
```

#### 组件里正确用 storeToRefs

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
// 3 里 storeToRefs 只拆响应式状态，login/logout 依然从 store 拿
const { token, profile, isLogin } = storeToRefs(userStore)
const { login, logout } = userStore
</script>
```

#### 配合 unplugin-auto-import

```ts
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
import { PiniaAutoRefs } from 'pinia-auto-refs'

export default {
  plugins: [
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dirs: ['./src/stores/**'],
      dts: 'src/auto-imports.d.ts',
    }),
  ],
}
```

从此写业务代码不用再 `import { useUserStore } from '...'`，一把梭直接用。

💡 别把 `computed` 和大对象放进 `persist.pick`，序列化再反序列化会丢原型。只持久化"原始类型 + 简单对象"。

🎯 学习秘诀：**setup store + storeToRefs + auto-import** 是 2025 Pinia 三件套；组合式代码风格从此完全统一。

---

### B.7 Vue Router 4.4+ typed routes + data loaders

`unplugin-vue-router` 把 `pages/` 目录自动扫描成 typed routes，写路由跳转再也不写字符串。

#### 安装 & 配置

```bash
pnpm add -D unplugin-vue-router
```

```ts
// vite.config.ts
import VueRouter from 'unplugin-vue-router/vite'

export default {
  plugins: [
    VueRouter({
      routesFolder: 'src/pages',
      dts: 'src/typed-router.d.ts',
    }),
    vue(),
  ],
}
```

#### 目录即路由

```
src/pages/
├── index.vue                → /
├── about.vue                → /about
├── users/
│   ├── index.vue            → /users
│   └── [id].vue             → /users/:id
└── [...all].vue             → 404 fallback
```

#### 类型化跳转

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router/auto'

const router = useRouter()

function toUser(id: number) {
  // name 和 params 都会被 TS 校验，写错立刻红
  router.push({ name: '/users/[id]', params: { id: String(id) } })
}
</script>

<template>
  <RouterLink :to="{ name: '/about' }">关于</RouterLink>
</template>
```

#### Data Loaders（实验特性预览）

```ts
// src/pages/users/[id].vue
<script lang="ts">
import { defineBasicLoader } from 'unplugin-vue-router/data-loaders/basic'

export const useUserData = defineBasicLoader(
  '/users/[id]',
  async route => {
    const { id } = route.params
    return await fetch(`/api/users/${id}`).then(r => r.json())
  },
  { lazy: false }, // 路由进入前解析
)
</script>

<script setup lang="ts">
const { data: user, isLoading, error, reload } = useUserData()
</script>

<template>
  <div v-if="isLoading">Loading…</div>
  <div v-else-if="error">出错了 <button @click="reload">重试</button></div>
  <UserProfile v-else :user="user" />
</template>
```

Loader 会在路由跳转前拿到数据（类似 Nuxt 的 `useAsyncData`），失败会阻塞跳转并抛给全局 error handler。

#### `useLink` 编程式绑定

```vue
<script setup lang="ts">
import { useLink } from 'vue-router'

const { href, isActive, navigate } = useLink({
  to: { name: '/users/[id]', params: { id: '1' } },
})
</script>

<template>
  <a :href="href" :class="{ active: isActive }" @click.prevent="navigate">
    去用户 1
  </a>
</template>
```

💡 typed routes 生成的类型文件要加进 `tsconfig.json` 的 `include`，否则 IDE 拿不到 name 联合类型。

🎯 学习秘诀：**"路由 name 是字符串"这件事本身就是历史遗留**，2025 后只要用 file-based routing + typed routes，一切跳转全部 TS 校验。

---

### B.8 Vite 5/6 生态跃迁

#### Vite 5：legacy 插件 renaissance & modulePreload 优化

```ts
// vite.config.ts
import legacy from '@vitejs/plugin-legacy'

export default {
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11'],
      renderLegacyChunks: true,
      modernPolyfills: true, // 现代浏览器也按需注入
    }),
  ],
  build: {
    modulePreload: {
      // 只 preload 首屏用到的 chunk，避免"扫射式" preload
      polyfill: false,
      resolveDependencies(_, deps) {
        return deps.filter(d => !d.includes('async-'))
      },
    },
  },
}
```

#### Vite 6：Environment API

Vite 6 把"环境"抽象成一等公民，SSR / Worker / Client 可以在同一份配置里定义不同的 `resolve` / `build`：

```ts
// vite.config.ts (Vite 6)
export default {
  environments: {
    client: {
      build: { outDir: 'dist/client' },
    },
    ssr: {
      build: { outDir: 'dist/server', ssr: true },
      resolve: {
        conditions: ['node', 'import'],
      },
    },
    worker: {
      build: { outDir: 'dist/worker' },
      resolve: {
        conditions: ['workerd', 'import'], // Cloudflare Workers
      },
    },
  },
}
```

框架作者（Nuxt/Astro/SvelteKit）终于不用再自己 hack 多份 Vite 实例。

#### Rolldown-Vite（Rust bundler 底座）

`rolldown` 是 VoidZero 团队开发的 Rust 版打包器，Vite 6.x 起可以通过 `rolldown-vite` 平替 Rollup：

```bash
pnpm add -D rolldown-vite
```

```json
// package.json 里把 vite 换成 rolldown-vite
{
  "dependencies": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

生产构建速度 3~10× 提升，配置完全兼容 Rollup 插件。

#### Vitest 2/3 & oxlint

- **Vitest 3**：browser mode 稳定，`@vitest/browser` + Playwright 直接在真实浏览器跑单测。
- **oxlint**（Rust 版 ESLint）：500 条规则，10~100× 速度：

```bash
pnpm add -D oxlint
npx oxlint src/
```

配合 ESLint 双跑：oxlint 做基础规则（fast fail），ESLint 做 Vue/TS 深度规则。

💡 现在（2025 中）建议：**开发依赖里 ESLint 9 + oxlint 并行**，CI 里 oxlint 先跑，pass 才跑 ESLint，能省 CI 时间 50% 以上。

🎯 学习秘诀：**Vite = 前端的 Node.js**，它变了整个上游就得跟着变；每半年 review 一次 vite.config.ts 是必修课。

---

### B.9 Nuxt 3.12+ / Nuxt 4 主要变化

Nuxt 4（2025 年内 stable）不是重写，而是把 3.x 累积的最佳实践"默认化"，破坏性变更主要靠 `compatibilityVersion` 开关渐进升级。

#### 目录结构 `app/`

Nuxt 4 默认把 `pages/` `components/` `composables/` 都挪进 `app/`：

```
my-nuxt-app/
├── app/
│   ├── pages/
│   ├── components/
│   ├── composables/
│   └── app.vue
├── server/
│   ├── api/
│   └── middleware/
├── public/
└── nuxt.config.ts
```

好处：**清晰的 client / server 边界**，IDE 分析更快，SSR/CSR 代码不会误共享。

#### 兼容性开关

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4, // 打开 Nuxt 4 行为
  },
})
```

设为 3 保持旧行为，设为 4 全量启用新默认值，方便老项目分阶段迁移。

#### Data Fetching 新语义

```vue
<script setup lang="ts">
// 3.12+：useAsyncData 支持 getCachedData & watch 精细化
const { data, refresh, status, error } = await useAsyncData(
  'users',
  () => $fetch('/api/users'),
  {
    watch: [() => route.query.page],
    getCachedData: key => nuxtApp.payload.data[key],
    transform: list => list.map(u => ({ ...u, displayName: `#${u.id} ${u.name}` })),
  },
)
</script>
```

#### Server Components & Islands

```vue
<!-- components/Comments.server.vue（后缀 .server 表示只服务端渲染） -->
<script setup lang="ts">
const comments = await $fetch('/api/comments')
</script>

<template>
  <ul>
    <li v-for="c in comments" :key="c.id">{{ c.text }}</li>
  </ul>
</template>
```

引用：

```vue
<NuxtIsland name="Comments" />
```

好处：**这块组件的 JS 完全不进 bundle**，只服务端渲染 HTML，交互部分用另一个 client 组件补，思路和 Astro Island 一致。

#### Nitro Preset（多平台部署）

```bash
NITRO_PRESET=vercel   pnpm build   # 部署 Vercel
NITRO_PRESET=cloudflare-pages pnpm build
NITRO_PRESET=deno-deploy pnpm build
NITRO_PRESET=node-server pnpm build   # 传统 Node.js
```

一份代码，四种运行时，Nitro 底座已经把差异抹平。

💡 从 Nuxt 3 升 4 别一次性开 `compatibilityVersion: 4`，先按 [nuxt.com/docs/getting-started/upgrade](https://nuxt.com/docs/getting-started/upgrade) 逐条打开，跑一次 e2e 再进下一项。

🎯 学习秘诀：Nuxt 4 = **"Vue 版 Next.js 的成熟形态"**，Islands + Server Components + 多 preset 是它对 React 生态的最强反击。

---

### B.10 `v-memo` / `KeepAlive include` 缓存 & 性能小贴士

#### `v-memo`——长列表 diff 跳过

```vue
<script setup lang="ts">
import { ref } from 'vue'

const list = ref(
  Array.from({ length: 5000 }, (_, i) => ({ id: i, name: `item-${i}`, active: false })),
)
</script>

<template>
  <div
    v-for="item in list"
    :key="item.id"
    v-memo="[item.id, item.active]"
    class="row"
  >
    <span>{{ item.name }}</span>
    <button @click="item.active = !item.active">
      {{ item.active ? 'ON' : 'OFF' }}
    </button>
  </div>
</template>
```

`v-memo="[a, b]"` 意思是"依赖数组没变就跳过整块子树 diff"。5000 行列表里点某一行，只有那一行 re-render，其余 4999 行零开销。

**常见踩坑：**

1. **依赖数组漏项**：改了 `item.name` 却没在 `v-memo` 里列出，视图不更新。
2. **和 `v-for` 顺序**：`v-memo` 必须写在 `v-for` 元素上，写在子元素上无效。
3. **动态内容不能缓存**：如果子树里有 `Date.now()` 这种每次都变的表达式，v-memo 会跳过更新，反而是 bug。

#### `KeepAlive include` + `max`

```vue
<script setup lang="ts">
import { ref } from 'vue'
const cachedComponents = ref(['UserList', 'OrderList']) // 只缓存这两个
</script>

<template>
  <RouterView v-slot="{ Component }">
    <KeepAlive :include="cachedComponents" :max="10">
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>
```

- `include` / `exclude`：白/黑名单，值是组件 name 或正则
- `max`：LRU 上限，防止内存无限增长

配合 `onActivated` / `onDeactivated` 生命周期：

```ts
onActivated(() => {
  // 页面从缓存回来，重新拉最新数据
  refresh()
})
onDeactivated(() => {
  // 页面被缓存起来，清定时器
  clearInterval(timer)
})
```

#### 其他 2025 值得记的性能小贴士

1. **`shallowRef` / `shallowReactive`**：大对象（编辑器 state / 图表 config）不需要深响应，用 shallow 版能省 30% 以上 Proxy 开销。
2. **`markRaw`**：塞进 reactive 前 mark 一下，防止第三方 SDK 实例（Map、Chart、Editor）被 Proxy 包裹后报错。
3. **`defineAsyncComponent` + `Suspense`**：路由级组件永远异步加载，首屏 bundle 一定压到 200KB 以下。
4. **`<script setup>` 的编译期常量提升**：3.4 后 template 里的静态节点会被 hoist 出去，重复 render 时零成本；能少写 `computed` 就少写。
5. **`useTemplateRef`（3.5+）**：替代 `ref` + 字符串挂载 DOM 引用，类型更准：

```vue
<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue'
const inputRef = useTemplateRef<HTMLInputElement>('inputEl')
onMounted(() => inputRef.value?.focus())
</script>

<template>
  <input ref="inputEl" />
</template>
```

💡 性能优化的顺序永远是：**测量 → 定位 → 局部优化**。别一上来就 `v-memo` 全套，devtools 里 Timeline 面板才是唯一真相源。

🎯 学习秘诀：**Vue 3.4 后是"编译宏化 + 类型化"分水岭**：defineModel / defineOptions / defineSlots / defineExpose / useTemplateRef + typed routes，都在把"文本约定"变成"类型约定"。学会这套，你写的 Vue 才配得上 2025。
