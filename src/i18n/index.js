import { createI18n } from 'vue-i18n'

// 中文
const zh = {
  nav: {
    identity: '身份',
    soul: '人格',
    agents: '行为',
    user: '用户',
    memory: '记忆',
    skills: '技能',
    summary: '摘要',
    reset: '重置'
  },
  header: {
    title: 'ClawSoul',
    subtitle: '订制你的数字助手',
    official: '官网',
    docs: '文档'
  },
  identity: {
    title: '基础身份 IDENTITY',
    tooltip: '定义 AI 助手的基本身份信息：名字、形象、性格特点和角色定位。这是 AI 认识自己的"身份证"。',
    name: 'AI 名字',
    namePlaceholder: '例如：吉量',
    creature: '形象描述',
    creaturePlaceholder: '例如：传说中的吉量马 — 乘之寿千岁 🐴',
    vibe: '性格特点',
    vibePlaceholder: '例如：朴素、耐心、真诚',
    emoji: 'Emoji 标识',
    roles: '角色定位',
    rolesTooltip: '选择 AI 在与你互动时扮演的角色，可多选'
  },
  soul: {
    title: '人格特质 SOUL',
    tooltip: '定义 AI 的性格特点、核心价值观和行为风格。这决定了 AI 如何与你互动、表达观点和解决问题。',
    addTrait: '添加自定义特质',
    addDesc: '点击添加描述',
    delete: '删除'
  },
  agents: {
    title: '行为模式 AGENTS',
    tooltip: '定义 AI 的工作方式、行为规范和交互习惯。这决定了 AI 如何处理任务、响应请求和与你协作。',
    identity: '角色身份',
    identityPlaceholder: '例如：我是用户的 AI 助手，负责帮助完成各种任务...',
    workflow: '工作流程',
    workflowPlaceholder: '例如：\n1. 理解用户需求\n2. 提供解决方案\n3. 执行并反馈',
    format: '输出格式',
    formatPlaceholder: '例如：使用 Markdown 格式，代码块标注语言...',
    habits: '工作习惯',
    habitsPlaceholder: '例如：\n- 先理解再行动\n- 主动确认重要决策',
    prohibitions: '禁止事项',
    prohibitionsPlaceholder: '例如：\n- 不执行危险操作\n- 不泄露敏感信息',
    commands: '快捷指令',
    commandsPlaceholder: '例如：\n/status - 查看状态\n/clear - 清空对话'
  },
  user: {
    title: '用户画像 USER',
    tooltip: '告诉 AI 关于你的信息，帮助 AI 更好地理解和配合你。',
    basic: '基本信息',
    name: '称呼',
    namePlaceholder: '例如：小明',
    timezone: '时区',
    pronouns: '代词偏好',
    tech: '技术背景',
    techTooltip: '选择你熟悉的技术领域',
    proficient: '熟练',
    learning: '学习中',
    unfamiliar: '不熟悉',
    work: '工作习惯',
    workTooltip: '描述你的工作方式，帮助 AI 更好地配合',
    workPlaceholder: '例如：\n- 偏好简洁高效的沟通\n- 早上处理复杂任务',
    projects: '当前项目',
    projectsTooltip: '告诉 AI 你正在做什么，方便提供上下文相关的帮助',
    projectsPlaceholder: '例如：\n- 开发个人博客网站\n- 学习 Vue 3 + TypeScript'
  },
  memory: {
    title: '长期记忆 MEMORY',
    tooltip: '记录重要信息、决策、教训和偏好。这是 AI 的"笔记本"，帮助 AI 在多次对话中记住关键内容，提供更连贯的服务。',
    memories: '重要记忆',
    memoriesTooltip: '记录重要的对话、决策、关键信息',
    addMemory: '添加重要记忆',
    memoryPlaceholder: '例如：用户提到他的生日是3月15日',
    decisions: '决策记录',
    decisionsTooltip: '记录重要的决定及其原因',
    addDecision: '添加决策记录',
    title: '标题',
    reason: '原因',
    lessons: '经验教训',
    lessonsTooltip: '记录学到的教训，避免重复犯错',
    addLesson: '添加经验教训',
    lessonPlaceholder: '例如：不要在没有确认的情况下执行删除操作',
    project: '项目上下文',
    projectTooltip: '记录当前正在进行的项目相关信息',
    projectPlaceholder: '例如：\n- 正在开发电商平台重构项目\n- 技术栈：Next.js + Prisma\n- 预计Q2上线',
    preferences: '个人偏好',
    preferencesTooltip: '记录用户的喜好和偏好',
    addPreference: '添加偏好',
    key: '偏好项',
    value: '偏好值',
    security: '安全提醒',
    securityTooltip: '记录安全相关的注意事项',
    addSecurity: '添加安全提醒',
    securityPlaceholder: '例如：不要在群聊中分享 API Key'
  },
  skills: {
    title: '技能选择',
    tooltip: '选择你需要的 Skills（功能扩展）。生成配置后，可以将列表复制到 OpenClaw 中一键安装。',
    recommended: '推荐'
  },
  preview: {
    title: '实时预览',
    download: '下载 Markdown',
    copy: '复制当前配置'
  },
  export: {
    summary: '配置摘要',
    name: 'AI名字',
    role: '角色',
    traits: '人格特质',
    agents: '行为模式',
    user: '用户画像',
    memories: '记忆条目',
    skills: '技能',
    notSet: '未设置',
    configured: '已配置',
    notConfigured: '未配置',
    items: '项'
  },
  confirm: {
    title: '重置配置',
    message: '确定要重置所有配置吗？此操作不可恢复，所有已填写的配置将被清空。',
    confirm: '确认重置',
    cancel: '取消'
  },
  toast: {
    copied: '已复制到剪贴板！',
    downloaded: '已下载！',
    reset: '配置已重置'
  }
}

