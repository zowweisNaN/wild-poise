<script setup lang="ts">
import { ref } from 'vue'
import { ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Loader2, ShoppingBag } from '@lucide/vue'
import { useAuth } from '../composables/useAuth'

const emit = defineEmits<{
  (e: 'authenticated'): void
}>()

const { loginWithEmail, authError, isFirebaseConfigured } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) return
  isLoading.value = true
  const success = await loginWithEmail(email.value, password.value)
  isLoading.value = false
  if (success) emit('authenticated')
}
</script>

<template>
  <div class="min-h-screen bg-soft-cream flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Decorative background blobs -->
    <div class="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-slate-deep/5 blur-3xl pointer-events-none" />
    <div class="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-warm-sand/10 blur-3xl pointer-events-none" />

    <div class="w-full max-w-md relative z-10">
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
        <div class="px-7 py-7 space-y-5">
          <!-- Firebase not configured warning -->
          <div v-if="!isFirebaseConfigured" class="w-full p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
            <strong class="block mb-1">Firebase not configured</strong>
            Add your Firebase credentials to <code class="bg-amber-100 px-1 rounded font-mono">.env</code> or <code class="bg-amber-100 px-1 rounded font-mono">.env.local</code>.
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

          <!-- Form Fields -->
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-deep mb-1.5">Email Address</label>
              <div class="relative">
                <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-grey" />
                <input
                  v-model="email"
                  type="email"
                  required
                  placeholder="anandak1708@gmail.com"
                  :disabled="!isFirebaseConfigured"
                  class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-grey/30 bg-soft-cream/20 focus:outline-none focus:ring-2 focus:ring-slate-deep/40 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-deep mb-1.5">Password</label>
              <div class="relative">
                <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-grey" />
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="••••••••"
                  :disabled="!isFirebaseConfigured"
                  class="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-grey/30 bg-soft-cream/20 focus:outline-none focus:ring-2 focus:ring-slate-deep/40 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  :disabled="!isFirebaseConfigured"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-grey hover:text-slate-deep transition-colors disabled:opacity-40"
                >
                  <EyeOff v-if="showPassword" class="h-4 w-4" />
                  <Eye v-else class="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              :disabled="!email || !password || isLoading || !isFirebaseConfigured"
              class="w-full btn-primary py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] active:scale-95 transition-all shadow-md mt-2"
            >
              <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
              <LogIn v-else class="h-4 w-4" />
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
        </div>

        <!-- Footer hint -->
        <div class="px-7 pb-6 text-center text-[11px] text-slate-grey">
          Admin access controls product creation, editing, and deletion.
        </div>
      </div>
    </div>
  </div>
</template>
