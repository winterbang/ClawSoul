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

    <div class="relative group">
      <div class="code-block text-xs leading-relaxed max-h-[600px] overflow-y-auto">
        <pre>{{ content }}</pre>
      </div>
      
      <!-- 复制按钮放在代码块内 -->
      <button 
        @click="copyCurrentTab"
        class="absolute top-2 right-2 p-1.5 rounded-lg bg-cyber-800/80 border border-cyber-600/50 text-gray-400 hover:text-cyber-accent hover:border-cyber-accent/50 transition-all opacity-0 group-hover:opacity-100"
        title="复制当前配置"
      >
        <Copy class="w-4 h-4" />
      </button>
    </div>

    <!-- 下载区域 -->
    <div class="mt-4 pt-4 border-t border-cyber-600/30">
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-500">{{ currentTab === 'full' ? '完整配置' : getFileName() }}</span>
        <button 
          @click="downloadMarkdown"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent hover:bg-cyber-accent/20 transition-all text-xs"
        >
          <Download class="w-3.5 h-3.5" />
          <span>下载 Markdown</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Eye, Copy, Download } from 'lucide-vue-next'

const props = defineProps({
  content: String,
  currentTab: String,
  tabs: Array
})

const emit = defineEmits(['change-tab', 'copy-current', 'download'])

const copyCurrentTab = () => {
  emit('copy-current')
}

const downloadMarkdown = () => {
  emit('download', props.currentTab)
}

const getFileName = () => {
  const names = {
    'identity': 'IDENTITY.md',
    'soul': 'SOUL.md',
    'agents': 'AGENTS.md',
    'user': 'USER.md',
    'memory': 'MEMORY.md',
    'full': 'clawsoul-config.md'
  }
  return names[props.currentTab] || 'config.md'
}
</script>

<style scoped>
.code-block:hover + button,
.code-block:hover button,
button:hover {
  opacity: 1 !important;
}
</style>