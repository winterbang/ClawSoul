import { computed } from 'vue'
import { roles, skillCategories } from '../modules/config.js'

/**
 * 预览生成 Composable
 * @param {{
 *   config: import('vue').UnwrapNestedRefs<import('../types').AppConfig>,
 *   personalityTraits: import('vue').UnwrapNestedRefs<import('../types').PersonalityTrait[]>
 * }} params
 * @returns {{
 *   generatedIdentity: import('vue').ComputedRef<string>,
 *   generatedSoul: import('vue').ComputedRef<string>,
 *   generatedAgents: import('vue').ComputedRef<string>,
 *   generatedUser: import('vue').ComputedRef<string>,
 *   generatedMemory: import('vue').ComputedRef<string>,
 *   generatedSkillsPrompt: import('vue').ComputedRef<string>
 * }}
 */
export function usePreview({ config, personalityTraits }) {
  /**
   * 获取角色名称列表
   * @returns {string[]}
   */
  const getRoleNames = () => {
    return config.identity.roles
      .map(id => roles.find(r => r.id === id)?.name)
      .filter(Boolean)
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
      .map(t => `- **${t.name}** — ${t.description}（${t.value}%）`)
      .join('\n')

    return `# SOUL.md\n\n## ${config.identity.name || 'AI'} 的风格\n\n${traitDescriptions || '（未配置）'}`
  })

  // 生成 AGENTS.md
  const generatedAgents = computed(() => {
    const hasRoleInfo = config.agents.role.identity || 
      config.agents.role.specialties.length > 0 || 
      config.agents.role.language
    const hasWorkflows = Object.values(config.agents.workflows)
      .some(steps => steps.some(s => s))
    const hasFormats = config.agents.formats.length > 0 || 
      config.agents.habits.length > 0
    const hasProhibitions = config.agents.prohibitions.some(p => p)
    const hasCommands = config.agents.commands.some(c => c.trigger && c.action)
    
    if (!hasRoleInfo && !hasWorkflows && !hasFormats && 
        !hasProhibitions && !hasCommands) {
      return '# AGENTS.md\n\n（未配置）'
    }
    
    const workflowText = Object.entries(config.agents.workflows)
      .filter(([_, steps]) => steps.some(s => s))
      .map(([key, steps]) => {
        const name = key === 'code' ? '代码开发' : 
          key === 'research' ? '研究任务' : '系统运维'
        const stepList = steps.filter(s => s)
          .map((s, i) => `${i + 1}. ${s}`)
          .join('\n   ')
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
      if (config.agents.role.identity) {
        result += `- **身份**: ${config.agents.role.identity}\n`
      }
      if (config.agents.role.specialties.length > 0) {
        result += `- **专长**: ${config.agents.role.specialties.join('、')}\n`
      }
      if (config.agents.role.language) {
        result += `- **语言**: ${config.agents.role.language}\n`
      }
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
    const hasBasicInfo = config.user.basic.name || 
      config.user.basic.occupation || 
      config.user.basic.company
    const hasTech = Object.values(config.user.tech)
      .some(arr => arr.length > 0)
    
    if (!hasBasicInfo && !hasTech) return '# USER.md\n\n（未配置）'
    
    const techText = Object.entries(config.user.tech)
      .filter(([key, _]) => key !== 'other')
      .map(([key, list]) => {
        const name = key === 'proficient' ? '熟练技术' : 
          key === 'learning' ? '学习中' : '不熟悉'
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
      if (config.user.basic.name) {
        result += `- **姓名**: ${config.user.basic.name}\n`
      }
      if (config.user.basic.occupation) {
        result += `- **职业**: ${config.user.basic.occupation}\n`
      }
      if (config.user.basic.company) {
        result += `- **公司**: ${config.user.basic.company}\n`
      }
      if (config.user.basic.experience) {
        result += `- **工作年限**: ${config.user.basic.experience}\n`
      }
      result += '\n'
    }
    
    if (hasTech) {
      result += `## 技术背景\n${techText}\n\n`
    }
    
    const prioritiesText = config.user.priorities
      .filter(p => p)
      .map((p, i) => `${i + 1}. ${p}`)
      .join('\n')
    
    const projectInfo = []
    if (config.user.project.name) {
      projectInfo.push(`- **名称**: ${config.user.project.name}`)
    }
    if (config.user.project.stack) {
      projectInfo.push(`- **技术栈**: ${config.user.project.stack}`)
    }
    if (config.user.project.teamSize) {
      projectInfo.push(`- **团队规模**: ${config.user.project.teamSize}`)
    }
    if (config.user.project.status) {
      projectInfo.push(`- **状态**: ${config.user.project.status}`)
    }

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
      config.memory.memories.filter(m => m)
        .forEach((memory, i) => {
          result += `${i + 1}. ${memory}\n`
        })
      result += '\n'
    }
    
    // 决策记录
    if (config.memory.decisions.some(d => d.title || d.reason)) {
      result += '## 决策记录\n\n'
      config.memory.decisions
        .filter(d => d.title || d.reason)
        .forEach((decision) => {
          result += `### ${decision.title || '未命名决策'}\n${decision.reason || '未记录原因'}\n\n`
        })
    }
    
    // 经验教训
    if (config.memory.lessons.some(l => l)) {
      result += '## 经验教训\n\n'
      config.memory.lessons.filter(l => l)
        .forEach((lesson) => {
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
      config.memory.preferences
        .filter(p => p.key || p.value)
        .forEach(pref => {
          result += `- **${pref.key || '未命名'}**: ${pref.value || '未指定'}\n`
        })
      result += '\n'
    }
    
    // 安全提醒
    if (config.memory.security.some(s => s)) {
      result += '## 安全提醒\n\n'
      config.memory.security.filter(s => s)
        .forEach((reminder) => {
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

  return {
    generatedIdentity,
    generatedSoul,
    generatedAgents,
    generatedUser,
    generatedMemory,
    generatedSkillsPrompt,
    getRoleNames
  }
}
