import { ref } from 'vue'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../firebase'

// ── Trusted admin email addresses ─────────────────────────────────────────────
const ALLOWED_EMAILS = [
  'anandak1708@gmail.com',
  'arya1006@gmail.com'
]

// ── Global reactive state (module-level singleton) ────────────────────────────
const isAdmin = ref(false)
const adminUser = ref<User | null>(null)
const isAuthLoading = ref(true)
const authError = ref<string | null>(null)

// Watch Firebase Auth state if configured
if (auth && isFirebaseConfigured) {
  const _auth = auth
  onAuthStateChanged(_auth, async (user) => {
    if (user) {
      const email = user.email ?? ''
      if (ALLOWED_EMAILS.length > 0 && !ALLOWED_EMAILS.includes(email.toLowerCase())) {
        await signOut(_auth)
        isAdmin.value = false
        adminUser.value = null
      } else {
        adminUser.value = user
        isAdmin.value = true
      }
    } else {
      adminUser.value = null
      isAdmin.value = false
    }
    isAuthLoading.value = false
  })
} else {
  isAuthLoading.value = false
}

export function useAuth() {
  async function loginWithEmail(emailVal: string, passwordVal: string): Promise<boolean> {
    if (!auth) {
      authError.value = 'Firebase Auth is not configured. Check your credentials.'
      return false
    }
    authError.value = null
    isAuthLoading.value = true
    try {
      const cred = await signInWithEmailAndPassword(auth, emailVal, passwordVal)
      const email = cred.user.email ?? ''

      if (ALLOWED_EMAILS.length > 0 && !ALLOWED_EMAILS.includes(email.toLowerCase())) {
        await signOut(auth)
        authError.value = `Access denied. ${email} is not authorized.`
        return false
      }

      adminUser.value = cred.user
      isAdmin.value = true
      return true
    } catch (err: any) {
      if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found') {
        authError.value = 'Invalid email or password. Please check your credentials.'
      } else if (err?.code === 'auth/too-many-requests') {
        authError.value = 'Too many failed login attempts. Please try again later.'
      } else {
        authError.value = err?.message || 'Authentication failed. Please try again.'
      }
      return false
    } finally {
      isAuthLoading.value = false
    }
  }

  async function logout() {
    authError.value = null
    if (auth) {
      try {
        await signOut(auth)
      } catch (err: any) {
        console.warn('Sign-out error:', err)
      }
    }
    isAdmin.value = false
    adminUser.value = null
  }

  function clearError() {
    authError.value = null
  }

  return {
    isAdmin,
    adminUser,
    isAuthLoading,
    authError,
    isFirebaseConfigured,
    loginWithEmail,
    logout,
    clearError
  }
}
