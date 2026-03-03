<!-- PreviewPanel.vue -->
<template>
  <div class="glass rounded-xl p-6 h-fit">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold flex items-center gap-2 text-[var(--text-primary)]">
        <Eye class="w-5 h-5 text-[var(--accent-primary)]" />
        实时预览
      </h2>
      <div class="flex gap-1">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="$emit('change-tab', tab.id)"
          class="px-2 py-1 text-xs rounded transition-all"
          :class="currentTab === tab.id ? 'preview-tab-active' : 'preview-tab-inactive'"
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
        class="copy-btn absolute top-2 right-2 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
        title="复制当前配置"
      >
        <Copy class="w-4 h-4" />
      </button>
    </div>

    <!-- 下载区域 -->
    <div class="mt-4 pt-4 border-t border-[var(--border-color)]">
      <div class="flex items-center justify-between">
        <span class="text-xs text-[var(--text-muted)]">{{ currentTab === 'full' ? '完整配置' : getFileName() }}</span>
        <button 
          @click="downloadMarkdown"
          class="preview-download-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs"
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
.preview-tab-active {
  background-color: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
}

[data-theme="light"] .preview-tab-active {
  background-color: rgba(8, 145, 178, 0.15);
  color: #0891b2;
}

.preview-tab-inactive {
  color: var(--text-muted);
}

.preview-tab-inactive:hover {
  color: var(--text-primary);
}

.copy-btn {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
}

.copy-btn:hover {
  color: var(--accent-primary);
  border-color: var(--accent-primary);
}

.preview-download-btn {
  background-color: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #00d4ff;
}

.preview-download-btn:hover {
  background-color: rgba(0, 212, 255, 0.2);
}

[data-theme="light"] .preview-download-btn {
  background-color: rgba(8, 145, 178, 0.08);
  border: 1px solid rgba(8, 145, 178, 0.25);
  color: #0891b2;
}

[data-theme="light"] .preview-download-btn:hover {
  background-color: rgba(8, 145, 178, 0.15);
}

.code-block:hover + button,
.code-block:hover button,
button:hover {
  opacity: 1 !important;
}
</style>