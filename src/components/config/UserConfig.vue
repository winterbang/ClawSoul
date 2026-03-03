<!-- UserConfig.vue -->
<template>
  <div class="glass rounded-xl p-6 space-y-6">
    <div class="flex items-center gap-2">
      <h2 class="text-xl font-semibold flex items-center gap-2 text-[var(--text-primary)]">
        <User class="w-5 h-5 text-green-400" />
        {{ $t('user.title') }}
      </h2>
      <TooltipIcon position="right">
        {{ $t('user.tooltip') }}
      </TooltipIcon>
    </div>

    <div class="space-y-6">
      <!-- 基本信息 -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <Contact class="w-4 h-4" />
            {{ $t('user.basic') }}
          </h3>
          <TooltipIcon>{{ $t('user.basicTooltip') || '让 AI 知道如何称呼你，了解你的职业背景' }}</TooltipIcon>
        </div>
        
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs mb-1.5 text-[var(--text-primary)]">{{ $t('user.name') }}</label>
            <input 
              :value="config.basic.name"
              @input="updateConfig('basic.name', $event.target.value)"
              type="text" 
              :placeholder="$t('user.namePlaceholder') || '你的姓名'"
              class="cyber-input w-full text-sm py-2"
            />
          </div>

          <div>
            <label class="block text-xs mb-1.5 text-[var(--text-primary)]">{{ $t('user.occupation') || '职业' }}</label>
            <input 
              :value="config.basic.occupation"
              @input="updateConfig('basic.occupation', $event.target.value)"
              type="text" 
              :placeholder="$t('user.occupationPlaceholder') || '例如：全栈开发工程师'"
              class="cyber-input w-full text-sm py-2"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs mb-1.5 text-[var(--text-primary)]">{{ $t('user.company') || '公司/组织' }}</label>
            <input 
              :value="config.basic.company"
              @input="updateConfig('basic.company', $event.target.value)"
              type="text" 
              :placeholder="$t('user.companyPlaceholder') || '你的公司'"
              class="cyber-input w-full text-sm py-2"
            />
          </div>

          <div>
            <label class="block text-xs mb-1.5 text-[var(--text-primary)]">{{ $t('user.experience') || '工作年限' }}</label>
            <select 
              :value="config.basic.experience" 
              @change="updateConfig('basic.experience', $event.target.value)"
              class="cyber-input w-full text-sm py-2"
            >
              <option value="">{{ $t('user.select') || '请选择' }}</option>
              <option value="1-3年">1-3 {{ $t('user.years') || '年' }}</option>
              <option value="3-5年">3-5 {{ $t('user.years') || '年' }}</option>
              <option value="5-8年">5-8 {{ $t('user.years') || '年' }}</option>
              <option value="8年以上">8 {{ $t('user.yearsPlus') || '年以上' }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 技术背景 -->
      <div class="space-y-4 pt-4 border-t border-[var(--border-color)]">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <Code class="w-4 h-4" />
            {{ $t('user.tech') }}
          </h3>
          <TooltipIcon>{{ $t('user.techTooltip') }}</TooltipIcon>
        </div>

        <div v-for="category in techCategories" :key="category.id" class="space-y-2">
          <label class="block text-xs font-medium text-[var(--text-primary)]">{{ category.name }}</label>
          <div class="flex flex-wrap gap-1.5">
            <button 
              v-for="tech in category.options" :key="tech"
              @click="toggleTech(category.id, tech)"
              class="px-2.5 py-1 rounded-full text-xs border transition-all"
              :class="config.tech[category.id].includes(tech) 
                ? 'border-green-400 bg-green-400/20 text-green-400' 
                : 'border-[var(--border-color)] hover:border-green-400/50 text-[var(--text-secondary)]'"
            >
              {{ tech }}
            </button>
          </div>
        </div>
      </div>

      <!-- 工作习惯 -->
      <div class="space-y-4 pt-4 border-t border-[var(--border-color)]">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <Briefcase class="w-4 h-4" />
            {{ $t('user.work') }}
          </h3>
          <TooltipIcon>{{ $t('user.workTooltip') }}</TooltipIcon>
        </div>

        <div class="space-y-3">
          <div v-for="(habit, index) in config.workHabits" :key="index"
            class="flex items-center gap-2"
          >
            <input 
              :value="habit"
              @input="updateWorkHabit(index, $event.target.value)"
              type="text"
              class="cyber-input flex-1 text-sm py-2"
              :placeholder="$t('user.workPlaceholder') || '例如：偏好简洁高效的沟通方式'"
            />
            <button 
              @click="removeWorkHabit(index)"
              class="text-red-400 hover:text-red-300 px-1"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
          
          <button 
            @click="addWorkHabit"
            class="text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
          >
            <Plus class="w-3.5 h-3.5" /> {{ $t('user.addWorkHabit') || '添加工作习惯' }}
          </button>
        </div>
      </div>

      <!-- 当前项目 -->
      <div class="space-y-4 pt-4 border-t border-[var(--border-color)]">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <FolderOpen class="w-4 h-4" />
            {{ $t('user.projects') }}
          </h3>
          <TooltipIcon>{{ $t('user.projectsTooltip') }}</TooltipIcon>
        </div>

        <div class="space-y-3">
          <div v-for="(project, index) in config.projects" :key="index"
            class="space-y-2 p-3 user-project-card rounded-lg"
          >
            <input 
              :value="project.name"
              @input="updateProject(index, 'name', $event.target.value)"
              type="text"
              :placeholder="$t('user.projectName') || '项目名称'"
              class="cyber-input w-full text-sm py-2"
            />
            <textarea 
              :value="project.description"
              @input="updateProject(index, 'description', $event.target.value)"
              rows="2"
              :placeholder="$t('user.projectDesc') || '项目描述...'"
              class="cyber-input w-full text-xs resize-none"
            />
            
            <div class="flex justify-end">
              <button 
                @click="removeProject(index)"
                class="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <X class="w-3 h-3" /> {{ $t('user.removeProject') || '删除' }}
              </button>
            </div>
          </div>
          
          <button 
            @click="addProject"
            class="text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
          >
            <Plus class="w-3.5 h-3.5" /> {{ $t('user.addProject') || '添加项目' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User, Contact, Code, Briefcase, FolderOpen, Plus, X } from 'lucide-vue-next'
import TooltipIcon from '../ui/TooltipIcon.vue'

const props = defineProps({
  config: Object
})

const emit = defineEmits(['update:config'])

const techCategories = [
  {
    id: 'languages',
    name: '编程语言',
    options: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'Ruby', 'PHP']
  },
  {
    id: 'frontend',
    name: '前端技术',
    options: ['Vue', 'React', 'Angular', 'Svelte', 'Next.js', 'TailwindCSS', 'Webpack', 'Vite']
  },
  {
    id: 'backend',
    name: '后端技术',
    options: ['Node.js', 'Django', 'Spring Boot', 'Laravel', 'Express', 'FastAPI', 'GraphQL']
  },
  {
    id: 'database',
    name: '数据库',
    options: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQLite']
  },
  {
    id: 'devops',
    name: 'DevOps',
    options: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Terraform', 'Linux']
  }
]

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

const toggleTech = (category, tech) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  const index = newConfig.tech[category].indexOf(tech)
  if (index > -1) {
    newConfig.tech[category].splice(index, 1)
  } else {
    newConfig.tech[category].push(tech)
  }
  emit('update:config', newConfig)
}

const updateWorkHabit = (index, value) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.workHabits[index] = value
  emit('update:config', newConfig)
}

const addWorkHabit = () => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.workHabits.push('')
  emit('update:config', newConfig)
}

const removeWorkHabit = (index) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.workHabits.splice(index, 1)
  emit('update:config', newConfig)
}

const updateProject = (index, field, value) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.projects[index][field] = value
  emit('update:config', newConfig)
}

const addProject = () => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.projects.push({ name: '', description: '' })
  emit('update:config', newConfig)
}

const removeProject = (index) => {
  const newConfig = JSON.parse(JSON.stringify(props.config))
  newConfig.projects.splice(index, 1)
  emit('update:config', newConfig)
}
</script>

<style scoped>
.user-project-card {
  background-color: rgba(99, 102, 241, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.1);
}

[data-theme="light"] .user-project-card {
  background-color: rgba(99, 102, 241, 0.03);
  border: 1px solid rgba(99, 102, 241, 0.08);
}
</style>