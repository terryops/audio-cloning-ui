<script setup lang="ts">
interface PlanOption {
  id: string
  name: string
  badge: string
  badgeBgColor: string
  bonus: string
  bonusColor: string
}

const plans: PlanOption[] = [
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    badge: 'PRO',
    badgeBgColor: 'bg-[#ff9800]',
    bonus: '—/mo',
    bonusColor: 'text-[#9ca3af]'
  },
  {
    id: 'pro-annual',
    name: 'Pro Annual',
    badge: 'PRO',
    badgeBgColor: 'bg-[#ff9800]',
    bonus: '+2 Clones/yr',
    bonusColor: 'text-[#ff9800]'
  },
  {
    id: 'unlimited-monthly',
    name: 'Unlimited Monthly',
    badge: 'UNLIMITED',
    badgeBgColor: 'bg-[#695fee]',
    bonus: '+1 Clone/mo',
    bonusColor: 'text-[#695fee]'
  },
  {
    id: 'unlimited-annual',
    name: 'Unlimited Annual',
    badge: 'UNLIMITED',
    badgeBgColor: 'bg-[#4caf50]',
    bonus: '+6 Clones/yr',
    bonusColor: 'text-[#4caf50]'
  }
]

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'view-plans'): void
  (e: 'buy-clones'): void
}>()
</script>

<template>
  <div class="w-[400px] bg-white rounded-2xl p-6 flex flex-col gap-5">
    <!-- Header -->
    <div class="flex flex-col items-center gap-1.5">
      <!-- Icon -->
      <div class="w-12 h-12 rounded-full bg-[#f0eeff] flex items-center justify-center">
        <UIcon name="i-lucide-gift" class="w-6 h-6 text-[#695fee]" />
      </div>
      <!-- Title -->
      <h1 class="text-lg font-bold text-[#202123] font-['Reddit_Sans']">Upgrade Your Plan</h1>
      <!-- Subtitle -->
      <p class="text-[13px] text-[#6b7280] font-['Reddit_Sans']">Get Free Voice Clones</p>
    </div>

    <!-- Divider -->
    <div class="h-px bg-[#e5e5e5] w-full" />

    <!-- Plans List -->
    <div class="flex flex-col gap-3">
      <div
        v-for="plan in plans"
        :key="plan.id"
        class="flex items-center justify-between w-full"
      >
        <!-- Left: Badge + Name -->
        <div class="flex items-center gap-2">
          <span
            class="h-4 px-[5px] rounded flex items-center justify-center text-[9px] font-bold text-white"
            :class="plan.badgeBgColor"
          >
            {{ plan.badge }}
          </span>
          <span class="text-[13px] font-medium text-[#374151] font-['Reddit_Sans']">{{ plan.name }}</span>
        </div>
        <!-- Right: Bonus -->
        <span
          class="text-xs font-['Reddit_Sans']"
          :class="[plan.bonusColor, plan.bonus.includes('+') ? 'font-semibold' : 'font-normal']"
        >
          {{ plan.bonus }}
        </span>
      </div>
    </div>

    <!-- View Plans Button -->
    <button
      class="w-full h-11 rounded-[22px] bg-[#695fee] hover:bg-[#5a4fdf] text-white text-sm font-semibold font-['Reddit_Sans'] flex items-center justify-center cursor-pointer active:scale-[0.98] transition-all"
      @click="emit('view-plans')"
    >
      View Plans
    </button>

    <!-- Divider -->
    <div class="h-px bg-[#e5e5e5] w-full" />

    <!-- Buy Clones Section -->
    <div class="flex flex-col gap-3">
      <h2 class="text-[13px] font-semibold text-[#202123] font-['Reddit_Sans']">Or Buy Clones Separately</h2>

      <!-- Buy Card -->
      <button
        class="w-full h-14 rounded-xl bg-[#f7f9fe] border border-[#e5e5e5] px-4 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
        @click="emit('buy-clones')"
      >
        <!-- Icon -->
        <div class="w-9 h-9 rounded-[10px] bg-[#f0f7ff] flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-coins" class="w-[18px] h-[18px] text-[#3b82f6]" />
        </div>
        <!-- Info -->
        <div class="flex-1 flex flex-col gap-0.5 text-left">
          <span class="text-[13px] font-semibold text-[#202123] font-['Reddit_Sans']">Buy Clones</span>
          <span class="text-[11px] text-[#6b7280] font-['Reddit_Sans']">Starting from $2.99 each</span>
        </div>
        <!-- Arrow -->
        <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-[#9ca3af]" />
      </button>
    </div>
  </div>
</template>
