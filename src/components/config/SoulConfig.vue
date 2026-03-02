<!-- SoulConfig.vue -->
<template>
  <div class="glass rounded-xl p-6 space-y-6">
    <h2 class="text-xl font-semibold flex items-center gap-2">
      <Sparkles class="w-5 h-5 text-purple-400" />
      人格特质 SOUL
    </h2>

    <div class="space-y-6">
      <div v-for="(trait, index) in localTraits" :key="trait.id" class="space-y-2">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium">{{ trait.name }}</label>
          <span class="text-xs text-purple-400">{{ trait.value }}%</span>
        </div>
        <input 
          :value="trait.value"
          @input="updateTrait(index, $event.target.value)"
          type="range" 
          min="0" 
          max="100"
          class="w-full h-2 bg-cyber-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
        />
        <p class="text-xs text-gray-500">{{ trait.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Sparkles } from 'lucide-vue-next'

const props = defineProps({
  traits: Array
})

const emit = defineEmits(['update:traits'])

// 创建本地副本用于显示
const localTraits = computed(() => props.traits)

const updateTrait = (index, value) => {
  const newTraits = JSON.parse(JSON.stringify(props.traits))
  newTraits[index].value = parseInt(value)
  emit('update:traits', newTraits)
}
</script>