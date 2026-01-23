<script setup lang="ts">
interface Props {
  availableClones?: number
  totalClones?: number
  fileName?: string
  fileSize?: string
  duration?: string
  selectionStart?: string
  selectionEnd?: string
  selectedDuration?: string
  // 生成的语音 URL 或 Blob
  generatedAudioUrl?: string
  generatedAudioBlob?: Blob | null
}

const props = withDefaults(defineProps<Props>(), {
  availableClones: 2,
  totalClones: 3,
  fileName: 'voice_sample.mp3',
  fileSize: '2.4 MB',
  duration: '00:32 total',
  selectionStart: '00:05',
  selectionEnd: '00:17',
  selectedDuration: '12s',
  generatedAudioUrl: '',
  generatedAudioBlob: null
})

// 音频播放状态
const isPlaying = ref(false)
const isLoading = ref(true)
const currentTime = ref(0)
const totalDuration = ref(12) // 默认12秒

// 音频元素引用
const audioRef = ref<HTMLAudioElement | null>(null)

// 格式化时间
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const previewCurrentTime = computed(() => formatTime(currentTime.value))
const previewTotalTime = computed(() => formatTime(totalDuration.value))

// 播放进度百分比
const playProgress = computed(() => {
  if (totalDuration.value === 0) return 0
  return (currentTime.value / totalDuration.value) * 100
})

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'close'): void
  (e: 'get-more'): void
  (e: 'remove-file'): void
  (e: 'regenerate'): void
  (e: 'save-voice', data: { audioUrl: string; audioBlob: Blob | null }): void
}>()

// 播放/暂停切换
const togglePlayback = () => {
  if (!audioRef.value) return

  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
}

// 音频事件处理
const handlePlay = () => {
  isPlaying.value = true
}

const handlePause = () => {
  isPlaying.value = false
}

const handleEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
}

const handleTimeUpdate = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
  }
}

const handleLoadedMetadata = () => {
  if (audioRef.value) {
    totalDuration.value = audioRef.value.duration
  }
  isLoading.value = false
}

const handleLoadStart = () => {
  isLoading.value = true
}

// 进度条点击跳转
const handleProgressClick = (event: MouseEvent) => {
  if (!audioRef.value) return

  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const clickPercent = (event.clientX - rect.left) / rect.width
  const newTime = clickPercent * totalDuration.value

  audioRef.value.currentTime = newTime
  currentTime.value = newTime
}

// 重新生成
const handleRegenerate = () => {
  isLoading.value = true
  currentTime.value = 0
  isPlaying.value = false
  emit('regenerate')
}

// 保存语音
const handleSave = () => {
  emit('save-voice', {
    audioUrl: props.generatedAudioUrl,
    audioBlob: props.generatedAudioBlob
  })
}

// 组件挂载时，如果有音频 URL 则准备播放
onMounted(() => {
  if (props.generatedAudioUrl || props.generatedAudioBlob) {
    // 音频准备就绪
    isLoading.value = false
  } else {
    // 模拟音频生成过程（2秒）
    setTimeout(() => {
      isLoading.value = false
    }, 2000)
  }
})

