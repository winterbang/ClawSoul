<!-- ConfirmDialog.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="show" 
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click="handleBackdropClick"
      >
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div 
            v-if="show" 
            class="glass rounded-xl p-6 max-w-sm w-full border border-cyber-600/50 shadow-2xl"
            @click.stop
          >
            <!-- 图标 -->
            <div class="flex justify-center mb-4">
              <div class="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle class="w-8 h-8 text-red-400" />
              </div>
            </div>
            
            <!-- 标题 -->
            <h3 class="text-lg font-semibold text-center mb-2 text-white">
              {{ title }}
            </h3>
            
            <!-- 内容 -->
            <p class="text-sm text-gray-400 text-center mb-6">
              {{ message }}
            </p>
            
            <!-- 按钮 -->
            <div class="flex gap-3">
              <button 
                @click="handleCancel"
                class="flex-1 py-2.5 px-4 rounded-lg border border-cyber-600 text-gray-300 hover:bg-cyber-700/50 hover:text-white transition-all text-sm font-medium"
              >
                {{ cancelText }}
              </button>
              <button 
                @click="handleConfirm"
                class="flex-1 py-2.5 px-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all text-sm font-medium"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { AlertTriangle } from 'lucide-vue-next'

const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: '确认操作'
  },
  message: {
    type: String,
    default: '确定要执行此操作吗？'
  },
  confirmText: {
    type: String,
    default: '确认'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
})

const emit = defineEmits(['confirm', 'cancel', 'update:show'])

const handleConfirm = () => {
  emit('confirm')
  emit('update:show', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:show', false)
}

const handleBackdropClick = () => {
  emit('cancel')
  emit('update:show', false)
}
</script>