<script setup lang="ts">
interface VoiceOption {
  id: string
  text: string
  timeStart: string
  timeEnd: string
}

interface Props {
  currentSubtitle?: string
  currentTimeStart?: string
  currentTimeEnd?: string
  voiceOptions?: VoiceOption[]
}

const props = withDefaults(defineProps<Props>(), {
  currentSubtitle: "Hello everyone, welcome to today's video about voice cloning technology.",
  currentTimeStart: '00:12',
  currentTimeEnd: '00:18',
  voiceOptions: () => [
    { id: '1', text: "Hello everyone, welcome to today's video", timeStart: '00:12', timeEnd: '00:18' },
    { id: '2', text: 'about voice cloning technology and how', timeStart: '00:18', timeEnd: '00:24' },
    { id: '3', text: 'it can be used in dubbing and content', timeStart: '00:24', timeEnd: '00:30' },
    { id: '4', text: 'creation workflows across languages', timeStart: '00:30', timeEnd: '00:35' },
  ]
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'reclone', data: { voiceId: string; variant: string }): void
}>()

const selectedVoiceId = ref(props.voiceOptions[0]?.id || '')
const selectedVariant = ref('determined')

const variants = [
  { key: 'determined', label: 'Determined' },
  { key: 'casual', label: 'Casual' },
  { key: 'lively', label: 'Lively' },
]

const handleReclone = () => {
  emit('reclone', {
    voiceId: selectedVoiceId.value,
    variant: selectedVariant.value,
  })
}
</script>

<template>
  <div class="w-[560px] bg-white rounded-[10px] overflow-hidden">
    <!-- Header -->
    <div class="h-[49px] px-[30px] flex items-center border-b border-[#00000008]">
      <h1 class="text-[15px] font-semibold text-[#202123] font-['Reddit_Sans']">Re-Clone Subtitle</h1>
      <button
        class="ml-auto text-[#979797] hover:text-[#202123] transition-colors cursor-pointer"
        @click="emit('close')"
      >
        <UIcon name="i-lucide-x" class="w-5 h-5" />
      </button>
    </div>

    <!-- Content -->
    <div class="px-[30px] pt-5 pb-[30px]">
      <!-- Current Subtitle -->
      <h2 class="text-sm font-semibold text-[#202123] font-['Reddit_Sans']">Current Subtitle</h2>

      <div class="w-[500px] mt-3 rounded-xl bg-[#f7f9fe] border border-[#e5e5e5] px-4 pt-3.5 pb-4">
        <div class="h-7 w-[100px] rounded-md bg-[#eef0ff] flex items-center justify-center">
          <span class="text-[11px] font-semibold text-[#695fee] font-['Reddit_Sans']">{{ currentTimeStart }} - {{ currentTimeEnd }}</span>
        </div>
        <p class="text-[13px] text-[#202123] font-['Reddit_Sans'] mt-3">{{ currentSubtitle }}</p>
      </div>

      <!-- Use A Voice from -->
      <h2 class="text-sm font-semibold text-[#202123] font-['Reddit_Sans'] mt-6">Use A Voice from</h2>

      <!-- Voice List -->
      <div class="w-[500px] mt-3 rounded-[10px] border border-[#e5e5e5] overflow-hidden">
        <button
          v-for="(voice, index) in voiceOptions"
          :key="voice.id"
          class="w-full h-14 px-4 flex items-center gap-2.5 cursor-pointer transition-colors"
          :class="[
            selectedVoiceId === voice.id ? 'bg-[#eef0ff] rounded-lg' : 'hover:bg-[#f7f9fe]',
            index < voiceOptions.length - 1 ? 'border-b border-[#e5e5e5]' : ''
          ]"
          @click="selectedVoiceId = voice.id"
        >
          <!-- Play Button -->
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            :class="selectedVoiceId === voice.id ? 'bg-[#695fee]' : 'bg-[#979797]'"
          >
            <UIcon name="i-lucide-play" class="w-3 h-3 text-white" />
          </div>

          <!-- Text -->
          <div class="flex-1 flex flex-col gap-0.5 min-w-0">
            <span
              class="text-xs font-['Reddit_Sans'] truncate"
              :class="selectedVoiceId === voice.id ? 'font-medium text-[#695fee]' : 'text-[#202123]'"
            >{{ voice.text }}</span>
            <span class="text-[10px] text-[#979797] font-['Reddit_Sans']">{{ voice.timeStart }} - {{ voice.timeEnd }}</span>
          </div>

          <!-- Check Icon -->
          <UIcon
            v-if="selectedVoiceId === voice.id"
            name="i-lucide-check"
            class="w-3.5 h-3.5 text-[#695fee] flex-shrink-0"
          />
        </button>
      </div>

      <!-- Variants -->
      <h2 class="text-sm font-semibold text-[#202123] font-['Reddit_Sans'] mt-6">Variants</h2>

      <div class="w-[500px] h-14 mt-3 flex gap-3">
        <button
          v-for="variant in variants"
          :key="variant.key"
          class="flex-1 h-full rounded-xl text-sm font-semibold font-['Reddit_Sans'] cursor-pointer transition-all active:scale-[0.98]"
          :class="selectedVariant === variant.key
            ? 'bg-[#695fee] text-white'
            : 'bg-white text-[#202123] border border-[#e5e5e5] hover:border-[#695fee]'"
          @click="selectedVariant = variant.key"
        >
          {{ variant.label }}
        </button>
      </div>

      <!-- Re-Clone Subtitle Button -->
      <button
        class="w-[500px] h-12 mt-6 rounded-[22px] bg-[#695fee] hover:bg-[#5a4fdf] text-white text-sm font-semibold font-['Reddit_Sans'] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all"
        @click="handleReclone"
      >
        <UIcon name="i-lucide-refresh-cw" class="w-4 h-4 text-white" />
        Re-Clone Subtitle
      </button>
    </div>
  </div>
</template>
