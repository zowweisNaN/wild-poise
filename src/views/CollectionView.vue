<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product, ShirtCategory, ShirtSize } from '../types/product'
import SidebarFilter, { type FilterState } from '../components/SidebarFilter.vue'
import ProductCard from '../components/ProductCard.vue'
import { SlidersHorizontal, X, ShoppingBag, Filter } from '@lucide/vue'

const props = defineProps<{
  products: Product[]
  categories: readonly ShirtCategory[]
}>()

const emit = defineEmits<{
  (e: 'open-product', product: Product): void
  (e: 'go-home'): void
}>()

const mobileFilterOpen = ref(false)

const filters = ref<FilterState>({
  category: 'All',
  size: 'All',
  availability: 'All',
  sortBy: 'featured'
})

const filteredProducts = computed(() => {
  let list = [...props.products]

  // Category filter
  if (filters.value.category !== 'All') {
    list = list.filter(p => p.category === filters.value.category)
  }

  // Size filter
  if (filters.value.size !== 'All') {
    list = list.filter(p => p.availableSizes.includes(filters.value.size as ShirtSize))
  }

  // Availability filter
  if (filters.value.availability === 'inStock') {
    list = list.filter(p => p.inStock !== false)
  } else if (filters.value.availability === 'outOfStock') {
    list = list.filter(p => p.inStock === false)
  }

  // Sort By
  switch (filters.value.sortBy) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      list.sort((a, b) => b.price - a.price)
      break
    case 'title-asc':
      list.sort((a, b) => a.title.localeCompare(b.title))
      break
    default:
      break
  }

  return list
})

function updateFilters(partial: Partial<FilterState>) {
  filters.value = { ...filters.value, ...partial }
}

function resetFilters() {
  filters.value = {
    category: 'All',
    size: 'All',
    availability: 'All',
    sortBy: 'featured'
  }
}
</script>

