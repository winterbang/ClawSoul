<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div class="text-center">
      <div class="w-16 h-16 mx-auto mb-4">
        <div class="w-full h-full border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p class="text-slate-400">处理中...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'

const router = useRouter()
const { initAuth } = useAuth()

onMounted(async () => {
  // 处理 OAuth 回调
  await initAuth()
  
  // 获取 URL hash 中的 token
  const hash = window.location.hash
  if (hash) {
    // Supabase 会自动处理 hash 中的 token
    await initAuth()
  }
  
  // 重定向到首页
  router.push('/')
})
</script>
