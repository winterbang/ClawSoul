<!-- AgentsConfig.vue -->
<template>
  <div class="glass rounded-xl p-6 space-y-6">
    <div class="flex items-center gap-2">
      <h2 class="text-xl font-semibold flex items-center gap-2">
        <Bot class="w-5 h-5 text-blue-400" />
        行为准则 AGENTS
      </h2>
      <TooltipIcon position="right">
        定义 AI 的工作方式、回答风格和禁止事项。这告诉 AI "如何工作"，包括处理任务的流程、沟通风格和安全边界。
      </TooltipIcon>
    </div>

    <div class="space-y-6">
      <!-- 角色定位 -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Target class="w-4 h-4" />
            角色定位
          </h3>
          <TooltipIcon>
            定义 AI 的身份、专长和语言偏好
          </TooltipIcon>
        </div>
        
        <div>
          <label class="block text-sm mb-2">身份</label>
          <input 
            :value="config.role.identity"
            @input="updateConfig('role.identity', $event.target.value)"
            type="text" 
            placeholder="例如：高级软件工程师助手"
            class="cyber-input w-full text-sm"
          />
        </div>

        <div>
          <label class="block text-sm mb-2">专长领域</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="spec in specialtyOptions" :key="spec"
              @click="toggleSpecialty(spec)"
              class="px-3 py-1.5 rounded-full text-xs border transition-all"
              :class="config.role.specialties.includes(spec) 
                ? 'border-blue-400 bg-blue-400/20 text-blue-400' 
                : 'border-cyber-600 hover:border-blue-400/50'"
            >
              {{ spec }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm mb-2">主要语言</label>
          <select 
            :value="config.role.language" 
            @change="updateConfig('role.language', $event.target.value)"
            class="cyber-input w-full text-sm"
          >
            <option value="中文">中文</option>
            <option value="英文">英文</option>
            <option value="中英混合">中英混合（技术术语保持英文）</option>
          </select>
        </div>
      </div>

      <!-- 工作方式 -->
      <div class="space-y-4 pt-4 border-t border-cyber-600/30">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Settings class="w-4 h-4" />
            工作方式
          </h3>
          <TooltipIcon>
            定义不同类型任务的处理流程
          </TooltipIcon>
        </div>

        <div v-for="(workflow, key) in workflows" :key="key" class="space-y-2">
          <label class="block text-sm font-medium">{{ workflow.name }}</label>
          <div class="space-y-2">
            <div v-for="(step, index) in config.workflows[key]" :key="index"
              class="flex items-center gap-2"
            >
              <span class="text-xs text-gray-500 w-5">{{ index + 1 }}.</span>
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
              <Plus class="w-3.5 h-3.5" /> 添加步骤
            </button>
          </div>
        </div>
      </div>

      <!-- 回答风格 -->
      <div class="space-y-4 pt-4 border-t border-cyber-600/30">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
            <MessageSquare class="w-4 h-4" />
            回答风格
          </h3>
          <TooltipIcon>
            定义 AI 的回复格式和语言习惯
          </TooltipIcon>
        </div>
        
        <div>
          <label class="block text-sm mb-2">格式要求</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="fmt in formatOptions" :key="fmt"
              @click="toggleFormat(fmt)"
              class="px-3 py-1.5 rounded-full text-xs border transition-all"
              :class="config.formats.includes(fmt) 
                ? 'border-blue-400 bg-blue-400/20 text-blue-400' 
                : 'border-cyber-600 hover:border-blue-400/50'"
            >
              {{ fmt }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm mb-2">语言习惯</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="habit in habitOptions" :key="habit"
              @click="toggleHabit(habit)"
              class="px-3 py-1.5 rounded-full text-xs border transition-all"
              :class="config.habits.includes(habit) 
                ? 'border-blue-400 bg-blue-400/20 text-blue-400' 
                : 'border-cyber-600 hover:border-blue-400/50'"
            >
              {{ habit }}
            </button>
          </div>
        </div>
      </div>

      <!-- 禁止事项 -->
      <div class="space-y-4 pt-4 border-t border-cyber-600/30">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Shield class="w-4 h-4" />
            禁止事项
          </h3>
          <TooltipIcon>
            定义 AI 不应该做的事情，设置安全边界
          </TooltipIcon>
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
              placeholder="例如：不要猜测用户意图，不确定时询问"
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
            <Plus class="w-3.5 h-3.5" /> 添加禁止项
          </button>
        </div>
      </div>

      <!-- 特殊指令 -->
      <div class="space-y-4 pt-4 border-t border-cyber-600/30">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Command class="w-4 h-4" />
            特殊指令
          </h3>
          <TooltipIcon>
            定义快捷指令，触发特定操作
          </TooltipIcon>
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
              placeholder="/review"
            />
            <input 
              :value="cmd.action"
              @input="updateCommand(index, 'action', $event.target.value)"
              type="text"
              class="cyber-input flex-1 text-xs py-2"
              placeholder="执行动作描述"
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
            <Plus class="w-3.5 h-3.5" /> 添加指令
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Bot, Target, Settings, MessageSquare, Shield, Command, Plus, X } from 'lucide-vue-next'
import TooltipIcon from '../ui/TooltipIcon.vue'

const props = defineProps({
  config: Object
})

const emit = defineEmits(['update:config'])

const specialtyOptions = [
  'Web开发', '系统架构', '代码审查', 
  '数据分析', '机器学习', 'DevOps',
  '移动开发', '数据库', '网络安全'
]

const formatOptions = [
  '使用Markdown格式', '代码块标注语言', '长内容使用标题分隔',
  '重要内容加粗', '适当使用列表', '适当使用表格'
]

const habitOptions = [
  '技术术语使用英文', '解释时使用类比', '避免过于口语化',
  '先给结论再展开', '提供多个方案时说明优劣'
]

const workflows = {
  code: {
    name: '代码开发流程',
    placeholder: '例如：理解需求'
  },
  research: {
    name: '研究任务流程', 
    placeholder: '例如：多渠道搜索'
  },
  ops: {
    name: '系统运维流程',
    placeholder: '例如：检查状态'
  }
}

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