<template>
  <div class="flex justify-center">
    <!-- Wide components: scale to fit -->
    <div
      v-if="isWideComponent"
      :style="{ height: 790 * containerScale + 'px' }"
    >
      <div
        :style="{
          transform: `scale(${containerScale})`,
          transformOrigin: 'top center',
          width: '1440px',
          height: '790px',
        }"
      >
        <component
          :is="componentMap[componentId]"
          v-bind="componentProps[componentId]"
        />
      </div>
    </div>
    <!-- Normal components -->
    <div v-else class="shadow-2xl rounded-xl overflow-hidden">
      <component
        :is="componentMap[componentId]"
        v-bind="componentProps[componentId]"
        @create-speech="handleCreateSpeech"
        @create-voice="handleCreateVoice"
        @play-voice="handlePlayVoice"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const componentId = computed(() => route.params.id as string)

const wideComponents = ['subtitle-editor-cps', 'translation-editor-cps']
const isWideComponent = computed(() => wideComponents.includes(componentId.value))

// Calculate available width from window size minus known fixed panels
// sidebar=240px (w-60), code panel=650px (w-[650px]), preview padding=64px (p-8)
const windowWidth = ref(1440)

const containerScale = computed(() => {
  const available = windowWidth.value - 240 - 650 - 64
  return Math.min(Math.max(available / 1440, 0.25), 1)
})

const onResize = () => { windowWidth.value = window.innerWidth }

onMounted(() => {
  windowWidth.value = window.innerWidth
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

const componentMap: Record<string, any> = {
  'billing-empty': resolveComponent('BillingDetailsEmpty'),
  'billing-voices': resolveComponent('BillingDetails'),
  'upgrade-plan': resolveComponent('UpgradePlanModal'),
  'buy-clones': resolveComponent('BuyClonesModal'),
  'voice-clone-prompt': resolveComponent('VoiceClonePromptDialog'),
  'voice-clone-speakers-off': resolveComponent('VoiceCloneSpeakersOff'),
  'voice-clone-manage': resolveComponent('VoiceCloneManage'),
  're-clone-subtitle': resolveComponent('ReCloneSubtitle'),
  'download-dialog': resolveComponent('DownloadDialog'),
  'subtitle-editor-cps': resolveComponent('SubtitleEditorCPS'),
  'translation-editor-cps': resolveComponent('TranslationEditorCPS'),
  'dubbing-studio-container': resolveComponent('DubbingStudioContainer'),
  'dubbing-studio': resolveComponent('DubbingStudio'),
  'dubbing-studio-no-clones': resolveComponent('DubbingStudio'),
  'dubbing-recording': resolveComponent('DubbingStudioRecording'),
  'dubbing-recording-active': resolveComponent('DubbingStudioRecording'),
  'dubbing-uploaded': resolveComponent('DubbingStudioUploaded'),
  'dubbing-preview': resolveComponent('DubbingStudioPreview'),
  'dubbing-save': resolveComponent('DubbingStudioSaveDialog'),
}

const componentProps: Record<string, any> = {
  'billing-empty': {},
  'billing-voices': {},
  'upgrade-plan': {},
  'buy-clones': {},
  'voice-clone-prompt': {},
  'voice-clone-speakers-off': {},
  'voice-clone-manage': {},
  're-clone-subtitle': {},
  'download-dialog': {},
  'subtitle-editor-cps': {},
  'translation-editor-cps': {},
  'dubbing-studio-container': { availableClones: 2, totalClones: 3 },
  'dubbing-studio': { availableClones: 2, totalClones: 3 },
  'dubbing-studio-no-clones': { availableClones: 0, totalClones: 3 },
  'dubbing-recording': { availableClones: 2, totalClones: 3 },
  'dubbing-recording-active': { availableClones: 2, totalClones: 3 },
  'dubbing-uploaded': { fileName: 'voice_sample.mp3', fileSize: '2.4 MB', totalDuration: 120 },
  'dubbing-preview': { availableClones: 2, totalClones: 3, fileName: 'voice_sample.mp3', fileSize: '2.4 MB' },
  'dubbing-save': { defaultName: 'My Voice Clone' },
}

const handleCreateSpeech = () => {
  console.log('Create speech clicked')
}

const handleCreateVoice = () => {
  console.log('Create voice clicked')
}

const handlePlayVoice = (id: string) => {
  console.log('Play voice:', id)
}
</script>
