# Admin Scaffold (Java + Vue)

## 1. 项目结构

```text
.
├── backend
│   ├── pom.xml (parent)
│   ├── admin-api
│   │   └── src/main/java/com/example
│   │       ├── api/v1
│   │       ├── common/result
│   │       ├── dto
│   │       └── vo
│   ├── admin-dao
│   │   └── src/main/java/com/example
│   │       ├── dao
│   │       ├── entity
│   │       └── mapper
│   └── admin-app
│       └── src/main
│           ├── java/com/example
│           │   ├── AdminBackendApplication.java
│           │   ├── aop
│           │   ├── common/{exception,utils}
│           │   ├── config
│           │   ├── controller
│           │   ├── interceptor
│           │   ├── security
│           │   └── service
│           └── resources
│               ├── application.yml
│               ├── init.sql
│               └── schema.sql
└── frontend
    ├── package.json
    ├── vite.config.ts
    └── src
        ├── api
        ├── layout
        ├── modules/system
        │   ├── user
        │   ├── role
        │   ├── menu
        │   └── shared
        ├── router
        ├── store
        ├── utils
        └── views
```

## 2. 关键设计思路

- 后端升级为 Maven 多模块：`admin-api`、`admin-dao`、`admin-app`。
- 分层链路：`api 接口契约 -> controller 实现 -> service 编排 -> dao 数据门面 -> mapper`。
- Controller 通过实现 `api/v1` 接口固化 HTTP 契约，便于后续开放 Feign/SDK。
- 统一返回 `Result<T>`，统一异常由 `GlobalExceptionHandler` 接管。
- JWT + `HandlerInterceptor` 做登录鉴权，`ThreadLocal` 存储当前用户 ID。
- RBAC 五表：用户、角色、菜单、用户角色、角色菜单；菜单接口返回树用于前端动态路由。
- MyBatis-Plus 提供 CRUD、分页 `Page`、逻辑删除、自动填充时间字段。
- 前端使用 Vue3 + TS + Pinia + Router，`Axios` 拦截器统一处理 Token 与过期跳转。
- 前端采用业务模块化：`modules/system/{user,role,menu}` 承载类型、API、页面逻辑，`views/system/*` 仅做路由兼容包装。

## 3. 示例 API

- 登录：`POST /api/auth/login`
- 当前用户菜单：`GET /api/menus/current`
- 用户分页：`GET /api/users?current=1&size=10&keyword=adm`
- 新增/编辑用户：`POST /api/users`
- 删除用户：`DELETE /api/users/{id}`
- 角色分页：`GET /api/roles`
- 菜单列表：`GET /api/menus`

## 4. 启动步骤

### 后端

1. 修改 `backend/admin-app/src/main/resources/application.yml` 数据库账号密码
2. 脚本位于 `backend/admin-app/src/main/resources/schema.sql`（当前默认 `init.sql` 在启动时自动初始化）
3. 启动：

```bash
cd backend
mvn -pl admin-app -am spring-boot:run
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

默认访问：`http://localhost:5173`

默认账号：`admin / 123456`
