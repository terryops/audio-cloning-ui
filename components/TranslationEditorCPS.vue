<script setup lang="ts">
interface Subtitle {
  id: number
  timeStart: string
  timeEnd: string
  text: string
  translation: string
  cps: number
}

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'download-subtitle'): void
  (e: 'render-video'): void
}>()

const activeSubtitleId = ref(4)
const isPlaying = ref(false)
const currentTime = ref('00:06:41.010')
const playbackSpeed = ref('1.0x')
const progress = ref(17.7)

const subtitles = ref<Subtitle[]>([
  { id: 1, timeStart: '00:00:07', timeEnd: '00:00:20', text: 'Every once in a while, a revolutionary product comes along that changes everything.', translation: '每隔一段时间，就会有一个革命性的产品出现，改变一切。', cps: 6.4 },
  { id: 2, timeStart: '00:00:21', timeEnd: '00:00:25', text: 'In your career.', translation: '在你的职业生涯中。', cps: 3.8 },
  { id: 3, timeStart: '00:00:07', timeEnd: '00:00:20', text: 'There were a sensitivity and a beauty to her that have nothing to do with looks.', translation: '她有一种与外表无关的敏感和美丽。', cps: 6.2 },
  { id: 4, timeStart: '00:00:21', timeEnd: '00:00:25', text: 'She was one to be listened to, whose words were so easy to take to heart. The only truth that exists is, free.', translation: '她是那种值得倾听的人，她的话语很容易被铭记。唯一存在的真理是，自由。', cps: 27.0 },
  { id: 5, timeStart: '00:00:21', timeEnd: '00:00:25', text: 'It is said that the true nature of being is veiled.', translation: '据说存在的真正本质是被遮蔽的。', cps: 13.0 },
  { id: 6, timeStart: '00:00:21', timeEnd: '00:00:25', text: 'The only truth that exists is, free.', translation: '唯一存在的真理是，自由。', cps: 8.5 },
  { id: 7, timeStart: '00:00:21', timeEnd: '00:00:25', text: 'There were a sensitivity and a beauty to her that have nothing to do with looks.', translation: '她有一种与外表无关的敏感和美丽。', cps: 20.3 },
  { id: 8, timeStart: '00:00:21', timeEnd: '00:00:25', text: 'In your career.', translation: '在你的职业生涯中。', cps: 3.8 },
  { id: 9, timeStart: '00:00:21', timeEnd: '00:00:25', text: 'She was one to be listened to, whose words were so easy to take to heart. The only truth that exists is, free.', translation: '她是那种值得倾听的人，她的话语很容易被铭记。唯一存在的真理是，自由。', cps: 27.0 },
  { id: 10, timeStart: '00:00:21', timeEnd: '00:00:25', text: 'It is said that the true nature of being is veiled.', translation: '据说存在的真正本质是被遮蔽的。', cps: 13.0 },
  { id: 11, timeStart: '00:00:21', timeEnd: '00:00:25', text: 'There were a sensitivity and a beauty to her that have nothing to do with looks.', translation: '她有一种与外表无关的敏感和美丽。', cps: 20.3 },
])

const getCpsBarColor = (cps: number) => {
  if (cps > 25) return '#f44336'
  if (cps > 15) return '#ff9800'
  return '#4caf50'
}

const getCpsTextColor = (cps: number) => {
  if (cps > 25) return '#c62828'
  if (cps > 15) return '#ef6c00'
  return '#2e7d32'
}
</script>

