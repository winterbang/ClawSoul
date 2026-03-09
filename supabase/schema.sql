-- =====================================================
-- ClawSoul 数据库 Schema 设计
-- 支持用户配置存储、下载统计、可扩展架构
-- 版本: 1.0.0
-- =====================================================

-- =====================================================
-- 表: profiles (用户扩展信息表)
-- 描述: 扩展 Supabase Auth 的用户信息，存储用户偏好和统计数据
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    -- 主键，关联 Supabase Auth 用户表
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- 用户唯一标识名，通常使用邮箱或自定义用户名
    username TEXT UNIQUE,
    
    -- 用户头像 URL，支持 Gravatar 或自定义上传
    avatar_url TEXT,
    
    -- 用户显示名称，用于界面展示
    display_name TEXT,
    
    -- 用户偏好设置，JSONB 格式存储各种个性化配置
    -- 示例: {"theme": "dark", "language": "zh-CN", "default_export_format": "markdown"}
    preferences JSONB DEFAULT '{}'::jsonb,
    
    -- 账户状态: active(正常) | suspended(暂停) | premium(高级会员)
    account_status TEXT DEFAULT 'active',
    
    -- 套餐类型: free(免费) | pro(专业版) | enterprise(企业版)
    plan_type TEXT DEFAULT 'free',
    
    -- 用户创建的配置总数，用于快速统计
    total_configs INTEGER DEFAULT 0,
    
    -- 用户下载配置的总次数
    total_downloads INTEGER DEFAULT 0,
    
    -- 用户存储空间使用量（字节）
    storage_used_bytes BIGINT DEFAULT 0,
    
    -- 记录创建时间
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 记录最后更新时间
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 表注释
COMMENT ON TABLE profiles IS '用户扩展信息表，存储用户偏好设置、账户状态和使用统计';

-- 字段注释
COMMENT ON COLUMN profiles.id IS '主键，关联 auth.users 表的 UUID';
COMMENT ON COLUMN profiles.username IS '用户唯一标识名，用于 URL 和展示';
COMMENT ON COLUMN profiles.avatar_url IS '用户头像 URL，支持外部链接';
COMMENT ON COLUMN profiles.display_name IS '用户显示名称';
COMMENT ON COLUMN profiles.preferences IS '用户偏好设置，JSONB 格式存储主题、语言等配置';
COMMENT ON COLUMN profiles.account_status IS '账户状态: active(正常), suspended(暂停), premium(高级)';
COMMENT ON COLUMN profiles.plan_type IS '套餐类型: free(免费), pro(专业版), enterprise(企业版)';
COMMENT ON COLUMN profiles.total_configs IS '用户创建的配置总数';
COMMENT ON COLUMN profiles.total_downloads IS '用户下载配置的总次数';
COMMENT ON COLUMN profiles.storage_used_bytes IS '用户存储空间使用量（字节）';
COMMENT ON COLUMN profiles.created_at IS '记录创建时间';
COMMENT ON COLUMN profiles.updated_at IS '记录最后更新时间';

-- =====================================================
-- 函数: handle_new_user (新用户自动创建 profile)
-- 描述: 当新用户在 Supabase Auth 注册时，自动创建对应的 profile 记录
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user() IS '触发器函数：新用户注册时自动创建 profile 记录';

-- 触发器: 用户注册后自动创建 profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON TRIGGER on_auth_user_created ON auth.users IS '新用户注册时自动触发，创建对应的 profiles 记录';

