// Auto-generated - BuyClonesModal.vue
export default `<script setup lang="ts">
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
`
