<!-- Navigation.vue -->
<template>
  <div class="glass rounded-xl p-2 mb-4 flex-shrink-0 overflow-x-auto"
       style="scrollbar-width: none; -ms-overflow-style: none;"
  >
    <style>
      div::-webkit-scrollbar {
        display: none;
      }
    </style>
    <div class="flex items-center gap-1 flex-nowrap min-w-max">
      <!-- 身份组 -->
      <div class="flex items-center gap-0.5 bg-cyber-700/30 rounded-lg p-0.5">
        <button 
          v-for="step in identitySteps" 
          :key="step.id"
          @click="$emit('change-view', step.id)"
          class="flex items-center gap-1 px-2 py-1.5 rounded-md transition-all duration-200 text-xs whitespace-nowrap"
          :class="currentView === step.id ? 'bg-cyber-accent/20 text-cyber-accent' : 'text-gray-400 hover:text-gray-200 hover:bg-cyber-600/30'"
        >
          <component :is="step.icon" class="w-3.5 h-3.5" />
          <span>{{ step.name }}</span>
        </button>
      </div>
      
      <!-- 分隔线 -->
      <div class="w-px h-4 bg-cyber-600/50 mx-0.5 flex-shrink-0"></div>
      
      <!-- 行为组 -->
      <div class="flex items-center gap-0.5 bg-cyber-700/30 rounded-lg p-0.5">
        <button 
          v-for="step in behaviorSteps" 
          :key="step.id"
          @click="$emit('change-view', step.id)"
          class="flex items-center gap-1 px-2 py-1.5 rounded-md transition-all duration-200 text-xs whitespace-nowrap"
          :class="currentView === step.id ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-gray-200 hover:bg-cyber-600/30'"
        >
          <component :is="step.icon" class="w-3.5 h-3.5" />
          <span>{{ step.name }}</span>
        </button>
      </div>
      
      <!-- 分隔线 -->
      <div class="w-px h-4 bg-cyber-600/50 mx-0.5 flex-shrink-0"></div>
      
      <!-- 操作组 -->
      <div class="flex items-center gap-0.5 bg-cyber-700/30 rounded-lg p-0.5">
        <button 
          @click="$emit('change-view', 'export')"
          class="flex items-center gap-1 px-2 py-1.5 rounded-md transition-all duration-200 text-xs whitespace-nowrap"
          :class="currentView === 'export' ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-gray-200 hover:bg-cyber-600/30'"
        >
          <Download class="w-3.5 h-3.5" />
          <span>导出</span>
        </button>
        <button 
          @click="$emit('reset')"
          class="flex items-center gap-1 px-2 py-1.5 rounded-md transition-all duration-200 text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 whitespace-nowrap"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>重置</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  Fingerprint, Sparkles, Bot, User, Brain, Wrench, 
  Download, RotateCcw 
} from 'lucide-vue-next'

defineProps({
  currentView: String
})

defineEmits(['change-view', 'reset'])

const identitySteps = [
  { id: 'identity', name: '身份', icon: Fingerprint },
  { id: 'soul', name: '人格', icon: Sparkles },
]

const behaviorSteps = [
  { id: 'agents', name: '行为', icon: Bot },
  { id: 'user', name: '用户', icon: User },
  { id: 'memory', name: '记忆', icon: Brain },
  { id: 'skills', name: '技能', icon: Wrench },
]
</script>