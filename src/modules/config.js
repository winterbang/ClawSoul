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
      { id: 'searxng', name: 'searxng', descriptionKey: 'skills.searxngDesc', recommended: true },
      { id: 'web_search', name: 'web_search', descriptionKey: 'skills.webSearchDesc' },
    ]
  },
  {
    id: 'investment',
    nameKey: 'skillCategories.investment',
    skills: [
      { id: 'a-stock-monitor', name: 'a-stock-monitor', descriptionKey: 'skills.aStockMonitorDesc' },
      { id: 'astock-research', name: 'astock-research', descriptionKey: 'skills.astockResearchDesc' },
      { id: 'buffett-analysis', name: 'buffett-analysis', descriptionKey: 'skills.buffettAnalysisDesc' },
      { id: 'astock-daily', name: 'astock-daily', descriptionKey: 'skills.astockDailyDesc' },
    ]
  },
  {
    id: 'dev',
    nameKey: 'skillCategories.dev',
    skills: [
      { id: 'opencode', name: 'opencode', descriptionKey: 'skills.opencodeDesc', recommended: true },
      { id: 'code-simplifier', name: 'code-simplifier', descriptionKey: 'skills.codeSimplifierDesc' },
      { id: 'frontend-design', name: 'frontend-design', descriptionKey: 'skills.frontendDesignDesc' },
      { id: 'wechat-miniprogram', name: 'wechat-miniprogram', descriptionKey: 'skills.wechatMiniprogramDesc' },
    ]
  },
  {
    id: 'doc',
    nameKey: 'skillCategories.doc',
    skills: [
      { id: 'document-skills', name: 'document-skills', descriptionKey: 'skills.documentSkillsDesc' },
    ]
  },
  {
    id: 'utility',
    nameKey: 'skillCategories.utility',
    skills: [
      { id: 'find-skill', name: 'find-skill', descriptionKey: 'skills.findSkillDesc', recommended: true },
      { id: 'ralph-loop', name: 'ralph-loop', descriptionKey: 'skills.ralphLoopDesc' },
      { id: 'skill-creator', name: 'skill-creator', descriptionKey: 'skills.skillCreatorDesc' },
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

// 兼容旧代码的静态配置
export const defaultConfig = getDefaultConfig((key) => key)
