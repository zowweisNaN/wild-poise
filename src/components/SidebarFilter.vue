<script setup lang="ts">
import { ref } from 'vue'
import type { ShirtCategory, ShirtSize } from '../types/product'
import { ChevronDown, RefreshCw } from '@lucide/vue'

export interface FilterState {
  category: ShirtCategory
  size: ShirtSize | 'All'
  availability: 'All' | 'inStock' | 'outOfStock'
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'title-asc'
}

const props = defineProps<{
  categories: readonly ShirtCategory[]
  filters: FilterState
}>()

const emit = defineEmits<{
  (e: 'update', filters: Partial<FilterState>): void
  (e: 'reset'): void
}>()

// Accordion Open states
const openCategory = ref(true)
const openSize = ref(true)
const openAvailability = ref(true)
const openSort = ref(true)

const sizes: (ShirtSize | 'All')[] = ['All', 'S', 'M', 'L', 'XL', 'XXL']
</script>

<template>
  <aside class="w-full space-y-6 text-sm">
    <div class="flex items-center justify-between pb-3 border-b border-gray-200">
      <h3 class="font-display font-bold text-slate-deep text-base uppercase tracking-wider">Filters</h3>
      <button
        @click="emit('reset')"
        class="text-xs text-slate-grey hover:text-slate-deep flex items-center gap-1 transition-colors"
      >
        <RefreshCw class="h-3 w-3" />
        Reset
      </button>
    </div>

    <!-- 1. Category Filter Accordion -->
    <div class="border-b border-gray-200 pb-4">
      <button
        @click="openCategory = !openCategory"
        class="w-full flex items-center justify-between py-2 text-left font-semibold text-slate-deep hover:text-slate-grey transition-colors"
      >
        <span>Product Type</span>
        <ChevronDown class="h-4 w-4 transition-transform duration-200" :class="{ 'rotate-180': openCategory }" />
      </button>
      <div v-show="openCategory" class="mt-2 space-y-2 pl-1">
        <label
          v-for="cat in categories"
          :key="cat"
          class="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-deep py-1"
        >
          <input
            type="radio"
            name="category"
            :value="cat"
            :checked="filters.category === cat"
            @change="emit('update', { category: cat })"
            class="h-4 w-4 accent-slate-deep text-slate-deep rounded focus:ring-warm-sand"
          />
          <span class="text-sm font-medium" :class="{ 'font-bold text-slate-deep': filters.category === cat }">
            {{ cat }}
          </span>
        </label>
      </div>
    </div>

    <!-- 2. Size Filter Accordion -->
    <div class="border-b border-gray-200 pb-4">
      <button
        @click="openSize = !openSize"
        class="w-full flex items-center justify-between py-2 text-left font-semibold text-slate-deep hover:text-slate-grey transition-colors"
      >
        <span>Size</span>
        <ChevronDown class="h-4 w-4 transition-transform duration-200" :class="{ 'rotate-180': openSize }" />
      </button>
      <div v-show="openSize" class="mt-2 space-y-2 pl-1">
        <label
          v-for="sz in sizes"
          :key="sz"
          class="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-deep py-1"
        >
          <input
            type="radio"
            name="size"
            :value="sz"
            :checked="filters.size === sz"
            @change="emit('update', { size: sz })"
            class="h-4 w-4 accent-slate-deep text-slate-deep rounded focus:ring-warm-sand"
          />
          <span class="text-sm font-medium" :class="{ 'font-bold text-slate-deep': filters.size === sz }">
            {{ sz === 'All' ? 'All Sizes' : sz }}
          </span>
        </label>
      </div>
    </div>

    <!-- 3. Availability Filter Accordion -->
    <div class="border-b border-gray-200 pb-4">
      <button
        @click="openAvailability = !openAvailability"
        class="w-full flex items-center justify-between py-2 text-left font-semibold text-slate-deep hover:text-slate-grey transition-colors"
      >
        <span>Availability</span>
        <ChevronDown class="h-4 w-4 transition-transform duration-200" :class="{ 'rotate-180': openAvailability }" />
      </button>
      <div v-show="openAvailability" class="mt-2 space-y-2 pl-1">
        <label class="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-deep py-1">
          <input
            type="radio"
            name="availability"
            value="All"
            :checked="filters.availability === 'All'"
            @change="emit('update', { availability: 'All' })"
            class="h-4 w-4 accent-slate-deep text-slate-deep rounded focus:ring-warm-sand"
          />
          <span class="text-sm font-medium" :class="{ 'font-bold text-slate-deep': filters.availability === 'All' }">All Items</span>
        </label>
        <label class="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-deep py-1">
          <input
            type="radio"
            name="availability"
            value="inStock"
            :checked="filters.availability === 'inStock'"
            @change="emit('update', { availability: 'inStock' })"
            class="h-4 w-4 accent-slate-deep text-slate-deep rounded focus:ring-warm-sand"
          />
          <span class="text-sm font-medium" :class="{ 'font-bold text-slate-deep': filters.availability === 'inStock' }">In Stock</span>
        </label>
        <label class="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-deep py-1">
          <input
            type="radio"
            name="availability"
            value="outOfStock"
            :checked="filters.availability === 'outOfStock'"
            @change="emit('update', { availability: 'outOfStock' })"
            class="h-4 w-4 accent-slate-deep text-slate-deep rounded focus:ring-warm-sand"
          />
          <span class="text-sm font-medium" :class="{ 'font-bold text-slate-deep': filters.availability === 'outOfStock' }">Sold Out</span>
        </label>
      </div>
    </div>

    <!-- 4. Sort By Accordion -->
    <div class="pb-4">
      <button
        @click="openSort = !openSort"
        class="w-full flex items-center justify-between py-2 text-left font-semibold text-slate-deep hover:text-slate-grey transition-colors"
      >
        <span>Sort By</span>
        <ChevronDown class="h-4 w-4 transition-transform duration-200" :class="{ 'rotate-180': openSort }" />
      </button>
      <div v-show="openSort" class="mt-2 space-y-2 pl-1">
        <label class="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-deep py-1">
          <input
            type="radio"
            name="sortBy"
            value="featured"
            :checked="filters.sortBy === 'featured'"
            @change="emit('update', { sortBy: 'featured' })"
            class="h-4 w-4 accent-slate-deep text-slate-deep rounded focus:ring-warm-sand"
          />
          <span class="text-sm font-medium" :class="{ 'font-bold text-slate-deep': filters.sortBy === 'featured' }">Best Selling / Featured</span>
        </label>
        <label class="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-deep py-1">
          <input
            type="radio"
            name="sortBy"
            value="price-asc"
            :checked="filters.sortBy === 'price-asc'"
            @change="emit('update', { sortBy: 'price-asc' })"
            class="h-4 w-4 accent-slate-deep text-slate-deep rounded focus:ring-warm-sand"
          />
          <span class="text-sm font-medium" :class="{ 'font-bold text-slate-deep': filters.sortBy === 'price-asc' }">Price, low to high</span>
        </label>
        <label class="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-deep py-1">
          <input
            type="radio"
            name="sortBy"
            value="price-desc"
            :checked="filters.sortBy === 'price-desc'"
            @change="emit('update', { sortBy: 'price-desc' })"
            class="h-4 w-4 accent-slate-deep text-slate-deep rounded focus:ring-warm-sand"
          />
          <span class="text-sm font-medium" :class="{ 'font-bold text-slate-deep': filters.sortBy === 'price-desc' }">Price, high to low</span>
        </label>
        <label class="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-deep py-1">
          <input
            type="radio"
            name="sortBy"
            value="title-asc"
            :checked="filters.sortBy === 'title-asc'"
            @change="emit('update', { sortBy: 'title-asc' })"
            class="h-4 w-4 accent-slate-deep text-slate-deep rounded focus:ring-warm-sand"
          />
          <span class="text-sm font-medium" :class="{ 'font-bold text-slate-deep': filters.sortBy === 'title-asc' }">Alphabetically, A-Z</span>
        </label>
      </div>
    </div>
  </aside>
</template>
