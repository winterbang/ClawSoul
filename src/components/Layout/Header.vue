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
/* 幽灵飘浮动画 - 带发光跟随 */
@keyframes ghostFloat {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    filter: drop-shadow(2px 2px 12px rgba(0, 212, 255, 0.4)) 
            drop-shadow(-1px -1px 8px rgba(168, 85, 247, 0.3));
  }
  15% {
    transform: translate(3px, -4px) rotate(1deg);
    filter: drop-shadow(5px 1px 14px rgba(0, 212, 255, 0.5)) 
            drop-shadow(-2px -5px 10px rgba(168, 85, 247, 0.4));
  }
  30% {
    transform: translate(-2px, -6px) rotate(-1deg);
    filter: drop-shadow(0px 4px 16px rgba(0, 212, 255, 0.6)) 
            drop-shadow(2px -6px 12px rgba(168, 85, 247, 0.5));
  }
  45% {
    transform: translate(-4px, -2px) rotate(0.5deg);
    filter: drop-shadow(-3px 2px 14px rgba(0, 212, 255, 0.5)) 
            drop-shadow(4px -3px 10px rgba(168, 85, 247, 0.4));
  }
  60% {
    transform: translate(-1px, 3px) rotate(-0.5deg);
    filter: drop-shadow(-2px 6px 12px rgba(0, 212, 255, 0.45)) 
            drop-shadow(1px 4px 8px rgba(168, 85, 247, 0.35));
  }
  75% {
    transform: translate(3px, 2px) rotate(1deg);
    filter: drop-shadow(5px 4px 14px rgba(0, 212, 255, 0.5)) 
            drop-shadow(-3px 2px 10px rgba(168, 85, 247, 0.4));
  }
  90% {
    transform: translate(2px, -1px) rotate(-0.5deg);
    filter: drop-shadow(4px 0px 12px rgba(0, 212, 255, 0.45)) 
            drop-shadow(-2px -2px 8px rgba(168, 85, 247, 0.35));
  }
}

.ghost-float {
  animation: ghostFloat 6s ease-in-out infinite;
}

.ghost-float:hover {
  animation-duration: 3s;
  filter: drop-shadow(0 0 20px rgba(0, 212, 255, 0.8)) 
          drop-shadow(0 0 30px rgba(168, 85, 247, 0.6)) !important;
}
</style>