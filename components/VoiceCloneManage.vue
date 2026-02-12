<script setup lang="ts">
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'redub'): void
  (e: 'delete'): void
}>()
</script>

<template>
  <div class="w-[360px] bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.09)]">
    <!-- Header -->
    <div class="h-12 flex items-center justify-between px-5">
      <span class="text-[15px] font-semibold text-[#202123] font-['Reddit_Sans']">Manage Dubbing</span>
      <button
        class="w-8 h-8 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
        @click="emit('close')"
      >
        <UIcon name="i-lucide-x" class="w-[18px] h-[18px] text-[#979797]" />
      </button>
    </div>

    <!-- Actions -->
    <div class="flex flex-col items-center gap-2.5 px-5 pb-5">
      <!-- Re-dub Button -->
      <button
        class="w-full h-[42px] rounded-[10px] bg-[#695fee] hover:bg-[#5a4fdf] text-white text-sm font-semibold font-['Reddit_Sans'] flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] transition-all"
        @click="emit('redub')"
      >
        <UIcon name="i-lucide-refresh-cw" class="w-4 h-4 text-white" />
        Re-dub
      </button>

      <!-- Delete Button -->
      <button
        class="w-full h-[42px] rounded-[10px] bg-white border border-[#e8e8e8] hover:bg-gray-50 text-[#E04B4B] text-sm font-semibold font-['Reddit_Sans'] flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] transition-all"
        @click="emit('delete')"
      >
        <UIcon name="i-lucide-trash-2" class="w-4 h-4 text-[#E04B4B]" />
        Delete dubbing
      </button>
    </div>
  </div>
</template>
