// Auto-generated - DubbingStudioSaveDialog.vue
export default `<script setup lang="ts">
interface Props {
  defaultName?: string
  audioUrl?: string
  audioBlob?: Blob | null
}

const props = withDefaults(defineProps<Props>(), {
  defaultName: 'My Voice Clone',
  audioUrl: '',
  audioBlob: null
})

const voiceName = ref(props.defaultName)
const isSaving = ref(false)
const saveError = ref('')

// 验证名称
const isValidName = computed(() => {
  const name = voiceName.value.trim()
  return name.length >= 2 && name.length <= 50
})

const nameError = computed(() => {
  const name = voiceName.value.trim()
  if (name.length === 0) return ''
  if (name.length < 2) return 'Name must be at least 2 characters'
  if (name.length > 50) return 'Name must be less than 50 characters'
  return ''
})

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'close'): void
  (e: 'save', data: { name: string; audioUrl: string; audioBlob: Blob | null }): void
  (e: 'cancel'): void
}>()

const handleSave = async () => {
  if (!isValidName.value) return

  isSaving.value = true
  saveError.value = ''

  try {
    // 模拟保存延迟（实际项目中这里会是 API 调用）
    await new Promise(resolve => setTimeout(resolve, 500))

    emit('save', {
      name: voiceName.value.trim(),
      audioUrl: props.audioUrl,
      audioBlob: props.audioBlob
    })
  } catch (error) {
    saveError.value = 'Failed to save voice clone. Please try again.'
    console.error('Save error:', error)
  } finally {
    isSaving.value = false
  }
}

// 输入框获取焦点时选中全部文本
const handleInputFocus = (event: FocusEvent) => {
  const input = event.target as HTMLInputElement
  input.select()
}

// 键盘快捷键：回车保存
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && isValidName.value && !isSaving.value) {
    handleSave()
  }
}
</script>

<template>
  <div class="w-[560px] bg-white rounded-[10px] overflow-hidden">
    <!-- Header -->
    <div class="h-[49px] px-[30px] flex items-center border-b border-[#00000008]">
      <button
        class="flex items-center gap-1.5 text-[#202123] hover:text-[#695fee] transition-colors cursor-pointer"
        @click="emit('back')"
      >
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        <span class="text-[13px] font-medium font-['Reddit_Sans']">Back</span>
      </button>
      <h1 class="text-[15px] font-semibold text-[#202123] font-['Reddit_Sans'] ml-4">Dubbing Studio</h1>
      <button
        class="ml-auto text-[#979797] hover:text-[#202123] transition-colors cursor-pointer"
        @click="emit('close')"
      >
        <UIcon name="i-lucide-x" class="w-5 h-5" />
      </button>
    </div>

    <!-- Content -->
    <div class="px-[30px] py-10">
      <!-- Success Icon -->
      <div class="flex justify-center mb-6">
        <div class="w-20 h-20 rounded-full bg-[#e8f5e9] flex items-center justify-center">
          <UIcon name="i-lucide-check" class="w-10 h-10 text-[#4caf50]" />
        </div>
      </div>

      <!-- Success Title -->
      <h2 class="text-xl font-semibold text-[#202123] font-['Reddit_Sans'] text-center">
        Voice Clone Created!
      </h2>

      <!-- Description -->
      <p class="text-sm text-[#979797] font-['Reddit_Sans'] text-center mt-3">
        Give your voice clone a name to save it
      </p>

      <!-- Voice Name Input -->
      <div class="mt-8">
        <label class="text-sm font-semibold text-[#202123] font-['Reddit_Sans']">
          Voice Name
        </label>
        <input
          v-model="voiceName"
          type="text"
          maxlength="50"
          class="w-[500px] h-12 mt-2 px-4 rounded-[10px] bg-[#f7f9fe] border text-sm text-[#202123] font-['Reddit_Sans'] focus:outline-none transition-colors"
          :class="nameError ? 'border-[#e53935] focus:border-[#e53935]' : 'border-[#e5e5e5] focus:border-[#695fee]'"
          placeholder="Enter voice name"
          @focus="handleInputFocus"
          @keydown="handleKeydown"
        />
        <!-- Error Message -->
        <p v-if="nameError" class="text-xs text-[#e53935] mt-1.5 font-['Reddit_Sans']">
          {{ nameError }}
        </p>
        <!-- Character Count -->
        <p class="text-xs text-[#979797] mt-1.5 font-['Reddit_Sans'] text-right">
          {{ voiceName.length }}/50 characters
        </p>
      </div>

      <!-- Save Error -->
      <div v-if="saveError" class="mt-4 p-3 bg-[#ffebee] border border-[#ffcdd2] rounded-lg">
        <p class="text-sm text-[#e53935] font-['Reddit_Sans']">{{ saveError }}</p>
      </div>

      <!-- Save Button -->
      <button
        class="w-[500px] h-12 rounded-3xl bg-[#695fee] hover:bg-[#5a4fdf] text-white text-sm font-semibold font-['Reddit_Sans'] flex items-center justify-center mt-6 cursor-pointer active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!isValidName || isSaving"
        @click="handleSave"
      >
        <UIcon v-if="isSaving" name="i-lucide-loader-2" class="w-4 h-4 mr-2 animate-spin" />
        {{ isSaving ? 'Saving...' : 'Save Voice Clone' }}
      </button>

      <!-- Cancel Button -->
      <button
        class="w-[500px] h-12 rounded-3xl bg-white border border-[#e5e5e5] text-[#979797] text-sm font-semibold font-['Reddit_Sans'] flex items-center justify-center mt-3 cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isSaving"
        @click="emit('cancel')"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
`
