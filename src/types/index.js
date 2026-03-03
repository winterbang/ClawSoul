/** @typedef {import('vue').Ref} Ref */
/** @typedef {import('vue').ComputedRef} ComputedRef */
/** @typedef {import('vue').Reactive} Reactive */

/**
 * @typedef {Object} IdentityConfig
 * @property {string} name - AI名字
 * @property {string} creature - 形象描述
 * @property {string} vibe - 性格特点
 * @property {string} emoji - Emoji标识
 * @property {string[]} roles - 角色ID列表
 * @property {Object.<string, string>} roleDescriptions - 角色描述
 */

/**
 * @typedef {Object} SoulConfig
 * @property {Object.<string, number>} traits - 特质值
 * @property {string} values - 价值观
 */

/**
 * @typedef {Object} AgentRole
 * @property {string} identity - 身份
 * @property {string[]} specialties - 专长
 * @property {string} language - 语言
 */

/**
 * @typedef {Object} AgentWorkflows
 * @property {string[]} code - 代码开发流程
 * @property {string[]} research - 研究任务流程
 * @property {string[]} ops - 系统运维流程
 */

/**
 * @typedef {Object} AgentCommand
 * @property {string} trigger - 触发词
 * @property {string} action - 动作
 */

/**
 * @typedef {Object} AgentsConfig
 * @property {AgentRole} role - 角色信息
 * @property {AgentWorkflows} workflows - 工作流程
 * @property {string[]} formats - 格式要求
 * @property {string[]} habits - 语言习惯
 * @property {string[]} prohibitions - 禁止事项
 * @property {AgentCommand[]} commands - 特殊指令
 */

/**
 * @typedef {Object} UserBasic
 * @property {string} name - 姓名
 * @property {string} occupation - 职业
 * @property {string} company - 公司
 * @property {string} experience - 工作年限
 */

/**
 * @typedef {Object} UserTech
 * @property {string[]} proficient - 熟练技术
 * @property {string[]} learning - 学习中
 * @property {string[]} unfamiliar - 不熟悉
 * @property {string} other - 其他
 */

/**
 * @typedef {Object} WorkSchedule
 * @property {string} start - 开始时间
 * @property {string} end - 结束时间
 * @property {string} timezone - 时区
 */

/**
 * @typedef {Object} CommunicationPrefs
 * @property {boolean} conclusionFirst - 先给结论
 * @property {boolean} codeExamples - 代码示例
 * @property {boolean} reasoning - 需要原因说明
 * @property {boolean} casual - 非正式语言
 * @property {boolean} detailed - 详细解释
 */

/**
 * @typedef {Object} ProjectInfo
 * @property {string} name - 项目名称
 * @property {string} stack - 技术栈
 * @property {string} teamSize - 团队规模
 * @property {string} status - 项目状态
 */

/**
 * @typedef {Object} UserConfig
 * @property {UserBasic} basic - 基本信息
 * @property {UserTech} tech - 技术背景
 * @property {WorkSchedule} workSchedule - 工作时间
 * @property {CommunicationPrefs} communication - 沟通偏好
 * @property {string[]} priorities - 任务优先级
 * @property {ProjectInfo} project - 项目信息
 */

/**
 * @typedef {Object} Decision
 * @property {string} title - 决策标题
 * @property {string} reason - 决策原因
 */

/**
 * @typedef {Object} Preference
 * @property {string} key - 偏好名称
 * @property {string} value - 偏好值
 */

/**
 * @typedef {Object} MemoryConfig
 * @property {string[]} memories - 重要记忆
 * @property {Decision[]} decisions - 决策记录
 * @property {string[]} lessons - 经验教训
 * @property {string} projectContext - 项目上下文
 * @property {Preference[]} preferences - 个人偏好
 * @property {string[]} security - 安全提醒
 */

/**
 * @typedef {Object} AppConfig
 * @property {IdentityConfig} identity - 身份配置
 * @property {SoulConfig} soul - 灵魂配置
 * @property {AgentsConfig} agents - 代理配置
 * @property {UserConfig} user - 用户配置
 * @property {MemoryConfig} memory - 记忆配置
 * @property {string[]} skills - 已选技能
 */

/**
 * @typedef {Object} Role
 * @property {string} id - 角色ID
 * @property {string} name - 角色名称
 */

/**
 * @typedef {Object} Skill
 * @property {string} id - 技能ID
 * @property {string} name - 技能名称
 * @property {string} description - 技能描述
 * @property {boolean} [recommended] - 是否推荐
 */

/**
 * @typedef {Object} SkillCategory
 * @property {string} id - 分类ID
 * @property {string} name - 分类名称
 * @property {Skill[]} skills - 技能列表
 */

/**
 * @typedef {Object} PreviewTab
 * @property {string} id - 标签ID
 * @property {string} name - 标签名称
 */

/**
 * @typedef {Object} PersonalityTrait
 * @property {string} id - 特质ID
 * @property {string} name - 特质名称
 * @property {number} value - 特质值(0-100)
 * @property {string} description - 特质描述
 */

/**
 * @typedef {Object} ToastState
 * @property {boolean} show - 是否显示
 * @property {string} message - 消息内容
 */

/**
 * @typedef {Object} ConfirmDialogState
 * @property {boolean} show - 是否显示
 * @property {string} title - 标题
 * @property {string} message - 消息内容
 * @property {Function|null} onConfirm - 确认回调
 */

export {}
