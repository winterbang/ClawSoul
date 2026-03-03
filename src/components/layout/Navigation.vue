<!-- Navigation.vue -->
<template>
  <div class="nav-container rounded-xl p-2 mb-4 flex-shrink-0 overflow-x-auto"
       style="scrollbar-width: none; -ms-overflow-style: none;"
  >
    <style>
      div::-webkit-scrollbar {
        display: none;
      }
    </style>
    <div class="flex items-center gap-1 flex-nowrap min-w-max">
      <!-- 身份组 -->
      <div class="flex items-center gap-0.5 nav-group-bg rounded-lg p-0.5">
        <button 
          v-for="step in identitySteps" 
          :key="step.id"
          @click="$emit('change-view', step.id)"
          class="flex items-center gap-1 px-2 py-1.5 rounded-md transition-all duration-200 text-xs whitespace-nowrap"
          :class="currentView === step.id ? 'nav-btn-active nav-btn-active-cyan' : 'nav-btn-inactive'"
        >
          <component :is="step.icon" class="w-3.5 h-3.5" />
          <span>{{ $t(`nav.${step.id}`) }}</span>
        </button>
      </div>
      
      <!-- 分隔线 -->
      <div class="w-px h-4 nav-divider mx-0.5 flex-shrink-0"></div>
      
      <!-- 行为组 -->
      <div class="flex items-center gap-0.5 nav-group-bg rounded-lg p-0.5">
        <button 
          v-for="step in behaviorSteps" 
          :key="step.id"
          @click="$emit('change-view', step.id)"
          class="flex items-center gap-1 px-2 py-1.5 rounded-md transition-all duration-200 text-xs whitespace-nowrap"
          :class="currentView === step.id ? 'nav-btn-active nav-btn-active-purple' : 'nav-btn-inactive'"
        >
          <component :is="step.icon" class="w-3.5 h-3.5" />
          <span>{{ $t(`nav.${step.id}`) }}</span>
        </button>
      </div>
      
      <!-- 分隔线 -->
      <div class="w-px h-4 nav-divider mx-0.5 flex-shrink-0"></div>
      
      <!-- 操作组 -->
      <div class="flex items-center gap-0.5 nav-group-bg rounded-lg p-0.5">
        <button 
          @click="$emit('change-view', 'export')"
          class="flex items-center gap-1 px-2 py-1.5 rounded-md transition-all duration-200 text-xs whitespace-nowrap"
          :class="currentView === 'export' ? 'nav-btn-active nav-btn-active-green' : 'nav-btn-inactive'"
        >
          <FileText class="w-3.5 h-3.5" />
          <span>{{ $t('nav.summary') }}</span>
        </button>
        <button 
          @click="$emit('reset')"
          class="nav-btn-reset flex items-center gap-1 px-2 py-1.5 rounded-md transition-all duration-200 text-xs whitespace-nowrap"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>{{ $t('nav.reset') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  Fingerprint, Sparkles, Bot, User, Brain, Wrench, 
  FileText, RotateCcw 
} from 'lucide-vue-next'

defineProps({
  currentView: String
})

defineEmits(['change-view', 'reset'])

const identitySteps = [
  { id: 'identity', icon: Fingerprint },
  { id: 'soul', icon: Sparkles },
]

const behaviorSteps = [
  { id: 'agents', icon: Bot },
  { id: 'user', icon: User },
  { id: 'memory', icon: Brain },
  { id: 'skills', icon: Wrench },
]
</script>

<style scoped>
.nav-container {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
}

.nav-group-bg {
  background-color: rgba(99, 102, 241, 0.1);
}

[data-theme="light"] .nav-group-bg {
  background-color: rgba(99, 102, 241, 0.08);
}

.nav-divider {
  background-color: var(--border-color);
}

.nav-btn-inactive {
  color: var(--text-secondary);
}

.nav-btn-inactive:hover {
  color: var(--text-primary);
  background-color: rgba(99, 102, 241, 0.15);
}

[data-theme="light"] .nav-btn-inactive:hover {
  background-color: rgba(99, 102, 241, 0.12);
}

.nav-btn-active {
  font-weight: 500;
}

.nav-btn-active-cyan {
  background-color: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
}

[data-theme="light"] .nav-btn-active-cyan {
  background-color: rgba(8, 145, 178, 0.15);
  color: #0891b2;
}

.nav-btn-active-purple {
  background-color: rgba(168, 85, 247, 0.2);
  color: #a855f7;
}

[data-theme="light"] .nav-btn-active-purple {
  background-color: rgba(124, 58, 237, 0.15);
  color: #7c3aed;
}

.nav-btn-active-green {
  background-color: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

[data-theme="light"] .nav-btn-active-green {
  background-color: rgba(22, 163, 74, 0.15);
  color: #16a34a;
}

.nav-btn-reset {
  color: var(--text-secondary);
}

.nav-btn-reset:hover {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}
</style>