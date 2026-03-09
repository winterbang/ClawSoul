-- =====================================================
-- ClawSoul 数据库迁移脚本
-- 在 Supabase SQL Editor 中执行
-- =====================================================

-- 注意：profiles 表通过触发器自动创建，无需手动插入
-- 新用户注册时会自动创建对应的 profile 记录

-- =====================================================
-- 1. 创建扩展
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. 用户扩展表
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    avatar_url TEXT,
    display_name TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    account_status TEXT DEFAULT 'active',
    plan_type TEXT DEFAULT 'free',
    total_configs INTEGER DEFAULT 0,
    total_downloads INTEGER DEFAULT 0,
    storage_used_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE profiles IS '用户扩展信息表';
COMMENT ON COLUMN profiles.preferences IS '用户偏好设置，JSON格式';

-- =====================================================
-- 3. 配置文件表
-- =====================================================
CREATE TABLE IF NOT EXISTS configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    tags TEXT[] DEFAULT '{}',
    category TEXT DEFAULT 'general',
    is_template BOOLEAN DEFAULT FALSE,
    template_id UUID REFERENCES configs(id),
    fork_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    version INTEGER DEFAULT 1,
    parent_version UUID,
    is_public BOOLEAN DEFAULT FALSE,
    collaborators UUID[] DEFAULT '{}',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT check_name_not_empty CHECK (name <> '')
);

COMMENT ON TABLE configs IS '用户配置文件表';
COMMENT ON COLUMN configs.content IS '配置内容，JSON格式存储';

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_configs_user_id ON configs(user_id);
CREATE INDEX IF NOT EXISTS idx_configs_is_template ON configs(is_template);
CREATE INDEX IF NOT EXISTS idx_configs_is_public ON configs(is_public);
CREATE INDEX IF NOT EXISTS idx_configs_category ON configs(category);
CREATE INDEX IF NOT EXISTS idx_configs_status ON configs(status);
CREATE INDEX IF NOT EXISTS idx_configs_tags ON configs USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_configs_created_at ON configs(created_at DESC);

-- =====================================================
-- 4. 下载记录表
-- =====================================================
CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID NOT NULL REFERENCES configs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    format TEXT NOT NULL,
    file_size_bytes INTEGER,
    user_agent TEXT,
    ip_hash TEXT,
    referrer TEXT,
    source TEXT DEFAULT 'web',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE downloads IS '配置下载记录表';

CREATE INDEX IF NOT EXISTS idx_downloads_config_id ON downloads(config_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_created_at ON downloads(created_at DESC);

-- =====================================================
-- 5. 配置版本历史表
-- =====================================================
CREATE TABLE IF NOT EXISTS config_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID NOT NULL REFERENCES configs(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content JSONB NOT NULL,
    change_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

COMMENT ON TABLE config_versions IS '配置文件版本历史';

CREATE INDEX IF NOT EXISTS idx_config_versions_config_id ON config_versions(config_id);
CREATE INDEX IF NOT EXISTS idx_config_versions_version ON config_versions(config_id, version_number);

-- =====================================================
-- 6. 用户活动日志表
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_hash TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE activity_logs IS '用户活动日志';

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- =====================================================
-- 7. 功能开关表
-- =====================================================
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage INTEGER DEFAULT 0,
    allowed_users UUID[] DEFAULT '{}',
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE feature_flags IS '功能开关配置表';

-- =====================================================
-- 8. 系统统计表
-- =====================================================
CREATE TABLE IF NOT EXISTS system_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stat_date DATE NOT NULL UNIQUE,
    new_users INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    new_configs INTEGER DEFAULT 0,
    total_configs INTEGER DEFAULT 0,
    total_downloads INTEGER DEFAULT 0,
    downloads_by_format JSONB DEFAULT '{}'::jsonb,
    top_configs UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE system_stats IS '系统每日统计数据';

-- =====================================================
-- 9. 触发器和函数
-- =====================================================

-- 自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_configs_updated_at ON configs;
CREATE TRIGGER update_configs_updated_at
    BEFORE UPDATE ON configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 新用户自动创建 profile
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 记录下载统计的函数
CREATE OR REPLACE FUNCTION public.record_download(
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

-- 增加 fork 计数
CREATE OR REPLACE FUNCTION public.increment_fork_count(config_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE configs 
    SET fork_count = fork_count + 1 
    WHERE id = config_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 10. 启用 RLS (Row Level Security)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE config_versions ENABLE ROW LEVEL SECURITY;

-- profiles 表策略
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- configs 表策略
DROP POLICY IF EXISTS "Users can view own configs" ON configs;
CREATE POLICY "Users can view own configs"
    ON configs FOR SELECT
    USING (auth.uid() = user_id OR is_public = TRUE);

DROP POLICY IF EXISTS "Users can create own configs" ON configs;
CREATE POLICY "Users can create own configs"
    ON configs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own configs" ON configs;
CREATE POLICY "Users can update own configs"
    ON configs FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own configs" ON configs;
CREATE POLICY "Users can delete own configs"
    ON configs FOR DELETE
    USING (auth.uid() = user_id);

-- downloads 表策略
DROP POLICY IF EXISTS "Users can view own downloads" ON downloads;
CREATE POLICY "Users can view own downloads"
    ON downloads FOR SELECT
    USING (auth.uid() = user_id);

-- activity_logs 表策略
DROP POLICY IF EXISTS "Users can view own activity" ON activity_logs;
CREATE POLICY "Users can view own activity"
    ON activity_logs FOR SELECT
    USING (auth.uid() = user_id);

-- config_versions 表策略
DROP POLICY IF EXISTS "Users can view own config versions" ON config_versions;
CREATE POLICY "Users can view own config versions"
    ON config_versions FOR SELECT
    USING (auth.uid() IN (
        SELECT user_id FROM configs WHERE id = config_versions.config_id
    ));

-- =====================================================
-- 11. 插入默认数据
-- =====================================================

-- 插入默认功能开关
INSERT INTO feature_flags (key, name, description, enabled, config) VALUES
('template_marketplace', '模板市场', '允许用户分享和发现模板', true, '{}'),
('collaboration', '协作功能', '多用户协作编辑配置', false, '{}'),
('version_history', '版本历史', '配置版本控制和回滚', true, '{}'),
('advanced_analytics', '高级分析', '详细的数据分析面板', false, '{}'),
('public_api', '公开 API', '允许第三方访问 API', false, '{"rate_limit": 100}')
ON CONFLICT (key) DO NOTHING;

-- 插入今日系统统计（如果不存在）
INSERT INTO system_stats (stat_date) VALUES (CURRENT_DATE)
ON CONFLICT (stat_date) DO NOTHING;

-- =====================================================
-- 完成！
-- =====================================================
SELECT 'Database setup complete!' as status;
