<!-- PreviewPanel.vue -->
<template>
  <div class="glass rounded-xl p-6 h-fit lg:sticky lg:top-24">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <Eye class="w-5 h-5 text-cyber-accent" />
        实时预览
      </h2>
      <div class="flex gap-1">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="$emit('change-tab', tab.id)"
          class="px-2 py-1 text-xs rounded transition-all"
          :class="currentTab === tab.id ? 'bg-cyber-accent/20 text-cyber-accent' : 'text-gray-500 hover:text-gray-300'"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <div class="code-block text-xs leading-relaxed max-h-[600px] overflow-y-auto">
      <pre>{{ content }}</pre>
    </div>
  </div>
</template>

<script setup>
import { Eye } from 'lucide-vue-next'

defineProps({
  content: String,
  currentTab: String,
  tabs: Array
})

defineEmits(['change-tab'])
</script>