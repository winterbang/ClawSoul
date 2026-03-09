# ClawSoul 数据库架构设计文档

## 📋 目录

1. [设计原则](#设计原则)
2. [核心表结构](#核心表结构)
3. [扩展性设计](#扩展性设计)
4. [安全策略](#安全策略)
5. [性能优化](#性能优化)
6. [使用示例](#使用示例)

---

## 设计原则

### 1. JSONB 优先
- 配置内容使用 `JSONB` 存储，支持灵活的数据结构
- 无需修改表结构即可添加新字段
- 支持 PostgreSQL 的 JSON 索引和查询

### 2. 软删除
- 所有核心数据使用软删除（`status` 字段）
- 保留数据历史，支持误删恢复
- 便于审计和数据分析

### 3. 事件驱动
- 关键操作记录到 `activity_logs`
- 支持审计、分析和触发后续流程
- 便于调试和故障排查

### 4. 版本控制
- 配置支持版本历史（`config_versions`）
- 支持回滚到任意版本
- 记录变更摘要

### 5. 统计分离
- 详细记录存 `downloads`，聚合统计存 `system_stats`
- 便于快速查询和大数据分析

---

## 核心表结构

### 1. profiles - 用户扩展表

扩展 Supabase Auth 的用户信息，存储用户偏好和统计。

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username TEXT UNIQUE,
    avatar_url TEXT,
    display_name TEXT,
    preferences JSONB DEFAULT '{}',  -- 灵活的用户设置
    account_status TEXT DEFAULT 'active',
    plan_type TEXT DEFAULT 'free',
    total_configs INTEGER DEFAULT 0,
    total_downloads INTEGER DEFAULT 0,
    storage_used_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**扩展场景：**
- 添加新的用户偏好：直接在 `preferences` JSONB 中添加
- 新的账户类型：修改 `plan_type` 约束或添加新字段
- 更多统计：添加新字段或存到 JSONB

---

### 2. configs - 配置主表

存储用户创建的所有配置，是系统的核心表。

```sql
CREATE TABLE configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    description TEXT,
    content JSONB NOT NULL,          -- 核心配置内容
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
    last_accessed_at TIMESTAMPTZ DEFAULT NOW()
);
```

**content JSONB 结构：**

```typescript
interface ConfigContent {
  agentName: string;
  agentDescription?: string;
  agentEmoji?: string;
  soul?: SoulContent;           // SOUL.md
  identity?: IdentityContent;   // IDENTITY.md
  user?: UserContent;           // USER.md
  tools?: ToolsContent;         // TOOLS.md
  skills?: SkillConfig[];       // 技能配置
  heartbeat?: HeartbeatConfig;  // 心跳配置
  customFiles?: CustomFile[];   // 自定义文件
  version: string;
  created_with: 'clawsoul';
  schema_version: number;       // 便于数据迁移
}
```

**扩展场景：**
- 新的配置模块：在 `content` JSONB 中添加
- 新的分类：修改 `category` 约束
- 协作功能：`collaborators` 数组支持多人协作
- 版本管理：配合 `config_versions` 表实现

---

### 3. downloads - 下载记录表

详细的下载记录，支持多维度的数据分析。

```sql
CREATE TABLE downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_id UUID NOT NULL REFERENCES configs(id),
    user_id UUID REFERENCES auth.users(id),
    format TEXT NOT NULL,            -- markdown, json, yaml, zip
    file_size_bytes INTEGER,
    user_agent TEXT,                 -- 客户端信息
    ip_hash TEXT,                    -- IP 哈希，防刷
    referrer TEXT,
    source TEXT DEFAULT 'web',       -- web, api, cli, vscode_extension
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**分析场景：**
- 热门格式统计：`GROUP BY format`
- 下载来源分析：`GROUP BY source`
- 防刷检测：`COUNT(*) GROUP BY ip_hash`
- 用户行为分析：关联 `user_agent` 和 `referrer`

---

### 4. config_versions - 版本历史表

配置版本控制，支持回滚和审计。

```sql
CREATE TABLE config_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_id UUID NOT NULL REFERENCES configs(id),
    version_number INTEGER NOT NULL,
    content JSONB NOT NULL,
    change_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);
```

**使用场景：**
- 查看历史版本
- 回滚到指定版本
- 对比版本差异
- 审计配置变更

---

### 5. activity_logs - 活动日志表

记录所有用户操作，支持审计和分析。

```sql
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    action TEXT NOT NULL,            -- create, update, delete, download...
    entity_type TEXT NOT NULL,       -- config, profile, template
    entity_id UUID,
    metadata JSONB DEFAULT '{}',     -- 额外信息
    ip_hash TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**扩展场景：**
- 新的操作类型：添加 `action` 值
- 新的实体类型：添加 `entity_type` 值
- 更多上下文：存到 `metadata` JSONB

---

### 6. feature_flags - 功能开关表

支持功能迭代和灰度发布。

```sql
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,        -- 功能标识
    name TEXT NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage INTEGER DEFAULT 0,  -- 0-100
    allowed_users UUID[] DEFAULT '{}',     -- 白名单
    config JSONB DEFAULT '{}',       -- 功能配置
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**使用场景：**
- 新功能灰度发布
- A/B 测试
- 功能降级
- 付费功能控制

---

### 7. system_stats - 系统统计表

每日聚合统计，便于快速查询。

```sql
CREATE TABLE system_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stat_date DATE NOT NULL UNIQUE,
    new_users INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    new_configs INTEGER DEFAULT 0,
    total_configs INTEGER DEFAULT 0,
    total_downloads INTEGER DEFAULT 0,
    downloads_by_format JSONB DEFAULT '{}',
    top_configs UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**统计维度：**
- 日活跃用户 (DAU)
- 新增用户/配置
- 下载量趋势
- 热门配置排行

---

## 扩展性设计

### 1. 配置内容扩展

**场景：添加新的配置模块**

```typescript
// 在 ConfigContent 中添加新模块
interface ConfigContent {
  // ... 现有字段
  
  // 新增：工作流配置
  workflows?: WorkflowConfig[];
  
  // 新增：定时任务
  scheduledTasks?: ScheduledTask[];
  
  // 新增：集成配置
  integrations?: IntegrationConfig;
}

// 无需修改数据库表结构！
```

### 2. 用户偏好扩展

**场景：添加新的用户设置**

```typescript
// 在 preferences JSONB 中添加
interface UserPreferences {
  theme?: 'dark' | 'light';
  
  // 新增：快捷键配置
  keyboardShortcuts?: Record<string, string>;
  
  // 新增：数据同步设置
  syncSettings?: {
    autoSync: boolean;
    syncInterval: number;
  };
}
```

### 3. 统计指标扩展

**场景：添加新的统计维度**

```sql
-- 方案 1：添加到现有 JSONB
ALTER TABLE system_stats 
ADD COLUMN IF NOT EXISTS new_metrics JSONB DEFAULT '{}';

-- 方案 2：创建新的统计表
CREATE TABLE feature_usage_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stat_date DATE NOT NULL,
    feature_name TEXT NOT NULL,
    usage_count INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'
);
```

### 4. 协作功能扩展

**场景：添加评论功能**

```sql
-- 创建评论表
CREATE TABLE config_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_id UUID REFERENCES configs(id),
    user_id UUID REFERENCES auth.users(id),
    content TEXT NOT NULL,
    parent_id UUID REFERENCES config_comments(id),  -- 回复
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 在 configs 表中添加评论数统计
ALTER TABLE configs 
ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;
```

---

## 安全策略

### RLS (Row Level Security)

所有核心表都启用了 RLS，确保用户只能访问自己的数据。

```sql
-- Configs 表的策略示例
CREATE POLICY "Users can view own configs"
    ON configs FOR SELECT
    USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can update own configs"
    ON configs FOR UPDATE
    USING (auth.uid() = user_id);
```

### 数据验证

使用数据库约束和触发器确保数据完整性。

```sql
-- 检查配置名称不为空
ALTER TABLE configs 
ADD CONSTRAINT check_name_not_empty CHECK (name <> '');

-- 检查标签数量限制
CREATE OR REPLACE FUNCTION check_tags_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF array_length(NEW.tags, 1) > 10 THEN
        RAISE EXCEPTION 'Too many tags (max 10)';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 性能优化

### 索引策略

```sql
-- 常用查询索引
CREATE INDEX idx_configs_user_id ON configs(user_id);
CREATE INDEX idx_configs_is_public ON configs(is_public);
CREATE INDEX idx_configs_created_at ON configs(created_at DESC);

-- GIN 索引（用于数组和 JSONB）
CREATE INDEX idx_configs_tags ON configs USING GIN(tags);
CREATE INDEX idx_configs_content ON configs USING GIN(content);

-- 复合索引
CREATE INDEX idx_configs_template_public 
ON configs(is_template, is_public) 
WHERE is_template = TRUE AND is_public = TRUE;
```

### 查询优化

```sql
-- 使用覆盖索引的查询
SELECT id, name, download_count 
FROM configs 
WHERE user_id = 'uuid' AND status = 'active'
ORDER BY updated_at DESC;

-- 分页查询
SELECT * FROM configs
WHERE user_id = 'uuid'
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;
```

---

## 使用示例

### 创建配置

```javascript
import { createConfig } from '@/utils/configApi.js'

const config = await createConfig({
  name: '我的 AI 助手',
  description: '用于代码审查的 AI 助手',
  content: {
    agentName: 'CodeReviewer',
    agentEmoji: '🔍',
    soul: {
      coreTruths: ['专业', '严谨'],
      vibe: '技术专家风格'
    },
    // ... 更多配置
  },
  tags: ['coding', 'review'],
  category: 'coding'
})
```

### 下载配置

```javascript
import { recordDownload } from '@/utils/configApi.js'

// 用户点击下载按钮
await recordDownload(configId, 'markdown', 'web')

// 生成下载文件
const { data: config } = await supabase
  .from('configs')
  .select('content')
  .eq('id', configId)
  .single()

// 转换为 Markdown 并下载
const markdown = generateMarkdown(config.content)
downloadFile(markdown, 'config.md')
```

### Fork 配置

```javascript
import { forkConfig } from '@/utils/configApi.js'

// Fork 一个公开模板
const newConfig = await forkConfig(
  'template-uuid',
  '我的自定义助手'
)
```

---

## 数据迁移

### 版本升级

```sql
-- 添加 schema_version 字段到 content
UPDATE configs
SET content = content || '{"schema_version": 2}'::jsonb
WHERE (content->>'schema_version') IS NULL;
```

### 数据清理

```sql
-- 清理已删除超过 30 天的配置
DELETE FROM configs
WHERE status = 'deleted'
  AND updated_at < NOW() - INTERVAL '30 days';

-- 归档旧版本
INSERT INTO config_versions_archive
SELECT * FROM config_versions
WHERE created_at < NOW() - INTERVAL '90 days';
```

---

## 总结

这个数据结构设计提供了：

1. **灵活性** - JSONB 存储支持任意扩展
2. **安全性** - RLS 确保数据隔离
3. **可追溯性** - 版本控制和活动日志
4. **可分析性** - 详细的下载和统计记录
5. **可维护性** - 软删除和归档策略

所有表都考虑了未来功能迭代的需求，可以通过添加 JSONB 字段或新表来扩展功能，无需大规模重构。
