import { ref, onUnmounted } from 'vue'
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  type Unsubscribe
} from 'firebase/firestore'
import type { Product } from '../types/product'
import { products as initialProducts } from '../data/products'
import { db, isFirebaseConfigured } from '../firebase'

const products = ref<Product[]>([...initialProducts])
const isLoading = ref(true)
const isLiveFirebase = ref(false)
const error = ref<string | null>(null)
const isSeeding = ref(false)
const seedSuccess = ref(false)

let unsubscribe: Unsubscribe | null = null

export function useProducts() {
  function init() {
    if (db && isFirebaseConfigured) {
      isLoading.value = true
      error.value = null

      try {
        const colRef = collection(db, 'products')
        unsubscribe = onSnapshot(
          colRef,
          (snapshot) => {
            if (snapshot.empty) {
              // Firestore is connected but collection is empty
              // Maintain local products until seeded
              products.value = [...initialProducts]
              isLiveFirebase.value = true
              isLoading.value = false
            } else {
              const firestoreProducts: Product[] = snapshot.docs.map((docSnap) => {
                const data = docSnap.data() as Product
                return {
                  ...data,
                  id: docSnap.id
                }
              })
              products.value = firestoreProducts
              isLiveFirebase.value = true
              isLoading.value = false
            }
          },
          (err) => {
            console.warn('Firestore subscription notice:', err)
            error.value = err.message
            products.value = [...initialProducts]
            isLiveFirebase.value = false
            isLoading.value = false
          }
        )
      } catch (err: any) {
        console.warn('Firestore initialization fallback:', err)
        error.value = err?.message || 'Failed to connect to Firestore'
        products.value = [...initialProducts]
        isLiveFirebase.value = false
        isLoading.value = false
      }
    } else {
      // Local Fallback Mode
      products.value = [...initialProducts]
      isLiveFirebase.value = false
      isLoading.value = false
    }
  }

  async function seedDatabase() {
    if (!db) {
      alert('Firebase Firestore is not configured. Please set your environment variables in .env.local or Vercel.')
      return
    }

    isSeeding.value = true
    seedSuccess.value = false
    try {
      for (const prod of initialProducts) {
        const docRef = doc(db, 'products', prod.id)
        await setDoc(docRef, prod, { merge: true })
      }
      seedSuccess.value = true
      setTimeout(() => {
        seedSuccess.value = false
      }, 4000)
    } catch (err: any) {
      console.error('Error seeding database:', err)
      alert(`Seeding failed: ${err?.message || err}`)
    } finally {
      isSeeding.value = false
    }
  }

  async function addProduct(product: Product) {
    if (db && isFirebaseConfigured) {
      const docRef = doc(db, 'products', product.id)
      await setDoc(docRef, product)
    } else {
      products.value.unshift(product)
    }
  }

  async function updateProduct(product: Product) {
    if (db && isFirebaseConfigured) {
      const docRef = doc(db, 'products', product.id)
      await setDoc(docRef, product, { merge: true })
    } else {
      const idx = products.value.findIndex(p => p.id === product.id)
      if (idx !== -1) {
        products.value[idx] = { ...product }
      }
    }
  }

  async function deleteProduct(id: string) {
    if (db && isFirebaseConfigured) {
      const docRef = doc(db, 'products', id)
      await deleteDoc(docRef)
    } else {
      products.value = products.value.filter(p => p.id !== id)
    }
  }

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
    }
  })

  return {
    products,
    isLoading,
    isLiveFirebase,
    isFirebaseConfigured,
    error,
    isSeeding,
    seedSuccess,
    init,
    seedDatabase,
    addProduct,
    updateProduct,
    deleteProduct
  }
}
