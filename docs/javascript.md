# JavaScript 全阶段学习手册

> 覆盖 ES6 ~ ES2024，从入门到高级实战的中文学习文档。每节配备可运行代码示例与一句话总结，助力系统性掌握 JavaScript 核心知识。

## 目录

- [一、🟢 初级入门](#一-初级入门)
  - [JS 是什么 & 发展史](#js-是什么--发展史)
  - [引入方式](#引入方式)
  - [var / let / const & 暂时性死区](#var--let--const--暂时性死区)
  - [数据类型](#数据类型)
  - [类型转换](#类型转换)
  - [运算符](#运算符)
  - [流程控制](#流程控制)
  - [函数](#函数)
  - [数组常用方法](#数组常用方法)
  - [字符串常用方法](#字符串常用方法)
  - [对象基础](#对象基础)
  - [DOM 入门](#dom-入门)
  - [BOM 常用](#bom-常用)
  - [JSON](#json)
- [二、🟡 中级进阶](#二-中级进阶)
  - [执行上下文 & 作用域链 & this](#执行上下文--作用域链--this)
  - [闭包](#闭包)
  - [原型 & 原型链](#原型--原型链)
  - [继承 & class](#继承--class)
  - [Map / Set / WeakMap / WeakSet](#map--set--weakmap--weakset)
  - [Symbol](#symbol)
  - [Iterator / Generator](#iterator--generator)
  - [Promise](#promise)
  - [async / await](#async--await)
  - [事件循环](#事件循环)
  - [事件模型](#事件模型)
  - [深拷贝 vs 浅拷贝](#深拷贝-vs-浅拷贝)
  - [防抖 & 节流](#防抖--节流)
  - [模块化](#模块化)
  - [错误处理](#错误处理)
- [三、🔴 高级实战](#三-高级实战)
  - [V8 引擎](#v8-引擎)
  - [内存泄漏](#内存泄漏)
  - [手写 Promise](#手写-promise)
  - [Proxy & Reflect](#proxy--reflect)
  - [元编程](#元编程)
  - [函数式编程](#函数式编程)
  - [手写系列](#手写系列)
  - [Web APIs](#web-apis)
  - [Web Workers](#web-workers)
  - [动态 import](#动态-import)
  - [ES2020+ 亮点](#es2020-亮点)
  - [常见面试题](#常见面试题)

---

## 一、🟢 初级入门

### <span class="lv lv-1">初级</span> JS 是什么 & 发展史

JavaScript 诞生于 1995 年，Brendan Eich 用 10 天完成初版。关键里程碑：

| 年份 | 事件 |
|------|------|
| 1995 | Netscape 发布 LiveScript → JavaScript |
| 1997 | ECMAScript 1 标准化 |
| 2009 | ES5（strict mode / JSON / forEach 等） |
| 2015 | ES6/ES2015（let/const/箭头函数/class/模块/Promise…） |
| 2016+ | 每年一版 ES20xx，持续迭代 |
| 2020 | ES2020 可选链 / 空值合并 / BigInt |
| 2024 | ES2024 Grouping / Promise.withResolvers |

💡 JavaScript ≠ Java，它是基于原型的多范式动态语言，由 ECMAScript 规范定义。

### <span class="lv lv-1">初级</span> 引入方式

```html
<!-- 1. 内联 -->
<script>
  console.log('inline');
</script>

<!-- 2. 外部文件（阻塞解析） -->
<script src="app.js"></script>

<!-- 3. defer：HTML 解析完后顺序执行 -->
<script defer src="app.js"></script>

<!-- 4. async：下载完立即执行，不保证顺序 -->
<script async src="analytics.js"></script>

<!-- 5. ES Module -->
<script type="module" src="main.mjs"></script>
```

| 属性 | 加载时机 | 执行顺序 | DOM 可用 |
|------|----------|----------|----------|
| 无 | 立即下载阻塞 | 文档顺序 | 否 |
| defer | 并行下载 | 文档顺序 | 是 |
| async | 并行下载 | 下载即执行 | 不确定 |

🎯 `defer` 是最安全的外部脚本引入方式，`type="module"` 默认 defer。

### <span class="lv lv-1">初级</span> var / let / const & 暂时性死区

```js
// var：函数作用域，有变量提升
console.log(a); // undefined
var a = 1;

// let：块级作用域，暂时性死区(TDZ)
// console.log(b); // ReferenceError
let b = 2;

// const：块级作用域 + 必须初始化 + 不可重新赋值
const c = 3;
// c = 4; // TypeError

// TDZ 示例
{
  // console.log(x); // ReferenceError: x is not defined (TDZ)
  let x = 10;
}
```

| 特性 | var | let | const |
|------|-----|-----|-------|
| 作用域 | 函数 | 块 | 块 |
| 提升 | 是（初始化为 undefined） | 是（TDZ） | 是（TDZ） |
| 重复声明 | 允许 | 不允许 | 不允许 |
| 重新赋值 | 允许 | 允许 | 不允许 |

💡 默认用 `const`，需要重赋值时用 `let`，永远不用 `var`。

### <span class="lv lv-1">初级</span> 数据类型

7 种原始类型 + 1 种引用类型：

| 类型 | typeof 结果 | 示例 |
|------|-------------|------|
| undefined | `"undefined"` | `let x;` |
| null | `"object"` (历史 bug) | `null` |
| boolean | `"boolean"` | `true / false` |
| number | `"number"` | `42 / NaN / Infinity` |
| bigint | `"bigint"` | `9007199254740991n` |
| string | `"string"` | `'hello'` |
| symbol | `"symbol"` | `Symbol('id')` |
| object | `"object"` / `"function"` | `{}` / `function(){}` |

```js
typeof null;          // "object" — 历史遗留
typeof function(){};  // "function"
typeof NaN;           // "number"
typeof 10n;           // "bigint"
```

💡 `typeof null === "object"` 是 JS 最著名的 bug，原始类型中只有 null 判断需要 `=== null`。

### <span class="lv lv-1">初级</span> 类型转换

```js
// 显式转换
Number('42');      // 42
String(42);        // "42"
Boolean(0);        // false
parseInt('0xff',16);// 255

// 隐式转换
'5' + 3;           // "53"（字符串拼接）
'5' - 3;           // 2  （数值减法）
!!'hello';         // true

// == vs ===
null == undefined;  // true  (特殊规则)
'' == false;        // true
0 == false;         // true
null === undefined; // false
'' === false;       // false
```

假值一览：`false / 0 / -0 / 0n / "" / null / undefined / NaN`

🎯 永远使用 `===`，除非你有意利用 `null == undefined` 的特性。

### <span class="lv lv-1">初级</span> 运算符

```js
// 空值合并 ?? — 只有 null/undefined 才走右边
const port = null ?? 3000;    // 3000
const zero = 0 ?? 42;         // 0（0 不是 null/undefined）

// 可选链 ?.
const city = user?.address?.city;  // 安全访问，不会报错
const fn = obj.method?.();         // 安全调用

// 逻辑赋值（ES2021）
let x = 0;
x ||= 10;   // x = 10（x 为假值时赋值）
let y = null;
y ??= 'default'; // y = 'default'（y 为 null/undefined 时赋值）

// 指数运算符
2 ** 10;   // 1024
```

| 运算符 | 含义 | ES 版本 |
|--------|------|---------|
| `??` | 空值合并 | ES2020 |
| `?.` | 可选链 | ES2020 |
| `\|\|=` | 逻辑或赋值 | ES2021 |
| `??=` | 空值合并赋值 | ES2021 |
| `**` | 指数 | ES2016 |

💡 `??` 和 `?.` 是现代 JS 最实用的新运算符，大幅减少防御性代码。

### <span class="lv lv-1">初级</span> 流程控制

```js
// if...else
const age = 20;
if (age >= 18) {
  console.log('成年');
} else {
  console.log('未成年');
}

// switch（使用 break 防止穿透）
const color = 'red';
switch (color) {
  case 'red':   console.log('红'); break;
  case 'blue':  console.log('蓝'); break;
  default:      console.log('其他');
}

// for 经典
for (let i = 0; i < 5; i++) console.log(i);

// for...of 遍历可迭代对象
for (const ch of 'abc') console.log(ch); // a b c

// for...in 遍历可枚举属性键（含原型链）
const obj = { a: 1, b: 2 };
for (const key in obj) console.log(key); // a b

// while
let n = 3;
while (n > 0) n--;
```

🎯 `for...of` 用于数组/字符串等可迭代对象，`for...in` 用于对象属性枚举。

### <span class="lv lv-1">初级</span> 函数

```js
// 函数声明（提升）
function add(a, b) { return a + b; }

// 函数表达式
const subtract = function(a, b) { return a - b; };

// 箭头函数（无自身 this/arguments/super/new.target）
const multiply = (a, b) => a * b;

// 默认值
function greet(name = 'World') {
  return `Hello, ${name}!`;
}

// 剩余参数
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}

// arguments（仅普通函数可用）
function showArgs() {
  console.log(arguments); // 类数组
}
```

| 类型 | 提升 | this | arguments | 可 new |
|------|------|------|-----------|--------|
| 声明 | 是 | 调用时决定 | 有 | 是 |
| 表达式 | 否 | 调用时决定 | 有 | 是 |
| 箭头 | 否 | 词法继承 | 无 | 否 |

💡 箭头函数的核心价值是继承外层 `this`，不适合做对象方法和构造器。

### <span class="lv lv-1">初级</span> 数组常用方法

```js
const arr = [3, 1, 4, 1, 5];

// 增删
arr.push(9);          // 末尾加 → [3,1,4,1,5,9]
arr.pop();            // 末尾删 → [3,1,4,1,5]
arr.unshift(0);       // 头部加 → [0,3,1,4,1,5]
arr.shift();          // 头部删 → [3,1,4,1,5]

// 切片 & 拼接
arr.slice(1, 3);      // [1,4]（不修改原数组）
arr.splice(1, 1, 9);  // 从索引1删1个，插入9（修改原数组）

// 合并 & 转字符串
[1,2].concat([3,4]);  // [1,2,3,4]
[1,2,3].join('-');    // "1-2-3"

// 遍历
arr.forEach((v, i) => console.log(i, v));

// 变换
arr.map(v => v * 2);        // [6,2,8,2,10]
arr.filter(v => v > 2);     // [3,4,5]
arr.reduce((s, v) => s + v, 0); // 14
arr.find(v => v > 3);       // 4
arr.findIndex(v => v > 3);  // 2

// 判断
arr.some(v => v > 4);       // true
arr.every(v => v > 0);      // true
arr.includes(4);            // true

// 排序（注意：默认按 Unicode 排序！）
[10, 2, 1].sort();                    // [1,10,2] ← 错误
[10, 2, 1].sort((a, b) => a - b);    // [1,2,10] ← 正确
```

🎯 `sort()` 默认按字符串排序，数字排序务必传比较函数。

### <span class="lv lv-1">初级</span> 字符串常用方法

```js
const s = 'Hello, World!';

s.length;                  // 13
s[0];                      // "H"
s.charAt(1);               // "e"
s.includes('World');       // true
s.startsWith('Hello');     // true
s.endsWith('!');           // true
s.indexOf('o');            // 4
s.lastIndexOf('o');        // 8

s.slice(0, 5);             // "Hello"
s.substring(7, 12);        // "World"
s.toUpperCase();            // "HELLO, WORLD!"
s.toLowerCase();            // "hello, world!"
s.trim();                   // 去首尾空白
s.trimStart();              // 去前空白
s.padStart(5, '0');        // 左填充
s.repeat(3);                // 重复3次
s.replace('World', 'JS');   // "Hello, JS!"
s.replaceAll('l', 'L');     // "HeLLo, WorLd!"

// 模板字符串
const name = 'Alice';
`Hi, ${name}!`;             // "Hi, Alice!"
```

💡 `slice` 支持负索引，`substring` 不支持；模板字符串是反引号字符串拼接的最佳实践。

### <span class="lv lv-1">初级</span> 对象基础

```js
// 字面量 & 简写
const x = 1, y = 2;
const point = { x, y };          // { x: 1, y: 2 }

// 计算属性名
const key = 'name';
const user = { [key]: 'Bob' };   // { name: 'Bob' }

// 解构赋值
const { x: a, y: b } = point;   // a=1, b=2
const { x: px = 0 } = {};       // px=0（默认值）

// 扩展运算符
const merged = { ...point, z: 3 }; // { x:1, y:2, z:3 }

// Object 静态方法
const obj = { a: 1, b: 2, c: 3 };
Object.keys(obj);     // ['a','b','c']
Object.values(obj);   // [1,2,3]
Object.entries(obj);  // [['a',1],['b',2],['c',3]]

// Object.fromEntries（ES2019）
Object.fromEntries([['a',1],['b',2]]); // { a:1, b:2 }

// Object.assign（浅合并）
const target = {};
Object.assign(target, { a: 1 }, { b: 2 }); // { a:1, b:2 }
```

🎯 `Object.entries()` + `Object.fromEntries()` 组合可方便地对对象做 map 变换。

### <span class="lv lv-1">初级</span> DOM 入门

```js
// 查找元素
document.getElementById('app');
document.querySelector('.item');        // 第一个匹配
document.querySelectorAll('li');        // NodeList

// 事件监听
const btn = document.querySelector('#btn');
btn.addEventListener('click', (e) => {
  console.log('clicked', e.target);
});

// classList 操作
const el = document.querySelector('#box');
el.classList.add('active');
el.classList.remove('hidden');
el.classList.toggle('open');
el.classList.contains('active'); // true

// 属性与内容
el.textContent = '新内容';
el.innerHTML = '<b>粗体</b>';
el.setAttribute('data-id', '42');
el.getAttribute('data-id');  // "42"

// 创建 & 插入
const div = document.createElement('div');
div.className = 'card';
document.body.appendChild(div);
```

💡 优先使用 `textContent` 而非 `innerHTML`，避免 XSS 风险。

### <span class="lv lv-1">初级</span> BOM 常用

```js
// window
window.innerWidth;            // 视口宽度
window.alert('提示');         // 弹窗（调试用）

// location
location.href;                // 完整 URL
location.hostname;            // 主机名
location.search;              // 查询字符串
location.reload();            // 刷新
location.assign('/other');    // 导航

// history
history.back();               // 后退
history.forward();            // 前进
history.pushState({}, '', '/new-url');

// navigator
navigator.userAgent;          // UA 字符串
navigator.language;           // "zh-CN"
navigator.clipboard.writeText('hello'); // 剪贴板

// 定时器
const id = setTimeout(() => console.log('1秒后'), 1000);
clearTimeout(id);

let count = 0;
const interval = setInterval(() => {
  if (++count >= 3) clearInterval(interval);
}, 1000);
```

🎯 定时器不保证精确延时，只在主线程空闲时执行回调。

### <span class="lv lv-1">初级</span> JSON

```js
const obj = { name: 'Alice', age: 25, skills: ['JS', 'TS'] };

// 序列化
const json = JSON.stringify(obj);
// '{"name":"Alice","age":25,"skills":["JS","TS"]}'

// 格式化输出
JSON.stringify(obj, null, 2);

// 过滤 + 替换
JSON.stringify(obj, ['name', 'age']); // 只保留 name 和 age

// 反序列化
const parsed = JSON.parse(json);

// 注意：不支持 undefined / 函数 / Symbol / 循环引用
JSON.stringify({ fn: () => {} }); // '{}'
```

💡 `JSON.stringify` 会自动忽略 `undefined`、函数和 Symbol 键值，深拷贝时需注意。

---

## 二、🟡 中级进阶

### <span class="lv lv-2">中级</span> 执行上下文 & 作用域链 & this

执行上下文分为：全局上下文、函数上下文、eval 上下文。调用函数时创建新上下文并压入调用栈。

```
┌─────────────────────┐
│   全局执行上下文      │  ← 栈底
├─────────────────────┤
│   函数 A 上下文       │
├─────────────────────┤
│   函数 B 上下文       │  ← 栈顶（当前执行）
└─────────────────────┘
```

作用域链：内部函数可访问外部变量，逐层向外查找直到全局。

**this 五种绑定**：

| 绑定规则 | 示例 | this 指向 |
|----------|------|-----------|
| 默认绑定 | `fn()` | 全局 / undefined（严格模式） |
| 隐式绑定 | `obj.fn()` | obj |
| 显式绑定 | `fn.call(obj)` | obj |
| new 绑定 | `new Fn()` | 新创建的实例 |
| 箭头函数 | `() => this` | 词法作用域继承 |

```js
const obj = {
  name: 'Alice',
  greet() { console.log(this.name); },
  greetArrow: () => console.log(this.name)
};
obj.greet();       // "Alice"（隐式绑定）
obj.greetArrow();  // undefined（箭头继承全局 this）
```

🎯 判断 this：看调用位置，new > 显式 > 隐式 > 默认。

### <span class="lv lv-2">中级</span> 闭包

闭包 = 函数 + 其词法环境的组合，使内部函数可以访问外部函数的变量。

```js
function createCounter() {
  let count = 0;             // 自由变量
  return {
    increment: () => ++count,
    getCount: () => count
  };
}

const counter = createCounter();
counter.increment();  // 1
counter.increment();  // 2
counter.getCount();   // 2
// count 无法直接访问，只能通过闭包方法操作
```

**经典问题 — 循环中的闭包**：

```js
// 错误：var 共享同一个变量
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3 3 3
}

// 正确 1：let 块级作用域
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0 1 2
}

// 正确 2：IIFE 创建独立作用域
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 0))(i);
}
```

💡 闭包让变量长期驻留内存，不再需要时置 null 帮助 GC 回收。

### <span class="lv lv-2">中级</span> 原型 & 原型链

```
实例对象 ──.__proto__──▶ 构造函数.prototype ──.__proto__──▶ Object.prototype ──.__proto__──▶ null
```

```js
function Person(name) { this.name = name; }
Person.prototype.sayHi = function() { return `Hi, ${this.name}`; };

const p = new Person('Alice');

p.sayHi();                     // "Hi, Alice"
p.__proto__ === Person.prototype;  // true
Person.prototype.__proto__ === Object.prototype; // true
Object.prototype.__proto__ === null;             // true

// Object.create — 以指定原型创建对象
const proto = { greet() { return 'hello'; } };
const child = Object.create(proto);
child.greet();                  // "hello"

// instanceof — 检查原型链
p instanceof Person;            // true
p instanceof Object;            // true
```

| 概念 | 说明 |
|------|------|
| `__proto__` | 实例指向其原型的指针（非标准，推荐用 `Object.getPrototypeOf()`） |
| `prototype` | 构造函数的属性，指向原型对象 |
| `Object.create(proto)` | 创建以 proto 为原型的新对象 |
| `instanceof` | 检查构造函数的 prototype 是否在实例原型链上 |

🎯 属性查找沿原型链向上直到 `null`，这就是 JavaScript 继承的底层机制。

### <span class="lv lv-2">中级</span> 继承 & class

```js
// ES6 class 语法（语法糖）
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a sound.`;
  }
  // 静态方法
  static create(name) {
    return new Animal(name);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);           // 必须在 this 之前调用
    this.breed = breed;
  }
  speak() {
    return `${this.name} barks.`;  // 方法重写
  }
}

const d = new Dog('Rex', 'Shepherd');
d.speak();               // "Rex barks."
d instanceof Dog;        // true
d instanceof Animal;     // true
```

**ES5 组合继承（理解原理）**：

```js
function Animal5(name) { this.name = name; }
Animal5.prototype.speak = function() { return this.name; };
function Dog5(name, breed) {
  Animal5.call(this, name);    // 借用构造函数（实例属性）
  this.breed = breed;
}
Dog5.prototype = Object.create(Animal5.prototype); // 原型链（共享方法）
Dog5.prototype.constructor = Dog5;
```

💡 `class` 本质是原型继承的语法糖，`extends` 内部通过 `Object.create` 连接原型链。

### <span class="lv lv-2">中级</span> Map / Set / WeakMap / WeakSet

```js
// Map — 键可以是任意值，保持插入顺序
const m = new Map();
m.set('a', 1).set(42, 'num').set({ k: 'v' }, 'obj');
m.get('a');              // 1
m.has(42);               // true
m.size;                  // 3
m.delete('a');
for (const [k, v] of m) console.log(k, v);

// Set — 唯一值集合
const s = new Set([1, 2, 2, 3]);
s.add(4);
s.has(2);                // true
s.size;                  // 4（去重）
[...s];                  // [1,2,3,4]

// WeakMap — 键必须是对象，不阻止 GC
const wm = new WeakMap();
let obj = {};
wm.set(obj, 'metadata');
obj = null; // 原对象可被回收，wm 中条目自动消失

// WeakSet — 同理，值必须是对象
const ws = new WeakSet();
```

| 特性 | Map | WeakMap |
|------|-----|---------|
| 键类型 | 任意 | 仅对象 |
| 可遍历 | 是 | 否 |
| GC 友好 | 否 | 是 |
| 用途 | 缓存/映射 | 私有数据/元信息 |

🎯 `WeakMap` 常用于存储与对象关联的私有数据，对象被回收时自动清理。

### <span class="lv lv-2">中级</span> Symbol

```js
// 唯一标识符
const s1 = Symbol('id');
const s2 = Symbol('id');
s1 === s2;                // false（每次唯一）

// 作为对象键（不会被常规方法枚举）
const key = Symbol('secret');
const obj = { [key]: 'hidden', name: 'Alice' };
Object.keys(obj);         // ['name']
Object.getOwnPropertySymbols(obj); // [Symbol(secret)]

// 全局 Symbol 注册表
const g1 = Symbol.for('app.id');
const g2 = Symbol.for('app.id');
g1 === g2;                // true

// Well-known Symbols
const iterable = {
  [Symbol.iterator]() {
    let i = 0;
    return { next: () => ({ value: i++, done: i > 3 }) };
  }
};
[...iterable];            // [0, 1, 2]
```

💡 Symbol 的核心价值是创建不冲突的对象键和自定义语言行为（Well-known Symbols）。

### <span class="lv lv-2">中级</span> Iterator / Generator

```js
// 可迭代协议：实现 [Symbol.iterator]() 返回迭代器
// 迭代器协议：实现 next() 返回 { value, done }

// Generator 函数
function* range(start, end) {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

const gen = range(1, 4);
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
gen.next(); // { value: undefined, done: true }

// for...of 消费
for (const n of range(0, 3)) console.log(n); // 0 1 2

// yield* 委托
function* concat(...gens) {
  for (const g of gens) yield* g;
}

// Generator 实现异步流程（早期模式，现多用 async/await）
function* fetchData() {
  const user = yield fetch('/api/user');
  const posts = yield fetch(`/api/posts?uid=${user.id}`);
  return posts;
}
```

🎯 Generator 是惰性求值的核心机制，也是 `async/await` 的底层原理之一。

### <span class="lv lv-2">中级</span> Promise

三态：pending → fulfilled / rejected

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve('done'), 1000);
});

// 链式调用
p.then(val => val.toUpperCase())
 .then(val => console.log(val))   // "DONE"
 .catch(err => console.error(err))
 .finally(() => console.log('完成'));

// 并发方法
const p1 = fetch('/api/1');
const p2 = fetch('/api/2');

Promise.all([p1, p2])             // 全部成功才成功
Promise.race([p1, p2])            // 最快一个决定结果
Promise.allSettled([p1, p2])      // 等全部完成，不短路
Promise.any([p1, p2])             // 第一个成功（ES2021）
```

| 方法 | 成功条件 | 失败条件 |
|------|----------|----------|
| `all` | 全部 fulfilled | 任一 rejected |
| `race` | 第一个 settled | 第一个 rejected |
| `allSettled` | 永远 fulfilled | 不会 rejected |
| `any` | 第一个 fulfilled | 全部 rejected |

💡 `Promise.all` 适合"全部要成功"，`Promise.allSettled` 适合"全部要结果"。

### <span class="lv lv-2">中级</span> async / await

```js
async function loadUser(id) {
  try {
    const res = await fetch(`/api/user/${id}`);
    if (!res.ok) throw new Error(res.statusText);
    const user = await res.json();
    return user;
  } catch (err) {
    console.error('加载失败:', err);
    throw err;
  }
}

// 串行执行
async function serial() {
  const a = await step1();
  const b = await step2(a);
  return b;
}

// 并行执行
async function parallel() {
  const [a, b] = await Promise.all([step1(), step2()]);
  return { a, b };
}

// 循环中的串行
async function processList(ids) {
  for (const id of ids) {
    await process(id);     // 一个接一个
  }
}
```

🎯 `await` 在循环中是串行的，并行请用 `Promise.all`。

### <span class="lv lv-2">中级</span> 事件循环

```
┌──────────────────────────────┐
│         调用栈 (Call Stack)   │
├──────────────────────────────┤
│  微任务队列 (Microtask)       │ ← Promise.then / MutationObserver
├──────────────────────────────┤
│  宏任务队列 (Macrotask)       │ ← setTimeout / setInterval / I/O
└──────────────────────────────┘

执行顺序：清空调用栈 → 清空微任务 → 取一个宏任务 → 清空微任务 → ...
```

**经典输出题**：

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => {
  console.log('3');
  Promise.resolve().then(() => console.log('4'));
});
console.log('5');
// 输出：1 5 3 4 2
```

解析：同步 → 微任务 → 宏任务；微任务中产生的微任务在当前轮次清空。

💡 微任务优先级高于宏任务，`Promise.then` 回调比 `setTimeout(fn, 0)` 先执行。

### <span class="lv lv-2">中级</span> 事件模型

```
捕获阶段 → 目标阶段 → 冒泡阶段
  Window      target       Window
    ↓           |            ↑
  document     |         document
    ↓           |            ↑
   body        |           body
    ↓           |            ↑
  target  ←  target  →  target
```

```js
// 冒泡（默认）
element.addEventListener('click', handler);

// 捕获
element.addEventListener('click', handler, { capture: true });

// 停止传播
element.addEventListener('click', (e) => {
  e.stopPropagation();  // 不再向上/下传播
  e.preventDefault();   // 阻止默认行为
});

// 事件委托 — 利用冒泡在父元素监听
document.querySelector('ul').addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    console.log('点击了:', e.target.textContent);
  }
});

// passive — 声明不调用 preventDefault，优化滚动性能
element.addEventListener('touchstart', handler, { passive: true });

// AbortController — 取消事件监听
const controller = new AbortController();
element.addEventListener('click', handler, { signal: controller.signal });
controller.abort(); // 移除监听
```

🎯 事件委托利用冒泡在父元素统一处理，减少监听器数量，动态元素自动生效。

### <span class="lv lv-2">中级</span> 深拷贝 vs 浅拷贝

```js
// 浅拷贝 — 只复制一层
const a = { x: 1, nested: { y: 2 } };
const b = { ...a };
b.nested.y = 99;
a.nested.y;  // 99 ← 嵌套对象仍共享引用

// Object.assign 也是浅拷贝
const c = Object.assign({}, a);

// 深拷贝方法 1：structuredClone（ES2022，推荐）
const d = structuredClone(a);
d.nested.y = 0;
a.nested.y;  // 99 ← 不影响

// 深拷贝方法 2：JSON 序列化（有限制）
const e = JSON.parse(JSON.stringify(a));
// 不支持：undefined / 函数 / Symbol / 循环引用 / Date / RegExp / Map / Set

// 深拷贝方法 3：递归实现（简化版）
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (map.has(obj)) return map.get(obj);
  const clone = Array.isArray(obj) ? [] : {};
  map.set(obj, clone);
  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key], map);
  }
  return clone;
}
```

🎯 `structuredClone` 是浏览器原生深拷贝 API，支持循环引用和大多数内置类型。

### <span class="lv lv-2">中级</span> 防抖 & 节流

```js
// 防抖 — 最后一次调用后延迟执行
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 使用
const onSearch = debounce((q) => fetch(`/api?q=${q}`), 300);
input.addEventListener('input', (e) => onSearch(e.target.value));

// 节流 — 固定时间间隔执行
function throttle(fn, interval) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// 使用
const onScroll = throttle(() => console.log('scroll'), 100);
window.addEventListener('scroll', onScroll);
```

| 手法 | 效果 | 场景 |
|------|------|------|
| 防抖 | 停止触发后才执行 | 搜索框输入、窗口 resize |
| 节流 | 按固定频率执行 | 滚动事件、拖拽移动 |

💡 防抖 = "等用户停了再做"，节流 = "别太频繁，匀速做"。

### <span class="lv lv-2">中级</span> 模块化

```js
// IIFE — 早期模块模式
const Module = (function() {
  let private = 0;
  return {
    increment() { return ++private; },
    getCount() { return private; }
  };
})();

// CommonJS (Node.js)
// math.js
module.exports = { add: (a, b) => a + b };
// app.js
const { add } = require('./math');

// ES Modules（现代标准）
// math.mjs
export const add = (a, b) => a + b;
export default function calc() { /* ... */ }
// app.mjs
import calc, { add } from './math.mjs';
```

| 规范 | 加载方式 | 值类型 | this | 适用 |
|------|----------|--------|------|------|
| IIFE | 立即执行 | 引用 | window | 旧浏览器 |
| CJS | 同步运行时 | 值拷贝 | module | Node.js |
| ESM | 异步编译时 | 实时绑定 | undefined | 浏览器 + Node |

🎯 ESM 是官方标准，`import/export` 静态分析支持 Tree Shaking，新项目优先使用。

### <span class="lv lv-2">中级</span> 错误处理

```js
// try / catch / finally
try {
  JSON.parse('invalid');
} catch (err) {
  console.error(err.message);  // "Unexpected token..."
} finally {
  console.log('总是执行');      // 无论是否出错
}

// 自定义错误
class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'AppError';
    this.code = code;
  }
}

throw new AppError('资源未找到', 404);

// Promise 错误
fetch('/api')
  .then(res => res.json())
  .catch(err => console.error('请求失败:', err));

// async/await 错误
async function safeFetch(url) {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    console.log('请求结束');
  }
}

// 全局错误兜底
window.addEventListener('unhandledrejection', (e) => {
  console.error('未处理的 Promise 拒绝:', e.reason);
});
```

💡 `finally` 无论是否抛错都会执行，适合清理资源；全局错误监听是最后一道防线。

---

## 三、🔴 高级实战

### <span class="lv lv-3">高级</span> V8 引擎

V8 执行管线：源码 → 解析 → 字节码(Ignition) → 热点优化(TurboFan) → 机器码

```
  JavaScript 源码
       │
       ▼
  Parser（解析 → AST）
       │
       ▼
  Ignition（解释执行字节码 + 收集类型反馈）
       │  热点函数被反复调用
       ▼
  TurboFan（优化编译 → 机器码）
       │  类型反馈失效
       ▼
  Deoptimization（去优化 → 回到字节码）
```

**隐藏类（Hidden Class）**：V8 为对象创建隐藏类以提高属性访问速度。

```js
// 同样形状的对象共享隐藏类 → 快
function Point(x, y) { this.x = x; this.y = y; }
new Point(1, 2);  // 隐藏类 C0 → C1(x) → C2(x,y)

// 动态添加属性 → 隐藏类分叉 → 慢
const a = { x: 1 }; a.y = 2;  // 分叉
const b = { x: 1, y: 2 };     // 直线
```

**GC 分代回收**：

| 代 | 对象 | 算法 | 频率 |
|----|------|------|------|
| 新生代 | 短命对象 | Scavenge（半空间复制） | 高 |
| 老生代 | 长命对象 | Mark-Sweep + Mark-Compact | 低 |

💡 保持对象形状一致、避免动态增删属性，可帮助 V8 优化隐藏类和内联缓存。

### <span class="lv lv-3">高级</span> 内存泄漏

5 大常见来源：

| # | 类型 | 示例 |
|---|------|------|
| 1 | 意外全局变量 | `function fn() { leaked = 'x'; }` |
| 2 | 忘记清除定时器 | `setInterval(fn, 1000)` 未 clearInterval |
| 3 | 闭包引用 | 闭包持有大对象，无法释放 |
| 4 | 脱离 DOM 的引用 | 变量引用已移除的 DOM 节点 |
| 5 | 事件监听未移除 | addEventListener 后未 removeEventListener |

**DevTools 排查流程**：

```
1. 打开 DevTools → Memory 面板
2. 拍摄堆快照（Heap Snapshot）
3. 执行可疑操作
4. 再次拍摄快照
5. 对比两次快照，筛选 Delta 列为正的对象
6. 查看 Retainers（保持者）确认引用链
```

```js
// 修复示例：用 WeakMap 替代 Map 避免闭包泄漏
const listeners = new WeakMap(); // 键是 DOM 元素，元素移除后自动清理

// 修复示例：AbortController 统一清理
const ac = new AbortController();
document.addEventListener('click', handler, { signal: ac.signal });
// 清理时
ac.abort(); // 一次性移除所有相关监听
```

🎯 `WeakMap` + `AbortController` 是现代 JS 中预防内存泄漏的两大利器。

### <span class="lv lv-3">高级</span> 手写 Promise

```js
class MyPromise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  constructor(executor) {
    this.state = MyPromise.PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state !== MyPromise.PENDING) return;
      this.state = MyPromise.FULFILLED;
      this.value = value;
      this.onFulfilledCallbacks.forEach(fn => fn());
    };

    const reject = (reason) => {
      if (this.state !== MyPromise.PENDING) return;
      this.state = MyPromise.REJECTED;
      this.reason = reason;
      this.onRejectedCallbacks.forEach(fn => fn());
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e; };

    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledTask = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (err) { reject(err); }
        });
      };

      const rejectedTask = () => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (err) { reject(err); }
        });
      };

      if (this.state === MyPromise.FULFILLED) fulfilledTask();
      else if (this.state === MyPromise.REJECTED) rejectedTask();
      else {
        this.onFulfilledCallbacks.push(fulfilledTask);
        this.onRejectedCallbacks.push(rejectedTask);
      }
    });
    return promise2;
  }

  resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) return reject(new TypeError('Chaining cycle'));
    if (x instanceof MyPromise) {
      x.then(resolve, reject);
    } else {
      resolve(x);
    }
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  static resolve(value) {
    return new MyPromise(resolve => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }
}
```

💡 状态不可逆 + `queueMicrotask` 异步调度 + then 返回新 Promise = Promise 三大核心机制。

### <span class="lv lv-3">高级</span> Proxy & Reflect

Proxy 可拦截 13 种操作：

```js
const handler = {
  get(target, key, receiver) {
    console.log(`读取: ${String(key)}`);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log(`设置: ${String(key)} = ${value}`);
    return Reflect.set(target, key, value, receiver);
  },
  has(target, key) {
    return Reflect.has(target, key);
  },
  deleteProperty(target, key) {
    return Reflect.deleteProperty(target, key);
  }
  // 还有: apply / construct / ownKeys / getOwnPropertyDescriptor ...
};

const proxy = new Proxy({ name: 'Alice', age: 25 }, handler);
proxy.name;       // 读取: name → "Alice"
proxy.age = 26;   // 设置: age = 26
```

**Vue 3 简化响应式原理**：

```js
function reactive(target) {
  return new Proxy(target, {
    get(obj, key, receiver) {
      track(obj, key);          // 收集依赖
      return Reflect.get(obj, key, receiver);
    },
    set(obj, key, val, receiver) {
      const result = Reflect.set(obj, key, val, receiver);
      trigger(obj, key);        // 触发更新
      return result;
    }
  });
}
```

🎯 Proxy + Reflect 是 Vue 3 响应式的基石，Reflect 确保操作行为与原生一致。

### <span class="lv lv-3">高级</span> 元编程

```js
// Symbol.toPrimitive — 自定义类型转换
const wallet = {
  balance: 100,
  [Symbol.toPrimitive](hint) {
    if (hint === 'string') return `$${this.balance}`;
    if (hint === 'number') return this.balance;
    return this.balance;
  }
};
console.log(String(wallet));  // "$100"
console.log(wallet + 50);     // 150

// Symbol.iterator — 让任意对象可迭代
const range2 = {
  from: 1, to: 5,
  [Symbol.iterator]() {
    let cur = this.from, last = this.to;
    return { next() { return { value: cur, done: cur++ > last }; } };
  }
};
[...range2]; // [1,2,3,4,5]

// Reflect 应用
const obj = { x: 1 };
Reflect.has(obj, 'x');       // 等价 'x' in obj
Reflect.ownKeys(obj);        // 含 Symbol 的全部键
Reflect.getPrototypeOf(obj); // 等价 Object.getPrototypeOf

// toStringTag — 自定义 Object.prototype.toString 输出
class Query {
  get [Symbol.toStringTag]() { return 'Query'; }
}
Object.prototype.toString.call(new Query()); // "[object Query]"
```

💡 元编程让你自定义语言层面的行为，框架开发中大量使用。

### <span class="lv lv-3">高级</span> 函数式编程

```js
// curry — 柯里化
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...more) => curried.apply(this, args.concat(more));
  };
}
const add = curry((a, b, c) => a + b + c);
add(1)(2)(3);   // 6
add(1, 2)(3);   // 6

// compose — 从右到左组合
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

// pipe — 从左到右组合
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const double = x => x * 2;
const inc = x => x + 1;
compose(double, inc)(3);   // 8  (3→4→8)
pipe(double, inc)(3);      // 7  (3→6→7)

// memoize — 记忆化
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const fib = memoize(function(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});
fib(40); // 秒出结果（缓存中间值）
```

🎯 `curry` 偏应用、`compose/pipe` 函数组合、`memoize` 用空间换时间 — 函数式三件套。

### <span class="lv lv-3">高级</span> 手写系列

```js
// new
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return result instanceof Object ? result : obj;
}

// instanceof
function myInstanceof(instance, Constructor) {
  let proto = Object.getPrototypeOf(instance);
  while (proto) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

// Object.create
function myCreate(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}

// call
Function.prototype.myCall = function(context, ...args) {
  context = context ?? window;
  const key = Symbol();
  context[key] = this;
  const result = context[key](...args);
  delete context[key];
  return result;
};

// apply
Function.prototype.myApply = function(context, args) {
  context = context ?? window;
  const key = Symbol();
  context[key] = this;
  const result = context[key](...args);
  delete context[key];
  return result;
};

// bind
Function.prototype.myBind = function(context, ...bindArgs) {
  const fn = this;
  const bound = function(...callArgs) {
    return fn.apply(this instanceof bound ? this : context,
      bindArgs.concat(callArgs));
  };
  bound.prototype = Object.create(fn.prototype);
  return bound;
};

// Promise.all
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let count = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        results[i] = val;
        if (++count === promises.length) resolve(results);
      }).catch(reject);
    });
  });
};

// EventEmitter
class EventEmitter {
  constructor() { this.events = {}; }
  on(event, fn) {
    (this.events[event] ??= []).push(fn);
    return this;
  }
  emit(event, ...args) {
    (this.events[event] || []).forEach(fn => fn(...args));
    return this;
  }
  off(event, fn) {
    this.events[event] = (this.events[event] || []).filter(f => f !== fn);
    return this;
  }
  once(event, fn) {
    const wrapper = (...args) => { fn(...args); this.off(event, wrapper); };
    this.on(event, wrapper);
    return this;
  }
}
```

💡 面试手写题的核心是理解原理：`new` = 创建对象 + 绑定原型 + 执行构造函数 + 返回。

### <span class="lv lv-3">高级</span> Web APIs

```js
// MutationObserver — 监听 DOM 变化
const mo = new MutationObserver((mutations) => {
  mutations.forEach(m => console.log(m.type, m.target));
});
mo.observe(document.body, { childList: true, subtree: true, attributes: true });
// mo.disconnect(); // 停止监听

// IntersectionObserver — 监听元素可见性（懒加载/无限滚动）
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      console.log('进入视口:', e.target);
      io.unobserve(e.target); // 停止观察
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.lazy-img').forEach(el => io.observe(el));

// ResizeObserver — 监听元素尺寸变化
const ro = new ResizeObserver((entries) => {
  entries.forEach(e => console.log(e.contentRect));
});
ro.observe(document.querySelector('#box'));

// requestIdleCallback — 在浏览器空闲时执行
requestIdleCallback((deadline) => {
  while (deadline.timeRemaining() > 0 && tasks.length) {
    tasks.pop()();
  }
  if (tasks.length) requestIdleCallback(processTasks);
});
```

🎯 四大 Observer 是现代 Web 高性能开发的基石，避免手动轮询和频繁布局计算。

### <span class="lv lv-3">高级</span> Web Workers

```js
// main.js — 主线程
const worker = new Worker('worker.js');
worker.postMessage({ action: 'compute', data: [1, 2, 3] });
worker.onmessage = (e) => console.log('结果:', e.data);
worker.onerror = (e) => console.error('Worker 错误:', e.message);

// worker.js — 工作线程
self.onmessage = (e) => {
  const { action, data } = e.data;
  if (action === 'compute') {
    const result = data.reduce((s, v) => s + v, 0);
    self.postMessage(result);
  }
};
// 注意：Worker 中无法访问 DOM
```

**SharedArrayBuffer + Atomics**（多线程共享内存）：

```js
// 主线程
const sab = new SharedArrayBuffer(4);
const view = new Int32Array(sab);
view[0] = 0;
worker.postMessage(sab);

// Worker 线程
self.onmessage = (e) => {
  const view = new Int32Array(e.data);
  Atomics.add(view, 0, 1);  // 原子操作，线程安全
  Atomics.notify(view, 0);  // 唤醒等待的线程
};
```

💡 Worker 是真正并行，`SharedArrayBuffer` 实现零拷贝共享内存（需 COOP/COEP 头）。

### <span class="lv lv-3">高级</span> 动态 import

```js
// 动态 import() — 运行时按需加载模块
async function loadEditor() {
  const { Editor } = await import('./editor.mjs');
  return new Editor('#container');
}

// 条件加载
if (featureFlags.newUI) {
  import('./new-ui.mjs');
} else {
  import('./legacy-ui.mjs');
}

// import.meta — 模块元信息
// import.meta.url：当前模块的 URL
// import.meta.env（Vite）：构建环境变量

// Import Maps — 浏览器原生模块别名
```
```html
<script type="importmap">
{
  "imports": {
    "lodash": "https://cdn.jsdelivr.net/npm/lodash@4/es/lodash.js"
  }
}
</script>
<script type="module">
  import { debounce } from 'lodash';
</script>
```

🎯 动态 `import()` 是代码分割和懒加载的核心，配合路由实现首屏加速。

### <span class="lv lv-3">高级</span> ES2020+ 亮点

| 版本 | 特性 | 说明 |
|------|------|------|
| ES2020 | `??` | 空值合并运算符 |
| ES2020 | `?.` | 可选链 |
| ES2020 | `BigInt` | 任意精度整数 |
| ES2020 | `globalThis` | 统一全局对象引用 |
| ES2020 | `Promise.allSettled` | 等全部完成 |
| ES2021 | `\|\|=` / `??=` / `&&=` | 逻辑赋值 |
| ES2021 | `WeakRef` + `FinalizationRegistry` | 弱引用 + 清理回调 |
| ES2021 | `String.prototype.replaceAll` | 替换所有匹配 |
| ES2021 | 数字分隔符 `1_000_000` | 提升数字可读性 |
| ES2022 | `at()` | `arr.at(-1)` 取末尾 |
| ES2022 | `Object.hasOwn` | 安全的 hasOwnProperty |
| ES2022 | `structuredClone` | 原生深拷贝 |
| ES2022 | 顶层 `await` | 模块顶层直接 await |
| ES2023 | `Array.fromAsync` | 从异步可迭代创建数组 |
| ES2023 | `findLast` / `findLastIndex` | 从后查找 |
| ES2023 | Hashbang 语法 | `#!/usr/bin/env node` |
| ES2024 | `Object.groupBy` / `Map.groupBy` | 分组 |
| ES2024 | `Promise.withResolvers` | 外部暴露 resolve/reject |
| ES2024 | `String.prototype.isWellFormed` | 检查孤位代理 |

```js
// Promise.withResolvers — 不再需要包裹一层 Promise
const { promise, resolve, reject } = Promise.withResolvers();
// 可在外部随时 resolve/reject，无需在构造函数内回调

// Object.groupBy
const grouped = Object.groupBy(
  [{ type: 'A', val: 1 }, { type: 'B', val: 2 }, { type: 'A', val: 3 }],
  ({ type }) => type
);
// { A: [{type:'A',val:1},{type:'A',val:3}], B: [{type:'B',val:2}] }
```

💡 每年一小步，持续关注新特性可显著提升代码表达力。

### <span class="lv lv-3">高级</span> 常见面试题

1. **`typeof null` 为什么是 `"object"`？** — JS 初版用低位标记类型，null 全零与 object 标记冲突。
2. **`0.1 + 0.2 !== 0.3` 怎么解决？** — IEEE 754 精度问题，用 `Math.abs(a - b) < Number.EPSILON` 判断。
3. **闭包内存怎么回收？** — 外部函数执行完后，若内部函数不再引用自由变量，闭包可被 GC。
4. **`==` 和 `===` 区别？** — `==` 做类型转换再比较，`===` 不转换直接比较。
5. **事件循环输出题？** — 同步 → 微任务(Promise) → 宏任务(setTimeout)，注意 async/await 语义。
6. **Promise 和 async/await 关系？** — async/await 是 Promise + Generator 的语法糖。
7. **如何实现继承？** — 原型链 + 借用构造函数 = 组合继承，ES6 class 是语法糖。
8. **`new` 做了什么？** — 创建对象 → 绑定 `__proto__` → 执行构造函数 → 返回对象。
9. **箭头函数与普通函数区别？** — 无 this/arguments/super/new.target，不能做构造器。
10. **`var`/`let`/`const` 区别？** — 作用域、提升、TDZ、重赋值。
11. **防抖节流区别？** — 防抖等停了再做，节流匀速做。
12. **Map 和 Object 区别？** — Map 键任意、有序、有 size；Object 键仅字符串/Symbol。
13. **WeakMap 用途？** — 关联对象元数据，对象被回收时自动清理。
14. **如何深拷贝？** — `structuredClone`（推荐）/ 递归 / JSON 序列化（有限制）。
15. **`Proxy` 和 `Object.defineProperty` 区别？** — Proxy 拦截更全面（13种）、可监听新增属性、数组变化。
16. **V8 如何优化代码？** — 隐藏类 + 内联缓存 + JIT 编译（Ignition → TurboFan）。
17. **内存泄漏怎么排查？** — DevTools Heap Snapshot 对比 + Retainers 分析引用链。

🎯 面试题不背答案，重在理解底层原理，能自圆其说即可。

---

## <span class="lv lv-3">高级</span> 附录 B：ES2024/ES2025 与运行时新特性深入

> 2024–2025 年是 JavaScript 语言与运行时集中放能的两年：ES2024 定稿了一批"工程级"小特性，ES2025 则把 **Iterator Helpers** 这颗酝酿多年的核弹推到了正式提案。与此同时，Node 22/24、V8 12+/13+ 也在把 Deno/浏览器擅长的能力搬进 Node。本附录按"能立刻上生产"的顺序，把这批新特性讲透。

💡 阅读建议：每小节都包含 **是什么 → 为什么 → 怎么用 → 坑在哪里** 四段式。所有代码在 Node 22.10+ / Chrome 130+ 上验证通过。

### B.1 Iterator Helpers（ES2025 已在 Chrome/Node 落地）

#### 是什么

ES2025 给 `Iterator` 原型加了一组和 `Array` 高度相似的方法：`map / filter / take / drop / flatMap / reduce / toArray / forEach / some / every / find`。区别是——**它们全部惰性求值**，处理无限流也不会 OOM。

```js
// Node 22+ / Chrome 122+
function* naturals() {
  let i = 1;
  while (true) yield i++;
}

// Array 版本：直接爆内存（数组根本装不下无限）
// [...naturals()].filter(n => n % 2).slice(0, 5); // ❌

// Iterator Helpers 版本：惰性，只算 5 个
const oddFive = naturals()
  .filter(n => n % 2 === 1)
  .take(5)
  .toArray();
console.log(oddFive); // [1, 3, 5, 7, 9]
```

#### 为什么重要

传统 `Array.prototype.map/filter` 每一步都生成中间数组：`arr.map(f).filter(g).slice(0, 10)` 会先跑完 `n` 次 `f`、再跑 `n` 次 `g`。当 `n = 1_000_000` 而你只要前 10 个，浪费 99.999%。Iterator Helpers 一次只推一个值，**天然融合 (fusion)**。

#### 全套 API 实战

```js
// 斐波那契 + take(10) + toArray()：经典无限流
function* fib() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const first10Fib = fib().take(10).toArray();
console.log(first10Fib); // [0,1,1,2,3,5,8,13,21,34]

// flatMap：读取多个文件流，逐行拼接
async function* readLines(paths) {
  for (const p of paths) {
    const fh = await fs.open(p);
    for await (const line of fh.readLines()) yield line;
    await fh.close();
  }
}

// drop + filter + map + reduce
const total = naturals()
  .drop(100)         // 跳过前 100
  .take(1000)        // 取 1000 个
  .filter(n => n % 3 === 0)
  .map(n => n * n)
  .reduce((a, b) => a + b, 0);
```

#### 与 Array 方法的性能对比

```js
// 数组式：耗内存、耗 CPU
const arr = Array.from({ length: 1e7 }, (_, i) => i);
console.time('array');
arr.map(x => x * 2).filter(x => x % 4 === 0).slice(0, 10);
console.timeEnd('array'); // ~200 ms

// Iterator 式
console.time('iter');
arr.values().map(x => x * 2).filter(x => x % 4 === 0).take(10).toArray();
console.timeEnd('iter'); // ~0.05 ms
```

💡 只要有"提前退出"或"无限流"，就选 Iterator Helpers；若数据本就在数组里且要全量处理，Array 方法可能因内联优化更快。

🎯 记住口诀：**能懒就懒，能停就停**。

### B.2 Temporal API（Date 后继者，Stage 3）

#### 为什么要替代 Date

`Date` 的历史包袱太重：**月份 0 开始、时区处理靠字符串、可变、"闰秒"没定义、加减日期靠算毫秒**。Temporal 从零设计，主打三件事：**不可变、类型分明、时区安全**。

#### 核心类型速览

| 类型 | 含义 | 示例 |
|---|---|---|
| `Temporal.Instant` | 绝对时刻（UTC 时间戳） | `2026-07-01T12:00:00Z` |
| `Temporal.ZonedDateTime` | 带时区的时刻 | 上海 2026-07-01 20:00 |
| `Temporal.PlainDateTime` | 无时区的日期+时间 | 2026-07-01 20:00 |
| `Temporal.PlainDate` | 只有日期 | 2026-07-01 |
| `Temporal.PlainTime` | 只有时间 | 20:00:00 |
| `Temporal.Duration` | 时长 | PT2H30M |

#### 跨时区会议示例

```js
// 需要 polyfill：npm i @js-temporal/polyfill
import { Temporal } from '@js-temporal/polyfill';

// 上海时间 2026-07-15 20:00 开会
const meeting = Temporal.ZonedDateTime.from({
  year: 2026, month: 7, day: 15, hour: 20,
  timeZone: 'Asia/Shanghai',
});

// 换算到旧金山
const sf = meeting.withTimeZone('America/Los_Angeles');
console.log(sf.toString()); // 2026-07-15T05:00:00-07:00[America/Los_Angeles]

// 换算到伦敦
const london = meeting.withTimeZone('Europe/London');
console.log(london.toString()); // 2026-07-15T13:00:00+01:00[Europe/London]
```

#### 日期加减（比 date-fns 更清爽）

```js
const today = Temporal.Now.plainDateISO();      // 2026-07-01
const nextFriday = today.add({ days: 4 });      // 2026-07-05
const tenBizDays = today.add({ days: 14 });     // 需手动跳过周末

// Duration 表达"三个月零两周"
const dur = Temporal.Duration.from({ months: 3, weeks: 2 });
const target = today.add(dur);                  // 2026-10-15
console.log(target.toString());

// 两个日期相差多少天
const born = Temporal.PlainDate.from('1990-05-01');
const age = born.until(today, { largestUnit: 'years' });
console.log(`${age.years} 岁 ${age.months} 个月`);
```

#### 格式化

```js
// 无需自定义 format 字符串，用标准 Intl
const zoned = Temporal.Now.zonedDateTimeISO('Asia/Shanghai');
const fmt = new Intl.DateTimeFormat('zh-CN', {
  dateStyle: 'full', timeStyle: 'long',
});
console.log(fmt.format(zoned.toInstant())); // 2026年7月1日星期三 GMT+8 12:34:56
```

#### 与 date-fns / dayjs 对比

| 维度 | date-fns | dayjs | Temporal |
|---|---|---|---|
| 不可变 | ✅ | ✅（默认） | ✅（强制） |
| 时区 | 需插件 | 需插件 | 内置一等公民 |
| Tree-shaking | ✅ | ✅ | 无需 |
| 未来性 | 无 | 无 | **原生 API** |
| 体积 | ~15KB+ | ~7KB+ | 0（原生） |

💡 目前 Node 尚未内置，暂用 polyfill；一旦 Stage 4 落地，可无缝迁移。

🎯 新项目直接用 Temporal + polyfill，别再新增 dayjs 依赖。

### B.3 Explicit Resource Management (`using` / `await using`)

#### 是什么

ES2026 提案（TS 5.2 已支持、Node 24 内置）为"必须成对释放的资源"提供了 **`using`** 关键字，类似 C# `using` / Python `with`。

```ts
// ts 5.2+ / Node 24+
import { open } from 'node:fs/promises';

{
  await using file = await open('log.txt', 'r');
  const data = await file.readFile();
  console.log(data.toString());
} // 离开作用域自动调用 file[Symbol.asyncDispose]()
```

#### 两大协议

```ts
// 同步资源：实现 Symbol.dispose
class Lock {
  acquire() { console.log('lock'); }
  [Symbol.dispose]() { console.log('unlock'); }
}

{
  using l = new Lock();
  l.acquire();
} // 自动 unlock，即使抛错

// 异步资源：实现 Symbol.asyncDispose
class DBConn {
  async connect() { /* ... */ }
  async [Symbol.asyncDispose]() { await this.close(); }
  async close() { /* ... */ }
}

{
  await using db = new DBConn();
  await db.connect();
  // 抛错也不怕，退出时一定 close
}
```

#### DisposableStack：批量管理

```ts
function pipeline() {
  using stack = new DisposableStack();
  const a = stack.use(openResourceA());
  const b = stack.use(openResourceB());
  const c = stack.use(openResourceC());
  // 出错时反向释放 c → b → a
  doWork(a, b, c);
}
```

#### 数据库事务示例

```ts
class Transaction {
  private done = false;
  constructor(private conn: DBConn) {}
  static async begin(conn: DBConn) {
    await conn.query('BEGIN');
    return new Transaction(conn);
  }
  async commit() { await this.conn.query('COMMIT'); this.done = true; }
  async [Symbol.asyncDispose]() {
    if (!this.done) await this.conn.query('ROLLBACK');
  }
}

async function transferMoney(from: string, to: string, amount: number) {
  await using tx = await Transaction.begin(conn);
  await conn.query(`UPDATE accounts SET balance = balance - $1 WHERE id = $2`, [amount, from]);
  await conn.query(`UPDATE accounts SET balance = balance + $1 WHERE id = $2`, [amount, to]);
  await tx.commit();
  // 若中间抛错，tx 自动 ROLLBACK
}
```

💡 `using` 让"忘记关闭连接"成为历史；配合 TypeScript 类型系统能强制约束"必须 dispose"。

🎯 Node/Bun 服务端代码 2025 年后应逐步用 `using` 替换 `try/finally`。

### B.4 Records & Tuples 提案现状（Stage 2 停滞）

#### 提案想做什么

引入原生**深不可变**的原始值：`#{ a: 1 }`（Record）与 `#[1, 2, 3]`（Tuple）。它们按值比较、可作 Map key。

```js
// 提案语法（尚未落地）
const p1 = #{ x: 1, y: 2 };
const p2 = #{ x: 1, y: 2 };
console.log(p1 === p2); // true！按值比较

const t1 = #[1, 2, 3];
const map = new Map();
map.set(#[1, 2], 'a');
console.log(map.get(#[1, 2])); // 'a'
```

#### 为什么停滞

- V8 团队担忧内存去重成本；
- 与 `Object.is` / `===` 语义交互复杂；
- 与 TypeScript 类型系统对接方案未敲定。

#### 当下替代方案

```js
// 方案 1：Object.freeze
const record = Object.freeze({ x: 1, y: 2 });

// 方案 2：Immer（推荐做状态管理）
import { produce } from 'immer';
const next = produce(state, draft => { draft.count++; });

// 方案 3：Immutable.js（Facebook 出品，重）
import { Map as IMap } from 'immutable';
const m1 = IMap({ a: 1 });
const m2 = IMap({ a: 1 });
console.log(m1.equals(m2)); // true
```

#### "深不可变原始值"为何重要

- **可靠缓存 key**：`useMemo([user])` 若 `user` 是对象，引用一变就重算；若是 Record，值不变则命中。
- **并发安全**：多 Worker 传递值时无需序列化。
- **函数式思维**：类型系统能强制"绝不修改"。

💡 目前 (2026) 仍无原生方案，Redux Toolkit / Zustand 生态用 Immer 事实标准。

🎯 关注 TC39 议程；若一年内 Stage 3，值得为新项目预留迁移空间。

### B.5 Set 集合运算方法（Node 22+）

#### 一屏搞定七大操作

```js
// Node 22+ / Chrome 122+
const a = new Set([1, 2, 3, 4]);
const b = new Set([3, 4, 5, 6]);

a.intersection(b);        // {3, 4}
a.union(b);               // {1,2,3,4,5,6}
a.difference(b);          // {1, 2}
a.symmetricDifference(b); // {1,2,5,6}
a.isSubsetOf(new Set([1,2,3,4,5])); // true
a.isSupersetOf(new Set([1,2]));     // true
a.isDisjointFrom(new Set([9,10]));  // true
```

#### 权限交集实战

```js
// 判断用户是否拥有某接口所需的全部权限
const userPerms = new Set(['read:user', 'write:post', 'delete:comment']);
const requiredPerms = new Set(['read:user', 'write:post']);

if (requiredPerms.isSubsetOf(userPerms)) {
  handleRequest();
} else {
  const missing = requiredPerms.difference(userPerms);
  throw new Error(`缺少权限: ${[...missing].join(', ')}`);
}
```

#### 标签合并实战

```js
// 合并多篇文章的标签，找出共同标签
const posts = [
  { tags: new Set(['js', 'ts', 'node']) },
  { tags: new Set(['ts', 'react']) },
  { tags: new Set(['ts', 'node', 'perf']) },
];

const common = posts.reduce((acc, p) => acc.intersection(p.tags));
console.log([...common]); // ['ts']

const all = posts.reduce((acc, p) => acc.union(p.tags), new Set());
console.log([...all]); // ['js','ts','node','react','perf']
```

💡 相比 lodash 的 `_.intersection`、`_.union`，原生 API **零依赖 + O(n) + 保留 Set 语义**。

🎯 遇到"过滤/去重/交并差"直接想 Set，别再往数组里塞。

### B.6 String.prototype.isWellFormed / toWellFormed（ES2024）

#### 背景：孤位代理

JS 字符串本质是 UTF-16 码元序列，可能出现**未成对的代理项**（lone surrogate），例如 `'\uD800'`。这类字符串在 `encodeURI` / `TextEncoder` / Node Buffer 里会抛错。

```js
const bad = 'hello\uD800world';
console.log(bad.isWellFormed()); // false
try { encodeURI(bad); } catch (e) { console.log(e.message); } // URI malformed
```

#### toWellFormed 修复

`toWellFormed()` 把每个孤位代理替换成 U+FFFD（替换字符 �）。

```js
const clean = bad.toWellFormed();
console.log(clean.isWellFormed()); // true
console.log(clean);                 // 'hello�world'
encodeURI(clean);                   // 'hello%EF%BF%BDworld'
```

#### 真实场景：用户昵称清洗

```js
function sanitizeNickname(raw) {
  // 1. 修复孤位代理，避免入库报错
  let s = raw.toWellFormed();
  // 2. 去掉零宽字符与常见控制符
  s = s.replace(/[​-‏‪-‮⁦-⁩]/g, '');
  // 3. 折叠空白
  s = s.replace(/\s+/g, ' ').trim();
  // 4. 长度截断（按码点，不按码元）
  const cps = [...s];
  if (cps.length > 20) s = cps.slice(0, 20).join('');
  return s;
}

sanitizeNickname('张三\uD800😀'); // '张三�😀'
```

💡 涉及"用户可控字符串 → 存储/网络传输"必须先 `toWellFormed()`，否则 5% 的怪异用户输入会打崩服务。

🎯 前端表单校验、后端接口入参统一走一次清洗，OSS/DB 报错量能降一个数量级。

### B.7 Array Grouping（Object.groupBy / Map.groupBy，ES2024）

#### 告别 reduce 手撕

以前分组要写：

```js
const bad = arr.reduce((acc, x) => {
  const k = x.type;
  (acc[k] ||= []).push(x);
  return acc;
}, {});
```

现在一行：

```js
Object.groupBy(arr, x => x.type);
```

#### 按分类分组订单

```js
const orders = [
  { id: 1, category: 'book',   price: 30 },
  { id: 2, category: 'food',   price: 15 },
  { id: 3, category: 'book',   price: 25 },
  { id: 4, category: 'gadget', price: 199 },
  { id: 5, category: 'food',   price: 20 },
];

const byCategory = Object.groupBy(orders, o => o.category);
/*
{
  book:   [{id:1,...}, {id:3,...}],
  food:   [{id:2,...}, {id:5,...}],
  gadget: [{id:4,...}]
}
*/

// 汇总每类销售额
const totals = Object.fromEntries(
  Object.entries(byCategory).map(([k, v]) => [k, v.reduce((a, o) => a + o.price, 0)])
);
console.log(totals); // { book:55, food:35, gadget:199 }
```

#### 按日期分组日志（Map 版本支持对象 key）

```js
const logs = [
  { time: new Date('2026-07-01T08:00'), msg: 'boot'  },
  { time: new Date('2026-07-01T14:30'), msg: 'req'   },
  { time: new Date('2026-07-02T09:00'), msg: 'error' },
];

const byDay = Map.groupBy(logs, l => {
  const d = l.time;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
});

for (const [day, items] of byDay) {
  console.log(day, items.length);
}
// 2026-07-01 2
// 2026-07-02 1
```

#### Object.groupBy vs Map.groupBy

| 维度 | Object.groupBy | Map.groupBy |
|---|---|---|
| key 类型 | string / Symbol | 任意（含对象） |
| 顺序 | 插入序 | 插入序 |
| 与 JSON | 可直接序列化 | 需转数组 |
| 性能 | 略快 | 略慢 |

💡 若 key 需要是对象（如 `Date` 直接分组，不转字符串），必须用 `Map.groupBy`。

🎯 项目里所有 `reduce((acc, x) => (acc[k]??=[]).push(x), {})` 都可替换。

### B.8 Promise.withResolvers（ES2024）

#### 是什么

以前要在外部拿到 `resolve/reject`，得写：

```js
let resolve, reject;
const p = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});
```

现在：

```js
const { promise, resolve, reject } = Promise.withResolvers();
```

#### WebSocket 请求-响应模式

WebSocket 天然是**双工**，不像 HTTP 一问一答。要把它伪装成"请求-响应"，得给每条消息编号，收到回包再找对应 Promise。

```js
class RpcClient {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.pending = new Map(); // id → {resolve, reject}
    this.nextId = 1;

    this.ws.onmessage = ev => {
      const { id, result, error } = JSON.parse(ev.data);
      const p = this.pending.get(id);
      if (!p) return;
      this.pending.delete(id);
      error ? p.reject(new Error(error)) : p.resolve(result);
    };
  }

  call(method, params) {
    const id = this.nextId++;
    const { promise, resolve, reject } = Promise.withResolvers();
    this.pending.set(id, { resolve, reject });

    // 超时保护
    const timer = setTimeout(() => {
      this.pending.delete(id);
      reject(new Error(`RPC ${method} timeout`));
    }, 10_000);

    promise.finally(() => clearTimeout(timer));

    this.ws.send(JSON.stringify({ id, method, params }));
    return promise;
  }
}

// 使用
const rpc = new RpcClient('wss://api.example.com');
const user = await rpc.call('getUser', { id: 42 });
```

#### 定时器封装

```js
function timeout(ms) {
  const { promise, resolve } = Promise.withResolvers();
  setTimeout(resolve, ms);
  return promise;
}

await timeout(1000);
```

💡 相比旧写法，代码少一层缩进 + 变量作用域清晰。

🎯 任何"外部触发 Promise 完成"的场景（RPC、事件、Cancellation）都直接上。

### B.9 V8 编译管线升级：Sparkplug + Maglev

#### 四层管线（2023 年后）

```
源码
  ↓ 解析
Ignition   —— 字节码解释器（启动快，慢）
  ↓ 热点触发
Sparkplug  —— 一次线性扫描出机器码的基线 JIT（2021 引入）
  ↓ 更热
Maglev     —— 中层优化 JIT，SSA IR，无反优化重排（2023 引入）
  ↓ 极热
TurboFan   —— 顶级优化 JIT，激进内联/推测，可反优化
```

#### 为什么加中间两层

早期只有 Ignition ↔ TurboFan："冷代码解释、热代码 TurboFan"。问题是：**中等热代码要么解释太慢、要么 TurboFan 编译太贵**。Sparkplug + Maglev 补上梯度：

- Sparkplug：**微秒级**编译，机器码约比 Ignition 快 5–10 倍。
- Maglev：**毫秒级**编译，比 Sparkplug 再快 2–3 倍，比 TurboFan 编译成本低一个量级。

#### 性能与内存影响

- **启动性能**：Node/Chrome 冷启动更快（Sparkplug 早期就能上机器码）。
- **稳态性能**：Maglev 处理"温热"函数，避免反复走 Ignition。
- **内存**：多一层缓存的机器码，**峰值内存上升约 5–10%**；可通过 `--no-maglev` 关闭。
- **反优化**：TurboFan 反优化时可回落 Maglev 而非 Ignition，抖动更小。

#### 面向开发者的启示

- 别再用 `try/catch` 大段包裹热函数（Maglev/TurboFan 对含 try 的函数依然优化受限）；
- 保持函数**单态**（monomorphic），Sparkplug 也吃隐藏类；
- Node 22+ 起，`--allow-natives-syntax` 可用 `%HaveSameMap`、`%OptimizeFunctionOnNextCall` 观察层级。

```js
// 让 v8 打出编译日志
// node --print-opt-code --print-bytecode --trace-opt --trace-deopt app.js
```

💡 分层越多，"从字节码到最优机器码"的路径就越平滑；写代码的直觉不变：**类型稳定、函数短小、少 try**。

🎯 面试问"V8 编译流程"，答四层管线（Ignition→Sparkplug→Maglev→TurboFan）即为高分。

### B.10 Node 22+ 原生特性对前端的影响

Node 从 20 → 22 → 24 的目标非常明确：**吃掉 Deno/Bun 的差异化优势**。以下五件事对前端工程链影响最大：

#### 1. `node --run <script>` 替代 `npm run`

```bash
# 旧
npm run build   # 冷启动 ~200 ms

# 新（Node 22+）
node --run build # ~20 ms，直接解析 package.json
```

对 monorepo/CI 提速明显。

#### 2. `--env-file=.env`

```bash
node --env-file=.env server.js
```

不再需要 `dotenv` 依赖。支持多文件：

```bash
node --env-file=.env --env-file=.env.local server.js
```

#### 3. `--experimental-strip-types` / `--experimental-transform-types`

```bash
# 直接跑 .ts，无需 tsx / ts-node
node --experimental-strip-types index.ts
```

Node 22.6+ 内置类型剥离，Node 24 正式稳定，走的是 **Amaro (swc)** 剥离路径：**只删类型注解、不做类型检查**，速度约等于零成本。

#### 4. 原生 WebSocket 客户端

```js
// 无需 ws 库
const ws = new WebSocket('wss://echo.websocket.events');
ws.addEventListener('open', () => ws.send('hi'));
ws.addEventListener('message', ev => console.log(ev.data));
```

Node 22 起 `--experimental-websocket` 无需再开，直接可用。

#### 5. 其它

- `node --watch`：文件变更自动重启，替代 nodemon；
- `fetch` / `FormData` / `Blob` / `structuredClone`：全部原生；
- `test` 模块 + `--test-reporter=spec`：内置测试框架足以替代 jest/mocha 的 80% 场景；
- `sqlite`（Node 22.5+）：原生 SQLite，本地脚本/CLI 不用装 better-sqlite3。

#### "Node 越来越像浏览器 + Deno"

| 能力 | 浏览器 | Deno | Node 22+ |
|---|---|---|---|
| fetch | ✅ | ✅ | ✅ |
| WebSocket 客户端 | ✅ | ✅ | ✅ |
| Web Streams | ✅ | ✅ | ✅ |
| 原生 TS | ❌ | ✅ | ✅（strip-types） |
| .env 内置 | ❌ | ✅ | ✅ |
| Task runner | ❌ | ✅（deno task） | ✅（--run） |
| 权限沙箱 | ✅ | ✅ | 实验中 |

💡 前端项目 2026 年可以放心把 `tsx`、`dotenv`、`ws`、`nodemon` 从 devDependencies 里删掉。

🎯 学习秘诀：**Iterator Helpers + Temporal + using** 这三件套是 2025 年 JS 最值得掌握的新工具。前两者改变数据处理与时间处理的心智模型，后者把资源生命周期上升为语言级契约——它们各自都值得单独立项练手一周。
