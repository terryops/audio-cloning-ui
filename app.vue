<template>
  <div class="h-screen bg-gray-900 flex overflow-hidden">
    <!-- Left Sidebar -->
    <div class="w-60 bg-gray-800 border-r border-gray-700 flex flex-col shrink-0">
      <!-- Logo -->
      <div class="h-14 flex items-center px-4 border-b border-gray-700">
        <div class="w-8 h-8 rounded-lg bg-[#695fee] flex items-center justify-center mr-3">
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <h1 class="text-white font-semibold text-sm">Audio Cloning UI</h1>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-3 flex flex-col gap-4 overflow-auto">
        <!-- Billing Group -->
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Billing</p>
          <div class="flex flex-col gap-1">
            <button
              v-for="item in billingItems"
              :key="item.id"
              class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
              :class="currentComponent === item.id
                ? 'bg-[#695fee] text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'"
              @click="currentComponent = item.id"
            >
              {{ item.name }}
            </button>
          </div>
        </div>

        <!-- Modals Group -->
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Modals</p>
          <div class="flex flex-col gap-1">
            <button
              v-for="item in modalItems"
              :key="item.id"
              class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
              :class="currentComponent === item.id
                ? 'bg-[#695fee] text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'"
              @click="currentComponent = item.id"
            >
              {{ item.name }}
            </button>
          </div>
        </div>

        <!-- Dubbing Studio Group -->
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Dubbing Studio</p>
          <div class="flex flex-col gap-1">
            <button
              v-for="item in dubbingItems"
              :key="item.id"
              class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
              :class="currentComponent === item.id
                ? 'bg-[#695fee] text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'"
              @click="currentComponent = item.id"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-700">
        <p class="text-xs text-gray-500">Total Components: {{ menuItems.length }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Center: Component Preview -->
      <div class="flex-1 p-8 bg-gradient-to-br from-gray-100 to-gray-200 overflow-auto">
        <!-- Component Title -->
        <div class="mb-6 text-center">
          <span class="inline-block px-3 py-1 rounded-full bg-white text-gray-600 text-sm font-medium shadow-sm">
            {{ currentComponentName }}
          </span>
        </div>
        <div class="flex justify-center">
          <div class="shadow-2xl rounded-xl overflow-hidden">
            <component
              :is="componentMap[currentComponent]"
              v-bind="componentProps[currentComponent]"
              @create-speech="handleCreateSpeech"
              @create-voice="handleCreateVoice"
              @play-voice="handlePlayVoice"
            />
          </div>
        </div>
      </div>

      <!-- Right: Code Panel -->
      <div class="w-[650px] bg-[#1e1e1e] border-l border-gray-700 flex flex-col shrink-0">
        <!-- Code Header -->
        <div class="h-12 bg-[#252526] border-b border-gray-700 flex items-center px-4 shrink-0">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div class="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div class="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span class="text-gray-400 text-sm ml-4">{{ currentFileName }}</span>
          <!-- Auto Refresh Toggle -->
          <button
            class="ml-auto text-xs px-2 py-1 rounded-md transition-colors flex items-center gap-1.5"
            :class="autoRefresh
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'"
            title="Toggle auto-refresh (every 2s)"
            @click="toggleAutoRefresh"
          >
            <span class="relative flex h-2 w-2">
              <span v-if="autoRefresh" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span class="relative inline-flex rounded-full h-2 w-2" :class="autoRefresh ? 'bg-green-300' : 'bg-gray-500'" />
            </span>
            {{ autoRefresh ? 'Live' : 'Paused' }}
          </button>
          <!-- Refresh Button -->
          <button
            class="ml-2 text-gray-400 hover:text-white text-xs px-2 py-1.5 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-1"
            :disabled="isLoadingCode"
            title="Refresh code"
            @click="refreshCode"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': isLoadingCode }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <!-- Copy Button -->
          <button
            class="ml-2 text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-1.5"
            @click="copyCode"
          >
            <svg v-if="!copied" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg v-else class="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ copied ? 'Copied!' : 'Copy Code' }}
          </button>
        </div>

        <!-- Code Content -->
        <div class="flex-1 overflow-auto">
          <!-- Loading State -->
          <div v-if="isLoadingCode" class="flex items-center justify-center h-full">
            <div class="flex flex-col items-center gap-3">
              <svg class="w-8 h-8 text-gray-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span class="text-gray-500 text-sm">Loading code...</span>
            </div>
          </div>
          <!-- Highlighted Code -->
          <div v-else-if="highlightedCode" v-html="highlightedCode" class="shiki-wrapper" />
          <!-- Fallback Plain Code -->
          <pre v-else class="p-4 text-sm leading-relaxed"><code class="text-gray-300">{{ currentCode }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { codeToHtml } from 'shiki'

const currentComponent = ref('billing-empty')
const highlightedCode = ref('')
const copied = ref(false)
const isLoadingCode = ref(false)
const currentCode = ref('')
const autoRefresh = ref(true) // 自动刷新开关
let refreshInterval: ReturnType<typeof setInterval> | null = null

// 分组菜单项
const billingItems = [
  { id: 'billing-empty', name: 'Empty State' },
  { id: 'billing-voices', name: 'With Voices' },
]

const modalItems = [
  { id: 'upgrade-plan', name: 'Upgrade Plan' },
  { id: 'buy-clones', name: 'Buy Clones' },
]

const dubbingItems = [
  { id: 'dubbing-studio-container', name: 'Complete Flow' },
  { id: 'dubbing-studio', name: 'Default' },
  { id: 'dubbing-studio-no-clones', name: 'No Clones' },
  { id: 'dubbing-recording', name: 'Recording Idle' },
  { id: 'dubbing-recording-active', name: 'Recording Active' },
  { id: 'dubbing-uploaded', name: 'File Uploaded' },
  { id: 'dubbing-preview', name: 'Preview Voice' },
  { id: 'dubbing-save', name: 'Save Dialog' },
]

const menuItems = [...billingItems, ...modalItems, ...dubbingItems]

const componentMap: Record<string, any> = {
  'billing-empty': resolveComponent('BillingDetailsEmpty'),
  'billing-voices': resolveComponent('BillingDetails'),
  'upgrade-plan': resolveComponent('UpgradePlanModal'),
  'buy-clones': resolveComponent('BuyClonesModal'),
  'dubbing-studio-container': resolveComponent('DubbingStudioContainer'),
  'dubbing-studio': resolveComponent('DubbingStudio'),
  'dubbing-studio-no-clones': resolveComponent('DubbingStudio'),
  'dubbing-recording': resolveComponent('DubbingStudioRecording'),
  'dubbing-recording-active': resolveComponent('DubbingStudioRecording'),
  'dubbing-uploaded': resolveComponent('DubbingStudioUploaded'),
  'dubbing-preview': resolveComponent('DubbingStudioPreview'),
  'dubbing-save': resolveComponent('DubbingStudioSaveDialog'),
}

const fileNames: Record<string, string> = {
  'billing-empty': 'BillingDetailsEmpty.vue',
  'billing-voices': 'BillingDetails.vue',
  'upgrade-plan': 'UpgradePlanModal.vue',
  'buy-clones': 'BuyClonesModal.vue',
  'dubbing-studio-container': 'DubbingStudioContainer.vue',
  'dubbing-studio': 'DubbingStudio.vue',
  'dubbing-studio-no-clones': 'DubbingStudio.vue',
  'dubbing-recording': 'DubbingStudioRecording.vue',
  'dubbing-recording-active': 'DubbingStudioRecording.vue',
  'dubbing-uploaded': 'DubbingStudioUploaded.vue',
  'dubbing-preview': 'DubbingStudioPreview.vue',
  'dubbing-save': 'DubbingStudioSaveDialog.vue',
}

const componentProps: Record<string, any> = {
  'billing-empty': {},
  'billing-voices': {},
  'upgrade-plan': {},
  'buy-clones': {},
  'dubbing-studio-container': { availableClones: 2, totalClones: 3 },
  'dubbing-studio': { availableClones: 2, totalClones: 3 },
  'dubbing-studio-no-clones': { availableClones: 0, totalClones: 3 },
  'dubbing-recording': { availableClones: 2, totalClones: 3 },
  'dubbing-recording-active': { availableClones: 2, totalClones: 3 },
  'dubbing-uploaded': { fileName: 'voice_sample.mp3', fileSize: '2.4 MB', totalDuration: 120 },
  'dubbing-preview': { availableClones: 2, totalClones: 3, fileName: 'voice_sample.mp3', fileSize: '2.4 MB' },
  'dubbing-save': { defaultName: 'My Voice Clone' },
}

const currentFileName = computed(() => fileNames[currentComponent.value])
const currentComponentName = computed(() => {
  const item = menuItems.find(i => i.id === currentComponent.value)
  return item?.name || ''
})

// 从服务端 API 获取代码
const fetchCode = async (fileName: string, showLoading = true) => {
  if (showLoading) {
    isLoadingCode.value = true
  }

  try {
    const response = await $fetch<{ code: string }>('/api/component-code', {
      query: { file: fileName }
    })

    if (response?.code && response.code !== currentCode.value) {
      currentCode.value = response.code

      // 语法高亮
      highlightedCode.value = await codeToHtml(response.code, {
        lang: 'vue',
        theme: 'github-dark'
      })
    }
  } catch (error) {
    console.error('Failed to fetch code:', error)
    currentCode.value = '// Failed to load code'
    highlightedCode.value = ''
  } finally {
    isLoadingCode.value = false
  }
}

// 监听组件切换
watch(currentComponent, () => {
  const fileName = fileNames[currentComponent.value]
  if (fileName) {
    fetchCode(fileName)
  }
}, { immediate: true })

// 手动刷新代码
const refreshCode = () => {
  const fileName = fileNames[currentComponent.value]
  if (fileName) {
    fetchCode(fileName)
  }
}

// 自动刷新（每2秒检查一次）
const startAutoRefresh = () => {
  if (refreshInterval) return

  refreshInterval = setInterval(() => {
    if (autoRefresh.value) {
      const fileName = fileNames[currentComponent.value]
      if (fileName) {
        fetchCode(fileName, false) // 静默刷新，不显示 loading
      }
    }
  }, 2000)
}

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
}

// 切换自动刷新
const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value
}

// 组件挂载时启动自动刷新
onMounted(() => {
  startAutoRefresh()
})

// 组件卸载时停止
onUnmounted(() => {
  stopAutoRefresh()
})

const copyCode = async () => {
  await navigator.clipboard.writeText(currentCode.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
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

<style>
.shiki-wrapper pre {
  margin: 0;
  padding: 1rem;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  background: transparent !important;
}

.shiki-wrapper code {
  font-family: inherit;
}

pre {
  margin: 0;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
}

code {
  white-space: pre;
}
</style>
