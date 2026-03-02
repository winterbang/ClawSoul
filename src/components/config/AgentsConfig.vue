<!-- AgentsConfig.vue -->
<template>
  <div class="glass rounded-xl p-6 space-y-6">
    <h2 class="text-xl font-semibold flex items-center gap-2">
      <Bot class="w-5 h-5 text-blue-400" />
      行为准则 AGENTS
    </h2>

    <div class="space-y-6">
      <!-- 角色定位 -->
      <div class="space-y-4">
        <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Target class="w-4 h-4" />
          角色定位
        </h3>
        
        <div>
          <label class="block text-sm mb-2">身份</label>
          <input 
            v-model="config.role.identity"
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
          <select v-model="config.role.language" class="cyber-input w-full text-sm">
            <option value="中文">中文</option>
            <option value="英文">英文</option>
            <option value="中英混合">中英混合（技术术语保持英文）</option>
          </select>
        </div>
      </div>

      <!-- 工作方式 -->
      <div class="space-y-4 pt-4 border-t border-cyber-600/30">
        <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Settings class="w-4 h-4" />
          工作方式
        </h3>

        <div v-for="(workflow, key) in workflows" :key="key" class="space-y-2">
          <label class="block text-sm font-medium">{{ workflow.name }}</label>
          <div class="space-y-2">
            <div v-for="(step, index) in config.workflows[key]" :key="index"
              class="flex items-center gap-2"
            >
              <span class="text-xs text-gray-500 w-5">{{ index + 1 }}.</span>
              <input 
                v-model="config.workflows[key][index]"
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
        <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <MessageSquare class="w-4 h-4" />
          回答风格
        </h3>
        
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
        <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Shield class="w-4 h-4" />
          禁止事项
        </h3>
        
        <div class="space-y-2">
          <div v-for="(item, index) in config.prohibitions" :key="index"
            class="flex items-center gap-2"
          >
            <input 
              v-model="config.prohibitions[index]"
              type="text"
              class="cyber-input flex-1 text-xs py-2"
              placeholder="例如：不要猜测用户意图，不确定时询问"
            />
            <button 
              @click="config.prohibitions.splice(index, 1)"
              class="text-red-400 hover:text-red-300 px-1"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
          <button 
            @click="config.prohibitions.push('')"
            class="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Plus class="w-3.5 h-3.5" /> 添加禁止项
          </button>
        </div>
      </div>

      <!-- 特殊指令 -->
      <div class="space-y-4 pt-4 border-t border-cyber-600/30">
        <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Command class="w-4 h-4" />
          特殊指令
        </h3>
        
        <div class="space-y-2">
          <div v-for="(cmd, index) in config.commands" :key="index"
            class="flex items-center gap-2"
          >
            <input 
              v-model="cmd.trigger"
              type="text"
              class="cyber-input w-24 text-xs py-2"
              placeholder="/review"
            />
            <input 
              v-model="cmd.action"
              type="text"
              class="cyber-input flex-1 text-xs py-2"
              placeholder="执行动作描述"
            />
            <button 
              @click="config.commands.splice(index, 1)"
              class="text-red-400 hover:text-red-300 px-1"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
          <button 
            @click="config.commands.push({trigger: '', action: ''})"
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

const toggleSpecialty = (spec) => {
  const index = props.config.role.specialties.indexOf(spec)
  if (index > -1) {
    props.config.role.specialties.splice(index, 1)
  } else {
    props.config.role.specialties.push(spec)
  }
}

const toggleFormat = (fmt) => {
  const index = props.config.formats.indexOf(fmt)
  if (index > -1) {
    props.config.formats.splice(index, 1)
  } else {
    props.config.formats.push(fmt)
  }
}

const toggleHabit = (habit) => {
  const index = props.config.habits.indexOf(habit)
  if (index > -1) {
    props.config.habits.splice(index, 1)
  } else {
    props.config.habits.push(habit)
  }
}

const addWorkflowStep = (key) => {
  props.config.workflows[key].push('')
}

const removeWorkflowStep = (key, index) => {
  props.config.workflows[key].splice(index, 1)
}
</script>