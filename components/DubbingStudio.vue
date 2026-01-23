<script setup lang="ts">
interface Props {
  availableClones?: number
  totalClones?: number
}

const props = withDefaults(defineProps<Props>(), {
  availableClones: 2,
  totalClones: 3
})

// 文件上传状态
const selectedFile = ref<File | null>(null)
const fileError = ref('')
const isDragging = ref(false)

// 文件上传输入框引用
const fileInputRef = ref<HTMLInputElement | null>(null)

// 支持的文件格式
const supportedFormats = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/m4a', 'audio/x-m4a', 'audio/mp4']
const maxFileSize = 50 * 1024 * 1024 // 50MB

// 验证文本
const verificationText = ref('')
const maxChars = 200

// 计算属性
const hasClones = computed(() => props.availableClones > 0)
const canPreview = computed(() => verificationText.value.length > 0 && hasClones.value)

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'close'): void
  (e: 'get-more'): void
  (e: 'file-selected', file: File): void
  (e: 'record-voice'): void
  (e: 'preview-clone', data: { text: string }): void
}>()

// 验证文件
const validateFile = (file: File): string => {
  // 检查文件类型
  if (!supportedFormats.includes(file.type)) {
    // 也检查扩展名作为备选
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['mp3', 'wav', 'm4a'].includes(ext || '')) {
      return 'Unsupported file format. Please upload MP3, WAV, or M4A files.'
    }
  }

  // 检查文件大小
  if (file.size > maxFileSize) {
    return 'File too large. Maximum size is 50MB.'
  }

  return ''
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    const error = validateFile(file)
    if (error) {
      fileError.value = error
      selectedFile.value = null
    } else {
      fileError.value = ''
      selectedFile.value = file
      emit('file-selected', file)
    }
  }

  // 重置 input 以便可以重新选择相同文件
  input.value = ''
}

// 触发文件选择
const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

