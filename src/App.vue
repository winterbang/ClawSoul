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
            />

            <div v-if="currentView === 'skills'" class="glass rounded-xl p-6 space-y-6">
              <h2 class="text-xl font-semibold flex items-center gap-2">
                <span class="text-cyber-pink">⚡</span>
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
                      <span>名字：</span>
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
import PreviewPanel from './components/PreviewPanel.vue'
import ToastNotification from './components/ToastNotification.vue'

import { 
  presetEmojis, 
  roles, 
  personalityTraits,
  skillCategories,
  previewTabs,
  defaultConfig 
} from './modules/config.js'

const currentView = ref('identity')
const currentPreview = ref('identity')
const config = reactive(JSON.parse(JSON.stringify(defaultConfig)))
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

const getRoleNames = () => {
  return config.identity.roles.map(id => roles.find(r => r.id === id)?.name).filter(Boolean)
}

const generatedIdentity = computed(() => {
  const roleText = config.identity.roles.map(r => {
    const roleName = roles.find(x => x.id === r)?.name
    const description = config.identity.roleDescriptions[r] || ''
    return `\n- **${roleName}** — ${description}`
  }).join('')

  return `# IDENTITY.md\n\n- **Name:** ${config.identity.name}\n- **Creature:** ${config.identity.creature}\n- **Vibe:** ${config.identity.vibe}\n- **Emoji:** ${config.identity.emoji}\n\n## 角色定位${roleText}`
})

const generatedSoul = computed(() => {
  const traitDescriptions = personalityTraits
    .filter(t => t.value >= 60)
    .map(t => `- **${t.name}** — ${t.description}（${t.value}%）`)
    .join('\n')

  return `# SOUL.md\n\n## ${config.identity.name} 的风格\n\n${traitDescriptions}`
})

const generatedMemory = computed(() => {
  const skillList = config.skills.map(s => {
    const skill = skillCategories.flatMap(c => c.skills).find(x => x.id === s)
    return skill ? `- **${skill.name}**: ${skill.description}` : `- ${s}`
  }).join('\n')

  return `# MEMORY.md\n\n## 已安装 Skills\n\n${skillList}`
})

const previewContent = computed(() => {
  switch (currentPreview.value) {
    case 'identity': return generatedIdentity.value
    case 'soul': return generatedSoul.value
    case 'memory': return generatedMemory.value
    default: return `${generatedIdentity.value}\n\n---\n\n${generatedSoul.value}\n\n---\n\n${generatedMemory.value}`
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
  try {
    await navigator.clipboard.writeText(previewContent.value)
    showToast('已复制到剪贴板！')
  } catch (err) {
    showToast('复制失败，请手动复制')
  }
}

const resetConfig = () => {
  if (confirm('确定要重置所有配置吗？')) {
    Object.assign(config, JSON.parse(JSON.stringify(defaultConfig)))
    currentView.value = 'identity'
    showToast('配置已重置')
  }
}
</script>