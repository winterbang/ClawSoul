import { computed } from 'vue'

/**
 * 导出功能 Composable
 * @param {{
 *   generatedIdentity: import('vue').ComputedRef<string>,
 *   generatedSoul: import('vue').ComputedRef<string>,
 *   generatedAgents: import('vue').ComputedRef<string>,
 *   generatedUser: import('vue').ComputedRef<string>,
 *   generatedMemory: import('vue').ComputedRef<string>,
 *   generatedSkillsPrompt: import('vue').ComputedRef<string>
 * }} generators
 * @returns {{
 *   fullContent: import('vue').ComputedRef<string>,
 *   getContentByTab: (tab: string) => string,
 *   getFileNameByTab: (tab: string) => string,
 *   downloadContent: (content: string, filename: string) => void,
 *   downloadTabContent: (tab: string) => void
 * }}
 */
export function useExport(generators) {
  const {
    generatedIdentity,
    generatedSoul,
    generatedAgents,
    generatedUser,
    generatedMemory,
    generatedSkillsPrompt
  } = generators

  /**
   * 完整配置内容
   */
  const fullContent = computed(() => {
    return `${generatedIdentity.value}\n\n---\n\n${generatedSoul.value}\n\n---\n\n${generatedAgents.value}\n\n---\n\n${generatedUser.value}\n\n---\n\n${generatedMemory.value}\n\n---\n\n${generatedSkillsPrompt.value}`
  })

  /**
   * 根据标签获取对应内容
   * @param {string} tab
   * @returns {string}
   */
  const getContentByTab = (tab) => {
    switch (tab) {
      case 'identity':
        return generatedIdentity.value
      case 'soul':
        return generatedSoul.value
      case 'agents':
        return generatedAgents.value
      case 'user':
        return generatedUser.value
      case 'memory':
        return generatedMemory.value
      case 'skills':
        return generatedSkillsPrompt.value
      case 'full':
      default:
        return fullContent.value
    }
  }

  /**
   * 根据标签获取文件名
   * @param {string} tab
   * @returns {string}
   */
  const getFileNameByTab = (tab) => {
    const names = {
      identity: 'IDENTITY.md',
      soul: 'SOUL.md',
      agents: 'AGENTS.md',
      user: 'USER.md',
      memory: 'MEMORY.md',
      skills: 'skills-install.md',
      full: 'clawsoul-config.md'
    }
    return names[tab] || 'config.md'
  }

  /**
   * 下载内容到文件
   * @param {string} content
   * @param {string} filename
   */
  const downloadContent = (content, filename) => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * 下载指定标签页的内容
   * @param {string} tab
   */
  const downloadTabContent = (tab) => {
    const content = getContentByTab(tab)
    const filename = getFileNameByTab(tab)
    downloadContent(content, filename)
  }

  return {
    fullContent,
    getContentByTab,
    getFileNameByTab,
    downloadContent,
    downloadTabContent
  }
}
