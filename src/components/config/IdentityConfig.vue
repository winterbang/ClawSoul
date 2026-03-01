<!-- IdentityConfig.vue -->
<template>
  <div class="glass rounded-xl p-6 space-y-6">
    <h2 class="text-xl font-semibold flex items-center gap-2">
      <Fingerprint class="w-5 h-5 text-cyber-accent" />
      基础身份 IDENTITY
    </h2>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">AI 名字</label>
        <input 
          :value="config.name"
          @input="$emit('update:config', { ...config, name: $event.target.value })"
          type="text" 
          placeholder="例如：吉量"
          class="cyber-input w-full"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">形象描述</label>
        <input 
          :value="config.creature"
          @input="$emit('update:config', { ...config, creature: $event.target.value })"
          type="text" 
          placeholder="例如：传说中的吉量马 — 乘之寿千岁 🐴"
          class="cyber-input w-full"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">性格特点</label>
        <input 
          :value="config.vibe"
          @input="$emit('update:config', { ...config, vibe: $event.target.value })"
          type="text" 
          placeholder="例如：朴素、耐心、真诚"
          class="cyber-input w-full"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Emoji 标识</label>
        <div class="flex gap-2">
          <input 
            :value="config.emoji"
            @input="$emit('update:config', { ...config, emoji: $event.target.value })"
            type="text" 
            placeholder="🐴"
            class="cyber-input w-20 text-center"
            maxlength="2"
          />
          <div class="flex-1 flex items-center gap-2 px-4 glass rounded-lg overflow-x-auto">
            <span 
              v-for="e in presetEmojis" 
              :key="e" 
              @click="$emit('update:config', { ...config, emoji: e })"
              class="text-2xl cursor-pointer hover:scale-125 transition-transform flex-shrink-0"
              :class="config.emoji === e ? 'opacity-100' : 'opacity-50'"
            >
              {{ e }}
            </span>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">角色定位</label>
        <div class="grid grid-cols-3 gap-2">
          <button 
            v-for="role in roles" 
            :key="role.id"
            @click="$emit('toggle-role', role.id)"
            class="p-3 rounded-lg border transition-all text-sm"
            :class="config.roles.includes(role.id) 
              ? 'border-cyber-accent bg-cyber-accent/10 text-cyber-accent' 
              : 'border-cyber-600 hover:border-cyber-accent/50'"
          >
            {{ role.name }}
          </button>
        </div>
        
        <!-- 角色描述编辑 -->
        <div v-if="config.roles.length > 0" class="mt-4 space-y-3">
          <p class="text-xs text-gray-400">自定义角色描述：</p>
          <div v-for="roleId in config.roles" :key="roleId" class="space-y-1">
            <label class="text-xs font-medium text-cyber-accent">
              {{ roles.find(r => r.id === roleId)?.name }}
            </label>
            <input 
              :value="config.roleDescriptions[roleId]"
              @input="$emit('update:role-desc', roleId, $event.target.value)"
              type="text" 
              placeholder="描述这个角色的具体定位..."
              class="cyber-input w-full text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Fingerprint } from 'lucide-vue-next'

defineProps({
  config: Object,
  roles: Array,
  presetEmojis: Array
})

defineEmits(['update:config', 'toggle-role', 'update:role-desc'])
</script>