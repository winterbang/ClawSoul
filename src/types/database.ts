/**
 * ClawSoul 数据结构定义
 * TypeScript 类型定义文件
 */

// =====================================================
// 用户相关
// =====================================================

export interface Profile {
  id: string;                    // UUID，关联 auth.users
  username: string;
  avatar_url?: string;
  display_name: string;
  
  // 用户偏好
  preferences: UserPreferences;
  
  // 账户状态
  account_status: 'active' | 'suspended' | 'premium';
  plan_type: 'free' | 'pro' | 'enterprise';
  
  // 统计
  total_configs: number;
  total_downloads: number;
  storage_used_bytes: number;
  
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  theme?: 'dark' | 'light' | 'system';
  language?: string;             // 'zh-CN', 'en-US', etc.
  default_export_format?: 'markdown' | 'json' | 'yaml';
  auto_save?: boolean;
  notifications?: NotificationSettings;
}

export interface NotificationSettings {
  email_on_download?: boolean;
  email_on_share?: boolean;
  push_enabled?: boolean;
}

// =====================================================
// 配置内容结构 (Config Content)
// =====================================================

export interface ConfigContent {
  // 基础信息
  agentName: string;
  agentDescription?: string;
  agentEmoji?: string;
  
  // 核心文件
  soul?: SoulContent;            // SOUL.md 内容
  identity?: IdentityContent;    // IDENTITY.md 内容
  user?: UserContent;            // USER.md 内容
  tools?: ToolsContent;          // TOOLS.md 内容
  
  // 技能配置
  skills?: SkillConfig[];
  
  // 心跳配置
  heartbeat?: HeartbeatConfig;
  
  // 其他文件
  customFiles?: CustomFile[];
  
  // 元数据
  version: string;
  created_with: 'clawsoul';
  schema_version: number;
}

export interface SoulContent {
  coreTruths: string[];
  boundaries: string[];
  vibe: string;
  continuityNotes: string;
}

export interface IdentityContent {
  name: string;
  creature: string;
  vibe: string;
  emoji: string;
  avatar?: string;
}

export interface UserContent {
  name?: string;
  whatToCallThem?: string;
  pronouns?: string;
  timezone: string;
  notes: string;
  context: UserContext;
}

export interface UserContext {
  projects?: string[];
  preferences?: Record<string, any>;
  importantDates?: ImportantDate[];
}

export interface ImportantDate {
  name: string;
  date: string;
  type: 'birthday' | 'anniversary' | 'deadline' | 'other';
}

export interface ToolsContent {
  cameras?: CameraConfig[];
  sshHosts?: SSHHost[];
  tts?: TTSConfig;
  devices?: DeviceConfig[];
}

export interface CameraConfig {
  name: string;
  location: string;
  notes?: string;
}

export interface SSHHost {
  alias: string;
  host: string;
  user: string;
  port?: number;
}

export interface TTSConfig {
  preferredVoice?: string;
  defaultSpeaker?: string;
}

export interface DeviceConfig {
  name: string;
  type: string;
  nickname?: string;
}

export interface SkillConfig {
  skillId: string;
  enabled: boolean;
  settings?: Record<string, any>;
  customNotes?: string;
}

export interface HeartbeatConfig {
  enabled: boolean;
  interval?: number;             // 分钟
  tasks?: HeartbeatTask[];
}

export interface HeartbeatTask {
  name: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface CustomFile {
  path: string;
  content: string;
  isBase64?: boolean;
}

// =====================================================
// 配置表 (Configs)
// =====================================================

export interface Config {
  id: string;                    // UUID
  user_id: string;               // 创建者
  
  // 基础信息
  name: string;
  description?: string;
  
  // 核心内容
  content: ConfigContent;
  
  // 分类和标签
  tags: string[];
  category: ConfigCategory;
  
  // 模板相关
  is_template: boolean;
  template_id?: string;          // 基于哪个模板
  fork_count: number;
  
  // 统计
  download_count: number;
  view_count: number;
  like_count: number;
  
  // 版本
  version: number;
  parent_version?: string;       // 上一版本 ID
  
  // 分享
  is_public: boolean;
  collaborators: string[];       // 协作者 IDs
  
  // 状态
  status: 'active' | 'archived' | 'deleted';
  
  // 时间戳
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
}

export type ConfigCategory = 
  | 'general' 
  | 'assistant' 
  | 'workflow' 
  | 'creative' 
  | 'coding' 
  | 'research' 
  | 'custom';

// =====================================================
// 下载记录 (Downloads)
// =====================================================

export interface Download {
  id: string;
  config_id: string;
  user_id?: string;              // 可能匿名
  
  format: ExportFormat;
  file_size_bytes?: number;
  
  // 客户端信息
  user_agent?: string;
  ip_hash?: string;
  referrer?: string;
  
  // 来源
  source: DownloadSource;
  
  created_at: string;
}

export type ExportFormat = 'markdown' | 'json' | 'yaml' | 'zip';
export type DownloadSource = 'web' | 'api' | 'cli' | 'vscode_extension';

// =====================================================
// 配置版本 (ConfigVersions)
// =====================================================

export interface ConfigVersion {
  id: string;
  config_id: string;
  version_number: number;
  content: ConfigContent;
  change_summary?: string;
  created_at: string;
  created_by?: string;
}

// =====================================================
// 活动日志 (ActivityLogs)
// =====================================================

export interface ActivityLog {
  id: string;
  user_id: string;
  action: ActivityAction;
  entity_type: EntityType;
  entity_id?: string;
  metadata: Record<string, any>;
  ip_hash?: string;
  user_agent?: string;
  created_at: string;
}

export type ActivityAction = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'download' 
  | 'share' 
  | 'fork' 
  | 'view'
  | 'export';

export type EntityType = 'config' | 'profile' | 'template' | 'user';

// =====================================================
// 系统统计 (SystemStats)
// =====================================================

export interface SystemStats {
  id: string;
  stat_date: string;             // YYYY-MM-DD
  
  new_users: number;
  active_users: number;
  
  new_configs: number;
  total_configs: number;
  
  total_downloads: number;
  downloads_by_format: Record<ExportFormat, number>;
  top_configs: string[];         // config IDs
  
  created_at: string;
  updated_at: string;
}

// =====================================================
// 功能开关 (FeatureFlags)
// =====================================================

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  rollout_percentage: number;    // 0-100
  allowed_users: string[];       // 白名单
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// =====================================================
// API 请求/响应类型
// =====================================================

// 创建配置
export interface CreateConfigRequest {
  name: string;
  description?: string;
  content: ConfigContent;
  tags?: string[];
  category?: ConfigCategory;
  is_public?: boolean;
  is_template?: boolean;
}

export interface CreateConfigResponse {
  success: boolean;
  config?: Config;
  error?: string;
}

// 更新配置
export interface UpdateConfigRequest {
  name?: string;
  description?: string;
  content?: ConfigContent;
  tags?: string[];
  category?: ConfigCategory;
  is_public?: boolean;
  change_summary?: string;
}

// 下载配置
export interface DownloadConfigRequest {
  config_id: string;
  format: ExportFormat;
}

export interface DownloadConfigResponse {
  success: boolean;
  download_url?: string;
  file_content?: string;
  error?: string;
}

// 配置列表查询
export interface ListConfigsQuery {
  user_id?: string;
  category?: ConfigCategory;
  tags?: string[];
  is_public?: boolean;
  is_template?: boolean;
  search?: string;
  sort_by?: 'created_at' | 'updated_at' | 'download_count' | 'like_count';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ListConfigsResponse {
  configs: Config[];
  total: number;
  page: number;
  limit: number;
}
