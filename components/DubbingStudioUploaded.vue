<script setup lang="ts">
interface Props {
  availableClones?: number
  totalClones?: number
  // 可以传入文件对象或文件信息
  audioFile?: File | null
  fileName?: string
  fileSize?: string
  totalDuration?: number // 总时长（秒）
  audioUrl?: string // 音频 URL
}

const props = withDefaults(defineProps<Props>(), {
  availableClones: 2,
  totalClones: 3,
  audioFile: null,
  fileName: 'voice_sample.mp3',
  fileSize: '2.4 MB',
  totalDuration: 120, // 默认2分钟长音频
  audioUrl: ''
})

// 音频播放相关
const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const playbackTime = ref(0)
const actualDuration = ref(props.totalDuration)

// 内部音频 URL（如果传入了文件则创建 URL）
const internalAudioUrl = ref<string | null>(null)

// 计算实际使用的音频 URL
const effectiveAudioUrl = computed(() => {
  return props.audioUrl || internalAudioUrl.value || ''
})

// 监听音频文件变化
watch(() => props.audioFile, (newFile) => {
  if (newFile) {
    // 清理旧的 URL
    if (internalAudioUrl.value) {
      URL.revokeObjectURL(internalAudioUrl.value)
    }
    // 创建新的 URL
    internalAudioUrl.value = URL.createObjectURL(newFile)
  }
}, { immediate: true })

// 组件卸载时清理 URL
onUnmounted(() => {
  if (internalAudioUrl.value) {
    URL.revokeObjectURL(internalAudioUrl.value)
  }
  if (audioRef.value) {
    audioRef.value.pause()
  }
})

// 视口状态（显示音频的哪个部分，百分比 0-100）
const viewStart = ref(0)
const viewEnd = ref(40) // 默认显示40%的音频
const zoomLevel = computed(() => 100 / (viewEnd.value - viewStart.value))

// 选择区域状态（相对于整个音频的百分比 0-100）
const selectionStart = ref(10)
const selectionEnd = ref(30)

// 拖动状态
const isDragging = ref<'start' | 'end' | 'range' | 'pan' | null>(null)
const dragStartX = ref(0)
const dragStartSelectionStart = ref(0)
const dragStartSelectionEnd = ref(0)
const dragStartViewStart = ref(0)
const dragStartViewEnd = ref(0)
const justFinishedDrag = ref(false)

const waveformRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

// 生成固定的波形数据（更多数据点用于长音频）
const waveformData = Array.from({ length: 200 }, () => Math.floor(Math.random() * 28 + 6))

// 计算选中时长
const selectedDurationSeconds = computed(() => {
  const duration = ((selectionEnd.value - selectionStart.value) / 100) * props.totalDuration
  return Math.round(duration)
})

// 格式化时间
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 计算时间标签
const startTimeLabel = computed(() => {
  const seconds = (selectionStart.value / 100) * props.totalDuration
  return formatTime(seconds)
})

const endTimeLabel = computed(() => {
  const seconds = (selectionEnd.value / 100) * props.totalDuration
  return formatTime(seconds)
})

const totalDurationLabel = computed(() => formatTime(props.totalDuration) + ' total')

// 将全局位置转换为视口内位置
const globalToViewport = (globalPercent: number) => {
  return ((globalPercent - viewStart.value) / (viewEnd.value - viewStart.value)) * 100
}

// 将视口内位置转换为全局位置
const viewportToGlobal = (viewportPercent: number) => {
  return viewStart.value + (viewportPercent / 100) * (viewEnd.value - viewStart.value)
}

// 判断选择区域是否在视口内可见
const isSelectionVisible = computed(() => {
  return selectionEnd.value > viewStart.value && selectionStart.value < viewEnd.value
})

// 计算选择区域在视口内的位置
const selectionViewportStart = computed(() => {
  return Math.max(0, globalToViewport(selectionStart.value))
})

const selectionViewportEnd = computed(() => {
  return Math.min(100, globalToViewport(selectionEnd.value))
})

// 判断波形条是否在选择区域内
const isBarSelected = (index: number, totalBars: number) => {
  const barGlobalPosition = viewStart.value + (index / totalBars) * (viewEnd.value - viewStart.value)
  return barGlobalPosition >= selectionStart.value && barGlobalPosition <= selectionEnd.value
}

// 计算当前视口显示的波形条数量和数据
const visibleWaveformData = computed(() => {
  const startIndex = Math.floor((viewStart.value / 100) * waveformData.length)
  const endIndex = Math.ceil((viewEnd.value / 100) * waveformData.length)
  return waveformData.slice(startIndex, endIndex)
})

