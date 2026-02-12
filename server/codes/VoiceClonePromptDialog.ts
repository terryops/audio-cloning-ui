// Auto-generated - VoiceClonePromptDialog.vue
export default `<script setup lang="ts">
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'start-cloning'): void
}>()
</script>

<template>
  <div class="w-[480px] bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.09)]">
    <!-- Header -->
    <div class="h-14 flex items-center justify-between px-6">
      <span class="text-base font-semibold text-[#202123] font-['Reddit_Sans']">Voice Clone</span>
      <button
        class="w-8 h-8 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
        @click="emit('close')"
      >
        <UIcon name="i-lucide-x" class="w-[18px] h-[18px] text-[#979797]" />
      </button>
    </div>

    <!-- Divider -->
    <div class="h-px bg-[#ecedef] w-full" />

    <!-- Hero Section -->
    <div class="flex flex-col items-center gap-5 pt-8 pb-6 px-6">
      <!-- Icon -->
      <div class="w-20 h-20 rounded-3xl bg-gradient-to-b from-[#695fee] to-[#8b7fff] flex items-center justify-center">
        <UIcon name="i-lucide-audio-lines" class="w-10 h-10 text-white" />
      </div>
      <!-- Text -->
      <div class="flex flex-col items-center gap-2 w-full">
        <h2 class="text-[22px] font-bold text-[#202123] font-['Reddit_Sans'] text-center">Voice Cloning</h2>
        <p class="text-sm text-[#979797] font-['Reddit_Sans'] text-center w-full">
          Clone any voice with precision — every tone, every nuance.
        </p>
      </div>
    </div>

    <!-- Features Section -->
    <div class="flex flex-col gap-3 px-6">
      <!-- Feature Card -->
      <div class="flex items-center gap-3.5 p-4 rounded-xl bg-[#f7f9fe] border border-[#ecedef]">
        <div class="w-11 h-11 rounded-xl bg-[#f0eefe] flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-mic" class="w-[22px] h-[22px] text-[#695fee]" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-sm font-semibold text-[#202123] font-['Reddit_Sans']">Tone &amp; Timbre Cloning</span>
          <span class="text-xs text-[#979797] font-['Reddit_Sans']">Clone the tone and timbre of every sentence with high fidelity.</span>
        </div>
      </div>

      <!-- Tip Row -->
      <div class="flex items-start gap-1.5 py-2.5 px-3 rounded-lg bg-[#f7f9fe] border border-[#ecedef]">
        <UIcon name="i-lucide-circle-alert" class="w-3.5 h-3.5 text-[#b0b0b0] shrink-0 mt-0.5" />
        <span class="text-xs text-[#b0b0b0] font-['Reddit_Sans']">
          Please review speaker assignments beforehand for the best performance.
        </span>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="flex flex-col items-center gap-5 pt-6 pb-7 px-6">
      <!-- Price Block -->
      <div class="flex flex-col items-center gap-1.5 w-full">
        <span class="text-[13px] text-[#979797] font-['Reddit_Sans']">Estimated cost for this video</span>
        <div class="flex items-center gap-1">
          <span class="text-base font-semibold text-[#202123] font-['Reddit_Sans']">12.8</span>
          <span class="text-sm text-[#979797] font-['Reddit_Sans']">credits</span>
        </div>
        <span class="text-xs text-[#b0b0b0] font-['Reddit_Sans']">4 credits / 1,000 characters</span>
      </div>

      <!-- CTA Button -->
      <button
        class="w-full h-12 rounded-xl bg-[#695fee] hover:bg-[#5a4fdf] text-white text-[15px] font-semibold font-['Reddit_Sans'] flex items-center justify-center cursor-pointer active:scale-[0.98] transition-all"
        @click="emit('start-cloning')"
      >
        Start voice cloning
      </button>
    </div>

    <!-- Bottom Divider -->
    <div class="h-px bg-[#ecedef] w-full" />
  </div>
</template>
`
