<script setup lang="ts">
interface Props {
  availableClones?: number
  totalClones?: number
}

const props = withDefaults(defineProps<Props>(), {
  availableClones: 2,
  totalClones: 3
})

// 录音状态
const isRecording = ref(false)
const recordingTime = ref(0)
const minDuration = 10 // 最小录音时长（秒）
const maxDuration = 120 // 最大录音时长（秒）

// 录音相关
let recordingTimer: ReturnType<typeof setInterval> | null = null
let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []
const audioStream = ref<MediaStream | null>(null)
const recordedAudioUrl = ref<string | null>(null)
const recordedAudioBlob = ref<Blob | null>(null)

// 音频分析（用于波形动画）
let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null
const audioLevels = ref<number[]>(Array(16).fill(20))

// 验证文本
const verificationText = ref('')
const maxChars = 200

// 计算属性
const minDurationReached = computed(() => recordingTime.value >= minDuration)
const canPreview = computed(() => minDurationReached.value && verificationText.value.length > 0 && recordedAudioBlob.value !== null)

const formattedTime = computed(() => {
  const minutes = Math.floor(recordingTime.value / 60)
  const seconds = recordingTime.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'close'): void
  (e: 'get-more'): void
  (e: 'preview-clone', data: { audio: Blob; text: string; duration: number }): void
  (e: 'save-recording', data: { audioBlob: Blob; fileName: string; fileSize: string; duration: number }): void
}>()

// 开始录音
const startRecording = async () => {
  try {
    // 获取麦克风权限
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioStream.value = stream

    // 创建音频分析器（用于波形动画）
    audioContext = new AudioContext()
    analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)
    analyser.fftSize = 32

    // 创建录音器
    mediaRecorder = new MediaRecorder(stream)
    audioChunks = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
      recordedAudioBlob.value = audioBlob
      recordedAudioUrl.value = URL.createObjectURL(audioBlob)
    }

    mediaRecorder.start(100) // 每100ms收集一次数据
    isRecording.value = true
    recordingTime.value = 0

    // 开始计时
    recordingTimer = setInterval(() => {
      recordingTime.value++
      updateAudioLevels()

      // 达到最大时长自动停止
      if (recordingTime.value >= maxDuration) {
        stopRecording()
      }
    }, 1000)

    // 启动波形动画
    animateWaveform()
  } catch (error) {
    console.error('无法访问麦克风:', error)
    alert('无法访问麦克风，请确保已授予麦克风权限')
  }
}

// 更新音频电平（用于波形动画）
const updateAudioLevels = () => {
  if (!analyser) return

  const dataArray = new Uint8Array(analyser.frequencyBinCount)
  analyser.getByteFrequencyData(dataArray)

  // 将频率数据映射到波形高度
  const levels: number[] = []
  for (let i = 0; i < 16; i++) {
    const index = Math.floor((i / 16) * dataArray.length)
    const value = dataArray[index]
    levels.push(Math.max(10, (value / 255) * 40 + 10))
  }
  audioLevels.value = levels
}

// 波形动画循环
let animationFrameId: number | null = null
const animateWaveform = () => {
  if (!isRecording.value) return

  updateAudioLevels()
  animationFrameId = requestAnimationFrame(animateWaveform)
}

// 停止录音
const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
  }

  // 停止所有音轨
  if (audioStream.value) {
    audioStream.value.getTracks().forEach(track => track.stop())
    audioStream.value = null
  }

  // 清理音频分析器
  if (audioContext) {
    audioContext.close()
    audioContext = null
    analyser = null
  }

  // 停止计时器
  if (recordingTimer) {
    clearInterval(recordingTimer)
    recordingTimer = null
  }

  // 停止动画
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  isRecording.value = false
  audioLevels.value = Array(16).fill(20)
}

// 切换录音状态
const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    // 如果之前有录音，清除它
    if (recordedAudioUrl.value) {
      URL.revokeObjectURL(recordedAudioUrl.value)
      recordedAudioUrl.value = null
      recordedAudioBlob.value = null
    }
    startRecording()
  }
}

// 预览克隆 - 同时保存录音并切换到uploaded状态
const handlePreview = () => {
  if (canPreview.value && recordedAudioBlob.value) {
    // 计算文件大小
    const sizeInMB = (recordedAudioBlob.value.size / (1024 * 1024)).toFixed(2)
    const fileName = `recording-${new Date().getTime()}.webm`

    // 发送保存录音事件，传递录音数据
    emit('save-recording', {
      audioBlob: recordedAudioBlob.value,
      fileName: fileName,
      fileSize: `${sizeInMB} MB`,
      duration: recordingTime.value
    })
  }
}

// 组件卸载时清理
onUnmounted(() => {
  stopRecording()
  if (recordedAudioUrl.value) {
    URL.revokeObjectURL(recordedAudioUrl.value)
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

      <!-- Recording Area -->
      <div class="w-[500px] h-[200px] rounded-xl border border-[#e5e5e5] bg-white flex flex-col items-center justify-center relative">
        <!-- Waveform Animation (when recording) -->
        <div v-if="isRecording" class="absolute left-[120px] top-[44px] flex items-center gap-[7px]">
          <div
            v-for="(height, i) in audioLevels.slice(0, 8)"
            :key="'left-' + i"
            class="w-[3px] rounded-sm bg-[#e85a8f] transition-all duration-100"
            :style="{ height: height + 'px' }"
          />
        </div>
        <div v-if="isRecording" class="absolute right-[120px] top-[44px] flex items-center gap-[7px]">
          <div
            v-for="(height, i) in audioLevels.slice(8, 16)"
            :key="'right-' + i"
            class="w-[3px] rounded-sm bg-[#e85a8f] transition-all duration-100"
            :style="{ height: height + 'px' }"
          />
        </div>

        <!-- Record Button -->
        <button
          class="w-20 h-20 rounded-full bg-[#ffe0eb] border-2 border-[#e85a8f] flex items-center justify-center cursor-pointer hover:bg-[#ffd0e0] active:scale-95 transition-all"
          @click="toggleRecording"
        >
          <div class="w-14 h-14 rounded-full bg-[#e85a8f] flex items-center justify-center">
            <UIcon
              :name="isRecording ? 'i-lucide-square' : 'i-lucide-mic'"
              class="text-white"
              :class="isRecording ? 'w-5 h-5' : 'w-7 h-7'"
            />
          </div>
        </button>

        <!-- Recording Time -->
        <p class="text-2xl font-semibold text-[#e85a8f] font-['Reddit_Sans'] mt-3">
          {{ formattedTime }}
        </p>

        <!-- Status Text -->
        <p class="text-[13px] font-['Reddit_Sans'] mt-2" :class="isRecording ? 'text-[#e85a8f]' : 'text-[#979797]'">
          {{ isRecording ? 'Recording... Tap to stop' : 'Tap to start recording' }}
        </p>

        <!-- Min Duration -->
        <p
          class="text-[11px] font-['Reddit_Sans'] mt-2"
          :class="minDurationReached ? 'text-[#4caf50]' : 'text-[#b0b0b0]'"
        >
          {{ minDurationReached ? '✓ Minimum duration reached' : 'Minimum 10 seconds required' }}
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

      <!-- Recorded Audio Playback (hidden, for debugging) -->
      <audio v-if="recordedAudioUrl" :src="recordedAudioUrl" controls class="hidden" />
    </div>
  </div>
</template>
