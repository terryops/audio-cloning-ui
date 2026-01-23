<script setup lang="ts">
interface Voice {
  id: string
  name: string
  selected?: boolean
  audioUrl?: string
  isPlaying?: boolean
}

const voices = ref<Voice[]>([
  { id: '1', name: "Terry's Voice", selected: true, audioUrl: '', isPlaying: false },
  { id: '2', name: "Sarah's Voice", selected: false, audioUrl: '', isPlaying: false }
])

const selectedModel = ref('voice-clone')
const selectedLanguage = ref('English')
const selectedTone = ref('Professional')
const creditCost = ref(0.38)
const isCreatingSpeech = ref(false)

// 当前播放的音频元素
const currentAudio = ref<HTMLAudioElement | null>(null)
const currentPlayingId = ref<string | null>(null)

const languages = ['English', 'Chinese', 'Spanish', 'French', 'German', 'Japanese', 'Korean']
const tones = ['Professional', 'Casual', 'Friendly', 'Formal', 'Enthusiastic']

// 根据选择计算 credit 消耗
const calculateCreditCost = computed(() => {
  switch (selectedModel.value) {
    case 'microsoft':
      return 0.1
    case 'subeasy':
      return 1.0
    case 'voice-clone':
      return 1.0
    default:
      return 0.38
  }
})

// 获取选中的语音
const selectedVoice = computed(() => voices.value.find(v => v.selected))

// 是否可以创建语音
const canCreateSpeech = computed(() => {
  if (selectedModel.value === 'voice-clone') {
    return selectedVoice.value !== undefined
  }
  return true
})

const emit = defineEmits<{
  (e: 'create-speech', data: { model: string; voice: Voice | undefined; language: string; tone: string }): void
  (e: 'create-voice'): void
  (e: 'play-voice', id: string): void
  (e: 'delete-voice', id: string): void
}>()

function selectVoice(id: string) {
  voices.value = voices.value.map(v => ({
    ...v,
    selected: v.id === id
  }))
}

// 播放/暂停语音预览
function togglePlayVoice(voice: Voice) {
  // 如果有其他音频在播放，先停止
  if (currentAudio.value && currentPlayingId.value !== voice.id) {
    currentAudio.value.pause()
    currentAudio.value = null
    voices.value = voices.value.map(v => ({ ...v, isPlaying: false }))
  }

  // 如果当前语音正在播放，暂停它
  if (currentPlayingId.value === voice.id && currentAudio.value) {
    currentAudio.value.pause()
    currentAudio.value = null
    currentPlayingId.value = null
    voices.value = voices.value.map(v => ({
      ...v,
      isPlaying: v.id === voice.id ? false : v.isPlaying
    }))
    return
  }

  // 如果有音频 URL，播放它
  if (voice.audioUrl) {
    const audio = new Audio(voice.audioUrl)
    currentAudio.value = audio
    currentPlayingId.value = voice.id

    audio.onplay = () => {
      voices.value = voices.value.map(v => ({
        ...v,
        isPlaying: v.id === voice.id
      }))
    }

    audio.onended = () => {
      voices.value = voices.value.map(v => ({
        ...v,
        isPlaying: false
      }))
      currentPlayingId.value = null
      currentAudio.value = null
    }

    audio.onerror = () => {
      voices.value = voices.value.map(v => ({
        ...v,
        isPlaying: false
      }))
      currentPlayingId.value = null
      currentAudio.value = null
    }

    audio.play()
  } else {
    // 没有音频 URL，通知父组件
    emit('play-voice', voice.id)
  }
}

// 创建语音
function handleCreateSpeech() {
  if (!canCreateSpeech.value) return

  isCreatingSpeech.value = true
  emit('create-speech', {
    model: selectedModel.value,
    voice: selectedVoice.value,
    language: selectedLanguage.value,
    tone: selectedTone.value
  })

  // 模拟完成（实际项目中由父组件控制）
  setTimeout(() => {
    isCreatingSpeech.value = false
  }, 2000)
}

// 删除语音
function deleteVoice(id: string, event: MouseEvent) {
  event.stopPropagation()

  // 如果正在播放这个语音，先停止
  if (currentPlayingId.value === id && currentAudio.value) {
    currentAudio.value.pause()
    currentAudio.value = null
    currentPlayingId.value = null
  }

  voices.value = voices.value.filter(v => v.id !== id)
  emit('delete-voice', id)
}

// 添加新语音（供父组件调用）
function addVoice(voice: Voice) {
  voices.value.push({ ...voice, selected: false, isPlaying: false })
}

// 组件卸载时清理
onUnmounted(() => {
  if (currentAudio.value) {
    currentAudio.value.pause()
    currentAudio.value = null
  }
})

// 暴露方法给父组件
defineExpose({ addVoice })
</script>

