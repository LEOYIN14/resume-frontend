# 开发指南

## 项目启动

### 1. 安装依赖
```bash
# 安装根项目依赖
npm install

# 安装所有子项目依赖
npm run install:all
```

### 2. 环境配置
1. 复制 `backend/.env.example` 为 `backend/.env`
2. 配置 DeepSeek API Key
3. 根据需要调整其他配置

### 3. 启动开发服务器
```bash
# 同时启动前端和后端
npm run dev

# 或分别启动
npm run dev:frontend  # 前端 (端口 3000)
npm run dev:backend   # 后端 (端口 8000)
```

## 项目结构说明

### 前端 (frontend/)
- `src/components/` - 可复用组件
- `src/pages/` - 页面组件
- `src/store/` - Redux状态管理
- `src/types/` - TypeScript类型定义
- `src/hooks/` - 自定义React Hooks

### 后端 (backend/)
- `src/routes/` - API路由
- `src/database/` - 数据库配置和模型
- `src/middleware/` - 中间件
- `src/services/` - 业务逻辑服务

## 开发规范

### 代码风格
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件使用函数式组件和 Hooks
- 状态管理使用 Redux Toolkit

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关

## API 接口文档

### 项目管理
- GET `/api/projects` - 获取项目列表
- POST `/api/projects` - 创建项目
- GET `/api/projects/:id` - 获取项目详情
- PUT `/api/projects/:id` - 更新项目
- DELETE `/api/projects/:id` - 删除项目

### 简历管理
- GET `/api/resume/latest` - 获取最新简历
- POST `/api/resume` - 创建/更新简历
- GET `/api/resume/history` - 获取简历历史

### 技能管理
- GET `/api/skills` - 获取技能列表
- POST `/api/skills` - 添加技能
- GET `/api/skills/categories` - 获取技能分类

### AI功能
- POST `/api/ai/generate-resume` - AI生成简历
- POST `/api/ai/analyze-skills` - 技能分析
- GET `/api/ai/usage` - AI使用统计

## 数据库设计

### 主要表结构
- `projects` - 项目信息
- `skills` - 技能信息
- `resumes` - 简历信息
- `documents` - 文档信息
- `ai_usage` - AI使用记录

## 部署说明

### 生产环境构建
```bash
npm run build
```

### 启动生产服务器
```bash
npm start
```