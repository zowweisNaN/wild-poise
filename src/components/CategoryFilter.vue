<script setup lang="ts">
import type { ShirtCategory } from '../types/product'

const props = defineProps<{
  categories: readonly ShirtCategory[]
  active: ShirtCategory
}>()

const emit = defineEmits<{
  (e: 'change', category: ShirtCategory): void
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="cat in categories"
      :key="cat"
      :id="`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`"
      class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-sand"
      :class="[
        active === cat
          ? 'bg-slate-deep text-soft-cream shadow-sm scale-105'
          : 'bg-white text-slate-deep border border-slate-grey/30 hover:border-slate-deep/40 hover:bg-warm-sand/20'
      ]"
      @click="emit('change', cat)"
    >
      {{ cat }}
    </button>
  </div>
</template>
