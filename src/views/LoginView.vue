<script setup lang="ts">
import { ref } from 'vue'
import { ShieldCheck, AlertCircle, Loader2, ShoppingBag } from '@lucide/vue'
import { useAuth } from '../composables/useAuth'

const emit = defineEmits<{
  (e: 'authenticated'): void
}>()

const { loginWithGoogle, authError, isFirebaseConfigured } = useAuth()

const isLoading = ref(false)

async function handleGoogleLogin() {
  isLoading.value = true
  const success = await loginWithGoogle()
  isLoading.value = false
  if (success) emit('authenticated')
}
</script>

<template>
  <div class="min-h-screen bg-soft-cream flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Decorative background blobs -->
    <div class="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-slate-deep/5 blur-3xl pointer-events-none" />
    <div class="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-warm-sand/10 blur-3xl pointer-events-none" />

    <div class="w-full max-w-sm relative z-10">
      <!-- Brand Logo -->
      <div class="flex items-center justify-center gap-2 mb-8">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-deep text-soft-cream shadow-md">
          <ShoppingBag class="h-5 w-5 text-warm-sand" />
        </span>
        <span class="font-display text-2xl font-bold text-slate-deep tracking-widest uppercase">
          Wild Poise<span class="text-slate-grey">.</span>
        </span>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-3xl shadow-2xl border border-slate-grey/15 overflow-hidden">
        <!-- Card Header -->
        <div class="bg-slate-deep px-7 pt-7 pb-6 text-center">
          <div class="flex justify-center mb-3">
            <div class="h-12 w-12 rounded-2xl bg-warm-sand/20 flex items-center justify-center">
              <ShieldCheck class="h-7 w-7 text-warm-sand" />
            </div>
          </div>
          <h1 class="font-display font-bold text-xl text-white tracking-tight">Admin Sign In</h1>
          <p class="text-xs text-slate-grey mt-1">Wild Poise Dashboard</p>
        </div>

        <!-- Card Body -->
        <div class="px-7 py-8 flex flex-col items-center gap-5">
          <!-- Firebase not configured warning -->
          <div v-if="!isFirebaseConfigured" class="w-full p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
            <strong class="block mb-1">Firebase not configured</strong>
            Add your Firebase credentials to <code class="bg-amber-100 px-1 rounded font-mono">.env.local</code>.
          </div>

          <!-- Error Message -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
          >
            <div v-if="authError" class="w-full flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <AlertCircle class="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
              <p>{{ authError }}</p>
            </div>
          </Transition>

          <!-- Google Sign-In Button -->
          <button
            @click="handleGoogleLogin"
            :disabled="isLoading || !isFirebaseConfigured"
            class="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-xl border border-slate-grey/25 bg-white hover:bg-slate-50 shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm text-slate-700"
          >
            <Loader2 v-if="isLoading" class="h-5 w-5 animate-spin text-slate-500" />
            <!-- Google logo SVG -->
            <svg v-else viewBox="0 0 24 24" class="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {{ isLoading ? 'Signing in...' : 'Continue with Google' }}
          </button>
        </div>

        <!-- Footer hint -->
        <div class="px-7 pb-6 text-center text-[11px] text-slate-grey">
          Admin access controls product creation, editing, and deletion.
        </div>
      </div>
    </div>
  </div>
</template>
