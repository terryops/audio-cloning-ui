// Auto-generated - DubbingStudioContainer.vue
export default `<script setup lang="ts">
interface Props {
  availableClones?: number
  totalClones?: number
}

const props = withDefaults(defineProps<Props>(), {
  availableClones: 2,
  totalClones: 3
})

// 状态管理
type ViewState = 'default' | 'recording' | 'uploaded' | 'preview'
const currentView = ref<ViewState>('default')

// 录音/上传的音频数据
const audioData = ref<{
  blob: Blob | null
  file: File | null
  fileName: string
  fileSize: string
  duration: number
  url: string
}>({
  blob: null,
  file: null,
  fileName: '',
  fileSize: '',
  duration: 0,
  url: ''
})

// 处理"Record Voice"点击
const handleRecordVoice = () => {
  currentView.value = 'recording'
}

// 处理"Back"点击
const handleBack = () => {
  // 清理音频URL
  if (audioData.value.url) {
    URL.revokeObjectURL(audioData.value.url)
  }

  // 重置数据
  audioData.value = {
    blob: null,
    file: null,
    fileName: '',
    fileSize: '',
    duration: 0,
    url: ''
  }

  currentView.value = 'default'
}

// 处理录音保存 - 当点击Preview Clone时触发
const handleSaveRecording = (data: {
  audioBlob: Blob
  fileName: string
  fileSize: string
  duration: number
}) => {
  // 创建URL用于播放
  const url = URL.createObjectURL(data.audioBlob)

  audioData.value = {
    blob: data.audioBlob,
    file: null,
    fileName: data.fileName,
    fileSize: data.fileSize,
    duration: data.duration,
    url: url
  }

  // 直接切换到uploaded视图
  currentView.value = 'uploaded'
}

// 处理文件上传
const handleFileSelected = (file: File) => {
  const url = URL.createObjectURL(file)

  audioData.value = {
    blob: null,
    file: file,
    fileName: file.name,
    fileSize: formatFileSize(file.size),
    duration: 0, // 需要加载音频才能获取时长
    url: url
  }

  // 切换到uploaded视图
  currentView.value = 'uploaded'
}

// 处理移除文件
const handleRemoveFile = () => {
  if (audioData.value.url) {
    URL.revokeObjectURL(audioData.value.url)
  }

  audioData.value = {
    blob: null,
    file: null,
    fileName: '',
    fileSize: '',
    duration: 0,
    url: ''
  }

  currentView.value = 'default'
}

// 处理预览克隆
const handlePreviewClone = (data: any) => {
  console.log('Preview clone:', data)
  currentView.value = 'preview'
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

// 组件卸载时清理
onUnmounted(() => {
  if (audioData.value.url) {
    URL.revokeObjectURL(audioData.value.url)
  }
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'get-more'): void
}>()
</script>

<template>
  <div>
    <!-- Default View -->
    <DubbingStudio
      v-if="currentView === 'default'"
      :available-clones="availableClones"
      :total-clones="totalClones"
      @close="emit('close')"
      @get-more="emit('get-more')"
      @record-voice="handleRecordVoice"
      @file-selected="handleFileSelected"
    />

    <!-- Recording View -->
    <DubbingStudioRecording
      v-else-if="currentView === 'recording'"
      :available-clones="availableClones"
      :total-clones="totalClones"
      @back="handleBack"
      @close="emit('close')"
      @get-more="emit('get-more')"
      @save-recording="handleSaveRecording"
      @preview-clone="handlePreviewClone"
    />

    <!-- Uploaded View -->
    <DubbingStudioUploaded
      v-else-if="currentView === 'uploaded'"
      :available-clones="availableClones"
      :total-clones="totalClones"
      :audio-file="audioData.file"
      :file-name="audioData.fileName"
      :file-size="audioData.fileSize"
      :total-duration="audioData.duration || 120"
      :audio-url="audioData.url"
      @back="handleBack"
      @close="emit('close')"
      @get-more="emit('get-more')"
      @remove-file="handleRemoveFile"
      @preview-clone="handlePreviewClone"
    />

    <!-- Preview View -->
    <DubbingStudioPreview
      v-else-if="currentView === 'preview'"
      :available-clones="availableClones"
      :total-clones="totalClones"
      :file-name="audioData.fileName"
      :file-size="audioData.fileSize"
      :generated-audio-url="audioData.url"
      :generated-audio-blob="audioData.blob"
      @back="() => currentView = 'uploaded'"
      @close="emit('close')"
      @get-more="emit('get-more')"
    />
  </div>
</template>
`
