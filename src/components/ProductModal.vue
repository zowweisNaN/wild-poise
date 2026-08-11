<script setup lang="ts">
import { watch } from 'vue'
import type { Product } from '../types/product'
import { X, Tag } from '@lucide/vue'
import { useCheckout } from '../composables/useCheckout'
import ImageGallery from './ImageGallery.vue'
import SizeSelector from './SizeSelector.vue'
import CheckoutButtons from './CheckoutButtons.vue'

const props = defineProps<{
  product: Product | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// Reset composable when product changes
let checkout = props.product ? useCheckout(props.product) : null

watch(
  () => props.product,
  (p) => {
    if (p) checkout = useCheckout(p)
  },
  { immediate: true }
)

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="product && checkout"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="product.title"
        @keydown="handleKeydown"
        @click.self="emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-deep/60 backdrop-blur-sm" @click="emit('close')" />

        <!-- Modal Panel -->
        <div class="relative w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-soft-cream rounded-t-3xl sm:rounded-3xl shadow-modal overflow-hidden flex flex-col animate-modal-in">
          <!-- Header bar -->
          <div class="flex items-center justify-between px-5 sm:px-8 pt-5 pb-4 border-b border-slate-grey/20 flex-shrink-0">
            <div class="flex items-center gap-2">
              <Tag class="h-4 w-4 text-slate-grey" />
              <span class="badge">{{ product.category }}</span>
            </div>
            <button
              id="modal-close"
              class="p-2 rounded-xl hover:bg-slate-grey/20 transition-colors text-slate-grey hover:text-slate-deep"
              @click="emit('close')"
              aria-label="Close modal"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Body (scrollable) -->
          <div class="flex-1 overflow-y-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-0">
              <!-- Left: Gallery -->
              <div class="p-5 sm:p-8 bg-white/50">
                <ImageGallery :images="product.images" :title="product.title" />
              </div>

              <!-- Right: Info -->
              <div class="p-5 sm:p-8 flex flex-col gap-5">
                <div>
                  <h2 class="font-display font-bold text-slate-deep text-xl sm:text-2xl leading-snug mb-2">
                    {{ product.title }}
                  </h2>
                  <p class="font-display font-bold text-2xl text-slate-deep">
                    {{ product.formattedPrice }}
                  </p>
                </div>

                <p class="text-sm text-slate-deep/70 leading-relaxed">
                  {{ product.description }}
                </p>

                <SizeSelector
                  :sizes="product.availableSizes"
                  :selected="checkout.selectedSize.value"
                  @select="checkout!.selectSize"
                />

                <div class="border-t border-slate-grey/20 pt-5">
                  <CheckoutButtons
                    :product="product"
                    :selected-size="checkout.selectedSize.value"
                    @shopee="checkout!.openShopee()"
                    @tokopedia="checkout!.openTokopedia()"
                    @whatsapp="checkout!.openWhatsApp()"
                  />
                </div>

                <p class="text-xs text-slate-grey text-center">
                  Harga belum termasuk ongkos kirim · Free return 7 hari
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
