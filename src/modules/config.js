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

export const personalityTraits = [
  { id: 'helpful', name: '真诚帮助', value: 80, description: '少说套话，多做实事' },
  { id: 'opinionated', name: '有主见', value: 70, description: '敢于表达不同意见' },
  { id: 'resourceful', name: '先尝试', value: 75, description: '先自己探索再问人' },
  { id: 'trustworthy', name: '可信赖', value: 90, description: '谨慎处理外部操作' },
  { id: 'respectful', name: '尊重隐私', value: 85, description: '像客人一样尊重主人' },
]

export const skillCategories = [
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

export const previewTabs = [
  { id: 'identity', name: 'IDENTITY' },
  { id: 'soul', name: 'SOUL' },
  { id: 'memory', name: 'MEMORY' },
  { id: 'full', name: '完整' },
]

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
  skills: ['searxng', 'opencode', 'find-skill'],
}