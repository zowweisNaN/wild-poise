<script setup lang="ts">
import { ref } from 'vue'
import { Database, Check, RefreshCw, Info, X } from '@lucide/vue'

const props = defineProps<{
  isLiveFirebase: boolean
  isFirebaseConfigured: boolean
  isSeeding: boolean
  seedSuccess: boolean
}>()

const emit = defineEmits<{
  (e: 'seed'): void
}>()

const showInfoModal = ref(false)
</script>

<template>
  <div>
    <!-- Header Badge Bar -->
    <div class="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-slate-700/60 shadow-sm">
      <!-- Status Indicator Light -->
      <span class="relative flex h-2 w-2">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          :class="isLiveFirebase ? 'bg-emerald-400' : 'bg-amber-400'"
        ></span>
        <span
          class="relative inline-flex rounded-full h-2 w-2"
          :class="isLiveFirebase ? 'bg-emerald-500' : 'bg-amber-500'"
        ></span>
      </span>

      <!-- Status Label -->
      <span class="font-medium">
        {{ isLiveFirebase ? 'Firestore Live' : 'Static Fallback' }}
      </span>

      <span class="text-slate-500">|</span>

      <!-- Seed Action Button -->
      <button
        @click="emit('seed')"
        :disabled="isSeeding"
        class="flex items-center gap-1 hover:text-warm-sand transition-colors disabled:opacity-50 text-[11px]"
        title="Seed Firestore Database with initial Wild Poise products"
      >
        <RefreshCw v-if="isSeeding" class="h-3 w-3 animate-spin text-warm-sand" />
        <Check v-else-if="seedSuccess" class="h-3 w-3 text-emerald-400" />
        <Database v-else class="h-3 w-3 text-amber-300" />
        <span>{{ isSeeding ? 'Seeding...' : seedSuccess ? 'Seeded!' : 'Seed Firestore' }}</span>
      </button>

      <!-- Config Info Trigger -->
      <button
        @click="showInfoModal = true"
        class="text-slate-400 hover:text-white transition-colors p-0.5 ml-0.5"
        title="Firebase Setup Guide"
      >
        <Info class="h-3.5 w-3.5" />
      </button>
    </div>

    <!-- Info Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showInfoModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-slate-deep text-soft-cream rounded-2xl p-6 max-w-lg w-full border border-slate-grey/30 shadow-2xl relative">
          <button
            @click="showInfoModal = false"
            class="absolute top-4 right-4 text-slate-grey hover:text-white transition-colors"
          >
            <X class="h-5 w-5" />
          </button>

          <div class="flex items-center gap-3 mb-4">
            <span class="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Database class="h-6 w-6" />
            </span>
            <div>
              <h3 class="font-display font-bold text-lg text-white">Firebase Firestore Backend</h3>
              <p class="text-xs text-slate-grey">Wild Poise Product Catalog</p>
            </div>
          </div>

          <div class="space-y-3 text-xs text-slate-grey leading-relaxed">
            <div class="p-3 rounded-lg bg-slate-800/80 border border-slate-700/50">
              <span class="font-semibold text-white block mb-1">Status:</span>
              <p v-if="isLiveFirebase" class="text-emerald-400 flex items-center gap-1.5">
                <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                Connected to active Firebase Firestore project. Changes sync in real-time.
              </p>
              <p v-else class="text-amber-300">
                Running on static fallback dataset. To sync live with Firebase, populate <code class="bg-slate-900 px-1 py-0.5 rounded text-warm-sand">.env.local</code> or Vercel Environment Variables.
              </p>
            </div>

            <div>
              <h4 class="font-semibold text-warm-sand mb-1">Required Environment Variables:</h4>
              <pre class="bg-slate-900/90 p-3 rounded-lg text-[11px] font-mono text-emerald-300 overflow-x-auto">VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx</pre>
            </div>

            <p>
              When deployed on <strong>Vercel</strong>, add these variables in your Project Settings under <strong>Environment Variables</strong>.
            </p>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              @click="showInfoModal = false"
              class="px-4 py-2 bg-warm-sand text-slate-deep font-bold rounded-lg hover:bg-amber-300 transition-colors text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
