<!-- IdentityConfig.vue -->
<template>
  <div class="glass rounded-xl p-6 space-y-6">
    <div class="flex items-center gap-2">
      <h2 class="text-xl font-semibold flex items-center gap-2 text-[var(--text-primary)]">
        <Fingerprint class="w-5 h-5 text-[var(--accent-primary)]" />
        {{ $t('identity.title') }}
      </h2>
      <TooltipIcon position="right">
        {{ $t('identity.tooltip') }}
      </TooltipIcon>
    </div>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2 text-[var(--text-primary)]">{{ $t('identity.name') }}</label>
        <input 
          :value="config.name"
          @input="$emit('update:config', { ...config, name: $event.target.value })"
          type="text" 
          :placeholder="$t('identity.namePlaceholder')"
          class="cyber-input w-full"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2 text-[var(--text-primary)]">{{ $t('identity.creature') }}</label>
        <input 
          :value="config.creature"
          @input="$emit('update:config', { ...config, creature: $event.target.value })"
          type="text" 
          :placeholder="$t('identity.creaturePlaceholder')"
          class="cyber-input w-full"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2 text-[var(--text-primary)]">{{ $t('identity.vibe') }}</label>
        <input 
          :value="config.vibe"
          @input="$emit('update:config', { ...config, vibe: $event.target.value })"
          type="text" 
          :placeholder="$t('identity.vibePlaceholder')"
          class="cyber-input w-full"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2 text-[var(--text-primary)]">{{ $t('identity.emoji') }}</label>
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
        <div class="flex items-center gap-2 mb-2">
          <label class="block text-sm font-medium text-[var(--text-primary)]">{{ $t('identity.roles') }}</label>
          <TooltipIcon>{{ $t('identity.rolesTooltip') }}</TooltipIcon>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <button 
            v-for="role in roles" 
            :key="role.id"
            @click="$emit('toggle-role', role.id)"
            class="p-3 rounded-lg border transition-all text-sm"
            :class="config.roles.includes(role.id) 
              ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' 
              : 'border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 text-[var(--text-secondary)]'"
          >
            {{ $t(`roles.${role.id}`, role.name) }}
          </button>
        </div>
        
        <!-- 角色描述编辑 -->
        <div v-if="config.roles.length > 0" class="mt-4 space-y-3">
          <p class="text-xs text-[var(--text-muted)]">{{ $t('identity.roleDescTitle') || '自定义角色描述：' }}</p>
          <div v-for="roleId in config.roles" :key="roleId" class="space-y-1">
            <label class="text-xs font-medium text-[var(--accent-primary)]">
              {{ $t(`roles.${roleId}`, roles.find(r => r.id === roleId)?.name) }}
            </label>
            <input 
              :value="config.roleDescriptions[roleId]"
              @input="$emit('update:role-desc', roleId, $event.target.value)"
              type="text" 
              :placeholder="$t('identity.roleDescPlaceholder') || '描述这个角色的具体定位...'"
              class="cyber-input w-full text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Fingerprint } from 'lucide-vue-next'
import TooltipIcon from '../ui/TooltipIcon.vue'

const { t } = useI18n()

const props = defineProps({
  config: Object,
  roles: Array,
  presetEmojis: Array
})

defineEmits(['update:config', 'toggle-role', 'update:role-desc'])
</script>