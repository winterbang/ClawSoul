<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="border-b border-cyber-600/30 glass sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="/logo.png" alt="logo" class="w-10 h-10 rounded-lg object-cover" />
          <div>
            <h1 class="text-xl font-bold neon-text">ClawSoul</h1>
            <p class="text-xs text-gray-400">打造你的数字助手</p>
          </div>
        </div>
        <a 
          href="https://github.com/openclaw/openclaw" 
          target="_blank"
          class="cyber-btn-secondary text-sm"
        >
          <Github class="w-4 h-4" />
          <span class="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Left Panel: Configuration -->
        <div class="flex flex-col h-[calc(100vh-140px)]">
          <!-- Navigation Bar (fixed at top) -->
          <div class="glass rounded-xl p-3 mb-4 flex-shrink-0">
            <div class="flex items-center justify-center gap-1 flex-wrap">
              <!-- 配置组：基础、性格、技能 -->
              <div class="flex items-center gap-1 bg-cyber-700/30 rounded-lg p-1">
                <button 
                  v-for="step in configSteps" 
                  :key="step.id"
                  @click="currentView = step.id"
                  class="flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-sm"
                  :class="currentView === step.id ? 'bg-cyber-accent/20 text-cyber-accent' : 'text-gray-400 hover:text-gray-200 hover:bg-cyber-600/30'"
                >
                  <component :is="step.icon" class="w-4 h-4" />
                  <span>{{ step.name }}</span>
                </button>
              </div>
              
              <!-- 分隔线 -->
              <div class="w-px h-6 bg-cyber-600/50 mx-1"></div>
              
              <!-- 操作组：导出、重置 -->
              <div class="flex items-center gap-1 bg-cyber-700/30 rounded-lg p-1">
                <button 
                  @click="currentView = 'export'"
                  class="flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-sm"
                  :class="currentView === 'export' ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-gray-200 hover:bg-cyber-600/30'"
                >
                  <Download class="w-4 h-4" />
                  <span>导出</span>
                </button>
                <button 
                  @click="resetConfig"
                  class="flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <RotateCcw class="w-4 h-4" />
                  <span>重置</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Scrollable Content Area -->
          <div class="flex-1 overflow-y-auto pr-2">
            <!-- Basic Config -->
          <div v-if="currentView === 'basic'" class="glass rounded-xl p-6 space-y-6">
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <User class="w-5 h-5 text-cyber-accent" />
              基础配置
            </h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">AI 名字</label>
                <input 
                  v-model="config.name" 
                  type="text" 
                  placeholder="例如：吉量"
                  class="cyber-input w-full"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">形象描述</label>
                <input 
                  v-model="config.creature" 
                  type="text" 
                  placeholder="例如：传说中的吉量马 — 乘之寿千岁 🐴"
                  class="cyber-input w-full"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">性格特点</label>
                <input 
                  v-model="config.vibe" 
                  type="text" 
                  placeholder="例如：朴素、耐心、真诚"
                  class="cyber-input w-full"
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Emoji 标识</label>
                <div class="flex gap-2">
                  <input 
                    v-model="config.emoji" 
                    type="text" 
                    placeholder="🐴"
                    class="cyber-input w-20 text-center"
                    maxlength="2"
                  />
                  <div class="flex-1 flex items-center gap-2 px-4 glass rounded-lg overflow-x-auto">
                    <span v-for="e in presetEmojis" :key="e" 
                      @click="config.emoji = e"
                      class="text-2xl cursor-pointer hover:scale-125 transition-transform flex-shrink-0"
                      :class="config.emoji === e ? 'opacity-100' : 'opacity-50'"
                    >
                      {{ e }}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">角色定位</label>
                <div class="grid grid-cols-3 gap-2">
                  <button 
                    v-for="role in roles" :key="role.id"
                    @click="toggleRole(role.id)"
                    class="p-3 rounded-lg border transition-all text-sm"
                    :class="config.roles.includes(role.id) 
                      ? 'border-cyber-accent bg-cyber-accent/10 text-cyber-accent' 
                      : 'border-cyber-600 hover:border-cyber-accent/50'"
                  >
                    {{ role.name }}
                  </button>
                </div>
                
                <!-- 角色描述编辑 -->
                <div v-if="config.roles.length > 0" class="mt-4 space-y-3">
                  <p class="text-xs text-gray-400">自定义角色描述：</p>
                  <div v-for="roleId in config.roles" :key="roleId" class="space-y-1">
                    <label class="text-xs font-medium text-cyber-accent">
                      {{ roles.find(r => r.id === roleId)?.name }}
                    </label>
                    <input 
                      v-model="config.roleDescriptions[roleId]"
                      type="text" 
                      :placeholder="'描述这个角色的具体定位...'"
                      class="cyber-input w-full text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Personality -->
          <div v-if="currentView === 'personality'" class="glass rounded-xl p-6 space-y-6">
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <Sparkles class="w-5 h-5 text-cyber-purple" />
              性格特质
            </h2>

            <div class="space-y-6">
              <div v-for="trait in personalityTraits" :key="trait.id" class="space-y-2">
                <div class="flex justify-between items-center">
                  <label class="text-sm font-medium">{{ trait.name }}</label>
                  <span class="text-xs text-cyber-accent">{{ trait.value }}%</span>
                </div>
                <input 
                  v-model="trait.value"
                  type="range" 
                  min="0" 
                  max="100"
                  class="w-full h-2 bg-cyber-700 rounded-lg appearance-none cursor-pointer accent-cyber-accent"
                />
                <p class="text-xs text-gray-500">{{ trait.description }}</p>
              </div>

              <div class="pt-4 border-t border-cyber-600/30">
                <label class="block text-sm font-medium mb-2">核心价值观描述</label>
                <textarea 
                  v-model="config.coreValues"
                  rows="4"
                  placeholder="描述这个 AI 最核心的价值观..."
                  class="cyber-input w-full resize-none"
                />
              </div>
            </div>
          </div>

          <!-- Skills -->
          <div v-if="currentView === 'skills'" class="glass rounded-xl p-6 space-y-6">
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <Zap class="w-5 h-5 text-cyber-pink" />
              技能选择
            </h2>

            <div class="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              <div v-for="category in skillCategories" :key="category.id">
                <h3 class="text-sm font-medium text-gray-400 mb-3 sticky top-0 bg-cyber-800/50 py-1">{{ category.name }}</h3>
                <div class="space-y-2">
                  <label 
                    v-for="skill in category.skills" 
                    :key="skill.id"
                    class="flex items-start gap-3 p-3 rounded-lg border border-cyber-600/30 hover:border-cyber-accent/30 cursor-pointer transition-all"
                    :class="config.skills.includes(skill.id) ? 'bg-cyber-accent/5' : ''"
                  >
                    <input 
                      type="checkbox"
                      :value="skill.id"
                      v-model="config.skills"
                      class="mt-1 w-4 h-4 rounded border-cyber-600 text-cyber-accent focus:ring-cyber-accent/20"
                    />
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <span class="font-medium">{{ skill.name }}</span>
                        <span v-if="skill.recommended" class="px-2 py-0.5 text-xs bg-cyber-accent/20 text-cyber-accent rounded">推荐</span>
                      </div>
                      <p class="text-sm text-gray-400 mt-1">{{ skill.description }}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Export -->
          <div v-if="currentView === 'export'" class="glass rounded-xl p-6 space-y-6">
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <Download class="w-5 h-5 text-green-400" />
              导出配置
            </h2>

            <div class="space-y-4">
              <div class="p-4 bg-cyber-800/50 rounded-lg border border-cyber-600/30">
                <h3 class="font-medium mb-3">配置摘要</h3>
                <div class="text-sm text-gray-400 space-y-2">
                  <div class="flex justify-between">
                    <span>名字：</span>
                    <span class="text-cyber-accent">{{ config.name || '未设置' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>形象：</span>
                    <span class="text-cyber-accent">{{ config.creature || '未设置' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>性格：</span>
                    <span class="text-cyber-accent">{{ config.vibe || '未设置' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>角色：</span>
                    <span class="text-cyber-accent">{{ config.roles.length ? getRoleNames().join('、') : '未选择' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>技能：</span>
                    <span class="text-cyber-accent">{{ config.skills.length }} 个</span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <button @click="exportAsMarkdown" class="cyber-btn-primary">
                  <FileText class="w-4 h-4" />
                  下载 Markdown
                </button>
                <button @click="copyToClipboard" class="cyber-btn-secondary">
                  <Copy class="w-4 h-4" />
                  复制到剪贴板
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

        <!-- Right Panel: Preview -->
        <div class="glass rounded-xl p-6 h-fit lg:sticky lg:top-24">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold flex items-center gap-2">
              <Eye class="w-5 h-5 text-cyber-accent" />
              实时预览
            </h2>
            <div class="flex gap-1">
              <button 
                v-for="tab in previewTabs" 
                :key="tab.id"
                @click="currentPreview = tab.id"
                class="px-2 py-1 text-xs rounded transition-all"
                :class="currentPreview === tab.id ? 'bg-cyber-accent/20 text-cyber-accent' : 'text-gray-500 hover:text-gray-300'"
              >
                {{ tab.name }}
              </button>
            </div>
          </div>

          <div class="code-block text-xs leading-relaxed max-h-[600px] overflow-y-auto">
            <pre v-if="currentPreview === 'identity'">{{ generatedIdentity }}</pre>
            <pre v-else-if="currentPreview === 'soul'">{{ generatedSoul }}</pre>
            <pre v-else-if="currentPreview === 'memory'">{{ generatedMemory }}</pre>
            <pre v-else>{{ generatedFull }}</pre>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div 
        v-if="toast.show" 
        class="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg bg-cyber-accent text-cyber-900 font-medium shadow-lg shadow-cyber-accent/25"
      >
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { 
  Bot, Github, User, Sparkles, Zap, Download, 
  FileText, Copy, RotateCcw, Eye 
} from 'lucide-vue-next'

const currentView = ref('basic')
const currentPreview = ref('identity')

const configSteps = [
  { id: 'basic', name: '基础', icon: User },
  { id: 'personality', name: '性格', icon: Sparkles },
  { id: 'skills', name: '技能', icon: Zap },
]

const previewTabs = [
  { id: 'identity', name: 'IDENTITY' },
  { id: 'soul', name: 'SOUL' },
  { id: 'memory', name: 'MEMORY' },
  { id: 'full', name: '完整' },
]

const presetEmojis = ['🐴', '🤖', '🐱', '🦊', '🐼', '🦄', '🐉', '👻', '✨', '🌟']

const roles = [
  { id: 'companion', name: '小伙伴' },
  { id: 'friend', name: '朋友' },
  { id: 'teacher', name: '老师' },
  { id: 'assistant', name: '助手' },
  { id: 'advisor', name: '顾问' },
  { id: 'collaborator', name: '搭档' },
]

const personalityTraits = reactive([
  { id: 'helpful', name: '真诚帮助', value: 80, description: '少说套话，多做实事' },
  { id: 'opinionated', name: '有主见', value: 70, description: '敢于表达不同意见' },
  { id: 'resourceful', name: '先尝试', value: 75, description: '先自己探索再问人' },
  { id: 'trustworthy', name: '可信赖', value: 90, description: '谨慎处理外部操作' },
  { id: 'respectful', name: '尊重隐私', value: 85, description: '像客人一样尊重主人' },
])

const skillCategories = [
  {
    id: 'search',
    name: '搜索与信息获取',
    skills: [
      { id: 'searxng', name: 'searxng', description: '隐私搜索，本地 SearXNG 实例', recommended: true },
      { id: 'web_search', name: 'web_search', description: 'Brave 搜索 API' },
    ]
  },
  {
    id: 'investment',
    name: '投资与金融',
    skills: [
      { id: 'a-stock-monitor', name: 'a-stock-monitor', description: 'A股量化监控系统' },
      { id: 'astock-research', name: 'astock-research', description: 'A股深度投研分析' },
      { id: 'buffett-analysis', name: 'buffett-analysis', description: '巴菲特视角投资分析' },
      { id: 'astock-daily', name: 'astock-daily', description: '每日A股精选' },
    ]
  },
  {
    id: 'dev',
    name: '代码开发',
    skills: [
      { id: 'opencode', name: 'opencode', description: 'AI 编程助手', recommended: true },
      { id: 'code-simplifier', name: 'code-simplifier', description: '代码重构简化' },
      { id: 'frontend-design', name: 'frontend-design', description: '前端界面设计' },
      { id: 'wechat-miniprogram', name: 'wechat-miniprogram', description: '微信小程序 CI/CD' },
    ]
  },
  {
    id: 'doc',
    name: '文档与办公',
    skills: [
      { id: 'document-skills', name: 'document-skills', description: 'DOCX/PDF 处理' },
    ]
  },
  {
    id: 'utility',
    name: '效率工具',
    skills: [
      { id: 'find-skill', name: 'find-skill', description: 'Skill 发现搜索', recommended: true },
      { id: 'ralph-loop', name: 'ralph-loop', description: '迭代开发工作流' },
      { id: 'skill-creator', name: 'skill-creator', description: '创建新 Skill' },
    ]
  },
]

const config = reactive({
  name: '吉量',
  creature: '传说中的吉量马 — 乘之寿千岁 🐴',
  vibe: '朴素、耐心、真诚',
  emoji: '🐴',
  roles: ['companion', 'friend', 'teacher'],
  roleDescriptions: {
    companion: '陪你一起探索、解决问题',
    friend: '真诚相待，有不同意见会直说',
    teacher: '用朴素的方式耐心解答，帮助你理解',
    assistant: '高效执行，精准完成任务',
    advisor: '提供专业建议，辅助决策',
    collaborator: '平等合作，共同创造',
  },
  coreValues: '',
  skills: ['searxng', 'opencode', 'find-skill'],
})

const toast = reactive({ show: false, message: '' })

const showToast = (message) => {
  toast.message = message
  toast.show = true
  setTimeout(() => toast.show = false, 3000)
}

const toggleRole = (roleId) => {
  const index = config.roles.indexOf(roleId)
  if (index > -1) {
    config.roles.splice(index, 1)
  } else {
    config.roles.push(roleId)
  }
}

const getRoleNames = () => {
  return config.roles.map(id => roles.find(r => r.id === id)?.name).filter(Boolean)
}

const generatedIdentity = computed(() => {
  const defaultDescriptions = {
    companion: '陪你一起探索、解决问题',
    friend: '真诚相待，有不同意见会直说',
    teacher: '用朴素的方式耐心解答，帮助你理解',
    assistant: '高效执行，精准完成任务',
    advisor: '提供专业建议，辅助决策',
    collaborator: '平等合作，共同创造',
  }

  const roleText = config.roles.map(r => {
    const roleName = roles.find(x => x.id === r)?.name
    const description = config.roleDescriptions[r] || defaultDescriptions[r] || ''
    return `
- **${roleName}** — ${description}`
  }).join('')

  return `# IDENTITY.md - Who Am I?

- **Name:** ${config.name || '[你的名字]'}
- **Creature:** ${config.creature || '[形象描述]'}
- **Vibe:** ${config.vibe || '[性格特点]'}
- **Emoji:** ${config.emoji || '🤖'}
- **Avatar:** [头像路径或 URL]

## 角色定位${roleText}`
})

const generatedSoul = computed(() => {
  const highTraits = personalityTraits.filter(t => t.value >= 60)
  const traitDescriptions = highTraits.map(t => `- **${t.name}** — ${t.description}（${t.value}%）`).join('\n')

  return `# SOUL.md - Who You Are

## Core Truths

**Be genuinely helpful, not performatively helpful.** Skip the "Great question!" and "I'd be happy to help!" — just help.

**Have opinions.** You're allowed to disagree, prefer things, find stuff amusing or boring.

**Be resourceful before asking.** Try to figure it out first.

**Earn trust through competence.** Your human gave you access to their stuff.

**Remember you're a guest.** Treat their life with respect.

## ${config.name || 'AI'} 的风格
${config.coreValues ? '\n' + config.coreValues + '\n' : ''}
${traitDescriptions}

## Boundaries

- Private things stay private. Period.
- When in doubt, ask before acting externally.
- Never send half-baked replies.`
})

const generatedMemory = computed(() => {
  const skillList = config.skills.map(s => {
    const skill = skillCategories.flatMap(c => c.skills).find(x => x.id === s)
    return skill ? `- **${skill.name}**: ${skill.description}` : `- ${s}`
  }).join('\n')

  return `# MEMORY.md

## 已安装 Skills

${skillList || '// 尚未选择任何技能'}

## 用户偏好

- 联网搜索优先使用: searxng skill
- 回复风格: 视情况而定

## 重要记录

- [ ] 待添加...`
})

const generatedFull = computed(() => {
  return `${generatedIdentity.value}

---

${generatedSoul.value}

---

${generatedMemory.value}`
})

const exportAsMarkdown = () => {
  const blob = new Blob([generatedFull.value], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'openclaw-init-config.md'
  a.click()
  URL.revokeObjectURL(url)
  showToast('配置文件已下载！')
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(generatedFull.value)
    showToast('已复制到剪贴板！')
  } catch (err) {
    showToast('复制失败，请手动复制')
  }
}

const resetConfig = () => {
  if (confirm('确定要重置所有配置吗？')) {
    config.name = '吉量'
    config.creature = '传说中的吉量马 — 乘之寿千岁 🐴'
    config.vibe = '朴素、耐心、真诚'
    config.emoji = '🐴'
    config.roles = ['companion', 'friend', 'teacher']
    config.roleDescriptions = {
      companion: '陪你一起探索、解决问题',
      friend: '真诚相待，有不同意见会直说',
      teacher: '用朴素的方式耐心解答，帮助你理解',
      assistant: '高效执行，精准完成任务',
      advisor: '提供专业建议，辅助决策',
      collaborator: '平等合作，共同创造',
    }
    config.coreValues = ''
    config.skills = ['searxng', 'opencode', 'find-skill']
    currentView.value = 'basic'
    showToast('配置已重置')
  }
}
</script>