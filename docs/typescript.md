# TypeScript 全阶段学习手册（初 → 中 → 高）

> 从零基础到类型体操，按初级入门 → 中级进阶 → 高级实战三阶段递进，覆盖 TypeScript 核心知识体系。

## 目录

一、🟢 初级入门
- 0.1 TS 是什么 & 与 JS 关系
- 0.2 环境搭建
- 0.3 基本类型
- 0.4 类型注解 vs 类型推断
- 0.5 联合类型与字面量类型
- 0.6 对象类型 & interface
- 0.7 type 别名 vs interface 对比
- 0.8 函数类型
- 0.9 类
- 0.10 枚举 enum 与 as const 对象取舍
- 0.11 any / unknown / never / void
- 0.12 断言：as / 非空! / satisfies
- 0.13 小案例：Todo 列表带类型

二、🟡 中级进阶
- 1. 类型系统基础回顾
- 2. 联合 / 交叉 / 字面量 / 模板字面量
- 3. 泛型与约束
- 5. 映射类型与 keyof / typeof / in
- 7. 内置工具类型源码级理解
- 8. 类型守卫与类型收窄
- 10. 声明合并 & 模块扩展
- 12. 模块系统与 tsconfig
- 14. 工程化与最佳实践

三、🔴 高级实战
- 4. 条件类型与分布式条件
- 6. infer 与类型推断
- 9. 协变 / 逆变 / 不变
- 11. 装饰器 (Stage 3)
- 13. 类型体操实战
- 15. 常见面试题

---

## 一、🟢 初级入门

### <span class="lv lv-1">初级</span> 0.1 TS 是什么 & 与 JS 关系

TypeScript 是 JavaScript 的**超集**——在 JS 之上增加了一层静态类型系统。所有合法的 JS 代码也是合法的 TS 代码；TS 编译器（`tsc`）在编译时会进行类型检查，最终输出纯净的 JS 文件，浏览器 / Node 均可直接运行。

```ts
// 这段 JS 也是合法的 TS
function add(a, b) {
  return a + b
}

// 加上类型后，TS 能在编译期发现错误
function addTyped(a: number, b: number): number {
  return a + b
}
```

- **编译到 JS 的静态类型层**：TS 不改变运行时行为，只在编译期做类型校验。
- **渐进式采用**：可以只在部分文件使用类型，剩余文件保持纯 JS。

💡 关键认知：TS = JS + 静态类型检查，编译后产物仍是 JS。

🎯 练习：把一段自己写过的 JS 函数加上类型注解，观察 `tsc` 是否报错。

---

### <span class="lv lv-1">初级</span> 0.2 环境搭建

```bash
# 全局安装 TypeScript 和 ts-node（可直接运行 .ts 文件）
npm i -g typescript ts-node

# 初始化项目配置文件
tsc --init
```

`tsconfig.json` 最小可用配置：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

常用命令：

| 命令 | 说明 |
| --- | --- |
| `tsc` | 编译项目 |
| `tsc --noEmit` | 只做类型检查，不输出文件 |
| `tsc --watch` | 监听模式 |
| `ts-node src/index.ts` | 直接运行 TS 文件 |

💡 初学时建议始终开启 `strict: true`，养成严谨习惯。

🎯 练习：创建 `src/hello.ts`，写一个带类型注解的函数，分别用 `tsc` 编译和 `ts-node` 运行。

---

### <span class="lv lv-1">初级</span> 0.3 基本类型

```ts
// 原始类型
const n: number = 42
const s: string = 'hello'
const b: boolean = true
const empty: null = null
const undef: undefined = undefined
const big: bigint = 100n
const sym: symbol = Symbol('id')

// 数组
const nums: number[] = [1, 2, 3]
const strs: Array<string> = ['a', 'b'] // 泛型写法

// 元组：固定长度、固定类型的数组
const pair: [string, number] = ['age', 18]
const named: [name: string, age: number] = ['Tom', 20] // 带标签的元组
```

| 类型 | 说明 |
| --- | --- |
| `number` | 所有数字（整数 + 浮点） |
| `string` | 字符串 |
| `boolean` | `true` / `false` |
| `null` / `undefined` | 空值（开启 `strictNullChecks` 后需显式处理） |
| `bigint` | 大整数（ES2020+） |
| `symbol` | 唯一标识符 |
| `T[]` | 数组 |
| `[T1, T2]` | 元组 |

💡 `number[]` 和 `Array<number>` 完全等价，元组是"固定长度的数组"。

🎯 练习：声明一个元组表示坐标 `[x: number, y: number]`，再声明一个 `boolean[][]` 二维数组。

---

### <span class="lv lv-1">初级</span> 0.4 类型注解 vs 类型推断

```ts
// 类型注解：显式告诉 TS 变量的类型
const age: number = 18

// 类型推断：TS 自动推断，不需要手写注解
const name = 'Tom'      // 推断为 string
const list = [1, 2, 3]  // 推断为 number[]

// 何时必须写注解？
// 1. 函数参数——TS 无法推断参数类型
function greet(person: string) {
  return `Hello, ${person}`
}

// 2. 变量声明后延迟赋值
let value: number
if (Math.random() > 0.5) {
  value = 1
} else {
  value = 2
}
```

💡 原则：能推断就不写，函数参数和返回值复杂时必须写。

🎯 练习：对比 `let x = 1` 和 `let x: number = 1`，尝试对 `x` 赋不同类型的值，观察报错差异。

---

### <span class="lv lv-1">初级</span> 0.5 联合类型与字面量类型

```ts
// 联合类型：变量可以是多种类型之一
let id: string | number
id = 'abc'  // OK
id = 123    // OK

// 字面量类型：变量只能是特定的值
type Color = 'red' | 'blue' | 'green'
let c: Color = 'red'   // OK
// c = 'yellow'         // Error

// 联合 + 字面量
type Status = 200 | 404 | 500
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
```

使用联合类型时需要**收窄**（narrowing）才能访问特定类型的属性：

```ts
function process(value: string | number) {
  if (typeof value === 'string') {
    // 这里 value 是 string
    console.log(value.toUpperCase())
  } else {
    // 这里 value 是 number
    console.log(value.toFixed(2))
  }
}
```

💡 联合类型用 `|`，字面量类型限制值为特定常量，二者常搭配使用。

🎯 练习：定义 `type Direction = 'left' | 'right' | 'up' | 'down'`，写一个 `move` 函数根据方向返回坐标偏移。

---

### <span class="lv lv-1">初级</span> 0.6 对象类型 & interface

```ts
// 匿名对象类型
function printUser(user: { name: string; age: number }) {
  console.log(`${user.name}, ${user.age}`)
}

// interface 命名对象类型
interface User {
  name: string
  age: number
  email?: string          // 可选属性
  readonly id: number     // 只读属性
}

const u: User = { name: 'Tom', age: 18, id: 1 }
// u.id = 2  // Error: readonly

// 索引签名：允许任意键
interface Dictionary {
  [key: string]: string
}

const dict: Dictionary = { hello: 'world', foo: 'bar' }
```

