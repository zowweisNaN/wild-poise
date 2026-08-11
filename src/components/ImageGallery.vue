<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  images: string[]
  title: string
}>()

const activeIndex = ref(0)
const imgLoaded = ref(false)

function setActive(i: number) {
  activeIndex.value = i
  imgLoaded.value = false
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Main Image -->
    <div class="relative aspect-square rounded-2xl overflow-hidden bg-slate-grey/10 shadow-inner">
      <img
        :key="activeIndex"
        :src="images[activeIndex]"
        :alt="`${title} - image ${activeIndex + 1}`"
        class="h-full w-full object-cover transition-opacity duration-300"
        :class="imgLoaded ? 'opacity-100' : 'opacity-0'"
        @load="imgLoaded = true"
      />
      <div
        v-if="!imgLoaded"
        class="absolute inset-0 bg-gradient-to-r from-slate-grey/10 via-warm-sand/20 to-slate-grey/10 bg-[length:200%_100%] animate-shimmer"
      />
      <!-- Counter pill -->
      <span class="absolute bottom-3 right-3 bg-slate-deep/70 text-soft-cream text-xs font-medium px-2.5 py-1 rounded-full">
        {{ activeIndex + 1 }} / {{ images.length }}
      </span>
    </div>

    <!-- Thumbnails -->
    <div v-if="images.length > 1" class="flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="(img, i) in images"
        :key="i"
        class="flex-shrink-0 h-16 w-16 rounded-xl overflow-hidden border-2 transition-all duration-150"
        :class="[
          i === activeIndex
            ? 'border-slate-deep scale-105'
            : 'border-transparent hover:border-slate-grey/50 opacity-70 hover:opacity-100'
        ]"
        @click="setActive(i)"
        :aria-label="`View image ${i + 1}`"
      >
        <img :src="img" :alt="`${title} thumbnail ${i + 1}`" class="h-full w-full object-cover" />
      </button>
    </div>
  </div>
</template>
