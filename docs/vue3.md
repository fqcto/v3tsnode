# Vue 3 中高级知识点

> 适合具备一定 Vue 2 / Vue 3 基础，准备进阶到中高级岗位面试与实战的同学。

## 目录

- [1. 响应式原理](#1-响应式原理)
- [2. Composition API 与 `<script setup>`](#2-composition-api-与-script-setup)
- [3. 组件通信与依赖注入](#3-组件通信与依赖注入)
- [4. 自定义 Hook（Composables）设计](#4-自定义-hookcomposables设计)
- [5. 渲染机制与虚拟 DOM](#5-渲染机制与虚拟-dom)
- [6. 编译时优化](#6-编译时优化)
- [7. 性能优化实践](#7-性能优化实践)
- [8. Pinia 状态管理](#8-pinia-状态管理)
- [9. Vue Router 4 进阶](#9-vue-router-4-进阶)
- [10. SSR / Nuxt 3](#10-ssr--nuxt-3)
- [11. 单元测试与 E2E](#11-单元测试与-e2e)
- [12. 工程化与构建](#12-工程化与构建)
- [13. 常见面试题](#13-常见面试题)

---

## 1. 响应式原理

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

## 2. Composition API 与 `<script setup>`

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

## 3. 组件通信与依赖注入

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

## 4. 自定义 Hook（Composables）设计

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

## 5. 渲染机制与虚拟 DOM

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

## 6. 编译时优化

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

## 7. 性能优化实践

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

## 8. Pinia 状态管理

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

## 9. Vue Router 4 进阶

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

## 10. SSR / Nuxt 3

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

## 11. 单元测试与 E2E

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

## 12. 工程化与构建

- **Vite**：基于原生 ESM + esbuild，支持 HMR；插件机制兼容 Rollup。
- 区分 `dependencies` / `devDependencies`；
- `vite-plugin-checker`：在 dev 时同时跑 `vue-tsc` 类型检查；
- `unplugin-auto-import` + `unplugin-vue-components`：按需引入；
- `vite-plugin-pwa`：PWA；
- 多页应用：`build.rollupOptions.input`；
- 生产排查：`vite build --report` / `rollup-plugin-visualizer`。

---

## 13. 常见面试题

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
