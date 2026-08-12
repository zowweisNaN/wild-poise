<template>
  <div class="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse flex flex-col h-full border border-slate-grey/10">
    <!-- Image Box Skeleton -->
    <div class="relative aspect-[3/4] bg-slate-grey/20 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-slate-grey/10 via-slate-grey/30 to-slate-grey/10 bg-[length:200%_100%] animate-shimmer" />
      <div class="absolute top-3 left-3 h-5 w-16 bg-slate-grey/30 rounded-full" />
    </div>

    <!-- Content Skeleton -->
    <div class="p-4 flex flex-col flex-1 space-y-3">
      <!-- Title Lines -->
      <div class="space-y-2">
        <div class="h-4 bg-slate-grey/30 rounded-md w-5/6" />
        <div class="h-4 bg-slate-grey/20 rounded-md w-2/3" />
      </div>

      <!-- Size Pills -->
      <div class="flex gap-1.5 pt-1">
        <div class="h-5 w-7 bg-slate-grey/20 rounded" />
        <div class="h-5 w-7 bg-slate-grey/20 rounded" />
        <div class="h-5 w-7 bg-slate-grey/20 rounded" />
        <div class="h-5 w-7 bg-slate-grey/20 rounded" />
      </div>

      <!-- Footer Price & Button -->
      <div class="mt-auto pt-3 flex items-center justify-between border-t border-slate-grey/10">
        <div class="h-5 w-24 bg-slate-grey/30 rounded-md" />
        <div class="h-7 w-16 bg-slate-grey/30 rounded-xl" />
      </div>
    </div>
  </div>
</template>
