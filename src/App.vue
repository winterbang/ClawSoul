<template>
  <div class="min-h-screen">
    <Header />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Left Panel: Configuration -->
        <div class="flex flex-col h-[calc(100vh-140px)]">
          <Navigation 
            :current-view="currentView"
            @change-view="handleViewChange"
            @reset="resetConfig"
          />

          <div class="flex-1 overflow-y-auto pr-2">
            <IdentityConfig 
              v-if="currentView === 'identity'"
              :config="config.identity"
              :roles="roles"
              :preset-emojis="presetEmojis"
              @update:config="updateIdentityConfig"
              @toggle-role="toggleRole"
              @update:role-desc="updateRoleDesc"
            />

            <SoulConfig 
              v-if="currentView === 'soul'"
              :traits="personalityTraits"
              @update:traits="updatePersonalityTraits"
            />

            <AgentsConfig 
              v-if="currentView === 'agents'"
              :config="config.agents"
              @update:config="updateAgentsConfig"
            />

            <UserConfig 
              v-if="currentView === 'user'"
              :config="config.user"
              @update:config="updateUserConfig"
            />

            <MemoryConfig 
              v-if="currentView === 'memory'"
              :config="config.memory"
              @update:config="updateMemoryConfig"
            />

            <div v-if="currentView === 'skills'" class="glass rounded-xl p-6 space-y-6">
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-semibold flex items-center gap-2 text-[var(--text-primary)]">
                  <span class="text-yellow-500">⚡</span>
                  {{ $t('skills.title') }}
                </h2>
                <TooltipIcon position="right">
                  {{ $t('skills.tooltip') }}
                </TooltipIcon>
              </div>

              <div class="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                <div v-for="category in skillCategories" :key="category.id">
                  <h3 class="skill-category-title text-sm font-medium text-[var(--text-secondary)] mb-3 sticky top-0 py-1">{{ $t(`skillCategories.${category.id}`, category.name) }}</h3>
                  <div class="space-y-2">
                    <label 
                      v-for="skill in category.skills" 
                      :key="skill.id"
                      class="skill-item flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all"
                      :class="config.skills.includes(skill.id) ? 'skill-item-active' : 'skill-item-inactive'"
                    >
                      <input 
                        type="checkbox"
                        :value="skill.id"
                        v-model="config.skills"
                        class="skill-checkbox mt-1 w-4 h-4 rounded"
                      />
                      <div class="flex-1">
                        <div class="flex items-center gap-2">
                          <span class="font-medium text-[var(--text-primary)]">{{ skill.name }}</span>
                          <span v-if="skill.recommended" class="skill-recommended px-2 py-0.5 text-xs rounded">{{ $t('skills.recommended') }}</span>
                        </div>
                        <p class="text-sm text-[var(--text-muted)] mt-1">{{ skill.descriptionKey ? $t(skill.descriptionKey, skill.description) : skill.description }}</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentView === 'export'" class="glass rounded-xl p-6 space-y-6">
              <div class="space-y-4">
                <div class="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
                  <h3 class="font-medium mb-3 text-[var(--text-primary)]">{{ $t('export.summary') }}</h3>
                  <div class="text-sm text-[var(--text-muted)] space-y-2">
                    <div class="flex justify-between">
                      <span>{{ $t('export.name') }}：</span>
                      <span class="text-[var(--accent-primary)]">{{ config.identity.name || $t('export.notSet') }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>{{ $t('export.role') }}：</span>
                      <span class="text-[var(--accent-primary)]">{{ config.identity.roles.length ? getRoleNames().join('、') : $t('export.notConfigured') }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>{{ $t('export.skills') }}：</span>
                      <span class="text-[var(--accent-primary)]">{{ config.skills.length }} {{ $t('export.items') }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>{{ $t('export.agents') }}：</span>
                      <span class="text-[var(--accent-primary)]">{{ config.agents.role.identity || $t('export.notConfigured') }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>{{ $t('export.user') }}：</span>
                      <span class="text-[var(--accent-primary)]">{{ config.user.basic.name || $t('export.notConfigured') }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>MEMORY：</span>
                      <span class="text-cyber-accent">{{ config.memory.memories.length + config.memory.decisions.length + config.memory.lessons.length }} 条</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Preview -->
        <PreviewPanel 
          :content="previewContent"
          :current-tab="currentPreview"
          :tabs="previewTabs"
          @change-tab="currentPreview = $event"
          @copy-current="copyCurrentTab"
          @download="downloadCurrentTab"
        />
      </div>
    </main>

    <ToastNotification :show="toast.show" :message="toast.message" />
    
    <ConfirmDialog
      v-model:show="confirmDialog.show"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      confirm-text="确认重置"
      cancel-text="取消"
      @confirm="confirmDialog.onConfirm"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import Header from './components/layout/Header.vue'
import Navigation from './components/layout/Navigation.vue'
import IdentityConfig from './components/config/IdentityConfig.vue'
import SoulConfig from './components/config/SoulConfig.vue'
import AgentsConfig from './components/config/AgentsConfig.vue'
import UserConfig from './components/config/UserConfig.vue'
import MemoryConfig from './components/config/MemoryConfig.vue'
import PreviewPanel from './components/preview/PreviewPanel.vue'
import ToastNotification from './components/ui/ToastNotification.vue'
import TooltipIcon from './components/ui/TooltipIcon.vue'
import ConfirmDialog from './components/ui/ConfirmDialog.vue'

import { useI18n } from 'vue-i18n'

import { 
  presetEmojis, 
  roles, 
  personalityTraits as defaultTraits,
  skillCategories,
  previewTabs,
  defaultConfig 
} from './modules/config.js'

const { t } = useI18n()

const currentView = ref('identity')
const currentPreview = ref('identity')
const config = reactive(JSON.parse(JSON.stringify(defaultConfig)))

// 让 personalityTraits 响应式
const personalityTraits = reactive(JSON.parse(JSON.stringify(defaultTraits)))
const toast = reactive({ show: false, message: '' })

// 确认对话框状态
const confirmDialog = reactive({
  show: false,
  title: '',
  message: '',
  onConfirm: null
})

const showToast = (message) => {
  toast.message = message
  toast.show = true
  setTimeout(() => toast.show = false, 3000)
}

const updateIdentityConfig = (newConfig) => {
  Object.assign(config.identity, newConfig)
}

const toggleRole = (roleId) => {
  const index = config.identity.roles.indexOf(roleId)
  if (index > -1) {
    config.identity.roles.splice(index, 1)
  } else {
    config.identity.roles.push(roleId)
  }
}

const updateRoleDesc = (roleId, desc) => {
  config.identity.roleDescriptions[roleId] = desc
}

const updatePersonalityTraits = (newTraits) => {
  // 直接替换整个数组
  personalityTraits.splice(0, personalityTraits.length, ...newTraits)
}

const updateAgentsConfig = (newConfig) => {
  Object.assign(config.agents, newConfig)
}

const updateUserConfig = (newConfig) => {
  Object.assign(config.user, newConfig)
}

const updateMemoryConfig = (newConfig) => {
  Object.assign(config.memory, newConfig)
}

const getRoleNames = () => {
  return config.identity.roles.map(id => roles.find(r => r.id === id)?.name).filter(Boolean)
}

// 生成 IDENTITY.md
const generatedIdentity = computed(() => {
  const roleText = config.identity.roles.map(r => {
    const roleName = roles.find(x => x.id === r)?.name
    const description = config.identity.roleDescriptions[r] || ''
    return `\n- **${roleName}** — ${description}`
  }).join('')

  let result = '# IDENTITY.md\n\n'
  if (config.identity.name) result += `- **Name:** ${config.identity.name}\n`
  if (config.identity.creature) result += `- **Creature:** ${config.identity.creature}\n`
  if (config.identity.vibe) result += `- **Vibe:** ${config.identity.vibe}\n`
  if (config.identity.emoji) result += `- **Emoji:** ${config.identity.emoji}\n`
  
  if (roleText) {
    result += `\n## 角色定位${roleText}`
  }
  
  return result || '# IDENTITY.md\n\n（未配置）'
})

// 生成 SOUL.md
const generatedSoul = computed(() => {
  const traitDescriptions = personalityTraits
    .map(trait => {
      const name = trait.nameKey ? t(trait.nameKey, trait.name) : trait.name
      const desc = trait.descKey ? t(trait.descKey, trait.description) : trait.description
      return `- **${name}** — ${desc}（${trait.value}%）`
    })
    .join('\n')

  return `# SOUL.md\n\n## ${config.identity.name || t('default.name')} ${t('preview.styleTitle', '的风格')}\n\n${traitDescriptions || t('preview.notConfigured', '（未配置）')}`
})

// 生成 AGENTS.md
const generatedAgents = computed(() => {
  const hasRoleInfo = config.agents.role.identity || config.agents.role.specialties.length > 0 || config.agents.role.language
  const hasWorkflows = Object.values(config.agents.workflows).some(steps => steps.some(s => s))
  const hasFormats = config.agents.formats.length > 0 || config.agents.habits.length > 0
  const hasProhibitions = config.agents.prohibitions.some(p => p)
  const hasCommands = config.agents.commands.some(c => c.trigger && c.action)
  
  if (!hasRoleInfo && !hasWorkflows && !hasFormats && !hasProhibitions && !hasCommands) {
    return '# AGENTS.md\n\n（未配置）'
  }
  
  const workflowText = Object.entries(config.agents.workflows)
    .filter(([_, steps]) => steps.some(s => s))
    .map(([key, steps]) => {
      const name = key === 'code' ? '代码开发' : key === 'research' ? '研究任务' : '系统运维'
      const stepList = steps.filter(s => s).map((s, i) => `${i + 1}. ${s}`).join('\n   ')
      return `### ${name}\n${stepList}`
    }).join('\n\n')
  
  const prohibitionText = config.agents.prohibitions
    .filter(p => p)
    .map(p => `- ${p}`)
    .join('\n')
  
  const commandText = config.agents.commands
    .filter(c => c.trigger && c.action)
    .map(c => `- ${c.trigger}: ${c.action}`)
    .join('\n')

  let result = '# AGENTS.md\n\n'
  
  if (hasRoleInfo) {
    result += `## 角色定位\n`
    if (config.agents.role.identity) result += `- **身份**: ${config.agents.role.identity}\n`
    if (config.agents.role.specialties.length > 0) result += `- **专长**: ${config.agents.role.specialties.join('、')}\n`
    if (config.agents.role.language) result += `- **语言**: ${config.agents.role.language}\n`
    result += '\n'
  }
  
  if (hasWorkflows) {
    result += `## 工作方式\n${workflowText}\n\n`
  }
  
  if (hasFormats) {
    result += `## 回答风格\n`
    if (config.agents.formats.length > 0) {
      result += `### 格式要求\n${config.agents.formats.map(f => `- ${f}`).join('\n')}\n\n`
    }
    if (config.agents.habits.length > 0) {
      result += `### 语言习惯\n${config.agents.habits.map(h => `- ${h}`).join('\n')}\n\n`
    }
  }
  
  if (hasProhibitions) {
    result += `## 禁止事项\n${prohibitionText}\n\n`
  }
  
  if (hasCommands) {
    result += `## 特殊指令\n${commandText}`
  }

  return result
})

// 生成 USER.md
const generatedUser = computed(() => {
  const hasBasicInfo = config.user.basic.name || config.user.basic.occupation || config.user.basic.company
  const hasTech = Object.values(config.user.tech).some(arr => arr.length > 0)
  
  if (!hasBasicInfo && !hasTech) return '# USER.md\n\n（未配置）'
  
  const techText = Object.entries(config.user.tech)
    .filter(([key, _]) => key !== 'other')
    .map(([key, list]) => {
      const name = key === 'proficient' ? '熟练技术' : key === 'learning' ? '学习中' : '不熟悉'
      if (list.length === 0) return null
      return `### ${name}\n${list.map(t => `- ${t}`).join('\n')}`
    })
    .filter(Boolean)
    .join('\n\n')
  
  const commPrefs = Object.entries(config.user.communication)
    .filter(([_, v]) => v)
    .map(([k, _]) => {
      const labels = {
        conclusionFirst: '先给结论，再展开解释',
        codeExamples: '代码示例比文字描述更有帮助',
        reasoning: '重要决策需要原因说明',
        casual: '不喜欢过于正式的语言',
        detailed: '偏好详细的解释'
      }
      return `- ${labels[k]}`
    }).join('\n')

  let result = '# USER.md\n\n'
  
  if (hasBasicInfo) {
    result += `## 基本信息\n`
    if (config.user.basic.name) result += `- **姓名**: ${config.user.basic.name}\n`
    if (config.user.basic.occupation) result += `- **职业**: ${config.user.basic.occupation}\n`
    if (config.user.basic.company) result += `- **公司**: ${config.user.basic.company}\n`
    if (config.user.basic.experience) result += `- **工作年限**: ${config.user.basic.experience}\n`
    result += '\n'
  }
  
  if (hasTech) {
    result += `## 技术背景\n${techText}\n\n`
  }
  
  const prioritiesText = config.user.priorities.filter(p => p).map((p, i) => `${i + 1}. ${p}`).join('\n')
  
  const projectInfo = []
  if (config.user.project.name) projectInfo.push(`- **名称**: ${config.user.project.name}`)
  if (config.user.project.stack) projectInfo.push(`- **技术栈**: ${config.user.project.stack}`)
  if (config.user.project.teamSize) projectInfo.push(`- **团队规模**: ${config.user.project.teamSize}`)
  if (config.user.project.status) projectInfo.push(`- **状态**: ${config.user.project.status}`)

  result += `## 工作习惯\n### 时间安排\n- 工作时间: ${config.user.workSchedule.start} - ${config.user.workSchedule.end} (${config.user.workSchedule.timezone})\n\n`
  
  if (commPrefs) {
    result += `### 沟通偏好\n${commPrefs}\n\n`
  }
  
  if (prioritiesText) {
    result += `### 任务优先级\n${prioritiesText}\n\n`
  }
  
  if (projectInfo.length > 0) {
    result += `## 项目信息\n${projectInfo.join('\n')}`
  }

  return result
})

// 生成 MEMORY.md
const generatedMemory = computed(() => {
  const hasContent = config.memory.memories.length > 0 ||
    config.memory.decisions.length > 0 ||
    config.memory.lessons.length > 0 ||
    config.memory.projectContext ||
    config.memory.preferences.length > 0 ||
    config.memory.security.length > 0
  
  if (!hasContent) return '# MEMORY.md\n\n（未配置）'
  
  let result = '# MEMORY.md\n\n'
  
  // 重要记忆
  if (config.memory.memories.some(m => m)) {
    result += '## 重要记忆\n\n'
    config.memory.memories.filter(m => m).forEach((memory, i) => {
      result += `${i + 1}. ${memory}\n`
    })
    result += '\n'
  }
  
  // 决策记录
  if (config.memory.decisions.some(d => d.title || d.reason)) {
    result += '## 决策记录\n\n'
    config.memory.decisions.filter(d => d.title || d.reason).forEach((decision, i) => {
      result += `### ${decision.title || '未命名决策'}\n${decision.reason || '未记录原因'}\n\n`
    })
  }
  
  // 经验教训
  if (config.memory.lessons.some(l => l)) {
    result += '## 经验教训\n\n'
    config.memory.lessons.filter(l => l).forEach((lesson, i) => {
      result += `- ${lesson}\n`
    })
    result += '\n'
  }
  
  // 项目上下文
  if (config.memory.projectContext) {
    result += '## 项目上下文\n\n'
    result += config.memory.projectContext + '\n\n'
  }
  
  // 个人偏好
  if (config.memory.preferences.some(p => p.key || p.value)) {
    result += '## 个人偏好\n\n'
    config.memory.preferences.filter(p => p.key || p.value).forEach(pref => {
      result += `- **${pref.key || '未命名'}**: ${pref.value || '未指定'}\n`
    })
    result += '\n'
  }
  
  // 安全提醒
  if (config.memory.security.some(s => s)) {
    result += '## 安全提醒\n\n'
    config.memory.security.filter(s => s).forEach((reminder, i) => {
      result += `- ⚠️ ${reminder}\n`
    })
    result += '\n'
  }
  
  return result
})

// 生成技能安装提示词
const generatedSkillsPrompt = computed(() => {
  if (config.skills.length === 0) {
    return '# Skills 安装提示\n\n（未选择任何技能）'
  }
  
  const skillNames = config.skills.map(id => {
    const skill = skillCategories.find(c => c.id === id)
    return skill ? skill.name : id
  })
  
  return `# Skills 安装提示

请帮我安装以下 skills：

\`\`\`
${skillNames.join('\n')}
\`\`\`

安装命令：
\`\`\`bash
${config.skills.map(id => `openclaw skill install ${id}`).join('\n')}
\`\`\``
})

const previewContent = computed(() => {
  switch (currentPreview.value) {
    case 'identity': return generatedIdentity.value
    case 'soul': return generatedSoul.value
    case 'agents': return generatedAgents.value
    case 'user': return generatedUser.value
    case 'memory': return generatedMemory.value
    case 'skills': return generatedSkillsPrompt.value
    default: return `${generatedIdentity.value}\n\n---\n\n${generatedSoul.value}\n\n---\n\n${generatedAgents.value}\n\n---\n\n${generatedUser.value}\n\n---\n\n${generatedMemory.value}\n\n---\n\n${generatedSkillsPrompt.value}`
  }
})

const exportAsMarkdown = () => {
  const blob = new Blob([previewContent.value], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'clawsoul-config.md'
  a.click()
  URL.revokeObjectURL(url)
  showToast('配置文件已下载！')
}

const copyToClipboard = async () => {
  // 始终复制完整配置
  const fullContent = `${generatedIdentity.value}\n\n---\n\n${generatedSoul.value}\n\n---\n\n${generatedAgents.value}\n\n---\n\n${generatedUser.value}\n\n---\n\n${generatedMemory.value}`
  await doCopy(fullContent, '已复制完整配置到剪贴板！')
}

const copyCurrentTab = async () => {
  // 根据当前选中的标签页复制对应内容
  let content = ''
  let message = ''
  
  switch (currentPreview.value) {
    case 'identity':
      content = generatedIdentity.value
      message = '已复制 IDENTITY 到剪贴板！'
      break
    case 'soul':
      content = generatedSoul.value
      message = '已复制 SOUL 到剪贴板！'
      break
    case 'agents':
      content = generatedAgents.value
      message = '已复制 AGENTS 到剪贴板！'
      break
    case 'user':
      content = generatedUser.value
      message = '已复制 USER 到剪贴板！'
      break
    case 'memory':
      content = generatedMemory.value
      message = '已复制 MEMORY 到剪贴板！'
      break
    case 'skills':
      content = generatedSkillsPrompt.value
      message = '已复制 Skills 提示词到剪贴板！'
      break
    default:
      // 完整模式
      content = `${generatedIdentity.value}\n\n---\n\n${generatedSoul.value}\n\n---\n\n${generatedAgents.value}\n\n---\n\n${generatedUser.value}\n\n---\n\n${generatedMemory.value}\n\n---\n\n${generatedSkillsPrompt.value}`
      message = '已复制完整配置到剪贴板！'
  }
  
  await doCopy(content, message)
}

// 下载当前标签页的 Markdown
const downloadCurrentTab = (tab) => {
  let content = ''
  let filename = ''
  
  switch (tab) {
    case 'identity':
      content = generatedIdentity.value
      filename = 'IDENTITY.md'
      break
    case 'soul':
      content = generatedSoul.value
      filename = 'SOUL.md'
      break
    case 'agents':
      content = generatedAgents.value
      filename = 'AGENTS.md'
      break
    case 'user':
      content = generatedUser.value
      filename = 'USER.md'
      break
    case 'memory':
      content = generatedMemory.value
      filename = 'MEMORY.md'
      break
    case 'skills':
      content = generatedSkillsPrompt.value
      filename = 'skills-install.md'
      break
    default:
      // 完整模式
      content = `${generatedIdentity.value}\n\n---\n\n${generatedSoul.value}\n\n---\n\n${generatedAgents.value}\n\n---\n\n${generatedUser.value}\n\n---\n\n${generatedMemory.value}\n\n---\n\n${generatedSkillsPrompt.value}`
      filename = 'clawsoul-config.md'
  }
  
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  showToast(`${filename} 已下载！`)
}

const doCopy = async (text, successMessage) => {
  // 尝试使用现代 API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      showToast(successMessage)
      return
    } catch (err) {
      console.log('Clipboard API failed, trying fallback')
    }
  }
  
  // 降级方案：使用 textarea 复制
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textarea)
    
    if (successful) {
      showToast(successMessage)
    } else {
      showToast('复制失败，请手动复制')
    }
  } catch (err) {
    showToast('复制失败，请手动复制')
    console.error('Copy failed:', err)
  }
}

// 处理视图切换，同步更新预览标签
const handleViewChange = (view) => {
  currentView.value = view
  
  // 映射视图到预览标签
  const viewToPreview = {
    'identity': 'identity',
    'soul': 'soul',
    'agents': 'agents',
    'user': 'user',
    'memory': 'memory',
    'skills': 'skills'
  }
  
  // 如果切换到可映射的视图，同步切换预览
  if (viewToPreview[view]) {
    currentPreview.value = viewToPreview[view]
  }
}

const resetConfig = () => {
  confirmDialog.title = '重置配置'
  confirmDialog.message = '确定要重置所有配置吗？此操作不可恢复，所有已填写的配置将被清空。'
  confirmDialog.onConfirm = () => {
    Object.assign(config, JSON.parse(JSON.stringify(defaultConfig)))
    // 重置 personalityTraits
    const newTraits = JSON.parse(JSON.stringify(defaultTraits))
    personalityTraits.forEach((trait, index) => {
      trait.value = newTraits[index].value
    })
    currentView.value = 'identity'
    currentPreview.value = 'identity'
    showToast('配置已重置')
  }
  confirmDialog.show = true
}
</script>

<style>
.skill-category-title {
  background-color: rgba(99, 102, 241, 0.05);
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
}

[data-theme="light"] .skill-category-title {
  background-color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(99, 102, 241, 0.15);
}

.skill-item {
  border: 1px solid var(--border-color);
}

.skill-item-inactive {
  background-color: transparent;
}

.skill-item-inactive:hover {
  border-color: var(--accent-primary);
}

.skill-item-active {
  background-color: rgba(0, 212, 255, 0.05);
  border-color: rgba(0, 212, 255, 0.3);
}

[data-theme="light"] .skill-item-active {
  background-color: rgba(8, 145, 178, 0.05);
  border-color: rgba(8, 145, 178, 0.25);
}

.skill-checkbox {
  border-color: var(--border-color);
  accent-color: var(--accent-primary);
}

.skill-recommended {
  background-color: rgba(0, 212, 255, 0.15);
  color: #00d4ff;
}

[data-theme="light"] .skill-recommended {
  background-color: rgba(8, 145, 178, 0.12);
  color: #0891b2;
}
</style>