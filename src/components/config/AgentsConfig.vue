<!-- AgentsConfig.vue -->
<template>
  <div class="glass rounded-xl p-6 space-y-6">
    <div class="flex items-center gap-2">
      <h2 class="text-xl font-semibold flex items-center gap-2 text-[var(--text-primary)]">
        <Bot class="w-5 h-5 text-blue-400" />
        {{ $t('agents.title') }}
      </h2>
      <TooltipIcon position="right">
        {{ $t('agents.tooltip') }}
      </TooltipIcon>
    </div>

    <div class="space-y-6">
      <!-- 角色定位 -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <Target class="w-4 h-4" />
            {{ $t('agents.role.title') }}
          </h3>
          <TooltipIcon>{{ $t('agents.role.tooltip') }}</TooltipIcon>
        </div>
        
        <div>
          <label class="block text-sm mb-2 text-[var(--text-primary)]">{{ $t('agents.role.identity') }}</label>
          <input 
            :value="config.role.identity"
            @input="updateConfig('role.identity', $event.target.value)"
            type="text" 
            :placeholder="$t('agents.role.identityPlaceholder')"
            class="cyber-input w-full text-sm"
          />
        </div>

        <div>
          <label class="block text-sm mb-2 text-[var(--text-primary)]">{{ $t('agents.role.specialties') }}</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="spec in specialtyOptions" :key="spec"
              @click="toggleSpecialty(spec)"
              class="px-3 py-1.5 rounded-full text-xs border transition-all"
              :class="config.role.specialties.includes(spec) 
                ? 'border-blue-400 bg-blue-400/20 text-blue-400' 
                : 'border-[var(--border-color)] hover:border-blue-400/50 text-[var(--text-secondary)]'"
            >
              {{ spec }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm mb-2 text-[var(--text-primary)]">{{ $t('agents.role.language') }}</label>
          <select 
            :value="config.role.language" 
            @change="updateConfig('role.language', $event.target.value)"
            class="cyber-input w-full text-sm"
          >
            <option value="中文">{{ $t('agents.role.chinese') }}</option>
            <option value="英文">{{ $t('agents.role.english') }}</option>
            <option value="中英混合">{{ $t('agents.role.bilingual') }}</option>
          </select>
        </div>
      </div>

      <!-- 工作方式 -->
      <div class="space-y-4 pt-4 border-t border-[var(--border-color)]">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <Settings class="w-4 h-4" />
            {{ $t('agents.workflow.title') }}
          </h3>
          <TooltipIcon>{{ $t('agents.workflow.tooltip') }}</TooltipIcon>
        </div>

        <div v-for="(workflow, key) in workflows" :key="key" class="space-y-2">
          <label class="block text-sm font-medium text-[var(--text-primary)]">{{ workflow.name }}</label>
          <div class="space-y-2">
            <div v-for="(step, index) in config.workflows[key]" :key="index"
              class="flex items-center gap-2"
            >
              <span class="text-xs text-[var(--text-muted)] w-5">{{ index + 1 }}.</span>
              <input 
                :value="step"
                @input="updateWorkflow(key, index, $event.target.value)"
                type="text"
                class="cyber-input flex-1 text-xs py-2"
                :placeholder="workflow.placeholder"
              />
              <button 
                @click="removeWorkflowStep(key, index)"
                class="text-red-400 hover:text-red-300 px-1"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            </div>
            <button 
              @click="addWorkflowStep(key)"
              class="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Plus class="w-3.5 h-3.5" /> {{ $t('agents.workflow.addStep') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 回答风格 -->
      <div class="space-y-4 pt-4 border-t border-[var(--border-color)]">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <MessageSquare class="w-4 h-4" />
            {{ $t('agents.style.title') }}
          </h3>
          <TooltipIcon>{{ $t('agents.style.tooltip') }}</TooltipIcon>
        </div>
        
        <div>
          <label class="block text-sm mb-2 text-[var(--text-primary)]">{{ $t('agents.style.format') }}</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="fmt in formatOptions" :key="fmt"
              @click="toggleFormat(fmt)"
              class="px-3 py-1.5 rounded-full text-xs border transition-all"
              :class="config.formats.includes(fmt) 
                ? 'border-blue-400 bg-blue-400/20 text-blue-400' 
                : 'border-[var(--border-color)] hover:border-blue-400/50 text-[var(--text-secondary)]'"
            >
              {{ fmt }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm mb-2 text-[var(--text-primary)]">{{ $t('agents.style.habits') }}</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="habit in habitOptions" :key="habit"
              @click="toggleHabit(habit)"
              class="px-3 py-1.5 rounded-full text-xs border transition-all"
              :class="config.habits.includes(habit) 
                ? 'border-blue-400 bg-blue-400/20 text-blue-400' 
                : 'border-[var(--border-color)] hover:border-blue-400/50 text-[var(--text-secondary)]'"
            >
              {{ habit }}
            </button>
          </div>
        </div>
      </div>

      <!-- 禁止事项 -->
      <div class="space-y-4 pt-4 border-t border-[var(--border-color)]">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <Shield class="w-4 h-4" />
            {{ $t('agents.prohibitions.title') }}
          </h3>
          <TooltipIcon>{{ $t('agents.prohibitions.tooltip') }}</TooltipIcon>
        </div>
        
        <div class="space-y-2">
          <div v-for="(item, index) in config.prohibitions" :key="index"
            class="flex items-center gap-2"
          >
            <input 
              :value="item"
              @input="updateProhibition(index, $event.target.value)"
              type="text"
              class="cyber-input flex-1 text-xs py-2"
              :placeholder="$t('agents.prohibitions.placeholder')"
            />
            <button 
              @click="removeProhibition(index)"
              class="text-red-400 hover:text-red-300 px-1"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
          <button 
            @click="addProhibition"
            class="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Plus class="w-3.5 h-3.5" /> {{ $t('agents.prohibitions.add') }}
          </button>
        </div>
      </div>

      <!-- 特殊指令 -->
      <div class="space-y-4 pt-4 border-t border-[var(--border-color)]">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <Command class="w-4 h-4" />
            {{ $t('agents.commands.title') }}
          </h3>
          <TooltipIcon>{{ $t('agents.commands.tooltip') }}</TooltipIcon>
        </div>
        
        <div class="space-y-2">
          <div v-for="(cmd, index) in config.commands" :key="index"
            class="flex items-center gap-2"
          >
            <input 
              :value="cmd.trigger"
              @input="updateCommand(index, 'trigger', $event.target.value)"
              type="text"
              class="cyber-input w-24 text-xs py-2"
              :placeholder="$t('agents.commands.triggerPlaceholder')"
            />
            <input 
              :value="cmd.action"
              @input="updateCommand(index, 'action', $event.target.value)"
              type="text"
              class="cyber-input flex-1 text-xs py-2"
              :placeholder="$t('agents.commands.actionPlaceholder')"
            />
            <button 
              @click="removeCommand(index)"
              class="text-red-400 hover:text-red-300 px-1"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
          <button 
            @click="addCommand"
            class="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Plus class="w-3.5 h-3.5" /> {{ $t('agents.commands.add') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Bot, Target, Settings, MessageSquare, Shield, Command, Plus, X } from 'lucide-vue-next'
import TooltipIcon from '../ui/TooltipIcon.vue'

const { t } = useI18n()

const props = defineProps({
  config: Object
})

const emit = defineEmits(['update:config'])

const specialtyOptions = computed(() => [
  t('agents.specialty.web') || 'Web开发',
  t('agents.specialty.architecture') || '系统架构', 
  t('agents.specialty.codeReview') || '代码审查',
  t('agents.specialty.data') || '数据分析',
  t('agents.specialty.ml') || '机器学习',
  t('agents.specialty.devops') || 'DevOps',
  t('agents.specialty.mobile') || '移动开发',
  t('agents.specialty.database') || '数据库',
  t('agents.specialty.security') || '网络安全'
])

const formatOptions = computed(() => [
  t('agents.format.markdown') || '使用Markdown格式',
  t('agents.format.codeLang') || '代码块标注语言',
  t('agents.format.headings') || '长内容使用标题分隔',
  t('agents.format.bold') || '重要内容加粗',
  t('agents.format.lists') || '适当使用列表',
  t('agents.format.tables') || '适当使用表格'
])

const habitOptions = computed(() => [
  t('agents.habit.techTerms') || '技术术语使用英文',
  t('agents.habit.analogy') || '解释时使用类比',
  t('agents.habit.formal') || '避免过于口语化',
  t('agents.habit.conclusionFirst') || '先给结论再展开',
  t('agents.habit.compare') || '提供多个方案时说明优劣'
])

const workflows = computed(() => ({
  code: {
    name: t('agents.workflow.code'),
    placeholder: t('agents.workflow.stepPlaceholder')
  },
  research: {
    name: t('agents.workflow.research'), 
    placeholder: t('agents.workflow.stepPlaceholder')
  },
  ops: {
    name: t('agents.workflow.ops'),
    placeholder: t('agents.workflow.stepPlaceholder')
  }
}))

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

const toggleSpecialty = (spec) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  const index = newConfig.role.specialties.indexOf(spec)
  if (index > -1) {
    newConfig.role.specialties.splice(index, 1)
  } else {
    newConfig.role.specialties.push(spec)
  }
  emit('update:config', newConfig)
}

const toggleFormat = (fmt) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  const index = newConfig.formats.indexOf(fmt)
  if (index > -1) {
    newConfig.formats.splice(index, 1)
  } else {
    newConfig.formats.push(fmt)
  }
  emit('update:config', newConfig)
}

const toggleHabit = (habit) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  const index = newConfig.habits.indexOf(habit)
  if (index > -1) {
    newConfig.habits.splice(index, 1)
  } else {
    newConfig.habits.push(habit)
  }
  emit('update:config', newConfig)
}

const updateWorkflow = (key, index, value) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.workflows[key][index] = value
  emit('update:config', newConfig)
}

const addWorkflowStep = (key) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.workflows[key].push('')
  emit('update:config', newConfig)
}

const removeWorkflowStep = (key, index) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.workflows[key].splice(index, 1)
  emit('update:config', newConfig)
}

const updateProhibition = (index, value) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.prohibitions[index] = value
  emit('update:config', newConfig)
}

const addProhibition = () => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.prohibitions.push('')
  emit('update:config', newConfig)
}

const removeProhibition = (index) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.prohibitions.splice(index, 1)
  emit('update:config', newConfig)
}

const updateCommand = (index, field, value) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.commands[index][field] = value
  emit('update:config', newConfig)
}

const addCommand = () => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.commands.push({ trigger: '', action: '' })
  emit('update:config', newConfig)
}

const removeCommand = (index) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.commands.splice(index, 1)
  emit('update:config', newConfig)
}
</script>