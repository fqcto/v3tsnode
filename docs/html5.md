# HTML5 全阶段学习手册

> 本手册面向前端从零基础到高级实战的完整学习路径，覆盖 HTML5 从标签基础、语义化、多媒体、表单校验，到 Web Components、Service Worker、性能优化与安全实践的方方面面。所有代码示例均可直接复制运行，配合浏览器 DevTools 边学边练效果最佳。

**适合读者**：前端初学者、想系统补齐 HTML5 知识盲点的中级开发、准备大厂前端面试者。

**学习建议**：初级章节动手敲一遍；中级章节结合真实项目改造练习；高级章节建议配合小 Demo（PWA、拖拽上传、组件库）落地。

## 目录

- [一、🟢 初级入门](#一-初级入门)
  - [1.1 HTML 是什么](#11-html-是什么)
  - [1.2 第一个 HTML 页面](#12-第一个-html-页面)
  - [1.3 基础标签](#13-基础标签)
  - [1.4 文本格式化标签](#14-文本格式化标签)
  - [1.5 列表](#15-列表)
  - [1.6 超链接 a](#16-超链接-a)
  - [1.7 图片与响应式图片](#17-图片与响应式图片)
  - [1.8 表格](#18-表格)
  - [1.9 表单基础](#19-表单基础)
  - [1.10 块级 vs 行内元素](#110-块级-vs-行内元素)
  - [1.11 HTML 实体字符](#111-html-实体字符)
- [二、🟡 中级进阶](#二-中级进阶)
  - [2.1 语义化标签](#21-语义化标签)
  - [2.2 HTML5 新增表单特性](#22-html5-新增表单特性)
  - [2.3 表单校验 API](#23-表单校验-api)
  - [2.4 多媒体 audio 与 video](#24-多媒体-audio-与-video)
  - [2.5 iframe 深入](#25-iframe-深入)
  - [2.6 全局属性](#26-全局属性)
  - [2.7 Meta 标签实战](#27-meta-标签实战)
  - [2.8 无障碍 a11y 基础](#28-无障碍-a11y-基础)
  - [2.9 Web Storage](#29-web-storage)
  - [2.10 Canvas 基础](#210-canvas-基础)
  - [2.11 SVG 基础](#211-svg-基础)
- [三、🔴 高级实战](#三-高级实战)
  - [3.1 Web Components 全家桶](#31-web-components-全家桶)
  - [3.2 IndexedDB 基础封装](#32-indexeddb-基础封装)
  - [3.3 Service Worker 与 PWA](#33-service-worker-与-pwa)
  - [3.4 Web Workers 三兄弟](#34-web-workers-三兄弟)
  - [3.5 实时通信对比](#35-实时通信对比)
  - [3.6 File API 与切片上传](#36-file-api-与切片上传)
  - [3.7 Drag and Drop API](#37-drag-and-drop-api)
  - [3.8 关键渲染路径与脚本加载](#38-关键渲染路径与脚本加载)
  - [3.9 性能优化实战](#39-性能优化实战)
  - [3.10 前端安全清单](#310-前端安全清单)
  - [3.11 高频面试题速答](#311-高频面试题速答)

---

## 一、🟢 初级入门

### <span class="lv lv-1">初级</span> 1.1 HTML 是什么

HTML（HyperText Markup Language，超文本标记语言）是构建网页**结构**的骨架。它不是编程语言，而是一种"标记"语言：用一对对尖括号包围的**标签**来描述一段内容"是什么"。

前端三剑客的分工：

| 技术 | 定位 | 类比 |
|------|------|------|
| HTML | 结构 / 内容 | 房子的墙、门、窗 |
| CSS  | 表现 / 样式 | 墙纸、家具、灯光 |
| JS   | 行为 / 交互 | 电灯开关、水龙头 |

浏览器渲染 HTML 的极简流程（细节见 3.8 节）：

```
HTML 字符流
   │  解析
   ▼
DOM 树 ──┐
         ├──► Render Tree ──► Layout ──► Paint ──► Composite ──► 屏幕
CSSOM ───┘
```

> 💡 记住：HTML 描述"是什么"，CSS 描述"长什么样"，JS 描述"怎么动"。

### <span class="lv lv-1">初级</span> 1.2 第一个 HTML 页面

准备一个纯文本编辑器（推荐 VS Code），新建 `hello.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Hello HTML5</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>这是我的第一个 HTML 页面。</p>
</body>
</html>
```

关键点：

- `<!DOCTYPE html>`：告诉浏览器"用 HTML5 标准模式解析"。缺失会进入怪异模式（quirks mode），盒模型、行内块等表现都会出问题。
- `lang="zh-CN"`：帮助屏幕阅读器、翻译服务、搜索引擎识别页面语言。
- `<meta charset="UTF-8">`：**必须放在 head 的前 1024 字节内**，否则浏览器可能已用错编码解析导致乱码。
- `<title>`：显示在浏览器标签页与搜索引擎结果标题里。

> ⚠️ 陷阱：文件保存时如果用了 GBK 编码，但声明 UTF-8，中文会乱码。VS Code 右下角可切换编码。

> 🎯 面试点：DOCTYPE 的作用 → 触发标准模式，避免怪异模式。

### <span class="lv lv-1">初级</span> 1.3 基础标签

```html
<h1>一级标题（页面通常只写一个）</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<!-- h4 h5 h6 依次递减，一般到 h4 就够用 -->

<p>这是一个段落。段落之间浏览器会自动留白。</p>
<p>再来一个段落。<br>用 br 强制换行（不建议滥用）。</p>

<hr>
<!-- 上面是一条水平分隔线，语义上表示话题转换 -->

<!-- 这是 HTML 注释，不会显示在页面上 -->
```

**标题选择原则**：

1. 每个页面**只应有一个 `<h1>`**（表示页面主题）。
2. 标题层级应逐级递进，不要跳级（h1 之后不要直接 h3），有助于 SEO 与屏幕阅读器导航。
3. 不要为了"字大字小"选标题标签，字号请交给 CSS。

> 💡 记住：`<br>` 是换行不是段落分隔，段落用 `<p>`；`<hr>` 语义是"话题分隔"，不是画装饰线。

### <span class="lv lv-1">初级</span> 1.4 文本格式化标签

| 标签 | 语义 | 默认样式 |
|------|------|----------|
| `<strong>` | **重要**（语气强调） | 粗体 |
| `<b>` | 仅视觉粗，无语义 | 粗体 |
| `<em>` | **强调**（口语重读） | 斜体 |
| `<i>` | 仅视觉斜，无语义 | 斜体 |
| `<mark>` | 高亮 / 标记（如搜索关键词） | 黄色背景 |
| `<small>` | 副信息、免责声明 | 小一号 |
| `<sub>` / `<sup>` | 下标 / 上标 | H₂O、x² |
| `<del>` / `<ins>` | 删除的 / 新增的内容 | 删除线 / 下划线 |
| `<code>` | 一段代码片段 | 等宽字体 |
| `<kbd>` | 键盘按键 | 等宽字体 |
| `<pre>` | 保留空白与换行的原文本 | 等宽、保留格式 |

```html
<p>请按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 复制。</p>
<p>公式：E = mc<sup>2</sup>，水分子：H<sub>2</sub>O。</p>
<p><del>原价 ¥199</del> <ins>现价 ¥99</ins></p>
<p>使用 <code>Array.prototype.map</code> 遍历数组。</p>
```

> 🎯 面试点：`<strong>` vs `<b>`、`<em>` vs `<i>` 的区别在**语义**——前者有语义、屏幕阅读器会重读；后者只是视觉效果。SEO 与无障碍优先前者。

### <span class="lv lv-1">初级</span> 1.5 列表

```html
<!-- 无序列表 -->
<ul>
  <li>苹果</li>
  <li>香蕉</li>
  <li>橙子</li>
</ul>

<!-- 有序列表（start 起始编号，reversed 倒序，type 编号类型） -->
<ol start="3" type="A">
  <li>第一步</li>
  <li>第二步</li>
</ol>

<!-- 定义列表：术语 + 解释 -->
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language，超文本标记语言。</dd>
  <dt>CSS</dt>
  <dd>Cascading Style Sheets，层叠样式表。</dd>
</dl>
```

**嵌套列表**：

```html
<ul>
  <li>前端
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
  </li>
  <li>后端</li>
</ul>
```

> 💡 记住：导航菜单、面包屑、Tab 等本质都是列表，用 `<ul>`/`<ol>` 更语义化，也方便无障碍读屏。

### <span class="lv lv-1">初级</span> 1.6 超链接 a

```html
<!-- 外链，新标签打开 -->
<a href="https://developer.mozilla.org"
   target="_blank"
   rel="noopener noreferrer">MDN 文档</a>

<!-- 页内锚点跳转 -->
<a href="#section-2">跳到第二节</a>
<h2 id="section-2">第二节</h2>

<!-- 邮件 / 电话 -->
<a href="mailto:me@example.com">给我发邮件</a>
<a href="tel:+8613800138000">拨打电话</a>

<!-- 下载文件（同源生效） -->
<a href="/files/report.pdf" download="季度报告.pdf">下载报告</a>
```

**`rel="noopener noreferrer"` 的意义**：

- `noopener`：新窗口的 `window.opener` 会是 `null`，防止子页面通过 `opener.location` 劫持父页跳转（钓鱼攻击）。
- `noreferrer`：不发送 Referer 请求头，隐藏来源。
- 现代浏览器对 `target="_blank"` 已默认开启 `noopener`，但**兼容旧浏览器仍建议显式加上**。

> ⚠️ 陷阱：`href="javascript:void(0)"` 是老写法，现在应用 `<button>` 或用 `preventDefault()` 处理。

> 🎯 面试点：`target="_blank"` 为什么必须配 `rel="noopener"` → 防 tabnabbing 钓鱼攻击。

### <span class="lv lv-1">初级</span> 1.7 图片与响应式图片

```html
<!-- 基础用法，alt 必写（无障碍 + 图片加载失败兜底） -->
<img src="/img/logo.png" alt="公司 Logo" width="120" height="40">

<!-- 懒加载 + 异步解码 -->
<img src="/img/big.jpg" alt="风景照" loading="lazy" decoding="async">

<!-- srcset 根据 DPR 选择不同倍图 -->
<img src="/img/pic.jpg"
     srcset="/img/pic.jpg 1x, /img/pic@2x.jpg 2x, /img/pic@3x.jpg 3x"
     alt="产品图">

<!-- picture 根据媒体查询选源，支持格式回退 -->
<picture>
  <source type="image/avif" srcset="/img/hero.avif">
  <source type="image/webp" srcset="/img/hero.webp">
  <source media="(max-width: 600px)" srcset="/img/hero-mobile.jpg">
  <img src="/img/hero.jpg" alt="首页大图">
</picture>
```

**alt 写法规范**：

- 装饰性图片：`alt=""`（读屏跳过），不要省略 `alt` 属性本身。
- 信息图：简明描述图片信息，如 `alt="2025 年 Q1 销售额环比增长 30%"`。
- 图标按钮：写出功能，如 `alt="搜索"`，或用 `aria-label`。

> 💡 记住：`width`/`height` 属性建议写上，浏览器可**预留空间**避免 CLS（布局偏移），提升 Core Web Vitals。

### <span class="lv lv-1">初级</span> 1.8 表格

```html
<table>
  <caption>2025 年销售数据</caption>
  <colgroup>
    <col style="width: 120px">
    <col span="2" style="background: #f7f7f7">
  </colgroup>
  <thead>
    <tr>
      <th scope="col">季度</th>
      <th scope="col">销售额</th>
      <th scope="col">同比</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Q1</th>
      <td>¥1,200 万</td>
      <td>+15%</td>
    </tr>
    <tr>
      <th scope="row">Q2</th>
      <td>¥1,380 万</td>
      <td>+18%</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">合计</th>
      <td>¥2,580 万</td>
      <td>—</td>
    </tr>
  </tfoot>
</table>
```

**要点**：

- `<caption>` 是表格标题，对无障碍与 SEO 都有用。
- `scope="col|row"` 让屏幕阅读器知道表头对应的方向。
- `<thead>/<tbody>/<tfoot>` 结构化分区，还便于滚动固定表头。
- 表格是**用来展示二维数据**的，**不要用来做布局**（这是十几年前的做法，早已被 Flex/Grid 淘汰）。

> ⚠️ 陷阱：合并单元格用 `colspan` / `rowspan`，不要用嵌套表格。

### <span class="lv lv-1">初级</span> 1.9 表单基础

```html
<form action="/api/submit" method="POST" autocomplete="on">
  <p>
    <label for="username">用户名：</label>
    <input id="username" name="username" type="text" required>
  </p>

  <p>
    <label for="pwd">密码：</label>
    <input id="pwd" name="password" type="password" minlength="6">
  </p>

  <p>
    <label for="email">邮箱：</label>
    <input id="email" name="email" type="email">
  </p>

  <p>
    <label for="age">年龄：</label>
    <input id="age" name="age" type="number" min="1" max="120">
  </p>

  <p>
    <label for="birth">生日：</label>
    <input id="birth" name="birth" type="date">
  </p>

  <p>
    性别：
    <label><input type="radio" name="gender" value="m"> 男</label>
    <label><input type="radio" name="gender" value="f"> 女</label>
  </p>

  <p>
    爱好：
    <label><input type="checkbox" name="hobby" value="code"> 编程</label>
    <label><input type="checkbox" name="hobby" value="music"> 音乐</label>
  </p>

  <p>
    <label for="avatar">头像：</label>
    <input id="avatar" name="avatar" type="file" accept="image/*">
  </p>

  <p>
    <label for="city">城市：</label>
    <select id="city" name="city">
      <option value="">请选择</option>
      <option value="bj">北京</option>
      <option value="sh">上海</option>
    </select>
  </p>

  <p>
    <label for="bio">简介：</label>
    <textarea id="bio" name="bio" rows="4" cols="40"></textarea>
  </p>

  <p>
    <button type="submit">提交</button>
    <button type="reset">重置</button>
  </p>
</form>
```

**核心概念**：

- `name` 是提交给后端的字段名，**没有 name 的表单控件不会被提交**。
- `<label for="id">` 与控件的 `id` 关联，点击 label 可聚焦控件；也可把控件套在 label 里省掉 `for`。
- `method="GET"` 参数拼在 URL 上（有长度限制）；`POST` 放请求体（大文件用 POST + multipart）。
- 单选 radio 必须**同名**才互斥。

> 🎯 面试点：`type="submit"` 的 button 默认会触发表单提交，事件处理里如果不阻止会导致页面刷新——写"仅按钮"时记得 `type="button"`。

### <span class="lv lv-1">初级</span> 1.10 块级 vs 行内元素

传统分类（HTML5 已引入更细的"内容模型"，但这仍是入门必备心智模型）：

| 类型 | 特点 | 常见标签 |
|------|------|----------|
| 块级 block | 独占一行、可设宽高 | `div p h1~h6 ul ol li table form section` |
| 行内 inline | 与其他元素同行、宽高由内容决定 | `span a strong em code img input label` |
| 行内块 inline-block | 同行 + 可设宽高 | `img input button`（部分） |

`<div>` 与 `<span>` 是**无语义容器**：

- `<div>` 块级，用来划分区块（有更语义标签时优先用后者，见 2.1）。
- `<span>` 行内，用来包裹一小段文本做样式或事件绑定。

```html
<p>今天天气 <span style="color:red">很热</span>，注意防暑。</p>
<div class="card">
  <h3>标题</h3>
  <p>内容...</p>
</div>
```

> 💡 记住：CSS `display` 属性可以改变元素的显示类型，但**不改变其内容模型**（例如 `<p>` 里不能放 `<div>`，即使把 div 改成 inline）。

### <span class="lv lv-1">初级</span> 1.11 HTML 实体字符

某些字符在 HTML 中有特殊含义（如 `<` 表示标签开始），要显示原样需用实体：

| 字符 | 实体名 | 实体号 |
|------|--------|--------|
| `<` | `&lt;` | `&#60;` |
| `>` | `&gt;` | `&#62;` |
| `&` | `&amp;` | `&#38;` |
| `"` | `&quot;` | `&#34;` |
| `'` | `&apos;` | `&#39;` |
| 空格（不换行） | `&nbsp;` | `&#160;` |
| 版权 © | `&copy;` | `&#169;` |
| 注册 ® | `&reg;` | `&#174;` |

```html
<p>要写 &lt;div&gt; 标签，用 &amp;lt; 转义。</p>
<p>价格：&yen;99&nbsp;&nbsp;（含税）</p>
```

> ⚠️ 陷阱：URL 里 `&` 也建议写成 `&amp;`（否则 `&copy` 可能被浏览器误当实体）。

---

## 二、🟡 中级进阶

### <span class="lv lv-2">中级</span> 2.1 语义化标签

HTML5 引入了一批**表意明确**的容器，替代满屏 `<div class="header">` 的写法：

```html
<body>
  <header>
    <h1>站点名</h1>
    <nav>
      <ul>
        <li><a href="/">首页</a></li>
        <li><a href="/blog">博客</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h2>文章标题</h2>
        <p><time datetime="2026-07-01">2026-07-01</time> · 作者</p>
      </header>

      <section>
        <h3>小节一</h3>
        <p>...</p>
      </section>

      <figure>
        <pre><code>function add(a,b){return a+b}</code></pre>
        <figcaption>示例：加法函数</figcaption>
      </figure>

      <footer>
        <address>联系我：me@example.com</address>
      </footer>
    </article>

    <aside>
      <h3>相关文章</h3>
      <ul>...</ul>
    </aside>
  </main>

  <footer>
    <small>&copy; 2026 MySite</small>
  </footer>
</body>
```

**语义化收益**：

1. **SEO**：搜索引擎更容易识别页面主要内容与导航。
2. **无障碍**：屏幕阅读器可提供"跳到主内容"、"跳到导航"等快捷键。
3. **可维护性**：结构自描述，无需读 class 就能理解。
4. **RSS / 阅读模式**：浏览器阅读模式主要抓 `<article>` 里的内容。

`<section>` vs `<article>` vs `<div>`：

- `<article>`：**独立可分发**的内容（一篇博客、一条评论、一张商品卡）。
- `<section>`：**主题相关**的一段（通常有 h2~h6 标题）。
- `<div>`：无语义，仅用于样式/脚本分组。

> 🎯 面试点：`<time datetime="2026-07-01T10:00:00+08:00">` 里 `datetime` 是给机器读的 ISO 8601 格式。

### <span class="lv lv-2">中级</span> 2.2 HTML5 新增表单特性

```html
<form>
  <input type="text"
         placeholder="请输入昵称"
         required
         autofocus
         autocomplete="nickname"
         pattern="[一-龥a-zA-Z0-9]{2,10}"
         title="2-10 位中英文数字">

  <input type="number" min="1" max="100" step="0.5">

  <!-- 关联 datalist 提供建议但可自由输入 -->
  <input list="cities" name="city">
  <datalist id="cities">
    <option value="北京"></option>
    <option value="上海"></option>
    <option value="深圳"></option>
  </datalist>

  <!-- output 展示脚本或计算结果 -->
  <input type="range" id="r" min="0" max="100" value="50"
         oninput="out.value=r.value">
  <output name="out" for="r">50</output>

  <!-- 进度：已知总量用 progress，度量值用 meter -->
  <progress value="30" max="100">30%</progress>
  <meter value="0.7" min="0" max="1" low="0.3" high="0.7" optimum="1">70%</meter>
</form>
```

**新增 input type 一览**：

| type | 用途 | 移动端键盘 |
|------|------|-----------|
| email | 邮箱 | 带 @ 键盘 |
| tel | 电话 | 数字键盘 |
| url | 网址 | 带 .com 键盘 |
| number | 数字 | 数字键盘 |
| date / time / datetime-local / month / week | 日期时间 | 原生选择器 |
| color | 颜色 | 原生取色器 |
| range | 滑块 | — |
| search | 搜索框（带清除按钮） | — |

> 💡 记住：`autocomplete` 值有语义（`name email tel address-line1 cc-number one-time-code` 等），写对了浏览器/密码管理器/系统会更聪明地填充。

### <span class="lv lv-2">中级</span> 2.3 表单校验 API

浏览器内置了 Constraint Validation API：

```html
<form id="f" novalidate>
  <input id="email" type="email" required>
  <span class="err"></span>
  <button>提交</button>
</form>

<script>
  const form  = document.getElementById('f');
  const email = document.getElementById('email');
  const err   = form.querySelector('.err');

  // 自定义校验规则
  email.addEventListener('input', () => {
    if (email.value.endsWith('@qq.com')) {
      email.setCustomValidity('暂不支持 QQ 邮箱');
    } else {
      email.setCustomValidity(''); // 清空错误
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      err.textContent = email.validationMessage;
      return;
    }
    err.textContent = '';
    console.log('提交', email.value);
  });
</script>
```

**ValidityState 对象**（`input.validity`）常用字段：

| 字段 | 含义 |
|------|------|
| valueMissing | 空但 required |
| typeMismatch | 类型不符（如 email 格式错） |
| patternMismatch | 不匹配 pattern 正则 |
| tooLong / tooShort | 超过 maxlength / 少于 minlength |
| rangeUnderflow / rangeOverflow | 小于 min / 大于 max |
| stepMismatch | 不符合 step |
| customError | setCustomValidity 设置了非空字符串 |
| valid | 全部通过 |

配合 CSS 伪类：

```css
input:required { border-left: 3px solid orange; }
input:valid    { border-color: green; }
input:invalid  { border-color: red; }
input:user-invalid { /* 仅用户交互后才生效，体验更好 */ }
```

> ⚠️ 陷阱：`novalidate` 属性会禁用浏览器默认提示气泡，但 API 仍可用；生产环境常常自定义错误 UI，会加上 novalidate。

> 🎯 面试点：`checkValidity()` 只返回布尔值不触发事件；`reportValidity()` 会额外显示原生提示。

### <span class="lv lv-2">中级</span> 2.4 多媒体 audio 与 video

```html
<video controls
       width="640"
       poster="/img/cover.jpg"
       preload="metadata"
       playsinline
       muted>
  <source src="/media/movie.webm" type="video/webm">
  <source src="/media/movie.mp4"  type="video/mp4">
  <track kind="subtitles" src="/media/zh.vtt" srclang="zh" label="中文" default>
  <track kind="subtitles" src="/media/en.vtt" srclang="en" label="English">
  您的浏览器不支持 video 标签。
</video>

<audio controls src="/media/song.mp3" loop></audio>
```

**关键属性**：

| 属性 | 说明 |
|------|------|
| controls | 显示原生播放控件 |
| autoplay | 自动播放（现代浏览器要求同时 `muted` 才允许） |
| muted | 静音 |
| loop | 循环 |
| poster | 视频封面图（视频未播时展示） |
| preload | `none / metadata / auto`，控制预加载 |
| playsinline | iOS 上不强制全屏 |
| crossorigin | CORS 抓取（配合 canvas 截帧、字幕跨域） |

`.vtt` 字幕文件示例：

```
WEBVTT

00:00:01.000 --> 00:00:03.500
你好，欢迎观看

00:00:04.000 --> 00:00:06.000
今天的主题是 HTML5
```

**JS 控制**：

```js
const v = document.querySelector('video');
v.play();          // 返回 Promise，需捕获用户手势限制
v.pause();
v.currentTime = 30; // 跳到 30 秒
v.playbackRate = 1.5;
v.addEventListener('ended', () => console.log('播完'));
```

> 💡 记住：自动播放策略——**有声音 + 无用户手势 = 会被拒**。想自动播先 `muted`。

### <span class="lv lv-2">中级</span> 2.5 iframe 深入

```html
<iframe src="https://example.com/widget"
        title="第三方小部件"
        width="600" height="400"
        loading="lazy"
        referrerpolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin"
        allow="camera; microphone; fullscreen">
</iframe>
```

**sandbox** 是白名单机制，**不写值时禁用全部特性**（脚本、表单、插件、同源、弹窗都禁）。常用值：

| 值 | 允许 |
|------|------|
| allow-scripts | 执行 JS |
| allow-same-origin | 视为同源（不加则视为 null origin） |
| allow-forms | 提交表单 |
| allow-popups | window.open |
| allow-modals | alert/confirm/prompt |
| allow-top-navigation | 修改顶层窗口 URL |

**跨域通信用 postMessage**：

```js
// 父页
const iframe = document.querySelector('iframe');
iframe.contentWindow.postMessage({ type: 'init', token: 'xxx' },
                                 'https://example.com');

window.addEventListener('message', (e) => {
  if (e.origin !== 'https://example.com') return; // 必校验
  console.log('来自子页:', e.data);
});

// 子页
window.parent.postMessage({ type: 'ready' }, '*');
```

> ⚠️ 陷阱：`e.origin` 必须严格校验，否则任何页面都能伪装发消息导致 XSS/CSRF。

### <span class="lv lv-2">中级</span> 2.6 全局属性

所有 HTML 元素都能用的属性：

| 属性 | 用途 |
|------|------|
| `id` / `class` | 唯一标识 / 类选择器 |
| `style` | 内联样式 |
| `title` | 悬浮 tooltip |
| `hidden` | 等价 `display:none`（有语义） |
| `tabindex` | 键盘 Tab 顺序（0 加入、-1 只编程聚焦、>0 强插不推荐） |
| `contenteditable` | 让元素可编辑 |
| `draggable` | 是否可拖拽 |
| `spellcheck` | 拼写检查 |
| `translate` | `yes / no`，是否交给翻译工具翻 |
| `accesskey` | 快捷键（浏览器差异大，慎用） |
| `data-*` | 自定义数据 |
| `lang` / `dir` | 语言 / 文本方向 |

**data-\* 与 dataset**：

```html
<button id="btn" data-user-id="42" data-role="admin">操作</button>

<script>
  const btn = document.getElementById('btn');
  console.log(btn.dataset.userId); // "42"  (kebab → camelCase)
  console.log(btn.dataset.role);   // "admin"
  btn.dataset.status = 'active';   // 反向写入
</script>
```

**contenteditable + execCommand 已废弃**，现代富文本请用 `Selection` / `Range` API 或第三方（TipTap、ProseMirror、Slate）。

> 🎯 面试点：`hidden` vs `display:none` 的区别——`hidden` 有语义（对无障碍/搜索引擎表示"这块暂不呈现"），且优先级最低容易被 CSS 覆盖。

### <span class="lv lv-2">中级</span> 2.7 Meta 标签实战

```html
<head>
  <meta charset="UTF-8">

  <!-- 移动端必备：视口 -->
  <meta name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover">

  <!-- 描述（搜索结果摘要） -->
  <meta name="description" content="HTML5 全阶段学习手册，覆盖从入门到实战。">

  <!-- 搜索引擎爬取指令 -->
  <meta name="robots" content="index, follow, max-image-preview:large">

  <!-- Referer 策略 -->
  <meta name="referrer" content="strict-origin-when-cross-origin">

  <!-- 移动端浏览器地址栏主题色 -->
  <meta name="theme-color" content="#1677ff">

  <!-- iOS 全屏 & 状态栏 -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

  <!-- Open Graph（分享到社交平台的卡片） -->
  <meta property="og:title"       content="HTML5 学习手册">
  <meta property="og:description" content="覆盖初中高级。">
  <meta property="og:image"       content="https://site.com/og.png">
  <meta property="og:type"        content="article">
  <meta property="og:url"         content="https://site.com/html5">

  <!-- Twitter Card -->
  <meta name="twitter:card"  content="summary_large_image">
  <meta name="twitter:site"  content="@myhandle">
  <meta name="twitter:title" content="HTML5 学习手册">

  <!-- 兼容 IE，让它用 Edge 内核（老系统偶尔遇到） -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
```

viewport 关键片段说明：

- `width=device-width`：视口宽度 = 设备宽度（响应式必需）。
- `initial-scale=1`：初始缩放比 1，避免 iOS 横屏放大。
- `viewport-fit=cover`：全面屏适配 `env(safe-area-inset-*)`。
- **不建议** `user-scalable=no` / `maximum-scale=1`：会破坏无障碍缩放，苹果 Safari 也会忽略。

> 💡 记住：Open Graph 是 Facebook 定的协议，但微信、微博、Slack、Discord 也都用。

### <span class="lv lv-2">中级</span> 2.8 无障碍 a11y 基础

**基本原则**：能用原生语义标签就别自己造轮子。

```html
<!-- 差：div 假按钮，键盘用不了，读屏读不出 -->
<div class="btn" onclick="save()">保存</div>

<!-- 好：真按钮，天生 role=button、可 Tab、可回车/空格触发 -->
<button type="button" onclick="save()">保存</button>
```

**ARIA 常用**：

| 属性 | 用途 |
|------|------|
| `role="button|dialog|tab|alert|..."` | 显式角色 |
| `aria-label` | 无可见文本时提供名称（图标按钮） |
| `aria-labelledby` | 引用其他元素 id 作为名称 |
| `aria-describedby` | 补充描述 |
| `aria-hidden="true"` | 对读屏隐藏（视觉仍在） |
| `aria-expanded / aria-selected / aria-checked` | 状态 |
| `aria-live="polite|assertive"` | 动态区域播报 |

```html
<button aria-label="关闭对话框" onclick="close()">
  <svg aria-hidden="true" ...>...</svg>
</button>

<div role="alert" aria-live="assertive" id="toast"></div>
```

**键盘可达性**：

- 交互元素必须能 Tab 到达（`tabindex="0"` 或用原生 button/a/input）。
- 明显的 `:focus-visible` 样式，不要 `outline:none` 一刀切。
- 弹窗打开时焦点应移入，关闭时归还。

**alt 五字诀**：**准、简、无冗、无"图片"、装饰空**。别写 `alt="图片"`、`alt="123.jpg"`。

> 🎯 面试点：a11y 三大受益方——**残障用户**（读屏、键盘、放大）+ **SEO 爬虫** + **临时受损用户**（弱光下手机、单手带娃）。

### <span class="lv lv-2">中级</span> 2.9 Web Storage

```js
// 存
localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Tom' }));
// 取
const user = JSON.parse(localStorage.getItem('user') || 'null');
// 删
localStorage.removeItem('user');
// 清空当前域
localStorage.clear();

// sessionStorage 同 API，但仅当前标签页有效，关闭即清空
sessionStorage.setItem('draft', '临时草稿');

// 跨标签页监听（同源）
window.addEventListener('storage', (e) => {
  console.log('key:', e.key, 'old:', e.oldValue, 'new:', e.newValue);
});
```

**对比表**：

| 特性 | Cookie | localStorage | sessionStorage | IndexedDB |
|------|--------|--------------|----------------|-----------|
| 容量 | 4KB | ~5-10MB | ~5-10MB | 几百 MB~GB |
| 生命周期 | 可设 expires | 永久（手动清） | 标签页级 | 永久 |
| 每次请求携带 | ✅ 自动 | ❌ | ❌ | ❌ |
| API 同异步 | 同步 | 同步 | 同步 | 异步 |
| 支持结构 | 字符串 | 字符串 | 字符串 | 结构化克隆 |

**常见坑**：

1. 存储值只能是字符串，对象要 `JSON.stringify`；`Date`/`Function`/`RegExp` 序列化会丢失。
2. 满了会抛 `QuotaExceededError`，写入需 try/catch。
3. 隐私模式下容量可能是 0 或抛错。
4. **不要存敏感数据**（token 有 XSS 风险，建议 HttpOnly Cookie）。

> ⚠️ 陷阱：`storage` 事件只在**其他标签页**触发，本标签页写入不会通知自己。

### <span class="lv lv-2">中级</span> 2.10 Canvas 基础

```html
<canvas id="c" width="400" height="300" style="border:1px solid #ccc"></canvas>

<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');

  // 矩形
  ctx.fillStyle = '#1677ff';
  ctx.fillRect(20, 20, 100, 60);
  ctx.strokeStyle = 'red';
  ctx.strokeRect(140, 20, 100, 60);

  // 路径
  ctx.beginPath();
  ctx.moveTo(20, 120);
  ctx.lineTo(120, 200);
  ctx.lineTo(220, 120);
  ctx.closePath();
  ctx.lineWidth = 2;
  ctx.stroke();

  // 圆
  ctx.beginPath();
  ctx.arc(300, 160, 40, 0, Math.PI * 2);
  ctx.fillStyle = 'orange';
  ctx.fill();

  // 文字
  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#333';
  ctx.fillText('Hello Canvas', 20, 260);

  // 渐变
  const g = ctx.createLinearGradient(0, 0, 400, 0);
  g.addColorStop(0, 'red');
  g.addColorStop(1, 'blue');
  ctx.fillStyle = g;
  ctx.fillRect(0, 280, 400, 10);

  // 画图片
  const img = new Image();
  img.onload = () => ctx.drawImage(img, 260, 200, 80, 60);
  img.src = '/img/logo.png';
</script>
```

**关键 API 分类**：

- 状态：`save() / restore() / translate / rotate / scale`
- 样式：`fillStyle / strokeStyle / lineWidth / lineCap / lineJoin`
- 路径：`beginPath / moveTo / lineTo / arc / quadraticCurveTo / bezierCurveTo / closePath / fill / stroke / clip`
- 位图：`drawImage / getImageData / putImageData`
- 导出：`canvas.toDataURL('image/png') / canvas.toBlob(cb)`

> 💡 记住：Canvas 是**位图**，放大失真，适合游戏、大量元素、粒子、图表；DOM 数量多时用它可显著减少节点。

### <span class="lv lv-2">中级</span> 2.11 SVG 基础

```html
<svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="80" height="60" fill="#1677ff" rx="8"/>
  <circle cx="140" cy="40" r="30" fill="orange" stroke="red" stroke-width="2"/>
  <line x1="10" y1="90" x2="190" y2="90" stroke="#333"/>
  <text x="10" y="110" font-size="14">Hello SVG</text>
</svg>
```

**Canvas vs SVG 选型**：

| 维度 | Canvas | SVG |
|------|--------|-----|
| 本质 | 位图 | 矢量（XML） |
| 缩放 | 失真 | 无损 |
| 元素数量 | 万级不掉帧 | 几百上千就吃力 |
| 事件 | 需手动命中检测 | 每元素原生支持 |
| 无障碍 / SEO | 差 | 好（可选择、可搜索） |
| 场景 | 游戏、图表数据密集、图像处理 | 图标、Logo、静态插画、交互式图表 |

> 🎯 面试点：一句话——**动的多、密的多用 Canvas；静的、可交互可缩放用 SVG**。

---

## 三、🔴 高级实战

### <span class="lv lv-3">高级</span> 3.1 Web Components 全家桶

Web Components 由三部分组成：**Custom Elements + Shadow DOM + `<template>` / `<slot>`**，让你能像使用 `<div>` 一样使用自定义标签，且样式与外界隔离。

**完整示例：一个可复用计数器组件**

```html
<template id="tpl-counter">
  <style>
    :host { display: inline-flex; gap: 8px; align-items: center;
            font: 14px/1 sans-serif; }
    button { padding: 4px 10px; cursor: pointer; }
    .value { min-width: 24px; text-align: center; }
    ::slotted(span) { color: #888; }
  </style>
  <button id="dec">−</button>
  <span class="value" id="v">0</span>
  <button id="inc">+</button>
  <slot></slot>
</template>

<my-counter start="5">
  <span>次</span>
</my-counter>
<my-counter></my-counter>

<script>
  class MyCounter extends HTMLElement {
    static get observedAttributes() { return ['start']; }

    constructor() {
      super();
      const tpl = document.getElementById('tpl-counter');
      const root = this.attachShadow({ mode: 'open' });
      root.appendChild(tpl.content.cloneNode(true));
      this._v = root.getElementById('v');
      this._value = 0;
    }

    connectedCallback() {
      this._value = Number(this.getAttribute('start') || 0);
      this._render();
      this.shadowRoot.getElementById('inc')
          .addEventListener('click', () => this._change(1));
      this.shadowRoot.getElementById('dec')
          .addEventListener('click', () => this._change(-1));
    }

    disconnectedCallback() { /* 清理定时器/监听 */ }

    attributeChangedCallback(name, oldV, newV) {
      if (name === 'start' && oldV !== newV) {
        this._value = Number(newV || 0);
        this._render();
      }
    }

    _change(d) {
      this._value += d;
      this._render();
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: this._value }, bubbles: true
      }));
    }

    _render() { this._v.textContent = this._value; }
  }

  customElements.define('my-counter', MyCounter);
</script>
```

**要点**：

1. Custom Element 标签名**必须带连字符**（区别原生标签）。
2. Shadow DOM 提供样式隔离：外部 CSS 不影响内部（除 CSS 自定义属性透传）。
3. `<slot>` 是插槽机制，用户放的内容会"插入"到 slot 位置。
4. `:host` 选中组件宿主自身；`::slotted(...)` 选中被插入的元素。
5. 生命周期钩子：`connectedCallback / disconnectedCallback / attributeChangedCallback / adoptedCallback`。

> 💡 记住：Web Components 是**跨框架**的组件方案，Vue/React/Angular 都能直接用。

### <span class="lv lv-3">高级</span> 3.2 IndexedDB 基础封装

原生 API 事务/回调很啰嗦，实际用会封装：

```js
function openDB(name, version, onUpgrade) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(name, version);
    req.onupgradeneeded = (e) => onUpgrade(req.result, e.oldVersion);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function tx(db, store, mode = 'readonly') {
  return db.transaction(store, mode).objectStore(store);
}

function toPromise(req) {
  return new Promise((res, rej) => {
    req.onsuccess = () => res(req.result);
    req.onerror   = () => rej(req.error);
  });
}

// —— 使用 ——
const db = await openDB('shop', 1, (db, oldV) => {
  if (oldV < 1) {
    const store = db.createObjectStore('products', { keyPath: 'id' });
    store.createIndex('byCategory', 'category', { unique: false });
  }
});

// 增
await toPromise(tx(db, 'products', 'readwrite')
  .put({ id: 1, name: '苹果', category: 'fruit', price: 5 }));

// 查
const item = await toPromise(tx(db, 'products').get(1));

// 按索引游标遍历
const store = tx(db, 'products');
const cursor = store.index('byCategory').openCursor(IDBKeyRange.only('fruit'));
cursor.onsuccess = (e) => {
  const c = e.target.result;
  if (!c) return;
  console.log(c.value);
  c.continue();
};
```

**核心概念**：

- **数据库 → objectStore（类似表）→ 记录**；每条记录有 keyPath 主键。
- 所有读写在**事务**内，事务结束不能再操作。
- **异步 API**，不会阻塞主线程。
- 支持结构化克隆（可存 File、Blob、Map、Set、Date）。

> 🎯 面试点：LocalStorage 用同步 API + 只能存字符串 + 5MB 上限；IndexedDB 异步 + 结构化存储 + 大容量，适合离线应用/缓存资源。

### <span class="lv lv-3">高级</span> 3.3 Service Worker 与 PWA

Service Worker 是一个**独立线程**的代理，可拦截页面网络请求实现离线、推送、后台同步。它是 PWA（Progressive Web App）的核心。

**目录结构**：

```
/
├─ index.html
├─ app.js
├─ sw.js              ← Service Worker
└─ manifest.webmanifest
```

**manifest.webmanifest**：

```json
{
  "name": "My PWA",
  "short_name": "MyPWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1677ff",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

页面里引入：

```html
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#1677ff">
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' });
  }
</script>
```

**sw.js（含三种缓存策略）**：

```js
const CACHE = 'v1';
const PRECACHE = ['/', '/app.js', '/style.css', '/offline.html'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // 策略 1：cache-first（静态资源）
  if (/\.(js|css|png|jpg|woff2)$/.test(url.pathname)) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
    return;
  }

  // 策略 2：network-first（API）
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(
      fetch(e.request)
        .then(r => { const cp = r.clone();
                     caches.open(CACHE).then(c => c.put(e.request, cp));
                     return r; })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // 策略 3：stale-while-revalidate（HTML）
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(e.request);
    const fetching = fetch(e.request).then(r => {
      cache.put(e.request, r.clone()); return r;
    }).catch(() => cached || cache.match('/offline.html'));
    return cached || fetching;
  })());
});
```

**策略对比**：

| 策略 | 首字节 | 新鲜度 | 适用 |
|------|--------|--------|------|
| cache-first | 极快 | 差 | 版本化静态资源（hash 文件名） |
| network-first | 慢 | 好 | 数据接口 |
| stale-while-revalidate | 快 | 中 | HTML、头像等允许短暂过时 |
| network-only | 慢 | 最好 | 支付等强一致 |
| cache-only | 极快 | 无更新 | 明确离线资源 |

> ⚠️ 陷阱：Service Worker 必须 **HTTPS**（localhost 除外），且脚本一旦发布错误可能长期缓存，务必有"跳过 SW"应急开关（如 URL 加 `?nosw`）。

### <span class="lv lv-3">高级</span> 3.4 Web Workers 三兄弟

| 类型 | 作用 | 特点 |
|------|------|------|
| Dedicated Worker | 单页面独享 | 最常用，`new Worker(url)` |
| Shared Worker | 多标签页共享 | `new SharedWorker(url)`，通过 `port` 通信 |
| Service Worker | 网络代理 / 离线 | 见 3.3，可无页面存活 |

**专用 Worker 示例**：

```js
// main.js
const w = new Worker('/worker.js', { type: 'module' });
w.postMessage({ cmd: 'sum', n: 1e8 });
w.onmessage = (e) => console.log('结果', e.data);

// 传大数据用 Transferable，零拷贝转移所有权
const buf = new ArrayBuffer(1024 * 1024 * 10);
w.postMessage({ buf }, [buf]); // 主线程 buf 立刻变成 detached

// worker.js
self.onmessage = (e) => {
  if (e.data.cmd === 'sum') {
    let s = 0;
    for (let i = 0; i < e.data.n; i++) s += i;
    self.postMessage(s);
  }
};
```

**Worker 里能用什么**：

- ✅ `fetch / XHR / setTimeout / IndexedDB / WebSocket / OffscreenCanvas`
- ❌ `window / document / DOM / localStorage`（部分环境可用 storage 但不建议）

**Transferable 对象**：`ArrayBuffer / MessagePort / ImageBitmap / OffscreenCanvas`，转移后原线程无法再用。

> 💡 记住：CPU 密集计算（大数据处理、加密、图像滤镜、Excel 解析）放 Worker，避免卡主线程掉帧。

### <span class="lv lv-3">高级</span> 3.5 实时通信对比

| 维度 | 长轮询 | SSE (EventSource) | WebSocket |
|------|--------|--------------------|-----------|
| 协议 | HTTP | HTTP（chunked） | ws / wss |
| 方向 | 单向（客户端拉） | 单向（服务端推） | 全双工 |
| 数据格式 | 任意 | 文本（UTF-8） | 文本 / 二进制 |
| 自动重连 | 需自实现 | 内置 | 需自实现 |
| 浏览器兼容 | 全 | 现代浏览器（不含旧 IE） | 现代浏览器 |
| 复杂度 | 低 | 低 | 中 |
| 典型场景 | 兼容老系统 | 消息推送、日志、股价 | 聊天、游戏、协同编辑 |

**WebSocket Echo**：

```js
const ws = new WebSocket('wss://echo.websocket.events');
ws.onopen    = () => ws.send('hello');
ws.onmessage = (e) => console.log('收到:', e.data);
ws.onclose   = () => console.log('已关闭');
ws.onerror   = (e) => console.error(e);

// 发送二进制
const buf = new Uint8Array([1,2,3]).buffer;
ws.send(buf);
```

**SSE 示例**：

```js
const es = new EventSource('/api/stream');
es.onmessage = (e) => console.log('默认事件', e.data);
es.addEventListener('price', (e) => console.log('价格更新', e.data));
es.onerror = () => console.warn('连接中断，浏览器自动重试');

// 服务端返回格式（text/event-stream）:
// event: price
// data: {"symbol":"BTC","price":68000}
//
// data: hello
//
```

> 🎯 面试点：只需要"服务端 → 客户端"单向推送 + 走 HTTP 的场景，**SSE 比 WebSocket 更省事**（自动重连 + 走 80/443 无需协议升级）。

### <span class="lv lv-3">高级</span> 3.6 File API 与切片上传

```html
<input type="file" id="f" multiple accept="image/*">
<img id="preview" style="max-width:200px">

<script>
  document.getElementById('f').onchange = async (e) => {
    const file = e.target.files[0];

    // 1) FileReader 读文本 / DataURL
    const reader = new FileReader();
    reader.onload = () => preview.src = reader.result;
    reader.readAsDataURL(file);

    // 2) 更推荐 URL.createObjectURL（不占内存把整个文件转 base64）
    const url = URL.createObjectURL(file);
    preview.src = url;
    preview.onload = () => URL.revokeObjectURL(url); // 用完释放

    // 3) 直接 fetch 上传 Blob
    await fetch('/upload', { method: 'POST', body: file });
  };
</script>
```

**大文件切片上传思路**：

```js
async function chunkUpload(file, chunkSize = 5 * 1024 * 1024) {
  const total = Math.ceil(file.size / chunkSize);
  const hash = await sha256(file);        // 秒传/断点续传 key

  // 询问后端：哪些块已上传？
  const { uploaded = [] } = await fetch(`/upload/init?hash=${hash}`).then(r => r.json());

  for (let i = 0; i < total; i++) {
    if (uploaded.includes(i)) continue;

    const start = i * chunkSize;
    const chunk = file.slice(start, start + chunkSize); // Blob.slice
    const fd = new FormData();
    fd.append('hash', hash);
    fd.append('index', i);
    fd.append('total', total);
    fd.append('chunk', chunk);

    await fetch('/upload/chunk', { method: 'POST', body: fd });
  }

  await fetch(`/upload/merge?hash=${hash}&name=${file.name}`);
}

async function sha256(file) {
  const buf = await file.arrayBuffer();
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2,'0')).join('');
}
```

**关键 API**：

| API | 作用 |
|-----|------|
| `File`（继承 `Blob`） | 文件对象 |
| `blob.slice(start, end, type?)` | 切片（不占额外内存） |
| `FileReader` | 老式读取，支持进度事件 |
| `URL.createObjectURL / revokeObjectURL` | 生成/释放临时 URL |
| `file.arrayBuffer() / text() / stream()` | 现代 Promise/Stream 读取 |
| `crypto.subtle.digest` | 计算 hash |

> ⚠️ 陷阱：`URL.createObjectURL` 生成的 URL 直到手动 revoke 或页面卸载才释放，大量图片场景要记得回收。

### <span class="lv lv-3">高级</span> 3.7 Drag and Drop API

```html
<ul id="list">
  <li draggable="true" data-id="1">Item A</li>
  <li draggable="true" data-id="2">Item B</li>
  <li draggable="true" data-id="3">Item C</li>
</ul>

<div id="drop" style="height:100px;border:2px dashed #ccc">拖到这里</div>

<script>
  const list = document.getElementById('list');
  const drop = document.getElementById('drop');

  list.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
  });
  list.addEventListener('dragend', (e) => e.target.classList.remove('dragging'));

  drop.addEventListener('dragover', (e) => {
    e.preventDefault();               // 必须阻止默认才能触发 drop
    e.dataTransfer.dropEffect = 'move';
    drop.style.background = '#eef';
  });
  drop.addEventListener('dragleave', () => drop.style.background = '');
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    drop.textContent = `收到 ID: ${id}`;
    drop.style.background = '';

    // 文件拖入
    if (e.dataTransfer.files.length) {
      console.log('拖入文件', [...e.dataTransfer.files]);
    }
  });
</script>
```

**事件时序**：

```
dragstart（源）
   ↓
dragenter → dragover（目标反复触发）→ dragleave
   ↓
drop（目标，前提是 dragover 阻止默认）
   ↓
dragend（源）
```

**DataTransfer 常用**：

- `setData(type, val) / getData(type)`：跨元素/跨窗口传数据。
- `effectAllowed`（源侧限制）+ `dropEffect`（目标侧展示鼠标样式）。
- `files`：拖入的文件列表（就是 File[]）。
- `setDragImage(img, x, y)`：自定义拖影。

> 💡 记住：**不 `preventDefault` 就没有 drop**，这是最常见的踩坑点。

### <span class="lv lv-3">高级</span> 3.8 关键渲染路径与脚本加载

浏览器从收到 HTML 到画到屏幕，粗略经历：

```
HTML  → 解析 → DOM 树 ─┐
                        ├→ Render Tree → Layout → Paint → Composite → 屏幕
CSS   → 解析 → CSSOM ──┘
JS    → 解析 → 执行（会阻塞解析/渲染，视加载方式而定）
```

**脚本加载三种模式**：

```html
<script src="a.js"></script>            <!-- 阻塞解析，同步下载并执行 -->
<script src="b.js" defer></script>      <!-- 并行下载，DOMContentLoaded 前按顺序执行 -->
<script src="c.js" async></script>      <!-- 并行下载，下完立刻执行（顺序不定） -->
<script type="module" src="m.js"></script> <!-- 默认 defer -->
```

时序对比（`|` 代表 HTML 解析）：

```
普通:  |---解析---■下载+执行 a.js■---继续解析---|
defer: |---解析------------------------|▲ 执行 b.js (DOMContentLoaded 前)
async: |---解析-----■执行 c.js■----------|   (随下随执行，可能打断解析)
```

**Resource Hints**：

| 指令 | 作用 | 示例场景 |
|------|------|----------|
| `dns-prefetch` | 提前做 DNS 解析 | 即将访问的第三方域 |
| `preconnect` | DNS + TCP + TLS 全部提前 | 关键第三方（CDN、字体） |
| `prefetch` | 空闲时下载，下个导航可能用 | 下一页的 JS chunk |
| `preload` | 当前页立即高优下载 | 关键字体、大图、LCP 资源 |
| `modulepreload` | 提前下载 ES module 及其依赖 | 首屏动态 import 的模块 |
| `prerender` | 后台渲染整个页面 | 高确定性下一页（已弱化，Chrome 用 Speculation Rules 替代） |

```html
<link rel="dns-prefetch" href="//cdn.example.com">
<link rel="preconnect"   href="https://cdn.example.com" crossorigin>
<link rel="preload" as="font" href="/font.woff2" type="font/woff2" crossorigin>
<link rel="preload" as="image" href="/hero.jpg" fetchpriority="high">
<link rel="modulepreload" href="/chunks/router.js">
```

> 🎯 面试点：`defer` vs `async` 一句话——**defer 保序、DCL 前执行；async 不保序、下完就执行**。首屏关键脚本用 defer；无依赖统计脚本用 async。

### <span class="lv lv-3">高级</span> 3.9 性能优化实战

**图片**：

- 尺寸：给 `width/height` 或 `aspect-ratio` 防 CLS。
- 格式：AVIF > WebP > JPEG/PNG；用 `<picture>` 回退。
- 懒加载：非首屏 `loading="lazy"` + `decoding="async"`。
- 响应式：`srcset` + `sizes` 让浏览器选合适倍图。

```html
<img src="hero-800.jpg"
     srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1600.jpg 1600w"
     sizes="(max-width: 600px) 100vw, 800px"
     alt="首屏图" fetchpriority="high">
```

**字体**：

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap;   /* 先展示后备字体，字体到位后替换，避免不可见文字 */
  unicode-range: U+0020-007F; /* 只加载 ASCII，减小体积 */
}
```

`font-display` 五个值对比：

| 值 | 阻塞期 | 交换期 | 常用度 |
|----|--------|--------|--------|
| auto | 浏览器决定 | — | 低 |
| block | 短（~3s） | 长 | 图标字体防闪 |
| swap | 0 | 长 | **推荐**，无 FOIT |
| fallback | 极短 | 极短 | 兼顾体验 |
| optional | 极短 | 0 | 弱网直接放弃 |

**Priority Hints**：

```html
<img src="hero.jpg" fetchpriority="high">
<script src="analytics.js" fetchpriority="low" async></script>
<link rel="preload" as="fetch" href="/api/user" fetchpriority="high" crossorigin>
```

**其他关键项**：

- 关键 CSS 内联，非关键 CSS 用 `<link rel="preload" as="style" onload="this.rel='stylesheet'">`。
- HTML/CSS/JS 开启 gzip 或 br 压缩。
- 长列表用虚拟滚动（IntersectionObserver 实现）。
- 使用 CDN + HTTP/2/3 + 合理缓存头。

> 💡 记住：Core Web Vitals 三大件——LCP（最大内容绘制）、CLS（布局偏移）、INP（交互到下一帧）。图片/字体/预加载 = 主要影响 LCP 与 CLS。

### <span class="lv lv-3">高级</span> 3.10 前端安全清单

**XSS 三类**：

| 类型 | 载体 | 例子 |
|------|------|------|
| 存储型 | 数据库 | 评论里存 `<script>`，别人打开就执行 |
| 反射型 | URL 参数 | `search?q=<script>alert(1)</script>` |
| DOM 型 | 前端 JS | `el.innerHTML = location.hash` |

**防御**：

1. 输出编码：不同上下文（HTML 文本、属性、URL、CSS、JS）用不同转义。
2. 避免 `innerHTML`，用 `textContent`；富文本走白名单库（DOMPurify）。
3. `Content-Security-Policy` 响应头：

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-abc123' https://cdn.example.com;
  style-src 'self' 'unsafe-inline';
  img-src * data:;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
```

**SRI 子资源完整性**（防 CDN 被投毒）：

```html
<script src="https://cdn.example.com/lib.js"
        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9G..."
        crossorigin="anonymous"></script>
```

**CORS**：浏览器同源策略下跨域请求需服务端返回 `Access-Control-Allow-Origin` 等头；带凭证要 `credentials:'include'` + 服务端 `Access-Control-Allow-Credentials: true` 且 Origin 不能是 `*`。

**Cookie 安全属性**：

| 属性 | 作用 |
|------|------|
| `HttpOnly` | JS 无法读取（防 XSS 偷 token） |
| `Secure` | 仅 HTTPS 发送 |
| `SameSite=Lax/Strict/None` | 跨站是否发送（防 CSRF）；`None` 必须配 `Secure` |
| `Path / Domain / Max-Age` | 作用域与生命周期 |

**Referrer-Policy**（`strict-origin-when-cross-origin` 是现代默认）：控制 Referer 头泄露范围。

**iframe 安全**：`sandbox` + `referrerpolicy` + `X-Frame-Options: DENY`（或 CSP `frame-ancestors`）防点击劫持。

> ⚠️ 陷阱：`SameSite=None` 一定要加 `Secure`，否则浏览器直接丢弃 Cookie。

### <span class="lv lv-3">高级</span> 3.11 高频面试题速答

1. **DOCTYPE 作用？** 触发浏览器标准模式，避免怪异模式导致的盒模型等异常。
2. **HTML 语义化有什么好处？** SEO 友好、无障碍、可读性强、结构清晰、样式丢失时仍可用。
3. **`<script>` 的 `defer` 与 `async` 区别？** defer 并行下载、按序、DOMContentLoaded 前执行；async 并行下载、下完立即执行、顺序不保证。
4. **`<link rel="preload">` 与 `prefetch` 区别？** preload 是当前页高优下载关键资源；prefetch 是空闲时给未来导航准备。
5. **`localStorage`、`sessionStorage`、`Cookie`、`IndexedDB` 区别？** 见 2.9 对比表。
6. **`display:none` / `visibility:hidden` / `opacity:0` / `hidden` 属性区别？** 是否占位、是否响应事件、是否触发重排。none/hidden 不占位；visibility 占位不响应；opacity 占位可响应。
7. **`src` 与 `href` 区别？** src 是引入并**替换**当前元素内容（img/script/iframe，阻塞并行下载）；href 是**建立当前文档与外部资源的关系**（a/link，非阻塞）。
8. **HTML5 新增了哪些？** 语义标签、表单增强、多媒体、Canvas/SVG、Web Storage、Web Workers、WebSocket、Geolocation、拖拽、History API、Web Components 等。
9. **`<meta viewport>` 各字段含义？** 见 2.7。
10. **Web Worker 能操作 DOM 吗？** 不能。它没有 window/document，只能通过 postMessage 与主线程通信。
11. **Service Worker 生命周期？** register → install → activate → fetch/message/push；跨页面共享，需 HTTPS。
12. **PWA 三要素？** HTTPS + Service Worker + Manifest。
13. **CSRF 与 XSS 区别？** XSS 是页面里跑了坏脚本；CSRF 是攻击者借用用户凭证发跨站请求。CSRF 防御：SameSite Cookie、CSRF Token、Origin/Referer 校验。
14. **`<link rel="noopener noreferrer">` 意义？** 见 1.6，防新窗口劫持父页 + 隐藏来源。
15. **如何优化首屏 LCP？** 关键资源 preload + fetchpriority=high、图片响应式与现代格式、内联关键 CSS、字体 font-display: swap、SSR/流式渲染、CDN。

> 🎯 面试点：**能说清"为什么"而不是只背 API** 是与初中级的分水岭。

---

**结语**：HTML5 不是一堆孤立标签的集合，而是构成"结构、语义、多媒体、离线、组件、性能、安全"完整能力的一整套 Web 平台标准。从写好每一个 `alt`、每一次 `label for` 开始，逐步走向 Web Components、Service Worker 与 PWA，你就完成了从"会写页面"到"造平台"的跨越。祝学习顺利，代码常绿。

---

## <span class="lv lv-3">高级</span> 附录 B：2024–2026 HTML 平台新特性速览

> 💡 本附录聚焦 2024–2026 年可用度快速上升的 Web 平台特性。它们的共同方向是：**减少三方依赖 + 更贴近原生 + 更高性能**。掌握这些能替换掉相当一部分老库（Popper.js、SweetAlert、部分 GSAP 场景、部分 IndexedDB 封装等）。

### B.1 View Transitions API（跨页/跨状态原生动画）

> 💡 一句话：浏览器帮你在"两个 DOM 快照"之间自动补一段动画，你只需要给出触发点和 CSS 命名规则。

**基本模型**：调用 `document.startViewTransition(callback)`，浏览器会：
1. 拍下**旧快照**；
2. 运行 `callback` 更新 DOM；
3. 拍下**新快照**；
4. 在旧/新之间自动生成过渡动画（默认是交叉淡入淡出）。

#### SPA 版本（单页应用状态切换）

```js
// 传统写法：直接改 DOM，会"闪一下"
function switchTab(tabId) {
  document.querySelector('.tab.active')?.classList.remove('active');
  document.getElementById(tabId).classList.add('active');
}

// 使用 View Transitions
function switchTabWithTransition(tabId) {
  if (!document.startViewTransition) {
    // 优雅降级
    switchTab(tabId);
    return;
  }
  const transition = document.startViewTransition(() => {
    switchTab(tabId);
  });

  // 可等待关键阶段
  transition.ready.then(() => console.log('伪元素树已就绪'));
  transition.finished.then(() => console.log('动画播完'));
  transition.updateCallbackDone.then(() => console.log('DOM 更新完'));
}
```

#### 给特定元素命名，实现"共享元素"过渡

```css
/* 让旧/新页面中的头图对齐并平滑过渡 */
.hero-image {
  view-transition-name: hero;
}

/* 自定义过渡曲线 */
::view-transition-old(hero),
::view-transition-new(hero) {
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.2, 0, 0, 1);
}

/* 只让新页面滑入 */
::view-transition-new(root) {
  animation: slide-in 300ms ease-out;
}
@keyframes slide-in {
  from { transform: translateX(30px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
```

#### MPA（多页应用）版本 —— Chrome 126+ 已支持

```html
<!-- 在同源两个页面里都加上 -->
<meta name="view-transition" content="same-origin">
```

```css
@view-transition {
  navigation: auto;   /* 同源导航自动启用过渡 */
}
```

任意跳链接都会自动产生过渡，无需 JS。

#### 与 SPA 路由联动（React Router / Vue Router 示例）

```js
// 通用路由拦截
router.beforeResolve(async (to, from, next) => {
  if (!document.startViewTransition) return next();
  const transition = document.startViewTransition(() => new Promise(resolve => {
    next();
    // 等下一帧确认组件已经挂载
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }));
  await transition.finished;
});
```

> 🎯 面试点：`view-transition-name` 必须**在文档中唯一**（同一时刻只有一个元素能带这个名字），否则动画会被跳过。做列表 → 详情共享元素时，务必给每个 item 用**唯一 id 作为 name**。

### B.2 Popover API（原生弹层：Tooltip / Dropdown / Modal）

> 💡 一句话：浏览器给了原生的"层"能力（自动进 top-layer、自动处理 ESC 和外点关闭），你不用再手写 z-index、focus trap、点击外部关闭逻辑。

#### 最小示例：按钮 + 弹层

```html
<button popovertarget="menu">打开菜单</button>

<div id="menu" popover>
  <ul>
    <li><a href="/profile">个人主页</a></li>
    <li><a href="/settings">设置</a></li>
    <li><a href="/logout">退出</a></li>
  </ul>
</div>
```

无需一行 JS，点击按钮就会弹出。默认 `popover="auto"` 支持 **light dismiss**（点击外部或按 ESC 自动关闭），并且同类只保留一个打开状态。

#### popover 三种模式对比

| 模式 | 说明 | 典型场景 |
| --- | --- | --- |
| `popover="auto"`（默认） | 支持外点 & ESC 自动关闭；同组互斥 | 菜单、下拉、Tooltip |
| `popover="manual"` | 只能通过代码 `hide()` 关闭 | Toast、常驻提示 |
| `popover="hint"`（新） | 只与其他 hint 互斥，不影响 auto | 悬浮提示 |

#### 精细控制：popovertargetaction

```html
<button popovertarget="tips" popovertargetaction="show">显示</button>
<button popovertarget="tips" popovertargetaction="hide">隐藏</button>
<button popovertarget="tips" popovertargetaction="toggle">切换</button>

<div id="tips" popover="manual">这是一段说明</div>
```

#### 与 Anchor Positioning 组合（Chrome 125+）

```css
/* 让 popover 锚定到触发按钮下方 */
#menu {
  position-anchor: --btn;
  top: anchor(bottom);
  left: anchor(left);
  margin-top: 8px;
}
button[popovertarget="menu"] {
  anchor-name: --btn;
}
```

#### JS 编程接口

```js
const p = document.getElementById('menu');
p.showPopover();
p.hidePopover();
p.togglePopover();

p.addEventListener('toggle', e => {
  console.log(e.oldState, '=>', e.newState); // 'closed' => 'open'
});
```

> 🎯 面试点：`popover` 元素会进入 **top-layer**（跟 `<dialog showModal>` 同层），因此不会被 `overflow:hidden` / `transform` 父级裁剪，这是它彻底干掉 Popper.js portal 方案的关键。

### B.3 Speculation Rules（Chrome 已替代 prerender / prefetch）

> 💡 一句话：用一段 JSON 告诉浏览器"这些链接可能被点，请预取/预渲染"，比老 `<link rel=prerender>` 更细粒度、更省资源、更安全。

#### 基础规则（prefetch：只拿 HTML）

```html
<script type="speculationrules">
{
  "prefetch": [
    { "urls": ["/next.html", "/about.html"] }
  ]
}
</script>
```

#### 高级规则（prerender：整页预渲染 + CSS 选择器）

```html
<script type="speculationrules">
{
  "prerender": [
    {
      "where": {
        "and": [
          { "href_matches": "/products/*" },
          { "not": { "selector_matches": ".no-prefetch" } }
        ]
      },
      "eagerness": "moderate"
    }
  ],
  "prefetch": [
    {
      "where": { "href_matches": "/*" },
      "eagerness": "conservative"
    }
  ]
}
</script>
```

#### eagerness 四档节流

| 值 | 触发时机 | 建议用途 |
| --- | --- | --- |
| `immediate` | 立即执行 | 极少数明确的下一跳 |
| `eager` | 鼠标接近链接就触发 | 关键 CTA |
| `moderate` | hover ≥ 200ms 或触屏按下 | 大部分导航链接 |
| `conservative` | 点击瞬间 | 弱网 / 移动端保守策略 |

#### 合规性与限制

- 需 **同源** 或明确 CORS；跨源 prerender 会退化为 prefetch。
- 会跳过带 `Cache-Control: no-store` 的响应。
- Cookie / localStorage 会真实写入 —— 慎用在会"消费一次性 token"的路由。

> 🎯 面试点：Speculation Rules 的最大价值在**移动端二级页秒开**。用 `moderate` + `href_matches` 白名单是黄金组合，实际测得 LCP 可下降 40%+。

### B.4 Web Share / Web Share Target

> 💡 一句话：`navigator.share` 唤起系统级分享面板（微信、邮件、AirDrop…）；`share_target` 让你的 PWA 成为分享**目的地**（别人分享给你）。

#### 发起分享

```js
async function shareArticle() {
  if (!navigator.share) {
    alert('当前浏览器不支持 Web Share');
    return;
  }
  try {
    await navigator.share({
      title: '深入 HTML5',
      text: '一份从入门到高级的 HTML5 完整指南',
      url: location.href,
      // 也可以分享文件（图片、PDF 等）
      // files: [new File([blob], 'poster.png', { type: 'image/png' })]
    });
    console.log('分享成功');
  } catch (err) {
    if (err.name !== 'AbortError') console.error(err);
  }
}
```

⚠️ 必须在**用户手势**（click/touch）回调里调用，且页面必须 HTTPS。

#### 成为分享目的地（PWA manifest）

```json
{
  "name": "MyNotes",
  "start_url": "/",
  "display": "standalone",
  "share_target": {
    "action": "/share-receiver",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text":  "text",
      "url":   "url",
      "files": [
        { "name": "attachments", "accept": ["image/*", "application/pdf"] }
      ]
    }
  }
}
```

用户从其他 App 分享内容时，你的 PWA 会出现在系统分享面板；点击后浏览器向 `/share-receiver` 发送 POST，你在 Service Worker 或后端处理即可。

> 🎯 面试点：`files` 分享要求两端都实现 File 处理；不带 files 的场景可用 `method: "GET"` 简化。

### B.5 Background Sync / Periodic Sync / Push

> 💡 一句话：三个 API 都在 **Service Worker** 里，让网页在"关掉之后"仍能与服务器保持交互。

#### 5.1 Background Sync（离线补交）

```js
// 页面里注册
navigator.serviceWorker.ready.then(reg => {
  return reg.sync.register('sync-outbox');
});
```

```js
// sw.js
self.addEventListener('sync', event => {
  if (event.tag === 'sync-outbox') {
    event.waitUntil(flushOutbox());
  }
});

async function flushOutbox() {
  const outbox = await idbGetAll('outbox');
  for (const msg of outbox) {
    await fetch('/api/send', { method: 'POST', body: JSON.stringify(msg) });
    await idbDelete('outbox', msg.id);
  }
}
```

网络恢复后浏览器会自动触发 `sync` 事件，非常适合聊天/表单离线补交。

#### 5.2 Periodic Background Sync（周期后台）

```js
const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
if (status.state === 'granted') {
  await reg.periodicSync.register('refresh-feed', {
    minInterval: 24 * 60 * 60 * 1000  // 至少 24h 一次
  });
}
```

```js
self.addEventListener('periodicsync', event => {
  if (event.tag === 'refresh-feed') {
    event.waitUntil(updateFeedCache());
  }
});
```

⚠️ 只对**已安装的 PWA**开放，且系统会根据电量、网络、使用频率决定是否真的触发；`minInterval` 是"最短间隔"不是"精确周期"。

#### 5.3 Push API（服务端推送）

```js
// 订阅
const sub = await reg.pushManager.subscribe({
  userVisibleOnly: true,   // 必须显示通知，禁止静默推送
  applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
});
await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify(sub) });
```

```js
// sw.js
self.addEventListener('push', event => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/badge.png',
      data: { url: data.url }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
```

服务端用 `web-push` 库（Node）签发带 VAPID 的加密载荷即可。

> 🎯 面试点：`userVisibleOnly: true` 是硬性要求，浏览器不允许纯静默推送 —— 每次 push 必须弹一条通知给用户。

### B.6 Origin Private File System（OPFS）

> 💡 一句话：一块**每个源独享、浏览器直管、性能接近原生**的沙盒文件系统，读写大文件比 IndexedDB 快 5–10 倍，天然适合 WASM 数据库（SQLite/DuckDB）。

#### 基本读写

```js
async function demo() {
  const root = await navigator.storage.getDirectory();

  // 写文件
  const fh = await root.getFileHandle('notes.txt', { create: true });
  const w  = await fh.createWritable();
  await w.write('Hello OPFS');
  await w.close();

  // 读文件
  const file = await fh.getFile();
  console.log(await file.text());

  // 遍历目录
  for await (const [name, handle] of root.entries()) {
    console.log(name, handle.kind); // 'file' | 'directory'
  }

  // 删除
  await root.removeEntry('notes.txt');
}
```

#### 同步版本（仅 Worker 内可用，性能爆表）

```js
// worker.js
onmessage = async () => {
  const root = await navigator.storage.getDirectory();
  const fh   = await root.getFileHandle('db.sqlite', { create: true });
  const sync = await fh.createSyncAccessHandle();

  const buf = new Uint8Array(1024);
  sync.read(buf, { at: 0 });
  sync.write(new TextEncoder().encode('data'), { at: 0 });
  sync.flush();
  sync.close();
};
```

#### OPFS vs IndexedDB 选型

| 维度 | OPFS | IndexedDB |
| --- | --- | --- |
| 数据模型 | 文件 / 目录 | 对象 + 索引 |
| 大文件性能 | 非常好（尤其 sync） | 一般，序列化开销大 |
| 查询能力 | 无 | 有索引与游标 |
| 跨 tab 共享 | 是 | 是 |
| 典型场景 | WASM 数据库、视频缓存、素材库 | 结构化业务数据、离线队列 |

> 🎯 面试点：Chrome 里 sql.js / DuckDB-Wasm 现在都优先用 OPFS 做持久层，比"IndexedDB + 分块"方案快一个量级。

### B.7 现代表单与状态原语：dialog / details / customStates

> 💡 一句话：三个"看着老"的原语在 2024–2026 变得非常香 —— **能替代大量弹窗、折叠、状态样式库**。

#### 7.1 `<dialog>` 原生模态

```html
<dialog id="confirmDlg">
  <form method="dialog">
    <p>确定要删除这条数据吗？</p>
    <menu>
      <button value="cancel">取消</button>
      <button value="ok" autofocus>确定</button>
    </menu>
  </form>
</dialog>

<button id="openBtn">删除</button>
<script>
  const dlg = document.getElementById('confirmDlg');
  openBtn.onclick = () => dlg.showModal();  // 进入 top-layer + 自动 focus trap + ESC 关闭
  dlg.addEventListener('close', () => {
    console.log('用户选择：', dlg.returnValue); // 'ok' 或 'cancel'
  });
</script>
```

配合 `::backdrop` 做遮罩：

```css
dialog::backdrop {
  background: rgba(0, 0, 0, .5);
  backdrop-filter: blur(4px);
}
dialog[open] {
  animation: pop 200ms ease-out;
}
@keyframes pop {
  from { transform: scale(.9); opacity: 0; }
  to   { transform: scale(1);  opacity: 1; }
}
```

#### 7.2 `<details>` 折叠面板 + 手风琴

```html
<details name="faq">
  <summary>什么是 View Transitions？</summary>
  <p>浏览器在两次 DOM 快照之间自动补动画的 API。</p>
</details>
<details name="faq">
  <summary>Popover API 能替代什么？</summary>
  <p>可替代 Popper.js 与大量弹层封装。</p>
</details>
```

同一 `name` 的多个 `<details>` 自动形成**手风琴**（同时只展开一个），这是 Chrome 120+ 的新能力，以前必须写 JS 才能实现。

#### 7.3 自定义元素的 CSS 状态 —— `ElementInternals.states`

```js
class ToggleSwitch extends HTMLElement {
  #internals = this.attachInternals();
  connectedCallback() {
    this.addEventListener('click', () => this.toggle());
  }
  toggle() {
    if (this.#internals.states.has('checked')) {
      this.#internals.states.delete('checked');
    } else {
      this.#internals.states.add('checked');
    }
  }
}
customElements.define('toggle-switch', ToggleSwitch);
```

```css
/* 使用 :state() 伪类挂样式，无需污染 class 属性 */
toggle-switch {
  display: inline-block; width: 40px; height: 20px;
  background: #ccc; border-radius: 10px;
}
toggle-switch:state(checked) {
  background: #22c55e;
}
```

> 🎯 面试点：`:state()` 让自定义组件的"内部状态"对 CSS 首次真正可见，是 Web Components 走向工业级的关键补齐。

---

**附录 B 小结**：这一批 API 的哲学是把"过去必须靠库解决"的能力**下沉到平台层**：动画 → View Transitions；弹层 → Popover + Dialog；预取 → Speculation Rules；分享 → Web Share；离线 → Sync/Push；存储 → OPFS；组件状态 → customStates。学会它们的直接收益，是能给你的项目**减 30–100 KB 的三方 JS**，并获得更好的可访问性与性能默认值。

> 🎯 学习秘诀：这些 API 都是"**减少三方依赖 + 更贴近原生**"的方向，能替代 Popper.js / 一部分弹窗库 / 一部分动画库。看到新项目需求时，先问"这件事平台原生能不能做？"再决定是否引库。
