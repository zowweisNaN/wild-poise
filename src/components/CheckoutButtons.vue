<script setup lang="ts">
import type { Product } from "../types/product";
import type { ShirtSize } from "../types/product";
import { ExternalLink, AlertCircle } from "@lucide/vue";

const props = defineProps<{
  product: Product;
  selectedSize: ShirtSize | null;
}>();

const emit = defineEmits<{
  (e: "shopee"): void;
  (e: "tokopedia"): void;
  (e: "whatsapp"): void;
}>();

const handleWhatsAppClick = () => {
  if (!props.selectedSize) return;

  const phone = "6287761561909";
  const productName = props.product;
  const size = props.selectedSize;

  const message = `Halo Saya ingin memesan ${productName} - Ukuran: ${size}`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
  emit("whatsapp");
};
</script>

<template>
  <div class="space-y-3">
    <p
      v-if="!selectedSize"
      class="flex items-center gap-1.5 text-xs text-amber-600 font-medium"
    >
      <AlertCircle class="h-3.5 w-3.5" />
      Pilih ukuran untuk pesan via WhatsApp
    </p>

    <!-- WhatsApp — primary -->
    <button
      id="btn-whatsapp"
      class="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
      :class="[
        selectedSize
          ? 'bg-green-500 hover:bg-green-600 shadow-md shadow-green-500/30'
          : 'bg-green-500/60 cursor-not-allowed',
      ]"
      :disabled="!selectedSize"
      @click="handleWhatsAppClick"
    >
      <svg
        class="h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
        />
      </svg>
      Order via WhatsApp
    </button>

    <!-- Shopee & Tokopedia — secondary row -->
    <div class="grid grid-cols-2 gap-2">
      <button
        id="btn-shopee"
        class="flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100"
        @click="emit('shopee')"
      >
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M12 2C9.27 2 7 4.27 7 7H5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-2c0-2.73-2.27-5-5-5zm0 2c1.65 0 3 1.35 3 3H9c0-1.65 1.35-3 3-3zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
          />
        </svg>
        Shopee
        <ExternalLink class="h-3 w-3 opacity-60" />
      </button>

      <button
        id="btn-tokopedia"
        class="flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 bg-green-50 border border-green-200 text-green-800 hover:bg-green-100"
        @click="emit('tokopedia')"
      >
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        Tokopedia
        <ExternalLink class="h-3 w-3 opacity-60" />
      </button>
    </div>
  </div>
</template>
