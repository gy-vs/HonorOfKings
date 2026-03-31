# 王者荣耀 Vue App

本项目是一个王者荣耀主题的 Vue 3 前端应用，包含六个互通的网页，采用统一的金色/深蓝色王者荣耀风格主题，支持 Docker 容器化部署。

### 功能页面

| 页面 | 路由 | 描述 |
|------|------|------|
| 🏠 首页 | `/` | 英雄轮播图、热门英雄、最新资讯 |
| ⚔️ 英雄列表 | `/heroes` | 英雄分类筛选、搜索功能 |
| 📖 英雄详情 | `/heroes/:id` | 英雄技能、皮肤、收藏功能 |
| 🛡️ 装备列表 | `/equipment` | 装备分类浏览、详情弹窗 |
| 🏆 赛事资讯 | `/events` | 赛事状态筛选、赛事详情 |
| 👤 版本中心 | `/version-hub` | 查看版本，查看历史版本 |

---

## 🚀 快速开始

### 方式一：Docker 部署（推荐）

1. 确保已安装 Docker 和 Docker Compose

2. 在项目根目录运行：
   ```bash
   docker-compose up --build -d
   ```

3. 访问应用：http://localhost:8081

4. 停止服务：
   ```bash
   docker-compose down
   ```

5. 查看日志：
   ```bash
   docker-compose logs -f frontend-user
   ```

### 方式二：本地开发

1. 进入前端目录：
   ```bash
   cd frontend-user
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

4. 访问应用：http://localhost:3000

---

## 🐳 服务信息

| 服务名称 | 端口 | 访问地址 | 描述 |
|----------|------|----------|------|
| frontend-user | 8081 (Docker) | http://localhost:8081 | 生产环境，通过 Nginx 提供服务 |
| frontend-user | 3000 (本地) | http://localhost:3000 | 开发环境，Vite 开发服务器 |

### 容器详情

- **容器名称**: `honor-of-kings-frontend`
- **基础镜像**: Node.js 20 (构建) + Nginx Alpine (运行)
- **健康检查**: 每 30 秒检查一次服务状态
- **重启策略**: `unless-stopped`

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API) |
| 构建工具 | Vite |
| 语言 | TypeScript |
| UI 组件库 | Element Plus |
| 状态管理 | Pinia |
| 路由 | Vue Router |
| 样式 | SCSS |
| 容器化 | Docker + Nginx |

---

## 📝 Vue 技术点

本项目涵盖以下 Vue 3 核心技术：

- **Composition API**: setup, ref, reactive, computed, watch
- **Vue Router**: 路由导航、路由守卫、动态路由
- **Pinia**: 状态管理、持久化
- **组件通信**: props, emit, provide/inject
- **生命周期**: onMounted, onUnmounted
- **自定义指令**: v-loading, v-lazy
- **插槽**: 默认插槽、具名插槽
- **过渡动画**: Transition, TransitionGroup

---

## 📁 项目结构

```
├── frontend-user/          # Vue 3 前端应用
│   ├── src/
│   │   ├── components/     # 通用组件
│   │   ├── views/          # 页面组件
│   │   ├── router/         # 路由配置
│   │   ├── stores/         # Pinia 状态管理
│   │   ├── directives/     # 自定义指令
│   │   ├── data/           # 模拟数据
│   │   ├── types/          # TypeScript 类型
│   │   └── assets/         # 静态资源和样式
│   ├── Dockerfile          # Docker 构建配置
│   └── nginx.conf          # Nginx 配置
├── docker-compose.yml      # Docker Compose 配置
└── README.md               # 项目说明文档
```

---

## 🎨 主题配色

| 颜色 | 色值 | 用途 |
|------|------|------|
| 王者金色 | `#C8AA6E` | 主色调、按钮、高亮 |
| 深蓝背景 | `#0A1428` | 页面背景 |
| 卡片背景 | `#1A2744` | 卡片、弹窗背景 |
| 主文字色 | `#F0E6D2` | 标题、主要文字 |
| 边框色 | `#785A28` | 边框、分割线 |

---

## 📄 License

MIT License
