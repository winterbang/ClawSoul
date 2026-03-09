-- ClawSoul 数据库 Schema 设计
-- 支持用户配置存储、下载统计、可扩展架构

-- =====================================================
-- 1. 用户扩展表 (Profiles)
-- 扩展 Supabase Auth 的用户信息
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    avatar_url TEXT,
    display_name TEXT,
    
    -- 用户偏好设置
    preferences JSONB DEFAULT '{}'::jsonb,
    -- 示例: {"theme": "dark", "language": "zh-CN", "default_export_format": "markdown"}
    
    -- 账户状态
    account_status TEXT DEFAULT 'active', -- active, suspended, premium
    plan_type TEXT DEFAULT 'free', -- free, pro, enterprise
    
    -- 使用统计
    total_configs INTEGER DEFAULT 0,
    total_downloads INTEGER DEFAULT 0,
    storage_used_bytes BIGINT DEFAULT 0,
    
    -- 时间戳
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 自动创建用户 profile 的触发器
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name)
    VALUES (
        NEW.id,
        NEW.email, -- 默认使用邮箱作为 username
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 2. 配置文件表 (Configs)
-- 存储用户创建的所有配置
-- =====================================================
CREATE TABLE IF NOT EXISTS configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- 基础信息
    name TEXT NOT NULL,
    description TEXT,
    
    -- 配置内容 (核心数据结构)
    -- 使用 JSONB 存储完整的配置对象，便于灵活扩展
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- 示例结构见下方 CONTENT_SCHEMA
    
    -- 元数据
    tags TEXT[] DEFAULT '{}',
    category TEXT DEFAULT 'general', -- general, assistant, workflow, etc.
    
    -- 模板相关
    is_template BOOLEAN DEFAULT FALSE, -- 是否作为模板分享
    template_id UUID REFERENCES configs(id), -- 基于哪个模板创建
    fork_count INTEGER DEFAULT 0, -- 被 fork 次数
    
    -- 统计
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    
    -- 版本控制
    version INTEGER DEFAULT 1,
    parent_version UUID, -- 上一个版本 ID
    
    -- 协作
    is_public BOOLEAN DEFAULT FALSE, -- 是否公开分享
    collaborators UUID[] DEFAULT '{}', -- 协作者列表
    
    -- 状态
    status TEXT DEFAULT 'active', -- active, archived, deleted
    
    -- 时间戳
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引优化查询
CREATE INDEX idx_configs_user_id ON configs(user_id);
CREATE INDEX idx_configs_is_template ON configs(is_template);
CREATE INDEX idx_configs_is_public ON configs(is_public);
CREATE INDEX idx_configs_category ON configs(category);
CREATE INDEX idx_configs_tags ON configs USING GIN(tags);
CREATE INDEX idx_configs_created_at ON configs(created_at DESC);

-- =====================================================
-- 3. 下载记录表 (Downloads)
-- 详细的下载统计，支持分析
-- =====================================================
CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 关联
    config_id UUID NOT NULL REFERENCES configs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id), -- 可能匿名下载
    
    -- 下载信息
    format TEXT NOT NULL, -- markdown, json, yaml, zip
    file_size_bytes INTEGER,
    
    -- 客户端信息 (用于分析)
    user_agent TEXT,
    ip_hash TEXT, -- IP 哈希，用于防刷
    referrer TEXT,
    
    -- 下载来源
    source TEXT DEFAULT 'web', -- web, api, cli, vscode_extension
    
    -- 时间戳
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_downloads_config_id ON downloads(config_id);
CREATE INDEX idx_downloads_user_id ON downloads(user_id);
CREATE INDEX idx_downloads_created_at ON downloads(created_at DESC);

-- =====================================================
-- 4. 配置版本历史表 (ConfigVersions)
-- 保存配置的历史版本
-- =====================================================
CREATE TABLE IF NOT EXISTS config_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_id UUID NOT NULL REFERENCES configs(id) ON DELETE CASCADE,
    
    version_number INTEGER NOT NULL,
    content JSONB NOT NULL,
    change_summary TEXT, -- 变更描述
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_config_versions_config_id ON config_versions(config_id);
CREATE INDEX idx_config_versions_version ON config_versions(config_id, version_number);

-- =====================================================
-- 5. 用户活动日志表 (ActivityLogs)
-- 记录用户操作，支持审计和分析
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    action TEXT NOT NULL, -- create, update, delete, download, share, fork
    entity_type TEXT NOT NULL, -- config, profile, template
    entity_id UUID,
    
    metadata JSONB DEFAULT '{}'::jsonb, -- 额外信息
    
    ip_hash TEXT,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- =====================================================
-- 6. 系统配置/功能开关表 (FeatureFlags)
-- 支持功能迭代和灰度发布
-- =====================================================
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    key TEXT UNIQUE NOT NULL, -- 功能标识
    name TEXT NOT NULL,
    description TEXT,
    
    enabled BOOLEAN DEFAULT FALSE,
    
    -- 灰度发布配置
    rollout_percentage INTEGER DEFAULT 0, -- 0-100
    allowed_users UUID[] DEFAULT '{}', -- 白名单用户
    
    -- 配置数据
    config JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. 系统统计表 (SystemStats)
-- 聚合统计，便于快速查询
-- =====================================================
CREATE TABLE IF NOT EXISTS system_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    stat_date DATE NOT NULL UNIQUE,
    
    -- 用户统计
    new_users INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    
    -- 配置统计
    new_configs INTEGER DEFAULT 0,
    total_configs INTEGER DEFAULT 0,
    
    -- 下载统计
    total_downloads INTEGER DEFAULT 0,
    downloads_by_format JSONB DEFAULT '{}'::jsonb,
    -- 示例: {"markdown": 100, "json": 50, "yaml": 30}
    
    -- 热门配置
    top_configs UUID[] DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RLS (Row Level Security) 策略
-- =====================================================

-- Profiles 表
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Configs 表
ALTER TABLE configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own configs"
    ON configs FOR SELECT
    USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can create own configs"
    ON configs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own configs"
    ON configs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own configs"
    ON configs FOR DELETE
    USING (auth.uid() = user_id);

-- Downloads 表
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own downloads"
    ON downloads FOR SELECT
    USING (auth.uid() = user_id);

-- Activity Logs 表
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity"
    ON activity_logs FOR SELECT
    USING (auth.uid() = user_id);

-- =====================================================
-- 函数和触发器
-- =====================================================

-- 自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configs_updated_at
    BEFORE UPDATE ON configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 更新配置统计的触发器
CREATE OR REPLACE FUNCTION increment_config_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- 更新用户的配置数量
    UPDATE profiles 
    SET total_configs = total_configs + 1
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_config_created
    AFTER INSERT ON configs
    FOR EACH ROW EXECUTE FUNCTION increment_config_stats();

-- 记录下载统计的函数
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
