<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X, ShoppingBag, User, Layers, ShieldCheck, LogOut, Lock } from '@lucide/vue'
import { useAuth } from '../composables/useAuth'

const props = defineProps<{
  activePage: 'home' | 'collection' | 'dashboard'
  isLiveFirebase: boolean
  isFirebaseConfigured: boolean
  isSeeding: boolean
  seedSuccess: boolean
}>()

const emit = defineEmits<{
  (e: 'navigate', page: 'home' | 'collection' | 'dashboard'): void
  (e: 'seed'): void
}>()

const mobileOpen = ref(false)

const { isAdmin, adminUser, adminMode, logout } = useAuth()
</script>

<template>
  <header class="sticky top-0 z-40 bg-soft-cream/95 backdrop-blur-md border-b border-slate-grey/20 shadow-xs">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between gap-4">
        <!-- Brand Logo -->
        <button @click="emit('navigate', 'home')" class="flex items-center gap-2 group text-left shrink-0">
          <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-deep text-soft-cream transition-transform group-hover:scale-105">
            <ShoppingBag class="h-4 w-4 text-warm-sand" />
          </span>
          <span class="font-display text-xl font-bold text-slate-deep tracking-widest uppercase">
            Wild Poise<span class="text-slate-grey">.</span>
          </span>
        </button>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-deep">
          <button
            @click="emit('navigate', 'home')"
            class="py-2 border-b-2 transition-all hover:text-slate-deep"
            :class="activePage === 'home' ? 'border-slate-deep text-slate-deep font-extrabold' : 'border-transparent text-slate-deep/70'"
          >
            Home
          </button>

          <button
            @click="emit('navigate', 'collection')"
            class="py-2 border-b-2 transition-all flex items-center gap-1.5 hover:text-slate-deep"
            :class="activePage === 'collection' ? 'border-slate-deep text-slate-deep font-extrabold' : 'border-transparent text-slate-deep/70'"
          >
            <Layers class="h-3.5 w-3.5" />
            Collections Catalog
          </button>
        </nav>

        <!-- Right Side Controls -->
        <div class="flex items-center gap-2">
          <!-- Admin Status Chip (Desktop) -->
          <div class="hidden sm:flex items-center">
            <button
              v-if="isAdmin"
              @click="logout"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-800 border border-emerald-500/30 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all group"
              title="Click to sign out as admin"
            >
              <ShieldCheck class="h-3.5 w-3.5 group-hover:hidden" />
              <LogOut class="h-3.5 w-3.5 hidden group-hover:block" />
              <span class="group-hover:hidden">
                {{ adminMode === 'firebase' && adminUser?.email ? adminUser.email.split('@')[0] : 'Admin' }}
              </span>
              <span class="hidden group-hover:inline">Sign out</span>
            </button>

            <button
              v-else
              @click="emit('navigate', 'dashboard')"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 transition-all"
              title="Sign in as admin"
            >
              <Lock class="h-3.5 w-3.5" />
              Admin
            </button>
          </div>

          <a
            href="https://wa.me/628123456789"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden sm:inline-flex btn-primary text-xs uppercase font-bold py-2 px-4 shadow-sm"
          >
            <User class="h-3.5 w-3.5" />
            Order WA
          </a>

          <!-- Mobile Hamburger -->
          <button
            class="md:hidden p-2 rounded-lg text-slate-deep hover:bg-warm-sand/30 transition-colors"
            @click="mobileOpen = !mobileOpen"
            aria-label="Toggle menu"
          >
            <X v-if="mobileOpen" class="h-5 w-5" />
            <Menu v-else class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <nav v-if="mobileOpen" class="md:hidden pb-4 space-y-1 border-t border-slate-grey/20 pt-2">
          <button
            @click="emit('navigate', 'home'); mobileOpen = false"
            class="w-full text-left px-3 py-2 text-xs font-bold uppercase text-slate-deep hover:bg-warm-sand/30 rounded-lg"
          >
            Home
          </button>
          <button
            @click="emit('navigate', 'collection'); mobileOpen = false"
            class="w-full text-left px-3 py-2 text-xs font-bold uppercase text-slate-deep hover:bg-warm-sand/30 rounded-lg"
          >
            Collections Catalog
          </button>

          <!-- Admin action in mobile -->
          <div class="border-t border-slate-grey/20 pt-2 mt-2">
            <button
              v-if="isAdmin"
              @click="logout; mobileOpen = false"
              class="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut class="h-4 w-4" />
              Sign Out (Admin)
            </button>
            <button
              v-else
              @click="emit('navigate', 'dashboard'); mobileOpen = false"
              class="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-800 hover:bg-warm-sand/30 rounded-lg transition-colors"
            >
              <Lock class="h-4 w-4" />
              Admin Sign In
            </button>
          </div>

          <a
            href="https://wa.me/628123456789"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary w-full mt-2 text-xs uppercase font-bold"
          >
            Order via WhatsApp
          </a>
        </nav>
      </Transition>
    </div>
  </header>
</template>
