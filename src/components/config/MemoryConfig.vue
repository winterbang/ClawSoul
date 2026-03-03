<!-- MemoryConfig.vue -->
<template>
  <div class="glass rounded-xl p-6 space-y-6">
    <div class="flex items-center gap-2">
      <h2 class="text-xl font-semibold flex items-center gap-2 text-[var(--text-primary)]">
        <Brain class="w-5 h-5 text-yellow-600" />
        {{ $t('memory.title') }}
      </h2>
      <TooltipIcon position="right">
        {{ $t('memory.tooltip') }}
      </TooltipIcon>
    </div>

    <div class="space-y-6">
      <!-- 重要记忆 -->
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <Star class="w-4 h-4 text-yellow-500" />
            {{ $t('memory.memories') }}
          </h3>
          <TooltipIcon>{{ $t('memory.memoriesTooltip') }}</TooltipIcon>
        </div>
        <div class="space-y-2">
          <div v-for="(memory, index) in config.memories" :key="index"
            class="flex items-start gap-2"
          >
            <span class="text-xs text-[var(--text-muted)] mt-2">{{ index + 1 }}.</span>
            <textarea 
              :value="memory"
              @input="updateMemory(index, $event.target.value)"
              rows="2"
              :placeholder="$t('memory.memoryPlaceholder')"
              class="cyber-input flex-1 text-xs resize-none"
            />
            <button 
              @click="removeMemory(index)"
              class="text-red-500 hover:text-red-600 mt-2"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
          <button 
            @click="addMemory"
            class="text-xs text-yellow-600 hover:text-yellow-700 dark:text-yellow-500 dark:hover:text-yellow-400 flex items-center gap-1"
          >
            <Plus class="w-4 h-4" /> {{ $t('memory.addMemory') }}
          </button>
        </div>
      </div>

      <!-- 决策记录 -->
      <div class="space-y-3 pt-4 border-t border-[var(--border-color)]">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <GitCommit class="w-4 h-4 text-cyan-500" />
            {{ $t('memory.decisions') }}
          </h3>
          <TooltipIcon>{{ $t('memory.decisionsTooltip') }}</TooltipIcon>
        </div>
        <div class="space-y-2">
          <div v-for="(decision, index) in config.decisions" :key="index"
            class="space-y-2 p-3 memory-card rounded-lg"
          >
            <input 
              :value="decision.title"
              @input="updateDecision(index, 'title', $event.target.value)"
              type="text"
              :placeholder="$t('memory.title')"
              class="cyber-input w-full text-xs py-2"
            />
            <textarea 
              :value="decision.reason"
              @input="updateDecision(index, 'reason', $event.target.value)"
              rows="2"
              :placeholder="$t('memory.reason')"
              class="cyber-input w-full text-xs resize-none"
            />
            <div class="flex justify-end">
              <button 
                @click="removeDecision(index)"
                class="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <X class="w-3 h-3" /> {{ $t('memory.remove') || '删除' }}
              </button>
            </div>
          </div>
          <button 
            @click="addDecision"
            class="text-xs text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center gap-1"
          >
            <Plus class="w-4 h-4" /> {{ $t('memory.addDecision') }}
          </button>
        </div>
      </div>

      <!-- 经验教训 -->
      <div class="space-y-3 pt-4 border-t border-[var(--border-color)]">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <Lightbulb class="w-4 h-4 text-yellow-500" />
            {{ $t('memory.lessons') }}
          </h3>
          <TooltipIcon>{{ $t('memory.lessonsTooltip') }}</TooltipIcon>
        </div>
        <div class="space-y-2">
          <div v-for="(lesson, index) in config.lessons" :key="index"
            class="flex items-start gap-2"
          >
            <span class="text-xs text-yellow-600 mt-2">💡</span>
            <textarea 
              :value="lesson"
              @input="updateLesson(index, $event.target.value)"
              rows="2"
              :placeholder="$t('memory.lessonPlaceholder')"
              class="cyber-input flex-1 text-xs resize-none"
            />
            <button 
              @click="removeLesson(index)"
              class="text-red-500 hover:text-red-600 mt-2"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
          <button 
            @click="addLesson"
            class="text-xs text-yellow-600 hover:text-yellow-700 dark:text-yellow-500 dark:hover:text-yellow-400 flex items-center gap-1"
          >
            <Plus class="w-4 h-4" /> {{ $t('memory.addLesson') }}
          </button>
        </div>
      </div>

      <!-- 项目上下文 -->
      <div class="space-y-3 pt-4 border-t border-[var(--border-color)]">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <FolderOpen class="w-4 h-4 text-green-500" />
            {{ $t('memory.project') }}
          </h3>
          <TooltipIcon>{{ $t('memory.projectTooltip') }}</TooltipIcon>
        </div>
        <textarea 
          :value="config.projectContext"
          @input="updateConfig('projectContext', $event.target.value)"
          rows="4"
          :placeholder="$t('memory.projectPlaceholder')"
          class="cyber-input w-full text-sm resize-none"
        />
      </div>

      <!-- 个人偏好 -->
      <div class="space-y-3 pt-4 border-t border-[var(--border-color)]">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <Heart class="w-4 h-4 text-red-500" />
            {{ $t('memory.preferences') }}
          </h3>
          <TooltipIcon>{{ $t('memory.preferencesTooltip') }}</TooltipIcon>
        </div>
        <div class="space-y-2">
          <div v-for="(pref, index) in config.preferences" :key="index"
            class="flex items-center gap-2"
          >
            <input 
              :value="pref.key"
              @input="updatePreference(index, 'key', $event.target.value)"
              type="text"
              :placeholder="$t('memory.key')"
              class="cyber-input w-1/3 text-xs py-2"
            />
            <input 
              :value="pref.value"
              @input="updatePreference(index, 'value', $event.target.value)"
              type="text"
              :placeholder="$t('memory.value')"
              class="cyber-input flex-1 text-xs py-2"
            />
            <button 
              @click="removePreference(index)"
              class="text-red-500 hover:text-red-600"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
          <button 
            @click="addPreference"
            class="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
          >
            <Plus class="w-4 h-4" /> {{ $t('memory.addPreference') }}
          </button>
        </div>
      </div>

      <!-- 安全提醒 -->
      <div class="space-y-3 pt-4 border-t border-[var(--border-color)]">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <Shield class="w-4 h-4 text-red-500" />
            {{ $t('memory.security') }}
          </h3>
          <TooltipIcon>{{ $t('memory.securityTooltip') }}</TooltipIcon>
        </div>
        <div class="space-y-2">
          <div v-for="(reminder, index) in config.security" :key="index"
            class="flex items-start gap-2"
          >
            <span class="text-xs text-red-500 mt-2">🔒</span>
            <textarea 
              :value="reminder"
              @input="updateSecurity(index, $event.target.value)"
              rows="2"
              :placeholder="$t('memory.securityPlaceholder')"
              class="cyber-input flex-1 text-xs resize-none"
            />
            <button 
              @click="removeSecurity(index)"
              class="text-red-500 hover:text-red-600 mt-2"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
          <button 
            @click="addSecurity"
            class="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
          >
            <Plus class="w-4 h-4" /> {{ $t('memory.addSecurity') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  Brain, Star, GitCommit, Lightbulb, FolderOpen, Heart, Shield,
  Plus, X 
} from 'lucide-vue-next'
import TooltipIcon from '../ui/TooltipIcon.vue'

const props = defineProps({
  config: Object
})

const emit = defineEmits(['update:config'])

// 通用更新方法
const updateConfig = (path, value) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  const keys = path.split('.')
  let target = newConfig
  for (let i = 0; i < keys.length - 1; i++) {
    target = target[keys[i]]
  }
  target[keys[keys.length - 1]] = value
  emit('update:config', newConfig)
}