<template>
  <div class="w-[560px] bg-white rounded-[10px] overflow-hidden">
    <!-- Header -->
    <div class="px-[30px] pt-4 pb-[13px]">
      <h1 class="text-[15px] font-semibold text-[#202123] font-['Reddit_Sans']">
        Dubbing Studio
      </h1>
    </div>

    <!-- Divider -->
    <div class="h-px bg-[#00000008] mx-0" />

    <!-- Model Section -->
    <div class="px-[30px] pt-4">
      <h2 class="text-[15px] font-semibold text-[#202123] font-['Reddit_Sans'] mb-3">
        Model
      </h2>

      <!-- Model Cards -->
      <div class="flex gap-[10px]">
        <!-- Microsoft -->
        <button
          class="w-[160px] h-[56px] rounded-lg flex flex-col justify-center px-[15px] py-[10px] transition-all"
          :class="[
            selectedModel === 'microsoft'
              ? 'bg-[#f4f7ff] border border-[#695fee]'
              : 'bg-[#f4f7ff] border border-transparent'
          ]"
          @click="selectedModel = 'microsoft'"
        >
          <div class="flex items-center gap-1">
            <div class="w-4 h-4 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect width="6.18" height="6.18" fill="#f25022" />
                <rect x="6.82" width="6.18" height="6.18" fill="#7fba00" />
                <rect y="6.82" width="6.18" height="6.18" fill="#00a4ef" />
                <rect x="6.82" y="6.82" width="6.18" height="6.18" fill="#ffb900" />
              </svg>
            </div>
            <span class="text-[13px] font-semibold text-[#21293c] font-['Reddit_Sans']">Microsoft</span>
          </div>
          <span class="text-[12px] text-[#979797] font-['Reddit_Sans'] mt-[3px]">0.1 credit/1k characters</span>
        </button>

        <!-- SubEasy AI -->
        <button
          class="w-[160px] h-[56px] rounded-lg flex flex-col justify-center px-[15px] py-[10px] transition-all"
          :class="[
            selectedModel === 'subeasy'
              ? 'bg-[#f4f7ff] border border-[#695fee]'
              : 'bg-[#f4f7ff] border border-transparent'
          ]"
          @click="selectedModel = 'subeasy'"
        >
          <div class="flex items-center gap-1">
            <div class="w-4 h-4 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M7.04 13.8L0.68 6.18" stroke="#ab5bff" stroke-width="2.82" stroke-linecap="round" />
                <path d="M9.92 10.18L5.36 6.18" stroke="#675bff" stroke-width="2.82" stroke-linecap="round" />
                <path d="M12.52 6.08L9.84 3.22" stroke="#00bbf3" stroke-width="2.82" stroke-linecap="round" />
              </svg>
            </div>
            <span class="text-[13px] font-semibold text-[#21293c] font-['Reddit_Sans']">SubEasy AI</span>
            <span class="px-1.5 py-0.5 rounded-[3px] bg-[#ffc661] text-[9.5px] font-bold text-white" />
          </div>
          <span class="text-[12px] text-[#979797] font-['Reddit_Sans'] mt-[3px]">1 credit/1k characters</span>
        </button>

        <!-- Voice Clone -->
        <button
          class="w-[160px] h-[56px] rounded-lg flex flex-col justify-center px-[15px] py-[10px] transition-all"
          :class="[
            selectedModel === 'voice-clone'
              ? 'bg-[#f4f7ff] border border-[#695fee]'
              : 'bg-[#f4f7ff] border border-transparent'
          ]"
          @click="selectedModel = 'voice-clone'"
        >
          <div class="flex items-center gap-1">
            <div class="w-4 h-4 flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M12.31 12.31L0 0L0 12.31L12.31 12.31Z" fill="#eabfff" />
                <rect x="4.14" y="4.14" width="8.95" height="8.95" fill="white" />
                <path d="M12.31 12.31L2.69 2.69L2.69 12.31L12.31 12.31Z" fill="#6666ff" />
              </svg>
            </div>
            <span
              class="text-[13px] font-semibold font-['Reddit_Sans']"
              :class="selectedModel === 'voice-clone' ? 'text-[#695fee]' : 'text-[#21293c]'"
            >
              Voice Clone
            </span>
            <span class="px-1 py-0.5 rounded-[3px] bg-[#ff506d] text-[9.5px] font-bold text-white">NEW</span>
          </div>
          <span
            class="text-[12px] font-['Reddit_Sans'] mt-[3px]"
            :class="selectedModel === 'voice-clone' ? 'text-[#695fee]' : 'text-[#979797]'"
          >
            1 credit/1k characters
          </span>
        </button>
      </div>
    </div>

    <!-- My Voices Section -->
    <div class="px-[30px] pt-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-[15px] font-semibold text-[#202123] font-['Reddit_Sans']">
          My Voices
        </h2>
        <span class="text-xs text-[#979797] font-['Reddit_Sans']">{{ voices.length }} voice(s)</span>
      </div>

      <!-- Voice List Card -->
      <div class="w-[500px] bg-[#f7f9fe] rounded-lg border border-[#ecedef]">
        <!-- Voice Items -->
        <template v-for="(voice, index) in voices" :key="voice.id">
          <div class="w-full h-14 flex items-center px-4 group">
            <button
              class="flex items-center flex-1 hover:opacity-80 transition-opacity"
              @click="selectVoice(voice.id)"
            >
              <div
                class="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                :class="voice.selected ? 'bg-[#f4f7ff] border border-[#695fee]' : 'bg-[#f7f9fe] border border-[#d0d0d0]'"
              >
                <UIcon
                  name="i-lucide-audio-lines"
                  class="w-[18px] h-[18px]"
                  :class="[voice.selected ? 'text-[#695fee]' : 'text-[#979797]', { 'animate-pulse': voice.isPlaying }]"
                />
              </div>
              <span
                class="ml-3 text-[13px] font-['Reddit_Sans']"
                :class="voice.selected ? 'text-[#695fee] font-semibold' : 'text-[#202123]'"
              >
                {{ voice.name }}
              </span>
            </button>

            <!-- Delete Button (shown on hover) -->
            <button
              class="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-[#ffebee] transition-all mr-2"
              title="Delete voice"
              @click="deleteVoice(voice.id, $event)"
            >
              <UIcon name="i-lucide-trash-2" class="w-3.5 h-3.5 text-[#e53935]" />
            </button>

            <!-- Play/Pause Button -->
            <button
              class="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              :class="voice.isPlaying
                ? 'border-[#e53935] bg-[#e53935]'
                : 'border-[#695fee] hover:bg-[#695fee] group/play'"
              @click.stop="togglePlayVoice(voice)"
            >
              <UIcon
                :name="voice.isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
                class="w-4 h-4 transition-colors"
                :class="voice.isPlaying
                  ? 'text-white'
                  : 'text-[#695fee] group-hover/play:text-white'"
              />
            </button>
          </div>
          <div v-if="index < voices.length - 1" class="h-px bg-[#e5e5e5] mx-4" />
        </template>

        <!-- Divider before Add -->
        <div class="h-px bg-[#e5e5e5] mx-4" />

        <!-- Add New Voice -->
        <button
          class="w-full h-10 flex items-center justify-center text-[13px] text-[#979797] font-['Reddit_Sans'] hover:text-[#695fee] hover:bg-[#f0eeff] transition-colors rounded-b-lg"
          @click="emit('create-voice')"
        >
          <UIcon name="i-lucide-plus" class="w-4 h-4 mr-1.5" />
          Add new voice clone
        </button>
      </div>
    </div>

    <!-- Language Section -->
    <div class="px-[30px] pt-6">
      <h2 class="text-[15px] font-semibold text-[#202123] font-['Reddit_Sans'] mb-3">
        Language
      </h2>

      <div class="relative">
        <select
          v-model="selectedLanguage"
          class="w-[500px] h-10 px-4 bg-white rounded-lg border border-[#ecedef] text-[13px] font-semibold text-[#21293c] font-['Reddit_Sans'] appearance-none cursor-pointer focus:outline-none focus:border-[#695fee]"
        >
          <option v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</option>
        </select>
        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <UIcon name="i-lucide-chevron-down" class="w-4 h-4 text-[#202123]" />
        </div>
      </div>
    </div>

    <!-- Tone Section -->
    <div class="px-[30px] pt-6">
      <h2 class="text-[15px] font-semibold text-[#202123] font-['Reddit_Sans'] mb-3">
        Tone
      </h2>

      <div class="relative">
        <select
          v-model="selectedTone"
          class="w-[500px] h-10 px-4 bg-white rounded-lg border border-[#ecedef] text-[13px] font-semibold text-[#21293c] font-['Reddit_Sans'] appearance-none cursor-pointer focus:outline-none focus:border-[#695fee]"
        >
          <option v-for="tone in tones" :key="tone" :value="tone">{{ tone }}</option>
        </select>
        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <UIcon name="i-lucide-chevron-down" class="w-4 h-4 text-[#202123]" />
        </div>
      </div>
    </div>

    <!-- Create Speech Button -->
    <div class="px-[30px] pt-6 pb-6">
      <button
        class="w-[500px] h-10 rounded-[18px] text-white text-[13px] font-semibold font-['Reddit_Sans'] flex items-center justify-center transition-all"
        :class="canCreateSpeech && !isCreatingSpeech
          ? 'bg-[#695fee] hover:bg-[#5a4fdf] cursor-pointer active:scale-[0.98]'
          : 'bg-[#c5c5c5] cursor-not-allowed'"
        :disabled="!canCreateSpeech || isCreatingSpeech"
        @click="handleCreateSpeech"
      >
        <UIcon v-if="isCreatingSpeech" name="i-lucide-loader-2" class="w-4 h-4 mr-2 animate-spin" />
        {{ isCreatingSpeech ? 'Creating...' : `Create Speech (※ ${calculateCreditCost})` }}
      </button>
      <p v-if="selectedModel === 'voice-clone' && !selectedVoice" class="text-xs text-[#e53935] mt-2 text-center font-['Reddit_Sans']">
        Please select a voice to create speech
      </p>
    </div>
  </div>
</template>
