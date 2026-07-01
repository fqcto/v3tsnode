# NestJS 全阶段学习手册

> 面向前端转全栈开发者 —— 你已经有 TypeScript 和 Express 基础，现在用 NestJS 写出更规范、更易维护的后端。

---

## 目录

- [一、🟢 初级入门](#一-初级入门)
  - [1.1 NestJS 是什么 & 与 Express/Koa 对比](#11-nestjs-是什么--与-expresskoa-对比)
  - [1.2 CLI 创建项目](#12-cli-创建项目)
  - [1.3 项目结构详解](#13-项目结构详解)
  - [1.4 控制器 Controller](#14-控制器-controller)
  - [1.5 服务 Provider](#15-服务-provider)
  - [1.6 模块 Module](#16-模块-module)
  - [1.7 DTO 与验证](#17-dto-与验证)
  - [1.8 中间件 Middleware](#18-中间件-middleware)
  - [1.9 异常过滤器 Exception Filter](#19-异常过滤器-exception-filter)
  - [1.10 管道 Pipe](#110-管道-pipe)
- [二、🟡 中级进阶](#二-中级进阶)
  - [2.1 守卫 Guard](#21-守卫-guard)
  - [2.2 拦截器 Interceptor](#22-拦截器-interceptor)
  - [2.3 自定义装饰器](#23-自定义装饰器)
  - [2.4 TypeORM 集成](#24-typeorm-集成)
  - [2.5 Mongoose 集成](#25-mongoose-集成)
  - [2.6 配置管理](#26-配置管理)
  - [2.7 JWT 鉴权完整实现](#27-jwt-鉴权完整实现)
  - [2.8 文件上传](#28-文件上传)
  - [2.9 Swagger API 文档自动生成](#29-swagger-api-文档自动生成)
  - [2.10 定时任务](#210-定时任务nestjsschedule)
  - [2.11 事件与 EventEmitter](#211-事件与-eventemitter)
  - [2.12 与 Express/Koa 的关系](#212-与-expresskoa-的关系)
- [三、🔴 高级实战](#三-高级实战)
  - [3.1 自定义 Provider 与动态模块](#31-自定义-provider-与动态模块)
  - [3.2 微服务 Transport](#32-微服务-transport)
  - [3.3 面试高频题 10 条](#33-面试高频题-10-条)

---

# 一、🟢 初级入门

## 1.1 NestJS 是什么 & 与 Express/Koa 对比 <span class="lv lv-1">初级</span>

NestJS 是一个用于构建高效、可扩展的 Node.js 服务端框架，使用 TypeScript 编写，融合了 OOP、FP 和 FRP 的理念。它的设计灵感来自 Angular，底层默认使用 Express（也可切换 Koa）。

```
┌─────────────────────────────────────────────┐
│                  NestJS                      │
│  ┌─────────┐ ┌─────────┐ ┌──────────────┐  │
│  │Module   │ │Controller│ │Provider/Service│ │
│  │(模块化) │ │(路由处理) │ │(业务逻辑)     │  │
│  └────┬────┘ └────┬─────┘ └──────┬───────┘  │
│       │           │              │           │
│  ┌────▼───────────▼──────────────▼───────┐  │
│  │          依赖注入容器 (IoC)           │  │
│  └────────────────┬─────────────────────┘  │
│                   │                         │
│  ┌────────────────▼─────────────────────┐  │
│  │     HTTP 适配器 (Express / Koa)      │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Express / Koa / NestJS 对比

| 特性 | Express | Koa | NestJS |
|------|---------|-----|--------|
| 架构模式 | 自由组合（无约束） | 自由组合（无约束） | MVC + 模块化（强约束） |
| 装饰器 | 无 | 无 | 全面支持（@Get @Post 等） |
| 依赖注入 | 无内置 | 无内置 | 内置 IoC 容器 |
| 模块化 | 需手动组织 | 需手动组织 | @Module 原生支持 |
| TypeScript | 需手动配置 | 需手动配置 | 原生支持，开箱即用 |
| 测试 | 需自行搭建 | 需自行搭建 | @nestjs/testing 内置 |
| 中间件/管道/守卫 | 中间件 only | 中间件 only | 中间件 + 管道 + 守卫 + 拦截器 |
| 学习曲线 | 低 | 低 | 中 |
| 适用场景 | 小型/API | 小型/API | 中大型/企业级 |

> **一句话总结**：Express/Koa 给你自由，NestJS 给你规范。团队协作时，规范 > 自由。

---

## 1.2 CLI 创建项目 <span class="lv lv-1">初级</span>

```bash
# 全局安装 CLI
npm i -g @nestjs/cli

# 创建新项目
nest new my-project
# ? Which package manager would you like to use? npm

# 常用生成命令（简写 g = generate）
nest g module users          # 生成模块
nest g controller users      # 生成控制器（自动注册到所属模块）
nest g service users         # 生成服务
nest g resource posts        # 一键生成 CRUD 模块（含 dto / entity / controller / service / module）
```

### CLI 生成器速查

```
nest g <schematic> <name> [options]

schematic:  module / controller / service / provider / middleware / guard / interceptor / pipe / resolver
resource  → 一键生成完整 CRUD 模块（含 dto / entity / controller / service / module）

options:  --no-spec (不生成测试)  --flat (不创建子目录)  -d / --dry-run (只预览)
```

---

## 1.3 项目结构详解 <span class="lv lv-1">初级</span>

```
my-project/
├── src/
│   ├── app.module.ts          # 根模块，注册所有子模块
│   ├── app.controller.ts      # 根控制器（一般只做健康检查）
│   ├── app.service.ts         # 根服务
│   ├── main.ts                # 入口文件：创建 Nest 应用、挂载全局管道/过滤器
│   └── users/                 # 用户模块（按业务划分目录）
│       ├── users.module.ts    # 用户模块定义
│       ├── users.controller.ts# 用户路由
│       ├── users.service.ts   # 用户业务逻辑
│       └── dto/               # 数据传输对象
│           ├── create-user.dto.ts
│           └── update-user.dto.ts
├── test/                      # e2e 测试
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── nest-cli.json              # CLI 配置
├── tsconfig.json              # TypeScript 配置
├── tsconfig.build.json        # 构建 TS 配置
├── package.json
└── .env                       # 环境变量（需自行创建）
```

### 核心文件作用

| 文件 | 作用 |
|------|------|
| `main.ts` | 入口，调用 `NestFactory.create()` 启动 |
| `app.module.ts` | 根模块，所有子模块的"总装车间" |
| `*.module.ts` | 模块定义，声明 imports / providers / controllers / exports |
| `*.controller.ts` | 控制器，处理 HTTP 请求、路由分发 |
| `*.service.ts` | 服务，封装业务逻辑，通过 DI 注入到控制器 |
| `dto/*.dto.ts` | 数据传输对象，定义请求体结构 + 验证规则 |

---

## 1.4 控制器 Controller <span class="lv lv-1">初级</span>

控制器负责处理传入的 HTTP 请求并返回响应。

```
客户端请求
    │
    ▼
┌─────────────────────────────┐
│  @Controller('users')       │  ← 路由前缀 /users
│                             │
│  @Get()      → findAll()    │  ← GET    /users
│  @Get(':id') → findOne()    │  ← GET    /users/:id
│  @Post()     → create()     │  ← POST   /users
│  @Patch(':id')→ update()    │  ← PATCH  /users/:id
│  @Delete(':id')→ remove()   │  ← DELETE /users/:id
└─────────────────────────────┘
```

```typescript
// users.controller.ts
import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()                           // GET /users?role=admin
  findAll(@Query('role') role?: string) { return this.usersService.findAll(role); }

  @Get(':id')                      // GET /users/1
  findOne(@Param('id') id: string) { return this.usersService.findOne(+id); }

  @Post()                          // POST /users  Body: { name, email }
  create(@Body() dto: CreateUserDto) { return this.usersService.create(dto); }

  @Patch(':id')                    // PATCH /users/1
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) { return this.usersService.update(+id, dto); }

  @Delete(':id')                   // DELETE /users/1
  remove(@Param('id') id: string) { return this.usersService.remove(+id); }
}
```

### 请求装饰器速查

| 装饰器 | 来源 | 示例 |
|--------|------|------|
| `@Body()` | `req.body` | `@Body() createUserDto: CreateUserDto` |
| `@Param('id')` | `req.params.id` | `@Param('id') id: string` |
| `@Query('page')` | `req.query.page` | `@Query('page') page: number` |
| `@Headers('auth')` | `req.headers.auth` | `@Headers('auth') auth: string` |
| `@Ip()` | `req.ip` | `@Ip() ip: string` |
| `@Req() / @Res()` | 原生对象 | 尽量少用，违反 Nest 理念 |

---

## 1.5 服务 Provider <span class="lv lv-1">初级</span>

服务（Provider）是 NestJS 的核心概念 —— 把业务逻辑从控制器中抽离，通过依赖注入（DI）使用。

```
┌──────────────┐      注入       ┌──────────────┐
│  Controller  │ ──────────────→ │   Service    │
│  (路由调度)   │  constructor()  │  (业务逻辑)   │
└──────────────┘                  └──────────────┘
       │                                │
       │  请求进来                       │  处理数据
       ▼                                ▼
   返回响应                          操作数据库
```

### @Injectable 服务

```typescript
// users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: '张三', email: 'z@test.com' },
    { id: 2, name: '李四', email: 'l@test.com' },
  ];

  findAll(role?: string) {
    if (role) return this.users.filter(u => u.role === role);
    return this.users;
  }
  findOne(id: number) {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new NotFoundException(`用户 #${id} 不存在`);
    return user;
  }
  create(dto: CreateUserDto) {
    const user = { id: Date.now(), ...dto };
    this.users.push(user);
    return user;
  }
}
```

### 手动提供者

```typescript
{ provide: 'CONFIG', useValue: { db: 'mysql', port: 3306 } }       // 值提供者
{ provide: 'Logger', useExisting: AppLoggerService }                // 别名提供者
{ provide: 'DB', useFactory: (cfg: ConfigService) => createConn(cfg.get('DB_URL')), inject: [ConfigService] } // 工厂
// 注入：@Inject('CONFIG') private config: any
```

---

## 1.6 模块 Module <span class="lv lv-1">初级</span>

模块是组织应用结构的基本单元，每个应用至少有一个根模块。

```
┌─────────────────── AppModule (根模块) ──────────────────────┐
│                                                             │
│  imports: [ UsersModule, AuthModule, ConfigModule ]         │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  UsersModule     │  │  AuthModule      │                 │
│  │                  │  │                  │                 │
│  │  controllers:    │  │  controllers:    │                 │
│  │   UsersController│  │   AuthController │                 │
│  │                  │  │                  │                 │
│  │  providers:      │  │  providers:      │                 │
│  │   UsersService   │  │   AuthService    │                 │
│  │                  │  │   JwtStrategy    │                 │
│  │  exports:        │  │                  │                 │
│  │   UsersService ←────── AuthModule 可用  │                 │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

```typescript
// users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],  // 本模块的控制器
  providers:   [UsersService],      // 本模块的服务（默认仅在模块内可见）
  exports:     [UsersService],      // 导出后，其他模块 imports 本模块即可使用
})
export class UsersModule {}
```

### @Module 四个属性

| 属性 | 作用 | 说明 |
|------|------|------|
| `imports` | 导入其他模块 | 使用其他模块导出的 Provider |
| `controllers` | 注册控制器 | 本模块的路由处理 |
| `providers` | 注册提供者 | 本模块的服务/工厂 |
| `exports` | 导出提供者 | 让 imports 本模块的模块可以使用 |

> **关键原则**：Provider 默认是模块作用域的。想让其他模块使用，必须 `exports` 导出，并且对方要 `imports` 你的模块。

---

## 1.7 DTO 与验证 <span class="lv lv-1">初级</span>

DTO（Data Transfer Object）定义数据传输的形状和验证规则。

### 安装依赖

```bash
npm i class-validator class-transformer
```

### 定义 DTO

```typescript
// dto/create-user.dto.ts
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: '用户名至少 2 个字符' })
  name: string;

  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @IsOptional()
  @IsString()
  role?: string;
}
```

### 全局启用 ValidationPipe

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局注册验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // 自动剥离 DTO 中未定义的属性
      forbidNonWhitelisted: true, // 存在未定义属性时抛出错误
      transform: true,          // 自动将 payload 转为 DTO 类实例
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

### 验证流程

```
客户端请求 Body
    │
    ▼
┌──────────────────┐
│  ValidationPipe  │
│  (全局管道)       │
│                  │
│  1. class-transformer: plain → DTO 实例
│  2. class-validator:  逐字段验证
│     ├── 通过 → 放行，交给 Controller
│     └── 失败 → 抛出 400 BadRequestException
└──────────────────┘
```

---

## 1.8 中间件 Middleware <span class="lv lv-1">初级</span>

NestJS 中间件与 Express 中间件功能一致，但用类实现，支持 DI。

```typescript
// common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
  }
}
```

### 应用方式（在模块中通过 `configure` 注册）

```typescript
// app.module.ts
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

@Module({ imports: [UsersModule] })
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users')                            // 应用到 /users 路由
      // .forRoutes({ path: 'users', method: RequestMethod.GET }) // 仅 GET
      // .exclude('users')                           // 排除 /users
      ;
  }
}
```

### 函数式中间件与多中间件

```typescript
// 函数式（无 DI 需求时更简洁）
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`[${req.method}] ${req.url}`); next();
}
// 多中间件：consumer.apply(LoggerMiddleware, AuthMiddleware).forRoutes('*');
```

---

## 1.9 异常过滤器 Exception Filter <span class="lv lv-1">初级</span>

NestJS 内置异常层会自动处理错误。自定义异常过滤器可以统一响应格式。

### 内置异常

```typescript
throw new NotFoundException('用户不存在');    // 404
throw new BadRequestException('参数错误');    // 400
throw new UnauthorizedException('未登录');    // 401
throw new ForbiddenException('无权限');       // 403
throw new HttpException('自定义', 418);       // 自定义状态码
```

### 自定义异常过滤器

```typescript
// common/filters/http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      message: exception.getResponse(),
      path: ctx.getRequest().url,
    });
  }
}

// 注册：全局 app.useGlobalFilters() / 控制器 @UseFilters() / 方法级别
```

---

## 1.10 管道 Pipe <span class="lv lv-1">初级</span>

管道有两个用途：**转换**（transform）和**验证**（validation）。

```
请求参数 ──→ ┌──────────┐ ──→ Controller
             │   Pipe    │
             │ 转换/验证  │
             └──────────┘
                  │ 失败
                  ▼
           抛出 BadRequestException
```

### 内置管道

| 管道 | 作用 | 示例 |
|------|------|------|
| `ValidationPipe` | 验证 DTO | 全局注册 |
| `ParseIntPipe` | 字符串 → 数字 | `@Param('id', ParseIntPipe) id: number` |
| `ParseBoolPipe` | 字符串 → 布尔 | `@Query('active', ParseBoolPipe)` |
| `ParseUUIDPipe` | 验证 UUID 格式 | `@Param('id', ParseUUIDPipe)` |
| `DefaultValuePipe` | 设置默认值 | `@Query('page', new DefaultValuePipe(1))` |

```typescript
// 使用内置管道
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) { // id 保证是 number 类型
  return this.usersService.findOne(id);          // 无需手动 +id
}

// 自定义错误消息
@Get(':id')
findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {}
```

### 自定义管道

```typescript
// pipes/trim.pipe.ts
import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'object' && value !== null) {
      for (const key of Object.keys(value)) {
        if (typeof value[key] === 'string') value[key] = value[key].trim();
      }
    }
    return value;
  }
}
```

---

# 二、🟡 中级进阶

## 2.1 守卫 Guard <span class="lv lv-2">中级</span>

守卫根据条件决定请求是否可以到达路由处理器，常用于鉴权。

```
请求 ──→ 中间件 ──→ 守卫 ──→ 拦截器(前) ──→ 管道 ──→ Controller ──→ 拦截器(后) ──→ 响应
                       │
                  ┌────▼────┐
                  │ 条件判断  │
                  │ 满足 → 放行│
                  │ 不满足 → 403│
                  └─────────┘
```

### 角色鉴权守卫

```typescript
// decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

```typescript
// guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(), context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(role => user.role === role);
  }
}
```

### JwtAuthGuard

```typescript
// guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) throw new UnauthorizedException('缺少 Token');
    try {
      request.user = await this.jwtService.verifyAsync(token);
    } catch { throw new UnauthorizedException('Token 无效或已过期'); }
    return true;
  }
}
```

```typescript
// 使用
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Delete(':id')
remove(@Param('id') id: string) {}
```

---

## 2.2 拦截器 Interceptor <span class="lv lv-2">中级</span>

拦截器可以绑定在请求/响应前后执行逻辑，类似 Express 中间件但更强大（可访问执行上下文、可修改响应）。

```
请求 ──→ interceptor.before() ──→ handler() ──→ interceptor.after() ──→ 响应
                                         │
                                    ┌────▼────┐
                                    │ RxJS    │
                                    │ Observable│
                                    └─────────┘
```

### 日志拦截器

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url } = context.switchToHttp().getRequest();
    const now = Date.now();
    return next.handle().pipe(tap(() => this.logger.log(`${method} ${url} - ${Date.now() - now}ms`)));
  }
}
```

### 响应格式化拦截器

```typescript
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, { code: number; data: T; message: string }> {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map(data => ({ code: 200, data, message: 'success' })));
  }
}
```

### 超时拦截器

```typescript
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private ms: number = 5000) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.ms),
      catchError(err => throwError(() => err instanceof TimeoutError ? new RequestTimeoutException('请求超时') : err)),
    );
  }
}
```

---

## 2.3 自定义装饰器 <span class="lv lv-2">中级</span>

### 参数装饰器：@CurrentUser

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user; // 由 Guard 挂载
    return data ? user?.[data] : user;
  },
);
// @CurrentUser() user → 完整用户；@CurrentUser('email') email → 单个字段
```

### 方法装饰器：@Roles / @Public

```typescript
// @Roles：本质是 SetMetadata 语法糖（见 2.1 节）
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// @Public：标记公开接口，Guard 中判断 isPublic 则放行
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
// Guard 中：this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [handler, class]) → true 则放行
```

---

## 2.4 TypeORM 集成 <span class="lv lv-2">中级</span>

### 安装

```bash
npm i @nestjs/typeorm typeorm mysql2
```

### 配置

```typescript
// app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: +configService.get('DB_PORT', 3306),
        username: configService.get('DB_USER', 'root'),
        password: configService.get('DB_PASS', ''),
        database: configService.get('DB_NAME', 'test'),
        autoLoadEntities: true,  // 自动加载通过 forFeature 注册的实体
        synchronize: process.env.NODE_ENV !== 'production', // 仅开发环境自动同步
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
})
export class AppModule {}
```

### 实体定义

```typescript
// entities/user.entity.ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 50 }) name: string;
  @Column({ unique: true }) email: string;
  @Column({ select: false }) password: string;    // 查询时默认不返回
  @Column({ default: 'user' }) role: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
  @OneToMany(() => Post, post => post.author) posts: Post[];  // 一对多
}
```

### 关系映射

```
User ◆──一对一──◆ Profile   (@OneToOne + @JoinColumn)
  │
  ├──一对多──→ Post          (@OneToMany / @ManyToOne)
  │              │
  │              └──多对多──◆ Tag  (@ManyToMany + @JoinTable)
```

```typescript
// 一对一
@OneToOne(() => User) @JoinColumn() user: User;
// 一对多（多方持有外键）
@ManyToOne(() => User) author: User;
// 多对多（一方加 @JoinTable 即可）
@ManyToMany(() => Tag) @JoinTable() tags: Tag[];
```

### Repository 模式

```typescript
// users.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 注册实体，自动生成 Repository
  // ...
})
export class UsersModule {}
```

```typescript
// users.service.ts
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() { return this.repo.find({ relations: ['posts'] }); }
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }
  create(dto: CreateUserDto) { return this.repo.save(this.repo.create(dto)); }
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException();
    Object.assign(user, dto);
    return this.repo.save(user);
  }
  remove(id: number) { return this.repo.delete(id); }
}
```

### 迁移

```bash
# 生成迁移文件
npx typeorm migration:generate -d src/data-source.ts src/migrations/AddUserTable

# 执行迁移
npx typeorm migration:run -d src/data-source.ts

# 回滚
npx typeorm migration:revert -d src/data-source.ts
```

---

## 2.5 Mongoose 集成 <span class="lv lv-2">中级</span>

### 安装

```bash
npm i @nestjs/mongoose mongoose
```

### Schema 定义

```typescript
// schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

### 注册与 CRUD

```typescript
// users.module.ts
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
})
export class UsersModule {}
```

```typescript
// users.service.ts
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  findAll()  { return this.model.find().exec(); }
  findOne(id: string) { return this.model.findById(id).exec(); }
  create(dto: CreateUserDto) { return new this.model(dto).save(); }
  update(id: string, dto: UpdateUserDto) { return this.model.findByIdAndUpdate(id, dto, { new: true }).exec(); }
  remove(id: string) { return this.model.findByIdAndDelete(id).exec(); }
}
```

---

## 2.6 配置管理 <span class="lv lv-2">中级</span>

### 安装

```bash
npm i @nestjs/config
```

### 基本使用

```typescript
// app.module.ts
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,     // 全局可用，无需每个模块都 import
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // 多环境
    }),
  ],
})
export class AppModule {}
```

```typescript
// 在服务中使用
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getDbHost() {
    return this.configService.get<string>('DB_HOST');           // 读取 .env
  }

  getDbPort() {
    return this.configService.get<number>('DB_PORT', 3306);     // 带默认值
  }
}
```

### 多环境文件

```
.env                # 默认（公共配置）
.env.development    # 开发环境
.env.staging        # 预发布环境
.env.production     # 生产环境
.env.test           # 测试环境
```

### 命名空间配置（类型安全）

```typescript
// config/database.config.ts
import { registerAs } from '@nestjs/config';
export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
}));
// 使用：this.configService.get('database') 或 @Inject('database')
```

---

## 2.7 JWT 鉴权完整实现 <span class="lv lv-2">中级</span>

### 安装

```bash
npm i @nestjs/jwt @nestjs/passport passport passport-local passport-jwt
npm i -D @types/passport-local @types/passport-jwt
```

### 完整流程

```
┌──────────┐    POST /auth/register     ┌──────────┐
│  客户端   │ ────────────────────────→  │  Auth    │
│          │    POST /auth/login         │  Service │
│          │ ────────────────────────→   │          │
│          │    ← access_token + refresh │          │
│          │                             │          │
│          │    GET /users (Bearer token)│          │
│          │ ────────────────────────→   │  Guard   │
│          │    ← 用户数据               │  验证JWT  │
└──────────┘                             └──────────┘
```

### Auth 模块

```typescript
@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
```

### 注册 / 登录 / 刷新

```typescript
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    return this.usersService.create({ ...dto, password: hashed });
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('邮箱或密码错误');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync({ sub: user.id }, { expiresIn: '7d' }),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const { sub } = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.usersService.findOne(sub);
      if (!user) throw new UnauthorizedException();
      return { access_token: await this.jwtService.signAsync({ sub: user.id, email: user.email, role: user.role }) };
    } catch { throw new UnauthorizedException('Refresh Token 无效'); }
  }
}
```

```typescript
// auth/auth.controller.ts
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register') register(@Body() dto: RegisterDto) { return this.authService.register(dto); }
  @Post('login')    login(@Body() dto: LoginDto)       { return this.authService.login(dto); }
  @UseGuards(JwtAuthGuard) @Post('refresh') refresh(@Body('refresh_token') token: string) { return this.authService.refresh(token); }
}
```

---

## 2.8 文件上传 <span class="lv lv-2">中级</span>

### Multer 本地上传

```typescript
@Controller('files')
export class FilesController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { filename: file.filename, path: file.path, size: file.size };
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files', 10)) // 多文件，最多 10 个
  uploadFiles(@UploadedFile() files: Express.Multer.File[]) {
    return files.map(f => ({ filename: f.filename }));
  }
}
```

### OSS 直传（后端签名，前端上传）

```typescript
// files/files.service.ts
@Injectable()
export class FilesService {
  constructor(private configService: ConfigService) {}

  getOssSignature() {
    const accessId = this.configService.get('OSS_ACCESS_ID');
    const accessKey = this.configService.get('OSS_ACCESS_KEY');
    const bucket = this.configService.get('OSS_BUCKET');
    const region = this.configService.get('OSS_REGION');
    const expire = Math.floor(Date.now() / 1000) + 3600;
    const policy = Buffer.from(JSON.stringify({
      expiration: new Date(expire * 1000).toISOString(),
      conditions: [['content-length-range', 0, 10 * 1024 * 1024]],
    })).toString('base64');
    const signature = crypto.createHmac('sha1', accessKey).update(policy).digest('base64');
    return { url: `https://${bucket}.${region}.aliyuncs.com`, policy, signature, accessId, expire };
  }
}
```

---

## 2.9 Swagger API 文档自动生成 <span class="lv lv-2">中级</span>

### 安装

```bash
npm i @nestjs/swagger
```

### 配置

```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('V3TSNode API')
    .setDescription('NestJS 全栈项目 API 文档')
    .setVersion('1.0')
    .addBearerAuth() // JWT 鉴权
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // 访问 /api-docs

  await app.listen(3000);
}
bootstrap();
```

### 装饰器标注

```typescript
// dto — @ApiProperty / @ApiPropertyOptional
export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: '张三' }) name: string;
  @ApiProperty({ description: '邮箱', example: 'z@test.com' }) email: string;
  @ApiProperty({ description: '密码', minLength: 6 }) password: string;
  @ApiPropertyOptional({ description: '角色', default: 'user' }) role?: string;
}

// controller — @ApiTags / @ApiOperation / @ApiBearerAuth / @ApiResponse
@ApiTags('用户管理') @ApiBearerAuth()
@Controller('users')
export class UsersController {
  @ApiOperation({ summary: '获取用户列表' })
  @ApiResponse({ status: 200, type: [User] })
  @Get() findAll() {}

  @ApiOperation({ summary: '创建用户' })
  @Post() create(@Body() dto: CreateUserDto) {}
}
```

---

## 2.10 定时任务 @nestjs/schedule <span class="lv lv-2">中级</span>

### 安装

```bash
npm i @nestjs/schedule
```

### 使用

```typescript
// app.module.ts
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()], // 全局注册
})
export class AppModule {}
```

```typescript
@Injectable()
export class CleanupTask {
  private readonly logger = new Logger(CleanupTask.name);

  @Cron('0 2 * * *')                    // 每天凌晨 2 点
  handleDaily() { this.logger.log('执行每日清理'); }

  @Cron(CronExpression.EVERY_MINUTE)     // 预定义：每分钟
  handleEveryMinute() { this.logger.log('每分钟执行'); }

  @Interval(30000)                       // 间隔：每 30 秒
  handleInterval() { this.logger.log('每 30 秒执行'); }

  @Timeout(5000)                         // 启动后 5 秒执行一次
  handleTimeout() { this.logger.log('启动 5 秒后执行'); }
}
```

### Cron 表达式速查

```
┌────────── 秒 (0-59)
│ ┌──────── 分 (0-59)
│ │ ┌────── 时 (0-23)
│ │ │ ┌──── 日 (1-31)
│ │ │ │ ┌── 月 (1-12)
│ │ │ │ │ ┌ 星期 (0-7, 0和7都是周日)
│ │ │ │ │ │
* * * * * *

示例：
0 2 * * *        → 每天凌晨 2 点
*/5 * * * *      → 每 5 分钟
0 9 * * 1-5      → 工作日每天 9 点
0 0 1 * *        → 每月 1 号零点
```

---

## 2.11 事件与 EventEmitter <span class="lv lv-2">中级</span>

### 安装

```bash
npm i @nestjs/event-emitter
```

### 配置与使用

```typescript
// app.module.ts
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
})
export class AppModule {}
```

```typescript
// events/order.events.ts
export class OrderCreatedEvent {
  constructor(public readonly orderId: string, public readonly userId: number, public readonly amount: number) {}
}

// order/order.service.ts —— 发出事件
@Injectable()
export class OrderService {
  constructor(private eventEmitter: EventEmitter2) {}
  async createOrder(dto: CreateOrderDto) {
    const order = await this.saveOrder(dto);
    this.eventEmitter.emit('order.created', new OrderCreatedEvent(order.id, order.userId, order.amount));
    return order;
  }
}

// notification/notification.listener.ts —— 监听事件
@Injectable()
export class NotificationListener {
  @OnEvent('order.created')
  handleOrderCreated(event: OrderCreatedEvent) { /* 发邮件/推送 */ }

  @OnEvent('order.created', { async: true }) // 异步处理，不阻塞主流程
  handleOrderCreatedAsync(event: OrderCreatedEvent) { /* 更新统计 */ }
}
```

---

## 2.12 与 Express/Koa 的关系 <span class="lv lv-2">中级</span>

NestJS 底层默认使用 Express，也可以切换为 Koa（Fastify 适配器更常用）。

```
┌────────────────────────────────────┐
│           NestJS 应用层             │
│  Controller / Service / Guard ...  │
├────────────────────────────────────┤
│         NestJS 核心层              │
│  Module / DI / Pipe / Interceptor │
├────────────────────────────────────┤
│          适配器层 (Adapter)         │
│  ┌──────────┐  ┌──────────┐       │
│  │ Express  │  │  Fastify │       │
│  │ Adapter  │  │  Adapter │       │
│  └──────────┘  └──────────┘       │
├────────────────────────────────────┤
│         原生 HTTP 层               │
│    Express / Fastify / Koa         │
└────────────────────────────────────┘
```

### 切换到 Fastify

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(3000);
}
```

### 访问底层 Express 实例

```typescript
const app = await NestFactory.create(AppModule);
const expressApp = app.getHttpAdapter().getInstance(); // 获取 Express 实例
expressApp.use(require('cors')());                     // 可使用任何 Express 中间件
```

### Express 中间件兼容表

| Express 中间件 | NestJS 中使用方式 | 说明 |
|----------------|-------------------|------|
| `cors` | `app.enableCors()` 或 `app.use(cors())` | 内置支持 |
| `helmet` | `app.use(helmet())` | 安全头 |
| `rate-limit` | `app.use(rateLimit(...))` | 限流 |
| `morgan` | `app.use(morgan('dev'))` | 日志 |
| `compression` | `app.use(compression())` | gzip 压缩 |
| `serve-static` | `app.useStaticAssets(path)` | Nest 内置方法 |

> **总结**：NestJS 不是 Express 的替代品，而是 Express 的"架构增强层"。你仍然可以使用所有 Express 生态的中间件。

---

# 三、🔴 高级实战

## 3.1 自定义 Provider 与动态模块 <span class="lv lv-3">高级</span>

### 自定义 Provider 四种形式

```
┌────────────────────────────────────────────────┐
│              自定义 Provider                     │
├──────────────┬──────────────┬──────────────────┤
│  useValue    │  useClass    │  useFactory      │
│  常量/配置    │  动态切换实现  │  异步初始化       │
│              │              │  (依赖其他服务)    │
└──────────────┴──────────────┴──────────────────┘
```

```typescript
// useValue —— 提供常量
{ provide: 'API_PREFIX', useValue: '/api/v1' }

// useClass —— 根据环境切换实现
{ provide: LoggerService, useClass: process.env.NODE_ENV === 'production' ? FileLogger : ConsoleLogger }

// useFactory —— 异步工厂（最灵活）
{
  provide: 'DB_CONNECTION',
  useFactory: async (config: ConfigService) => {
    const conn = await createConnection(config.get('DB_URL'));
    return conn;
  },
  inject: [ConfigService],
}
```

### 动态模块

```typescript
// config/config.module.ts
import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class ConfigModule {
  static forRoot(options: { envFilePath?: string; isGlobal?: boolean }): DynamicModule {
    return {
      module: ConfigModule,
      global: options.isGlobal ?? true,
      providers: [{ provide: 'CONFIG_OPTIONS', useValue: options }, ConfigService],
      exports: [ConfigService],
    };
  }
  static forFeature(): DynamicModule {
    return { module: ConfigModule, providers: [ModuleConfigService], exports: [ModuleConfigService] };
  }
}
// 使用：imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })]
```

> **约定**：`forRoot` 用于全局/一次性配置，`forFeature` 用于模块级别注册。参考 `TypeOrmModule.forRoot()` / `TypeOrmModule.forFeature()`。

---

## 3.2 微服务 Transport <span class="lv lv-3">高级</span>

NestJS 支持多种消息传输层，同一套代码可以切换不同的 Transport。

```
┌────────────┐     Redis / RabbitMQ / TCP      ┌────────────┐
│  微服务 A   │ ◄──────────────────────────────► │  微服务 B   │
│  (Client)  │     @MessagePattern              │  (Server)  │
└────────────┘                                   └────────────┘
```

### TCP（默认）

```typescript
// main.ts —— 微服务模式
const app = await NestFactory.createMicroservice(AppModule, {
  transport: Transport.TCP,
  options: { host: '127.0.0.1', port: 3001 },
});
```

### Redis

```typescript
// 微服务端
const app = await NestFactory.createMicroservice(AppModule, {
  transport: Transport.REDIS,
  options: { host: 'localhost', port: 6379 },
});

// 混合模式：同时支持 HTTP + 微服务
const app = await NestFactory.create(AppModule);
app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: 'localhost', port: 6379 },
});
await app.startAllMicroservices();
```

### 消息处理

```typescript
// 服务端 —— 请求-响应模式
@MessagePattern({ cmd: 'get_user' })
getUser(id: number) { return this.usersService.findOne(id); }

// 服务端 —— 事件模式（不等待响应）
@EventPattern('user_created')
handleUserCreated(data: UserCreatedEvent) { /* 处理事件 */ }

// 客户端调用
@Injectable()
export class AppService {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}
  getUser(id: number) { return this.client.send({ cmd: 'get_user' }, id); }  // 请求-响应
  emitUser(data: any) { this.client.emit('user_created', data); }            // 事件
}
```

### Transport 对比

| Transport | 适用场景 | 特点 |
|-----------|---------|------|
| TCP | 内部服务通信 | 默认，零依赖 |
| Redis | 发布/订阅、事件驱动 | 需 Redis，轻量 |
| RabbitMQ | 复杂路由、可靠投递 | 需 RabbitMQ，功能丰富 |
| Kafka | 高吞吐、流处理 | 需 Kafka，大数据场景 |
| gRPC | 高性能、强类型 | 需 .proto 文件 |
| NATS | 轻量级、云原生 | 需 NATS，极低延迟 |

---

## 3.3 面试高频题 10 条 <span class="lv lv-3">高级</span>

**Q1: NestJS 的请求生命周期是什么？**

```
Incoming Request
  → Middleware（中间件）
  → Guard（守卫）
  → Interceptor [before]（拦截器前置）
  → Pipe（管道：转换/验证）
  → Route Handler（控制器方法）
  → Interceptor [after]（拦截器后置）
  → Exception Filter（异常过滤器，出错时）
  → Server Response
```

**Q2: 依赖注入（DI）在 NestJS 中如何工作？**

NestJS 内置 IoC 容器。通过 `@Injectable()` 标记服务，在 Module 的 `providers` 中注册，在 Controller 构造函数中声明依赖，容器自动实例化并注入。

**Q3: Middleware 和 Interceptor 的区别？**

| | Middleware | Interceptor |
|---|-----------|-------------|
| 执行时机 | 在守卫/管道之前 | 在守卫之后，管道前后 |
| 能否访问路由信息 | 不能（不知道最终处理函数） | 能（ExecutionContext） |
| 能否修改响应 | 不能（只能拦截请求） | 能（通过 RxJS map） |
| DI 支持 | 支持 | 支持 |

**Q4: Guard 和 Middleware 做鉴权该选哪个？**

选 Guard。Guard 能通过 `ExecutionContext` 访问路由元数据（如 `@Roles`），而 Middleware 不具备这一能力。

**Q5: Pipe 的 transform 和 validate 有什么区别？**

- transform：将输入数据转换为目标类型（如 `ParseIntPipe` 将字符串转数字）
- validate：校验输入数据是否合法（如 `ValidationPipe` 配合 class-validator）

两者都在路由处理前执行，失败都抛出 `BadRequestException`。

**Q6: 什么是动态模块？应用场景？**

动态模块允许在运行时根据配置生成模块定义（`DynamicModule`）。典型场景：`TypeOrmModule.forRoot(options)` 根据配置连接不同数据库、`ConfigModule.forRoot()` 加载不同环境文件。

**Q7: Provider 的作用域有哪些？**

| 作用域 | 说明 | 使用场景 |
|--------|------|---------|
| DEFAULT | 单例，全应用共享 | 大部分场景（默认） |
| REQUEST | 每个请求一个实例 | 请求级上下文（如 req 上的 user） |
| TRANSIENT | 每次注入一个新实例 | 无状态工具类 |

**Q8: NestJS 如何实现全局异常处理？**

1. 使用 `@Catch()` 装饰器创建异常过滤器
2. `app.useGlobalFilters()` 全局注册
3. 或在 Module 中通过 `APP_FILTER` token 注册（支持 DI）

**Q9: 如何在 NestJS 中使用 Express 中间件？**

两种方式：`app.use(middleware)` 直接挂载，或实现 `NestMiddleware` 接口并在 Module 的 `configure()` 中注册。前者简单直接，后者支持 DI 和路由匹配。

**Q10: NestJS 微服务和传统 HTTP 服务的区别？**

| | HTTP 服务 | 微服务 |
|---|----------|--------|
| 通信方式 | HTTP/REST | TCP/Redis/MQ 等 |
| 耦合度 | 通过 URL 耦合 | 通过消息模式解耦 |
| 传输效率 | 较低（HTTP 开销） | 较高（二进制协议） |
| 适用场景 | 对外 API | 内部服务间通信 |
| 创建方式 | `NestFactory.create()` | `NestFactory.createMicroservice()` |

---

> **最后**：从前端转全栈，NestJS 是最佳过渡方案 —— 你熟悉的 TypeScript、装饰器、模块化思维全部保留，只需补齐后端的 DI、ORM、鉴权等概念。先跑通 CRUD，再逐步加入守卫/拦截器/微服务，循序渐进。
