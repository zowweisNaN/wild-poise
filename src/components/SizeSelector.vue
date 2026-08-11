<script setup lang="ts">
import type { ShirtSize } from '../types/product'

const props = defineProps<{
  sizes: ShirtSize[]
  selected: ShirtSize | null
}>()

const emit = defineEmits<{
  (e: 'select', size: ShirtSize): void
}>()
</script>

<template>
  <div>
    <p class="text-xs font-semibold text-slate-grey uppercase tracking-widest mb-2">Select Size</p>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="size in sizes"
        :key="size"
        :id="`size-${size}`"
        class="h-10 min-w-[2.5rem] px-3 rounded-xl border-2 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-sand"
        :class="[
          selected === size
            ? 'bg-slate-deep border-slate-deep text-soft-cream scale-105 shadow-sm'
            : 'bg-white border-slate-grey/40 text-slate-deep hover:border-slate-deep/60'
        ]"
        @click="emit('select', size)"
      >
        {{ size }}
      </button>
    </div>
  </div>
</template>
