<!-- MemoryConfig.vue -->
<template>
  <div class="glass rounded-xl p-6 space-y-6">
    <div class="flex items-center gap-2">
      <h2 class="text-xl font-semibold flex items-center gap-2">
        <Brain class="w-5 h-5 text-yellow-400" />
        长期记忆 MEMORY
      </h2>
      <TooltipIcon position="right">
        记录重要信息、决策、教训和偏好。这是 AI 的"笔记本"，帮助 AI 在多次对话中记住关键内容，提供更连贯的服务。
      </TooltipIcon>
    </div>

    <div class="space-y-6">
      <!-- 重要记忆 -->
      <div class="space-y-3">
        <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Star class="w-4 h-4" />
          重要记忆
        </h3>
        <p class="text-xs text-gray-500">记录重要的对话、决策、关键信息</p>
        <div class="space-y-2">
          <div v-for="(memory, index) in config.memories" :key="index"
            class="flex items-start gap-2"
          >
            <span class="text-xs text-gray-500 mt-2">{{ index + 1 }}.</span>
            <textarea 
              :value="memory"
              @input="updateMemory(index, $event.target.value)"
              rows="2"
              placeholder="例如：用户提到他的生日是3月15日"
              class="cyber-input flex-1 text-xs resize-none"
            />
            <button 
              @click="removeMemory(index)"
              class="text-red-400 hover:text-red-300 mt-2"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
          <button 
            @click="addMemory"
            class="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
          >
            <Plus class="w-4 h-4" /> 添加重要记忆
          </button>
        </div>
      </div>

      <!-- 决策记录 -->
      <div class="space-y-3 pt-4 border-t border-cyber-600/30">
        <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <GitCommit class="w-4 h-4" />
          决策记录
        </h3>
        <p class="text-xs text-gray-500">记录重要的决定及其原因</p>
        <div class="space-y-2">
          <div v-for="(decision, index) in config.decisions" :key="index"
            class="space-y-2 p-3 bg-cyber-800/30 rounded-lg"
          >
            <input 
              :value="decision.title"
              @input="updateDecision(index, 'title', $event.target.value)"
              type="text"
              placeholder="决策标题"
              class="cyber-input w-full text-xs py-2"
            />
            <textarea 
              :value="decision.reason"
              @input="updateDecision(index, 'reason', $event.target.value)"
              rows="2"
              placeholder="决策原因..."
              class="cyber-input w-full text-xs resize-none"
            />
            <div class="flex justify-end">
              <button 
                @click="removeDecision(index)"
                class="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <X class="w-3 h-3" /> 删除
              </button>
            </div>
          </div>
          <button 
            @click="addDecision"
            class="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
          >
            <Plus class="w-4 h-4" /> 添加决策记录
          </button>
        </div>
      </div>

      <!-- 经验教训 -->
      <div class="space-y-3 pt-4 border-t border-cyber-600/30">
        <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Lightbulb class="w-4 h-4" />
          经验教训
        </h3>
        <p class="text-xs text-gray-500">记录学到的教训，避免重复犯错</p>
        <div class="space-y-2">
          <div v-for="(lesson, index) in config.lessons" :key="index"
            class="flex items-start gap-2"
          >
            <span class="text-xs text-yellow-500 mt-2">💡</span>
            <textarea 
              :value="lesson"
              @input="updateLesson(index, $event.target.value)"
              rows="2"
              placeholder="例如：不要在没有确认的情况下执行删除操作"
              class="cyber-input flex-1 text-xs resize-none"
            />
            <button 
              @click="removeLesson(index)"
              class="text-red-400 hover:text-red-300 mt-2"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
          <button 
            @click="addLesson"
            class="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
          >
            <Plus class="w-4 h-4" /> 添加经验教训
          </button>
        </div>
      </div>

      <!-- 项目上下文 -->
      <div class="space-y-3 pt-4 border-t border-cyber-600/30">
        <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <FolderOpen class="w-4 h-4" />
          项目上下文
        </h3>
        <p class="text-xs text-gray-500">记录当前正在进行的项目相关信息</p>
        <textarea 
          :value="config.projectContext"
          @input="updateConfig('projectContext', $event.target.value)"
          rows="4"
          placeholder="例如：\n- 正在开发电商平台重构项目\n- 技术栈：Next.js + Prisma\n- 预计Q2上线"
          class="cyber-input w-full text-sm resize-none"
        />
      </div>

      <!-- 个人偏好 -->
      <div class="space-y-3 pt-4 border-t border-cyber-600/30">
        <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Heart class="w-4 h-4" />
          个人偏好
        </h3>
        <p class="text-xs text-gray-500">记录用户的喜好和偏好</p>
        <div class="space-y-2">
          <div v-for="(pref, index) in config.preferences" :key="index"
            class="flex items-center gap-2"
          >
            <input 
              :value="pref.key"
              @input="updatePreference(index, 'key', $event.target.value)"
              type="text"
              placeholder="偏好项"
              class="cyber-input w-1/3 text-xs py-2"
            />
            <input 
              :value="pref.value"
              @input="updatePreference(index, 'value', $event.target.value)"
              type="text"
              placeholder="偏好值"
              class="cyber-input flex-1 text-xs py-2"
            />
            <button 
              @click="removePreference(index)"
              class="text-red-400 hover:text-red-300"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
          <button 
            @click="addPreference"
            class="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
          >
            <Plus class="w-4 h-4" /> 添加偏好
          </button>
        </div>
      </div>

      <!-- 安全提醒 -->
      <div class="space-y-3 pt-4 border-t border-cyber-600/30">
        <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Shield class="w-4 h-4" />
          安全提醒
        </h3>
        <p class="text-xs text-gray-500">记录安全相关的注意事项</p>
        <div class="space-y-2">
          <div v-for="(reminder, index) in config.security" :key="index"
            class="flex items-start gap-2"
          >
            <span class="text-xs text-red-400 mt-2">🔒</span>
            <textarea 
              :value="reminder"
              @input="updateSecurity(index, $event.target.value)"
              rows="2"
              placeholder="例如：不要在群聊中分享 API Key"
              class="cyber-input flex-1 text-xs resize-none"
            />
            <button 
              @click="removeSecurity(index)"
              class="text-red-400 hover:text-red-300 mt-2"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
          <button 
            @click="addSecurity"
            class="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
          >
            <Plus class="w-4 h-4" /> 添加安全提醒
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
import TooltipIcon from '../TooltipIcon.vue'

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