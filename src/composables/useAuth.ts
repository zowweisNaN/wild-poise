import { ref } from 'vue'
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  type User
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../firebase'

// ── Trusted admin email addresses ─────────────────────────────────────────────
const ALLOWED_EMAILS = [
  'anandak1708@gmail.com'
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
      if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
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
  async function loginWithGoogle(): Promise<boolean> {
    if (!auth) {
      authError.value = 'Firebase Auth is not configured. Add your credentials to .env.local.'
      return false
    }
    authError.value = null
    isAuthLoading.value = true
    try {
      const provider = new GoogleAuthProvider()
      const cred = await signInWithPopup(auth, provider)
      const email = cred.user.email ?? ''

      // Check against the trusted email list
      if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
        await signOut(auth)
        authError.value = `Access denied. ${email} is not an authorized admin account.`
        return false
      }

      adminUser.value = cred.user
      isAdmin.value = true
      return true
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        // User closed the popup — not really an error
        authError.value = null
      } else {
        authError.value = err?.message || 'Google sign-in failed. Please try again.'
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

  return {
    isAdmin,
    adminUser,
    isAuthLoading,
    authError,
    isFirebaseConfigured,
    loginWithGoogle,
    logout
  }
}
