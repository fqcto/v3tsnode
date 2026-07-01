# CSS3 全阶段学习手册

CSS（Cascading Style Sheets）是 Web 的表现层语言，控制页面布局、色彩、动效与响应式适配。本手册从零基础到高级实战，系统覆盖 CSS3 核心知识，配合大量代码片段与对比表格，帮助你在每个阶段建立扎实的理解。

## 目录

- [一、🟢 初级入门](#一-初级入门)
  - [CSS 是什么、三种引入方式](#css-是什么三种引入方式)
  - [选择器基础](#选择器基础)
  - [属性选择器](#属性选择器)
  - [伪类](#伪类)
  - [伪元素](#伪元素)
  - [颜色](#颜色)
  - [字体](#字体)
  - [文本属性](#文本属性)
  - [单位](#单位)
  - [盒模型](#盒模型)
  - [背景](#背景)
  - [边框](#边框)
  - [display](#display)
  - [z-index 入门](#z-index-入门)
- [二、🟡 中级进阶](#二-中级进阶)
  - [优先级与层叠](#优先级与层叠)
  - [继承 vs 层叠](#继承-vs-层叠)
  - [position 五种值](#position-五种值)
  - [float 与 clearfix](#float-与-clearfix)
  - [Flexbox](#flexbox)
  - [Grid](#grid)
  - [响应式设计](#响应式设计)
  - [单位进阶](#单位进阶)
  - [溢出处理](#溢出处理)
  - [transition](#transition)
  - [transform](#transform)
  - [animation](#animation)
  - [阴影对比](#阴影对比)
  - [filter / backdrop-filter / blend / mask](#filter--backdrop-filter--blend--mask)
- [三、🔴 高级实战](#三-高级实战)
  - [CSS 变量与主题切换](#css-变量与主题切换)
  - [Houdini](#houdini)
  - [现代选择器](#现代选择器)
  - [逻辑属性与 RTL](#逻辑属性与-rtl)
  - [CSS 嵌套 vs SCSS](#css-嵌套-vs-scss)
  - [@layer 层叠层](#layer-层叠层)
  - [容器查询完整示例](#容器查询完整示例)
  - [svh / lvh / dvh](#svh--lvh--dvh)
  - [滚动控制](#滚动控制)
  - [纯 CSS 视差 / 粘性头部 / 轮播](#纯-css-视差--粘性头部--轮播)
  - [硬件加速](#硬件加速)
  - [CSS 方法论对比](#css-方法论对比)
  - [CSS-in-JS vs CSS Modules vs Tailwind](#css-in-js-vs-css-modules-vs-tailwind)
  - [打印样式与无障碍媒体查询](#打印样式与无障碍媒体查询)
  - [常见面试题](#常见面试题)

---

## 一、🟢 初级入门

### <span class="lv lv-1">初级</span> CSS 是什么、三种引入方式

CSS 是层叠样式表，用于描述 HTML 文档的视觉呈现。

| 引入方式 | 语法 | 优点 | 缺点 |
|---------|------|------|------|
| 行内样式 | `<div style="color:red">` | 优先级最高、快速调试 | 不可复用、维护差 |
| 内部样式表 | `<style>...</style>` | 单文件可控 | 多页面无法共享 |
| 外部样式表 | `<link rel="stylesheet" href="a.css">` | 可缓存、可复用、结构与表现分离 | 额外 HTTP 请求 |

```html
<!-- 推荐：外部样式表 -->
<link rel="stylesheet" href="styles.css">
```

💡 生产环境始终优先使用外部样式表，行内样式仅用于临时调试。

---

### <span class="lv lv-1">初级</span> 选择器基础

| 选择器 | 语法 | 示例 | 说明 |
|--------|------|------|------|
| 标签 | `tag` | `p {}` | 选所有同名标签 |
| 类 | `.class` | `.box {}` | 最常用，可复用 |
| ID | `#id` | `#header {}` | 页面唯一 |
| 通配 | `*` | `* {}` | 选所有元素 |
| 后代 | `A B` | `div p {}` | 所有后代 |
| 子 | `A > B` | `div > p {}` | 仅直接子元素 |
| 相邻兄弟 | `A + B` | `h2 + p {}` | 紧邻其后的一个 |
| 通用兄弟 | `A ~ B` | `h2 ~ p {}` | 其后所有兄弟 |
| 群组 | `A, B` | `h1, h2 {}` | 同时选中 |

```html
<style>
  div > p { color: blue; }      /* 仅直接子 <p> */
  h2 + p { font-weight: bold; } /* 紧跟 h2 的 <p> */
  h2 ~ p { color: gray; }       /* h2 之后所有兄弟 <p> */
</style>
<div>
  <p>直接子元素——蓝色</p>
  <section><p>非直接子元素——不变</p></section>
</div>
<h2>标题</h2>
<p>紧跟的段落——加粗+灰色</p>
<p>后面的段落——灰色</p>
```

💡 类选择器是日常开发主力，ID 选择器保留给 JS 钩子或锚点。

---

### <span class="lv lv-1">初级</span> 属性选择器

| 选择器 | 含义 | 示例 |
|--------|------|------|
| `[attr]` | 有该属性 | `[disabled] {}` |
| `[attr=val]` | 完全匹配 | `[type="text"] {}` |
| `[attr^=val]` | 开头匹配 | `[href^="https"] {}` |
| `[attr$=val]` | 结尾匹配 | `[src$=".png"] {}` |
| `[attr*=val]` | 包含匹配 | `[class*="btn"] {}` |

```css
a[href^="https"] { color: green; }    /* 安全链接 */
img[src$=".svg"] { border: 1px solid; } /* SVG 图标 */
```

💡 属性选择器在处理第三方生成的 HTML（无法添加类名）时特别有用。

---

### <span class="lv lv-1">初级</span> 伪类

| 伪类 | 触发时机 | 示例 |
|------|---------|------|
| `:hover` | 鼠标悬停 | 按钮 hover 效果 |
| `:active` | 按下瞬间 | 按钮点击反馈 |
| `:focus` | 获得焦点 | 输入框聚焦 |
| `:visited` | 已访问链接 | 链接变色 |
| `:first-child` | 父元素首个子元素 | 首项去掉上边距 |
| `:last-child` | 父元素末尾子元素 | 末项去掉下边距 |
| `:nth-child(n)` | 第 n 个子元素 | 斑马纹 |

```css
/* 斑马纹表格 */
tr:nth-child(odd)  { background: #f5f5f5; }
tr:nth-child(even) { background: #fff; }
/* 倒数第二项 */
li:nth-last-child(2) { font-weight: bold; }
```

💡 `nth-child(n)` 是最灵活的结构伪类，`odd`/`even`、`3n+1` 等公式能实现复杂选择。

---

### <span class="lv lv-1">初级</span> 伪元素

| 伪元素 | 作用 | 是否需 content |
|--------|------|---------------|
| `::before` | 元素内容前插入 | 是 |
| `::after` | 元素内容后插入 | 是 |
| `::first-letter` | 首字母 | 否 |
| `::first-line` | 首行 | 否 |
| `::selection` | 用户选中文本 | 否 |

```css
/* 必填字段星号 */
.required::after {
  content: " *";
  color: red;
}
/* 选中文字样式 */
::selection {
  background: #ff9632;
  color: #fff;
}
```

💡 `::before`/`::after` 必须设置 `content` 属性才会渲染，即使值为空字符串。

---

### <span class="lv lv-1">初级</span> 颜色

| 格式 | 语法 | 示例 | 特点 |
|------|------|------|------|
| 命名 | 关键字 | `red` | 147 种，简单直白 |
| hex | `#RRGGBB[AA]` | `#ff6600` / `#f60f` | 最常用 |
| rgb | `rgb(R,G,B)` | `rgb(255,102,0)` | 不透明 |
| rgba | `rgba(R,G,B,A)` | `rgba(0,0,0,0.5)` | 可调透明 |
| hsl | `hsl(H,S%,L%)` | `hsl(24,100%,50%)` | 色相/饱和/亮度 |
| hsla | `hsla(H,S%,L%,A)` | `hsla(0,0%,0%,0.5)` | 透明度版 |
| currentColor | `currentColor` | — | 继承当前 color |

```css
.icon {
  color: #333;
  border: 1px solid currentColor; /* 边框跟文字同色 */
}
```

🎯 `currentColor` 是实现主题色联动的利器，减少重复声明。

---

### <span class="lv lv-1">初级</span> 字体

```css
/* 简写：style variant weight size/line-height family */
font: italic small-caps 700 16px/1.5 "Helvetica Neue", Arial, sans-serif;
```

| 属性 | 说明 | 常用值 |
|------|------|--------|
| `font-family` | 字体栈 | `"PingFang SC", "Microsoft YaHei", sans-serif` |
| `font-size` | 字号 | `14px` / `1rem` |
| `font-weight` | 粗细 | `400`(normal) / `700`(bold) / `100`–`900` |
| `line-height` | 行高 | `1.5`(推荐无单位) |
| `font-display` | 字体加载策略 | `swap`(推荐) |

```css
@font-face {
  font-family: "MyIcon";
  src: url("icon.woff2") format("woff2");
  font-weight: normal;
  font-display: swap; /* 文字先显示后备字体，加载完替换 */
}
```

💡 `line-height` 用无单位值（如 `1.5`）而非 `1.5em`，子元素会基于自身字号重新计算。

---

### <span class="lv lv-1">初级</span> 文本属性

| 属性 | 作用 | 常用值 |
|------|------|--------|
| `color` | 文字颜色 | `#333` |
| `text-align` | 对齐 | `left`/`center`/`right`/`justify` |
| `text-decoration` | 装饰线 | `none`/`underline`/`line-through` |
| `text-transform` | 大小写 | `uppercase`/`lowercase`/`capitalize` |
| `letter-spacing` | 字间距 | `0.05em` |
| `word-spacing` | 词间距 | `0.1em` |
| `text-indent` | 首行缩进 | `2em` |
| `white-space` | 空白处理 | `nowrap`/`pre`/`pre-wrap` |
| `word-break` | 换行规则 | `break-all`/`break-word`/`keep-all` |
| `overflow-wrap` | 溢出换行 | `break-word` |

💡 中文排版常用 `text-indent: 2em` 首行缩进；长 URL 用 `overflow-wrap: break-word`。

---

### <span class="lv lv-1">初级</span> 单位

| 单位 | 类型 | 基准 | 适用场景 |
|------|------|------|---------|
| `px` | 绝对 | 像素 | 边框、固定尺寸 |
| `em` | 相对 | 父元素字号 | 组件内间距 |
| `rem` | 相对 | 根元素字号 | 全局布局、字号 |
| `%` | 相对 | 父元素对应属性 | 宽高、定位 |
| `vw` | 视口 | 视口宽度 1% | 全屏宽 |
| `vh` | 视口 | 视口高度 1% | 全屏高 |
| `vmin` | 视口 | `min(vw, vh)` | 方向自适应 |
| `vmax` | 视口 | `max(vw, vh)` | 方向自适应 |

```css
html { font-size: 16px; }   /* 基准 */
h1 { font-size: 2rem; }     /* 32px */
.card { padding: 1em; }     /* 跟随自身字号 */
.hero { height: 100vh; }    /* 全屏高 */
```

🎯 推荐策略：根字号用 `rem`，组件间距用 `em`，全屏布局用 `vw`/`vh`。

---

### <span class="lv lv-1">初级</span> 盒模型

```
+----------------------------------------------+
|                  margin                       |
|   +--------------------------------------+   |
|   |             border                    |   |
|   |   +------------------------------+   |   |
|   |   |          padding              |   |   |
|   |   |   +----------------------+    |   |   |
|   |   |   |      content         |    |   |   |
|   |   |   |   (width x height)   |    |   |   |
|   |   |   +----------------------+    |   |   |
|   |   +------------------------------+   |   |
|   +--------------------------------------+   |
+----------------------------------------------+
```

| 模型 | width 包含 | 实际宽度 | 适用 |
|------|-----------|---------|------|
| `content-box`（默认） | 仅 content | width + padding + border | 传统 |
| `border-box`（推荐） | content + padding + border | width 即可见宽 | 现代 |

```css
/* 全局最佳实践 */
*, *::before, *::after {
  box-sizing: border-box;
}
```

💡 `border-box` 让 `width` 就是你看到的宽度，不再因 padding/border 撑破布局。

---

### <span class="lv lv-1">初级</span> 背景

| 属性 | 作用 | 常用值 |
|------|------|--------|
| `background-color` | 背景色 | `#fff` |
| `background-image` | 背景图 | `url(bg.png)` |
| `background-repeat` | 重复 | `no-repeat`/`repeat-x`/`repeat-y` |
| `background-position` | 位置 | `center`/`0 0`/`50% 50%` |
| `background-size` | 尺寸 | `cover`/`contain`/`100% 100%` |
| `background-attachment` | 滚动 | `scroll`/`fixed`/`local` |
| `background-clip` | 绘制区域 | `border-box`/`padding-box`/`content-box` |
| `background-origin` | 定位区域 | `padding-box`/`border-box`/`content-box` |

```css
/* 多背景叠加 */
.hero {
  background:
    linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
    url(hero.jpg) center/cover no-repeat;
}
```

💡 `cover` 保证铺满但可能裁切；`contain` 保证完整但可能留白。

---

### <span class="lv lv-1">初级</span> 边框

```css
.border-demo {
  border: 1px solid #ccc;
  border-radius: 8px;          /* 圆角 */
  outline: 2px dashed blue;    /* 不占空间的外轮廓 */
  outline-offset: 4px;         /* 轮廓偏移 */
}
```

| 属性 | 是否占空间 | 是否可圆角 | 常见用途 |
|------|-----------|-----------|---------|
| `border` | 是 | 是 | 装饰、分隔 |
| `outline` | 否 | 否 | 焦点环、调试 |

💡 用 `outline-offset` 做焦点环可避免影响布局，是 a11y 友好做法。

---

### <span class="lv lv-1">初级</span> display

| 值 | 宽高 | 换行 | 典型元素 |
|----|------|------|---------|
| `block` | 宽撑满、高由内容 | 独占一行 | `div`/`p`/`h1` |
| `inline` | 宽高由内容定 | 不换行 | `span`/`a`/`em` |
| `inline-block` | 可设宽高 | 不换行 | 按钮、标签 |
| `none` | — | — | 隐藏元素 |

```css
.nav-link {
  display: inline-block;  /* 可设宽高，仍在行内 */
  padding: 8px 16px;
}
```

💡 `display: none` 不占空间也不可访问；想保留空间用 `visibility: hidden`。

---

### <span class="lv lv-1">初级</span> z-index 入门

`z-index` 仅对**定位元素**（position 非 static）和 flex/grid 子项生效。

```
z-index 层叠示意：

  +---------- z-index: 3 ----------+
  |  +-------- z-index: 2 ------+  |
  |  |  +---- z-index: 1 ----+  |  |
  |  |  |   content          |  |  |
  |  |  +--------------------+  |  |
  |  +--------------------------+  |
  +--------------------------------+
```

```css
.modal-overlay { position: fixed; z-index: 1000; }
.modal         { position: fixed; z-index: 1001; }
```

🎯 z-index 不是越大越好，按层级规划（如 10/20/30）避免混乱。

---

## 二、🟡 中级进阶

### <span class="lv lv-2">中级</span> 优先级与层叠

优先级从高到低：

| 优先级 | 来源 | 示例 | 权重 |
|--------|------|------|------|
| 1 | `!important` | `color: red !important` | 最高，覆盖一切 |
| 2 | 行内样式 | `style="color:red"` | (1,0,0,0) |
| 3 | ID 选择器 | `#header` | (0,1,0,0) |
| 4 | 类/伪类/属性 | `.nav` / `:hover` / `[type]` | (0,0,1,0) |
| 5 | 元素/伪元素 | `div` / `::before` | (0,0,0,1) |
| 6 | 通配符 | `*` | (0,0,0,0) |

💡 同权重下后声明者胜；避免 `!important`，它会让调试变成噩梦。

---

### <span class="lv lv-2">中级</span> 继承 vs 层叠

| 概念 | 说明 | 示例 |
|------|------|------|
| 继承 | 子元素自动获得父元素某些属性 | `color`/`font`/`line-height` |
| 层叠 | 同一属性多次声明，高优先级胜出 | 后声明 / 高权重覆盖 |

| 关键字 | 作用 |
|--------|------|
| `inherit` | 强制继承父值 |
| `initial` | 恢复为 CSS 规范初始值 |
| `unset` | 可继承则继承，否则 initial |
| `revert` | 恢复为浏览器默认样式 |

```css
a { color: revert; }            /* 恢复浏览器默认蓝色链接 */
.card { all: unset; }           /* 清除所有样式，从零开始 */
```

🎯 `revert` 比 `initial` 更实用——它恢复浏览器默认而非规范初始值。

---

### <span class="lv lv-2">中级</span> position 五种值

| 值 | 参照物 | 是否脱标 | 滚动 |
|----|--------|---------|------|
| `static` | — | 否 | — |
| `relative` | 自身原位置 | 否（偏移视觉位置） | 跟随 |
| `absolute` | 最近定位祖先 | 是 | 跟随 |
| `fixed` | 视口 | 是 | 固定 |
| `sticky` | 滚动祖先 + 阈值 | 否（到阈值后固定） | 粘性 |

```html
<style>
  .sticky-header {
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 10;
  }
</style>
<header class="sticky-header">我会在滚动时吸顶</header>
```

💡 `sticky` 需要**父容器有足够滚动空间**且不能设 `overflow: hidden`。

---

### <span class="lv lv-2">中级</span> float 与 clearfix

```css
/* 浮动使元素脱离文档流 */
.left  { float: left;  width: 200px; }
.right { float: right; width: 200px; }

/* clearfix：解决父元素高度塌陷 */
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
```

💡 现代布局中浮动已被 Flexbox/Grid 替代，clearfix 了解即可。

---

### <span class="lv lv-2">中级</span> Flexbox

**容器属性：**

| 属性 | 作用 | 常用值 |
|------|------|--------|
| `display` | 开启 flex | `flex`/`inline-flex` |
| `flex-direction` | 主轴方向 | `row`/`row-reverse`/`column` |
| `flex-wrap` | 换行 | `nowrap`/`wrap` |
| `justify-content` | 主轴对齐 | `flex-start`/`center`/`space-between`/`space-around`/`space-evenly` |
| `align-items` | 交叉轴对齐 | `stretch`/`flex-start`/`center`/`baseline` |
| `align-content` | 多行交叉轴对齐 | `stretch`/`center`/`space-between` |
| `gap` | 间距 | `8px` / `8px 16px` |

**子项属性：**

| 属性 | 作用 | 常用值 |
|------|------|--------|
| `flex-grow` | 放大比例 | `0`/`1` |
| `flex-shrink` | 缩小比例 | `1`/`0` |
| `flex-basis` | 初始大小 | `auto`/`200px` |
| `flex` | 简写 | `1` (= `1 1 0%`)/`0 0 auto` |
| `align-self` | 单项交叉轴对齐 | `auto`/`center`/`stretch` |
| `order` | 排列顺序 | `0`/`-1`/`1` |

```html
<!-- 经典：水平垂直居中 -->
<style>
  .center-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    border: 2px dashed #999;
  }
</style>
<div class="center-box">
  <span>居中内容</span>
</div>
```

```html
<!-- 圣杯布局 -->
<style>
  .holy-grail {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }
  .holy-grail main {
    display: flex;
    flex: 1;
  }
  .holy-grail .sidebar { flex: 0 0 200px; }
  .holy-grail .content { flex: 1; }
</style>
<div class="holy-grail">
  <header>Header</header>
  <main>
    <aside class="sidebar">Left</aside>
    <section class="content">Content</section>
    <aside class="sidebar">Right</aside>
  </main>
  <footer>Footer</footer>
</div>
```

🎯 `flex: 1` 是最常用的子项简写，等价于 `flex-grow:1; flex-shrink:1; flex-basis:0%`。

---

### <span class="lv lv-2">中级</span> Grid

| 属性 | 作用 | 常用值 |
|------|------|--------|
| `grid-template-columns` | 定义列 | `200px 1fr 1fr` / `repeat(3,1fr)` |
| `grid-template-rows` | 定义行 | `auto 1fr auto` |
| `fr` | 剩余空间份数 | `1fr`/`2fr` |
| `minmax()` | 最小最大范围 | `minmax(200px, 1fr)` |
| `repeat()` | 重复 | `repeat(auto-fill, minmax(250px, 1fr))` |
| `auto-fill` vs `auto-fit` | — | 见下表 |
| `grid-area` | 命名定位 | 见示例 |
| `gap` | 间距 | `16px` |

| | `auto-fill` | `auto-fit` |
|---|---|---|
| 多余空间 | 保留空列 | 折叠空列，剩余列拉伸 |
| 效果 | 严格按尺寸排列 | 自适应撑满 |

```html
<style>
  .named-grid {
    display: grid;
    grid-template-areas:
      "head head head"
      "side main main"
      "foot foot foot";
    grid-template-columns: 200px 1fr 1fr;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
    gap: 8px;
  }
  .named-grid header  { grid-area: head; }
  .named-grid aside   { grid-area: side; }
  .named-grid section { grid-area: main; }
  .named-grid footer  { grid-area: foot; }
</style>
<div class="named-grid">
  <header>Header</header>
  <aside>Sidebar</aside>
  <section>Main</section>
  <footer>Footer</footer>
</div>
```

🎯 Grid 命名区域（`grid-template-areas`）让布局可视化，维护性极佳。

---

### <span class="lv lv-2">中级</span> 响应式设计

| 策略 | 说明 |
|------|------|
| 移动优先 | 默认样式为手机，`@media (min-width)` 递增 |
| 桌面优先 | 默认样式为桌面，`@media (max-width)` 递减 |
| 容器查询 | 根据父容器宽度响应，非视口 |

```css
/* 移动优先断点 */
.container { padding: 16px; }
@media (min-width: 768px)  { .container { padding: 32px; max-width: 720px; } }
@media (min-width: 1024px) { .container { max-width: 960px; } }
```

```css
/* 容器查询 */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}
@container card (min-width: 400px) {
  .card { flex-direction: row; }
}
```

💡 容器查询让组件级别响应成为可能，是组件化开发的关键补充。

---

### <span class="lv lv-2">中级</span> 单位进阶

```css
/* clamp(最小, 首选, 最大) —— 响应式字号最佳实践 */
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }

/* min() / max() —— 取较小/较大值 */
.box { width: min(90%, 1200px); }      /* 不超过 1200px */
.sidebar { width: max(200px, 20vw); }  /* 至少 200px */

/* calc() —— 混合单位运算 */
.content { height: calc(100vh - 60px); }

/* aspect-ratio —— 宽高比 */
.video { aspect-ratio: 16 / 9; width: 100%; }
```

🎯 `clamp()` 是现代响应式字号的银弹，告别复杂断点。

---

### <span class="lv lv-2">中级</span> 溢出处理

```css
/* 单行省略 */
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 多行截断（WebKit） */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

| 属性 | 作用 | 值 |
|------|------|---|
| `overflow` | 内容溢出 | `visible`/`hidden`/`scroll`/`auto` |
| `text-overflow` | 文本溢出标记 | `clip`/`ellipsis` |
| `-webkit-line-clamp` | 多行截断行数 | 数字 |

💡 多行截断 `-webkit-line-clamp` 目前主流浏览器均已支持。

---

### <span class="lv lv-2">中级</span> transition

```css
.btn {
  background: #333;
  color: #fff;
  /* property  duration  timing-function  delay */
  transition: background 0.3s ease 0s, transform 0.2s ease-out;
}
.btn:hover {
  background: #555;
  transform: scale(1.05);
}
```

| timing-function | 曲线 | 适用 |
|-----------------|------|------|
| `ease` | 慢→快→慢 | 通用默认 |
| `linear` | 匀速 | 进度条 |
| `ease-in` | 慢→快 | 退出 |
| `ease-out` | 快→慢 | 进入 |
| `ease-in-out` | 慢→快→慢 | 对称动画 |
| `cubic-bezier()` | 自定义 | 精细调优 |

💡 只对 `transform`/`opacity` 做 transition，性能最佳。

---

### <span class="lv lv-2">中级</span> transform

```css
.transform-demo {
  /* 组合使用，空格分隔 */
  transform: translateX(50px) rotate(45deg) scale(1.2);
  transform-origin: left top;  /* 变换原点 */
}

/* 3D */
.card {
  transform: perspective(800px) rotateY(30deg);
  transform-style: preserve-3d;
}
```

| 函数 | 作用 | 2D/3D |
|------|------|-------|
| `translate(x,y)` | 平移 | 2D |
| `translateX/Y/Z()` | 单轴平移 | 2D/3D |
| `rotate(angle)` | 旋转 | 2D |
| `rotateX/Y/Z()` | 绕轴旋转 | 3D |
| `scale(x,y)` | 缩放 | 2D |
| `skew(x,y)` | 倾斜 | 2D |
| `perspective(n)` | 透视距离 | 3D |

🎯 `transform` 不触发重排，是高性能动画的首选。

---

### <span class="lv lv-2">中级</span> animation

```css
@keyframes slideIn {
  0%   { transform: translateX(-100%); opacity: 0; }
  60%  { transform: translateX(10%); }
  100% { transform: translateX(0); opacity: 1; }
}

.animated {
  /* name duration timing delay iteration direction fill play-state */
  animation: slideIn 0.6s ease-out 0.1s 1 normal both;
}
```

| 属性 | 作用 | 常用值 |
|------|------|--------|
| `animation-name` | 关键帧名 | `slideIn` |
| `animation-duration` | 持续时间 | `0.6s` |
| `animation-timing-function` | 缓动 | `ease-out` |
| `animation-delay` | 延迟 | `0.1s` |
| `animation-iteration-count` | 次数 | `1`/`infinite` |
| `animation-direction` | 方向 | `normal`/`reverse`/`alternate` |
| `animation-fill-mode` | 填充 | `forwards`/`backwards`/`both` |
| `animation-play-state` | 播放状态 | `running`/`paused` |

💡 `animation-fill-mode: both` 让动画开始前应用起始帧、结束后保持最终帧。

---

### <span class="lv lv-2">中级</span> 阴影对比

| 属性 | 作用 | 是否跟形状 | 是否占空间 |
|------|------|-----------|-----------|
| `box-shadow` | 盒阴影 | 矩形 | 否 |
| `text-shadow` | 文字阴影 | 文字轮廓 | 否 |
| `filter: drop-shadow()` | 投影 | 跟随透明轮廓 | 否 |

```css
.box  { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.text { text-shadow: 1px 1px 2px rgba(0,0,0,0.3); }

/* drop-shadow 跟随不规则形状 */
.arrow { filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.4)); }
```

🎯 `drop-shadow()` 能跟随 PNG 透明轮廓或 CSS 三角形，`box-shadow` 做不到。

---

### <span class="lv lv-2">中级</span> filter / backdrop-filter / blend / mask

```css
/* filter 图像滤镜 */
.img-gray  { filter: grayscale(100%); }
.img-blur  { filter: blur(4px); }
.img-bright { filter: brightness(1.2); }

/* backdrop-filter 背景模糊（毛玻璃） */
.glass {
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* mix-blend-mode 混合模式 */
.blend { mix-blend-mode: multiply; }

/* mask 遮罩 */
.fade-mask {
  -webkit-mask-image: linear-gradient(to bottom, #000 60%, transparent);
  mask-image: linear-gradient(to bottom, #000 60%, transparent);
}
```

💡 `backdrop-filter` 需要**半透明背景**才有效果，记得加兼容前缀。

---

## 三、🔴 高级实战

### <span class="lv lv-3">高级</span> CSS 变量与主题切换

```html
<style>
  :root {
    --bg: #ffffff;
    --text: #1a1a1a;
    --primary: #0066ff;
    --radius: 8px;
  }
  [data-theme="dark"] {
    --bg: #1a1a1a;
    --text: #f0f0f0;
    --primary: #4d94ff;
  }
  body {
    background: var(--bg);
    color: var(--text);
    transition: background 0.3s, color 0.3s;
  }
  .btn {
    background: var(--primary);
    border-radius: var(--radius);
  }
</style>

<button onclick="document.documentElement.dataset.theme =
  document.documentElement.dataset.theme === 'dark' ? '' : 'dark'">
  切换主题
</button>
```

💡 CSS 变量 + `data-theme` 属性切换是最轻量的暗色模式方案，零依赖。

---

### <span class="lv lv-3">高级</span> Houdini

**Paint API** — 用 JS 绘制 CSS 背景图像：

```css
/* 注册 Paint Worklet */
/* CSS.paintWorklet.addModule('ripple.js') */

.btn {
  --ripple-color: #0066ff;
  background: paint(ripple);
}
```

**@property typed custom properties** — 给变量加类型约束：

```css
@property --hue {
  syntax: "<number>";
  initial-value: 0;
  inherits: false;
}

.rainbow {
  --hue: 0;
  background: hsl(var(--hue) 80% 60%);
  transition: --hue 1s;
}
.rainbow:hover { --hue: 360; }
```

🎯 `@property` 让 CSS 变量可参与 transition/animation，突破传统限制。

---

### <span class="lv lv-3">高级</span> 现代选择器

| 选择器 | 作用 | 优先级 | 兼容 |
|--------|------|--------|------|
| `:is(A, B)` | 匹配列表中任一 | 取列表中最高 | ✅ |
| `:where(A, B)` | 同 `:is()` 但优先级为 0 | 0 | ✅ |
| `:has(> .active)` | 父选择器（反向选择） | 正常 | ✅ |

```css
/* :is 简化群组 */
:is(h1, h2, h3):hover { color: var(--primary); }

/* :where 零优先级——适合重置样式 */
:where(a) { text-decoration: none; }

/* :has 反向选择：包含 img 的卡片 */
.card:has(img) { grid-template-rows: 200px 1fr; }

/* :has 前一个兄弟 */
h2:has(+ p) { margin-bottom: 0; }  /* h2 后面紧跟 p 时去掉下边距 */
```

💡 `:has()` 被称为"CSS 缺失的父选择器"，2024 年已获全面浏览器支持。

---

### <span class="lv lv-3">高级</span> 逻辑属性与 RTL

```css
/* 传统属性 vs 逻辑属性 */
margin-left          → margin-inline-start
margin-right         → margin-inline-end
margin-top           → margin-block-start
margin-bottom        → margin-block-end
padding-left/right   → padding-inline-start/end
top/right/bottom/left → inset-block-start / inset-inline-end

/* RTL 自适应 */
.card {
  margin-inline-start: 16px;  /* LTR→左, RTL→右 */
  padding-block: 12px;        /* 上下 */
  inset: 0;                   /* 四个方向为 0 */
}
```

```html
<html dir="rtl">
  <!-- 逻辑属性自动翻转方向 -->
</html>
```

🎯 逻辑属性一次编写，LTR/RTL 自动适配，国际化项目必备。

---

### <span class="lv lv-3">高级</span> CSS 嵌套 vs SCSS

```css
/* 原生 CSS 嵌套（2023+） */
.card {
  padding: 16px;
  & .title { font-size: 1.25rem; }
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  @media (width >= 768px) { padding: 24px; }
}
```

```scss
/* SCSS 嵌套 */
.card {
  padding: 16px;
  .title { font-size: 1.25rem; }
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  @media (min-width: 768px) { padding: 24px; }
}
```

| 对比 | 原生 CSS | SCSS |
|------|---------|------|
| 语法 | `&` 必须显式写 | `&` 可省略 |
| 变量 | `var(--x)` | `$x` |
| 媒体查询 | `@media (width >= 768px)` | `@media (min-width: 768px)` |
| 编译 | 浏览器直接运行 | 需预处理器 |
| 成熟度 | 新标准 | 成熟生态 |

💡 原生嵌套已在主流浏览器支持，新项目可逐步替代 SCSS 嵌套。

---

### <span class="lv lv-3">高级</span> @layer 层叠层

```css
/* 声明层顺序：先声明优先级越低 */
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; box-sizing: border-box; }
}
@layer base {
  body { font-family: sans-serif; line-height: 1.6; }
}
@layer components {
  .btn { padding: 8px 16px; border-radius: 4px; }
}
@layer utilities {
  .mt-4 { margin-top: 1rem; }  /* 总是胜出，无论选择器权重 */
}

/* 未分层的样式优先级高于所有层 */
```

🎯 `@layer` 让样式优先级由层顺序决定，而非选择器权重，彻底解决第三方库样式冲突。

---

### <span class="lv lv-3">高级</span> 容器查询完整示例

```html
<style>
  .widget-area {
    container-type: inline-size;
    container-name: widget;
  }
  .widget {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  @container widget (min-width: 400px) {
    .widget {
      flex-direction: row;
      align-items: center;
    }
    .widget img { width: 120px; height: 120px; }
  }
</style>

<div class="widget-area">
  <article class="widget">
    <img src="photo.jpg" alt="">
    <div>
      <h3>标题</h3>
      <p>描述文本...</p>
    </div>
  </article>
</div>
```

💡 容器查询让同一组件在不同宽度容器中自适应布局，无需知道页面断点。

---

### <span class="lv lv-3">高级</span> svh / lvh / dvh

| 单位 | 含义 | 手机地址栏影响 |
|------|------|---------------|
| `vh` | 视口高度 1% | 不变，可能出滚动条 |
| `svh` | 小视口高度 1%（地址栏展开） | 稳定 |
| `lvh` | 大视口高度 1%（地址栏收起） | 稳定 |
| `dvh` | 动态视口高度 1%（实时跟随） | 随地址栏变化 |

```css
.hero {
  height: 100dvh; /* 手机安全全屏 */
}
```

🎯 移动端全屏用 `dvh`，避免 `100vh` 被地址栏撑开的问题。

---

### <span class="lv lv-3">高级</span> 滚动控制

```css
/* 滚动捕捉——卡片轮播 */
.carousel {
  scroll-snap-type: x mandatory;
  overflow-x: auto;
}
.carousel-item {
  scroll-snap-align: center;
  flex-shrink: 0;
}

/* 平滑滚动 */
html { scroll-behavior: smooth; }

/* 防止过度滚动弹跳 */
.modal { overscroll-behavior: contain; }
```

| 属性 | 作用 | 常用值 |
|------|------|--------|
| `scroll-snap-type` | 捕捉轴与严格度 | `x mandatory`/`y proximity` |
| `scroll-snap-align` | 子项对齐点 | `start`/`center`/`end` |
| `scroll-behavior` | 滚动行为 | `smooth` |
| `overscroll-behavior` | 过度滚动 | `contain`/`none` |

💡 `overscroll-behavior: contain` 可阻止弹窗内滚动穿透到背景页面。

---

### <span class="lv lv-3">高级</span> 纯 CSS 视差 / 粘性头部 / 轮播

```css
/* 视差滚动 */
.parallax-container {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  perspective: 1px;
}
.parallax-bg {
  transform: translateZ(-2px) scale(3);
}

/* 粘性头部 */
.header { position: sticky; top: 0; z-index: 100; }

/* 纯 CSS 无限轮播 */
@keyframes scroll-x {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee {
  display: flex;
  animation: scroll-x 20s linear infinite;
}
.marquee:hover { animation-play-state: paused; }
```

💡 无限轮播技巧：将内容复制一份，动画平移 50%，视觉上无缝衔接。

---

### <span class="lv lv-3">高级</span> 硬件加速

| 动画属性 | 触发阶段 | 性能 |
|---------|---------|------|
| `transform`/`opacity` | 仅合成（Composite） | 最高 |
| `top`/`left`/`width` | 布局（Layout）→ 绘制→ 合成 | 差 |

```css
/* 推荐写法 */
.animated {
  will-change: transform;
  transform: translateZ(0);  /* 强制 GPU 层 */
}

/* 避免滥用 will-change */
.bad {
  will-change: transform, opacity, left, top; /* 过多反而降低性能 */
}
```

| 要点 | 说明 |
|------|------|
| 优先用 `transform`/`opacity` | 仅触发合成层，不重排重绘 |
| `will-change` 按需使用 | 动画开始前加，结束后移除 |
| 避免频繁读写布局属性 | `offsetWidth`/`getBoundingClientRect()` 强制同步布局 |
| 减少层叠上下文 | 每个层都消耗内存 |

🎯 记住口诀：动画只用 transform + opacity，性能无忧。

---

### <span class="lv lv-3">高级</span> CSS 方法论对比

| 方法论 | 核心思想 | 命名示例 | 优点 | 缺点 |
|--------|---------|---------|------|------|
| BEM | Block-Element-Modifier | `.card__title--large` | 语义清晰、无嵌套 | 类名冗长 |
| OOCSS | 结构与皮肤分离 | `.btn` + `.btn-primary` | 复用性强 | 需规划抽象 |
| Atomic / Utility | 每个类一个属性 | `.mt-4` `.text-center` | 极致复用、一致 | HTML 肿胀 |

```css
/* BEM */
.card {}
.card__title {}
.card__title--large {}

/* OOCSS */
.btn { padding: 8px 16px; border-radius: 4px; }
.btn-primary { background: var(--primary); color: #fff; }

/* Atomic */
.mt-4 { margin-top: 1rem; }
.text-center { text-align: center; }
```

💡 Tailwind 将 Atomic 方法论推向极致，小项目 BEM 足够，大型团队建议统一方法论。

---

### <span class="lv lv-3">高级</span> CSS-in-JS vs CSS Modules vs Tailwind

| 维度 | CSS-in-JS (styled) | CSS Modules | Tailwind CSS |
|------|-------------------|-------------|-------------|
| 作用域 | 运行时/编译时哈希 | 编译时哈希 | 原子类 + purge |
| 样式与逻辑 | 紧耦合 | 解耦 | 解耦 |
| 运行时开销 | 有（运行时方案） | 无 | 无 |
| SSR 支持 | 需配置 | 原生 | 原生 |
| 主题 | JS 变量 | CSS 变量 | 配置文件 |
| 包体积 | 取决于使用 | 按需 | 极小（purge 后） |
| 学习曲线 | 中 | 低 | 中 |
| 适用 | React 深度动态 | 框架无关 | 通用 |

🎯 新项目推荐 Tailwind + CSS Modules 组合：Tailwind 做布局/间距，Modules 做组件样式。

---

### <span class="lv lv-3">高级</span> 打印样式与无障碍媒体查询

```css
/* 打印优化 */
@media print {
  *, *::before, *::after {
    background: transparent !important;
    color: #000 !important;
    box-shadow: none !important;
  }
  nav, .ads, .sidebar { display: none; }
  a[href]::after { content: " (" attr(href) ")"; }
  @page { margin: 2cm; }
}

/* 尊重暗色偏好 */
@media (prefers-color-scheme: dark) {
  :root { --bg: #1a1a1a; --text: #f0f0f0; }
}

/* 尊重减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

💡 `prefers-reduced-motion` 是无障碍硬要求，前庭功能障碍用户会因动画感到不适。

---

### <span class="lv lv-3">高级</span> 常见面试题

1. **盒模型区别？** `content-box` 的 width 仅含内容，`border-box` 包含 padding+border。推荐 `border-box`。

2. **BFC 是什么？** 块格式化上下文，内部布局不影响外部。触发条件：`overflow:hidden`/`display:flow-root`/`float`/`position:absolute|fixed`。

3. **如何实现水平垂直居中？** 四种方案：① flex `justify-content:center; align-items:center` ② grid `place-items:center` ③ `position:absolute` + `transform:translate(-50%,-50%)` ④ `margin:auto` + 定位四向 0。

4. **Flex 的 flex:1 代表什么？** `flex-grow:1; flex-shrink:1; flex-basis:0%`，占满剩余空间。

5. **position: sticky 原理？** 在滚动到阈值前表现为 relative，到达后表现为 fixed，需父容器有滚动空间且无 `overflow:hidden`。

6. **CSS 选择器优先级计算？** 行内(1,0,0,0) > ID(0,1,0,0) > 类/伪类/属性(0,0,1,0) > 元素/伪元素(0,0,0,1)。

7. **如何实现 1px 边框？** `transform:scaleY(0.5)` + `meta viewport` 缩放，或使用 `border:0.5px solid`（iOS 支持）。

8. **重排(reflow)与重绘(repaint)区别？** 重排：布局变化（width/height/margin）；重绘：外观变化（color/background）。重排必触发重绘，反之不然。

9. **CSS 变量与预处理器变量区别？** CSS 变量运行时、可继承、可 JS 操作；SCSS 变量编译时、不可继承。

10. **如何做暗色模式？** CSS 变量 + `[data-theme="dark"]` 切换 + `prefers-color-scheme` 媒体查询。

11. **:has() 解决什么问题？** 实现父选择器和前兄弟选择，如 `.card:has(img)` 选中含图片的卡片。

12. **如何避免 CSS 样式冲突？** BEM 命名 / CSS Modules / @layer 层叠层 / Shadow DOM。

13. **animation 与 transition 区别？** transition 需触发条件、两个状态；animation 自动运行、支持多关键帧、可循环。

14. **GPU 加速原理？** `transform`/`opacity` 触发合成层，跳过布局和绘制阶段，直接在 GPU 合成。`will-change` 提前声明。

15. **容器查询与媒体查询区别？** 媒体查询基于视口，容器查询基于父容器宽度，组件级响应更精准。

---

## <span class="lv lv-3">高级</span> 附录 B：2024–2026 CSS 现代新特性速览

> 💡 本附录聚焦 **Baseline 2024 / 2025 / 2026** 阶段全面可用（或即将可用）的现代 CSS 能力。目标：用**原生 CSS** 替代过去必须依赖 JS 或第三方库才能完成的场景。

### B.1 现代颜色空间：oklch / color() / color-mix / light-dark

> 🎯 目标：告别 RGB 心智负担，进入**感知均匀**（perceptually uniform）色彩时代。

```css
/* oklch(L C H / alpha) —— L 亮度 0~100%，C 彩度 0~0.4，H 色相 0~360 */
.brand {
  color: oklch(70% 0.15 200);            /* 青色 */
  background: oklch(70% 0.15 200 / 0.2); /* 带透明 */
}

/* 相较 hsl，oklch 同 L 值不同 H 视觉亮度真正一致，不会"黄色发亮" */
.palette { --p1: oklch(60% .18 0); --p2: oklch(60% .18 200); }

/* color() —— 广色域 P3，老屏降级 sRGB */
.hero {
  background: red;
  background: color(display-p3 1 0 0);
}

/* color-mix —— 原生混色，无需再定义 --brand-hover */
:root { --brand: oklch(65% 0.2 250); }
.btn:hover { background: color-mix(in oklch, var(--brand), black 20%); }
.badge    { background: color-mix(in srgb, var(--brand) 50%, transparent); }

/* light-dark —— 一行明暗双色 */
:root {
  color-scheme: light dark;
  --bg: light-dark(#fff, #0a0a0a);
  --fg: light-dark(#111, #f5f5f5);
}
body { background: var(--bg); color: var(--fg); }
```

> 💡 相较过去 `@media (prefers-color-scheme: dark) { … }` 重复声明变量，`light-dark()` 双值内联，DX 直线上升。

---

### B.2 View Transitions API（跨页/跨组件动画）

> 🎯 目标：SPA 路由切换 / MPA 页面跳转 / 单页面元素变化，都能用一致语法做**丝滑动画**，无需 Framer Motion。

#### B.2.1 SPA 单页面：JS 触发 + CSS 描述

```js
// JS 侧
document.startViewTransition(() => {
  // 任何 DOM 变化都可以：新增、删除、reorder、改文本
  list.reverse().forEach(item => container.appendChild(item));
});
```

```css
/* CSS 侧：默认整个页面淡入淡出 */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.4s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 命名过渡：为具体元素定制 */
.card {
  view-transition-name: card;   /* 必须唯一 */
}

::view-transition-old(card) {
  animation: fade-out 0.3s ease both;
}
::view-transition-new(card) {
  animation: fade-in 0.3s ease both;
}
```

#### B.2.2 MPA 多页面：纯 CSS 无需 JS

```css
/* 让 A.html → B.html 也能自动过渡（Chrome 126+） */
@view-transition {
  navigation: auto;
}

/* 保留导航栏不动，只让主体变化 */
nav        { view-transition-name: nav-main; }
main.hero  { view-transition-name: hero-block; }
```

> 💡 迁移经验：给每个"跨页复用"元素（LOGO、Hero 图、卡片）一个稳定的 `view-transition-name`，浏览器自动做 morph 动画。

---

### B.3 CSS Anchor Positioning（原生锚点定位，替代 Popper.js）

> 🎯 目标：Tooltip、Dropdown、Menu 等浮层，无需 Popper / Floating UI，纯 CSS 就能实现智能定位 + 边界翻转。

```html
<button class="btn" id="menu-btn">打开菜单</button>
<div class="menu" popover>
  <a>选项 1</a>
  <a>选项 2</a>
  <a>选项 3</a>
</div>
```

```css
/* 1. 锚点：给按钮起名字 */
.btn {
  anchor-name: --menu-btn;
}

/* 2. 定位元素：绑定锚点 + 定位 */
.menu {
  position: fixed;
  position-anchor: --menu-btn;

  /* 用 anchor() 函数指定：菜单顶部对齐按钮底部、左对齐 */
  top:  anchor(bottom);
  left: anchor(left);
  margin-top: 4px;

  /* 3. 边界智能翻转：如果下方装不下，翻到上方 */
  position-try-fallbacks:
    flip-block,                                 /* 上下翻 */
    flip-inline,                                /* 左右翻 */
    --top-right;                                /* 自定义 fallback */

  /* 4. 命名 try 规则 */
  position-try: --top-right {
    top: auto;
    bottom: anchor(top);
    left: auto;
    right: anchor(right);
  }
}
```

> 💡 Tooltip 的完整模式：`popover=auto` + `anchor-name` + `position-anchor` + `@starting-style`（见 B.4），可完全替换 tippy.js / floating-ui。

---

### B.4 @starting-style + transition-behavior: allow-discrete

> 🎯 目标：让 `display:none ↔ block`、`popover` 打开 —— 这些"离散属性"变化 —— 首次进入也能有过渡动画。

```css
/* 场景：popover 打开时"从 0 淡入" */
.dialog {
  opacity: 0;
  transform: translateY(-8px);

  /* 关键：告诉浏览器 display 也能参与 transition */
  transition:
    opacity 0.25s,
    transform 0.25s,
    display 0.25s allow-discrete,        /* 离散属性也 transition */
    overlay 0.25s allow-discrete;        /* top-layer 显隐 */
}

/* 打开态（popover open / dialog[open]） */
.dialog:popover-open {
  opacity: 1;
  transform: translateY(0);
}

/* 首次打开需要的起始状态 —— 否则第一次没动画 */
@starting-style {
  .dialog:popover-open {
    opacity: 0;
    transform: translateY(-8px);
  }
}
```

> 💡 心法：`@starting-style` 提供 **"打开瞬间那一帧"** 的初值；`allow-discrete` 让 display/overlay 也能插值；两者缺一不可。

---

### B.5 @property typed custom properties 进阶

> 🎯 目标：让 CSS 变量拥有**类型**，从而可以被 transition / animation 平滑插值（原生变量默认无法过渡）。

```css
/* 1. 声明带类型的变量 */
@property --angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@property --grad-c1 {
  syntax: '<color>';
  inherits: false;
  initial-value: oklch(70% 0.15 200);
}

/* 2. 用在渐变里 */
.card {
  background: conic-gradient(from var(--angle), var(--grad-c1), red, var(--grad-c1));
  transition: --angle 4s linear, --grad-c1 1s;
}

.card:hover {
  --angle: 360deg;
  --grad-c1: oklch(70% 0.2 20);   /* 平滑变色，非跳变 */
}

/* 3. 复杂动画：让边框呼吸 */
@keyframes breathe {
  to { --angle: 360deg; }
}
.pulse {
  animation: breathe 6s linear infinite;
}
```

---

### B.6 Cascade Layers @layer 与 Nesting 组合最佳实践

> 🎯 目标：**主动控制**优先级，告别 `!important`；配合原生嵌套写出接近 SCSS 的组件样式。

```css
/* 声明层级顺序：后声明层优先级更高 */
@layer reset, base, tokens, components, utilities;

@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; }
}

@layer tokens {
  :root {
    --radius-md: 8px;
    --color-brand: oklch(65% 0.2 250);
  }
}

@layer components {
  .btn {
    padding: 8px 16px;
    border-radius: var(--radius-md);
    background: var(--color-brand);
    color: white;

    &:hover  { filter: brightness(1.1); }
    &.-ghost {
      background: transparent;
      color: var(--color-brand);
      border: 1px solid currentColor;
    }

    @container (max-width: 320px) {
      & { padding: 6px 10px; font-size: 12px; }
    }
  }
}

@layer utilities {
  .hidden { display: none; }   /* 永远赢 */
}
```

> 💡 **与 Tailwind v4 的关系**：Tailwind v4 完全基于 `@layer theme/base/components/utilities`，理解原生 layer 后再看 Tailwind 非常直观。

---

### B.7 Container Queries 进阶：@container style() + container-type

> 🎯 目标：容器查询不仅能查**尺寸**，还能查**样式**；理解 `size` 与 `inline-size` 差异，避免布局崩溃。

```css
/* 场景：卡片内部按容器宽度改布局 */
.card-list {
  container-type: inline-size;   /* ★ 只监听 inline 方向，不改父高度 */
  container-name: card-list;
}

.card {
  display: grid;
  gap: 12px;
}

@container card-list (min-width: 480px) {
  .card { grid-template-columns: 120px 1fr; }
}

/* 高级：按 style value 响应 */
.theme-wrapper {
  container-name: theme;
  --mode: dark;
}

@container theme style(--mode: dark) {
  .card { background: oklch(20% 0 0); color: white; }
}
```

> 💡 **size vs inline-size**：
> - `size`：同时监听宽 + 高，需要显式高度，否则子元素 100% 高度会**死循环崩溃**。
> - `inline-size`：只监听行内方向（一般是宽度），最常用。**能用 `inline-size` 就别用 `size`。**

---

### B.8 Subgrid（真·嵌套网格对齐）

> 🎯 目标：让**子网格**继承父网格的轨道，实现"多张卡片内部标题/描述/按钮完美对齐"。

```html
<ul class="cards">
  <li class="card">
    <h3>短标题</h3>
    <p>描述 A</p>
    <button>Go</button>
  </li>
  <li class="card">
    <h3>一段非常非常非常长的标题占两行</h3>
    <p>描述 B 也长很多，多两行</p>
    <button>Go</button>
  </li>
</ul>
```

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  display: grid;
  /* ★ 三行：标题 / 描述 / 按钮，全部继承 cards 的 row 轨道 */
  grid-template-rows: subgrid;
  grid-row: span 3;
  gap: 8px;
}
```

> 效果：无论标题多长，所有卡片的"描述行"和"按钮行"都会**跨卡片对齐**，之前必须靠 JS 计算最大高度才能做到。

---

### B.9 :has() 高级组合选择（父/兄弟选择器）

> 🎯 目标：CSS 终于有了"根据子元素反向选择父元素"的能力，替代大量 JS class 切换。

```css
/* 1. 含图卡片加深阴影 */
.card:has(img) { box-shadow: 0 8px 24px rgba(0,0,0,.12); }

/* 2. 无子节点空态 */
.list:not(:has(> li))::before { content: '暂无数据'; color: #999; }

/* 3. 表单含错误 → 禁用提交按钮 */
form:has(:invalid) button[type=submit] { opacity: .5; pointer-events: none; }

/* 4. 含"更多"按钮的列表底部留空 */
.menu:has(.more-btn) { padding-bottom: 40px; }

/* 5. 输入 focus 时高亮 label */
.field:has(input:focus) label { color: var(--brand); }

/* 6. checkbox 选中改行样式 */
tr:has(input[type=checkbox]:checked) { background: oklch(95% .05 200); }

/* 7. 有 <video> 的 section 隐藏静态占位 */
section:has(video) .poster { display: none; }

/* 8. 兄弟选择：紧跟标题的段落缩进 */
h2:has(+ p) + p { text-indent: 2em; }
```

> 💡 `:has()` 是 2023 底才全面 baseline 的选择器，2025 之后几乎所有生产环境可放心使用。

---

### B.10 scroll-driven animations（scroll() / view() 时间轴）

> 🎯 目标：滚动进度条、视差、Reveal 效果，**不再需要 IntersectionObserver + JS**。

```css
/* 场景 1：顶部阅读进度条，跟随文档滚动 */
.progress-bar {
  position: fixed; top: 0; left: 0;
  height: 3px; width: 100%;
  background: var(--brand);
  transform-origin: left;
  transform: scaleX(0);

  animation: grow linear;
  animation-timeline: scroll(root block);  /* 绑定根滚动条 */
}
@keyframes grow { to { transform: scaleX(1); } }
```

```css
/* 场景 2：图片进入视口时淡入 + 上滑 */
.reveal {
  opacity: 0;
  transform: translateY(30px);

  animation: reveal linear both;
  animation-timeline: view();               /* 绑定元素自身"视口穿越进度" */
  animation-range: entry 10% cover 40%;     /* 从入场 10% 到覆盖 40% 完成 */
}

@keyframes reveal {
  to { opacity: 1; transform: none; }
}
```

> 💡 心法：
> - `scroll()` = 绑定"某个滚动容器"的进度。
> - `view()` = 绑定"元素自己在视口中的进度"。
> - `animation-range` 决定动画在时间轴的哪段发生（entry / exit / cover / contain）。

---

## <span class="lv lv-3">高级</span> 附录 B 综合速查表

| 特性 | 一句话作用 | Baseline 年份 | 替代了什么 |
|---|---|---|---|
| `oklch()` / `color-mix()` | 感知均匀色 + 原生混色 | 2023 | 手写变量矩阵 |
| `light-dark()` | 一行明暗双色 | 2024 | `@media prefers-color-scheme` 重复代码 |
| View Transitions | 声明式跨页动画 | 2024–2026 | Framer Motion / gsap page transition |
| Anchor Positioning | 原生锚点定位 | 2024–2025 | Popper.js / Floating UI |
| `@starting-style` + `allow-discrete` | display 也能 transition | 2024 | JS 手动加 class 触发 |
| `@property` | 变量参与动画 | 2024 | Houdini / JS 轮询 |
| `@layer` + Nesting | 主动控制优先级 | 2023–2024 | `!important` / BEM 深嵌套 |
| Container Queries | 组件级响应 | 2023 | 媒体查询 + JS resize |
| Subgrid | 跨子网格对齐 | 2023 | JS 计算最大高度 |
| `:has()` | 父/兄弟选择 | 2023–2024 | JS class 切换 |
| Scroll-driven Animations | 滚动/视口驱动动画 | 2024–2026 | IntersectionObserver + JS |

> 🎯 **学习秘诀**：**"View Transitions + Anchor Positioning + :has() + oklch"** 这四件套，2025 年基本可以让你少装 5 个 npm 依赖 —— 阅读器、Tooltip 库、Popover 库、颜色库、动画库全部原生化。
