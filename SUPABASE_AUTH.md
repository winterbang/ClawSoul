# ClawSoul - Supabase 认证集成指南

## 🚀 快速开始

### 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com) 并注册/登录
2. 点击 "New Project" 创建新项目
3. 记录项目 URL 和 Anon Key

### 2. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. 配置 OAuth 提供商

在 Supabase Dashboard → Authentication → Providers 中启用：

#### Google 登录
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建 OAuth 2.0 客户端 ID
3. 添加授权回调 URL: `https://your-project-id.supabase.co/auth/v1/callback`
4. 将 Client ID 和 Secret 填入 Supabase

#### GitHub 登录
1. 访问 GitHub → Settings → Developer settings → OAuth Apps
2. 创建新 OAuth App
3. Authorization callback URL: `https://your-project-id.supabase.co/auth/v1/callback`
4. 将 Client ID 和 Secret 填入 Supabase

### 4. 配置邮箱验证（可选）

在 Supabase Dashboard → Authentication → Email 中：
- 开启 "Confirm email" 如需要邮箱验证
- 配置 SMTP 用于发送验证邮件

### 5. 运行项目

```bash
npm install
npm run dev
```

## 📁 文件结构

```
src/
├── components/
│   ├── AuthModal.vue         # 登录/注册弹窗
│   ├── AuthCallback.vue      # OAuth 回调处理
│   ├── ResetPassword.vue     # 重置密码页面
│   └── UserProfile.vue       # 用户头像组件
├── composables/
│   └── useAuth.js            # 认证逻辑 Hook
├── utils/
│   └── supabase.js           # Supabase 客户端
└── main.js                   # 应用入口
```

## 🔧 使用方法

### 在组件中使用

```vue
<template>
  <UserProfile />
</template>

<script setup>
import UserProfile from '@/components/UserProfile.vue'
</script>
```

### 使用 Auth Hook

```vue
<script setup>
import { useAuth } from '@/composables/useAuth.js'

const { user, isAuthenticated, signInWithEmail, signOut } = useAuth()
</script>
```

## 🛡️ 安全注意事项

1. **不要提交 `.env` 文件到 Git**
   ```bash
   # 确保 .env 在 .gitignore 中
   echo ".env" >> .gitignore
   ```

2. **使用 RLS (Row Level Security)**
   - 在 Supabase 数据库中启用 RLS
   - 为用户数据创建访问策略

3. **HTTPS 生产环境**
   - OAuth 回调需要 HTTPS
   - 本地开发使用 `localhost` 即可

## 📚 更多文档

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
