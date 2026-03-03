import { reactive } from 'vue'
import { defaultConfig, defaultTraits } from '../modules/config.js'

/**
 * 配置管理 Composable
 * @returns {{
 *   config: import('vue').UnwrapNestedRefs<import('../types').AppConfig>,
 *   personalityTraits: import('vue').UnwrapNestedRefs<import('../types').PersonalityTrait[]>,
 *   updateIdentityConfig: (newConfig: Partial<import('../types').IdentityConfig>) => void,
 *   toggleRole: (roleId: string) => void,
 *   updateRoleDesc: (roleId: string, desc: string) => void,
 *   updatePersonalityTraits: (newTraits: import('../types').PersonalityTrait[]) => void,
 *   updateAgentsConfig: (newConfig: Partial<import('../types').AgentsConfig>) => void,
 *   updateUserConfig: (newConfig: Partial<import('../types').UserConfig>) => void,
 *   updateMemoryConfig: (newConfig: Partial<import('../types').MemoryConfig>) => void,
 *   resetConfig: () => void
 * }}
 */
export function useConfig() {
  // 深拷贝默认配置以确保响应式
  const config = reactive(JSON.parse(JSON.stringify(defaultConfig)))
  
  // 让 personalityTraits 响应式
  const personalityTraits = reactive(JSON.parse(JSON.stringify(defaultTraits)))

  /**
   * 更新身份配置
   * @param {Partial<import('../types').IdentityConfig>} newConfig
   */
  const updateIdentityConfig = (newConfig) => {
    Object.assign(config.identity, newConfig)
  }

  /**
   * 切换角色选择
   * @param {string} roleId
   */
  const toggleRole = (roleId) => {
    const index = config.identity.roles.indexOf(roleId)
    if (index > -1) {
      config.identity.roles.splice(index, 1)
    } else {
      config.identity.roles.push(roleId)
    }
  }

  /**
   * 更新角色描述
   * @param {string} roleId
   * @param {string} desc
   */
  const updateRoleDesc = (roleId, desc) => {
    config.identity.roleDescriptions[roleId] = desc
  }

  /**
   * 更新人格特质
   * @param {import('../types').PersonalityTrait[]} newTraits
   */
  const updatePersonalityTraits = (newTraits) => {
    personalityTraits.splice(0, personalityTraits.length, ...newTraits)
  }

  /**
   * 更新 Agents 配置
   * @param {Partial<import('../types').AgentsConfig>} newConfig
   */
  const updateAgentsConfig = (newConfig) => {
    Object.assign(config.agents, newConfig)
  }

  /**
   * 更新 User 配置
   * @param {Partial<import('../types').UserConfig>} newConfig
   */
  const updateUserConfig = (newConfig) => {
    Object.assign(config.user, newConfig)
  }

  /**
   * 更新 Memory 配置
   * @param {Partial<import('../types').MemoryConfig>} newConfig
   */
  const updateMemoryConfig = (newConfig) => {
    Object.assign(config.memory, newConfig)
  }

  /**
   * 重置所有配置到默认值
   */
  const resetConfig = () => {
    Object.assign(config, JSON.parse(JSON.stringify(defaultConfig)))
    const newTraits = JSON.parse(JSON.stringify(defaultTraits))
    personalityTraits.splice(0, personalityTraits.length, ...newTraits)
  }

  return {
    config,
    personalityTraits,
    updateIdentityConfig,
    toggleRole,
    updateRoleDesc,
    updatePersonalityTraits,
    updateAgentsConfig,
    updateUserConfig,
    updateMemoryConfig,
    resetConfig
  }
}
