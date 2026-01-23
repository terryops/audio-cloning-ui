<script setup lang="ts">
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
    price: '$99',
    priceLabel: '$99/year',
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
    price: '$19',
    priceLabel: '$19/month',
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
    price: '$149',
    priceLabel: '$149/year',
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
  const actualPrice = parseFloat(plan.price.replace('$', ''))
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
          <p class="text-xs text-[#979797] font-['Reddit_Sans']">Starting from $2.99 each</p>
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
          You save ${{ savingsInfo.savings.toFixed(2) }} compared to buying {{ savingsInfo.cloneCount }} clones separately
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
        {{ isProcessing ? 'Processing...' : `Continue - ${selectedPlanData?.priceLabel}` }}
      </button>
    </div>
  </div>
</template>