// 拖动处理
const startDrag = (type: 'start' | 'end' | 'range' | 'pan', event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = type
  dragStartX.value = event.clientX
  dragStartSelectionStart.value = selectionStart.value
  dragStartSelectionEnd.value = selectionEnd.value
  dragStartViewStart.value = viewStart.value
  dragStartViewEnd.value = viewEnd.value

  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
}

const handleDrag = (event: MouseEvent) => {
  if (!isDragging.value || !waveformRef.value) return

  const rect = waveformRef.value.getBoundingClientRect()
  const deltaX = event.clientX - dragStartX.value
  const viewportDeltaPercent = (deltaX / rect.width) * 100

  // 对于 range 和 start/end 拖动，使用拖动开始时的视口宽度
  const viewWidth = dragStartViewEnd.value - dragStartViewStart.value
  const globalDeltaPercent = (viewportDeltaPercent / 100) * viewWidth

  const minSelection = (10 / props.totalDuration) * 100 // 最小10秒

  if (isDragging.value === 'start') {
    let newStart = dragStartSelectionStart.value + globalDeltaPercent
    newStart = Math.max(0, Math.min(newStart, selectionEnd.value - minSelection))
    selectionStart.value = newStart
  } else if (isDragging.value === 'end') {
    let newEnd = dragStartSelectionEnd.value + globalDeltaPercent
    newEnd = Math.min(100, Math.max(newEnd, selectionStart.value + minSelection))
    selectionEnd.value = newEnd
  } else if (isDragging.value === 'range') {
    const rangeWidth = dragStartSelectionEnd.value - dragStartSelectionStart.value
    let newStart = dragStartSelectionStart.value + globalDeltaPercent
    let newEnd = dragStartSelectionEnd.value + globalDeltaPercent

    // 边界检查 - 确保范围宽度保持不变
    if (newStart < 0) {
      newStart = 0
      newEnd = newStart + rangeWidth
    } else if (newEnd > 100) {
      newEnd = 100
      newStart = newEnd - rangeWidth
    }

    selectionStart.value = newStart
    selectionEnd.value = newEnd
  } else if (isDragging.value === 'pan') {
    let newViewStart = dragStartViewStart.value - globalDeltaPercent
    let newViewEnd = dragStartViewEnd.value - globalDeltaPercent

    if (newViewStart < 0) {
      newViewStart = 0
      newViewEnd = viewWidth
    }
    if (newViewEnd > 100) {
      newViewEnd = 100
      newViewStart = 100 - viewWidth
    }

    viewStart.value = newViewStart
    viewEnd.value = newViewEnd
  }
}

