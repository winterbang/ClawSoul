/**
 * 验证辅助函数
 */

/**
 * 检查配置是否有内容
 * @param {import('../../types').AppConfig} config
 * @returns {boolean}
 */
export function hasConfigContent(config) {
  return !!(config.identity.name || 
    config.identity.roles.length > 0 ||
    config.skills.length > 0)
}

/**
 * 获取已配置项目数量
 * @param {import('../../types').AppConfig} config
 * @returns {number}
 */
export function getConfiguredCount(config) {
  let count = 0
  if (config.identity.name) count++
  if (config.identity.roles.length > 0) count++
  if (config.skills.length > 0) count++
  if (config.agents.role.identity) count++
  if (config.user.basic.name) count++
  const memoryCount = config.memory.memories.length + 
    config.memory.decisions.length + 
    config.memory.lessons.length
  if (memoryCount > 0) count++
  return count
}
