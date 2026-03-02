<template>
  <div class="min-h-screen">
    <Header />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Left Panel: Configuration -->
        <div class="flex flex-col h-[calc(100vh-140px)]">
          <Navigation 
            :current-view="currentView"
            @change-view="currentView = $event"
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
                <h2 class="text-xl font-semibold flex items-center gap-2">
                  <span class="text-cyber-pink">⚡</span>
                  技能选择
                </h2>
                <TooltipIcon position="right">
                  选择你需要的 Skills（功能扩展）。生成配置后，可以将列表复制到 OpenClaw 中一键安装。
                </TooltipIcon>
              </div>

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
                        class="mt-1 w-4 h-4 rounded border-cyber-600 text-cyber-accent"
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

            <div v-if="currentView === 'export'" class="glass rounded-xl p-6 space-y-6">
              <h2 class="text-xl font-semibold flex items-center gap-2">
                <span class="text-green-400">⬇</span>
                导出配置
              </h2>

              <div class="space-y-4">
                <div class="p-4 bg-cyber-800/50 rounded-lg border border-cyber-600/30">
                  <h3 class="font-medium mb-3">配置摘要</h3>
                  <div class="text-sm text-gray-400 space-y-2">
                    <div class="flex justify-between">
                      <span>AI名字：</span>
                      <span class="text-cyber-accent">{{ config.identity.name || '未设置' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>角色：</span>
                      <span class="text-cyber-accent">{{ config.identity.roles.length ? getRoleNames().join('、') : '未选择' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>技能：</span>
                      <span class="text-cyber-accent">{{ config.skills.length }} 个</span>
                    </div>
                    <div class="flex justify-between">
                      <span>AGENTS：</span>
                      <span class="text-cyber-accent">{{ config.agents.role.identity || '未配置' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>USER：</span>
                      <span class="text-cyber-accent">{{ config.user.basic.name || '未配置' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>MEMORY：</span>
                      <span class="text-cyber-accent">{{ config.memory.memories.length + config.memory.decisions.length + config.memory.lessons.length }} 条</span>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <button @click="exportAsMarkdown" class="cyber-btn-primary">
                    下载 Markdown
                  </button>
                  <button @click="copyToClipboard" class="cyber-btn-secondary">
                    复制到剪贴板
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PreviewPanel 
          :content="previewContent"
          :current-tab="currentPreview"
          :tabs="previewTabs"
          @change-tab="currentPreview = $event"
          @copy-current="copyCurrentTab"
        />
      </div>
    </main>

    <ToastNotification :show="toast.show" :message="toast.message" />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import Header from './components/Layout/Header.vue'
import Navigation from './components/Layout/Navigation.vue'
import IdentityConfig from './components/config/IdentityConfig.vue'
import SoulConfig from './components/config/SoulConfig.vue'
import AgentsConfig from './components/config/AgentsConfig.vue'
import UserConfig from './components/config/UserConfig.vue'
import MemoryConfig from './components/config/MemoryConfig.vue'
import PreviewPanel from './components/PreviewPanel.vue'
import ToastNotification from './components/ToastNotification.vue'
import TooltipIcon from './components/TooltipIcon.vue'

import { 
  presetEmojis, 
  roles, 
  personalityTraits as defaultTraits,
  skillCategories,
  previewTabs,
  defaultConfig 
} from './modules/config.js'

const currentView = ref('identity')
const currentPreview = ref('identity')
const config = reactive(JSON.parse(JSON.stringify(defaultConfig)))

// 让 personalityTraits 响应式
const personalityTraits = reactive(JSON.parse(JSON.stringify(defaultTraits)))
const toast = reactive({ show: false, message: '' })

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

  return `# IDENTITY.md\n\n- **Name:** ${config.identity.name}\n- **Creature:** ${config.identity.creature}\n- **Vibe:** ${config.identity.vibe}\n- **Emoji:** ${config.identity.emoji}\n\n## 角色定位${roleText}`
})

// 生成 SOUL.md
const generatedSoul = computed(() => {
  const traitDescriptions = personalityTraits
    .map(t => `- **${t.name}** — ${t.description}（${t.value}%）`)
    .join('\n')

  return `# SOUL.md\n\n## ${config.identity.name} 的风格\n\n${traitDescriptions || '（未配置）'}`
})

// 生成 AGENTS.md
const generatedAgents = computed(() => {
  const hasRoleInfo = config.agents.role.identity || config.agents.role.specialties.length > 0
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
    result += `## 角色定位\n- **身份**: ${config.agents.role.identity || '未指定'}\n- **专长**: ${config.agents.role.specialties.join('、') || '未指定'}\n- **语言**: ${config.agents.role.language}\n\n`
  }
  
  if (hasWorkflows) {
    result += `## 工作方式\n${workflowText}\n\n`
  }
  
  if (hasFormats) {
    result += `## 回答风格\n### 格式要求\n${config.agents.formats.map(f => `- ${f}`).join('\n') || '未指定'}\n\n### 语言习惯\n${config.agents.habits.map(h => `- ${h}`).join('\n') || '未指定'}\n\n`
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
      return `### ${name}\n${list.map(t => `- ${t}`).join('\n') || '未指定'}`
    }).join('\n\n')
  
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
    result += `## 基本信息\n- **姓名**: ${config.user.basic.name || '未指定'}\n- **职业**: ${config.user.basic.occupation || '未指定'}\n- **公司**: ${config.user.basic.company || '未指定'}\n- **工作年限**: ${config.user.basic.experience || '未指定'}\n\n`
  }
  
  if (hasTech) {
    result += `## 技术背景\n${techText}\n\n`
  }
  
  result += `## 工作习惯\n### 时间安排\n- 工作时间: ${config.user.workSchedule.start} - ${config.user.workSchedule.end} (${config.user.workSchedule.timezone})\n\n### 沟通偏好\n${commPrefs || '未指定'}\n\n### 任务优先级\n${config.user.priorities.filter(p => p).map((p, i) => `${i + 1}. ${p}`).join('\n') || '未指定'}\n\n## 项目信息\n- **名称**: ${config.user.project.name || '未指定'}\n- **技术栈**: ${config.user.project.stack || '未指定'}\n- **团队规模**: ${config.user.project.teamSize || '未指定'}\n- **状态**: ${config.user.project.status || '未指定'}`

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

const previewContent = computed(() => {
  switch (currentPreview.value) {
    case 'identity': return generatedIdentity.value
    case 'soul': return generatedSoul.value
    case 'agents': return generatedAgents.value
    case 'user': return generatedUser.value
    case 'memory': return generatedMemory.value
    default: return `${generatedIdentity.value}\n\n---\n\n${generatedSoul.value}\n\n---\n\n${generatedAgents.value}\n\n---\n\n${generatedUser.value}\n\n---\n\n${generatedMemory.value}`
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
    default:
      // 完整模式
      content = `${generatedIdentity.value}\n\n---\n\n${generatedSoul.value}\n\n---\n\n${generatedAgents.value}\n\n---\n\n${generatedUser.value}\n\n---\n\n${generatedMemory.value}`
      message = '已复制完整配置到剪贴板！'
  }
  
  await doCopy(content, message)
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

const resetConfig = () => {
  if (confirm('确定要重置所有配置吗？')) {
    Object.assign(config, JSON.parse(JSON.stringify(defaultConfig)))
    // 重置 personalityTraits
    const newTraits = JSON.parse(JSON.stringify(defaultTraits))
    personalityTraits.forEach((trait, index) => {
      trait.value = newTraits[index].value
    })
    currentView.value = 'identity'
    showToast('配置已重置')
  }
}
</script>