const stopDrag = () => {
  isDragging.value = null
  justFinishedDrag.value = true

  // 100ms 后清除标志，防止拖动后立即触发点击
  setTimeout(() => {
    justFinishedDrag.value = false
  }, 100)

  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 点击波形区域直接设置位置
const handleWaveformClick = (event: MouseEvent) => {
  // 防止拖动后立即触发点击
  if (isDragging.value || justFinishedDrag.value || !waveformRef.value) return

  const rect = waveformRef.value.getBoundingClientRect()
  const clickViewportPercent = ((event.clientX - rect.left) / rect.width) * 100
  const clickGlobalPercent = viewportToGlobal(clickViewportPercent)

  // 判断点击位置更接近哪个手柄
  const distToStart = Math.abs(clickGlobalPercent - selectionStart.value)
  const distToEnd = Math.abs(clickGlobalPercent - selectionEnd.value)

  const minSelection = (10 / props.totalDuration) * 100 // 最小10秒

  if (distToStart < distToEnd) {
    selectionStart.value = Math.max(0, Math.min(clickGlobalPercent, selectionEnd.value - minSelection))
  } else {
    selectionEnd.value = Math.min(100, Math.max(clickGlobalPercent, selectionStart.value + minSelection))
  }
}

// 滚轮缩放
const handleWheel = (event: WheelEvent) => {
  event.preventDefault()

  const rect = waveformRef.value?.getBoundingClientRect()
  if (!rect) return

  const mouseX = (event.clientX - rect.left) / rect.width
  const currentViewWidth = viewEnd.value - viewStart.value
  const zoomFactor = event.deltaY > 0 ? 1.1 : 0.9

  let newViewWidth = currentViewWidth * zoomFactor
  newViewWidth = Math.max(10, Math.min(100, newViewWidth)) // 最小显示10%，最大100%

  const mouseGlobalPercent = viewStart.value + mouseX * currentViewWidth
  const newViewStart = mouseGlobalPercent - mouseX * newViewWidth
  const newViewEnd = mouseGlobalPercent + (1 - mouseX) * newViewWidth

  viewStart.value = Math.max(0, newViewStart)
  viewEnd.value = Math.min(100, newViewEnd)

  // 确保视口宽度正确
  if (viewStart.value === 0) {
    viewEnd.value = Math.min(100, newViewWidth)
  }
  if (viewEnd.value === 100) {
    viewStart.value = Math.max(0, 100 - newViewWidth)
  }
}

// 快速导航到选择区域
const scrollToSelection = () => {
  const selectionCenter = (selectionStart.value + selectionEnd.value) / 2
  const viewWidth = viewEnd.value - viewStart.value
  let newViewStart = selectionCenter - viewWidth / 2
  let newViewEnd = selectionCenter + viewWidth / 2

  if (newViewStart < 0) {
    newViewStart = 0
    newViewEnd = viewWidth
  }
  if (newViewEnd > 100) {
    newViewEnd = 100
    newViewStart = 100 - viewWidth
  }

  viewStart.value = newViewStart
  viewEnd.value = newViewEnd
}

// 缩放控制
const zoomIn = () => {
  const center = (viewStart.value + viewEnd.value) / 2
  const currentWidth = viewEnd.value - viewStart.value
  const newWidth = Math.max(10, currentWidth * 0.7)

  viewStart.value = Math.max(0, center - newWidth / 2)
  viewEnd.value = Math.min(100, center + newWidth / 2)
}

const zoomOut = () => {
  const center = (viewStart.value + viewEnd.value) / 2
  const currentWidth = viewEnd.value - viewStart.value
  const newWidth = Math.min(100, currentWidth * 1.4)

  viewStart.value = Math.max(0, center - newWidth / 2)
  viewEnd.value = Math.min(100, center + newWidth / 2)
}

const resetZoom = () => {
  viewStart.value = 0
  viewEnd.value = 100
}

const verificationText = ref('Hello, this is a test of my cloned voice. I hope it sounds natural and authentic.')
const maxChars = 200

const canPreview = computed(() => verificationText.value.length > 0 && selectedDurationSeconds.value >= 10)

// 音频播放控制
const togglePlayback = () => {
  if (!audioRef.value) return

  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    // 设置播放范围
    const startSeconds = (selectionStart.value / 100) * actualDuration.value
    audioRef.value.currentTime = startSeconds
    audioRef.value.play()
  }
}

const handleAudioPlay = () => {
  isPlaying.value = true
}

const handleAudioPause = () => {
  isPlaying.value = false
}

const handleAudioTimeUpdate = () => {
  if (!audioRef.value) return

  playbackTime.value = audioRef.value.currentTime

  // 如果播放超过了选择区域的结束时间，暂停
  const endSeconds = (selectionEnd.value / 100) * actualDuration.value
  if (audioRef.value.currentTime >= endSeconds) {
    audioRef.value.pause()
    audioRef.value.currentTime = (selectionStart.value / 100) * actualDuration.value
  }
}

const handleAudioLoadedMetadata = () => {
  if (audioRef.value) {
    actualDuration.value = audioRef.value.duration
  }
}

const handleAudioEnded = () => {
  isPlaying.value = false
}

// 当前播放位置在视口中的百分比
const playbackViewportPosition = computed(() => {
  const playbackGlobalPercent = (playbackTime.value / actualDuration.value) * 100
  return globalToViewport(playbackGlobalPercent)
})

// 是否在播放选择区域内
const isPlaybackInSelection = computed(() => {
  const playbackGlobalPercent = (playbackTime.value / actualDuration.value) * 100
  return playbackGlobalPercent >= selectionStart.value && playbackGlobalPercent <= selectionEnd.value
})

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'close'): void
  (e: 'get-more'): void
  (e: 'remove-file'): void
  (e: 'preview-clone', selection: { start: number; end: number }): void
}>()