| 特性 | 示例 | 说明 |
| --- | --- | --- |
| 可选属性 | `email?: string` | 可以不传 |
| 只读属性 | `readonly id: number` | 赋值后不可改 |
| 索引签名 | `[key: string]: T` | 允许任意键 |

💡 interface 是 TS 描述对象形状的主要方式，支持继承、合并等特性。

🎯 练习：定义 `interface Config`，含 `host: string`、`port: number`、`debug?: boolean`、`readonly version: string`。

---

### <span class="lv lv-1">初级</span> 0.7 type 别名 vs interface 对比

```ts
// type 别名
type Point = { x: number; y: number }
type ID = string | number
type Tuple = [string, number]

// interface
interface IPoint {
  x: number
  y: number
}
```

| 对比项 | `type` | `interface` |
| --- | --- | --- |
| 对象类型 | ✅ | ✅ |
| 联合 / 交叉 | ✅ `A \| B`、`A & B` | ❌ 不能直接写联合 |
| 基本类型别名 | ✅ `type ID = string` | ❌ |
| 元组 | ✅ `type T = [A, B]` | ❌ |
| 声明合并 | ❌ 同名会报错 | ✅ 同名自动合并 |
| extends / implements | 用交叉 `&` 模拟 | ✅ 原生支持 |
| 计算/映射类型 | ✅ | ❌ |

**选择建议**：库的公共 API 用 `interface`（允许用户声明合并），内部聚合类型、联合类型用 `type`。

💡 项目内保持统一即可，团队选定一种风格比纠结选择更重要。

🎯 练习：分别用 `type` 和 `interface` 描述同一个对象，体会语法差异。

---

### <span class="lv lv-1">初级</span> 0.8 函数类型

```ts
// 参数类型 + 返回值类型
function add(a: number, b: number): number {
  return a + b
}

// 可选参数（必须在必选参数之后）
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name
}

// 默认参数
function createUser(name: string, role: string = 'user'): object {
  return { name, role }
}

// 剩余参数
function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0)
}

// 函数类型表达式
type MathOp = (a: number, b: number) => number
const multiply: MathOp = (a, b) => a * b

// 重载入门：同一函数名，不同参数签名
function format(value: string): string
function format(value: number): string
function format(value: string | number): string {
  return typeof value === 'number' ? value.toFixed(2) : value.trim()
}
```

💡 函数参数默认就是按位置推断的，复杂场景下显式写返回值类型有助于代码可读性。

🎯 练习：写一个重载函数 `parse`，输入 `string` 返回 `number`，输入 `number` 返回 `string`。

---

### <span class="lv lv-1">初级</span> 0.9 类

```ts
class Animal {
  // 访问修饰符
  public name: string        // 默认，任何地方可访问
  private age: number        // 仅类内部可访问
  protected species: string  // 类内部 + 子类可访问

  constructor(name: string, age: number, species: string) {
    this.name = name
    this.age = age
    this.species = species
  }

  // 方法
  public info(): string {
    return `${this.name} (${this.species})`
  }
}

// 继承
class Dog extends Animal {
  constructor(name: string, age: number) {
    super(name, age, 'canine')
  }

  bark(): string {
    // this.age      // Error: private
    return `${this.name}: woof!` // OK: public
  }
}

// 抽象类：不能实例化，只能被继承
abstract class Shape {
  abstract area(): number // 子类必须实现
  describe(): string {
    return `Area: ${this.area()}`
  }
}

class Circle extends Shape {
  constructor(public radius: number) { super() }
  area(): number { return Math.PI * this.radius ** 2 }
}

// implements：类实现接口
interface Loggable {
  log(): void
}

class Logger implements Loggable {
  log() { console.log('logged') }
}
```

💡 构造函数参数加 `public` / `private` / `protected` 可自动声明并赋值（参数属性简写）。

🎯 练习：定义 `abstract class Vehicle`，含 `abstract speed: number` 和 `move()` 方法，再写 `Car` 和 `Bike` 子类。

---

### <span class="lv lv-1">初级</span> 0.10 枚举 enum 与 as const 对象取舍

```ts
// 数字枚举（默认从 0 自增）
enum Direction {
  Up,     // 0
  Down,   // 1
  Left,   // 2
  Right,  // 3
}

// 字符串枚举
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

// const enum（编译时内联，运行时消失）
const enum Color {
  Red = 'RED',
  Blue = 'BLUE',
}
let c = Color.Red // 编译为 "RED"
```

**用 `as const` 对象替代 enum（推荐）**：

```ts
const Role = {
  Admin: 'ADMIN',
  User: 'USER',
  Guest: 'GUEST',
} as const

type Role = typeof Role[keyof typeof Role] // 'ADMIN' | 'USER' | 'GUEST'
```

| 对比 | `enum` | `as const` 对象 |
| --- | --- | --- |
| Tree-shaking | 差（生成额外 JS） | 好（普通对象） |
| 类型安全 | ✅ | ✅ |
| 运行时可用 | ✅ | ✅ |
| 反向映射 | 数字枚举支持 | 不支持 |
| 声明合并 | 不支持 | 不支持 |

💡 新项目推荐用 `as const` 对象 + 联合类型，更好的 tree-shaking 和可读性。

🎯 练习：用 `as const` 定义 `HttpStatus` 对象，导出对应的联合类型 `HttpStatusCode`。

---

### <span class="lv lv-1">初级</span> 0.11 any / unknown / never / void 四大顶层类型

```ts
// any：放弃类型检查，任何操作都不报错（尽量少用）
let a: any = 'hello'
a = 42         // OK
a.foo()        // OK（运行时可能崩溃）

// unknown：安全版的 any，必须收窄才能使用
let u: unknown = 'hello'
// u.toUpperCase()  // Error
if (typeof u === 'string') {
  u.toUpperCase()   // OK
}

// never：永远不会有值的类型（不可达代码、空联合）
type Impossible = string & number // never
function throwError(msg: string): never {
  throw new Error(msg)
}

// void：函数没有返回值
function log(msg: string): void {
  console.log(msg)
}
```

| 类型 | 含义 | 使用场景 |
| --- | --- | --- |
| `any` | 放弃类型安全 | 临时迁移、第三方无类型库 |
| `unknown` | 安全的任意类型 | 接收外部输入、JSON 解析 |
| `never` | 不可达 | 穷尽性检查、不可能的类型交叉 |
| `void` | 无返回值 | 不关心返回值的函数 |

💡 `unknown` 是 `any` 的安全替代，`never` 用于穷尽性检查和不可达分支。

🎯 练习：写一个 `assertNever(x: never): never` 函数，在 switch 的 default 分支中使用它做穷尽性检查。

---

### <span class="lv lv-1">初级</span> 0.12 断言：as / 非空! / satisfies

