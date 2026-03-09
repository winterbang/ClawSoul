<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
    <div class="w-full max-w-md bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl text-center">
      <div class="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
        <i data-lucide="check" class="w-8 h-8 text-green-400"></i>
      </div>
      <h1 class="text-2xl font-bold text-white mb-2">重置密码</h1>
      <p class="text-slate-400 mb-6">请输入您的新密码</p>

      <form @submit.prevent="handleReset" class="space-y-4">
        <div>
          <input
            v-model="newPassword"
            type="password"
            required
            minlength="6"
            class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            placeholder="新密码"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all"
        >
          {{ loading ? '更新中...' : '更新密码' }}
        </button>
      </form>

      <div v-if="message" :class="message.type === 'error' ? 'text-red-400' : 'text-green-400'" class="mt-4 text-sm">
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'

const newPassword = ref('')
const loading = ref(false)
const message = ref(null)

onMounted(() => {
  if (window.lucide) {
    window.lucide.createIcons()
  }
})

const handleReset = async () => {
  loading.value = true
  message.value = null
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword.value
  })
  
  if (error) {
    message.value = { type: 'error', text: error.message }
  } else {
    message.value = { type: 'success', text: '密码已更新，请使用新密码登录' }
    newPassword.value = ''
  }
  
  loading.value = false
}
</script>
