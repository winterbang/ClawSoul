<!-- UserConfig.vue -->
<template>
  <div class="glass rounded-xl p-6 space-y-6">
    <h2 class="text-xl font-semibold flex items-center gap-2">
      <User class="w-5 h-5 text-green-400" />
      用户画像 USER
    </h2>

    <div class="space-y-6">
      <!-- 基本信息 -->
      <div class="space-y-4">
        <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Contact class="w-4 h-4" />
          基本信息
        </h3>
        
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs mb-1.5">姓名</label>
            <input 
              :value="config.basic.name"
              @input="updateConfig('basic.name', $event.target.value)"
              type="text" 
              placeholder="你的姓名"
              class="cyber-input w-full text-sm py-2"
            />
          </div>

          <div>
            <label class="block text-xs mb-1.5">职业</label>
            <input 
              :value="config.basic.occupation"
              @input="updateConfig('basic.occupation', $event.target.value)"
              type="text" 
              placeholder="例如：全栈开发工程师"
              class="cyber-input w-full text-sm py-2"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs mb-1.5">公司/组织</label>
            <input 
              :value="config.basic.company"
              @input="updateConfig('basic.company', $event.target.value)"
              type="text" 
              placeholder="你的公司"
              class="cyber-input w-full text-sm py-2"
            />
          </div>

          <div>
            <label class="block text-xs mb-1.5">工作年限</label>
            <select 
              :value="config.basic.experience" 
              @change="updateConfig('basic.experience', $event.target.value)"
              class="cyber-input w-full text-sm py-2"
            >
              <option value="">请选择</option>
              <option value="1-3年">1-3年</option>
              <option value="3-5年">3-5年</option>
              <option value="5-8年">5-8年</option>
              <option value="8年以上">8年以上</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 技术背景 -->
      <div class="space-y-4 pt-4 border-t border-cyber-600/30">
        <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Code class="w-4 h-4" />
          技术背景
        </h3>

        <div v-for="category in techCategories" :key="category.id" class="space-y-2">
          <label class="block text-xs font-medium">{{ category.name }}</label>
          <div class="flex flex-wrap gap-1.5">
            <button 
              v-for="tech in category.options" :key="tech"
              @click="toggleTech(category.id, tech)"
              class="px-2.5 py-1 rounded-full text-xs border transition-all"
              :class="config.tech[category.id].includes(tech) 
                ? 'border-green-400 bg-green-400/20 text-green-400' 
                : 'border-cyber-600 hover:border-green-400/50'"
            >
              {{ tech }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs mb-1.5">其他技术</label>
          <input 
            :value="config.tech.other"
            @input="updateConfig('tech.other', $event.target.value)"
            type="text" 
            placeholder="用逗号分隔，例如：GraphQL, Docker, Kubernetes"
            class="cyber-input w-full text-sm py-2"
          />
        </div>
      </div>

      <!-- 工作习惯 -->
      <div class="space-y-4 pt-4 border-t border-cyber-600/30">
        <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Clock class="w-4 h-4" />
          工作习惯
        </h3>

        <div>
          <label class="block text-xs mb-1.5">工作时间</label>
          <div class="flex items-center gap-2">
            <input 
              :value="config.workSchedule.start"
              @input="updateConfig('workSchedule.start', $event.target.value)"
              type="time"
              class="cyber-input text-sm py-2"
            />
            <span class="text-gray-400">-</span>
            <input 
              :value="config.workSchedule.end"
              @input="updateConfig('workSchedule.end', $event.target.value)"
              type="time"
              class="cyber-input text-sm py-2"
            />
            <select 
              :value="config.workSchedule.timezone" 
              @change="updateConfig('workSchedule.timezone', $event.target.value)"
              class="cyber-input text-sm py-2 ml-2"
            >
              <option value="UTC+8">UTC+8</option>
              <option value="UTC+0">UTC+0</option>
              <option value="UTC-5">UTC-5</option>
              <option value="UTC-8">UTC-8</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs mb-2">沟通偏好</label>
          <div class="space-y-2">
            <label v-for="pref in communicationPrefs" :key="pref.id"
              class="flex items-center gap-2 cursor-pointer"
            >
              <input 
                :checked="config.communication[pref.id]"
                @change="updateCommunication(pref.id, $event.target.checked)"
                type="checkbox"
                class="w-4 h-4 rounded border-cyber-600 text-green-400"
              />
              <span class="text-xs">{{ pref.label }}</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-xs mb-2">任务优先级</label>
          <div class="space-y-2">
            <div v-for="(priority, index) in config.priorities" :key="index"
              class="flex items-center gap-2"
            >
              <span class="text-xs text-gray-500 w-5">{{ index + 1 }}.</span>
              <input 
                :value="priority"
                @input="updatePriority(index, $event.target.value)"
                type="text"
                class="cyber-input flex-1 text-xs py-2"
                placeholder="例如：安全问题"
              />
              <button 
                v-if="index > 0"
                @click="movePriorityUp(index)"
                class="text-gray-400 hover:text-green-400"
              >
                <ArrowUp class="w-3.5 h-3.5" />
              </button>
              <button 
                v-if="index < config.priorities.length - 1"
                @click="movePriorityDown(index)"
                class="text-gray-400 hover:text-green-400"
              >
                <ArrowDown class="w-3.5 h-3.5" />
              </button>
              <button 
                @click="removePriority(index)"
                class="text-red-400 hover:text-red-300"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            </div>
            <button 
              v-if="config.priorities.length < 6"
              @click="addPriority"
              class="text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
            >
              <Plus class="w-3.5 h-3.5" /> 添加优先级
            </button>
          </div>
        </div>
      </div>

      <!-- 项目信息 -->
      <div class="space-y-4 pt-4 border-t border-cyber-600/30">
        <h3 class="text-sm font-medium text-gray-400 flex items-center gap-2">
          <Folder class="w-4 h-4" />
          项目信息
        </h3>

        <div>
          <label class="block text-xs mb-1.5">当前项目</label>
          <input 
            :value="config.project.name"
            @input="updateConfig('project.name', $event.target.value)"
            type="text" 
            placeholder="项目名称"
            class="cyber-input w-full text-sm py-2"
          />
        </div>

        <div>
          <label class="block text-xs mb-1.5">技术栈</label>
          <input 
            :value="config.project.stack"
            @input="updateConfig('project.stack', $event.target.value)"
            type="text" 
            placeholder="例如：Next.js + Prisma + PostgreSQL"
            class="cyber-input w-full text-sm py-2"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs mb-1.5">团队规模</label>
            <select 
              :value="config.project.teamSize" 
              @change="updateConfig('project.teamSize', $event.target.value)"
              class="cyber-input w-full text-sm py-2"
            >
              <option value="">请选择</option>
              <option value="1人">1人</option>
              <option value="2-5人">2-5人</option>
              <option value="5-10人">5-10人</option>
              <option value="10人以上">10人以上</option>
            </select>
          </div>

          <div>
            <label class="block text-xs mb-1.5">项目状态</label>
            <select 
              :value="config.project.status" 
              @change="updateConfig('project.status', $event.target.value)"
              class="cyber-input w-full text-sm py-2"
            >
              <option value="">请选择</option>
              <option value="规划中">规划中</option>
              <option value="开发中">开发中</option>
              <option value="测试中">测试中</option>
              <option value="已上线">已上线</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  User, Contact, Code, Clock, Folder,
  Plus, X, ArrowUp, ArrowDown
} from 'lucide-vue-next'