```ts
// as 断言：告诉 TS "我知道这个类型更具体"
const input = document.getElementById('input') as HTMLInputElement
input.value // OK

// 双重断言（不推荐，除非极度确定）
const x = 'hello' as unknown as number // 编译通过，运行时崩溃

// 非空断言 !：断言值不是 null / undefined
const el = document.querySelector('.box')!
el.classList.add('active') // 不再报可能为 null 的错

// satisfies (TS 4.9+)：校验类型同时保留字面量推断
const config = {
  port: 3000,
  env: 'prod',
} satisfies { port: number; env: 'dev' | 'prod' }

// config.env 类型是 'prod'（保留字面量），而非 'dev' | 'prod'
```

| 断言方式 | 说明 | 安全性 |
| --- | --- | --- |
| `as T` | 类型断言 | ⚠️ 绕过检查 |
| `!` | 非空断言 | ⚠️ 运行时可能为 null |
| `satisfies T` | 校验 + 保留推断 | ✅ 最安全 |

💡 `satisfies` 是断言的最佳实践：既能校验形状，又不丢失字面量类型。

🎯 练习：用 `satisfies` 定义一个颜色配置对象，要求值必须是 `string`，同时保留每个颜色键对应的字面量类型。

---

### <span class="lv lv-1">初级</span> 0.13 小案例：Todo 列表带类型

综合运用 interface、函数类型、泛型初露，约 40 行代码：

```ts
// 接口定义
interface Todo {
  id: number
  title: string
  done: boolean
}

// 泛型函数：根据条件过滤
function filter<T>(list: T[], predicate: (item: T) => boolean): T[] {
  return list.filter(predicate)
}

// Todo 列表操作
let todos: Todo[] = [
  { id: 1, title: '学习 TypeScript', done: false },
  { id: 2, title: '写小案例', done: true },
]

// 添加
function addTodo(title: string): void {
  todos.push({ id: Date.now(), title, done: false })
}

// 切换完成状态
function toggleTodo(id: number): void {
  const todo = todos.find((t) => t.id === id)
  if (todo) todo.done = !todo.done
}

// 获取未完成项
function getPending(): Todo[] {
  return filter(todos, (t) => !t.done)
}

// 使用
addTodo('复习泛型')
toggleTodo(1)
console.log(getPending())
// [{ id: 1, title: '学习 TypeScript', done: true ... }] ← 已切换
// [{ id: 1700000000000, title: '复习泛型', done: false }]
```

💡 本案例用到了 interface 描述数据、函数类型约束回调、泛型函数复用逻辑——这些都是 TS 日常开发的核心模式。

🎯 练习：扩展 Todo 加上 `priority: 'low' | 'medium' | 'high'` 字段，用 `filter` 泛型函数按优先级筛选。

---

## 二、🟡 中级进阶

---

## <span class="lv lv-2">中级</span> 1. 类型系统基础回顾

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

## <span class="lv lv-2">中级</span> 2. 联合 / 交叉 / 字面量 / 模板字面量

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

## <span class="lv lv-2">中级</span> 3. 泛型与约束

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

## <span class="lv lv-2">中级</span> 5. 映射类型与 keyof / typeof / in

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

## <span class="lv lv-2">中级</span> 7. 内置工具类型源码级理解

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

## <span class="lv lv-2">中级</span> 8. 类型守卫与类型收窄

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

## <span class="lv lv-2">中级</span> 10. 声明合并 & 模块扩展

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

## <span class="lv lv-2">中级</span> 12. 模块系统与 tsconfig

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

## <span class="lv lv-2">中级</span> 14. 工程化与最佳实践

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

## 三、🔴 高级实战

---

## <span class="lv lv-3">高级</span> 4. 条件类型与分布式条件

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

## <span class="lv lv-3">高级</span> 6. infer 与类型推断

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

## <span class="lv lv-3">高级</span> 9. 协变 / 逆变 / 不变

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

## <span class="lv lv-3">高级</span> 11. 装饰器 (Stage 3)

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

## <span class="lv lv-3">高级</span> 13. 类型体操实战

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

## <span class="lv lv-3">高级</span> 15. 常见面试题

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

---

## <span class="lv lv-3">高级</span> 附录 A：TypeScript 全栈脚手架实战（2025）

> clone 即用的 **Node 后端 + 前端库** 两套 TS 5.x 模板：涵盖现代 tsconfig / dual ESM+CJS 发布 / zod 联动 / project references / vitest + expect-type / tsup 打包 / GitHub Actions。全部为 2025 年最新推荐配置，可作为团队起始模板长期演进。

💡 本附录目标：从**打开编辑器**到**发布 npm 包 + CI 绿灯**全流程，每一步都能复制粘贴运行。

### A.1 两套 tsconfig 现代模板

#### 模板 1：Node 后端（`NodeNext` 全家桶）

适用场景：Express / Fastify / Nest / CLI 工具 / 任何直接由 Node 运行的 TS 项目。`NodeNext` 会**严格按 Node ESM 解析规则**要求你写 `.js` 后缀，import 路径与运行时一致，避免出坑。

```json
{
  "compilerOptions": {
    "target": "ES2023", "lib": ["ES2023"],
    "module": "NodeNext", "moduleResolution": "NodeNext", "moduleDetection": "force",
    "esModuleInterop": true, "resolveJsonModule": true,
    "strict": true, "noUncheckedIndexedAccess": true, "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true, "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true, "erasableSyntaxOnly": true,
    "outDir": "dist", "rootDir": "src",
    "sourceMap": true, "declaration": true, "declarationMap": true,
    "isolatedModules": true, "skipLibCheck": true, "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"], "exclude": ["node_modules", "dist"]
}
```

💡 Node 后端**必须**开 `verbatimModuleSyntax`：强制 `import type` 与 `import` 分开写，防止 TS 把「只用作类型的 import」编进 runtime，避免运行时 `ERR_MODULE_NOT_FOUND`。

#### 模板 2：前端库 / 打包器（`bundler` 极简派）

适用场景：Vite / Webpack / Rspack / tsup / Rollup 项目。`bundler` 允许 `import x from './x'` 省后缀、也允许 `./x.ts` 带后缀。

```json
{
  "compilerOptions": {
    "target": "ES2022", "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext", "moduleResolution": "bundler", "moduleDetection": "force",
    "allowImportingTsExtensions": true, "resolveJsonModule": true, "jsx": "react-jsx",
    "strict": true, "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true, "isolatedModules": true, "isolatedDeclarations": true,
    "noEmit": true, "skipLibCheck": true
  },
  "include": ["src"]
}
```

#### 关键开关速查表

