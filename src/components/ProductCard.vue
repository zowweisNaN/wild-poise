<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '../types/product'
import { ShoppingCart, Eye } from '@lucide/vue'

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  (e: 'open', product: Product): void
}>()

const imgLoaded = ref(false)
const hovered = ref(false)
</script>

<template>
  <article
    class="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col"
    :class="{ 'ring-1 ring-warm-sand': hovered }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="emit('open', product)"
    :aria-label="`View ${product.title}`"
  >
    <!-- Image Box (First Card Design) -->
    <div class="relative aspect-[3/4] overflow-hidden bg-slate-grey/10">
      <img
        v-if="product.images[0]"
        :src="hovered && product.images[1] ? product.images[1] : product.images[0]"
        :alt="product.title"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        :class="{ 'opacity-0': !imgLoaded, 'opacity-100': imgLoaded }"
        loading="lazy"
        @load="imgLoaded = true"
      />

      <!-- Skeleton loader -->
      <div
        v-if="!imgLoaded"
        class="absolute inset-0 bg-gradient-to-r from-slate-grey/10 via-warm-sand/20 to-slate-grey/10 bg-[length:200%_100%] animate-shimmer"
      />

      <!-- Category & Status Badges -->
      <div class="absolute top-3 left-3 flex flex-col gap-1 z-10">
        <span class="badge shadow-xs">{{ product.category }}</span>
        <span
          v-if="product.inStock === false"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-deep text-soft-cream uppercase tracking-wider shadow-xs"
        >
          Sold Out
        </span>
      </div>

      <!-- Quick View Hover Overlay -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-deep/30 backdrop-blur-[2px]">
        <span class="flex items-center gap-2 bg-soft-cream text-slate-deep text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
          <Eye class="h-4 w-4" />
          Quick View
        </span>
      </div>
    </div>

    <!-- Info Section (First Card Design) -->
    <div class="p-4 flex flex-col flex-1">
      <h3 class="font-display font-semibold text-slate-deep text-sm leading-snug line-clamp-2 mb-1.5">
        {{ product.title }}
      </h3>

      <!-- Available Sizes Chips -->
      <div class="flex flex-wrap gap-1 mb-3 mt-1">
        <span
          v-for="size in product.availableSizes"
          :key="size"
          class="text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-grey/40 text-slate-grey bg-slate-grey/5"
        >
          {{ size }}
        </span>
      </div>

      <!-- Price & Order CTA Button -->
      <div class="mt-auto pt-2 flex items-center justify-between gap-2 border-t border-slate-grey/10">
        <div class="flex flex-col">
          <span
            v-if="product.formattedOriginalPrice"
            class="text-[11px] text-slate-grey line-through font-medium"
          >
            {{ product.formattedOriginalPrice }}
          </span>
          <span class="font-display font-bold text-slate-deep text-base">
            {{ product.formattedPrice }}
          </span>
        </div>

        <button
          class="flex items-center gap-1.5 text-xs font-semibold text-slate-deep bg-warm-sand/70 hover:bg-warm-sand px-3 py-1.5 rounded-xl transition-colors shadow-xs"
          @click.stop="emit('open', product)"
        >
          <ShoppingCart class="h-3.5 w-3.5" />
          Order
        </button>
      </div>
    </div>
  </article>
</template>