const props = defineProps({
  config: Object
})

const emit = defineEmits(['update:config'])

const techCategories = [
  {
    id: 'proficient',
    name: '熟练技术',
    options: ['React', 'Vue', 'Angular', 'TypeScript', 'Node.js', 'Python', 'Go', 'Java', 'PHP', 'Rust']
  },
  {
    id: 'learning',
    name: '学习中',
    options: ['Rust', 'Kubernetes', '机器学习', 'WebAssembly', '区块链']
  },
  {
    id: 'unfamiliar',
    name: '不熟悉',
    options: ['.NET', 'Java 企业级', '移动端原生', '嵌入式', '游戏开发']
  }
]

const communicationPrefs = [
  { id: 'conclusionFirst', label: '偏好先给结论，再展开解释' },
  { id: 'codeExamples', label: '代码示例比文字描述更有帮助' },
  { id: 'reasoning', label: '重要决策需要原因说明' },
  { id: 'casual', label: '不喜欢过于正式的语言' },
  { id: 'detailed', label: '偏好详细的解释' }
]

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

const toggleTech = (categoryId, tech) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  const list = newConfig.tech[categoryId]
  const index = list.indexOf(tech)
  if (index > -1) {
    list.splice(index, 1)
  } else {
    list.push(tech)
  }
  emit('update:config', newConfig)
}

const updateCommunication = (id, value) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.communication[id] = value
  emit('update:config', newConfig)
}

const updatePriority = (index, value) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.priorities[index] = value
  emit('update:config', newConfig)
}

const addPriority = () => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.priorities.push('')
  emit('update:config', newConfig)
}

const removePriority = (index) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.priorities.splice(index, 1)
  emit('update:config', newConfig)
}

const movePriorityUp = (index) => {
  if (index <= 0) return
  const newConfig = JSON.parse(JSON.stringify(props.config))
  const temp = newConfig.priorities[index]
  newConfig.priorities[index] = newConfig.priorities[index - 1]
  newConfig.priorities[index - 1] = temp
  emit('update:config', newConfig)
}

const movePriorityDown = (index) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  if (index >= newConfig.priorities.length - 1) return
  const temp = newConfig.priorities[index]
  newConfig.priorities[index] = newConfig.priorities[index + 1]
  newConfig.priorities[index + 1] = temp
  emit('update:config', newConfig)
}
</script>