| 开关 | 版本 | 作用 | 何时开 |
| --- | --- | --- | --- |
| `moduleResolution: "NodeNext"` | 4.7+ | 严格 Node ESM 解析（必须写 `.js`） | 直接跑在 Node 的项目 |
| `moduleResolution: "bundler"` | 5.0+ | 打包器友好，省后缀 | 走 Vite/Webpack/tsup |
| `moduleDetection: "force"` | 4.7+ | 无 import/export 也当模块 | 全模块化项目（避免 top-level 变量污染） |
| `verbatimModuleSyntax` | 5.0+ | import/export 100% 保留原样 | 所有新项目（强烈推荐） |
| `isolatedDeclarations` | 5.5+ | 强制显式导出类型，秒出 `.d.ts` | 大 monorepo / 库作者 |
| `erasableSyntaxOnly` | 5.8+ | 禁用 enum / namespace 等无法擦除的语法，兼容 Node `--experimental-strip-types` | Node 22+ 直接跑 TS 的项目 |
| `allowImportingTsExtensions` | 5.0+ | 允许 `import './x.ts'` | 配合 `bundler` 或 Deno |
| `exactOptionalPropertyTypes` | 4.4+ | `{ x?: T }` 与 `{ x: T \| undefined }` 严格分开 | 追求极致类型安全 |
| `noUncheckedIndexedAccess` | 4.1+ | `arr[i]` 自动加 `\| undefined` | 全部项目建议开 |

🎯 二选一口诀：**"跑 Node 用 NodeNext；进打包器用 bundler"**。不要混用，混用会 debug 到怀疑人生。

### A.2 zod：一次 schema，运行时 + 编译期通吃

zod 是 TS 生态**运行时校验 + 类型推导**的事实标准。核心哲学：**schema 是单一真相源（Single Source of Truth）**，TS 类型由 `z.infer<>` 自动派生。

```ts
import { z } from 'zod'

// ① 定义 schema（运行时可校验的对象）
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
  role: z.enum(['admin', 'user', 'guest']),
  createdAt: z.coerce.date(),
})

// ② 自动推出 TS 类型（不用手写 interface）
export type User = z.infer<typeof UserSchema>
// 等价于：
// type User = { id: string; email: string; age: number;
//               role: 'admin' | 'user' | 'guest'; createdAt: Date }
```

**场景 A：API 参数校验（Express 中间件）**

```ts
import type { RequestHandler } from 'express'
import { z, ZodType } from 'zod'

export const validate = <T extends ZodType>(schema: T): RequestHandler => (req, res, next) => {
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() })
  req.body = parsed.data          // 覆盖为已校验、已类型化的值
  next()
}
app.post('/users', validate(UserSchema.omit({ id: true, createdAt: true })), (req, res) => {
  // req.body 自动是 Omit<User, 'id' | 'createdAt'>
})
```

**场景 B：环境变量校验（启动即失败）**

```ts
// src/env.ts
import 'dotenv/config'
import { z } from 'zod'
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
})
export const env = EnvSchema.parse(process.env)  // 缺字段进程直接 crash
```

**场景 C：前端表单校验（React Hook Form 联动）**

```ts
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
const LoginSchema = z.object({
  email: z.string().email('邮箱格式不对'),
  password: z.string().min(8, '至少 8 位'),
})
type LoginForm = z.infer<typeof LoginSchema>
const { register, handleSubmit, formState: { errors } } =
  useForm<LoginForm>({ resolver: zodResolver(LoginSchema) })
// errors.email?.message 全程类型提示
```

💡 zod 4（2025）性能大幅提升，且新增 `z.iso.datetime()`、`z.stringbool()` 等实用类型；建议直接上 `zod@4`。

🎯 单源真相口诀：**"schema 只写一次，类型自动生成，运行时也校验"**——彻底告别 `interface` 与 `Joi` 双写。

### A.3 monorepo + project references（`tsc -b` 增量编译）

`project references` 是 TS 官方的 monorepo 方案：让 `tsc -b` 只重编「有改动 + 依赖它的」子包，大项目冷编时间从分钟级降到秒级。

#### 目录结构（pnpm workspace）

```
my-mono/
├─ pnpm-workspace.yaml
├─ tsconfig.base.json          # 共享 compilerOptions
├─ tsconfig.json               # 根：只列 references
└─ packages/
   ├─ shared/                  # 通用类型 & 工具
   │  ├─ src/index.ts
   │  ├─ package.json
   │  └─ tsconfig.json
   ├─ core/                    # 依赖 shared
   │  ├─ src/index.ts
   │  ├─ package.json
   │  └─ tsconfig.json
   └─ web/                     # 依赖 core、shared
      ├─ src/index.ts
      ├─ package.json
      └─ tsconfig.json
```

```yaml
# pnpm-workspace.yaml
packages:
  - "packages/*"
```

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "incremental": true,
    "skipLibCheck": true,
    "isolatedDeclarations": true
  }
}
```

```json
// tsconfig.json（根）
{
  "files": [],
  "references": [
    { "path": "packages/shared" },
    { "path": "packages/core" },
    { "path": "packages/web" }
  ]
}
```

```json
// packages/core/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src"],
  "references": [{ "path": "../shared" }]
}
```

```json
// packages/core/package.json
{
  "name": "@my/core", "version": "0.0.0", "type": "module",
  "main": "./dist/index.js", "types": "./dist/index.d.ts",
  "dependencies": { "@my/shared": "workspace:*" }
}
```

```bash
# 常用命令
pnpm -r install
pnpm exec tsc -b            # 全量增量编译
pnpm exec tsc -b --watch    # 监听模式
pnpm exec tsc -b --clean    # 清空 .tsbuildinfo + dist
pnpm exec tsc -b --force    # 忽略缓存全量重编
```

💡 收益实测：**80 包 monorepo**，冷编从 42s → 首次 42s、二次改一个文件 0.8s。搭配 `isolatedDeclarations` 后 `.d.ts` 生成也能并行化，效果翻倍。

🎯 monorepo 三件套：**`composite: true` + `references` + `workspace:*`**——缺一不可。

### A.4 dual ESM/CJS 双导出发布（tsup 一键搞定）

现代 npm 包最佳实践：**同时导出 ESM + CJS + `.d.ts`**，让 CommonJS 老项目和 ESM 新项目都能 `import`。tsup（基于 esbuild）是最省心的方案。

```ts
// tsup.config.ts
import { defineConfig } from 'tsup'
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true, sourcemap: true, clean: true, treeshake: true,
  target: 'node18',
  outExtension: ({ format }) => ({ js: format === 'esm' ? '.mjs' : '.cjs' }),
})
```

```json
// package.json（关键字段）
{
  "name": "@my/utils", "version": "1.0.0", "type": "module",
  "main": "./dist/index.cjs", "module": "./dist/index.mjs", "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./package.json": "./package.json"
  },
  "files": ["dist", "README.md"],
  "scripts": {
    "build": "tsup",
    "prepublishOnly": "pnpm build && pnpm test",
    "check:exports": "attw --pack ."
  },
  "devDependencies": {
    "@arethetypeswrong/cli": "^0.17.0", "tsup": "^8.3.0", "typescript": "^5.7.0"
  }
}
```

#### 双端验证

```bash
# ① 用 arethetypeswrong 检查导出正确性（业内标准）
npx attw --pack .

# ② 手工验证 ESM 端
node --input-type=module -e "import {foo} from '@my/utils'; console.log(foo)"

