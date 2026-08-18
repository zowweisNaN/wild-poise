import { ref, computed, onUnmounted } from 'vue'
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  type Unsubscribe
} from 'firebase/firestore'
import type { CategoryItem } from '../types/product'
import { db, isFirebaseConfigured } from '../firebase'

export const defaultCategories: CategoryItem[] = [
  { id: 'cat-short-sleeve', name: 'Short Sleeve', description: 'Essential short sleeve casual shirts' },
  { id: 'cat-flannel', name: 'Flannel', description: 'Vintage soft cotton flannel shirts' },
  { id: 'cat-linen', name: 'Linen', description: 'Breathable resort cuban linen shirts' },
  { id: 'cat-hawaiian', name: 'Hawaiian', description: 'Tropical botanical printed resort shirts' },
  { id: 'cat-batik', name: 'Batik', description: 'Modern heritage batik shirts' }
]

const categoryList = ref<CategoryItem[]>([...defaultCategories])
const isLoadingCategories = ref(true)
let unsubscribe: Unsubscribe | null = null

export function useCategories() {
  function initCategories() {
    if (db && isFirebaseConfigured) {
      isLoadingCategories.value = true
      try {
        const colRef = collection(db, 'categories')
        unsubscribe = onSnapshot(
          colRef,
          (snapshot) => {
            if (snapshot.empty) {
              // Auto-seed default categories into Firestore if empty
              seedCategories()
              categoryList.value = [...defaultCategories]
            } else {
              categoryList.value = snapshot.docs.map((docSnap) => {
                const data = docSnap.data()
                return {
                  id: docSnap.id,
                  name: data.name || docSnap.id,
                  description: data.description || ''
                }
              })
            }
            isLoadingCategories.value = false
          },
          (err) => {
            console.warn('Categories Firestore subscription error:', err)
            categoryList.value = [...defaultCategories]
            isLoadingCategories.value = false
          }
        )
      } catch (err) {
        console.warn('Failed to initialize Firestore categories:', err)
        categoryList.value = [...defaultCategories]
        isLoadingCategories.value = false
      }
    } else {
      categoryList.value = [...defaultCategories]
      isLoadingCategories.value = false
    }
  }

  async function seedCategories() {
    if (!db || !isFirebaseConfigured) return
    try {
      for (const cat of defaultCategories) {
        const docRef = doc(db, 'categories', cat.id)
        await setDoc(docRef, { name: cat.name, description: cat.description }, { merge: true })
      }
    } catch (err) {
      console.warn('Error seeding categories:', err)
    }
  }

  const categoryNames = computed(() => {
    return ['All', ...categoryList.value.map(c => c.name)]
  })

  const rawCategoryNames = computed(() => {
    return categoryList.value.map(c => c.name)
  })

  async function addCategory(name: string, description: string = ''): Promise<CategoryItem> {
    const trimmedName = name.trim()
    if (!trimmedName) throw new Error('Category name cannot be empty.')

    const exists = categoryList.value.some(c => c.name.toLowerCase() === trimmedName.toLowerCase())
    if (exists) throw new Error(`Category "${trimmedName}" already exists.`)

    const id = `cat-${Date.now().toString(36)}`
    const newCategory: CategoryItem = { id, name: trimmedName, description: description.trim() }

    if (db && isFirebaseConfigured) {
      const docRef = doc(db, 'categories', id)
      await setDoc(docRef, { name: trimmedName, description: description.trim() })
    } else {
      categoryList.value.push(newCategory)
    }

    return newCategory
  }

  async function updateCategory(id: string, newName: string, newDescription: string = ''): Promise<{ oldName: string; newName: string }> {
    const trimmedName = newName.trim()
    if (!trimmedName) throw new Error('Category name cannot be empty.')

    const catIndex = categoryList.value.findIndex(c => c.id === id)
    if (catIndex === -1) throw new Error('Category not found.')

    const oldName = categoryList.value[catIndex].name

    // Check duplicate name on other categories
    const duplicate = categoryList.value.some(c => c.id !== id && c.name.toLowerCase() === trimmedName.toLowerCase())
    if (duplicate) throw new Error(`Category "${trimmedName}" already exists.`)

    if (db && isFirebaseConfigured) {
      const docRef = doc(db, 'categories', id)
      await setDoc(docRef, { name: trimmedName, description: newDescription.trim() }, { merge: true })
    } else {
      categoryList.value[catIndex] = { id, name: trimmedName, description: newDescription.trim() }
    }

    return { oldName, newName: trimmedName }
  }

  async function deleteCategory(id: string): Promise<string> {
    const catIndex = categoryList.value.findIndex(c => c.id === id)
    if (catIndex === -1) throw new Error('Category not found.')

    const deletedName = categoryList.value[catIndex].name

    if (db && isFirebaseConfigured) {
      const docRef = doc(db, 'categories', id)
      await deleteDoc(docRef)
    } else {
      categoryList.value.splice(catIndex, 1)
    }

    return deletedName
  }

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
    }
  })

  return {
    categoryList,
    categoryNames,
    rawCategoryNames,
    isLoadingCategories,
    initCategories,
    addCategory,
    updateCategory,
    deleteCategory
  }
}
