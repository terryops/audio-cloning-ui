<template>
  <div class="download-dialog font-reddit-sans">
    <!-- Top Area -->
    <div class="flex flex-col items-center justify-center gap-5 px-12 pt-12 pb-10">
      <!-- Check Circle -->
      <div class="check-circle w-[88px] h-[88px] rounded-full flex items-center justify-center">
        <UIcon name="i-lucide-check" class="w-10 h-10 text-[#695fee]" />
      </div>
      <!-- Title -->
      <h2 class="text-[#202123] text-[28px] font-extrabold">Conversion Complete!</h2>
    </div>

    <!-- Separator -->
    <div class="w-full h-px bg-[#f0f0f0]" />

    <!-- Tools Row -->
    <div class="flex justify-around items-start gap-3 px-8 pt-6 pb-7">
      <button
        v-for="tool in tools"
        :key="tool.name"
        class="tool-button flex flex-col items-center gap-2 flex-1 group"
        :class="{ active: tool.active }"
        @click="$emit('tool-click', tool.id)"
      >
        <div
          class="w-12 h-12 rounded-[14px] flex items-center justify-center transition-all duration-200"
          :class="tool.active
            ? 'shadow-tool-active'
            : 'group-hover:scale-105'"
          :style="{
            backgroundColor: tool.active ? tool.color : `${tool.color}10`,
          }"
        >
          <UIcon
            :name="tool.icon"
            class="w-[22px] h-[22px]"
            :style="{ color: tool.active ? '#ffffff' : tool.color }"
          />
        </div>
        <span
          class="text-[11px] leading-tight"
          :class="tool.active
            ? 'font-semibold text-[#695fee]'
            : 'font-medium text-[#6b7280]'"
        >
          {{ tool.name }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tool {
  id: string
  name: string
  icon: string
  color: string
  active?: boolean
}

defineEmits<{
  'tool-click': [toolId: string]
}>()

const tools: Tool[] = [
  { id: 'download', name: 'Download', icon: 'i-lucide-download', color: '#695fee', active: true },
  { id: 'convert', name: 'Convert', icon: 'i-lucide-repeat', color: '#d97706' },
  { id: 'trim', name: 'Trim', icon: 'i-lucide-scissors', color: '#2563eb' },
  { id: 'crop', name: 'Crop', icon: 'i-lucide-crop', color: '#db2777' },
  { id: 'speed', name: 'Speed', icon: 'i-lucide-gauge', color: '#059669' },
]
</script>

<style scoped>
.download-dialog {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 32px -2px rgba(0, 0, 0, 0.08);
  width: 520px;
  overflow: hidden;
}

.check-circle {
  background: radial-gradient(circle, #f0eeff 0%, #e0dbfa 100%);
}

.shadow-tool-active {
  box-shadow: 0 3px 10px rgba(105, 95, 238, 0.2);
}

.tool-button {
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  transition: transform 0.15s ease;
}

.tool-button:hover {
  transform: translateY(-1px);
}

.tool-button:active {
  transform: translateY(0);
}
</style>
