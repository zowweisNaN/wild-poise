<script setup lang="ts">
import { ShoppingBag, Camera, MessageCircle } from '@lucide/vue'
</script>

<template>
  <footer id="contact" class="bg-slate-deep text-soft-cream">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        <!-- Brand -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-warm-sand/20">
              <ShoppingBag class="h-5 w-5 text-warm-sand" />
            </span>
            <span class="font-display text-2xl font-bold tracking-tight">
              Wild Poise<span class="text-slate-grey">.</span>
            </span>
          </div>
          <p class="text-sm text-slate-grey leading-relaxed max-w-xs">
            Wild Poise unisex apparel. Kemeja berkualitas, nyaman, stylish, dan versatile untuk semua gender.
          </p>
        </div>

        <!-- Quick Links -->
        <div id="about">
          <h4 class="font-display font-semibold text-warm-sand mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li><a href="#catalog" class="text-sm text-slate-grey hover:text-soft-cream transition-colors">Catalog</a></li>
            <li><a href="#" class="text-sm text-slate-grey hover:text-soft-cream transition-colors">Size Guide</a></li>
            <li><a href="#" class="text-sm text-slate-grey hover:text-soft-cream transition-colors">Return Policy</a></li>
          </ul>
        </div>

        <!-- Order Channels -->
        <div>
          <h4 class="font-display font-semibold text-warm-sand mb-4">Order Now</h4>
          <div class="space-y-3">
            <a
              href="https://shopee.co.id"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 text-sm text-slate-grey hover:text-soft-cream transition-colors group"
            >
              <span class="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors">
                <span class="text-orange-400 font-bold text-xs">S</span>
              </span>
              Shopee
            </a>
            <a
              href="https://tokopedia.com"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 text-sm text-slate-grey hover:text-soft-cream transition-colors group"
            >
              <span class="flex h-7 w-7 items-center justify-center rounded-md bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                <span class="text-green-400 font-bold text-xs">T</span>
              </span>
              Tokopedia
            </a>
            <a
              href="https://wa.me/6287761561909"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 text-sm text-slate-grey hover:text-soft-cream transition-colors group"
            >
              <span class="flex h-7 w-7 items-center justify-center rounded-md bg-green-600/20 group-hover:bg-green-600/30 transition-colors">
                <MessageCircle class="h-4 w-4 text-green-400" />
              </span>
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-grey/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-xs text-slate-grey">© 2025 Wild Poise. All rights reserved.</p>
        <div class="flex items-center gap-4">
          <a href="#" class="text-slate-grey hover:text-warm-sand transition-colors" aria-label="Instagram">
            <Camera class="h-4 w-4" />
          </a>
          <a href="https://wa.me/6287761561909" target="_blank" rel="noopener noreferrer" class="text-slate-grey hover:text-warm-sand transition-colors" aria-label="WhatsApp">
            <MessageCircle class="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
