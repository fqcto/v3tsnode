# Docker 全阶段学习手册

> 面向前端转全栈开发者 · 定位"全栈偏前端，后端为辅" · 中文编写

---

## 📑 目录

- [一、🟢 初级入门](#一-初级入门)
  - [1.1 Docker 是什么 & 容器 vs 虚拟机](#11-docker-是什么--容器-vs-虚拟机)
  - [1.2 安装与环境配置](#12-安装与环境配置)
  - [1.3 核心概念：镜像 / 容器 / 仓库 / Dockerfile](#13-核心概念镜像--容器--仓库--dockerfile)
  - [1.4 镜像操作](#14-镜像操作)
  - [1.5 容器操作](#15-容器操作)
  - [1.6 Dockerfile 详解](#16-dockerfile-详解)
  - [1.7 docker-compose 入门](#17-docker-compose-入门)
  - [1.8 .dockerignore 与构建上下文](#18-dockerignore-与构建上下文)
  - [1.9 常用 Dockerfile 模板](#19-常用-dockerfile-模板)
  - [1.10 Docker Hub 与镜像仓库](#110-docker-hub-与镜像仓库)
- [二、🟡 中级进阶](#二-中级进阶)
  - [2.1 多阶段构建（multi-stage build）](#21-多阶段构建multi-stage-build)
  - [2.2 数据卷与绑定挂载](#22-数据卷与绑定挂载)
  - [2.3 网络模式](#23-网络模式)
  - [2.4 docker-compose 进阶](#24-docker-compose-进阶)
  - [2.5 镜像优化最佳实践](#25-镜像优化最佳实践)
  - [2.6 Node.js 项目实战](#26-nodejs-项目实战)
  - [2.7 环境变量与配置管理](#27-环境变量与配置管理)
  - [2.8 日志管理与容器监控](#28-日志管理与容器监控)
  - [2.9 常见问题与排查](#29-常见问题与排查)
- [三、🔴 高级实战](#三-高级实战)
  - [3.1 Docker 与 CI/CD](#31-docker-与-cicd)
  - [3.2 Docker 安全最佳实践](#32-docker-安全最佳实践)
  - [3.3 面试高频题 10 条](#33-面试高频题-10-条)

---

## 一、🟢 初级入门

### 1.1 Docker 是什么 & 容器 vs 虚拟机

<span class="lv lv-1">初级</span>

Docker 是一个开源的**容器化平台**，让开发者把应用及其所有依赖打包进一个轻量、可移植的"容器"，实现"在我机器上能跑，在任何地方都能跑"。

#### 容器 vs 虚拟机（ASCII 对比图）

```
虚拟机（VM）架构                       容器（Container）架构
┌───────────────────────────┐         ┌───────────────────────────┐
│  App A   │  App B         │         │  App A   │  App B         │
├──────────┴────────────────┤         ├──────────┴────────────────┤
│  Guest OS│  Guest OS      │         │  Container │ Container    │
├──────────┴────────────────┤         ├────────────┴──────────────┤
│       Hypervisor          │         │        Docker Engine      │
├───────────────────────────┤         ├───────────────────────────┤
│         Host OS           │         │         Host OS           │
├───────────────────────────┤         ├───────────────────────────┤
│         硬件               │         │         硬件               │
└───────────────────────────┘         └───────────────────────────┘
```

| 对比维度     | 虚拟机（VM）              | 容器（Container）          |
|------------|-------------------------|--------------------------|
| 启动速度     | 分钟级                   | 秒级甚至毫秒级              |
| 体积大小     | GB 级（含完整 OS）         | MB 级（共享宿主内核）         |
| 隔离程度     | 强隔离（完整内核隔离）        | 进程级隔离（Namespace/Cgroups）|
| 性能损耗     | 较大（Hypervisor 开销）    | 接近原生                   |
| 资源占用     | 高（每个 VM 独占内存/CPU）  | 低（共享宿主 OS 内核）        |
| 迁移便捷性   | 镜像文件大，迁移慢           | 镜像分层，迁移快              |
| 适用场景     | 需要完整 OS 隔离           | 微服务、CI/CD、快速部署       |

> **前端视角**：可以把容器理解为"超级 node_modules 隔离"——把运行环境、依赖、代码全部打包，彻底告别"我这里能跑但你那跑不起来"的问题。

---

### 1.2 安装与环境配置

<span class="lv lv-1">初级</span>

#### Windows（推荐 Docker Desktop）

```bash
# 1. 下载 Docker Desktop
#    https://www.docker.com/products/docker-desktop/

# 2. 安装后启用 WSL2 后端（推荐）
#    设置 → General → Use WSL 2 based engine

# 3. 验证安装
docker --version          # Docker version 24.x.x
docker compose version    # Docker Compose version v2.x.x

# 4. 运行第一个容器
docker run hello-world
```

#### macOS（Apple Silicon / Intel 均支持）

```bash
# 方式一：Docker Desktop（图形化，推荐新手）
#   https://www.docker.com/products/docker-desktop/

# 方式二：Homebrew
brew install --cask docker

# 验证
docker --version
docker run hello-world
```

#### Linux（Ubuntu/Debian）

```bash
# 卸载旧版本
sudo apt-get remove docker docker-engine docker.io containerd runc

# 安装依赖
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release

# 添加 Docker 官方 GPG 密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 设置仓库
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 当前用户加入 docker 组（免 sudo）
sudo usermod -aG docker $USER
newgrp docker

# 验证
docker run hello-world
```

#### 配置国内镜像加速（重要！）

```json
// /etc/docker/daemon.json（Linux）
// Docker Desktop → Settings → Docker Engine（Windows/Mac）
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://mirror.ccs.tencentyun.com",
    "https://registry.docker-cn.com"
  ]
}
```

```bash
# 重启 Docker 服务（Linux）
sudo systemctl daemon-reload
sudo systemctl restart docker
```

---

### 1.3 核心概念：镜像 / 容器 / 仓库 / Dockerfile

<span class="lv lv-1">初级</span>

```
                   Docker 核心概念关系图
┌────────────────────────────────────────────────────────┐
│                     Registry（仓库）                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Repository: node    node:18  node:18-alpine ... │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────┬──────────────────────────────────┘
                      │ docker pull / push
                      ▼
┌────────────────────────────────────────────────────────┐
│                  Image（镜像）                          │
│  只读层叠结构，类似"类"或"模板"                          │
│  Layer 3: COPY app.js /app/                            │
│  Layer 2: RUN npm install                              │
│  Layer 1: FROM node:18-alpine                          │
└─────────────────────┬──────────────────────────────────┘
                      │ docker run
                      ▼
┌────────────────────────────────────────────────────────┐
│                Container（容器）                        │
│  运行中的镜像实例，类似"类的实例对象"                     │
│  可写层 (Writable Layer) ← 仅此层可写                   │
│  只读镜像层 (Image Layers)                              │
└────────────────────────────────────────────────────────┘
                      ↑
            Dockerfile → docker build → Image
```

| 概念         | 类比                | 说明                                    |
|------------|-------------------|-----------------------------------------|
| Image 镜像   | 类 / 模板           | 只读，包含运行应用所需的一切文件和配置          |
| Container 容器| 类的实例 / 进程      | 镜像的运行实例，可启动/停止/删除              |
| Registry 仓库 | npm Registry      | 存储和分发镜像的服务（如 Docker Hub）          |
| Dockerfile  | package.json + 脚本 | 定义如何构建镜像的文本文件                   |
| Volume 数据卷 | 外部挂载磁盘         | 容器数据持久化机制                          |

---

### 1.4 镜像操作

<span class="lv lv-1">初级</span>

```bash
# ─── 拉取镜像 ───────────────────────────────────────────
docker pull node:18-alpine          # 拉取指定 tag
docker pull nginx                   # 不写 tag 默认 :latest

# ─── 查看本地镜像 ─────────────────────────────────────────
docker images                       # 列出所有镜像
docker images -q                    # 只显示镜像 ID
docker images node                  # 筛选 node 相关镜像

# 输出示例：
# REPOSITORY   TAG          IMAGE ID       CREATED        SIZE
# node         18-alpine    a1b2c3d4e5f6   2 weeks ago    172MB
# nginx        latest       f0c3e4d1a2b3   3 days ago     142MB

# ─── 删除镜像 ───────────────────────────────────────────
docker rmi nginx                    # 按名称删除
docker rmi f0c3e4d1a2b3             # 按 ID 删除
docker rmi $(docker images -q)      # 删除所有镜像（慎用）
docker image prune                  # 删除悬空镜像（无 tag 的）
docker image prune -a               # 删除所有未被容器使用的镜像

# ─── 打标签 ─────────────────────────────────────────────
docker tag node:18-alpine myapp:1.0.0
docker tag myapp:1.0.0 registry.cn-hangzhou.aliyuncs.com/myns/myapp:1.0.0

# ─── 保存与加载（离线传输）────────────────────────────────
docker save -o myapp.tar myapp:1.0.0        # 保存为 tar 文件
docker load -i myapp.tar                    # 从 tar 文件加载

# ─── 查看镜像详情 ─────────────────────────────────────────
docker inspect node:18-alpine               # 查看镜像元数据（JSON）
docker history node:18-alpine               # 查看镜像层历史

# ─── 搜索镜像 ───────────────────────────────────────────
docker search nginx                         # 搜索 Docker Hub
docker search --filter=is-official=true nginx  # 只看官方镜像
```

---

### 1.5 容器操作

<span class="lv lv-1">初级</span>

```bash
# ─── 运行容器 ───────────────────────────────────────────
docker run nginx                            # 前台运行
docker run -d nginx                         # -d 后台运行（detached）
docker run -d -p 8080:80 nginx             # -p 宿主:容器 端口映射
docker run -d -p 8080:80 --name my-nginx nginx  # --name 自定义容器名
docker run -it node:18-alpine sh           # -it 交互式终端
docker run --rm -it node:18-alpine sh      # --rm 退出后自动删除容器

# 常用 run 参数汇总
# -d             后台运行
# -p 宿主:容器    端口映射
# -v 宿主:容器    目录挂载
# --name         容器名称
# -e KEY=VALUE   环境变量
# --rm           退出后删除
# --network      指定网络
# --restart      重启策略（no/always/unless-stopped/on-failure）

# ─── 查看容器 ───────────────────────────────────────────
docker ps                                  # 运行中的容器
docker ps -a                               # 所有容器（含已停止）
docker ps -q                               # 只显示容器 ID

# ─── 停止 / 启动 / 删除 ────────────────────────────────
docker stop my-nginx                       # 优雅停止（SIGTERM）
docker kill my-nginx                       # 强制停止（SIGKILL）
docker start my-nginx                      # 启动已停止的容器
docker restart my-nginx                    # 重启容器
docker rm my-nginx                         # 删除已停止的容器
docker rm -f my-nginx                      # 强制删除运行中的容器
docker rm $(docker ps -aq)                 # 删除所有容器

# ─── 进入容器 ───────────────────────────────────────────
docker exec -it my-nginx sh                # 进入运行中的容器
docker exec -it my-nginx bash              # 如果有 bash
docker exec my-nginx ls /usr/share/nginx/html  # 执行单条命令

# ─── 查看日志 ───────────────────────────────────────────
docker logs my-nginx                       # 查看全部日志
docker logs -f my-nginx                    # 实时跟踪日志（follow）
docker logs --tail 100 my-nginx            # 最近 100 行
docker logs --since 30m my-nginx           # 最近 30 分钟

# ─── 查看容器详情 ─────────────────────────────────────────
docker inspect my-nginx                    # 完整元数据（JSON）
docker inspect -f '{{.NetworkSettings.IPAddress}}' my-nginx  # 格式化输出

# ─── 资源使用情况 ─────────────────────────────────────────
docker stats                               # 实时资源监控
docker top my-nginx                        # 容器内进程列表

# ─── 文件拷贝 ───────────────────────────────────────────
docker cp my-nginx:/etc/nginx/nginx.conf ./nginx.conf   # 容器→宿主
docker cp ./index.html my-nginx:/usr/share/nginx/html/  # 宿主→容器
```

---

### 1.6 Dockerfile 详解

<span class="lv lv-1">初级</span>

#### 指令速查表

| 指令          | 作用                             | 说明                                      |
|-------------|--------------------------------|-------------------------------------------|
| `FROM`      | 指定基础镜像                      | 每个 Dockerfile 必须以 FROM 开头             |
| `RUN`       | 构建时执行命令                    | 每条 RUN 创建一个新层，尽量合并                 |
| `COPY`      | 复制文件/目录到镜像                | 推荐用 COPY，只支持本地文件                    |
| `ADD`       | 复制文件（支持 URL 和自动解压 tar）  | 有魔法行为，非必要用 COPY                     |
| `WORKDIR`   | 设置工作目录                      | 相当于 cd，目录不存在自动创建                   |
| `ENV`       | 设置环境变量                      | 构建和运行时均可用                            |
| `EXPOSE`    | 声明容器监听的端口                  | 仅文档作用，不自动映射到宿主                    |
| `CMD`       | 容器启动时默认执行的命令             | 可被 docker run 末尾参数覆盖                  |
| `ENTRYPOINT`| 容器启动时固定执行的命令             | 不可被轻易覆盖（需 --entrypoint 强制覆盖）       |
| `ARG`       | 构建时参数（build-arg）            | 仅构建时可用，运行时不存在                      |
| `VOLUME`    | 声明挂载点                        | 提示该路径需要持久化                          |
| `USER`      | 切换运行用户                      | 安全最佳实践：避免以 root 运行                  |
| `LABEL`     | 添加元数据标签                    | 可用于镜像管理和过滤                          |
| `HEALTHCHECK`| 健康检查                         | 定义检查容器健康状态的命令                     |

#### CMD vs ENTRYPOINT 对比

```
┌─────────────────────────────────────────────────────────────┐
│                  CMD vs ENTRYPOINT                          │
├────────────────────┬────────────────────────────────────────┤
│    CMD             │    ENTRYPOINT                          │
├────────────────────┼────────────────────────────────────────┤
│ 提供默认命令/参数    │ 定义容器的主进程                         │
│ 可被 run 末尾覆盖   │ 不可轻易覆盖（需 --entrypoint）           │
│ 适合：可替换的命令   │ 适合：固定的入口程序                      │
├────────────────────┴────────────────────────────────────────┤
│  最佳实践：ENTRYPOINT + CMD 配合使用                         │
│  ENTRYPOINT ["node"]          ← 固定执行 node               │
│  CMD ["server.js"]            ← 默认参数，可被覆盖            │
│                                                             │
│  docker run myapp             → node server.js             │
│  docker run myapp index.js    → node index.js              │
└─────────────────────────────────────────────────────────────┘
```

#### 完整 Dockerfile 示例（Node.js）

```dockerfile
# 指定基础镜像
FROM node:18-alpine

# 添加元数据
LABEL maintainer="dev@example.com"
LABEL version="1.0"

# 构建参数（构建时传入：docker build --build-arg NODE_ENV=production）
ARG NODE_ENV=production

# 环境变量
ENV NODE_ENV=${NODE_ENV}
ENV PORT=3000

# 设置工作目录
WORKDIR /app

# 先复制依赖文件（利用构建缓存）
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production && \
    npm cache clean --force

# 复制源码
COPY . .

# 声明端口
EXPOSE 3000

# 声明数据卷
VOLUME ["/app/logs"]

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# 切换非 root 用户
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# 启动命令
CMD ["node", "server.js"]
```

---

### 1.7 docker-compose 入门

<span class="lv lv-1">初级</span>

docker-compose 用于**定义和运行多容器应用**，是前端全栈项目的标配工具。

```yaml
# docker-compose.yml 基础结构
version: "3.9"           # compose 文件格式版本（v2 可省略）

services:                # 服务定义
  web:                   # 服务名（自定义）
    image: nginx:alpine  # 使用现有镜像
    ports:
      - "80:80"          # 宿主端口:容器端口
    volumes:
      - ./html:/usr/share/nginx/html  # 目录挂载
    environment:
      - NGINX_HOST=localhost

  app:
    build: .             # 从当前目录 Dockerfile 构建
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development

volumes:                 # 顶层 volumes 声明（命名卷）
  db_data:

networks:                # 顶层 networks 声明
  app_net:
    driver: bridge
```

#### 常用 compose 命令

```bash
docker compose up              # 启动所有服务（前台）
docker compose up -d           # 后台启动
docker compose up --build      # 重新构建镜像后启动
docker compose down            # 停止并删除容器/网络
docker compose down -v         # 同时删除数据卷
docker compose ps              # 查看服务状态
docker compose logs -f         # 查看所有服务日志
docker compose logs -f app     # 查看指定服务日志
docker compose exec app sh     # 进入指定服务容器
docker compose restart app     # 重启指定服务
docker compose build           # 构建/重建镜像
docker compose pull            # 拉取最新镜像
docker compose config          # 验证并查看最终配置
```

---

### 1.8 .dockerignore 与构建上下文

<span class="lv lv-1">初级</span>

`.dockerignore` 告诉 Docker 哪些文件/目录**不需要**发送到构建上下文，类似 `.gitignore`。

```
# .dockerignore 示例（Node.js 项目）

# 依赖（容器内会重新安装）
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 版本控制
.git
.gitignore
.github

# 编辑器/IDE
.vscode
.idea
*.swp
*.swo

# 环境配置（敏感信息不进镜像）
.env
.env.*
!.env.example

# 构建产物（根据项目决定是否忽略）
dist
build
.next
out

# 日志和缓存
logs
*.log
.cache

# 测试文件
__tests__
*.test.js
*.spec.js
coverage

# Docker 相关
Dockerfile*
docker-compose*
.dockerignore

# 文档
README.md
docs
```

#### 构建上下文原理

```
docker build -t myapp .
                      ↑
                 构建上下文 = 当前目录

┌─────────────────────────────────────────┐
│  Build Context（构建上下文）              │
│  Docker 将此目录所有文件打包发送给 Daemon  │
│  .dockerignore 可排除不必要的文件          │
│                                         │
│  问题：node_modules 有数万个文件，如不忽略  │
│        会极大拖慢构建速度！               │
└─────────────────────────────────────────┘
```

---

### 1.9 常用 Dockerfile 模板

<span class="lv lv-1">初级</span>

#### Node.js（Express API）

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]
```

#### Nginx（静态网站 / Vue/React 构建产物）

```dockerfile
FROM nginx:alpine
# 删除默认配置
RUN rm /etc/nginx/conf.d/default.conf
# 添加自定义配置
COPY nginx.conf /etc/nginx/conf.d/
# 复制构建产物
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf（SPA 路由支持）
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # SPA history 路由
    }

    location /api/ {
        proxy_pass http://backend:3000/;   # 反向代理后端
    }

    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

#### MySQL

```dockerfile
FROM mysql:8.0
# 设置字符集
ENV MYSQL_CHARSET=utf8mb4
# 初始化 SQL（容器首次启动时执行）
COPY init.sql /docker-entrypoint-initdb.d/
EXPOSE 3306
```

```yaml
# docker-compose 方式（更常用）
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: mydb
      MYSQL_USER: user
      MYSQL_PASSWORD: userpass
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

#### Redis

```yaml
# Redis（通常直接用 compose，不需要自定义 Dockerfile）
services:
  redis:
    image: redis:7-alpine
    command: redis-server --requirepass mypassword
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

volumes:
  redis_data:
```

#### MongoDB

```yaml
services:
  mongo:
    image: mongo:6
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: mydb
    volumes:
      - mongo_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
    ports:
      - "27017:27017"

volumes:
  mongo_data:
```

---

### 1.10 Docker Hub 与镜像仓库

<span class="lv lv-1">初级</span>

```bash
# ─── Docker Hub（官方公共仓库）────────────────────────────
# 1. 注册账号：https://hub.docker.com

# 2. 登录
docker login
docker login -u username -p password   # 非交互式（CI 用）

# 3. 推送镜像（必须以 用户名/镜像名 格式命名）
docker tag myapp:1.0.0 username/myapp:1.0.0
docker push username/myapp:1.0.0

# 4. 拉取自己的镜像
docker pull username/myapp:1.0.0

# 5. 登出
docker logout

# ─── 阿里云镜像仓库（国内推荐）───────────────────────────
# 1. 开通：https://cr.console.aliyun.com
# 2. 创建命名空间和仓库

# 3. 登录阿里云
docker login --username=your@email.com registry.cn-hangzhou.aliyuncs.com

# 4. 推送
docker tag myapp:1.0.0 registry.cn-hangzhou.aliyuncs.com/your-namespace/myapp:1.0.0
docker push registry.cn-hangzhou.aliyuncs.com/your-namespace/myapp:1.0.0

# ─── 私有仓库（Harbor / 自建 registry）──────────────────
# 快速搭建本地私有仓库
docker run -d -p 5000:5000 --name registry registry:2

# 推送到私有仓库
docker tag myapp:1.0.0 localhost:5000/myapp:1.0.0
docker push localhost:5000/myapp:1.0.0
docker pull localhost:5000/myapp:1.0.0
```

---

## 二、🟡 中级进阶

### 2.1 多阶段构建（multi-stage build）

<span class="lv lv-2">中级</span>

多阶段构建让你在一个 Dockerfile 中使用多个 FROM，只把最终需要的产物复制到最后阶段，大幅缩小镜像体积。

#### 对比（以 React 前端为例）

```
不用多阶段构建：
┌──────────────────────────────┐
│  node:18 (单层)               │  镜像大小：~900MB+
│  ├── node_modules            │  包含 node 运行时、开发依赖、源码
│  ├── src/                    │
│  └── dist/ (构建产物)        │
└──────────────────────────────┘

使用多阶段构建：
┌──────────────────────────────┐
│  Stage 1: build（node:18）   │  ← 不进入最终镜像
│  ├── node_modules            │
│  ├── src/                    │
│  └── dist/                   │
└──────────────┬───────────────┘
               │ COPY --from=build /app/dist
               ▼
┌──────────────────────────────┐
│  Stage 2: nginx:alpine       │  镜像大小：~25MB
│  └── /usr/share/nginx/html/  │  只有静态资源 + nginx
└──────────────────────────────┘
```

#### Vue/React 项目多阶段构建

```dockerfile
# ─── Stage 1: 构建阶段 ───────────────────────────────────
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ─── Stage 2: 生产阶段 ───────────────────────────────────
FROM nginx:alpine AS production

# 只从构建阶段复制 dist 目录
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Node.js 后端多阶段构建（TypeScript）

```dockerfile
# ─── Stage 1: 编译 TypeScript ───────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci                          # 安装含 devDependencies 的完整依赖
COPY src/ ./src/
RUN npm run build                   # tsc 编译输出到 dist/

# ─── Stage 2: 生产运行 ──────────────────────────────────
FROM node:18-alpine AS production

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production        # 只装生产依赖
COPY --from=builder /app/dist ./dist

EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]
```

```bash
# 构建并指定目标阶段
docker build -t myapp:prod .
docker build --target build -t myapp:build .  # 只构建到 build 阶段（调试用）
```

---

### 2.2 数据卷与绑定挂载

<span class="lv lv-2">中级</span>

#### 三种挂载方式对比

```
┌──────────────────────────────────────────────────────────────┐
│               Docker 挂载方式对比                             │
├──────────────┬───────────────────┬───────────────────────────┤
│  类型         │  数据存储位置       │  适用场景                  │
├──────────────┼───────────────────┼───────────────────────────┤
│ Volume       │ Docker 管理区      │ 数据库、持久化数据           │
│ (命名卷)      │ /var/lib/docker/  │ 最佳持久化方案              │
│              │ volumes/          │                           │
├──────────────┼───────────────────┼───────────────────────────┤
│ Bind Mount   │ 宿主机任意目录      │ 开发时热重载、配置文件注入    │
│ (绑定挂载)    │ 由用户指定绝对路径  │ 直接操作宿主文件系统         │
├──────────────┼───────────────────┼───────────────────────────┤
│ tmpfs Mount  │ 内存（临时）        │ 敏感数据、高速临时存储        │
│ (内存挂载)    │ 容器停止即消失      │ 不需要持久化的数据           │
└──────────────┴───────────────────┴───────────────────────────┘
```

```bash
# ─── 命名卷（Volume）────────────────────────────────────
docker volume create mydata                       # 创建卷
docker volume ls                                  # 列出卷
docker volume inspect mydata                      # 查看卷详情
docker volume rm mydata                           # 删除卷
docker volume prune                               # 删除所有未使用的卷

# 使用命名卷
docker run -d -v mydata:/app/data mysql:8.0

# ─── 绑定挂载（Bind Mount）──────────────────────────────
# 开发场景：代码热重载
docker run -d \
  -v $(pwd)/src:/app/src \         # 宿主源码挂载进容器
  -p 3000:3000 \
  myapp:dev

# ─── 只读挂载 ──────────────────────────────────────────
docker run -v /host/config:/app/config:ro nginx   # :ro 只读

# ─── docker-compose 中使用 ───────────────────────────
services:
  app:
    volumes:
      - ./src:/app/src               # 绑定挂载（开发）
      - app_logs:/app/logs           # 命名卷（数据持久化）
      - /etc/localtime:/etc/localtime:ro  # 同步时区（只读）

  db:
    volumes:
      - db_data:/var/lib/mysql       # 数据库数据卷

volumes:
  app_logs:
  db_data:
```

---

### 2.3 网络模式

<span class="lv lv-2">中级</span>

```
Docker 网络模式架构图

bridge（默认）                    host                      none
┌──────────────────────┐        ┌────────────────────┐    ┌──────────┐
│  Container A         │        │  Container         │    │Container │
│  172.17.0.2          │        │  共享宿主网络栈      │    │ 无网络   │
├──────────────────────┤        │  直接用宿主IP和端口  │    └──────────┘
│  Docker bridge 网关   │        └────────────────────┘
│  172.17.0.1          │
├──────────────────────┤     自定义 bridge（推荐）
│  Container B         │     ┌──────────────────────────────────┐
│  172.17.0.3          │     │  my-network                      │
└──────────────────────┘     │  ┌───────────┐  ┌───────────┐   │
         │                   │  │  app      │  │  mysql    │   │
      NAT + iptables         │  │  可直接用  ├─►│  可直接用  │   │
         │                   │  │ 服务名通信  │  │ 服务名通信  │   │
    宿主机网络                │  └───────────┘  └───────────┘   │
                             └──────────────────────────────────┘
```

```bash
# ─── 网络管理命令 ─────────────────────────────────────────
docker network ls                           # 列出所有网络
docker network inspect bridge               # 查看网络详情
docker network create my-net                # 创建自定义 bridge 网络
docker network create --driver host my-host # 创建 host 网络
docker network rm my-net                    # 删除网络
docker network prune                        # 删除所有未使用网络

# 连接/断开容器与网络
docker network connect my-net my-container
docker network disconnect my-net my-container

# 运行容器时指定网络
docker run --network my-net --name app myapp

# ─── docker-compose 中的网络 ──────────────────────────
services:
  app:
    networks:
      - frontend
      - backend

  mysql:
    networks:
      - backend          # mysql 不暴露给 frontend

  nginx:
    networks:
      - frontend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true       # 仅内部通信，不对外
```

| 网络模式        | 适用场景                              |
|--------------|-------------------------------------|
| bridge（默认） | 单机多容器通信（需端口映射才能访问宿主）     |
| host         | 高性能需求，直接绑定宿主端口              |
| none         | 完全网络隔离（安全计算任务）              |
| 自定义 bridge | 多容器项目（推荐），容器间可用服务名访问     |
| overlay      | Docker Swarm/多主机集群               |

---

### 2.4 docker-compose 进阶

<span class="lv lv-2">中级</span>

```yaml
# docker-compose.yml 进阶特性示例
version: "3.9"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NODE_ENV: production
    image: myapp:latest
    container_name: myapp
    restart: unless-stopped        # 重启策略
    env_file:
      - .env                       # 从文件读取环境变量
      - .env.production
    environment:
      NODE_ENV: production
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      mysql:
        condition: service_healthy # 等 mysql 健康才启动
      redis:
        condition: service_started
    networks:
      - app-network
    volumes:
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s            # 启动初始化等待时间
    deploy:
      resources:
        limits:
          cpus: "0.50"             # CPU 限制
          memory: 512M             # 内存限制
        reservations:
          memory: 128M

  mysql:
    image: mysql:8.0
    restart: unless-stopped
    env_file: .env
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - app-network

volumes:
  mysql_data:
    driver: local
  redis_data:
    driver: local

networks:
  app-network:
    driver: bridge
```

#### 重启策略说明

| 策略                 | 说明                                     |
|--------------------|------------------------------------------|
| `no`               | 不自动重启（默认）                          |
| `always`           | 总是重启（Docker 重启后也会自动启动）         |
| `unless-stopped`   | 手动停止则不重启，其余情况都重启（推荐生产用）   |
| `on-failure[:n]`   | 非 0 退出码才重启，可指定最大重试次数         |

---

### 2.5 镜像优化最佳实践

<span class="lv lv-2">中级</span>

#### 优化原则与效果对比

```
优化前 vs 优化后（Node.js 项目）

未优化：
┌────────────────────────────────────────┐
│  FROM node:18                          │  ← 900MB 基础镜像
│  COPY . .                              │  ← 包含 node_modules、.git 等
│  RUN npm install                       │  ← 每次都重新安装
│  RUN npm run build                     │
│  镜像大小：~1.2GB                       │
└────────────────────────────────────────┘

优化后：
┌────────────────────────────────────────┐
│  FROM node:18-alpine AS builder        │  ← 172MB 轻量基础镜像
│  COPY package*.json ./                 │  ← 先复制 package.json（缓存层）
│  RUN npm ci --only=production          │
│  COPY src/ ./src/                      │  ← 再复制源码（缓存优化）
│  ── 多阶段 ──                           │
│  FROM node:18-alpine                   │
│  COPY --from=builder /app/dist ./dist  │  ← 只复制产物
│  镜像大小：~120MB                       │
└────────────────────────────────────────┘
```

#### 最佳实践清单

```dockerfile
# ✅ 1. 使用 Alpine 轻量基础镜像
FROM node:18-alpine    # 而不是 FROM node:18（相差约 800MB）

# ✅ 2. 分离依赖安装与代码复制（利用层缓存）
COPY package*.json ./  # 先复制 package.json
RUN npm ci             # 只有 package.json 变化时才重跑
COPY . .               # 再复制代码（代码变化不影响依赖层缓存）

# ✅ 3. 使用 npm ci 替代 npm install（更快、更一致）
RUN npm ci --only=production

# ✅ 4. 合并 RUN 命令减少层数
RUN apt-get update && \
    apt-get install -y curl wget && \
    rm -rf /var/lib/apt/lists/*    # 清理缓存，减小层大小

# ✅ 5. 使用 .dockerignore 排除无关文件

# ✅ 6. 多阶段构建（见 2.1）

# ✅ 7. 不以 root 运行
RUN addgroup -S app && adduser -S app -G app
USER app

# ✅ 8. 固定基础镜像版本（生产环境避免 :latest）
FROM node:18.19.0-alpine3.18   # 精确版本
```

#### 镜像体积分析工具

```bash
# 查看各层大小
docker history myapp:latest

# 使用 dive 工具深度分析（需单独安装）
docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock \
  wagoodman/dive myapp:latest
```

---

### 2.6 Node.js 项目实战

<span class="lv lv-2">中级</span>

**目标：Express + MySQL + Redis 三服务完整编排**

#### 项目目录结构

```
my-fullstack-app/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── db.js
│   │   └── routes/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── dist/             (构建产物)
│   ├── Dockerfile
│   └── nginx.conf
├── mysql/
│   └── init.sql
├── .env
├── .env.example
├── .dockerignore
└── docker-compose.yml
```

#### backend/Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/src ./src
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://localhost:3000/health || exit 1
USER node
CMD ["node", "src/index.js"]
```

#### frontend/Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### frontend/nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理（容器间通过服务名通信）
    location /api/ {
        proxy_pass http://backend:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

#### .env

```bash
# 数据库
DB_HOST=mysql
DB_PORT=3306
DB_NAME=myapp
DB_USER=appuser
DB_PASSWORD=AppPass2024!
DB_ROOT_PASSWORD=RootPass2024!

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=RedisPass2024!

# 应用
NODE_ENV=production
JWT_SECRET=your-jwt-secret-here
PORT=3000
```

#### docker-compose.yml（完整版）

```yaml
version: "3.9"

services:
  # ── 前端（Nginx）─────────────────────────────────────
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: app-frontend
    ports:
      - "80:80"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped

  # ── 后端（Express）───────────────────────────────────
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: app-backend
    env_file: .env
    environment:
      NODE_ENV: production
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - app-network
    volumes:
      - ./logs/backend:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # ── 数据库（MySQL）───────────────────────────────────
  mysql:
    image: mysql:8.0
    container_name: app-mysql
    env_file: .env
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${DB_ROOT_PASSWORD}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  # ── 缓存（Redis）─────────────────────────────────────
  redis:
    image: redis:7-alpine
    container_name: app-redis
    command: >
      redis-server
      --requirepass ${REDIS_PASSWORD}
      --appendonly yes
      --maxmemory 256mb
      --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mysql_data:
    driver: local
  redis_data:
    driver: local

networks:
  app-network:
    driver: bridge
```

#### 启动命令

```bash
# 首次启动
docker compose up -d --build

# 查看状态
docker compose ps

# 查看后端日志
docker compose logs -f backend

# 进入 mysql 容器执行 SQL
docker compose exec mysql mysql -u appuser -pAppPass2024! myapp

# 进入 redis 容器
docker compose exec redis redis-cli -a RedisPass2024!

# 停止并清理
docker compose down
docker compose down -v   # 同时清除数据卷（慎用）
```

---

### 2.7 环境变量与配置管理

<span class="lv lv-2">中级</span>

```bash
# ─── 多环境配置文件 ────────────────────────────────────
.env                    # 默认（本地开发）
.env.development        # 开发环境
.env.production         # 生产环境
.env.test               # 测试环境
.env.example            # 示例（提交到 Git）

# .gitignore 中排除真实 .env
.env
.env.*
!.env.example
```

```yaml
# docker-compose.yml 多环境方案一：env_file 指定文件
services:
  app:
    env_file:
      - .env
      - .env.${COMPOSE_ENV:-development}   # 通过 COMPOSE_ENV 控制
```

```bash
# 方案二：多个 compose 文件叠加
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

```yaml
# docker-compose.prod.yml（覆盖开发配置）
services:
  app:
    image: myapp:1.0.0    # 生产用固定版本镜像
    environment:
      NODE_ENV: production
    restart: always
```

```bash
# 方案三：COMPOSE_FILE 环境变量
export COMPOSE_FILE=docker-compose.yml:docker-compose.prod.yml
docker compose up -d
```

#### 敏感信息最佳实践

```bash
# 不要把密码写进 Dockerfile
# ❌ 错误做法
ENV DB_PASSWORD=secret123

# 通过 .env 注入（不提交到 Git）
# ✅ 正确做法：.env 文件中设置
DB_PASSWORD=secret123

# 生产环境用 Docker Secrets（Swarm）或 K8s Secrets
echo "secret123" | docker secret create db_password -
```

---

### 2.8 日志管理与容器监控

<span class="lv lv-2">中级</span>

```bash
# ─── 日志查看 ─────────────────────────────────────────
docker logs myapp                      # 全部日志
docker logs -f myapp                   # 实时跟踪
docker logs --tail 200 myapp           # 最近 200 行
docker logs --since "2024-01-01" myapp # 指定时间后的日志
docker logs --since 1h myapp           # 最近 1 小时
docker logs -t myapp                   # 带时间戳

# ─── 日志驱动配置 ─────────────────────────────────────
# 默认 json-file，日志存储在宿主机
# /var/lib/docker/containers/<id>/<id>-json.log
```

```yaml
# docker-compose.yml 中配置日志
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "50m"        # 单文件最大 50MB
        max-file: "5"          # 最多保留 5 个文件

  # 或输出到 syslog
  app2:
    logging:
      driver: "syslog"
      options:
        syslog-address: "tcp://192.168.0.42:123"
```

```bash
# ─── 容器资源监控 ─────────────────────────────────────
docker stats                           # 所有容器实时资源
docker stats myapp mysql redis         # 指定容器
docker stats --no-stream               # 只输出一次（非实时）

# 输出示例：
# CONTAINER   CPU %   MEM USAGE / LIMIT    MEM %   NET I/O      BLOCK I/O
# myapp       0.5%    128MiB / 512MiB      25%     1.2MB/800kB  5.4MB/2.1MB

# ─── 系统级清理与信息 ─────────────────────────────────
docker system df                       # Docker 磁盘占用
docker system df -v                    # 详细信息
docker system prune                    # 清理所有未使用资源
docker system prune -a --volumes       # 深度清理（慎用！）
```

---

### 2.9 常见问题与排查

<span class="lv lv-2">中级</span>

#### 问题排查思路

```
容器问题排查流程

docker compose ps       ← 查看容器状态
        │
        ├── Exited → docker logs <container>   查看错误日志
        │
        ├── Restarting → docker inspect <container> 查看退出码
        │
        └── Up (unhealthy) → docker exec 进容器手动检查
```

#### 常见问题速查

```bash
# ── 问题 1：容器起不来 ─────────────────────────────────
# 症状：docker ps -a 看到 Exited(1)
# 排查：
docker logs <container>              # 查看错误信息
docker inspect <container> | grep -A5 '"State"'  # 查看状态和退出码

# ── 问题 2：端口冲突 ───────────────────────────────────
# 症状：Error: bind: address already in use
# 排查：
netstat -tulnp | grep 3000           # Linux：查看端口占用
lsof -i :3000                        # macOS：查看端口占用
netstat -ano | findstr 3000          # Windows

# 解决：换端口映射或停止占用进程
docker run -p 3001:3000 myapp        # 换宿主端口

# ── 问题 3：权限问题 ───────────────────────────────────
# 症状：Permission denied
# 原因：容器内用非 root 用户，但挂载目录属主不匹配
# 解决：
# 方式一：修改宿主目录权限
chmod 777 ./logs

# 方式二：Dockerfile 中修改目录所有者
RUN chown -R node:node /app/logs
USER node

# 方式三：docker run 时指定用户
docker run --user $(id -u):$(id -g) myapp

# ── 问题 4：容器间无法通信 ─────────────────────────────
# 症状：connect ECONNREFUSED mysql:3306
# 原因：服务不在同一网络 / 服务名写错
# 排查：
docker network inspect <network>     # 查看网络中的容器
docker exec app ping mysql           # 测试连通性

# 解决：确保都在同一 compose 文件或同一 network

# ── 问题 5：磁盘空间不足 ──────────────────────────────
# 症状：no space left on device
docker system df                     # 查看占用
docker image prune -a                # 清理无用镜像
docker container prune               # 清理停止的容器
docker volume prune                  # 清理无用数据卷
docker builder prune                 # 清理构建缓存
docker system prune -a               # 一键清理（慎用）

# ── 问题 6：构建缓存失效 ──────────────────────────────
# 强制不使用缓存重新构建
docker build --no-cache -t myapp .

# ── 问题 7：Windows 下路径问题 ────────────────────────
# 问题：挂载路径在 Windows 下格式不同
# 解决：使用正斜杠或相对路径，WSL2 用 /mnt/c/...
volumes:
  - ./data:/app/data                  # 相对路径（推荐）

# ── 问题 8：健康检查一直不通过 ────────────────────────
# 排查：
docker inspect --format='{{json .State.Health}}' myapp | python -m json.tool
# 查看 Log 字段中的具体报错
```

---

## 三、🔴 高级实战

### 3.1 Docker 与 CI/CD

<span class="lv lv-3">高级</span>

#### GitHub Actions 完整示例

```yaml
# .github/workflows/docker-build-push.yml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha,prefix=sha-
            type=semver,pattern={{version}}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha            # 使用 GitHub Actions 缓存
          cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to server via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/myapp
            docker compose pull
            docker compose up -d --remove-orphans
            docker image prune -f
```

---

### 3.2 Docker 安全最佳实践

<span class="lv lv-3">高级</span>

```dockerfile
# ✅ 1. 不使用 root 用户运行
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# ✅ 2. 使用官方/可信基础镜像，固定版本
FROM node:18.19.0-alpine3.18

# ✅ 3. 扫描镜像漏洞
# docker scout cves myapp:latest      (Docker Scout)
# trivy image myapp:latest            (Trivy)
# snyk container test myapp:latest    (Snyk)

# ✅ 4. 不在镜像中存储敏感信息
# 使用 .env 或 Docker Secrets，不用 ENV 存密码

# ✅ 5. 最小化镜像：只安装需要的包
# distroless 镜像（极简，无 shell）
FROM gcr.io/distroless/nodejs18-debian12
```

```yaml
# ✅ 6. docker-compose 安全配置
services:
  app:
    read_only: true                    # 只读文件系统
    tmpfs:
      - /tmp                           # 需要写入的临时目录用 tmpfs
    cap_drop:
      - ALL                            # 删除所有 Linux Capabilities
    cap_add:
      - NET_BIND_SERVICE               # 只添加必要的 Capability
    security_opt:
      - no-new-privileges:true         # 禁止提权
```

---

### 3.3 面试高频题 10 条

<span class="lv lv-3">高级</span>

**Q1. Docker 容器与虚拟机的区别？**
> 容器共享宿主内核，通过 Namespace 和 Cgroups 实现隔离，启动快（秒级）、体积小（MB 级）；VM 有完整 Guest OS，隔离更强但开销大（GB 级、分钟级启动）。

**Q2. Docker 镜像分层原理是什么？**
> 镜像由只读层（Union FS）叠加而成，每条 Dockerfile 指令产生一层。容器运行时在镜像层上添加可写层。层可共享，相同层只存储一份，节省空间且提高构建速度。

**Q3. COPY 和 ADD 的区别？**
> 两者都能复制文件，但 ADD 额外支持：自动解压 `.tar.*` 压缩包、从 URL 下载文件。推荐默认用 COPY，语义更清晰；只在需要解压或 URL 时用 ADD。

**Q4. CMD 和 ENTRYPOINT 的区别？**
> ENTRYPOINT 定义容器主进程，不可被 `docker run` 末尾参数覆盖（需 `--entrypoint`）；CMD 提供默认参数，可被覆盖。最佳实践：`ENTRYPOINT ["node"]` + `CMD ["server.js"]` 配合使用。

**Q5. 如何减小 Docker 镜像体积？**
> ① 使用 Alpine 轻量基础镜像；② 多阶段构建；③ 合并 RUN 指令减少层数；④ `npm ci --only=production`；⑤ `.dockerignore` 排除无关文件；⑥ 构建后清理缓存（`rm -rf /var/lib/apt/lists/*`）。

**Q6. Docker 数据持久化方案有哪些？**
> ① Volume（命名卷）：由 Docker 管理，最适合数据库等持久化数据；② Bind Mount（绑定挂载）：映射宿主目录，适合开发热重载和配置注入；③ tmpfs：内存临时存储，适合敏感数据。

**Q7. docker-compose depends_on 能保证服务完全就绪吗？**
> 不能！`depends_on` 只等待容器启动（进程存在），不等待服务真正就绪（如 MySQL 接受连接）。需要配合 `healthcheck` 和 `condition: service_healthy` 才能真正等待服务就绪。

**Q8. Docker 网络 bridge 和 host 模式区别？**
> bridge（默认）：容器有独立网络命名空间，通过 NAT 与外部通信，需端口映射；host：容器直接使用宿主网络栈，性能更好但端口与宿主共享，不支持 macOS/Windows Docker Desktop。

**Q9. 如何在 CI/CD 中利用 Docker 构建缓存？**
> ① 合理排列 Dockerfile 指令（稳定层在前，频繁变化层在后）；② 使用 `--cache-from` 指定缓存镜像；③ GitHub Actions 使用 `cache-from: type=gha`；④ BuildKit 的 `--mount=type=cache` 缓存 npm/pip 等包管理器目录。

**Q10. 容器内进程崩溃后如何自动恢复？**
> 设置 `restart` 策略：开发用 `no`（默认），生产推荐 `unless-stopped`（手动停止不重启，其他情况自动重启）；`always` 连 Docker 重启后也会自动拉起；`on-failure:3` 非 0 退出码才重启，最多 3 次。

---

> **学习建议**
>
> 初级阶段先把 1.3～1.7 练熟，能跑起来单服务容器和简单 compose 即可。
> 中级重点是 2.1 多阶段构建 + 2.6 实战项目，这是全栈项目的核心。
> 高级内容按需学习，CI/CD 部分优先掌握 GitHub Actions 基础流程。
