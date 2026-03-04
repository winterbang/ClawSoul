// config.js - 配置数据模块

export const presetEmojis = ['🐴', '🤖', '🐱', '🦊', '🐼', '🦄', '🐉', '👻', '✨', '🌟']

export const roles = [
  { id: 'companion', name: '小伙伴' },
  { id: 'friend', name: '朋友' },
  { id: 'teacher', name: '老师' },
  { id: 'assistant', name: '助手' },
  { id: 'advisor', name: '顾问' },
  { id: 'collaborator', name: '搭档' },
]

// 人格特质 - 使用键名，在组件中通过 i18n 翻译
export const personalityTraits = [
  { id: 'helpful', name: '真诚帮助', nameKey: 'soul.traitHelpful', value: 80, description: '少说套话，多做实事', descKey: 'soul.traitHelpfulDesc' },
  { id: 'opinionated', name: '有主见', nameKey: 'soul.traitOpinionated', value: 70, description: '敢于表达不同意见', descKey: 'soul.traitOpinionatedDesc' },
  { id: 'resourceful', name: '先尝试', nameKey: 'soul.traitResourceful', value: 75, description: '先自己探索再问人', descKey: 'soul.traitResourcefulDesc' },
  { id: 'trustworthy', name: '可信赖', nameKey: 'soul.traitTrustworthy', value: 90, description: '谨慎处理外部操作', descKey: 'soul.traitTrustworthyDesc' },
  { id: 'respectful', name: '尊重隐私', nameKey: 'soul.traitRespectful', value: 85, description: '像客人一样尊重主人', descKey: 'soul.traitRespectfulDesc' },
]

export const skillCategories = [
  {
    id: 'search',
    nameKey: 'skillCategories.search',
    skills: [
      { id: 'searxng', name: 'searxng', description: '隐私搜索，本地 SearXNG 实例', descriptionKey: 'skills.searxngDesc', recommended: true },
      { id: 'web_search', name: 'web_search', description: 'Brave 搜索 API', descriptionKey: 'skills.webSearchDesc' },
    ]
  },
  {
    id: 'investment',
    nameKey: 'skillCategories.investment',
    skills: [
      { id: 'a-stock-monitor', name: 'a-stock-monitor', description: 'A股量化监控系统', descriptionKey: 'skills.aStockMonitorDesc' },
      { id: 'astock-research', name: 'astock-research', description: 'A股深度投研分析', descriptionKey: 'skills.astockResearchDesc' },
      { id: 'buffett-analysis', name: 'buffett-analysis', description: '巴菲特视角投资分析', descriptionKey: 'skills.buffettAnalysisDesc' },
      { id: 'astock-daily', name: 'astock-daily', description: '每日A股精选', descriptionKey: 'skills.astockDailyDesc' },
    ]
  },
  {
    id: 'dev',
    nameKey: 'skillCategories.dev',
    skills: [
      { id: 'opencode', name: 'opencode', description: 'AI 编程助手', descriptionKey: 'skills.opencodeDesc', recommended: true },
      { id: 'code-simplifier', name: 'code-simplifier', description: '代码重构简化', descriptionKey: 'skills.codeSimplifierDesc' },
      { id: 'frontend-design', name: 'frontend-design', description: '前端界面设计', descriptionKey: 'skills.frontendDesignDesc' },
      { id: 'wechat-miniprogram', name: 'wechat-miniprogram', description: '微信小程序 CI/CD', descriptionKey: 'skills.wechatMiniprogramDesc' },
    ]
  },
  {
    id: 'doc',
    nameKey: 'skillCategories.doc',
    skills: [
      { id: 'document-skills', name: 'document-skills', description: 'DOCX/PDF 处理', descriptionKey: 'skills.documentSkillsDesc' },
    ]
  },
  {
    id: 'utility',
    nameKey: 'skillCategories.utility',
    skills: [
      { id: 'find-skill', name: 'find-skill', description: 'Skill 发现搜索', descriptionKey: 'skills.findSkillDesc', recommended: true },
      { id: 'ralph-loop', name: 'ralph-loop', description: '迭代开发工作流', descriptionKey: 'skills.ralphLoopDesc' },
      { id: 'skill-creator', name: 'skill-creator', description: '创建新 Skill', descriptionKey: 'skills.skillCreatorDesc' },
    ]
  },
]

