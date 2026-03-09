import { supabase } from '@/utils/supabase.js'

/**
 * 配置管理相关的 Supabase 操作
 */

// =====================================================
// 配置 CRUD 操作
// =====================================================

/**
 * 创建新配置
 */
export async function createConfig(configData) {
  const { data, error } = await supabase
    .from('configs')
    .insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      ...configData
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 获取配置列表
 */
export async function listConfigs(query = {}) {
  const {
    category,
    tags,
    is_public,
    is_template,
    search,
    sort_by = 'updated_at',
    sort_order = 'desc',
    page = 1,
    limit = 20
  } = query

  let qb = supabase
    .from('configs')
    .select('*', { count: 'exact' })

  // 应用过滤条件
  if (category) {
    qb = qb.eq('category', category)
  }
  
  if (tags && tags.length > 0) {
    qb = qb.contains('tags', tags)
  }
  
  if (is_public !== undefined) {
    qb = qb.eq('is_public', is_public)
  }
  
  if (is_template !== undefined) {
    qb = qb.eq('is_template', is_template)
  }
  
  if (search) {
    qb = qb.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  // 排序和分页
  const { data, error, count } = await qb
    .order(sort_by, { ascending: sort_order === 'asc' })
    .range((page - 1) * limit, page * limit - 1)

  if (error) throw error
  
  return {
    configs: data,
    total: count,
    page,
    limit
  }
}

/**
 * 获取单个配置
 */
export async function getConfig(configId) {
  // 获取配置详情
  const { data: config, error } = await supabase
    .from('configs')
    .select('*')
    .eq('id', configId)
    .single()

  if (error) throw error

  // 更新访问时间
  await supabase
    .from('configs')
    .update({ last_accessed_at: new Date().toISOString() })
    .eq('id', configId)

  // 记录查看日志
  await logActivity('view', 'config', configId)

  return config
}

/**
 * 更新配置
 */
export async function updateConfig(configId, updates) {
  // 先获取当前配置以创建版本备份
  const { data: currentConfig } = await supabase
    .from('configs')
    .select('*')
    .eq('id', configId)
    .single()

  // 创建版本备份
  if (currentConfig) {
    await supabase
      .from('config_versions')
      .insert({
        config_id: configId,
        version_number: currentConfig.version,
        content: currentConfig.content,
        change_summary: updates.change_summary || '配置更新',
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
  }

  // 更新配置
  const { data, error } = await supabase
    .from('configs')
    .update({
      ...updates,
      version: (currentConfig?.version || 0) + 1
    })
    .eq('id', configId)
    .select()
    .single()

  if (error) throw error

  // 记录更新日志
  await logActivity('update', 'config', configId, { fields: Object.keys(updates) })

  return data
}

/**
 * 删除配置（软删除）
 */
export async function deleteConfig(configId) {
  const { error } = await supabase
    .from('configs')
    .update({ status: 'deleted' })
    .eq('id', configId)

  if (error) throw error

  await logActivity('delete', 'config', configId)
  return { success: true }
}

/**
 * Fork 配置
 */
export async function forkConfig(configId, newName) {
  const { data: sourceConfig } = await supabase
    .from('configs')
    .select('*')
    .eq('id', configId)
    .single()

  if (!sourceConfig) {
    throw new Error('Source config not found')
  }

  // 创建新配置
  const { data: newConfig, error } = await supabase
    .from('configs')
    .insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      name: newName || `${sourceConfig.name} (Copy)`,
      description: sourceConfig.description,
      content: sourceConfig.content,
      tags: sourceConfig.tags,
      category: sourceConfig.category,
      template_id: configId
    })
    .select()
    .single()

  if (error) throw error

  // 更新原配置的 fork 计数
  await supabase.rpc('increment_fork_count', { config_id: configId })

  await logActivity('fork', 'config', configId, { new_config_id: newConfig.id })

  return newConfig
}

// =====================================================
// 下载统计
// =====================================================

/**
 * 记录下载
 */
export async function recordDownload(configId, format = 'markdown', source = 'web') {
  const { data, error } = await supabase.rpc('record_download', {
    p_config_id: configId,
    p_user_id: (await supabase.auth.getUser()).data.user?.id,
    p_format: format,
    p_source: source
  })

  if (error) {
    // 降级处理：直接插入下载记录
    await supabase
      .from('downloads')
      .insert({
        config_id: configId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        format,
        source
      })
    
    // 手动更新计数
    await supabase
      .from('configs')
      .update({ download_count: supabase.raw('download_count + 1') })
      .eq('id', configId)
  }

  await logActivity('download', 'config', configId, { format, source })

  return { success: true, download_id: data }
}

/**
 * 获取配置下载统计
 */
export async function getConfigDownloadStats(configId) {
  const { data, error } = await supabase
    .from('downloads')
    .select('format, count')
    .eq('config_id', configId)
    .group('format')

  if (error) throw error
  return data
}

/**
 * 获取用户下载历史
 */
export async function getUserDownloads(userId, limit = 20) {
  const { data, error } = await supabase
    .from('downloads')
    .select(`
      *,
      config:configs(id, name, description)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

// =====================================================
// 版本管理
// =====================================================

/**
 * 获取配置版本历史
 */
export async function getConfigVersions(configId, limit = 10) {
  const { data, error } = await supabase
    .from('config_versions')
    .select('*')
    .eq('config_id', configId)
    .order('version_number', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

/**
 * 回滚到指定版本
 */
export async function rollbackConfig(configId, versionId) {
  const { data: version } = await supabase
    .from('config_versions')
    .select('*')
    .eq('id', versionId)
    .single()

  if (!version) {
    throw new Error('Version not found')
  }

  return updateConfig(configId, {
    content: version.content,
    change_summary: `Rollback to version ${version.version_number}`
  })
}

// =====================================================
// 用户统计
// =====================================================

/**
 * 获取用户统计
 */
export async function getUserStats(userId) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error

  // 获取配置统计
  const { count: totalConfigs } = await supabase
    .from('configs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'active')

  // 获取本月新建配置
  const { count: configsThisMonth } = await supabase
    .from('configs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', new Date(new Date().setDate(1)).toISOString())

  return {
    ...profile,
    total_configs: totalConfigs,
    configs_this_month: configsThisMonth
  }
}

// =====================================================
// 模板市场
// =====================================================

/**
 * 获取热门模板
 */
export async function getPopularTemplates(limit = 10) {
  const { data, error } = await supabase
    .from('configs')
    .select(`
      *,
      author:profiles(username, display_name, avatar_url)
    `)
    .eq('is_template', true)
    .eq('is_public', true)
    .eq('status', 'active')
    .order('fork_count', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

/**
 * 搜索模板
 */
export async function searchTemplates(searchQuery, filters = {}) {
  let qb = supabase
    .from('configs')
    .select(`
      *,
      author:profiles(username, display_name)
    `)
    .eq('is_template', true)
    .eq('is_public', true)
    .eq('status', 'active')

  if (searchQuery) {
    qb = qb.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
  }

  if (filters.category) {
    qb = qb.eq('category', filters.category)
  }

  const { data, error } = await qb
    .order('fork_count', { ascending: false })
    .limit(filters.limit || 20)

  if (error) throw error
  return data
}

// =====================================================
// 活动日志
// =====================================================

/**
 * 记录活动日志
 */
export async function logActivity(action, entityType, entityId, metadata = {}) {
  try {
    await supabase
      .from('activity_logs')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        action,
        entity_type: entityType,
        entity_id: entityId,
        metadata
      })
  } catch (e) {
    // 静默失败，不影响主流程
    console.error('Failed to log activity:', e)
  }
}

/**
 * 获取用户活动历史
 */
export async function getUserActivity(userId, limit = 50) {
  const { data, error } = await supabase
    .from('activity_logs')
    .select(`
      *,
      config:configs(id, name)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

// =====================================================
// 实时订阅
// =====================================================

/**
 * 订阅配置变更
 */
export function subscribeToConfig(configId, callback) {
  return supabase
    .channel(`config:${configId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'configs',
        filter: `id=eq.${configId}`
      },
      callback
    )
    .subscribe()
}

/**
 * 订阅用户配置列表变更
 */
export function subscribeToUserConfigs(userId, callback) {
  return supabase
    .channel(`user-configs:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'configs',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}
