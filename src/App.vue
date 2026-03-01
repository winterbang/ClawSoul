<script setup>
import { ref, computed, reactive } from 'vue'
import Header from './components/Layout/Header.vue'
import Navigation from './components/Layout/Navigation.vue'
import IdentityConfig from './components/config/IdentityConfig.vue'
import SoulConfig from './components/config/SoulConfig.vue'
import PreviewPanel from './components/PreviewPanel.vue'
import ToastNotification from './components/ToastNotification.vue'

const currentView = ref('identity')
const currentPreview = ref('identity')

// 数据导入
import { 
  presetEmojis, 
  roles, 
  personalityTraits,
  skillCategories,
  previewTabs,
  defaultConfig 
} from './modules/config.js'

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

  return `# IDENTITY.md

- **Name:** ${config.identity.name}
- **Creature:** ${config.identity.creature}
- **Vibe:** ${config.identity.vibe}
- **Emoji:** ${config.identity.emoji}

## 角色定位${roleText}`
})

const generatedSoul = computed(() => {
  const traitDescriptions = personalityTraits
    .filter(t => t.value >= 60)
    .map(t => `- **${t.name}** — ${t.description}（${t.value}%）`)
    .join('\n')

  return `# SOUL.md

## ${config.identity.name} 的风格

${traitDescriptions}`
})

const generatedMemory = computed(() => {
  const skillList = config.skills.map(s => {
    const skill = skillCategories.flatMap(c => c.skills).find(x => x.id === s)
    return skill ? `- **${skill.name}**: ${skill.description}` : `- ${s}`
  }).join('\n')

  return `# MEMORY.md

## 已安装 Skills

${skillList}`
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