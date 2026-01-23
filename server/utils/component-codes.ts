// Auto-generated file - do not edit manually
// Generated at: 2026-01-23T10:51:47.001Z

export const componentCodes: Record<string, string> = {
  'BillingDetails.vue': `<script setup lang="ts">
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
              @click="deleteVoice(voice.id, \$event)"
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
        {{ isCreatingSpeech ? 'Creating...' : \`Create Speech (※ \${calculateCreditCost})\` }}
      </button>
      <p v-if="selectedModel === 'voice-clone' && !selectedVoice" class="text-xs text-[#e53935] mt-2 text-center font-['Reddit_Sans']">
        Please select a voice to create speech
      </p>
    </div>
  </div>
</template>
`,
  'BillingDetailsEmpty.vue': `<script setup lang="ts">
const selectedModel = ref('voice-clone')
const isCreatingSpeech = ref(false)

// 根据选择计算 credit 消耗
const creditCost = computed(() => {
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

// Voice Clone 模式下需要先创建语音
const canCreateSpeech = computed(() => {
  return selectedModel.value !== 'voice-clone'
})

const emit = defineEmits<{
  (e: 'create-speech', data: { model: string; creditCost: number }): void
  (e: 'create-voice'): void
}>()

// 创建语音
const handleCreateSpeech = () => {
  if (!canCreateSpeech.value) return

  isCreatingSpeech.value = true
  emit('create-speech', {
    model: selectedModel.value,
    creditCost: creditCost.value
  })

  // 模拟完成
  setTimeout(() => {
    isCreatingSpeech.value = false
  }, 2000)
}
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
      <h2 class="text-[15px] font-semibold text-[#202123] font-['Reddit_Sans'] mb-3">
        My Voices
      </h2>

      <!-- Empty State Card -->
      <div class="w-[500px] h-[195px] bg-[#f7f9fe] rounded-lg border border-[#ecedef] flex flex-col items-center justify-center">
        <button
          class="w-12 h-12 rounded-full bg-[#f4f7ff] border border-[#695fee] flex items-center justify-center mb-[17px] hover:bg-[#eef1ff] transition-colors cursor-pointer"
          @click="emit('create-voice')"
        >
          <UIcon name="i-lucide-plus" class="w-6 h-6 text-[#695fee]" />
        </button>
        <span class="text-[13px] text-[#979797] font-['Reddit_Sans']">Create a new voice clone</span>
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
        {{ isCreatingSpeech ? 'Creating...' : \`Create Speech (※ \${creditCost})\` }}
      </button>
    </div>
  </div>
</template>
`,
  'BuyClonesModal.vue': `<script setup lang="ts">
interface ClonePackage {
  id: string
  name: string
  price: string
  priceValue: number
  description: string
  popular?: boolean
}

const packages: ClonePackage[] = [
  {
    id: '1-clone',
    name: '1 Voice Clone',
    price: '\$2.99',
    priceValue: 2.99,
    description: 'One-time purchase'
  },
  {
    id: '3-clones',
    name: '3 Voice Clones',
    price: '\$7.99',
    priceValue: 7.99,
    description: 'Save 11%',
    popular: true
  },
  {
    id: '5-clones',
    name: '5 Voice Clones',
    price: '\$12.99',
    priceValue: 12.99,
    description: 'Save 13%'
  }
]

const selectedPackage = ref('3-clones')
const isPurchasing = ref(false)
const error = ref('')

const selectedPackageData = computed(() => packages.find(p => p.id === selectedPackage.value))

// 计算节省信息
const savingsInfo = computed(() => {
  const pkg = selectedPackageData.value
  if (!pkg) return null

  const cloneCount = parseInt(pkg.name.split(' ')[0]) || 1
  const singlePrice = 2.99
  const regularPrice = cloneCount * singlePrice
  const savings = regularPrice - pkg.priceValue

  return {
    cloneCount,
    regularPrice,
    actualPrice: pkg.priceValue,
    savings: savings > 0 ? savings : 0,
    savingsPercent: savings > 0 ? Math.round((savings / regularPrice) * 100) : 0
  }
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'back'): void
  (e: 'purchase', data: { packageId: string; packageData: ClonePackage }): void
}>()

// 处理购买
const handlePurchase = async () => {
  if (!selectedPackageData.value || isPurchasing.value) return

  isPurchasing.value = true
  error.value = ''

  try {
    // 模拟支付处理
    await new Promise(resolve => setTimeout(resolve, 1000))

    emit('purchase', {
      packageId: selectedPackage.value,
      packageData: selectedPackageData.value
    })
  } catch (e) {
    error.value = 'Payment failed. Please try again.'
    console.error(e)
  } finally {
    isPurchasing.value = false
  }
}
</script>

<template>
  <div class="w-[420px] bg-white rounded-2xl overflow-hidden">
    <!-- Header -->
    <div class="h-14 px-6 flex items-center border-b border-[#e5e5e5]">
      <button
        class="text-[#202123] hover:text-[#695fee] transition-colors cursor-pointer"
        @click="emit('back')"
      >
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
      </button>
      <h1 class="text-base font-semibold text-[#202123] font-['Reddit_Sans'] ml-3">Buy Voice Clones</h1>
      <button
        class="ml-auto text-[#979797] hover:text-[#202123] transition-colors cursor-pointer"
        @click="emit('close')"
      >
        <UIcon name="i-lucide-x" class="w-5 h-5" />
      </button>
    </div>

    <!-- Content -->
    <div class="px-6 py-5">
      <div class="flex flex-col gap-2">
        <!-- Package Cards -->
        <button
          v-for="pkg in packages"
          :key="pkg.id"
          class="relative w-full h-[72px] rounded-xl px-4 flex items-center transition-all cursor-pointer"
          :class="[
            selectedPackage === pkg.id
              ? 'bg-[#f0eeff] border-2 border-[#695fee]'
              : 'bg-[#f7f9fe] border border-[#e5e5e5]'
          ]"
          @click="selectedPackage = pkg.id"
        >
          <!-- Popular Tag -->
          <span
            v-if="pkg.popular"
            class="absolute top-1.5 right-4 px-3 py-1 rounded-[10px] bg-[#695fee] text-white text-[10px] font-semibold"
          >
            Popular
          </span>

          <!-- Radio -->
          <div
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
            :class="selectedPackage === pkg.id ? 'border-[#695fee] bg-[#695fee]' : 'border-[#d0d0d0] bg-white'"
          >
            <div v-if="selectedPackage === pkg.id" class="w-2 h-2 rounded-full bg-white" />
          </div>

          <!-- Info -->
          <div class="ml-3 flex-1 text-left">
            <p class="text-sm font-semibold text-[#202123] font-['Reddit_Sans']">{{ pkg.name }}</p>
            <p
              class="text-xs font-['Reddit_Sans'] mt-0.5"
              :class="pkg.description.includes('Save') ? 'text-[#695fee] font-medium' : 'text-[#979797]'"
            >
              {{ pkg.description }}
            </p>
          </div>

          <!-- Price -->
          <span class="text-base font-semibold text-[#202123] font-['Reddit_Sans'] shrink-0">{{ pkg.price }}</span>
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="px-6 pb-2">
      <p class="text-xs text-[#e53935] font-['Reddit_Sans'] text-center">{{ error }}</p>
    </div>

    <!-- Savings Badge (if applicable) -->
    <div v-if="savingsInfo && savingsInfo.savings > 0" class="px-6 pb-4">
      <div class="bg-[#f0eeff] rounded-lg p-2.5 flex items-center justify-center gap-2">
        <UIcon name="i-lucide-badge-percent" class="w-4 h-4 text-[#695fee]" />
        <span class="text-sm text-[#695fee] font-medium font-['Reddit_Sans']">
          Save {{ savingsInfo.savingsPercent }}% (\${{ savingsInfo.savings.toFixed(2) }} off)
        </span>
      </div>
    </div>

    <!-- Footer Button -->
    <div class="px-6 pb-6">
      <button
        class="w-full h-12 rounded-3xl bg-[#695fee] hover:bg-[#5a4fdf] text-white text-sm font-semibold font-['Reddit_Sans'] flex items-center justify-center cursor-pointer active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isPurchasing"
        @click="handlePurchase"
      >
        <UIcon v-if="isPurchasing" name="i-lucide-loader-2" class="w-4 h-4 mr-2 animate-spin" />
        {{ isPurchasing ? 'Processing Payment...' : \`Purchase - \${selectedPackageData?.price}\` }}
      </button>
      <p class="text-xs text-[#979797] text-center mt-3 font-['Reddit_Sans']">
        Secure payment powered by Stripe
      </p>
    </div>
  </div>
</template>
`,
  'DubbingStudio.vue': `<script setup lang="ts">
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
`,
  'DubbingStudioContainer.vue': `<script setup lang="ts">
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
`,
  'DubbingStudioPreview.vue': `<script setup lang="ts">
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
  return \`\${mins}:\${secs.toString().padStart(2, '0')}\`
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
`,
  'DubbingStudioRecording.vue': `<script setup lang="ts">
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
  return \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`
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
    const fileName = \`recording-\${new Date().getTime()}.webm\`

    // 发送保存录音事件，传递录音数据
    emit('save-recording', {
      audioBlob: recordedAudioBlob.value,
      fileName: fileName,
      fileSize: \`\${sizeInMB} MB\`,
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
`,
  'DubbingStudioSaveDialog.vue': `<script setup lang="ts">
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
`,
  'DubbingStudioUploaded.vue': `<script setup lang="ts">
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
  return \`\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`
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
          @mousedown="startDrag('pan', \$event)"
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
            @mousedown.stop="startDrag('range', \$event)"
          />

          <!-- Left Handle -->
          <div
            v-if="selectionViewportStart >= 0 && selectionViewportStart <= 100"
            class="absolute top-0 w-1.5 h-full bg-[#4caf50] rounded-sm cursor-ew-resize hover:bg-[#388e3c] transition-colors z-10"
            :style="{ left: \`calc(\${selectionViewportStart}% - 3px)\` }"
            @mousedown.stop="startDrag('start', \$event)"
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
            :style="{ left: \`calc(\${selectionViewportEnd}% - 3px)\` }"
            @mousedown.stop="startDrag('end', \$event)"
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
`,
  'PurchaseClonesModal.vue': `<script setup lang="ts">
interface Plan {
  id: string
  name: string
  price: string
  priceLabel: string
  description: string
  clones: string
  iconColor: string
  iconBgColor: string
  badgeColor: string
  badgeBgColor: string
  icon: string
  bestValue?: boolean
}

const plans: Plan[] = [
  {
    id: 'pro-annual',
    name: 'Pro Annual',
    price: '\$99',
    priceLabel: '\$99/year',
    description: 'Includes 2 free clones',
    clones: '+2 Clones',
    iconColor: 'text-[#ff9800]',
    iconBgColor: 'bg-[#fff3e0]',
    badgeColor: 'text-[#ff9800]',
    badgeBgColor: 'bg-[#fff3e0]',
    icon: 'i-lucide-star'
  },
  {
    id: 'unlimited-monthly',
    name: 'Unlimited Monthly',
    price: '\$19',
    priceLabel: '\$19/month',
    description: 'Includes 1 free clone',
    clones: '+1 Clone',
    iconColor: 'text-[#695fee]',
    iconBgColor: 'bg-[#eef0ff]',
    badgeColor: 'text-[#695fee]',
    badgeBgColor: 'bg-[#eef0ff]',
    icon: 'i-lucide-crown'
  },
  {
    id: 'unlimited-annual',
    name: 'Unlimited Annual',
    price: '\$149',
    priceLabel: '\$149/year',
    description: 'Includes 6 free clones',
    clones: '+6 Clones',
    iconColor: 'text-[#4caf50]',
    iconBgColor: 'bg-[#e8f5e9]',
    badgeColor: 'text-[#4caf50]',
    badgeBgColor: 'bg-[#e8f5e9]',
    icon: 'i-lucide-crown',
    bestValue: true
  }
]

const selectedPlan = ref('unlimited-monthly')
const isProcessing = ref(false)
const error = ref('')

const selectedPlanData = computed(() => plans.find(p => p.id === selectedPlan.value))

// 计算节省的金额
const savingsInfo = computed(() => {
  const plan = selectedPlanData.value
  if (!plan) return null

  // 计算相比单独购买的节省
  const cloneCount = parseInt(plan.clones.replace(/[^0-9]/g, '')) || 0
  const singleClonePrice = 2.99
  const regularPrice = cloneCount * singleClonePrice
  const actualPrice = parseFloat(plan.price.replace('\$', ''))
  const savings = regularPrice - actualPrice

  return {
    cloneCount,
    regularPrice,
    actualPrice,
    savings: savings > 0 ? savings : 0
  }
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'continue', data: { planId: string; planData: Plan }): void
  (e: 'buy-clones'): void
}>()

// 继续购买
const handleContinue = async () => {
  if (!selectedPlanData.value || isProcessing.value) return

  isProcessing.value = true
  error.value = ''

  try {
    // 模拟处理延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    emit('continue', {
      planId: selectedPlan.value,
      planData: selectedPlanData.value
    })
  } catch (e) {
    error.value = 'Failed to process. Please try again.'
    console.error(e)
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="w-[420px] bg-white rounded-2xl overflow-hidden">
    <!-- Header -->
    <div class="h-14 px-6 flex items-center justify-between border-b border-[#e5e5e5]">
      <h1 class="text-base font-semibold text-[#202123] font-['Reddit_Sans']">Get More Clones</h1>
      <button
        class="text-[#979797] hover:text-[#202123] transition-colors cursor-pointer"
        @click="emit('close')"
      >
        <UIcon name="i-lucide-x" class="w-5 h-5" />
      </button>
    </div>

    <!-- Content -->
    <div class="px-6 py-4">
      <!-- Upgrade Plan Section -->
      <h2 class="text-[13px] font-semibold text-[#202123] font-['Reddit_Sans'] mb-4">Upgrade Plan</h2>

      <div class="flex flex-col gap-2">
        <!-- Plan Cards -->
        <button
          v-for="plan in plans"
          :key="plan.id"
          class="relative w-full h-[90px] rounded-xl px-4 flex items-center transition-all cursor-pointer"
          :class="[
            selectedPlan === plan.id
              ? 'bg-[#f0eeff] border-2 border-[#695fee]'
              : 'bg-[#f7f9fe] border border-[#e5e5e5]'
          ]"
          @click="selectedPlan = plan.id"
        >
          <!-- Best Value Tag -->
          <span
            v-if="plan.bestValue"
            class="absolute top-1.5 right-4 px-2.5 py-1 rounded-[10px] bg-[#4caf50] text-white text-[10px] font-semibold"
          >
            Best Value
          </span>

          <!-- Radio -->
          <div
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
            :class="selectedPlan === plan.id ? 'border-[#695fee] bg-[#695fee]' : 'border-[#d0d0d0] bg-white'"
          >
            <div v-if="selectedPlan === plan.id" class="w-2 h-2 rounded-full bg-white" />
          </div>

          <!-- Icon -->
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center ml-3 shrink-0"
            :class="plan.iconBgColor"
          >
            <UIcon :name="plan.icon" class="w-[18px] h-[18px]" :class="plan.iconColor" />
          </div>

          <!-- Info -->
          <div class="ml-2 flex-1 text-left">
            <p class="text-sm font-semibold text-[#202123] font-['Reddit_Sans']">{{ plan.name }}</p>
            <p class="text-xs text-[#979797] font-['Reddit_Sans'] mt-0.5">{{ plan.priceLabel }} • {{ plan.description }}</p>
            <span
              class="inline-block mt-1.5 px-2.5 py-0.5 rounded-[10px] text-[10px] font-semibold"
              :class="[plan.badgeBgColor, plan.badgeColor]"
            >
              {{ plan.clones }}
            </span>
          </div>

          <!-- Price -->
          <span class="text-base font-semibold text-[#202123] font-['Reddit_Sans'] shrink-0">{{ plan.price }}</span>
        </button>
      </div>

      <!-- Divider -->
      <div class="h-px bg-[#e5e5e5] my-6" />

      <!-- Buy Clones Separately -->
      <h2 class="text-[13px] font-semibold text-[#202123] font-['Reddit_Sans'] mb-4">Or Buy Clones Separately</h2>

      <button
        class="w-full h-16 rounded-xl bg-white border border-[#e5e5e5] px-4 flex items-center hover:bg-gray-50 transition-colors cursor-pointer"
        @click="emit('buy-clones')"
      >
        <div class="w-10 h-10 rounded-[10px] bg-[#f0f7ff] flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-coins" class="w-5 h-5 text-[#3b82f6]" />
        </div>
        <div class="ml-3 flex-1 text-left">
          <p class="text-sm font-semibold text-[#202123] font-['Reddit_Sans']">Buy Clones</p>
          <p class="text-xs text-[#979797] font-['Reddit_Sans']">Starting from \$2.99 each</p>
        </div>
        <UIcon name="i-lucide-chevron-right" class="w-[18px] h-[18px] text-[#979797]" />
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="px-6 pb-2">
      <p class="text-xs text-[#e53935] font-['Reddit_Sans'] text-center">{{ error }}</p>
    </div>

    <!-- Savings Info -->
    <div v-if="savingsInfo && savingsInfo.savings > 0" class="px-6 pb-4">
      <div class="bg-[#e8f5e9] rounded-lg p-3 flex items-center justify-center gap-2">
        <UIcon name="i-lucide-piggy-bank" class="w-4 h-4 text-[#4caf50]" />
        <span class="text-sm text-[#4caf50] font-medium font-['Reddit_Sans']">
          You save \${{ savingsInfo.savings.toFixed(2) }} compared to buying {{ savingsInfo.cloneCount }} clones separately
        </span>
      </div>
    </div>

    <!-- Footer Button -->
    <div class="px-6 pb-6">
      <button
        class="w-full h-12 rounded-3xl bg-[#695fee] hover:bg-[#5a4fdf] text-white text-sm font-semibold font-['Reddit_Sans'] flex items-center justify-center cursor-pointer active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isProcessing"
        @click="handleContinue"
      >
        <UIcon v-if="isProcessing" name="i-lucide-loader-2" class="w-4 h-4 mr-2 animate-spin" />
        {{ isProcessing ? 'Processing...' : \`Continue - \${selectedPlanData?.priceLabel}\` }}
      </button>
    </div>
  </div>
</template>
`,
}