// 组件卸载时停止播放
onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
  }
})
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
      <div class="w-[500px] h-[70px] rounded-xl bg-[#f7f9fe] flex items-center px-5">
        <div class="w-10 h-10 rounded-[10px] bg-[#eef0ff] flex items-center justify-center">
          <UIcon name="i-lucide-sparkles" class="w-5 h-5 text-[#695fee]" />
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-semibold text-[#202123] font-['Reddit_Sans']">Available Clones</p>
          <p class="text-[13px] font-['Reddit_Sans'] mt-0.5">
            <span class="text-[#979797]">Remaining: </span>
            <span class="text-[#202123] font-semibold">{{ availableClones }}</span>
            <span class="text-[#979797]"> / {{ totalClones }}</span>
          </p>
        </div>
        <button
          class="h-9 px-5 rounded-[18px] bg-[#695fee] flex items-center gap-1.5 text-white text-xs font-semibold font-['Reddit_Sans'] cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all"
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

      <!-- Uploaded File Card -->
      <div class="w-[500px] rounded-xl border border-[#4caf50] bg-[#f1f8e9] p-3.5">
        <!-- File Info Row -->
        <div class="flex items-center">
          <div class="w-11 h-11 rounded-[10px] bg-[#e8f5e9] flex items-center justify-center">
            <UIcon name="i-lucide-music" class="w-[22px] h-[22px] text-[#4caf50]" />
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-semibold text-[#202123] font-['Reddit_Sans']">{{ fileName }}</p>
            <p class="text-xs text-[#979797] font-['Reddit_Sans'] mt-0.5">{{ fileSize }} • {{ duration }}</p>
          </div>
          <div class="w-6 h-6 rounded-full bg-[#4caf50] flex items-center justify-center">
            <UIcon name="i-lucide-check" class="w-3.5 h-3.5 text-white" />
          </div>
          <button
            class="ml-3 text-[#979797] hover:text-[#e53935] transition-colors cursor-pointer"
            @click="emit('remove-file')"
          >
            <UIcon name="i-lucide-x" class="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      <!-- Preview Generated Voice -->
      <h2 class="text-sm font-semibold text-[#202123] font-['Reddit_Sans'] mt-5 mb-3">
        Preview Generated Voice
      </h2>

      <!-- Hidden Audio Element -->
      <audio
        ref="audioRef"
        :src="generatedAudioUrl"
        class="hidden"
        @play="handlePlay"
        @pause="handlePause"
        @ended="handleEnded"
        @timeupdate="handleTimeUpdate"
        @loadedmetadata="handleLoadedMetadata"
        @loadstart="handleLoadStart"
      />

      <!-- Preview Card -->
      <div class="w-[500px] rounded-xl border border-[#e5e5e5] bg-white p-3">
        <div class="flex items-center gap-3">
          <!-- Play Button -->
          <button
            class="w-8 h-8 rounded-full bg-[#695fee] flex items-center justify-center cursor-pointer hover:bg-[#5a4fdf] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
            @click="togglePlayback"
          >
            <UIcon v-if="isLoading" name="i-lucide-loader-2" class="w-4 h-4 text-white animate-spin" />
            <UIcon
              v-else
              :name="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
              class="w-4 h-4 text-white"
              :class="isPlaying ? '' : 'ml-0.5'"
            />
          </button>

          <!-- Time -->
          <span class="text-[13px] font-medium text-[#695fee] font-['Reddit_Sans'] min-w-[70px]">
            {{ previewCurrentTime }} / {{ previewTotalTime }}
          </span>

          <!-- Spacer -->
          <div class="flex-1" />

          <!-- Regenerate Button -->
          <button
            class="h-8 px-4 rounded-lg border border-[#695fee] bg-white flex items-center gap-1.5 text-[#695fee] text-xs font-medium font-['Reddit_Sans'] cursor-pointer hover:bg-[#f7f9fe] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
            @click="handleRegenerate"
          >
            <UIcon name="i-lucide-refresh-cw" class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
            Regenerate
          </button>
        </div>

        <!-- Progress Bar -->
        <div
          class="mt-3 h-1.5 bg-[#e5e5e5] rounded-full cursor-pointer overflow-hidden"
          @click="handleProgressClick"
        >
          <div
            class="h-full bg-[#695fee] rounded-full transition-all duration-100"
            :style="{ width: playProgress + '%' }"
          />
        </div>
      </div>

      <!-- Save Voice Button -->
      <button
        class="w-[500px] h-11 rounded-[22px] bg-[#695fee] hover:bg-[#5a4fdf] text-white text-sm font-semibold font-['Reddit_Sans'] flex items-center justify-center mt-6 cursor-pointer active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isLoading"
        @click="handleSave"
      >
        Save Voice
      </button>
    </div>
  </div>
</template>
