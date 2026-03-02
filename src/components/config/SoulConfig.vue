<!-- SoulConfig.vue -->
<template>
  <div class="glass rounded-xl p-6 space-y-6">
    <h2 class="text-xl font-semibold flex items-center gap-2">
      <Sparkles class="w-5 h-5 text-purple-400" />
      人格特质 SOUL
    </h2>

    <div class="space-y-4">
      <!-- 特质列表 -->
      <div v-for="(trait, index) in traits" :key="trait.id" class="space-y-2 p-3 bg-cyber-800/30 rounded-lg group">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2 flex-1">
            <input 
              v-if="editingIndex === index"
              :value="trait.name"
              type="text"
              class="cyber-input text-sm py-1 px-2 w-32"
              @blur="saveEdit(index, $event.target.value)"
              @keyup.enter="saveEdit(index, $event.target.value)"
            />
            <span v-else class="text-sm font-medium">{{ trait.name }}</span>
            <button 
              v-if="editingIndex !== index"
              @click="startEdit(index)" 
              class="text-gray-500 hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil class="w-3 h-3" />
            </button>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-xs text-purple-400 w-10 text-right">{{ trait.value }}%</span>
            <button 
              @click="showDeleteConfirm(index)" 
              class="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              title="删除"
            >
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
            :value="trait.description"
            type="text"
            class="cyber-input text-xs py-1 px-2 flex-1"
            @blur="saveDescEdit(index, $event.target.value)"
            @keyup.enter="saveDescEdit(index, $event.target.value)"
            placeholder="描述这个特质..."
          />
          
          <p 
            v-else 
            class="text-xs text-gray-500 flex-1 cursor-pointer hover:text-purple-400" 
            @click="startDescEdit(index)"
          >{{ trait.description || '点击添加描述' }}</p>
          
          
          <button 
            v-if="editingDescIndex !== index"
            @click="startDescEdit(index)" 
            class="text-gray-500 hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil class="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <!-- 添加新特质 -->
      <div v-if="!isAdding" class="p-3 border border-dashed border-cyber-600 rounded-lg">
        <button @click="startAdd" class="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 w-full justify-center py-2">
          <Plus class="w-4 h-4" /> 添加自定义特质
        </button>
      </div>
      
      <div v-else class="p-3 border border-cyber-600 rounded-lg space-y-3">
        <input 
          v-model="newTraitName"
          type="text"
          placeholder="特质名称"
          class="cyber-input w-full text-sm"
          @keyup.enter="addTrait"
        />
        <input 
          v-model="newTraitDesc"
          type="text"
          placeholder="描述（可选）"
          class="cyber-input w-full text-sm"
          @keyup.enter="addTrait"
        />
        
        <div class="flex gap-2">
          <button @click="addTrait" class="cyber-btn-primary text-xs py-2 flex-1">确认添加</button>
          <button @click="cancelAdd" class="cyber-btn-secondary text-xs py-2 flex-1">取消</button>
        </div>
      </div>
    </div>
    
    <!-- 删除确认弹窗 -->
    <div v-if="deleteIndex !== null" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="glass rounded-xl p-6 max-w-sm mx-4">
        <h3 class="text-lg font-semibold mb-3">确认删除</h3>
        <p class="text-sm text-gray-400 mb-4">确定要删除特质"{{ traits[deleteIndex]?.name }}"吗？</p>
        <div class="flex gap-3">
          <button @click="confirmDelete" class="cyber-btn-primary text-sm py-2 flex-1 bg-red-500 hover:bg-red-600">删除</button>
          <button @click="cancelDelete" class="cyber-btn-secondary text-sm py-2 flex-1">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Sparkles, Plus, X, Pencil } from 'lucide-vue-next'

const props = defineProps({
  traits: Array
})

const emit = defineEmits(['update:traits'])

// 编辑状态
const editingIndex = ref(-1)
const editingDescIndex = ref(-1)

// 添加新特质
const isAdding = ref(false)
const newTraitName = ref('')
const newTraitDesc = ref('')

// 删除确认
const deleteIndex = ref(null)

const updateTrait = (index, value) => {
  const newTraits = JSON.parse(JSON.stringify(props.traits))
  newTraits[index].value = parseInt(value)
  emit('update:traits', newTraits)
}

const startEdit = (index) => {
  editingIndex.value = index
}

const saveEdit = (index, value) => {
  if (value.trim()) {
    const newTraits = JSON.parse(JSON.stringify(props.traits))
    newTraits[index].name = value.trim()
    emit('update:traits', newTraits)
  }
  editingIndex.value = -1
}

const startDescEdit = (index) => {
  editingDescIndex.value = index
}

const saveDescEdit = (index, value) => {
  const newTraits = JSON.parse(JSON.stringify(props.traits))
  newTraits[index].description = value.trim()
  emit('update:traits', newTraits)
  editingDescIndex.value = -1
}

const showDeleteConfirm = (index) => {
  deleteIndex.value = index
}

const confirmDelete = () => {
  if (deleteIndex.value !== null) {
    const newTraits = JSON.parse(JSON.stringify(props.traits))
    newTraits.splice(deleteIndex.value, 1)
    emit('update:traits', newTraits)
    deleteIndex.value = null
  }
}

const cancelDelete = () => {
  deleteIndex.value = null
}

const startAdd = () => {
  isAdding.value = true
  newTraitName.value = ''
  newTraitDesc.value = ''
}

const cancelAdd = () => {
  isAdding.value = false
  newTraitName.value = ''
  newTraitDesc.value = ''
}

const addTrait = () => {
  const name = newTraitName.value.trim()
  if (!name) {
    alert('请输入特质名称')
    return
  }
  
  const newTraits = JSON.parse(JSON.stringify(props.traits))
  newTraits.push({
    id: 'custom_' + Date.now(),
    name: name,
    value: 50,
    description: newTraitDesc.value.trim()
  })
  emit('update:traits', newTraits)
  
  isAdding.value = false
  newTraitName.value = ''
  newTraitDesc.value = ''
}
</script>