-- =====================================================
-- 表: configs (配置文件主表)
-- 描述: 存储用户创建的所有 AI 助手配置文件
-- =====================================================
CREATE TABLE IF NOT EXISTS configs (
    -- 配置唯一标识符，自动生成 UUID
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 创建者用户 ID，关联 profiles 表
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- 配置名称，用户自定义的标题
    name TEXT NOT NULL,
    
    -- 配置描述，对配置的简要说明
    description TEXT,
    
    -- 配置内容，JSONB 格式存储完整的配置数据
    -- 包含 soul, identity, user, tools, skills, heartbeat 等模块
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- 标签数组，用于分类和搜索
    -- 示例: ['coding', 'assistant', 'productivity']
    tags TEXT[] DEFAULT '{}',
    
    -- 配置分类: general(通用) | assistant(助手) | workflow(工作流) | creative(创意) | coding(编程) | research(研究) | custom(自定义)
    category TEXT DEFAULT 'general',
    
    -- 是否为模板，模板可被其他用户发现和 Fork
    is_template BOOLEAN DEFAULT FALSE,
    
    -- 基于哪个模板创建，记录模板来源
    template_id UUID REFERENCES configs(id),
    
    -- 被 Fork 的次数，用于模板热门度排序
    fork_count INTEGER DEFAULT 0,
    
    -- 下载次数，统计该配置被下载的总次数
    download_count INTEGER DEFAULT 0,
    
    -- 查看次数，统计该配置被查看的次数
    view_count INTEGER DEFAULT 0,
    
    -- 点赞次数，用户点赞数
    like_count INTEGER DEFAULT 0,
    
    -- 当前版本号，从 1 开始递增
    version INTEGER DEFAULT 1,
    
    -- 父版本 ID，用于版本回滚
    parent_version UUID,
    
    -- 是否公开分享，公开后其他用户可查看和 Fork
    is_public BOOLEAN DEFAULT FALSE,
    
    -- 协作者列表，UUID 数组
    collaborators UUID[] DEFAULT '{}',
    
    -- 配置状态: active(正常) | archived(已归档) | deleted(已删除)
    status TEXT DEFAULT 'active',
    
    -- 创建时间
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 最后更新时间
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 最后访问时间，用于统计和清理
    last_accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 表注释
COMMENT ON TABLE configs IS 'AI 助手配置文件主表，存储用户创建的所有配置数据';

-- 字段注释
COMMENT ON COLUMN configs.id IS '配置唯一标识符，UUID 主键';
COMMENT ON COLUMN configs.user_id IS '创建者用户 ID，外键关联 auth.users';
COMMENT ON COLUMN configs.name IS '配置名称，用户自定义标题';
COMMENT ON COLUMN configs.description IS '配置描述，对配置的简要说明';
COMMENT ON COLUMN configs.content IS '配置内容，JSONB 格式存储 soul, identity, tools 等完整配置';
COMMENT ON COLUMN configs.tags IS '标签数组，用于分类和搜索';
COMMENT ON COLUMN configs.category IS '配置分类: general, assistant, workflow, creative, coding, research, custom';
COMMENT ON COLUMN configs.is_template IS '是否为模板，模板可被其他用户发现和 Fork';
COMMENT ON COLUMN configs.template_id IS '基于哪个模板创建，记录模板来源';
COMMENT ON COLUMN configs.fork_count IS '被 Fork 的次数，用于模板热门度排序';
COMMENT ON COLUMN configs.download_count IS '下载次数统计';
COMMENT ON COLUMN configs.view_count IS '查看次数统计';
COMMENT ON COLUMN configs.like_count IS '点赞次数统计';
COMMENT ON COLUMN configs.version IS '当前版本号，从 1 开始递增';
COMMENT ON COLUMN configs.parent_version IS '父版本 ID，用于版本回滚';
COMMENT ON COLUMN configs.is_public IS '是否公开分享，公开后其他用户可查看';
COMMENT ON COLUMN configs.collaborators IS '协作者列表，UUID 数组';
COMMENT ON COLUMN configs.status IS '配置状态: active(正常), archived(已归档), deleted(已删除)';
COMMENT ON COLUMN configs.created_at IS '配置创建时间';
COMMENT ON COLUMN configs.updated_at IS '配置最后更新时间';
COMMENT ON COLUMN configs.last_accessed_at IS '最后访问时间，用于统计和清理';

-- 索引优化
CREATE INDEX idx_configs_user_id ON configs(user_id);
CREATE INDEX idx_configs_is_template ON configs(is_template);
CREATE INDEX idx_configs_is_public ON configs(is_public);
CREATE INDEX idx_configs_category ON configs(category);
CREATE INDEX idx_configs_status ON configs(status);
CREATE INDEX idx_configs_tags ON configs USING GIN(tags);
CREATE INDEX idx_configs_created_at ON configs(created_at DESC);

-- 索引注释
COMMENT ON INDEX idx_configs_user_id IS '按用户查询配置的索引';
COMMENT ON INDEX idx_configs_is_template IS '按模板状态筛选的索引';
COMMENT ON INDEX idx_configs_is_public IS '按公开状态筛选的索引';
COMMENT ON INDEX idx_configs_category IS '按分类筛选的索引';
COMMENT ON INDEX idx_configs_status IS '按状态筛选的索引';
COMMENT ON INDEX idx_configs_tags IS 'GIN 索引，支持标签数组的高效查询';
COMMENT ON INDEX idx_configs_created_at IS '按创建时间排序的索引';

-- =====================================================
-- 表: downloads (下载记录表)
-- 描述: 详细的配置下载记录，支持多维度统计和分析
-- =====================================================
CREATE TABLE IF NOT EXISTS downloads (
    -- 下载记录唯一标识符
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 下载的配置 ID，关联 configs 表
    config_id UUID NOT NULL REFERENCES configs(id) ON DELETE CASCADE,
    
    -- 下载用户 ID，可能为空（匿名下载）
    user_id UUID REFERENCES auth.users(id),
    
    -- 下载格式: markdown | json | yaml | zip
    format TEXT NOT NULL,
    
    -- 文件大小（字节）
    file_size_bytes INTEGER,
    
    -- 用户代理字符串，用于分析客户端类型
    user_agent TEXT,
    
    -- IP 地址哈希，用于防刷和统计分析
    ip_hash TEXT,
    
    -- 来源页面 URL
    referrer TEXT,
    
    -- 下载来源: web(网页) | api(API调用) | cli(命令行) | vscode_extension(VSCode插件)
    source TEXT DEFAULT 'web',
    
    -- 下载时间
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 表注释
COMMENT ON TABLE downloads IS '配置下载记录表，详细记录每次下载的信息用于统计分析';

-- 字段注释
COMMENT ON COLUMN downloads.id IS '下载记录唯一标识符';
COMMENT ON COLUMN downloads.config_id IS '下载的配置 ID，外键关联 configs';
COMMENT ON COLUMN downloads.user_id IS '下载用户 ID，可能为空表示匿名下载';
COMMENT ON COLUMN downloads.format IS '下载格式: markdown, json, yaml, zip';
COMMENT ON COLUMN downloads.file_size_bytes IS '文件大小（字节）';
COMMENT ON COLUMN downloads.user_agent IS '用户代理字符串，用于分析客户端类型';
COMMENT ON COLUMN downloads.ip_hash IS 'IP 地址哈希，用于防刷和统计分析';
COMMENT ON COLUMN downloads.referrer IS '来源页面 URL';
COMMENT ON COLUMN downloads.source IS '下载来源: web, api, cli, vscode_extension';
COMMENT ON COLUMN downloads.created_at IS '下载时间';

-- 索引
CREATE INDEX idx_downloads_config_id ON downloads(config_id);
CREATE INDEX idx_downloads_user_id ON downloads(user_id);
CREATE INDEX idx_downloads_created_at ON downloads(created_at DESC);

-- 索引注释
COMMENT ON INDEX idx_downloads_config_id IS '按配置查询下载记录的索引';
COMMENT ON INDEX idx_downloads_user_id IS '按用户查询下载记录的索引';
COMMENT ON INDEX idx_downloads_created_at IS '按时间排序下载记录的索引';

-- =====================================================
-- 表: config_versions (配置版本历史表)
-- 描述: 保存配置的历史版本，支持版本回滚和审计
-- =====================================================
CREATE TABLE IF NOT EXISTS config_versions (
    -- 版本记录唯一标识符
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 关联的配置 ID
    config_id UUID NOT NULL REFERENCES configs(id) ON DELETE CASCADE,
    
    -- 版本号，从 1 开始递增
    version_number INTEGER NOT NULL,
    
    -- 该版本的配置内容快照
    content JSONB NOT NULL,
    
    -- 变更摘要，描述本次更新的内容
    change_summary TEXT,
    
    -- 版本创建时间
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 版本创建者
    created_by UUID REFERENCES auth.users(id)
);

-- 表注释
COMMENT ON TABLE config_versions IS '配置版本历史表，保存配置的所有历史版本快照';

-- 字段注释
COMMENT ON COLUMN config_versions.id IS '版本记录唯一标识符';
COMMENT ON COLUMN config_versions.config_id IS '关联的配置 ID';
COMMENT ON COLUMN config_versions.version_number IS '版本号，从 1 开始递增';
COMMENT ON COLUMN config_versions.content IS '该版本的配置内容快照';
COMMENT ON COLUMN config_versions.change_summary IS '变更摘要，描述本次更新的内容';
COMMENT ON COLUMN config_versions.created_at IS '版本创建时间';
COMMENT ON COLUMN config_versions.created_by IS '版本创建者用户 ID';

-- 索引
CREATE INDEX idx_config_versions_config_id ON config_versions(config_id);
CREATE INDEX idx_config_versions_version ON config_versions(config_id, version_number);

-- 索引注释
COMMENT ON INDEX idx_config_versions_config_id IS '按配置查询版本历史的索引';
COMMENT ON INDEX idx_config_versions_version IS '按配置和版本号查询的复合索引';

-- =====================================================
-- 表: activity_logs (用户活动日志表)
-- 描述: 记录用户的所有操作，用于审计、分析和推荐
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_logs (
    -- 活动记录唯一标识符
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 操作用户 ID
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- 操作类型: create(创建) | update(更新) | delete(删除) | download(下载) | share(分享) | fork(Fork) | view(查看) | export(导出)
    action TEXT NOT NULL,
    
    -- 实体类型: config(配置) | profile(用户资料) | template(模板) | user(用户)
    entity_type TEXT NOT NULL,
    
    -- 实体 ID，被操作的对象 ID
    entity_id UUID,
    
    -- 额外元数据，JSONB 格式存储操作相关的额外信息
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- IP 地址哈希，用于安全审计
    ip_hash TEXT,
    
    -- 用户代理字符串
    user_agent TEXT,
    
    -- 操作时间
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 表注释
COMMENT ON TABLE activity_logs IS '用户活动日志表，记录所有用户操作用于审计和分析';

-- 字段注释
COMMENT ON COLUMN activity_logs.id IS '活动记录唯一标识符';
COMMENT ON COLUMN activity_logs.user_id IS '操作用户 ID';
COMMENT ON COLUMN activity_logs.action IS '操作类型: create, update, delete, download, share, fork, view, export';
COMMENT ON COLUMN activity_logs.entity_type IS '实体类型: config, profile, template, user';
COMMENT ON COLUMN activity_logs.entity_id IS '实体 ID，被操作的对象 ID';
COMMENT ON COLUMN activity_logs.metadata IS '额外元数据，JSONB 格式';
COMMENT ON COLUMN activity_logs.ip_hash IS 'IP 地址哈希，用于安全审计';
COMMENT ON COLUMN activity_logs.user_agent IS '用户代理字符串';
COMMENT ON COLUMN activity_logs.created_at IS '操作时间';

-- 索引
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- 索引注释
COMMENT ON INDEX idx_activity_logs_user_id IS '按用户查询活动日志的索引';
COMMENT ON INDEX idx_activity_logs_action IS '按操作类型查询的索引';
COMMENT ON INDEX idx_activity_logs_created_at IS '按时间排序活动日志的索引';

-- =====================================================
-- 表: feature_flags (功能开关表)
-- 描述: 系统功能开关配置，支持功能迭代和灰度发布
-- =====================================================
CREATE TABLE IF NOT EXISTS feature_flags (
    -- 功能记录唯一标识符
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 功能唯一标识键，用于代码中引用
    key TEXT UNIQUE NOT NULL,
    
    -- 功能显示名称
    name TEXT NOT NULL,
    
    -- 功能描述
    description TEXT,
    
    -- 是否全局启用
    enabled BOOLEAN DEFAULT FALSE,
    
    -- 灰度发布百分比，0-100
    rollout_percentage INTEGER DEFAULT 0,
    
    -- 白名单用户列表，UUID 数组
    allowed_users UUID[] DEFAULT '{}',
    
    -- 功能配置参数，JSONB 格式
    config JSONB DEFAULT '{}'::jsonb,
    
    -- 创建时间
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 更新时间
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 表注释
COMMENT ON TABLE feature_flags IS '功能开关表，支持功能迭代、灰度发布和 A/B 测试';

-- 字段注释
COMMENT ON COLUMN feature_flags.id IS '功能记录唯一标识符';
COMMENT ON COLUMN feature_flags.key IS '功能唯一标识键，用于代码中引用';
COMMENT ON COLUMN feature_flags.name IS '功能显示名称';
COMMENT ON COLUMN feature_flags.description IS '功能描述';
COMMENT ON COLUMN feature_flags.enabled IS '是否全局启用';
COMMENT ON COLUMN feature_flags.rollout_percentage IS '灰度发布百分比，0-100';
COMMENT ON COLUMN feature_flags.allowed_users IS '白名单用户列表，UUID 数组';
COMMENT ON COLUMN feature_flags.config IS '功能配置参数，JSONB 格式';
COMMENT ON COLUMN feature_flags.created_at IS '创建时间';
COMMENT ON COLUMN feature_flags.updated_at IS '更新时间';

-- =====================================================
-- 表: system_stats (系统统计表)
-- 描述: 每日聚合统计数据，便于快速查询和报表生成
-- =====================================================
CREATE TABLE IF NOT EXISTS system_stats (
    -- 统计记录唯一标识符
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 统计日期，唯一键
    stat_date DATE NOT NULL UNIQUE,
    
    -- 当日新增用户数
    new_users INTEGER DEFAULT 0,
    
    -- 当日活跃用户数
    active_users INTEGER DEFAULT 0,
    
    -- 当日新增配置数
    new_configs INTEGER DEFAULT 0,
    
    -- 配置总数（截至当日）
    total_configs INTEGER DEFAULT 0,
    
    -- 当日总下载次数
    total_downloads INTEGER DEFAULT 0,
    
    -- 按格式分布的下载数，JSONB 格式
    -- 示例: {"markdown": 100, "json": 50, "yaml": 30, "zip": 20}
    downloads_by_format JSONB DEFAULT '{}'::jsonb,
    
    -- 当日热门配置 ID 列表，UUID 数组
    top_configs UUID[] DEFAULT '{}',
    
    -- 记录创建时间
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 记录更新时间
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 表注释
COMMENT ON TABLE system_stats IS '系统统计表，每日聚合统计数据便于快速查询';

-- 字段注释
COMMENT ON COLUMN system_stats.id IS '统计记录唯一标识符';
COMMENT ON COLUMN system_stats.stat_date IS '统计日期，唯一键';
COMMENT ON COLUMN system_stats.new_users IS '当日新增用户数';
COMMENT ON COLUMN system_stats.active_users IS '当日活跃用户数';
COMMENT ON COLUMN system_stats.new_configs IS '当日新增配置数';
COMMENT ON COLUMN system_stats.total_configs IS '配置总数（截至当日）';
COMMENT ON COLUMN system_stats.total_downloads IS '当日总下载次数';
COMMENT ON COLUMN system_stats.downloads_by_format IS '按格式分布的下载数，JSONB 格式';
COMMENT ON COLUMN system_stats.top_configs IS '当日热门配置 ID 列表';
COMMENT ON COLUMN system_stats.created_at IS '记录创建时间';
COMMENT ON COLUMN system_stats.updated_at IS '记录更新时间';

-- =====================================================
-- RLS (Row Level Security) 策略
-- 描述: 行级安全策略，确保用户只能访问自己的数据
-- =====================================================

-- Profiles 表策略
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户可查看自己的资料"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "用户可更新自己的资料"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

COMMENT ON POLICY "用户可查看自己的资料" ON profiles IS '用户只能查看自己的 profile 资料';
COMMENT ON POLICY "用户可更新自己的资料" ON profiles IS '用户只能更新自己的 profile 资料';

-- Configs 表策略
ALTER TABLE configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户可查看自己的配置和公开配置"
    ON configs FOR SELECT
    USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "用户可创建自己的配置"
    ON configs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可更新自己的配置"
    ON configs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "用户可删除自己的配置"
    ON configs FOR DELETE
    USING (auth.uid() = user_id);

COMMENT ON POLICY "用户可查看自己的配置和公开配置" ON configs IS '用户可以查看自己的所有配置，以及其他用户的公开配置';
COMMENT ON POLICY "用户可创建自己的配置" ON configs IS '用户只能创建属于自己的配置';
COMMENT ON POLICY "用户可更新自己的配置" ON configs IS '用户只能更新自己创建的配置';
COMMENT ON POLICY "用户可删除自己的配置" ON configs IS '用户只能删除自己创建的配置';

-- Downloads 表策略
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户可查看自己的下载记录"
    ON downloads FOR SELECT
    USING (auth.uid() = user_id);

COMMENT ON POLICY "用户可查看自己的下载记录" ON downloads IS '用户只能查看自己的下载历史记录';

-- Activity Logs 表策略
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户可查看自己的活动日志"
    ON activity_logs FOR SELECT
    USING (auth.uid() = user_id);

COMMENT ON POLICY "用户可查看自己的活动日志" ON activity_logs IS '用户只能查看自己的操作日志';

-- =====================================================
-- 函数和触发器
-- =====================================================

-- 函数: update_updated_at_column
-- 描述: 自动更新 updated_at 字段为当前时间
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS '触发器函数：自动更新记录的 updated_at 字段为当前时间';

-- 触发器: 自动更新 profiles.updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TRIGGER update_profiles_updated_at ON profiles IS '更新 profile 时自动更新 updated_at 字段';

-- 触发器: 自动更新 configs.updated_at
CREATE TRIGGER update_configs_updated_at
    BEFORE UPDATE ON configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TRIGGER update_configs_updated_at ON configs IS '更新 config 时自动更新 updated_at 字段';

-- 函数: increment_config_stats
-- 描述: 创建配置时自动增加用户的配置计数
CREATE OR REPLACE FUNCTION increment_config_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles 
    SET total_configs = total_configs + 1
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION increment_config_stats() IS '触发器函数：创建配置时自动增加用户的 total_configs 计数';

-- 触发器: 创建配置时更新统计
CREATE TRIGGER on_config_created
    AFTER INSERT ON configs
    FOR EACH ROW EXECUTE FUNCTION increment_config_stats();

COMMENT ON TRIGGER on_config_created ON configs IS '创建新配置后自动增加用户的配置计数';

-- 函数: record_download
-- 描述: 记录下载并更新相关统计
CREATE OR REPLACE FUNCTION record_download(
    p_config_id UUID,
    p_user_id UUID DEFAULT NULL,
    p_format TEXT DEFAULT 'markdown',
    p_source TEXT DEFAULT 'web'
) RETURNS UUID AS $$
DECLARE
    v_download_id UUID;
BEGIN
    -- 创建下载记录
    INSERT INTO downloads (config_id, user_id, format, source)
    VALUES (p_config_id, p_user_id, p_format, p_source)
    RETURNING id INTO v_download_id;
    
    -- 更新配置下载数
    UPDATE configs 
    SET download_count = download_count + 1 
    WHERE id = p_config_id;
    
    -- 更新用户下载数
    IF p_user_id IS NOT NULL THEN
        UPDATE profiles 
        SET total_downloads = total_downloads + 1 
        WHERE id = p_user_id;
    END IF;
    
    RETURN v_download_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION record_download(UUID, UUID, TEXT, TEXT) IS '记录下载操作，同时更新配置和用户的下载统计。参数: p_config_id(配置ID), p_user_id(用户ID,可为空), p_format(格式), p_source(来源)';
