<template>
  <div class="flex items-center gap-3">
    <!-- 未登录状态 -->
    <button
      v-if="!isAuthenticated"
      @click="showAuth = true"
      class="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-all"
    >
      <i data-lucide="log-in" class="w-4 h-4"></i>
      登录
    </button>

    <!-- 已登录状态 -->
    <div v-else class="flex items-center gap-3">
      <!-- 用户头像 -->
      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-medium">
        {{ userInitial }}
      </div>
      
      <!-- 用户信息 -->
      <div class="hidden sm:block">
        <p class="text-sm text-white font-medium">{{ userName }}</p>
        <p class="text-xs text-slate-400">{{ userEmail }}</p>
      </div>
      
      <!-- 登出按钮 -->
      <button
        @click="handleSignOut"
        :disabled="loading"
        class="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
        title="退出登录"
      >
        <i data-lucide="log-out" class="w-4 h-4"></i>
      </button>
    </div>

    <!-- 登录弹窗 -->
    <Teleport to="body">
      <div
        v-if="showAuth"
        class="fixed inset-0 z-50"
        @click.self="showAuth = false"
      >
        <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
        <div class="relative h-full overflow-auto">
          <AuthModal @auth-success="handleAuthSuccess" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth.js'
import AuthModal from './AuthModal.vue'

const { user, isAuthenticated, loading, signOut, initAuth } = useAuth()
const showAuth = ref(false)

onMounted(() => {
  initAuth()
})

const userName = computed(() => {
  return user.value?.user_metadata?.name || user.value?.email?.split('@')[0] || '用户'
})

const userEmail = computed(() => {
  return user.value?.email || ''
})

const userInitial = computed(() => {
  return userName.value.charAt(0).toUpperCase()
})

const handleAuthSuccess = () => {
  showAuth.value = false
}

const handleSignOut = async () => {
  await signOut()
}
</script>
