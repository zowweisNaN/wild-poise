<script setup lang="ts">
import type { Product, ShirtCategory } from "../types/product";
import ProductCard from "../components/ProductCard.vue";
import CategoryFilter from "../components/CategoryFilter.vue";
import {
  ShoppingBag,
  TrendingUp,
  Truck,
  RotateCcw,
  ArrowRight,
} from "@lucide/vue";

const props = defineProps<{
  products: Product[];
  categories: readonly ShirtCategory[];
  activeCategory: ShirtCategory;
  filteredProducts: Product[];
}>();

const emit = defineEmits<{
  (e: "change-category", cat: ShirtCategory): void;
  (e: "open-product", product: Product): void;
  (e: "go-to-collection"): void;
}>();
</script>

<template>
  <div>
    <!-- ── Hero Section (First Page Original Layout) ─────────────────────── -->
    <section class="relative overflow-hidden bg-slate-deep text-soft-cream">
      <!-- Decorative blobs -->
      <div
        class="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-warm-sand/10 blur-3xl pointer-events-none"
      />
      <div
        class="absolute bottom-0 -left-16 h-64 w-64 rounded-full bg-slate-grey/10 blur-3xl pointer-events-none"
      />

      <div
        class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28"
      >
        <div class="max-w-2xl">
          <span class="badge mb-4 inline-block"
            >Wild Poise Collection 2025</span
          >
          <h1
            class="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
          >
            Wild Poise<br />
            <span class="text-warm-sand">Unisex Apparel</span>
          </h1>
          <p
            class="text-slate-grey text-lg sm:text-xl leading-relaxed mb-8 max-w-xl"
          >
            Kemeja kasual unisex berdesain modern, adem, dan versatile. Pilih
            gaya Anda, pesan langsung via Shopee, Tokopedia, atau WhatsApp.
          </p>
          <div class="flex flex-wrap gap-4">
            <button
              @click="emit('go-to-collection')"
              class="btn-primary bg-warm-sand text-slate-deep hover:bg-warm-sand/80 px-7 py-3 text-base shadow-lg flex items-center gap-2 group"
            >
              Explore Collection
              <ArrowRight
                class="h-4 w-4 transition-transform group-hover:translate-x-1"
              />
            </button>
            <a
              href="https://wa.me/6287761561909"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-outline border-slate-grey/40 text-soft-cream hover:bg-soft-cream/10 hover:text-soft-cream hover:border-soft-cream px-6 py-3 text-base"
            >
              Chat via WhatsApp
            </a>
          </div>
        </div>
      </div>

      <!-- Feature strip -->
      <div class="border-t border-slate-grey/20 bg-slate-deep/80">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div class="flex items-center gap-3 text-slate-grey">
              <Truck class="h-5 w-5 flex-shrink-0 text-warm-sand" />
              <span class="text-xs sm:text-sm font-medium"
                >Free shipping &gt; Rp 300K</span
              >
            </div>
            <div class="flex items-center gap-3 text-slate-grey">
              <RotateCcw class="h-5 w-5 flex-shrink-0 text-warm-sand" />
              <span class="text-xs sm:text-sm font-medium"
                >7-day free return</span
              >
            </div>
            <div class="hidden sm:flex items-center gap-3 text-slate-grey">
              <TrendingUp class="h-5 w-5 flex-shrink-0 text-warm-sand" />
              <span class="text-xs sm:text-sm font-medium"
                >1,200+ happy customers</span
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Featured Products Grid (First Page Original Layout) ───────────── -->
    <section
      id="catalog"
      class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
      >
        <div>
          <h2 class="section-title text-3xl sm:text-4xl mb-1">
            Featured Shirts
          </h2>
          <p class="text-slate-grey text-sm">
            Showing {{ filteredProducts.length }} product{{
              filteredProducts.length !== 1 ? "s" : ""
            }}
          </p>
        </div>
        <CategoryFilter
          :categories="categories"
          :active="activeCategory"
          @change="emit('change-category', $event)"
        />
      </div>

      <!-- Empty state -->
      <div
        v-if="filteredProducts.length === 0"
        class="flex flex-col items-center justify-center py-24 text-center"
      >
        <ShoppingBag class="h-12 w-12 text-slate-grey/40 mb-4" />
        <h3 class="font-display font-semibold text-slate-deep text-lg mb-2">
          No products found
        </h3>
        <p class="text-slate-grey text-sm max-w-sm">
          No shirts found in this category.
        </p>
      </div>

      <!-- Product Grid -->
      <TransitionGroup
        v-else
        name="grid"
        tag="div"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @open="emit('open-product', $event)"
        />
      </TransitionGroup>

      <!-- View Full Catalog CTA banner -->
      <div class="mt-14 text-center pt-8 border-t border-slate-grey/20">
        <button
          @click="emit('go-to-collection')"
          class="btn-primary bg-slate-deep text-soft-cream hover:bg-slate-deep/90 px-8 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2 shadow-md transition-all hover:scale-105"
        >
          View Full Catalog & Filters
          <ArrowRight class="h-4 w-4" />
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.grid-move,
.grid-enter-active,
.grid-leave-active {
  transition: all 0.35s ease;
}
.grid-enter-from,
.grid-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}
.grid-leave-active {
  position: absolute;
}
</style>