<template>
  <div class="w-[1440px] h-[790px] bg-[#f4f5f8] overflow-hidden relative" style="font-family: 'Reddit Sans', 'PingFang SC', sans-serif;">
    <!-- Top Bar -->
    <div class="absolute inset-x-0 top-0 h-16 bg-white z-10 flex items-center">
      <!-- Left: Back + Filename -->
      <div class="flex items-center ml-10 gap-5">
        <div class="w-5 h-5 flex items-center justify-center cursor-pointer">
          <UIcon name="i-lucide-chevron-left" class="w-4 h-4 text-[#21293c]" />
        </div>
        <div class="flex items-center gap-1.5">
          <UIcon name="i-lucide-file-video" class="w-4 h-4 text-[#21293c]" />
          <span class="text-sm text-[#21293c]">Clarkson's Farm 克拉克森的农场 第一季 | 绿组字幕.MP4</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="i-lucide-cloud" class="w-4 h-4 text-[#8e8ea1]" />
          <span class="text-sm font-medium text-[#8e8ea1]">修改已保存 19:06</span>
        </div>
      </div>

      <!-- Right: Undo/Redo + Buttons -->
      <div class="ml-auto flex items-center gap-3 mr-10">
        <button class="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <UIcon name="i-lucide-undo-2" class="w-4 h-4 text-[#21293c]" />
        </button>
        <button class="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <UIcon name="i-lucide-redo-2" class="w-4 h-4 text-[#21293c]" />
        </button>
        <div class="w-px h-6 bg-gray-200" />
        <button
          class="h-10 px-5 rounded-[20px] border border-[#e0deff] text-[#695fee] text-sm hover:bg-[#f7f5ff] transition-colors"
          @click="emit('render-video')"
        >
          压制视频
        </button>
        <button
          class="h-10 px-5 rounded-[20px] bg-[#695fee] text-white text-sm hover:bg-[#5a4fdf] transition-colors"
          @click="emit('download-subtitle')"
        >
          下载字幕
        </button>
      </div>
    </div>

    <!-- Left Panel: Video + Properties -->
    <div class="absolute left-10 top-[74px] w-[670px]" style="filter: drop-shadow(0 2px 3.5px rgba(0,0,0,0.04));">
      <div class="bg-white rounded-[10px] overflow-hidden">
        <!-- Video Preview -->
        <div class="relative w-[662px] h-[373px] mx-1 mt-1 rounded-t-[6px] overflow-hidden bg-gray-200">
          <!-- Upload Buttons -->
          <div class="absolute top-3 right-3 flex flex-col gap-3">
            <div class="flex items-center gap-1.5 bg-black/60 rounded-full h-7 px-3 cursor-pointer">
              <UIcon name="i-lucide-upload-cloud" class="w-4 h-4 text-white" />
              <span class="text-[13px] font-medium text-white">Upload file</span>
            </div>
            <div class="flex items-center gap-1.5 bg-black/60 rounded-full h-7 px-3">
              <UIcon name="i-lucide-upload-cloud" class="w-4 h-4 text-white" />
              <span class="text-[13px] font-medium text-white">Uploading</span>
            </div>
            <div class="flex items-center gap-1.5 bg-black/60 rounded-full h-7 px-3">
              <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-white" />
              <span class="text-[13px] font-medium text-white">Done</span>
            </div>
            <div class="bg-black/60 rounded-lg p-2 pt-2">
              <p class="text-xs font-medium text-white">No space, upload failed.</p>
              <div class="flex items-center gap-1 mt-2">
                <UIcon name="i-lucide-plus-circle" class="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          <!-- Gradient Overlay -->
          <div class="absolute inset-x-0 bottom-0 h-[70px]" style="background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);" />

          <!-- Subtitle Text Overlay -->
          <p class="absolute bottom-5 left-1/2 -translate-x-1/2 text-white text-base text-center w-[440px] leading-tight" style="text-shadow: 0 0 3.5px black;">
            Every once in a while, a revolutionary product comes along that chages everything.
          </p>
        </div>

        <!-- Player Controls -->
        <div class="px-6 pt-4">
          <!-- Timeline -->
          <div class="relative h-[18px] flex items-center">
            <div class="flex-1 relative">
              <div class="h-[5px] bg-[#e3e7f1] rounded-[2.5px]" />
              <div class="absolute top-0 left-0 h-[5px] bg-[#695fee] rounded-[2.5px]" :style="{ width: progress + '%' }" />
              <div
                class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-[4px] border-[#695fee]"
                :style="{ left: `calc(${progress}% - 8px)` }"
              />
            </div>
            <span class="ml-3 text-[13px] text-[#4a4b4c] shrink-0">00:06:41</span>
          </div>

          <!-- Controls Row -->
          <div class="flex items-center mt-3 pb-4">
            <button class="w-6 h-6 flex items-center justify-center text-[#21293c] hover:text-[#695fee]">
              <UIcon name="i-lucide-skip-back" class="w-5 h-5" />
            </button>
            <button class="w-9 h-9 flex items-center justify-center mx-2" @click="isPlaying = !isPlaying">
              <UIcon :name="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'" class="w-6 h-6 text-[#21293c]" />
            </button>
            <button class="w-6 h-6 flex items-center justify-center text-[#21293c] hover:text-[#695fee]">
              <UIcon name="i-lucide-skip-forward" class="w-5 h-5" />
            </button>

            <div class="ml-4 flex items-center h-9 border border-[#e2e2e2] rounded-[6px] overflow-hidden">
              <span class="px-2.5 text-[13px] font-medium text-[#21293c]">{{ currentTime }}</span>
              <div class="w-px h-9 bg-[#e2e2e2]" />
              <span class="px-2.5 text-[13px] font-medium text-[#21293c]">{{ playbackSpeed }}</span>
              <UIcon name="i-lucide-chevron-down" class="w-3 h-3 text-[#21293c] mr-2" />
            </div>

            <div class="ml-auto flex items-center h-9 border border-[#f0f2f6] bg-[#f7f9fe] rounded-[6px] px-2 gap-1.5 cursor-pointer">
              <UIcon name="i-lucide-mic" class="w-4 h-4 text-[#21293c]" />
              <span class="text-[13px] font-medium text-[#21293c]">样式</span>
              <UIcon name="i-lucide-chevron-down" class="w-3 h-3 text-[#21293c]" />
            </div>

            <button class="ml-3 w-6 h-6 flex items-center justify-center text-[#21293c]">
              <UIcon name="i-lucide-scaling" class="w-5 h-5" />
            </button>
            <button class="ml-2 w-6 h-6 flex items-center justify-center text-[#21293c]">
              <UIcon name="i-lucide-maximize-2" class="w-5 h-5" />
            </button>
            <button class="ml-2 w-6 h-6 flex items-center justify-center text-[#21293c]">
              <UIcon name="i-lucide-volume-2" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="border-t border-[#f0f2f6]" />

        <!-- Voice Properties -->
        <div class="px-6 py-5 relative">
          <div class="flex flex-col gap-4">
            <!-- Row 1: 字幕效果 | 字幕字体 -->
            <div class="flex gap-8">
              <div>
                <p class="text-[13px] font-medium text-[#4a4b4c] mb-2">字幕效果</p>
                <div class="flex gap-1.5">
                  <button class="w-9 h-9 rounded-[6px] bg-[#f7f9fe] border border-[#695fee] flex items-center justify-center">
                    <UIcon name="i-lucide-search" class="w-3.5 h-3.5 text-[#21293c]" />
                  </button>
                  <button class="w-9 h-9 rounded-[6px] bg-[#f7f9fe] flex items-center justify-center opacity-50">
                    <span class="text-[13px] text-[#21293c]">Aa</span>
                  </button>
                  <button class="w-9 h-9 rounded-[6px] bg-[#f7f9fe] flex items-center justify-center opacity-50">
                    <span class="text-[13px] text-[#21293c]" style="text-shadow: 0 2px #bdbdd8;">Aa</span>
                  </button>
                  <button class="w-9 h-9 rounded-[6px] bg-[#f7f9fe] flex items-center justify-center opacity-50 relative">
                    <div class="absolute inset-[7px] bg-[#21293c] rounded-sm" />
                    <span class="text-[13px] text-white relative z-10">Aa</span>
                  </button>
                </div>
              </div>
              <div>
                <p class="text-[13px] font-medium text-[#4a4b4c] mb-2">字幕字体</p>
                <div class="h-9 w-[220px] rounded-[6px] bg-[#f7f9fe] flex items-center px-3 cursor-pointer">
                  <span class="text-[13px] text-[#21293c] flex-1">SF Pro text</span>
                  <UIcon name="i-lucide-chevron-down" class="w-3 h-3 text-[#21293c]" />
                </div>
              </div>
            </div>

            <!-- Row 2: 原字幕 | 翻译字幕 -->
            <div class="flex gap-8">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <p class="text-[13px] font-medium text-[#4a4b4c]">原字幕</p>
                  <div class="w-7 h-3.5 rounded-full bg-[#695fee] relative cursor-pointer">
                    <div class="absolute right-0.5 top-0.5 w-2.5 h-2.5 rounded-full bg-white" />
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="h-9 w-[100px] rounded-[6px] bg-[#f7f9fe] flex items-center px-3 opacity-50 cursor-pointer">
                    <span class="text-[13px] text-[#21293c] flex-1">显示-上</span>
                    <UIcon name="i-lucide-chevron-down" class="w-3 h-3 text-[#21293c]" />
                  </div>
                  <div class="h-9 w-[152px] rounded-[6px] bg-[#f7f9fe] flex items-center px-2 gap-1">
                    <UIcon name="i-lucide-minus" class="w-4 h-4 text-[#21293c] shrink-0 cursor-pointer" />
                    <div class="flex-1 relative mx-1">
                      <div class="h-1 bg-[#e0e4ee] rounded-full" />
                      <div class="absolute top-0 left-0 h-1 bg-[#695fee] rounded-full w-[43%]" />
                      <div class="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border border-[#695fee] rounded-full" style="left: calc(43% - 5px);" />
                    </div>
                    <span class="text-[13px] font-medium text-[#8e8ea1] mx-1">16</span>
                    <UIcon name="i-lucide-plus" class="w-4 h-4 text-[#21293c] shrink-0 cursor-pointer" />
                  </div>
                  <div class="w-[34px] h-[34px] rounded-[6px] bg-[#21293c] border border-[#f2f4f9] cursor-pointer" />
                </div>
              </div>
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <p class="text-[13px] font-medium text-[#4a4b4c]">翻译字幕</p>
                  <div class="w-7 h-3.5 rounded-full bg-[#b7b7ce] relative cursor-pointer">
                    <div class="absolute right-0.5 top-0.5 w-2.5 h-2.5 rounded-full bg-white" />
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="h-9 w-[100px] rounded-[6px] bg-[#f7f9fe] flex items-center px-3 opacity-50 cursor-pointer">
                    <span class="text-[13px] text-[#21293c] flex-1">显示-下</span>
                    <UIcon name="i-lucide-chevron-down" class="w-3 h-3 text-[#21293c]" />
                  </div>
                  <div class="h-9 w-[152px] rounded-[6px] bg-[#f7f9fe] flex items-center px-2 gap-1 opacity-50">
                    <UIcon name="i-lucide-minus" class="w-4 h-4 text-[#21293c] shrink-0" />
                    <div class="flex-1 relative mx-1">
                      <div class="h-1 bg-[#e0e4ee] rounded-full" />
                      <div class="absolute top-0 left-0 h-1 bg-[#695fee] rounded-full w-[43%]" />
                      <div class="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border border-[#695fee] rounded-full" style="left: calc(43% - 5px);" />
                    </div>
                    <span class="text-[13px] font-medium text-[#8e8ea1] mx-1">16</span>
                    <UIcon name="i-lucide-plus" class="w-4 h-4 text-[#21293c] shrink-0" />
                  </div>
                  <div class="w-[34px] h-[34px] rounded-[6px] bg-[#ff5659] border border-[#f2f4f9] cursor-pointer opacity-50" />
                </div>
              </div>
            </div>

            <!-- Row 3: 字幕位置 -->
            <div>
              <p class="text-[13px] font-medium text-[#4a4b4c] mb-2">字幕位置</p>
              <div class="flex gap-1.5">
                <button class="w-[70px] h-9 rounded-[6px] bg-[#f7f9fe] flex items-center justify-center gap-1.5">
                  <UIcon name="i-lucide-align-vertical-justify-start" class="w-4 h-4 text-[#21293c]" />
                  <span class="text-[13px] text-[#21293c]">顶部</span>
                </button>
                <button class="w-[70px] h-9 rounded-[6px] bg-[#f7f9fe] flex items-center justify-center gap-1.5">
                  <UIcon name="i-lucide-align-vertical-justify-center" class="w-4 h-4 text-[#21293c]" />
                  <span class="text-[13px] text-[#21293c]">中间</span>
                </button>
                <button class="w-[70px] h-9 rounded-[6px] bg-[#f7f9fe] flex items-center justify-center gap-1.5">
                  <UIcon name="i-lucide-align-vertical-justify-end" class="w-4 h-4 text-[#21293c]" />
                  <span class="text-[13px] text-[#21293c]">底部</span>
                </button>
              </div>
            </div>
          </div>
          <!-- Vertical separator -->
          <div class="absolute right-0 top-5 w-[3px] h-[60px] bg-[#ebebf1] rounded-sm" />
        </div>
      </div>
    </div>

    <!-- Right Panel -->
    <div class="absolute left-[720px] top-[74px] w-[680px] h-[760px]">
      <div class="bg-white rounded-[10px] h-full overflow-hidden" style="box-shadow: 0 0 10.5px rgba(0,0,0,0.04);">
        <!-- Toolbar -->
        <div class="flex items-center gap-0 px-5 h-[56px]">
          <button class="h-10 w-20 rounded-[6px] bg-[#f7f9fe] border border-[#f0f2f6] flex items-center justify-center gap-1.5 text-[13px] font-medium text-[#21293b]">
            <UIcon name="i-lucide-languages" class="w-4 h-4" />
            翻译
          </button>
          <button class="h-10 w-[118px] rounded-[6px] bg-[#f7f9fe] border border-[#f0f2f6] flex items-center justify-center gap-1 text-[13px] font-medium text-[#21293b] ml-1.5">
            中文字幕
            <UIcon name="i-lucide-globe" class="w-4 h-4 text-[#21293b]" />
            <UIcon name="i-lucide-chevron-down" class="w-2.5 h-2.5 text-[#202123]" />
          </button>
          <button class="h-10 w-20 rounded-[6px] bg-[#f7f9fe] border border-[#f0f2f6] flex items-center justify-center gap-1.5 text-[13px] font-medium text-[#21293b] ml-1.5">
            <UIcon name="i-lucide-search" class="w-4 h-4" />
            查找
          </button>
          <button class="h-10 w-20 rounded-[6px] bg-[#f7f9fe] border border-[#f0f2f6] flex items-center justify-center gap-1.5 text-[13px] font-medium text-[#21293b] ml-1.5">
            <UIcon name="i-lucide-scan-face" class="w-4 h-4" />
            识人
          </button>
          <button class="h-10 w-20 rounded-[6px] bg-[#f7f9fe] border border-[#f0f2f6] flex items-center justify-center gap-1.5 text-[13px] font-medium text-[#21293b] ml-1.5">
            <UIcon name="i-lucide-list-ordered" class="w-4 h-4" />
            重排
          </button>
          <button class="h-10 w-10 rounded-[6px] bg-[#f7f9fe] border border-[#f0f2f6] flex items-center justify-center ml-1.5">
            <UIcon name="i-lucide-sparkles" class="w-4 h-4 text-[#695fee]" />
          </button>
          <button class="h-10 w-10 rounded-[6px] bg-[#f7f9fe] border border-[#f0f2f6] flex items-center justify-center ml-1.5">
            <UIcon name="i-lucide-more-horizontal" class="w-4 h-4 text-[#21293c]" />
          </button>
        </div>

        <!-- Subtitle List with Translations -->
        <div class="px-5 pb-5 overflow-y-auto" style="max-height: calc(760px - 56px);">
          <div class="flex flex-col gap-3">
            <div
              v-for="sub in subtitles"
              :key="sub.id"
              class="flex gap-3 cursor-pointer"
              @click="activeSubtitleId = sub.id"
            >
              <!-- Timestamp Card -->
              <div
                class="w-[147px] h-[52px] shrink-0 rounded-[10px] bg-[#f7f9fe] flex items-center gap-2 px-2 overflow-hidden"
                :class="sub.id === activeSubtitleId ? 'ring-2 ring-[#7c5cfc]' : ''"
              >
                <div class="w-[3px] h-full rounded-sm shrink-0" :style="{ backgroundColor: getCpsBarColor(sub.cps) }" />
                <div class="flex flex-col gap-0.5 min-w-0">
                  <span class="text-[11px] text-black/60">{{ sub.timeStart }} - {{ sub.timeEnd }}</span>
                  <span class="text-[11px] font-semibold" :style="{ color: getCpsTextColor(sub.cps) }">{{ sub.cps.toFixed(1) }} CPS</span>
                </div>
              </div>

              <!-- Subtitle Text with Translation -->
              <div class="flex-1 rounded-[10px] bg-[#f7f9fe] flex flex-col gap-1.5 px-3 py-2.5 overflow-hidden">
                <p class="text-sm text-[#21293c] leading-snug">{{ sub.text }}</p>
                <p class="text-sm text-[#475569] leading-snug">{{ sub.translation }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
