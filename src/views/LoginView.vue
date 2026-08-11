<script setup lang="ts">
import { ref, watch } from 'vue'
import { ShieldCheck, KeyRound, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Loader2, ShoppingBag } from '@lucide/vue'
import { useAuth } from '../composables/useAuth'

const emit = defineEmits<{
  (e: 'authenticated'): void
}>()

const { loginWithEmail, loginWithPasscode, authError, clearError, isFirebaseConfigured } = useAuth()

// ── Tab State ────────────────────────────────────────────────────────────────
const activeTab = ref<'email' | 'passcode'>('passcode')

// ── Email / Password ─────────────────────────────────────────────────────────
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isEmailLoading = ref(false)

// ── Passcode ─────────────────────────────────────────────────────────────────
const passcode = ref('')
const showPasscode = ref(false)
const isPasscodeLoading = ref(false)
const passcodePulse = ref(false)

watch(() => activeTab.value, () => clearError())

async function handleEmailLogin() {
  if (!email.value || !password.value) return
  isEmailLoading.value = true
  const success = await loginWithEmail(email.value, password.value)
  isEmailLoading.value = false
  if (success) emit('authenticated')
}

function handlePasscodeLogin() {
  isPasscodeLoading.value = true
  setTimeout(() => {
    const success = loginWithPasscode(passcode.value)
    isPasscodeLoading.value = false
    if (success) {
      emit('authenticated')
    } else {
      passcodePulse.value = true
      passcode.value = ''
      setTimeout(() => { passcodePulse.value = false }, 600)
    }
  }, 400)
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
        <div class="bg-slate-deep px-7 pt-7 pb-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="h-11 w-11 rounded-2xl bg-warm-sand/20 flex items-center justify-center">
              <ShieldCheck class="h-6 w-6 text-warm-sand" />
            </div>
            <div>
              <h1 class="font-display font-bold text-xl text-white tracking-tight">Admin Access</h1>
              <p class="text-xs text-slate-grey">Wild Poise Dashboard</p>
            </div>
          </div>

          <!-- Tabs -->
          <div class="mt-5 flex items-center gap-1 bg-white/10 rounded-xl p-1">
            <button
              @click="activeTab = 'passcode'"
              class="flex-1 flex items-center justify-center gap-2 text-xs font-bold py-2 rounded-lg transition-all"
              :class="activeTab === 'passcode' ? 'bg-white text-slate-deep shadow-sm' : 'text-white/70 hover:text-white'"
            >
              <KeyRound class="h-3.5 w-3.5" />
              Admin Passcode
            </button>
            <button
              @click="activeTab = 'email'"
              class="flex-1 flex items-center justify-center gap-2 text-xs font-bold py-2 rounded-lg transition-all"
              :class="activeTab === 'email' ? 'bg-white text-slate-deep shadow-sm' : 'text-white/70 hover:text-white'"
            >
              <Mail class="h-3.5 w-3.5" />
              Email & Password
            </button>
          </div>
        </div>

        <!-- Card Body -->
        <div class="px-7 py-6 space-y-5">
          <!-- Error Message -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
          >
            <div v-if="authError" class="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <AlertCircle class="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
              <p>{{ authError }}</p>
            </div>
          </Transition>

          <!-- Passcode Tab -->
          <div v-if="activeTab === 'passcode'" class="space-y-4">
            <p class="text-xs text-slate-grey leading-relaxed">
              Enter the admin passcode to access dashboard controls. By default, it is set via
              <code class="bg-slate-100 px-1 py-0.5 rounded text-slate-deep font-mono text-[11px]">VITE_ADMIN_PASSCODE</code>
              environment variable.
            </p>

            <div :class="['relative transition-transform', passcodePulse ? 'animate-pulse' : '']">
              <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-grey" />
              <input
                v-model="passcode"
                :type="showPasscode ? 'text' : 'password'"
                placeholder="Enter admin passcode"
                class="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-grey/30 focus:outline-none focus:ring-2 focus:ring-slate-deep/40 transition-all text-sm font-medium"
                :class="passcodePulse ? 'border-red-400 bg-red-50' : 'bg-soft-cream/20'"
                @keyup.enter="handlePasscodeLogin"
                autocomplete="current-password"
              />
              <button
                type="button"
                @click="showPasscode = !showPasscode"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-grey hover:text-slate-deep transition-colors"
              >
                <EyeOff v-if="showPasscode" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </button>
            </div>

            <button
              @click="handlePasscodeLogin"
              :disabled="!passcode || isPasscodeLoading"
              class="w-full btn-primary py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] active:scale-95 transition-all shadow-md"
            >
              <Loader2 v-if="isPasscodeLoading" class="h-4 w-4 animate-spin" />
              <LogIn v-else class="h-4 w-4" />
              {{ isPasscodeLoading ? 'Verifying...' : 'Access Dashboard' }}
            </button>
          </div>

          <!-- Email Tab -->
          <div v-else class="space-y-4">
            <div v-if="!isFirebaseConfigured" class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <strong>Firebase Auth not configured.</strong> Set your Firebase credentials in
              <code class="bg-amber-100 px-1 rounded font-mono">.env.local</code> to use email sign-in. You can still use the Passcode tab.
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-deep mb-1.5">Email Address</label>
              <div class="relative">
                <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-grey" />
                <input
                  v-model="email"
                  type="email"
                  placeholder="admin@wildpoise.com"
                  :disabled="!isFirebaseConfigured"
                  class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-grey/30 bg-soft-cream/20 focus:outline-none focus:ring-2 focus:ring-slate-deep/40 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  @keyup.enter="handleEmailLogin"
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
                  placeholder="••••••••"
                  :disabled="!isFirebaseConfigured"
                  class="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-grey/30 bg-soft-cream/20 focus:outline-none focus:ring-2 focus:ring-slate-deep/40 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  @keyup.enter="handleEmailLogin"
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
              @click="handleEmailLogin"
              :disabled="!email || !password || isEmailLoading || !isFirebaseConfigured"
              class="w-full btn-primary py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] active:scale-95 transition-all shadow-md"
            >
              <Loader2 v-if="isEmailLoading" class="h-4 w-4 animate-spin" />
              <LogIn v-else class="h-4 w-4" />
              {{ isEmailLoading ? 'Signing in...' : 'Sign In as Admin' }}
            </button>
          </div>
        </div>

        <!-- Footer hint -->
        <div class="px-7 pb-6 text-center text-[11px] text-slate-grey">
          Admin access controls product creation, editing, and deletion.
        </div>
      </div>
    </div>
  </div>
</template>