# ③ 手工验证 CJS 端
node -e "const {foo} = require('@my/utils'); console.log(foo)"
```

💡 `exports` 字段里 `types` **必须放在最前面**，否则 TS 5.x + `moduleResolution: NodeNext` 用户会报「找不到类型」——这是 2024 起最常见的发包坑。

🎯 双端发布口诀：**"tsup 打两份 + exports 正确排序 + attw 验收"**——三步锁定质量。

### A.5 类型层单元测试（vitest + expect-type）

类型也要测。vitest 内置 `expectTypeOf`（拷贝自 `expect-type`），比 `tsd` 更快、更贴近日常写法。

```ts
// src/utils.ts
export function pick<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const out = {} as Pick<T, K>
  for (const k of keys) out[k] = obj[k]
  return out
}

export type Awaited2<T> = T extends Promise<infer U> ? Awaited2<U> : T
```

```ts
// src/utils.type-test.ts
import { describe, it, expectTypeOf } from 'vitest'
import { pick, type Awaited2 } from './utils'

describe('pick 类型', () => {
  it('只保留选中的 key', () => {
    const p = pick({ id: 1, name: 'a', age: 20 }, ['id', 'name'] as const)
    expectTypeOf(p).toEqualTypeOf<{ id: number; name: string }>()
  })
  it('传不存在的 key 应报错', () => {
    // @ts-expect-error 'notExist' 不是 keyof
    pick({ id: 1 }, ['notExist'] as const)
  })
})

it('Awaited2 递归拆 Promise', () => {
  expectTypeOf<Awaited2<Promise<Promise<number>>>>().toEqualTypeOf<number>()
})
```

```bash
pnpm add -D vitest
pnpm exec vitest --typecheck
```

#### 与 tsd 的对比

| 维度 | `expect-type`（vitest 内置） | `tsd` |
| --- | --- | --- |
| 运行方式 | 与业务测试**同一命令** | 独立命令 |
| 语法 | 链式 `.toEqualTypeOf<T>()` | `expectType<T>(v)` 风格 |
| 快慢 | 快（借 vitest incremental） | 每次全量 tsc |
| 边界断言 | `.branded` / `.parameter(0)` 等极其丰富 | 较基础 |
| 推荐 | ✅ 新项目首选 | 老项目/迁移期用 |

💡 `// @ts-expect-error` 是「反向断言」的官方姿势：如果那行**不再报错**，编译期会失败，等于免费拿到一条负向类型测试。

🎯 类型测试口诀：**"expectTypeOf 正向 + @ts-expect-error 负向"**——两把刷子覆盖 95% 场景。

### A.6 TS 5.x 新特性速用手册

#### 1. `using` / `await using` + `Symbol.dispose`（TS 5.2）

自动资源释放，告别 `try/finally { conn.close() }` 样板。

```ts
class DbConn implements Disposable {
  constructor(public readonly url: string) { console.log('open', url) }
  [Symbol.dispose]() { console.log('close', this.url) }
}
function query() {
  using conn = new DbConn('postgres://...')
  // ...使用 conn；离开作用域自动 dispose
}
class AsyncFile implements AsyncDisposable {
  async [Symbol.asyncDispose]() { /* flush + close */ }
}
async function write() { await using f = new AsyncFile() } // 自动 await 释放
```

#### 2. `const` 类型参数（TS 5.0）

省掉 `as const`，让泛型推断精确到字面量。

```ts
function tuple<const T extends readonly unknown[]>(t: T): T { return t }
const t = tuple(['a', 'b', 1])
// 推断：readonly ["a", "b", 1]  ——不用手写 as const
```

#### 3. `NoInfer<T>` 阻断推断（TS 5.4）

防止某个参数「污染」泛型推断。

```ts
function createLabel<T extends string>(text: T, fallback: NoInfer<T>) {}
createLabel('a', 'b')     // ✅ T = 'a'，fallback 只能是 'a'
createLabel('a', 'a')     // ✅
// createLabel('a', 'c')  // ❌ 报错
```

#### 4. Import Attributes（TS 5.3）

替代旧 `assert { type: 'json' }`。

```ts
import config from './config.json' with { type: 'json' }
```

#### 5. Stage 3 装饰器 + `ctx.metadata` + `accessor`（TS 5.0 / 5.2）

```ts
function logged<T extends (this: any, ...a: any) => any>(target: T, ctx: ClassMethodDecoratorContext): T {
  const name = String(ctx.name)
  return function (this: any, ...args: any[]) { console.log(`call ${name}`); return target.apply(this, args) } as T
}
class Foo {
  @logged hello(msg: string) { console.log('hi', msg) }
  accessor counter = 0   // 自动生成 get/set，可被装饰器接管
}
```

#### 6. `satisfies` vs `as` 正确取舍

```ts
type Config = Record<string, string | number>

// ❌ as：强制断言，丢失字面量类型
const c1 = { host: 'a', port: 8080 } as Config
c1.port.toFixed  // string | number, 丢了 number

// ✅ satisfies：校验结构 + 保留精确类型
const c2 = { host: 'a', port: 8080 } satisfies Config
c2.port.toFixed(2)   // OK, port 是 number
c2.host.toUpperCase() // OK, host 是 string 字面量
```

口诀：**"想校验又想保精度用 satisfies；想强行覆盖类型才用 as"**。

#### 7. `isolatedDeclarations`（TS 5.5）

强制所有导出显式标注类型，让 `.d.ts` 生成不再依赖类型推断——第三方工具（oxc、swc、esbuild）也能秒生成 declaration，大 monorepo 构建再快 3–5 倍。

```ts
// ❌ isolatedDeclarations 下报错
export function add(a: number, b: number) { return a + b }
// ✅ 显式返回类型
export function add(a: number, b: number): number { return a + b }
```

🎯 5.x 新特性口诀：**"资源 using、推断 const/NoInfer、发布 isolatedDeclarations"**——三条最能带来生产力跃迁。

### A.7 GitHub Actions：`tsc -b` + vitest + npm publish

一份可直接投产的 CI 模板，覆盖：类型检查、单测、构建、按 tag 自动发布 npm（含 provenance 签名）。

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push: { branches: [main], tags: ['v*'] }
  pull_request: { branches: [main] }

jobs:
  test:
    runs-on: ubuntu-latest
    strategy: { matrix: { node: [20, 22] } }
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: '${{ matrix.node }}', cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - name: Type check (project references)
        run: pnpm exec tsc -b --verbose
      - name: Unit + type tests
        run: pnpm exec vitest run --typecheck --coverage
      - name: Build
        run: pnpm -r build
      - name: Validate package exports
        run: pnpm exec attw --pack ./packages/utils

  publish:
    needs: test
    if: startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest
    permissions: { contents: read, id-token: write }   # provenance 需要
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install --frozen-lockfile
      - run: pnpm -r build
      - name: Publish to npm (with provenance)
        run: pnpm -r publish --access public --no-git-checks --provenance
        env: { NODE_AUTH_TOKEN: '${{ secrets.NPM_TOKEN }}' }
