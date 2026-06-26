# TypeScript 中高级知识点

> 涵盖类型系统、泛型、类型体操、声明合并、模块、装饰器、工程实践等高频考点。

## 目录

- [1. 类型系统基础回顾](#1-类型系统基础回顾)
- [2. 联合 / 交叉 / 字面量 / 模板字面量](#2-联合--交叉--字面量--模板字面量)
- [3. 泛型与约束](#3-泛型与约束)
- [4. 条件类型与分布式条件](#4-条件类型与分布式条件)
- [5. 映射类型与 keyof / typeof / in](#5-映射类型与-keyof--typeof--in)
- [6. infer 与类型推断](#6-infer-与类型推断)
- [7. 内置工具类型源码级理解](#7-内置工具类型源码级理解)
- [8. 类型守卫与类型收窄](#8-类型守卫与类型收窄)
- [9. 协变 / 逆变 / 不变](#9-协变--逆变--不变)
- [10. 声明合并 & 模块扩展](#10-声明合并--模块扩展)
- [11. 装饰器 (Stage 3)](#11-装饰器-stage-3)
- [12. 模块系统与 tsconfig](#12-模块系统与-tsconfig)
- [13. 类型体操实战](#13-类型体操实战)
- [14. 工程化与最佳实践](#14-工程化与最佳实践)
- [15. 常见面试题](#15-常见面试题)

---

## 1. 类型系统基础回顾

- **结构性子类型 (Structural Typing)**：类型兼容看形状不看名字。
- 顶层类型：`unknown`（安全）、`any`（不安全）、`never`（不可达）、`void`（无返回）。
- `null` 与 `undefined`：开启 `strictNullChecks` 后必须显式处理。
- 字面量类型：`'a' | 'b'`、数字字面量、模板字面量。
- `as const`：将对象/数组冻结为只读字面量元组。

```ts
const point = { x: 1, y: 2 } as const // { readonly x: 1; readonly y: 2 }
const tuple = [1, 'a'] as const       // readonly [1, 'a']
```

---

## 2. 联合 / 交叉 / 字面量 / 模板字面量

```ts
type A = { a: string }
type B = { b: number }
type AB = A & B          // 交叉
type AorB = A | B        // 联合

type Lang = 'en' | 'zh'
type Greeting = `hello-${Lang}` // 'hello-en' | 'hello-zh'

type CSSValue = `${number}px` | `${number}rem`
```

模板字面量 + 联合分配可生成笛卡尔积：

```ts
type Vertical = 'top' | 'middle' | 'bottom'
type Horizontal = 'left' | 'center' | 'right'
type Position = `${Vertical}-${Horizontal}` // 9 种组合
```

---

## 3. 泛型与约束

```ts
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((acc, k) => ((acc[k] = obj[k]), acc), {} as Pick<T, K>)
}

// 默认参数 + 约束
type ApiResponse<T = unknown> = { code: number; data: T; msg?: string }

// 多泛型推断
function zip<A, B>(a: A[], b: B[]): [A, B][] {
  return a.map((v, i) => [v, b[i]])
}
```

### 3.1 NoInfer (4.7+ / 5.4)

```ts
function move<T extends string>(from: T, to: NoInfer<T>) {}
move('a', 'b') // OK; 推断从 from 决定，避免 to 影响 T
```

---

## 4. 条件类型与分布式条件

`T extends U ? X : Y`，当 T 为联合类型时**默认分发**：

```ts
type ToArray<T> = T extends any ? T[] : never
type R = ToArray<string | number> // string[] | number[]
```

加 `[]` 包裹关闭分发：

```ts
type ToArray2<T> = [T] extends [any] ? T[] : never
type R2 = ToArray2<string | number> // (string | number)[]
```

`never` 是分发条件类型的恒等元（任何条件分发到 never 都返回 never）：

```ts
type Filter<T, U> = T extends U ? T : never
type R3 = Filter<'a' | 'b' | 1, string> // 'a' | 'b'
```

---

## 5. 映射类型与 keyof / typeof / in

```ts
type Readonly<T> = { readonly [K in keyof T]: T[K] }
type Partial<T> = { [K in keyof T]?: T[K] }
type Required<T> = { [K in keyof T]-?: T[K] }
type Mutable<T> = { -readonly [K in keyof T]: T[K] }
```

### 5.1 key remapping (4.1+)

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}
type R = Getters<{ name: string; age: number }>
// { getName: () => string; getAge: () => number }
```

### 5.2 typeof 与 const 数组

```ts
const Roles = ['admin', 'user', 'guest'] as const
type Role = typeof Roles[number] // 'admin' | 'user' | 'guest'
```

---

## 6. infer 与类型推断

```ts
type ReturnType<T> = T extends (...a: any[]) => infer R ? R : never
type Parameters<T> = T extends (...a: infer P) => any ? P : never
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T

// 取数组元素类型
type ElementOf<T> = T extends (infer U)[] ? U : never
type E = ElementOf<number[]> // number

// 取 Promise 链最终值
type Unpromise<T> = T extends Promise<infer U> ? Unpromise<U> : T
```

`infer` 还可加约束 (4.7+)：

```ts
type FirstString<T extends any[]> =
  T extends [infer F extends string, ...any[]] ? F : never
```

---

## 7. 内置工具类型源码级理解

```ts
type Pick<T, K extends keyof T>   = { [P in K]: T[P] }
type Omit<T, K extends PropertyKey> = Pick<T, Exclude<keyof T, K>>
type Exclude<T, U> = T extends U ? never : T
type Extract<T, U> = T extends U ? T : never
type NonNullable<T> = T & {}
type Record<K extends PropertyKey, T> = { [P in K]: T }

type Parameters<T extends (...a: any) => any> =
  T extends (...a: infer P) => any ? P : never
type ConstructorParameters<T extends abstract new (...a: any) => any> =
  T extends abstract new (...a: infer P) => any ? P : never
type InstanceType<T extends abstract new (...a: any) => any> =
  T extends abstract new (...a: any) => infer R ? R : never
```

---

## 8. 类型守卫与类型收窄

```ts
// typeof / instanceof / in
function len(x: string | string[]) {
  if (typeof x === 'string') return x.length
  return x.reduce((s, v) => s + v.length, 0)
}

// 用户自定义守卫
function isError(e: unknown): e is Error {
  return e instanceof Error
}

// 断言函数 (4.7+)
function assert(cond: unknown, msg = 'assert'): asserts cond {
  if (!cond) throw new Error(msg)
}

// 可辨识联合
type Shape =
  | { kind: 'circle'; r: number }
  | { kind: 'square'; size: number }

function area(s: Shape) {
  switch (s.kind) {
    case 'circle': return Math.PI * s.r ** 2
    case 'square': return s.size ** 2
    default: const _: never = s; return _ // 穷尽性检查
  }
}
```

---

## 9. 协变 / 逆变 / 不变

| 位置 | 性质 |
| --- | --- |
| 普通属性 / 函数返回值 | 协变 |
| 函数参数 (默认 strictFunctionTypes 下) | 逆变 |
| 同时 in/out | 不变 |
| 4.7+ 类型变量声明可用 `in` / `out` | 显式控制 |

```ts
type Producer<out T> = () => T   // 只生产 → 协变
type Consumer<in T>  = (x: T) => void // 只消费 → 逆变

let pAnimal: Producer<Animal> = () => new Dog() // OK，子类可赋父类
let cDog: Consumer<Dog> = (a: Animal) => {}     // OK，父函数赋子签名
```

---

## 10. 声明合并 & 模块扩展

接口 / namespace / 函数声明可合并：

```ts
interface Box { width: number }
interface Box { height: number }
const b: Box = { width: 1, height: 2 }

// 给第三方扩展
declare module 'express' {
  interface Request { user?: { id: number } }
}

// 全局扩展
declare global {
  interface Window { __APP_VERSION__: string }
}
export {} // 文件即模块
```

---

## 11. 装饰器 (Stage 3)

TypeScript 5.0 起内置 ES Stage 3 装饰器（与旧 `experimentalDecorators` 不兼容）。

```ts
function logged<This, Args extends any[], R>(
  target: (this: This, ...a: Args) => R,
  ctx: ClassMethodDecoratorContext<This, (this: This, ...a: Args) => R>
) {
  return function (this: This, ...args: Args): R {
    console.log(`call ${String(ctx.name)}`, args)
    return target.apply(this, args)
  }
}

class Service {
  @logged
  hello(name: string) { return `hi ${name}` }
}
```

`ClassDecoratorContext`、`ClassMethodDecoratorContext`、`ClassFieldDecoratorContext`、`ClassGetterDecoratorContext`、`ClassSetterDecoratorContext`、`ClassAccessorDecoratorContext` 提供 metadata、addInitializer 等钩子。

---

## 12. 模块系统与 tsconfig

### 12.1 关键编译选项

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",        // 或 ESNext / Preserve
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "useDefineForClassFields": true,
    "resolveJsonModule": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "sourceMap": true,
    "lib": ["ES2022", "DOM"],
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

要点：
- `verbatimModuleSyntax`：强制 `import type` 区分类型导入，便于打包工具消除；
- `noUncheckedIndexedAccess`：`obj[k]` 自动加 `| undefined`；
- `isolatedModules`：兼容 Babel/swc 单文件转译；
- `paths` 仅类型检查；运行时需 tsc-alias / vite-plugin / tsconfig-paths。

### 12.2 dual ESM/CJS 包

`package.json` exports 字段：

```json
{
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

---

## 13. 类型体操实战

### 13.1 Trim

```ts
type TrimLeft<S extends string> = S extends `${' ' | '\n' | '\t'}${infer R}` ? TrimLeft<R> : S
type TrimRight<S extends string> = S extends `${infer R}${' ' | '\n' | '\t'}` ? TrimRight<R> : S
type Trim<S extends string> = TrimLeft<TrimRight<S>>
```

### 13.2 Split

```ts
type Split<S extends string, D extends string> =
  S extends `${infer H}${D}${infer T}` ? [H, ...Split<T, D>] : [S]
type R = Split<'a,b,c', ','> // ['a','b','c']
```

### 13.3 DeepReadonly

```ts
type DeepReadonly<T> = T extends (...a: any[]) => any
  ? T
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T
```

### 13.4 路径访问

```ts
type Get<T, P extends string> =
  P extends `${infer K}.${infer R}`
    ? K extends keyof T ? Get<T[K], R> : never
    : P extends keyof T ? T[P] : never

type R = Get<{ a: { b: { c: number } } }, 'a.b.c'> // number
```

### 13.5 Union → Intersection

```ts
type U2I<U> =
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
type R = U2I<{ a: 1 } | { b: 2 }> // { a: 1 } & { b: 2 }
```

### 13.6 Tuple → Union → 取最后

```ts
type Last<T extends any[]> = T extends [...any[], infer L] ? L : never
type R = Last<[1, 2, 3]> // 3
```

---

## 14. 工程化与最佳实践

1. **统一类型来源**：API 类型用 `zod` / `valibot` / OpenAPI 生成。
2. **优先 `unknown`** 替代 `any`；写库时 `T extends unknown` 触发分发。
3. **避免 enum**：用 `as const` + 字面量联合（更好 tree-shaking）。
4. **type vs interface**：库公共 API 用 interface（可声明合并），内部聚合类型用 type。
5. **类型测试**：`expect-type` / `@ts-expect-error`。
6. **CI 加 `tsc --noEmit`**；大型项目用 `tsc -b` 项目引用 + 增量；编辑器用 `vue-tsc` / `tsc --watch`。
7. **打包**：库用 `tsup` / `unbuild` / `rollup-plugin-dts`，App 用 vite/webpack/esbuild。
8. **`satisfies` 运算符**：保留字面量的同时校验形状。

```ts
const config = {
  port: 3000,
  env: 'prod',
} satisfies { port: number; env: 'dev' | 'prod' }

// config.env 类型仍是 'prod' 而不是 'dev' | 'prod'
```

---

## 15. 常见面试题

1. interface vs type 区别？哪些场景必须用 type？
2. 协变 / 逆变？为什么 `--strictFunctionTypes` 后函数参数变逆变？
3. `unknown` vs `any` vs `never`？
4. 分布式条件类型的触发条件？如何关闭？
5. `infer` 在哪些地方可用？是否支持递归？
6. 写一个 `DeepPartial`、`DeepReadonly`。
7. 模板字面量类型如何配合 keyof 做 mapper？
8. tsconfig 中 `target` 与 `lib` 关系？`module` 与 `moduleResolution` 的搭配？
9. 装饰器新旧实现差异？
10. 怎么扩展 Express 的 `Request` 类型？
11. 为什么 `{}` 能匹配除 null/undefined 外所有值？
12. `as const` 的实际作用？什么时候必须搭配 `satisfies`？
13. 怎样让一个工具类型同时支持对象与数组？
14. `T[number]` / `T[keyof T]` / `T[K]` 的区别？
15. 写一个 `EventEmitter` 的强类型 API。

---

> 推荐学习：[type-challenges](https://github.com/type-challenges/type-challenges)、[TS Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)、Anders Hejlsberg 的演讲、`microsoft/TypeScript` 仓库的 `lib.es5.d.ts`。
