<!-- Header.vue -->
<template>
  <header class="border-b border-cyber-600/30 glass sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img src="/logo.png" alt="logo" class="w-10 h-10 rounded-lg object-cover ghost-float" />
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

<style scoped>
/* 幽灵飘浮动画 */
@keyframes ghostFloat {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  15% {
    transform: translate(3px, -4px) rotate(1deg);
  }
  30% {
    transform: translate(-2px, -6px) rotate(-1deg);
  }
  45% {
    transform: translate(-4px, -2px) rotate(0.5deg);
  }
  60% {
    transform: translate(-1px, 3px) rotate(-0.5deg);
  }
  75% {
    transform: translate(3px, 2px) rotate(1deg);
  }
  90% {
    transform: translate(2px, -1px) rotate(-0.5deg);
  }
}

.ghost-float {
  animation: ghostFloat 6s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.3));
}

.ghost-float:hover {
  animation-duration: 3s;
  filter: drop-shadow(0 0 15px rgba(0, 212, 255, 0.6));
}
</style>