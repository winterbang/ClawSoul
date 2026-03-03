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
    rolesTooltip: '选择 AI 在与你互动时扮演的角色，可多选',
    roleDescTitle: '自定义角色描述：',
    roleDescPlaceholder: '描述这个角色的具体定位...'
  },
  roles: {
    companion: '小伙伴',
    friend: '朋友',
    teacher: '老师',
    assistant: '助手',
    advisor: '顾问',
    partner: '合作伙伴'
  },
  soul: {
    title: '人格特质 SOUL',
    tooltip: '定义 AI 的性格特点、核心价值观和行为风格。这决定了 AI 如何与你互动、表达观点和解决问题。',
    addTrait: '添加自定义特质',
    addDesc: '点击添加描述',
    delete: '删除',
    traitNamePlaceholder: '特质名称',
    traitDescPlaceholder: '描述（可选）',
    confirmAdd: '确认添加',
    cancel: '取消',
    confirmDeleteTitle: '确认删除',
    confirmDeleteMsg: '确定要删除特质"{name}"吗？',
    traitHelpful: '真诚帮助',
    traitHelpfulDesc: '少说套话，多做实事',
    traitOpinionated: '有主见',
    traitOpinionatedDesc: '敢于表达不同意见',
    traitResourceful: '先尝试',
    traitResourcefulDesc: '先自己探索再问人',
    traitTrustworthy: '可信赖',
    traitTrustworthyDesc: '谨慎处理外部操作',
    traitRespectful: '尊重隐私',
    traitRespectfulDesc: '像客人一样尊重主人'
  },
  agents: {
    title: '行为准则 AGENTS',
    tooltip: '定义 AI 的工作方式、回答风格和禁止事项。这告诉 AI "如何工作"，包括处理任务的流程、沟通风格和安全边界。',
    role: {
      title: '角色定位',
      tooltip: '定义 AI 的身份、专长和语言偏好',
      identity: '身份',
      identityPlaceholder: '例如：高级软件工程师助手',
      specialties: '专长领域',
      language: '主要语言',
      chinese: '中文',
      english: '英文',
      bilingual: '中英混合（技术术语保持英文）'
    },
    workflow: {
      title: '工作方式',
      tooltip: '定义不同类型任务的处理流程',
      code: '代码开发流程',
      research: '研究任务流程',
      ops: '系统运维流程',
      stepPlaceholder: '例如：理解需求',
      addStep: '添加步骤'
    },
    style: {
      title: '回答风格',
      tooltip: '定义 AI 的回复格式和语言习惯',
      format: '格式要求',
      habits: '语言习惯'
    },
    prohibitions: {
      title: '禁止事项',
      tooltip: '定义 AI 不应该做的事情，设置安全边界',
      placeholder: '例如：不要猜测用户意图，不确定时询问',
      add: '添加禁止项'
    },
    commands: {
      title: '特殊指令',
      tooltip: '定义快捷指令，触发特定操作',
      triggerPlaceholder: '/review',
      actionPlaceholder: '执行动作描述',
      add: '添加指令'
    },
    specialty: {
      web: 'Web开发',
      architecture: '系统架构',
      codeReview: '代码审查',
      data: '数据分析',
      ml: '机器学习',
      devops: 'DevOps',
      mobile: '移动开发',
      database: '数据库',
      security: '网络安全'
    },
    format: {
      markdown: '使用Markdown格式',
      codeLang: '代码块标注语言',
      headings: '长内容使用标题分隔',
      bold: '重要内容加粗',
      lists: '适当使用列表',
      tables: '适当使用表格'
    },
    habit: {
      techTerms: '技术术语使用英文',
      analogy: '解释时使用类比',
      formal: '避免过于口语化',
      conclusionFirst: '先给结论再展开',
      compare: '提供多个方案时说明优劣'
    }
  },
  user: {
    title: '用户画像 USER',
    tooltip: '告诉 AI 你是谁：基本信息、技术背景、工作习惯和项目情况。让 AI 更了解你，提供个性化的帮助和建议。',
    basic: '基本信息',
    basicTooltip: '让 AI 知道如何称呼你，了解你的职业背景',
    name: '姓名',
    namePlaceholder: '你的姓名',
    occupation: '职业',
    occupationPlaceholder: '例如：全栈开发工程师',
    company: '公司/组织',
    companyPlaceholder: '你的公司',
    experience: '工作年限',
    select: '请选择',
    years: '年',
    yearsPlus: '年以上',
    tech: '技术背景',
    techTooltip: '帮助 AI 了解你的技术栈，在回答时使用你熟悉的技术举例',
    work: '工作习惯',
    workTooltip: '描述你的工作方式，帮助 AI 更好地配合',
    workPlaceholder: '例如：偏好简洁高效的沟通方式',
    addWorkHabit: '添加工作习惯',
    projects: '当前项目',
    projectsTooltip: '告诉 AI 你正在做什么，方便提供上下文相关的帮助',
    projectName: '项目名称',
    projectDesc: '项目描述',
    addProject: '添加项目',
    removeProject: '删除'
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
    recommended: '推荐',
    searxngDesc: '隐私搜索，本地 SearXNG 实例',
    webSearchDesc: 'Brave 搜索 API',
    aStockMonitorDesc: 'A股量化监控系统',
    astockResearchDesc: 'A股深度投研分析',
    buffettAnalysisDesc: '巴菲特视角投资分析',
    astockDailyDesc: '每日A股精选',
    opencodeDesc: 'AI 编程助手',
    codeSimplifierDesc: '代码重构简化',
    frontendDesignDesc: '前端界面设计',
    wechatMiniprogramDesc: '微信小程序 CI/CD',
    documentSkillsDesc: 'DOCX/PDF 处理',
    findSkillDesc: 'Skill 发现搜索',
    ralphLoopDesc: '迭代开发工作流',
    skillCreatorDesc: '创建新 Skill'
  },
  skillCategories: {
    search: '搜索与信息获取',
    investment: '投资与金融',
    dev: '代码开发',
    doc: '文档与办公',
    utility: '效率工具'
  },
  preview: {
    title: '实时预览',
    download: '下载 Markdown',
    copy: '复制当前配置',
    styleTitle: '的风格',
    notConfigured: '（未配置）'
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
  },
  default: {
    name: '吉量',
    creature: '传说中的吉量马 — 乘之寿千岁 🐴',
    vibe: '朴素、耐心、真诚',
    roleDesc: {
      companion: '陪你一起探索、解决问题',
      friend: '真诚相待，有不同意见会直说',
      teacher: '用朴素的方式耐心解答，帮助你理解',
      assistant: '高效执行，精准完成任务',
      advisor: '提供专业建议，辅助决策',
      collaborator: '平等合作，共同创造'
    }
  },
  preview: {
    identity: 'IDENTITY',
    soul: 'SOUL',
    agents: 'AGENTS',
    user: 'USER',
    memory: 'MEMORY',
    skills: 'SKILLS',
    full: '完整',
    nameLabel: 'Name',
    creatureLabel: 'Creature',
    vibeLabel: 'Vibe',
    emojiLabel: 'Emoji',
    rolePositioning: 'Role Positioning',
    coreValues: 'Core Values',
    personalityTraits: 'Personality Traits',
    skillsToInstall: 'Skills to Install',
    copyInstruction: 'Copy the above list to OpenClaw to install these skills'
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
    rolesTooltip: 'Select roles for the AI to play when interacting with you, multiple choices allowed',
    roleDescTitle: 'Custom role descriptions:',
    roleDescPlaceholder: 'Describe the specific positioning of this role...'
  },
  roles: {
    companion: 'Companion',
    friend: 'Friend',
    teacher: 'Teacher',
    assistant: 'Assistant',
    advisor: 'Advisor',
    partner: 'Partner'
  },
  soul: {
    title: 'Soul',
    tooltip: 'Define the AI\'s personality traits, core values, and behavioral style. This determines how the AI interacts with you, expresses opinions, and solves problems.',
    addTrait: 'Add Custom Trait',
    addDesc: 'Click to add description',
    delete: 'Delete',
    traitNamePlaceholder: 'Trait name',
    traitDescPlaceholder: 'Description (optional)',
    confirmAdd: 'Confirm',
    cancel: 'Cancel',
    confirmDeleteTitle: 'Confirm Delete',
    confirmDeleteMsg: 'Are you sure you want to delete the trait "{name}"?',
    traitHelpful: 'Helpful',
    traitHelpfulDesc: 'Less talk, more action',
    traitOpinionated: 'Opinionated',
    traitOpinionatedDesc: 'Willing to express different opinions',
    traitResourceful: 'Resourceful',
    traitResourcefulDesc: 'Explore on your own before asking',
    traitTrustworthy: 'Trustworthy',
    traitTrustworthyDesc: 'Handle external operations carefully',
    traitRespectful: 'Respectful',
    traitRespectfulDesc: 'Respect the user like a guest'
  },
  agents: {
    title: 'Agents',
    tooltip: 'Define the AI\'s working style, response format, and prohibitions. This tells the AI "how to work", including task processing workflows, communication style, and safety boundaries.',
    role: {
      title: 'Role Positioning',
      tooltip: 'Define the AI\'s identity, specialties, and language preferences',
      identity: 'Identity',
      identityPlaceholder: 'e.g., Senior Software Engineer Assistant',
      specialties: 'Specialties',
      language: 'Primary Language',
      chinese: 'Chinese',
      english: 'English',
      bilingual: 'Bilingual (keep technical terms in English)'
    },
    workflow: {
      title: 'Workflow',
      tooltip: 'Define processing workflows for different types of tasks',
      code: 'Code Development Workflow',
      research: 'Research Task Workflow',
      ops: 'System Operations Workflow',
      stepPlaceholder: 'e.g., Understand requirements',
      addStep: 'Add Step'
    },
    style: {
      title: 'Response Style',
      tooltip: 'Define the AI\'s reply format and language habits',
      format: 'Format Requirements',
      habits: 'Language Habits'
    },
    prohibitions: {
      title: 'Prohibitions',
      tooltip: 'Define what the AI should not do, setting safety boundaries',
      placeholder: 'e.g., Do not guess user intent, ask when uncertain',
      add: 'Add Prohibition'
    },
    commands: {
      title: 'Special Commands',
      tooltip: 'Define quick commands to trigger specific actions',
      triggerPlaceholder: '/review',
      actionPlaceholder: 'Action description',
      add: 'Add Command'
    },
    specialty: {
      web: 'Web Development',
      architecture: 'System Architecture',
      codeReview: 'Code Review',
      data: 'Data Analysis',
      ml: 'Machine Learning',
      devops: 'DevOps',
      mobile: 'Mobile Development',
      database: 'Database',
      security: 'Security'
    },
    format: {
      markdown: 'Use Markdown format',
      codeLang: 'Annotate code blocks with language',
      headings: 'Use headings for long content',
      bold: 'Bold important content',
      lists: 'Use lists appropriately',
      tables: 'Use tables appropriately'
    },
    habit: {
      techTerms: 'Use English for technical terms',
      analogy: 'Use analogies when explaining',
      formal: 'Avoid overly casual language',
      conclusionFirst: 'Give conclusion first then elaborate',
      compare: 'Explain pros/cons when providing multiple options'
    }
  },
  user: {
    title: 'User Profile',
    tooltip: 'Tell the AI who you are: basic info, tech background, work habits, and projects. Help the AI understand you better for personalized assistance.',
    basic: 'Basic Info',
    basicTooltip: 'Let the AI know how to address you and understand your professional background',
    name: 'Name',
    namePlaceholder: 'Your name',
    occupation: 'Occupation',
    occupationPlaceholder: 'e.g., Full Stack Developer',
    company: 'Company/Organization',
    companyPlaceholder: 'Your company',
    experience: 'Experience',
    select: 'Select',
    years: 'years',
    yearsPlus: 'years+',
    tech: 'Tech Background',
    techTooltip: 'Help the AI understand your tech stack to use familiar technologies in responses',
    work: 'Work Habits',
    workTooltip: 'Describe your working style to help the AI better cooperate',
    workPlaceholder: 'e.g., Prefer concise and efficient communication',
    addWorkHabit: 'Add Work Habit',
    projects: 'Current Projects',
    projectsTooltip: 'Tell the AI what you are working on for context-aware assistance',
    projectName: 'Project Name',
    projectDesc: 'Project Description',
    addProject: 'Add Project',
    removeProject: 'Remove'
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
    recommended: 'Recommended',
    searxngDesc: 'Privacy search, local SearXNG instance',
    webSearchDesc: 'Brave Search API',
    aStockMonitorDesc: 'A-Stock quantitative monitoring system',
    astockResearchDesc: 'A-Stock in-depth research analysis',
    buffettAnalysisDesc: 'Buffett perspective investment analysis',
    astockDailyDesc: 'Daily A-Stock picks',
    opencodeDesc: 'AI coding assistant',
    codeSimplifierDesc: 'Code refactoring and simplification',
    frontendDesignDesc: 'Frontend interface design',
    wechatMiniprogramDesc: 'WeChat Mini Program CI/CD',
    documentSkillsDesc: 'DOCX/PDF processing',
    findSkillDesc: 'Skill discovery search',
    ralphLoopDesc: 'Iterative development workflow',
    skillCreatorDesc: 'Create new Skill'
  },
  skillCategories: {
    search: 'Search & Information',
    investment: 'Investment & Finance',
    dev: 'Code Development',
    doc: 'Documents & Office',
    utility: 'Utility Tools'
  },
  preview: {
    title: 'Live Preview',
    download: 'Download Markdown',
    copy: 'Copy Config',
    styleTitle: ' Style',
    notConfigured: '(Not configured)'
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
  },
  default: {
    name: 'Jiliang',
    creature: 'Legendary Jiliang Horse — ride it for a thousand years 🐴',
    vibe: 'Simple, Patient, Sincere',
    roleDesc: {
      companion: 'Explore and solve problems with you',
      friend: 'Treat you sincerely, speak up when having different opinions',
      teacher: 'Patiently explain in a simple way to help you understand',
      assistant: 'Execute efficiently and complete tasks accurately',
      advisor: 'Provide professional advice to assist decision-making',
      collaborator: 'Equal cooperation, create together'
    }
  },
  preview: {
    identity: 'IDENTITY',
    soul: 'SOUL',
    agents: 'AGENTS',
    user: 'USER',
    memory: 'MEMORY',
    skills: 'SKILLS',
    full: 'Full',
    nameLabel: 'Name',
    creatureLabel: 'Creature',
    vibeLabel: 'Vibe',
    emojiLabel: 'Emoji',
    rolePositioning: 'Role Positioning',
    coreValues: 'Core Values',
    personalityTraits: 'Personality Traits',
    skillsToInstall: 'Skills to Install',
    copyInstruction: 'Copy the above list to OpenClaw to install these skills'
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
