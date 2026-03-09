import { ref, computed } from 'vue'
import { supabase } from '@/utils/supabase.js'

const user = ref(null)
const loading = ref(false)
const error = ref(null)

// 监听认证状态
supabase.auth.onAuthStateChange((event, session) => {
  user.value = session?.user ?? null
})

// 初始化时获取当前用户
const initAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  user.value = session?.user ?? null
}

// 邮箱注册
const signUpWithEmail = async (email, password, options = {}) => {
  loading.value = true
  error.value = null
  try {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options
    })
    if (signUpError) throw signUpError
    return { success: true, data }
  } catch (err) {
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    loading.value = false
  }
}

// 邮箱登录
const signInWithEmail = async (email, password) => {
  loading.value = true
  error.value = null
  try {
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (signInError) throw signInError
    user.value = data.user
    return { success: true, data }
  } catch (err) {
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    loading.value = false
  }
}

// Google 登录
const signInWithGoogle = async () => {
  loading.value = true
  error.value = null
  try {
    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (oauthError) throw oauthError
    return { success: true, data }
  } catch (err) {
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    loading.value = false
  }
}

// GitHub 登录
const signInWithGithub = async () => {
  loading.value = true
  error.value = null
  try {
    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (oauthError) throw oauthError
    return { success: true, data }
  } catch (err) {
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    loading.value = false
  }
}

// 登出
const signOut = async () => {
  loading.value = true
  try {
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) throw signOutError
    user.value = null
    return { success: true }
  } catch (err) {
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    loading.value = false
  }
}

// 重置密码
const resetPassword = async (email) => {
  loading.value = true
  error.value = null
  try {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    if (resetError) throw resetError
    return { success: true }
  } catch (err) {
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    loading.value = false
  }
}

export function useAuth() {
  return {
    user: computed(() => user.value),
    isAuthenticated: computed(() => !!user.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    initAuth,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    resetPassword
  }
}
