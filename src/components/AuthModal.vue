<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
    <div class="w-full max-w-md bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
          <i data-lucide="zap" class="w-8 h-8 text-white"></i>
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">ClawSoul</h1>
        <p class="text-slate-400 text-sm">{{ isSignUp ? '创建新账户' : '登录到您的账户' }}</p>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
        {{ error }}
      </div>

      <!-- 邮箱表单 -->
      <form @submit.prevent="handleEmailAuth" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">邮箱</label>
          <div class="relative">
            <i data-lucide="mail" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"></i>
            <input
              v-model="email"
              type="email"
              required
              class="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">密码</label>
          <div class="relative">
            <i data-lucide="lock" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"></i>
            <input
              v-model="password"
              type="password"
              required
              minlength="6"
              class="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <!-- 确认密码（仅注册） -->
        <div v-if="isSignUp">
          <label class="block text-sm font-medium text-slate-300 mb-2">确认密码</label>
          <div class="relative">
            <i data-lucide="lock" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"></i>
            <input
              v-model="confirmPassword"
              type="password"
              required
              class="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <!-- 提交按钮 -->
        <button
          type="submit"
          :disabled="loading || (isSignUp && password !== confirmPassword)"
          class="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i>
            {{ isSignUp ? '注册中...' : '登录中...' }}
          </span>
          <span v-else>{{ isSignUp ? '注册' : '登录' }}</span>
        </button>
      </form>

      <!-- 分割线 -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-slate-700"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-slate-800/50 text-slate-500">或使用以下方式</span>
        </div>
      </div>

      <!-- OAuth 登录 -->
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="signInWithGoogle"
          :disabled="loading"
          class="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900/50 border border-slate-700 rounded-lg text-white hover:bg-slate-800 transition-all"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
        <button
          @click="signInWithGithub"
          :disabled="loading"
          class="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900/50 border border-slate-700 rounded-lg text-white hover:bg-slate-800 transition-all"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </button>
      </div>

      <!-- 切换登录/注册 -->
      <div class="mt-6 text-center text-sm text-slate-400">
        {{ isSignUp ? '已有账户？' : '还没有账户？' }}
        <button
          @click="toggleMode"
          class="ml-1 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          {{ isSignUp ? '立即登录' : '立即注册' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth.js'

const emit = defineEmits(['auth-success'])

const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGithub, loading, error } = useAuth()

const isSignUp = ref(false)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

onMounted(() => {
  // 初始化 Lucide icons
  if (window.lucide) {
    window.lucide.createIcons()
  }
})

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
}

const handleEmailAuth = async () => {
  if (isSignUp.value && password.value !== confirmPassword.value) {
    return
  }

  let result
  if (isSignUp.value) {
    result = await signUpWithEmail(email.value, password.value, {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    })
  } else {
    result = await signInWithEmail(email.value, password.value)
  }

  if (result.success) {
    emit('auth-success')
  }
}
</script>