```

💡 `--provenance` 会向 npm 提交带签名的构建来源证明，用户 `npm view <pkg>` 能看到「Built and signed on GitHub Actions」徽标——2024 起 npm 官方推荐所有开源包启用。

🎯 CI 口诀：**"类型 → 测试 → 构建 → 校验 exports → 打 tag 触发发布"**——五步齐活，永不翻车。

---

🎯 学习秘诀：TS 项目的三件套 = **"tsconfig 双模板 + zod 单源 + project references"**。掌握这三条，从个人库到 monorepo 都能架构清晰，发布无坑，CI 秒过。

---

## <span class="lv lv-3">高级</span> 附录 B：TypeScript 5.x 新特性精讲

TypeScript 5.x（2023-2026）是继 3.7（可选链）、4.9（`satisfies`）之后的又一轮"深度重构"，主线 **"更贴近 JS 引擎 + 更少运行时开销 + 更快构建"**。本附录讲透 5.0 → 5.8 最值得掌握的十个特性，并给出 2026 年推荐的现代 `tsconfig` 全开关。

### B.1 `using` / `await using`（TS 5.2）—— 资源自动释放

TC39 Stage 3 [Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management) 提案落地，TypeScript 5.2 抢先支持。核心思想：**把"析构"从手动 try/finally 中解放出来**，语义上等价于 Go 的 `defer`、Rust 的 `Drop`、C# 的 `using`。

#### 基础语法

```ts
// 同步资源：实现 [Symbol.dispose]
class FileHandle {
  constructor(public path: string) { console.log(`open ${path}`) }
  [Symbol.dispose]() { console.log(`close ${this.path}`) }
}
function readConfig() {
  using fh = new FileHandle('/etc/app.conf')
  // 离开作用域时自动调用 fh[Symbol.dispose]()
}

// 异步资源：实现 [Symbol.asyncDispose]
class DbConnection {
  static async open(url: string) { return new DbConnection(url) }
  private constructor(public url: string) {}
  async [Symbol.asyncDispose]() { /* close */ }
}
async function handler() {
  await using db = await DbConnection.open('postgres://...')
} // 自动 await db[Symbol.asyncDispose]()
```

💡 `Symbol.dispose` / `Symbol.asyncDispose` 是新的 well-known symbols，polyfill：`(Symbol as any).dispose ??= Symbol('Symbol.dispose')`。TS 5.2 自带 lib.d.ts 声明，Node 20.11+/22+ 内置支持。

#### 典型场景 —— 数据库连接池 / 临时目录

```ts
// 连接池：using 保证异常时也归还
class PgClient {
  constructor(private c: PoolClient) {}
  query = this.c.query.bind(this.c);
  [Symbol.dispose]() { this.c.release() }
}
async function transfer(from: string, to: string, amt: number) {
  using c = new PgClient(pgPool.connect())
  await c.query('BEGIN')
  try {
    await c.query('UPDATE accounts SET balance=balance-$1 WHERE id=$2', [amt, from])
    await c.query('UPDATE accounts SET balance=balance+$1 WHERE id=$2', [amt, to])
    await c.query('COMMIT')
  } catch (e) { await c.query('ROLLBACK'); throw e }
} // 无论 throw 与否，using 都保证归还

// 临时目录：await using 自动清理
class TempDir {
  private constructor(public path: string) {}
  static async create() {
    return new TempDir(await mkdtemp(join(tmpdir(), 'app-')))
  }
  async [Symbol.asyncDispose]() { await rm(this.path, { recursive: true, force: true }) }
}
async function build() {
  await using tmp = await TempDir.create()
  // 函数返回时目录自动清理
}
```

#### DisposableStack / AsyncDisposableStack

同一作用域内需要**批量注册**资源时，用栈：

```ts
function bootstrap() {
  using stack = new DisposableStack()
  const server = stack.use(startServer())      // 已实现 [Symbol.dispose]
  stack.defer(() => console.log('bye'))         // 注册任意函数
  stack.adopt(nativeHandle, h => h.close())     // 收养第三方对象
  return { server }
}
```

🎯 心法：**"using 替代 try/finally，DisposableStack 替代嵌套 try"**。凡"open/close 成对"的资源（fd、锁、subscription、Prom timer、OTel span）都值得包一层。

---

### B.2 const 类型参数 `<const T>`（TS 5.0）—— 阻止字面量宽化

老问题：泛型参数在推断时会**宽化**（widen）字面量为基础类型：

```ts
// 旧写法
function route<T extends string>(path: T): T { return path }
const r1 = route('/users')  // ✅ 推断为 '/users'

function routes<T extends readonly string[]>(paths: T): T { return paths }
const r2 = routes(['/a', '/b']) // ❌ 推断为 string[]，字面量丢失
```

TS 5.0 引入 `const` 类型参数，等价于调用点自动补 `as const`：

```ts
function routes<const T extends readonly string[]>(paths: T): T { return paths }
const r2 = routes(['/a', '/b']) // ✅ 推断为 readonly ['/a', '/b']
```

#### 典型收益 —— 表单 schema / 路由定义 / i18n 键

```ts
// 表单 schema
function defineForm<const T extends Record<string, { type: 'text' | 'number'; label: string }>>(f: T) { return f }
const loginForm = defineForm({
  email: { type: 'text', label: '邮箱' },
  age:   { type: 'number', label: '年龄' },
})
// loginForm.email.type 类型是 'text'，而不是 string

// 路由定义：可直接 typeof [number]['name'] 提取联合类型
function defineRoutes<const T extends readonly { path: string; name: string }[]>(rs: T) { return rs }
const routes = defineRoutes([{ path: '/', name: 'home' }, { path: '/about', name: 'about' }])
type RouteName = typeof routes[number]['name'] // 'home' | 'about'

// 与 NoInfer 组合：调用点无需 as const
function pick<const K extends readonly string[]>(keys: K, defaults: Record<K[number], string>) {}
pick(['a', 'b'], { a: 'x', b: 'y' })
```

💡 `const T` 只影响**调用点推断**，不修改 T 的约束。如果调用者显式传入类型参数 `route<string>('/x')`，仍会得到 string。想强制字面量收窄，通常还需搭配 `extends string` / `extends readonly ...[]` 约束。

🎯 心法：**"as const 密集出现的 DSL API，就把泛型参数改成 const T"**——库作者友好、使用者省事。

### B.3 `NoInfer<T>` —— 阻断反向推断（TS 5.4）

**问题**：函数第一个参数用于推断类型，第二个参数希望"跟第一个走但不影响推断"，否则会得到过宽的联合。

```ts
// 旧行为
function createState<T>(initial: T, allowed: T[]) {}
createState('idle', ['idle', 'loading', 'error'])
// T 被推断为 'idle' | 'loading' | 'error'，而调用者本意是 T='idle'
```

TS 5.4 引入内置 `NoInfer<T>` 工具类型：

```ts
function createState<T>(initial: T, allowed: NoInfer<T>[]) {}
createState('idle', ['idle', 'loading', 'error']) // ❌ 报错：'loading' 不在 T='idle'
```

#### 常见搭配

```ts
// 表单默认值：与 schema 匹配但不参与推断
function useForm<T extends Record<string, unknown>>(schema: T, defaults: NoInfer<Partial<T>>) {}

