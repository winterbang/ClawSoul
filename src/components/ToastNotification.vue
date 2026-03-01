<!-- ToastNotification.vue -->
<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div 
      v-if="show" 
      class="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg bg-cyber-accent text-cyber-900 font-medium shadow-lg shadow-cyber-accent/25 z-50"
    >
      {{ message }}
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: String
})
</script>