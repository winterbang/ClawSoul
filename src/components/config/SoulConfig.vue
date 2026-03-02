<!-- SoulConfig.vue -->
<template>
  <div class="glass rounded-xl p-6 space-y-6">
    <h2 class="text-xl font-semibold flex items-center gap-2">
      <Sparkles class="w-5 h-5 text-purple-400" />
      人格特质 SOUL
    </h2>

    <div class="space-y-6">
      <!-- 特质列表 -->
      <div v-for="(trait, index) in localTraits" :key="trait.id" class="space-y-2 p-3 bg-cyber-800/30 rounded-lg">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2 flex-1">
            <input 
              v-if="editingIndex === index"
              v-model="editingName"
              type="text"
              class="cyber-input text-sm py-1 px-2 w-32"
              @blur="saveEdit(index)"
              @keyup.enter="saveEdit(index)"
            />
            <span v-else class="text-sm font-medium cursor-pointer hover:text-purple-400" @click="startEdit(index, 'name', trait.name)">{{ trait.name }}</span>
            <button @click="startEdit(index, 'name', trait.name)" class="text-gray-500 hover:text-purple-400">
              <Pencil class="w-3 h-3" />
            </button>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-xs text-purple-400 w-10 text-right">{{ trait.value }}%</span>
            <button @click="removeTrait(index)" class="text-gray-500 hover:text-red-400">
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <input 
          :value="trait.value"
          @input="updateTrait(index, $event.target.value)"
          type="range" 
          min="0" 
          max="100"
          class="w-full h-2 bg-cyber-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
        />
        
        <div class="flex items-center gap-2">
          <input 
            v-if="editingDescIndex === index"
            v-model="editingDesc"
            type="text"
            class="cyber-input text-xs py-1 px-2 flex-1"
            @blur="saveDescEdit(index)"
            @keyup.enter="saveDescEdit(index)"
            placeholder="描述这个特质..."
          />
          <p v-else class="text-xs text-gray-500 flex-1 cursor-pointer hover:text-purple-400" @click="startDescEdit(index, trait.description)">{{ trait.description || '点击添加描述' }}</p>
          
          <button @click="startDescEdit(index, trait.description)" class="text-gray-500 hover:text-purple-400">
            <Pencil class="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <!-- 添加新特质 -->
      <div class="p-3 border border-dashed border-cyber-600 rounded-lg">
        <div v-if="isAdding" class="space-y-3">
          <input 
            v-model="newTraitName"
            type="text"
            placeholder="特质名称"
            class="cyber-input w-full text-sm"
          />
          <input 
            v-model="newTraitDesc"
            type="text"
            placeholder="描述（可选）"
            class="cyber-input w-full text-sm"
          />
          <div class="flex gap-2">
            <button @click="addTrait" class="cyber-btn-primary text-xs py-2">确认添加</button>
            <button @click="cancelAdd" class="cyber-btn-secondary text-xs py-2">取消</button>
          </div>
        </div>
        
        <button v-else @click="startAdd" class="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 w-full justify-center py-2">
          <Plus class="w-4 h-4" /> 添加自定义特质
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Sparkles, Plus, X, Pencil } from 'lucide-vue-next'

const props = defineProps({
  traits: Array
})

const emit = defineEmits(['update:traits'])

// 创建本地副本用于显示
const localTraits = computed(() => props.traits)

// 编辑状态
const editingIndex = ref(-1)
const editingName = ref('')
const editingDescIndex = ref(-1)
const editingDesc = ref('')

// 添加新特质
const isAdding = ref(false)
const newTraitName = ref('')
const newTraitDesc = ref('')

const updateTrait = (index, value) => {
  const newTraits = JSON.parse(JSON.stringify(props.traits))
  newTraits[index].value = parseInt(value)
  emit('update:traits', newTraits)
}

const removeTrait = (index) => {
  if (confirm('确定要删除这个特质吗？')) {
    const newTraits = JSON.parse(JSON.stringify(props.traits))
    newTraits.splice(index, 1)
    emit('update:traits', newTraits)
  }
}

const startEdit = (index, field, value) => {
  editingIndex.value = index
  editingName.value = value
}

const saveEdit = (index) => {
  if (editingName.value.trim()) {
    const newTraits = JSON.parse(JSON.stringify(props.traits))
    newTraits[index].name = editingName.value.trim()
    emit('update:traits', newTraits)
  }
  editingIndex.value = -1
  editingName.value = ''
}

const startDescEdit = (index, value) => {
  editingDescIndex.value = index
  editingDesc.value = value || ''
}

const saveDescEdit = (index) => {
  const newTraits = JSON.parse(JSON.stringify(props.traits))
  newTraits[index].description = editingDesc.value.trim()
  emit('update:traits', newTraits)
  editingDescIndex.value = -1
  editingDesc.value = ''
}

const startAdd = () => {
  isAdding.value = true
}

const cancelAdd = () => {
  isAdding.value = false
  newTraitName.value = ''
  newTraitDesc.value = ''
}

const addTrait = () => {
  if (!newTraitName.value.trim()) {
    alert('请输入特质名称')
    return
  }
  
  const newTraits = JSON.parse(JSON.stringify(props.traits))
  newTraits.push({
    id: 'custom_' + Date.now(),
    name: newTraitName.value.trim(),
    value: 50,
    description: newTraitDesc.value.trim()
  })
  emit('update:traits', newTraits)
  
  isAdding.value = false
  newTraitName.value = ''
  newTraitDesc.value = ''
}
</script>