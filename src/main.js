import { createApp } from 'vue'
import App from './App.vue'
import { useAuth } from './composables/useAuth.js'

const app = createApp(App)

// 初始化认证状态
const { initAuth } = useAuth()
initAuth()

app.mount('#app')