// 状态机：states 决定 S，events 校验但不扩推断
function machine<S extends string>(states: readonly S[], events: Record<NoInfer<S>, string>) {}
```

💡 `NoInfer` 之前的社区 hack 是 `T & {}` 或条件类型 `[T][T extends any ? 0 : never]`，都是玄学写法。5.4 后请统一用官方版。

🎯 心法：**"想让某个位置只做校验、不扩推断，就套 NoInfer"**。

### B.4 Import Attributes（TS 5.3）—— 标准化 JSON / WASM 导入

TC39 Stage 3 Import Attributes（前身 Import Assertions）落地，语法 `assert` → **`with`**：

```ts
// TS 5.3+：JSON 模块
import pkg from './package.json' with { type: 'json' }

// 动态 import
const data = await import('./data.json', { with: { type: 'json' } })

// re-export
export { default as config } from './cfg.json' with { type: 'json' }
```

#### resolution-mode 属性

在 `import type` 上强制走 CJS 或 ESM 的解析算法（对同时暴露 dual 包时非常有用）：

```ts
import type { Options } from 'pkg' with { 'resolution-mode': 'require' }
import type { Config }  from 'pkg' with { 'resolution-mode': 'import' }
```

#### 兼容性速查

| Runtime / Bundler | `with { type: 'json' }` |
|---|---|
| Node 22.12+ / Chrome 123+ / Safari 17.2+ | ✅ |
| Vite 5+ / Rollup 4+ / esbuild 0.20+ / Webpack 5.90+ | ✅ |
| tsc `--module nodenext` | ✅（必须写 `with`） |

💡 老代码 `assert { type: 'json' }` 在 Node 22 会给 deprecation warning；TS 5.3 同时接受但推荐 `with`。写库时统一改 `with`。

🎯 心法：**"JSON 导入不再靠 resolveJsonModule 打洞，而靠标准语法声明契约"**。

---

### B.5 Stage 3 装饰器 metadata 与 `accessor`（TS 5.2+）

TS 5.0 首发 Stage 3 装饰器（**不带**参数装饰器，语义与老 experimentalDecorators 完全不同），5.2 补齐 **`accessor` 关键字** + **`context.metadata`** + **`addInitializer`**。

#### `accessor` —— 自动 getter/setter + 私有字段

```ts
class User { accessor name: string = 'anon' }
// 等价于：#name 私有字段 + get/set。价值：装饰器可拦截 accessor，无法优雅拦截普通字段。
```

#### 一个真实用例 —— 依赖注入 + 路由注册

```ts
// DI：字段装饰器返回 initializer，替换字段读取行为
type InjectKey<T> = symbol & { __t?: T }
const container = new Map<symbol, unknown>()
function Inject<T>(key: InjectKey<T>) {
  return (_t: undefined, _c: ClassFieldDecoratorContext<any, T>) =>
    function (this: any) { return container.get(key) as T }
}

// 路由注册：方法装饰器用 addInitializer 在实例化时收集元信息
const routes: { method: string; path: string; handler: Function }[] = []
function Get(path: string) {
  return function (target: Function, ctx: ClassMethodDecoratorContext) {
    ctx.addInitializer(function () {
      routes.push({ method: 'GET', path, handler: target.bind(this) })
    })
  }
}

class UserController {
  @Inject(Symbol.for('logger') as InjectKey<{ log(s: string): void }>)
  accessor logger!: { log(s: string): void }

  @Get('/users') list() { this.logger.log('list'); return ['a', 'b'] }
  @Get('/users/:id') detail() { /*...*/ }
}
new UserController() // 触发 addInitializer，routes 自动填充
```

💡 `ctx.metadata` 是**共享对象**，同类所有装饰器可读写，子类通过原型链继承——"NestJS 风格 DI"的基石。启用需 `"target": "ES2022"`+ 以上 + `Symbol.metadata` polyfill。

🎯 心法：**"新装饰器 = 拦截 + 初始化钩子 + 共享 metadata"**，不要再用老的 `experimentalDecorators`（语义差别巨大，未来会移除）。

---

### B.6 `isolatedDeclarations`（TS 5.5）—— 并行 .d.ts 生成

大型 monorepo 的痛点：`tsc` 生成 .d.ts 必须做**完整类型推断**，无法并行。5.5 引入 `isolatedDeclarations`：所有导出必须**显式标注返回类型**（编译器不再帮推），换来第三方工具（swc、esbuild、Bun、oxc）**只看单文件**产出 .d.ts。Bloomberg 官方 benchmark：monorepo 类型包发布提速 10-30 倍。

```ts
// tsconfig：declaration + isolatedDeclarations + isolatedModules

// ❌ 报错：Function must have an explicit return type annotation
export function add(a: number, b: number) { return a + b }
// ✅
export function add(a: number, b: number): number { return a + b }

// export const 也要标注（字面量除外）
export const port: number = 3000         // ✅
export const port = 3000 as const        // ✅
```

搭配 [`oxc-transform`](https://oxc.rs) / `swc --emit-decl-only` / `unplugin-isolated-decl`（Vite 插件）即可让第三方工具产出 .d.ts。

💡 迁移策略：**先在库包开启**（发包必须准确），业务代码可以延后。CI 层加一个 `tsc --noEmit --isolatedDeclarations` 校验，确保新代码符合规范。

🎯 心法：**"未来 .d.ts 由 Rust/Go 工具产出，isolatedDeclarations 就是入场券"**。

---

### B.7 `moduleResolution: 'bundler'`（TS 5.0）

TS 5.0 前，前端项目要么用 `node`（老 CJS，不认识 exports 字段），要么用 `nodenext`（严格 ESM，强制写 `.js` 扩展名）。5.0 新增 `bundler` 挡位，**模拟 Vite/webpack/esbuild**。

#### 差异表

| 特性 | `node` | `node16` / `nodenext` | `bundler` |
|---|---|---|---|
| 认 `package.json` 的 `exports` | ❌ | ✅ | ✅ |
| 强制 `.js` 扩展名 | ❌ | ✅ | ❌ |
| 允许 `.ts` 扩展名（`allowImportingTsExtensions`） | ❌ | ❌ | ✅ |
| 支持 conditions（`import` / `require` / `types`） | ❌ | ✅ | ✅ |
| 强制 `type: "module"` 语义 | ❌ | ✅ | ❌ |

#### 推荐组合

```jsonc
// 前端应用（Vite / Next.js / Remix / SvelteKit）：宽松，交给打包器
{ "compilerOptions": {
    "module": "ESNext", "moduleResolution": "bundler",
    "allowImportingTsExtensions": true, "noEmit": true
}}