// 重要记忆
const addMemory = () => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.memories.push('')
  emit('update:config', newConfig)
}

const updateMemory = (index, value) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.memories[index] = value
  emit('update:config', newConfig)
}

const removeMemory = (index) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.memories.splice(index, 1)
  emit('update:config', newConfig)
}

// 决策记录
const addDecision = () => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.decisions.push({ title: '', reason: '' })
  emit('update:config', newConfig)
}

const updateDecision = (index, field, value) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.decisions[index][field] = value
  emit('update:config', newConfig)
}

const removeDecision = (index) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.decisions.splice(index, 1)
  emit('update:config', newConfig)
}

// 经验教训
const addLesson = () => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.lessons.push('')
  emit('update:config', newConfig)
}

const updateLesson = (index, value) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.lessons[index] = value
  emit('update:config', newConfig)
}

const removeLesson = (index) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.lessons.splice(index, 1)
  emit('update:config', newConfig)
}

// 个人偏好
const addPreference = () => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.preferences.push({ key: '', value: '' })
  emit('update:config', newConfig)
}

const updatePreference = (index, field, value) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.preferences[index][field] = value
  emit('update:config', newConfig)
}

const removePreference = (index) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.preferences.splice(index, 1)
  emit('update:config', newConfig)
}

// 安全提醒
const addSecurity = () => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.security.push('')
  emit('update:config', newConfig)
}

const updateSecurity = (index, value) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.security[index] = value
  emit('update:config', newConfig)
}

const removeSecurity = (index) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.security.splice(index, 1)
  emit('update:config', newConfig)
}
</script>

<style scoped>
.memory-card {
  background-color: rgba(99, 102, 241, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.1);
}

[data-theme="light"] .memory-card {
  background-color: rgba(99, 102, 241, 0.03);
  border: 1px solid rgba(99, 102, 241, 0.08);
}
</style>