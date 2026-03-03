<!-- TooltipIcon.vue -->
<template>
  <div class="relative inline-flex items-center group"
    ref="triggerRef"
    @mouseenter="show = true"
    @mouseleave="show = false"
  >
    <HelpCircle class="w-4 h-4 tooltip-icon cursor-help" />
    
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div 
          v-if="show" 
          class="tooltip-content fixed z-[9999] w-72 p-3 rounded-lg shadow-xl text-xs leading-relaxed"
          :style="tooltipStyle"
        >
          <slot />
          <!-- 箭头 -->
          <div 
            v-if="position === 'top'"
            class="tooltip-arrow absolute w-2 h-2 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"
          />
          <div 
            v-if="position === 'right'"
            class="tooltip-arrow absolute w-2 h-2 transform rotate-45 left-0 top-3 -translate-x-1/2"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { HelpCircle } from 'lucide-vue-next'

const props = defineProps({
  position: {
    type: String,
    default: 'top'
  }
})

const show = ref(false)
const triggerRef = ref(null)
const pos = ref({ x: 0, y: 0 })

const tooltipStyle = computed(() => ({
  left: `${pos.value.x}px`,
  top: `${pos.value.y}px`,
  transform: props.position === 'top' ? 'translate(-50%, -100%)' : 'none'
}))

watch(show, async (val) => {
  if (val) {
    await nextTick()
    calculatePosition()
  }
})

const calculatePosition = () => {
  if (!triggerRef.value) return
  
  const rect = triggerRef.value.getBoundingClientRect()
  const offset = 8
  
  if (props.position === 'right') {
    pos.value = {
      x: rect.right + offset,
      y: rect.top
    }
  } else {
    // top position - center horizontally, place above
    const centerX = rect.left + rect.width / 2
    pos.value = {
      x: centerX,
      y: rect.top - offset
    }
  }
}
</script>

<style scoped>
.tooltip-icon {
  color: var(--text-muted);
}

.tooltip-icon:hover {
  color: var(--accent-primary);
}

.tooltip-content {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.tooltip-arrow {
  background-color: var(--bg-secondary);
  border-color: var(--border-color);
}

.tooltip-arrow {
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}
</style>