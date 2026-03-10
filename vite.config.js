import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: '/ClawSoul/',
  server: {
    port: 3000,
    host: true,
    allowedHosts: true
  },
  build: {
    sourcemap: true
  }
})