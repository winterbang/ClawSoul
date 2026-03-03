<!-- SoulConfig.vue -->
<template>
  <div class="glass rounded-xl p-6 space-y-6">
    <div class="flex items-center gap-2">
      <h2 class="text-xl font-semibold flex items-center gap-2">
        <Sparkles class="w-5 h-5 text-purple-400" />
        人格特质 SOUL
      </h2>
      <TooltipIcon position="right">
        定义 AI 的性格特点、核心价值观和行为风格。这决定了 AI 如何与你互动、表达观点和解决问题。
      </TooltipIcon>
    </div>

    <div class="space-y-4">
      <!-- 特质列表 -->
      <div v-for="(trait, index) in traits" :key="trait.id" class="trait-card space-y-2 p-3 rounded-lg group">
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
            <span v-else class="text-sm font-medium text-[var(--text-primary)]">{{ trait.name }}</span>
            <button 
              v-if="editingIndex !== index"
              @click="startEdit(index)" 
              class="text-[var(--text-muted)] hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil class="w-3 h-3" />
            </button>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-xs text-purple-500 w-10 text-right">{{ trait.value }}%</span>
            <button 
              @click="showDeleteConfirm(index)" 
              class="text-[var(--text-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
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
          class="trait-slider w-full h-2 rounded-lg appearance-none cursor-pointer"
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
            class="text-xs text-[var(--text-muted)] flex-1 cursor-pointer hover:text-purple-400" 
            @click="startDescEdit(index)"
          >{{ trait.description || '点击添加描述' }}</p>
          
          
          <button 
            v-if="editingDescIndex !== index"
            @click="startDescEdit(index)" 
            class="text-[var(--text-muted)] hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil class="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <!-- 添加新特质 -->
      <div v-if="!isAdding" class="p-3 border border-dashed border-[var(--border-color)] rounded-lg hover:border-purple-400 transition-colors">
        <button @click="startAdd" class="text-xs text-purple-500 hover:text-purple-600 flex items-center gap-1 w-full justify-center py-2">
          <Plus class="w-4 h-4" /> 添加自定义特质
        </button>
      </div>
      
      <div v-else class="p-3 border border-[var(--border-color)] rounded-lg space-y-3 bg-[var(--bg-secondary)]">
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
import TooltipIcon from '../ui/TooltipIcon.vue'

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

<style scoped>
.trait-card {
  background-color: rgba(99, 102, 241, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.1);
}

[data-theme="light"] .trait-card {
  background-color: rgba(99, 102, 241, 0.03);
  border: 1px solid rgba(99, 102, 241, 0.08);
}

.trait-slider {
  background-color: rgba(99, 102, 241, 0.2);
  accent-color: #a855f7;
}

[data-theme="light"] .trait-slider {
  background-color: rgba(99, 102, 241, 0.15);
  accent-color: #7c3aed;
}

.trait-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #a855f7;
  cursor: pointer;
}

[data-theme="light"] .trait-slider::-webkit-slider-thumb {
  background: #7c3aed;
}
</style>