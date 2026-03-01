<!-- Header.vue -->
<template>
  <header class="border-b border-cyber-600/30 glass sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img src="/logo.png" alt="logo" class="w-10 h-10 rounded-lg object-cover" />
        <div>
          <h1 class="text-xl font-bold neon-text">ClawSoul</h1>
          <p class="text-xs text-gray-400">打造你的数字助手</p>
        </div>
      </div>
      <a 
        href="https://github.com/winterbang/ClawSoul" 
        target="_blank"
        class="cyber-btn-secondary text-sm"
      >
        <Github class="w-4 h-4" />
        <span class="hidden sm:inline">GitHub</span>
      </a>
    </div>
  </header>
</template>

<script setup>
import { Github } from 'lucide-vue-next'
</script>