export const previewTabs = [
  { id: 'identity', nameKey: 'preview.identity' },
  { id: 'soul', nameKey: 'preview.soul' },
  { id: 'agents', nameKey: 'preview.agents' },
  { id: 'user', nameKey: 'preview.user' },
  { id: 'memory', nameKey: 'preview.memory' },
  { id: 'skills', nameKey: 'preview.skills' },
  { id: 'full', nameKey: 'preview.full' },
]

// 获取默认配置（支持国际化）
export const getDefaultConfig = (t) => ({
  identity: {
    name: t('default.name'),
    creature: t('default.creature'),
    vibe: t('default.vibe'),
    emoji: '🐴',
    roles: ['companion', 'friend', 'teacher'],
    roleDescriptions: {
      companion: t('default.roleDesc.companion'),
      friend: t('default.roleDesc.friend'),
      teacher: t('default.roleDesc.teacher'),
      assistant: t('default.roleDesc.assistant'),
      advisor: t('default.roleDesc.advisor'),
      collaborator: t('default.roleDesc.collaborator'),
    },
  },
  soul: {
    traits: {},
    values: '',
  },
  // AGENTS.md 配置
  agents: {
    role: {
      identity: '',
      specialties: [],
      language: '中文'
    },
    workflows: {
      code: [t('agents.workflow.step1'), t('agents.workflow.step2'), t('agents.workflow.step3'), t('agents.workflow.step4'), t('agents.workflow.step5')],
      research: [t('agents.workflow.research1'), t('agents.workflow.research2'), t('agents.workflow.research3'), t('agents.workflow.research4')],
      ops: [t('agents.workflow.ops1'), t('agents.workflow.ops2'), t('agents.workflow.ops3'), t('agents.workflow.ops4')]
    },
    formats: [t('agents.format.default1'), t('agents.format.default2'), t('agents.format.default3')],
    habits: [t('agents.habit.default1'), t('agents.habit.default2'), t('agents.habit.default3')],
    prohibitions: [
      t('agents.prohibition.default1'),
      t('agents.prohibition.default2'),
      t('agents.prohibition.default3')
    ],
    commands: [
      { trigger: '/review', action: t('agents.command.review') },
      { trigger: '/explain', action: t('agents.command.explain') },
      { trigger: '/debug', action: t('agents.command.debug') }
    ]
  },
  // USER.md 配置
  user: {
    basic: {
      name: '',
      occupation: '',
      company: '',
      experience: ''
    },
    tech: {
      languages: [],
      frontend: [],
      backend: [],
      database: [],
      devops: []
    },
    workHabits: [],
    projects: []
  },
  // MEMORY.md 配置
  memory: {
    memories: [],
    decisions: [],
    lessons: [],
    projectContext: '',
    preferences: [],
    security: []
  },
  skills: ['searxng', 'opencode', 'find-skill'],
})

// 兼容旧代码的静态配置 - 使用硬编码中文默认值
export const defaultConfig = {
  identity: {
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
  },
  soul: {
    traits: {},
    values: '',
  },
  // AGENTS.md 配置
  agents: {
    role: {
      identity: '',
      specialties: [],
      language: '中文'
    },
    workflows: {
      code: ['理解需求', '设计方案', '编写代码', '测试验证', '文档更新'],
      research: ['收集信息', '分析总结', '提供来源', '输出报告'],
      ops: ['检查状态', '分析日志', '执行修复', '验证结果']
    },
    formats: ['使用Markdown格式', '代码块标注语言', '重要内容加粗'],
    habits: ['技术术语使用英文', '解释时使用类比', '先给结论再展开'],
    prohibitions: [
      '不要猜测用户意图，不确定时询问',
      '不要执行可能有破坏性的操作而不确认',
      '不要泄露用户的敏感信息'
    ],
    commands: [
      { trigger: '/review', action: '审查代码并提供改进建议' },
      { trigger: '/explain', action: '解释代码或概念，确保用户理解' },
      { trigger: '/debug', action: '帮助排查问题，分析错误原因' }
    ]
  },
  // USER.md 配置
  user: {
    basic: {
      name: '',
      occupation: '',
      company: '',
      experience: ''
    },
    tech: {
      languages: [],
      frontend: [],
      backend: [],
      database: [],
      devops: []
    },
    workHabits: [],
    projects: []
  },
  // MEMORY.md 配置
  memory: {
    memories: [],
    decisions: [],
    lessons: [],
    projectContext: '',
    preferences: [],
    security: []
  },
  skills: ['searxng', 'opencode', 'find-skill'],
}