// English
const en = {
  nav: {
    identity: 'Identity',
    soul: 'Soul',
    agents: 'Agents',
    user: 'User',
    memory: 'Memory',
    skills: 'Skills',
    summary: 'Summary',
    reset: 'Reset'
  },
  header: {
    title: 'ClawSoul',
    subtitle: 'Customize Your Digital Assistant',
    official: 'Website',
    docs: 'Docs'
  },
  identity: {
    title: 'Identity',
    tooltip: 'Define your AI assistant\'s basic identity: name, persona, personality traits, and role positioning. This is the AI\'s "ID card" to understand itself.',
    name: 'AI Name',
    namePlaceholder: 'e.g., Jiliang',
    creature: 'Persona',
    creaturePlaceholder: 'e.g., Legendary Jiliang Horse — ride it for a thousand years 🐴',
    vibe: 'Personality',
    vibePlaceholder: 'e.g., Simple, Patient, Sincere',
    emoji: 'Emoji',
    roles: 'Role Positioning',
    rolesTooltip: 'Select roles for the AI to play when interacting with you, multiple choices allowed'
  },
  soul: {
    title: 'Soul',
    tooltip: 'Define the AI\'s personality traits, core values, and behavioral style. This determines how the AI interacts with you, expresses opinions, and solves problems.',
    addTrait: 'Add Custom Trait',
    addDesc: 'Click to add description',
    delete: 'Delete'
  },
  agents: {
    title: 'Agents',
    tooltip: 'Define the AI\'s working style, behavioral norms, and interaction habits. This determines how the AI handles tasks, responds to requests, and collaborates with you.',
    identity: 'Role Identity',
    identityPlaceholder: 'e.g., I am the user\'s AI assistant, responsible for helping with various tasks...',
    workflow: 'Workflow',
    workflowPlaceholder: 'e.g.,\n1. Understand user needs\n2. Provide solutions\n3. Execute and feedback',
    format: 'Output Format',
    formatPlaceholder: 'e.g., Use Markdown format, annotate code blocks with language...',
    habits: 'Work Habits',
    habitsPlaceholder: 'e.g.,\n- Understand before acting\n- Proactively confirm important decisions',
    prohibitions: 'Prohibitions',
    prohibitionsPlaceholder: 'e.g.,\n- Do not execute dangerous operations\n- Do not leak sensitive information',
    commands: 'Quick Commands',
    commandsPlaceholder: 'e.g.,\n/status - Check status\n/clear - Clear conversation'
  },
  user: {
    title: 'User Profile',
    tooltip: 'Tell the AI about yourself to help it better understand and cooperate with you.',
    basic: 'Basic Info',
    name: 'Name',
    namePlaceholder: 'e.g., Alex',
    timezone: 'Timezone',
    pronouns: 'Pronouns',
    tech: 'Tech Background',
    techTooltip: 'Select technologies you are familiar with',
    proficient: 'Proficient',
    learning: 'Learning',
    unfamiliar: 'Unfamiliar',
    work: 'Work Habits',
    workTooltip: 'Describe your working style to help the AI better cooperate',
    workPlaceholder: 'e.g.,\n- Prefer concise and efficient communication\n- Handle complex tasks in the morning',
    projects: 'Current Projects',
    projectsTooltip: 'Tell the AI what you are working on for context-aware assistance',
    projectsPlaceholder: 'e.g.,\n- Building a personal blog website\n- Learning Vue 3 + TypeScript'
  },
  memory: {
    title: 'Memory',
    tooltip: 'Record important information, decisions, lessons, and preferences. This is the AI\'s "notebook" to remember key content across multiple conversations and provide more coherent service.',
    memories: 'Important Memories',
    memoriesTooltip: 'Record important conversations, decisions, key information',
    addMemory: 'Add Memory',
    memoryPlaceholder: 'e.g., User mentioned their birthday is March 15th',
    decisions: 'Decision Records',
    decisionsTooltip: 'Record important decisions and their reasons',
    addDecision: 'Add Decision',
    title: 'Title',
    reason: 'Reason',
    lessons: 'Lessons Learned',
    lessonsTooltip: 'Record lessons learned to avoid repeating mistakes',
    addLesson: 'Add Lesson',
    lessonPlaceholder: 'e.g., Do not execute deletion without confirmation',
    project: 'Project Context',
    projectTooltip: 'Record information about current projects',
    projectPlaceholder: 'e.g.,\n- Working on e-commerce platform refactoring\n- Tech stack: Next.js + Prisma\n- Scheduled for Q2 launch',
    preferences: 'Preferences',
    preferencesTooltip: 'Record user preferences',
    addPreference: 'Add Preference',
    key: 'Item',
    value: 'Value',
    security: 'Security Reminders',
    securityTooltip: 'Record security-related notes',
    addSecurity: 'Add Security Reminder',
    securityPlaceholder: 'e.g., Do not share API Keys in group chats'
  },
  skills: {
    title: 'Skills',
    tooltip: 'Select the Skills (feature extensions) you need. After generating the config, you can copy the list to OpenClaw for one-click installation.',
    recommended: 'Recommended'
  },
  preview: {
    title: 'Live Preview',
    download: 'Download Markdown',
    copy: 'Copy Config'
  },
  export: {
    summary: 'Config Summary',
    name: 'AI Name',
    role: 'Role',
    traits: 'Traits',
    agents: 'Agents',
    user: 'User',
    memories: 'Memories',
    skills: 'Skills',
    notSet: 'Not set',
    configured: 'Configured',
    notConfigured: 'Not configured',
    items: 'items'
  },
  confirm: {
    title: 'Reset Config',
    message: 'Are you sure you want to reset all configurations? This action cannot be undone, all filled configurations will be cleared.',
    confirm: 'Confirm Reset',
    cancel: 'Cancel'
  },
  toast: {
    copied: 'Copied to clipboard!',
    downloaded: 'Downloaded!',
    reset: 'Config reset'
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'zh',
  messages: {
    zh,
    en
  }
})

export default i18n
