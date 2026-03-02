<!-- TooltipIcon.vue -->
<template>
  <div class="relative inline-block group"
    @mouseenter="show = true"
    @mouseleave="show = false"
  >
    <HelpCircle class="w-4 h-4 text-gray-500 hover:text-cyber-accent cursor-help" />
    
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div 
        v-show="show" 
        class="absolute z-50 w-72 p-3 bg-cyber-800 border border-cyber-600 rounded-lg shadow-lg text-xs text-gray-300 leading-relaxed"
        :class="position === 'right' ? 'left-full ml-2 top-0' : 'bottom-full mb-2 left-1/2 -translate-x-1/2'"
      >
        <slot />
        <div 
          class="absolute w-2 h-2 bg-cyber-800 border-cyber-600 transform rotate-45"
          :class="position === 'right' ? '-left-1 top-3 border-l border-b' : '-bottom-1 left-1/2 -translate-x-1/2 border-r border-t'"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { HelpCircle } from 'lucide-vue-next'

defineProps({
  position: {
    type: String,
    default: 'top' // 'top' or 'right'
  }
})

const show = ref(false)
</script>