// 处理拖放
const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false

  const file = event.dataTransfer?.files[0]
  if (file) {
    const error = validateFile(file)
    if (error) {
      fileError.value = error
      selectedFile.value = null
    } else {
      fileError.value = ''
      selectedFile.value = file
      emit('file-selected', file)
    }
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// 预览克隆
const handlePreview = () => {
  if (canPreview.value) {
    emit('preview-clone', { text: verificationText.value })
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
    <div class="px-[30px] py-5">
      <!-- Available Clones Card -->
      <div
        class="w-[500px] h-[70px] rounded-xl flex items-center px-5"
        :class="hasClones
          ? 'bg-[#f7f9fe]'
          : 'bg-[#fff8f8] border border-[#ffcdd2]'"
      >
        <div
          class="w-10 h-10 rounded-[10px] flex items-center justify-center"
          :class="hasClones ? 'bg-[#eef0ff]' : 'bg-[#ffebee]'"
        >
          <UIcon
            name="i-lucide-sparkles"
            class="w-5 h-5"
            :class="hasClones ? 'text-[#695fee]' : 'text-[#e53935]'"
          />
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-semibold text-[#202123] font-['Reddit_Sans']">Available Clones</p>
          <p class="text-[13px] font-['Reddit_Sans'] mt-0.5">
            <span class="text-[#979797]">Remaining: </span>
            <span :class="hasClones ? 'text-[#202123] font-semibold' : 'text-[#e53935] font-semibold'">{{ availableClones }}</span>
            <span class="text-[#979797]"> / {{ totalClones }}</span>
          </p>
        </div>
        <button
          class="h-9 px-5 rounded-[18px] flex items-center gap-1.5 text-white text-xs font-semibold font-['Reddit_Sans'] cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all"
          :class="hasClones ? 'bg-[#695fee]' : 'bg-[#e53935]'"
          @click="emit('get-more')"
        >
          <UIcon name="i-lucide-plus" class="w-3.5 h-3.5" />
          Get More
        </button>
      </div>

      <!-- Upload Reference Audio -->
      <h2 class="text-sm font-semibold text-[#202123] font-['Reddit_Sans'] mt-5 mb-3">
        Upload Reference Audio
      </h2>

      <!-- Hidden File Input -->
      <input
        ref="fileInputRef"
        type="file"
        accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/m4a"
        class="hidden"
        @change="handleFileSelect"
      />

      <div
        class="w-[500px] h-[140px] rounded-xl border bg-white flex relative transition-all"
        :class="isDragging ? 'border-[#695fee] border-2 bg-[#f7f9fe]' : 'border-[#d0d0d0]'"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @dragover="handleDragOver"
        @drop="handleDrop"
      >
        <!-- Upload File -->
        <button
          class="flex-1 flex flex-col items-center justify-center gap-3 hover:bg-[#f7f9fe] transition-colors cursor-pointer rounded-l-xl"
          @click="triggerFileSelect"
        >
          <div class="w-12 h-12 rounded-full bg-[#eef0ff] flex items-center justify-center">
            <UIcon name="i-lucide-upload" class="w-[22px] h-[22px] text-[#695fee]" />
          </div>
          <div class="text-center">
            <p class="text-sm font-semibold text-[#695fee] font-['Reddit_Sans']">Upload File</p>
            <p class="text-xs text-[#979797] font-['Reddit_Sans'] mt-1">MP3, WAV, M4A (Max 50MB)</p>
          </div>
        </button>

        <!-- Divider -->
        <div class="w-px h-[100px] bg-[#d0d0d0] self-center" />

        <!-- Record Voice -->
        <button
          class="flex-1 flex flex-col items-center justify-center gap-3 hover:bg-[#fff0f5] transition-colors cursor-pointer rounded-r-xl"
          @click="emit('record-voice')"
        >
          <div class="w-12 h-12 rounded-full bg-[#fff0f5] flex items-center justify-center">
            <UIcon name="i-lucide-mic" class="w-[22px] h-[22px] text-[#e85a8f]" />
          </div>
          <div class="text-center">
            <p class="text-sm font-semibold text-[#e85a8f] font-['Reddit_Sans']">Record Voice</p>
            <p class="text-xs text-[#979797] font-['Reddit_Sans'] mt-1">Use Microphone</p>
          </div>
        </button>

        <!-- Drag Overlay -->
        <div
          v-if="isDragging"
          class="absolute inset-0 bg-[#695fee]/10 rounded-xl flex items-center justify-center pointer-events-none"
        >
          <div class="text-[#695fee] font-semibold font-['Reddit_Sans']">Drop audio file here</div>
        </div>
      </div>

      <!-- File Error -->
      <p v-if="fileError" class="text-xs text-[#e53935] mt-2 font-['Reddit_Sans']">
        {{ fileError }}
      </p>

      <!-- Input Verification Text -->
      <h2 class="text-sm font-semibold text-[#202123] font-['Reddit_Sans'] mt-5 mb-3">
        Input Verification Text (To verify clone effect)
      </h2>

      <div class="relative">
        <textarea
          v-model="verificationText"
          :maxlength="maxChars"
          placeholder="Enter short text to verify clone..."
          class="w-[500px] h-[100px] rounded-lg border border-[#e5e5e5] bg-[#f7f9fe] px-4 py-4 text-[13px] text-[#202123] font-['Reddit_Sans'] placeholder:text-[#b0b0b0] resize-none focus:outline-none focus:border-[#695fee]"
        />
        <span class="absolute bottom-[-24px] right-0 text-xs text-[#979797] font-['Reddit_Sans']">
          {{ verificationText.length }}/{{ maxChars }} chars
        </span>
      </div>

      <!-- Preview Clone Button -->
      <button
        class="w-[500px] h-11 rounded-[22px] text-white text-sm font-semibold font-['Reddit_Sans'] flex items-center justify-center mt-10 transition-all"
        :class="canPreview
          ? 'bg-[#695fee] hover:bg-[#5a4fdf] cursor-pointer active:scale-[0.98]'
          : 'bg-[#c5c5c5] cursor-not-allowed'"
        :disabled="!canPreview"
        @click="handlePreview"
      >
        Preview Clone
      </button>
    </div>
  </div>
</template>