<template>
  <div class="bg-soft-cream min-h-screen text-slate-deep">
    <!-- ── Collection Banner & Breadcrumb ────────────────────────────────────── -->
    <section class="border-b border-slate-grey/20 bg-slate-deep/5 py-8 sm:py-12">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-xs text-slate-grey mb-3 font-semibold uppercase tracking-widest">
          <button @click="emit('go-home')" class="hover:text-slate-deep transition-colors">Home</button>
          <span>/</span>
          <span class="text-slate-deep font-bold">Collections Catalog</span>
        </nav>

        <!-- Title & Subtitle -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 class="font-display font-extrabold text-3xl sm:text-4xl text-slate-deep tracking-tight uppercase">
              Wild Poise Catalog
            </h1>
            <p class="text-slate-grey text-sm mt-1">
              Unisex Apparel · Explore our full catalog with advanced filters & multi-channel checkout
            </p>
          </div>

          <!-- Item Count pill -->
          <p class="text-xs font-bold text-slate-deep bg-warm-sand/50 px-3 py-1.5 rounded-full uppercase tracking-wider">
            Showing {{ filteredProducts.length }} of {{ products.length }} items
          </p>
        </div>
      </div>
    </section>

    <!-- ── Main Collection Area (Etcetera 2-Column Layout) ───────────────────── -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <!-- Top Toolbar for Mobile & Active Filter Tags -->
      <div class="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-grey/20">
        <!-- Mobile Filter Toggle Button -->
        <button
          @click="mobileFilterOpen = true"
          class="lg:hidden inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase border-2 border-slate-deep rounded-xl hover:bg-slate-deep hover:text-soft-cream transition-all"
        >
          <SlidersHorizontal class="h-4 w-4" />
          Filter & Sort
        </button>

        <!-- Active Filter Badges -->
        <div class="flex flex-wrap items-center gap-2">
          <span v-if="filters.category !== 'All'" class="inline-flex items-center gap-1.5 px-3 py-1 bg-warm-sand text-slate-deep text-xs font-semibold rounded-full shadow-xs">
            Category: {{ filters.category }}
            <X class="h-3 w-3 cursor-pointer hover:opacity-75" @click="updateFilters({ category: 'All' })" />
          </span>
          <span v-if="filters.size !== 'All'" class="inline-flex items-center gap-1.5 px-3 py-1 bg-warm-sand text-slate-deep text-xs font-semibold rounded-full shadow-xs">
            Size: {{ filters.size }}
            <X class="h-3 w-3 cursor-pointer hover:opacity-75" @click="updateFilters({ size: 'All' })" />
          </span>
          <span v-if="filters.availability !== 'All'" class="inline-flex items-center gap-1.5 px-3 py-1 bg-warm-sand text-slate-deep text-xs font-semibold rounded-full shadow-xs">
            Status: {{ filters.availability === 'inStock' ? 'In Stock' : 'Sold Out' }}
            <X class="h-3 w-3 cursor-pointer hover:opacity-75" @click="updateFilters({ availability: 'All' })" />
          </span>
        </div>

        <!-- Quick Desktop Sort Dropdown -->
        <div class="hidden lg:flex items-center gap-2">
          <label for="desktop-sort" class="text-xs font-semibold text-slate-grey uppercase tracking-wider">Sort by:</label>
          <select
            id="desktop-sort"
            :value="filters.sortBy"
            @change="updateFilters({ sortBy: ($event.target as HTMLSelectElement).value as FilterState['sortBy'] })"
            class="text-xs font-semibold border-2 border-slate-grey/40 rounded-xl py-1.5 px-3 focus:outline-none focus:border-slate-deep bg-white text-slate-deep"
          >
            <option value="featured">Best selling / Featured</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
            <option value="title-asc">Alphabetically, A-Z</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- ── Left Sidebar (Desktop Filters) ─────────────────────────────── -->
        <div class="hidden lg:block lg:col-span-1 bg-white/70 p-5 rounded-2xl border border-slate-grey/20 shadow-xs">
          <SidebarFilter
            :categories="categories"
            :filters="filters"
            @update="updateFilters"
            @reset="resetFilters"
          />
        </div>

        <!-- ── Right Product Grid ─────────────────────────────────────────── -->
        <div class="lg:col-span-3">
          <!-- Empty state -->
          <div
            v-if="filteredProducts.length === 0"
            class="flex flex-col items-center justify-center py-20 text-center bg-white/60 rounded-2xl border border-dashed border-slate-grey/40 p-6"
          >
            <ShoppingBag class="h-10 w-10 text-slate-grey mb-3 opacity-50" />
            <h3 class="font-display font-bold text-slate-deep text-lg mb-1">No products match your filters</h3>
            <p class="text-slate-grey text-sm max-w-sm mb-4">
              Try resetting your size or category selection to view available items.
            </p>
            <button
              @click="resetFilters"
              class="btn-primary text-xs uppercase font-bold px-5 py-2.5"
            >
              Clear All Filters
            </button>
          </div>

          <!-- Etcetera Style Grid -->
          <TransitionGroup
            v-else
            name="grid"
            tag="div"
            class="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-8"
          >
            <ProductCard
              v-for="product in filteredProducts"
              :key="product.id"
              :product="product"
              @open="emit('open-product', $event)"
            />
          </TransitionGroup>
        </div>
      </div>
    </section>

    <!-- Mobile Sidebar Filter Drawer -->
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
          v-if="mobileFilterOpen"
          class="fixed inset-0 z-50 flex justify-start bg-slate-deep/60 backdrop-blur-xs lg:hidden"
          @click.self="mobileFilterOpen = false"
        >
          <div class="w-4/5 max-w-sm bg-soft-cream h-full p-6 overflow-y-auto shadow-2xl flex flex-col">
            <div class="flex items-center justify-between pb-4 border-b border-slate-grey/20 mb-6">
              <h3 class="font-display font-bold text-slate-deep text-base uppercase tracking-wider flex items-center gap-2">
                <Filter class="h-4 w-4" /> Filter & Sort
              </h3>
              <button @click="mobileFilterOpen = false" class="p-1 rounded-md text-slate-grey hover:text-slate-deep">
                <X class="h-5 w-5" />
              </button>
            </div>

            <div class="flex-1 bg-white p-4 rounded-xl border border-slate-grey/20">
              <SidebarFilter
                :categories="categories"
                :filters="filters"
                @update="updateFilters"
                @reset="resetFilters"
              />
            </div>

            <button
              @click="mobileFilterOpen = false"
              class="btn-primary w-full mt-6 text-xs uppercase font-bold py-3"
            >
              Apply Filters ({{ filteredProducts.length }})
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
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
  transform: scale(0.96) translateY(10px);
}
.grid-leave-active {
  position: absolute;
}
</style>