// 后端 Node 库（发 npm）：严格，保证用户 Node 里能解析
{ "compilerOptions": { "module": "NodeNext", "moduleResolution": "NodeNext" }}
```

💡 `bundler` 只用于**开发时类型检查**，实际打包由 Vite/esbuild 完成。发 npm 的库仍推荐 `NodeNext`，否则用户 Node 里会解析失败。

🎯 心法：**"前端应用用 bundler，库项目用 NodeNext"**——两条铁律。

---

### B.8 `verbatimModuleSyntax`（TS 5.0）

取代过时的 `importsNotUsedAsValues` 和 `preserveValueImports`。核心：**编译器一字不改地保留 import/export 语法**，你写 `import type` 就发 `import type`，你写 `import` 就是运行时导入。

```jsonc
{
  "compilerOptions": {
    "verbatimModuleSyntax": true
  }
}
```

```ts
// ❌ 报错：'Options' is a type and must be imported using a type-only import
import { createServer, Options } from './server'

// ✅ 分开
import { createServer } from './server'
import type { Options } from './server'

// ✅ 或用 inline type 修饰符
import { createServer, type Options } from './server'
```

#### 为什么重要

1. **ESM/CJS 互操作**：CJS 中 `import type` 会被删除，不触发 side-effect；写错就会引入运行时依赖。
2. **只导入类型时零运行时开销**：避免 tree-shaking 失败（工具无法从纯类型 import 中删除死代码）。
3. **强制显式**：review 时一眼分辨"这个 import 是值还是类型"（`import { UserRole }` 是 enum 还是 type？开了就知道）。

💡 迁移工具：`typescript-eslint` 的 `consistent-type-imports` 规则可以 --fix 一键改造老项目。

🎯 心法：**"verbatim = 所见即所得"**，配合 `moduleDetection: 'force'` 让所有文件都当作 ESM 处理，杜绝 CJS 蒙圈。

---

### B.9 tsgo —— TypeScript 原生编译器（Go 版）

2025 年 3 月，Anders Hejlsberg 官宣 [TypeScript 原生端口计划](https://devblogs.microsoft.com/typescript/typescript-native-port/)：用 **Go 语言**完全重写 tsc/tsserver，代号 **tsgo**（也叫 TypeScript 7.0 native compiler）。

#### 关键数字（微软官方 benchmark）

| 项目 | tsc (Node) | tsgo | 提速 |
|---|---|---|---|
| VS Code 类型检查 | 77.8s | 7.5s | **10.4x** |
| Playwright | 11.1s | 1.1s | **10.1x** |
| TypeORM | 17.5s | 1.3s | **13.5x** |
| tsserver 冷启动 | 9.6s | 1.2s | **8x** |

#### 为什么选 Go 而不是 Rust

Anders 官方博客：Go 的 **GC + 并发模型**与 tsc 现有代码结构（大量共享可变对象）几乎一比一映射；Rust 的所有权模型需要"从零重新设计数据结构"，工期不可控。

#### 现状（2026/07）

- 开源在 [github.com/microsoft/typescript-go](https://github.com/microsoft/typescript-go)，已完成类型检查、语法解析、tsserver 主协议；emit（.js/.d.ts）仍在开发
- 稳定版随 **TypeScript 7.0** 发布，`tsc` (JS) 将成为 6.x LTS，`tsgo` 逐步替换
- VS Code Insiders 开关：`typescript.experimental.useTsgo`；npm 尝鲜：`pnpm add -D @typescript/native-preview`

```bash
# 尝鲜
npx @typescript/native-preview --noEmit
```

💡 大项目（monorepo / 万级文件）冷启动 10x 提速最直接的收益是 **CI 时长**和 **VS Code 打开项目的等待时间**——想象一下 `tsserver` 1 秒热身而非 10 秒。

🎯 心法：**"未来 tsc 会更快，但你的代码要能被并行处理才能吃到红利"**——所以 `isolatedDeclarations` + `verbatimModuleSyntax` 现在就要开。

---

### B.10 现代 tsconfig 全开关速查（2026 推荐）

一份"新建 Node 库 / 前端库项目"直接抄的 `tsconfig.base.json`：

```jsonc
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    // 目标与模块
    "target": "ES2023", "lib": ["ES2023"],
    "module": "NodeNext", "moduleResolution": "NodeNext",
    "moduleDetection": "force",
    "esModuleInterop": true, "resolveJsonModule": true,

    // 严格模式全家桶
    "strict": true,
    "useUnknownInCatchVariables": true,

    // no* 全套（库项目强烈推荐）
    "noUnusedLocals": true, "noUnusedParameters": true,
    "noImplicitReturns": true, "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true, "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "exactOptionalPropertyTypes": true,

    // TS 5.x 新家伙
    "verbatimModuleSyntax": true,
    "isolatedDeclarations": true,
    "isolatedModules": true,
    "erasableSyntaxOnly": true,

    // 输出
    "declaration": true, "declarationMap": true, "sourceMap": true,
    "outDir": "./dist", "rootDir": "./src",

    // 稳定性
    "skipLibCheck": true, "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

#### 关键选项作用速查

| 开关 | 一句话 |
|---|---|
| `moduleDetection: "force"` | 所有文件当 ESM，避免 CJS 隐式推断 |
| `verbatimModuleSyntax` | import 所见即所得，ESM/CJS 互操作无坑 |
| `isolatedDeclarations` | 并行生成 .d.ts，monorepo/库必开 |
| `erasableSyntaxOnly` | 禁 enum/namespace/参数属性，兼容 Node strip-types |
| `noUncheckedIndexedAccess` | `arr[i]` 变 `T \| undefined`，堵越界 |
| `exactOptionalPropertyTypes` | `x?: T` 不允许显式 undefined，契约精确 |

💡 `erasableSyntaxOnly`（TS 5.8）配合 Node 22.6+ 的 `--experimental-strip-types` 可**直接跑 .ts 文件**，代价：禁用 `enum` / `namespace` / 构造器参数属性——TS 代码 100% 变成"合法 JS + 类型注释"。

#### 分层 tsconfig（monorepo 推荐）

```
tsconfig.base.json    # 上面这一份
tsconfig.build.json   # extends base，"noEmit": false
tsconfig.test.json    # extends base，include tests，types: ["vitest/globals"]
apps/web/*            # extends base，加 DOM lib
```

🎯 心法：**"strict 全开 + no* 全套 + TS 5.x 三件套（verbatim / isolatedDecl / erasableSyntax）"**——2026 年的新项目开箱就是 A 级配置，剩下的只是业务。

---

🎯 学习秘诀：**TS 5.x 主线 = "更接近 JS 引擎 + 更少运行时开销"**——`using` 让资源管理接近原生、`accessor` 让装饰器不 hack 原型、`isolatedDeclarations` 让 .d.ts 摆脱全项目推断、`erasableSyntaxOnly` 让 TS 回归 JS 超集本源。跟这条主线走，你的 TS 会**越用越像未来的 JS**，工具链换 tsgo 时零成本升级。