const handlePreview = () => {
  if (canPreview.value) {
    emit('preview-clone', {
      start: (selectionStart.value / 100) * props.totalDuration,
      end: (selectionEnd.value / 100) * props.totalDuration
    })
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

      <!-- Hidden Audio Element -->
      <audio
        ref="audioRef"
        :src="effectiveAudioUrl"
        class="hidden"
        @play="handleAudioPlay"
        @pause="handleAudioPause"
        @timeupdate="handleAudioTimeUpdate"
        @loadedmetadata="handleAudioLoadedMetadata"
        @ended="handleAudioEnded"
      />

      <!-- Uploaded File Card -->
      <div class="w-[500px] rounded-xl border border-[#4caf50] bg-[#f1f8e9] p-3.5">
        <!-- File Info Row -->
        <div class="flex items-center mb-3">
          <!-- Play Button -->
          <button
            class="w-11 h-11 rounded-[10px] bg-[#e8f5e9] flex items-center justify-center hover:bg-[#c8e6c9] transition-colors cursor-pointer"
            @click="togglePlayback"
          >
            <UIcon
              :name="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
              class="w-[22px] h-[22px] text-[#4caf50]"
              :class="isPlaying ? '' : 'ml-0.5'"
            />
          </button>
          <div class="ml-3 flex-1">
            <p class="text-sm font-semibold text-[#202123] font-['Reddit_Sans']">{{ fileName }}</p>
            <p class="text-xs text-[#979797] font-['Reddit_Sans'] mt-0.5">{{ fileSize }} • {{ totalDurationLabel }}</p>
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

        <!-- Mini Overview (全局视图) -->
        <div class="w-full h-6 rounded bg-[#e8f5e9] relative mb-2 cursor-pointer" @click="scrollToSelection">
          <!-- 选择区域指示器 -->
          <div
            class="absolute top-0 h-full bg-[#4caf50]/40 rounded-sm"
            :style="{
              left: selectionStart + '%',
              width: (selectionEnd - selectionStart) + '%'
            }"
          />
          <!-- 当前视口指示器 -->
          <div
            class="absolute top-0 h-full border-2 border-[#4caf50] rounded-sm bg-white/30"
            :style="{
              left: viewStart + '%',
              width: (viewEnd - viewStart) + '%'
            }"
          />
          <!-- 迷你波形 -->
          <div class="absolute inset-0 flex items-center justify-around px-1 pointer-events-none opacity-50">
            <div
              v-for="(height, i) in waveformData.filter((_, idx) => idx % 4 === 0)"
              :key="i"
              class="w-px rounded-sm bg-[#4caf50]"
              :style="{ height: Math.max(2, height / 4) + 'px' }"
            />
          </div>
        </div>

        <!-- Zoom Controls -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-1">
            <button
              class="w-6 h-6 rounded bg-white border border-[#d0d0d0] flex items-center justify-center text-[#4caf50] hover:bg-[#e8f5e9] transition-colors cursor-pointer"
              @click="zoomOut"
              title="Zoom Out"
            >
              <UIcon name="i-lucide-zoom-out" class="w-3.5 h-3.5" />
            </button>
            <button
              class="w-6 h-6 rounded bg-white border border-[#d0d0d0] flex items-center justify-center text-[#4caf50] hover:bg-[#e8f5e9] transition-colors cursor-pointer"
              @click="zoomIn"
              title="Zoom In"
            >
              <UIcon name="i-lucide-zoom-in" class="w-3.5 h-3.5" />
            </button>
            <button
              class="px-2 h-6 rounded bg-white border border-[#d0d0d0] flex items-center justify-center text-[10px] text-[#4caf50] hover:bg-[#e8f5e9] transition-colors cursor-pointer font-medium"
              @click="resetZoom"
              title="Reset Zoom"
            >
              {{ zoomLevel.toFixed(1) }}x
            </button>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-[#81c784] font-['Reddit_Sans']">
              {{ formatTime((viewStart / 100) * totalDuration) }} - {{ formatTime((viewEnd / 100) * totalDuration) }}
            </span>
            <button
              v-if="!isSelectionVisible"
              class="px-2 h-5 rounded bg-[#4caf50] text-white text-[10px] font-medium hover:bg-[#388e3c] transition-colors cursor-pointer"
              @click="scrollToSelection"
            >
              Go to Selection
            </button>
          </div>
        </div>

        <!-- Waveform Area -->
        <div
          ref="waveformRef"
          class="w-full h-14 rounded-md bg-[#e8f5e9] relative select-none overflow-hidden"
          :class="isDragging === 'pan' ? 'cursor-grabbing' : 'cursor-grab'"
          @click="handleWaveformClick"
          @mousedown="startDrag('pan', $event)"
          @wheel="handleWheel"
        >
          <!-- Selected Range Background -->
          <div
            v-if="isSelectionVisible"
            class="absolute top-0 h-full bg-[#4caf50]/20 cursor-move"
            :style="{
              left: Math.max(0, selectionViewportStart) + '%',
              width: Math.min(100, selectionViewportEnd) - Math.max(0, selectionViewportStart) + '%'
            }"
            @mousedown.stop="startDrag('range', $event)"
          />

          <!-- Left Handle -->
          <div
            v-if="selectionViewportStart >= 0 && selectionViewportStart <= 100"
            class="absolute top-0 w-1.5 h-full bg-[#4caf50] rounded-sm cursor-ew-resize hover:bg-[#388e3c] transition-colors z-10"
            :style="{ left: `calc(${selectionViewportStart}% - 3px)` }"
            @mousedown.stop="startDrag('start', $event)"
          >
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 rounded bg-[#4caf50] hover:bg-[#388e3c] flex items-center justify-center shadow-md">
              <div class="flex gap-0.5">
                <div class="w-0.5 h-4 bg-white/60 rounded" />
                <div class="w-0.5 h-4 bg-white/60 rounded" />
              </div>
            </div>
          </div>

          <!-- Right Handle -->
          <div
            v-if="selectionViewportEnd >= 0 && selectionViewportEnd <= 100"
            class="absolute top-0 w-1.5 h-full bg-[#4caf50] rounded-sm cursor-ew-resize hover:bg-[#388e3c] transition-colors z-10"
            :style="{ left: `calc(${selectionViewportEnd}% - 3px)` }"
            @mousedown.stop="startDrag('end', $event)"
          >
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 rounded bg-[#4caf50] hover:bg-[#388e3c] flex items-center justify-center shadow-md">
              <div class="flex gap-0.5">
                <div class="w-0.5 h-4 bg-white/60 rounded" />
                <div class="w-0.5 h-4 bg-white/60 rounded" />
              </div>
            </div>
          </div>

          <!-- Waveform Bars -->
          <div class="absolute inset-0 flex items-center justify-around px-2 pointer-events-none">
            <div
              v-for="(height, i) in visibleWaveformData"
              :key="i"
              class="w-0.5 rounded-sm transition-colors duration-100"
              :class="isBarSelected(i, visibleWaveformData.length) ? 'bg-[#4caf50]' : 'bg-[#81c784]'"
              :style="{ height: height + 'px' }"
            />
          </div>

          <!-- Playhead Indicator -->
          <div
            v-if="isPlaying && playbackViewportPosition >= 0 && playbackViewportPosition <= 100"
            class="absolute top-0 w-0.5 h-full bg-[#e53935] z-20 pointer-events-none transition-all duration-75"
            :style="{ left: playbackViewportPosition + '%' }"
          >
            <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#e53935]" />
          </div>

          <!-- Pan Hint Overlay -->
          <div
            v-if="isDragging === 'pan'"
            class="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none"
          >
            <UIcon name="i-lucide-move-horizontal" class="w-6 h-6 text-[#4caf50]/50" />
          </div>
        </div>

        <!-- Time Labels -->
        <div class="flex items-center mt-2 relative h-5">
          <!-- Start Time Label -->
          <span
            v-if="selectionViewportStart >= -10 && selectionViewportStart <= 110"
            class="absolute text-[11px] font-semibold text-[#4caf50] font-['Reddit_Sans'] -translate-x-1/2 whitespace-nowrap"
            :style="{ left: Math.max(5, Math.min(95, selectionViewportStart)) + '%' }"
          >
            {{ startTimeLabel }}
          </span>
          <!-- End Time Label -->
          <span
            v-if="selectionViewportEnd >= -10 && selectionViewportEnd <= 110"
            class="absolute text-[11px] font-semibold text-[#4caf50] font-['Reddit_Sans'] -translate-x-1/2 whitespace-nowrap"
            :style="{ left: Math.max(5, Math.min(95, selectionViewportEnd)) + '%' }"
          >
            {{ endTimeLabel }}
          </span>
          <!-- Selected Duration -->
          <span class="absolute right-0 text-[11px] text-[#979797] font-['Reddit_Sans']">
            Selected: {{ selectedDurationSeconds }}s
          </span>
        </div>

        <!-- Hint Text -->
        <p class="text-[10px] text-[#81c784] font-['Reddit_Sans'] mt-2 text-center">
          Drag handles to select • Drag waveform to pan • Scroll to zoom
        </p>
      </div>

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
