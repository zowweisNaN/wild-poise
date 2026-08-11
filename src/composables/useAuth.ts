import { ref } from 'vue'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../firebase'

// ── Passcode fallback (configurable via env var) ─────────────────────────────
const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'wildpoise@admin'
const PASSCODE_SESSION_KEY = 'wp_admin_passcode_auth'

// ── Global reactive state (module-level singleton) ────────────────────────────
const isAdmin = ref(false)
const adminUser = ref<User | null>(null)
const adminMode = ref<'firebase' | 'passcode' | null>(null)
const isAuthLoading = ref(true)
const authError = ref<string | null>(null)

// Restore passcode session on load
if (sessionStorage.getItem(PASSCODE_SESSION_KEY) === 'granted') {
  isAdmin.value = true
  adminMode.value = 'passcode'
}

// Watch Firebase Auth state if configured
if (auth && isFirebaseConfigured) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      adminUser.value = user
      isAdmin.value = true
      adminMode.value = 'firebase'
    } else {
      adminUser.value = null
      // Only revoke if currently firebase-authenticated (preserve passcode session)
      if (adminMode.value === 'firebase') {
        isAdmin.value = false
        adminMode.value = null
      }
    }
    isAuthLoading.value = false
  })
} else {
  isAuthLoading.value = false
}

export function useAuth() {
  async function loginWithEmail(email: string, password: string): Promise<boolean> {
    if (!auth) {
      authError.value = 'Firebase Auth is not configured. Use Admin Passcode instead.'
      return false
    }
    authError.value = null
    isAuthLoading.value = true
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      adminUser.value = cred.user
      isAdmin.value = true
      adminMode.value = 'firebase'
      return true
    } catch (err: any) {
      authError.value =
        err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password'
          ? 'Invalid email or password. Please try again.'
          : err?.code === 'auth/too-many-requests'
          ? 'Too many attempts. Please wait a moment before retrying.'
          : err?.message || 'Authentication failed.'
      return false
    } finally {
      isAuthLoading.value = false
    }
  }

  function loginWithPasscode(passcode: string): boolean {
    authError.value = null
    if (passcode === ADMIN_PASSCODE) {
      isAdmin.value = true
      adminMode.value = 'passcode'
      sessionStorage.setItem(PASSCODE_SESSION_KEY, 'granted')
      return true
    } else {
      authError.value = 'Incorrect admin passcode. Please try again.'
      return false
    }
  }

  async function logout() {
    authError.value = null
    // Clear passcode session
    sessionStorage.removeItem(PASSCODE_SESSION_KEY)
    // Sign out of Firebase Auth if active
    if (auth && adminMode.value === 'firebase') {
      try {
        await signOut(auth)
      } catch (err: any) {
        console.warn('Sign-out error:', err)
      }
    }
    isAdmin.value = false
    adminUser.value = null
    adminMode.value = null
  }

  function clearError() {
    authError.value = null
  }

  return {
    isAdmin,
    adminUser,
    adminMode,
    isAuthLoading,
    authError,
    isFirebaseConfigured,
    loginWithEmail,
    loginWithPasscode,
    logout,
    clearError
  }
}
