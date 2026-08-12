<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product, ShirtCategory, ShirtSize } from '../types/product'
import { categories } from '../data/products'
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Database,
  Eye,
  Check,
  X,
  Package,
  Layers,
  AlertTriangle,
  RefreshCw,
  ShieldCheck
} from '@lucide/vue'
import { useAuth } from '../composables/useAuth'

// ── Admin Auth ─────────────────────────────────────────────────────────────────
const { adminUser, logout } = useAuth()

const props = defineProps<{
  products: Product[]
  isLiveFirebase: boolean
  isFirebaseConfigured: boolean
  isSeeding: boolean
  seedSuccess: boolean
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'add-product', product: Product): void
  (e: 'update-product', product: Product): void
  (e: 'delete-product', id: string): void
  (e: 'open-product', product: Product): void
  (e: 'seed-database'): void
}>()

// ── Search & Filter State ─────────────────────────────────────────────────────
const searchQuery = ref('')
const selectedCategory = ref<ShirtCategory>('All')

const filteredProducts = computed(() => {
  return props.products.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCategory =
      selectedCategory.value === 'All' || p.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})

// ── Summary Metrics ───────────────────────────────────────────────────────────
const totalProducts = computed(() => props.products.length)
const inStockCount = computed(() => props.products.filter(p => p.inStock !== false).length)
const outOfStockCount = computed(() => props.products.filter(p => p.inStock === false).length)

// ── Modal State (Add / Edit) ──────────────────────────────────────────────────
const showFormModal = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)

const availableSizeOptions: ShirtSize[] = ['S', 'M', 'L', 'XL', 'XXL']
const categoryOptions: Exclude<ShirtCategory, 'All'>[] = [
  'Short Sleeve',
  'Flannel',
  'Linen',
  'Hawaiian',
  'Batik'
]

const formState = ref<{
  id: string
  title: string
  price: number
  originalPrice: number | null
  category: Exclude<ShirtCategory, 'All'>
  imagesText: string
  availableSizes: ShirtSize[]
  description: string
  inStock: boolean
  shopeeUrl: string
  tokopediaUrl: string
}>({
  id: '',
  title: '',
  price: 249000,
  originalPrice: null,
  category: 'Linen',
  imagesText: '',
  availableSizes: ['S', 'M', 'L', 'XL'],
  description: '',
  inStock: true,
  shopeeUrl: 'https://shopee.co.id',
  tokopediaUrl: 'https://tokopedia.com'
})

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount).replace('Rp', 'Rp ')
}

function openAddModal() {
  isEditing.value = false
  formState.value = {
    id: `wp-${String(Date.now()).slice(-4)}`,
    title: '',
    price: 249000,
    originalPrice: 349000,
    category: 'Linen',
    imagesText: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
    availableSizes: ['S', 'M', 'L', 'XL'],
    description: 'Wild Poise unisex apparel. Kemeja berkualitas premium dengan bahan adem dan nyaman.',
    inStock: true,
    shopeeUrl: 'https://shopee.co.id/search?keyword=wild%20poise',
    tokopediaUrl: 'https://www.tokopedia.com/search?q=wild%20poise'
  }
  showFormModal.value = true
}

function openEditModal(prod: Product) {
  isEditing.value = true
  formState.value = {
    id: prod.id,
    title: prod.title,
    price: prod.price,
    originalPrice: prod.originalPrice || null,
    category: prod.category,
    imagesText: prod.images.join('\n'),
    availableSizes: [...prod.availableSizes],
    description: prod.description,
    inStock: prod.inStock !== false,
    shopeeUrl: prod.shopeeUrl || '',
    tokopediaUrl: prod.tokopediaUrl || ''
  }
  showFormModal.value = true
}

function toggleSize(size: ShirtSize) {
  const index = formState.value.availableSizes.indexOf(size)
  if (index === -1) {
    formState.value.availableSizes.push(size)
  } else {
    formState.value.availableSizes.splice(index, 1)
  }
}

async function handleSaveProduct() {
  if (!formState.value.title.trim()) {
    alert('Please enter a product title.')
    return
  }

  isSubmitting.value = true

  const imageUrls = formState.value.imagesText
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0)

  if (imageUrls.length === 0) {
    imageUrls.push('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80')
  }

  const productData: Product = {
    id: formState.value.id || `wp-${Date.now()}`,
    title: formState.value.title,
    price: Number(formState.value.price),
    formattedPrice: formatRupiah(Number(formState.value.price)),
    category: formState.value.category,
    images: imageUrls,
    availableSizes: formState.value.availableSizes.length > 0 ? formState.value.availableSizes : ['M', 'L'],
    description: formState.value.description,
    inStock: formState.value.inStock,
    shopeeUrl: formState.value.shopeeUrl,
    tokopediaUrl: formState.value.tokopediaUrl
  }

  if (formState.value.originalPrice && formState.value.originalPrice > 0) {
    productData.originalPrice = Number(formState.value.originalPrice)
    productData.formattedOriginalPrice = formatRupiah(Number(formState.value.originalPrice))
  }

  try {
    if (isEditing.value) {
      emit('update-product', productData)
    } else {
      emit('add-product', productData)
    }
    showFormModal.value = false
  } catch (err: any) {
    alert(`Failed to save product: ${err?.message || err}`)
  } finally {
    isSubmitting.value = false
  }
}

// ── Delete Confirmation Modal State ───────────────────────────────────────────
const showDeleteModal = ref(false)
const productToDelete = ref<Product | null>(null)

function confirmDelete(prod: Product) {
  productToDelete.value = prod
  showDeleteModal.value = true
}

function handleDelete() {
  if (productToDelete.value) {
    emit('delete-product', productToDelete.value.id)
    showDeleteModal.value = false
    productToDelete.value = null
  }
}
</script>

<template>
  <div class="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">

    <!-- ── DASHBOARD CONTENT ─────────────────────────────────────────────────── -->
    <!-- Header Title & Actions -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-grey/20 pb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-deep text-warm-sand flex items-center gap-1.5">
            <ShieldCheck class="h-3 w-3" />
            Admin Workspace
          </span>
          <span
            class="px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 border"
            :class="isLiveFirebase ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30' : 'bg-amber-500/10 text-amber-800 border-amber-500/30'"
          >
            <span class="h-1.5 w-1.5 rounded-full" :class="isLiveFirebase ? 'bg-emerald-500' : 'bg-amber-500'"></span>
            {{ isLiveFirebase ? 'Firestore Connected' : 'Local Fallback' }}
          </span>
        </div>
        <h1 class="font-display text-3xl font-extrabold text-slate-deep tracking-tight">
          Product Management Dashboard
        </h1>
        <p class="text-xs text-slate-grey mt-1">
          Signed in as
          <span class="font-semibold text-slate-deep">
            {{ adminUser?.email ?? 'Admin' }}
          </span>
          · <button @click="logout" class="text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors">Sign out</button>
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="emit('seed-database')"
          :disabled="isSeeding"
          class="btn-secondary text-xs flex items-center gap-2 py-2 px-4 rounded-xl border border-slate-grey/30 shadow-xs hover:bg-warm-sand/30 transition-all disabled:opacity-50"
        >
          <RefreshCw v-if="isSeeding" class="h-4 w-4 animate-spin text-amber-600" />
          <Check v-else-if="seedSuccess" class="h-4 w-4 text-emerald-600" />
          <Database v-else class="h-4 w-4 text-amber-700" />
          <span>{{ isSeeding ? 'Seeding...' : seedSuccess ? 'Seeded!' : 'Reset/Seed Defaults' }}</span>
        </button>

        <button
          @click="openAddModal"
          class="btn-primary text-xs font-bold flex items-center gap-2 py-2.5 px-5 rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus class="h-4 w-4" />
          Add New Product
        </button>
      </div>
    </div>

    <!-- Summary Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-slate-grey/20 shadow-xs flex items-center gap-4">
        <div class="h-12 w-12 rounded-xl bg-slate-deep/5 flex items-center justify-center text-slate-deep">
          <Package class="h-6 w-6" />
        </div>
        <div>
          <p class="text-xs text-slate-grey uppercase font-bold tracking-wider">Total Products</p>
          <p class="text-2xl font-black text-slate-deep font-display">{{ totalProducts }}</p>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-grey/20 shadow-xs flex items-center gap-4">
        <div class="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <Check class="h-6 w-6" />
        </div>
        <div>
          <p class="text-xs text-slate-grey uppercase font-bold tracking-wider">In Stock</p>
          <p class="text-2xl font-black text-emerald-700 font-display">{{ inStockCount }}</p>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-grey/20 shadow-xs flex items-center gap-4">
        <div class="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
          <AlertTriangle class="h-6 w-6" />
        </div>
        <div>
          <p class="text-xs text-slate-grey uppercase font-bold tracking-wider">Out of Stock</p>
          <p class="text-2xl font-black text-amber-800 font-display">{{ outOfStockCount }}</p>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-grey/20 shadow-xs flex items-center gap-4">
        <div class="h-12 w-12 rounded-xl bg-warm-sand/40 flex items-center justify-center text-slate-deep">
          <Layers class="h-6 w-6" />
        </div>
        <div>
          <p class="text-xs text-slate-grey uppercase font-bold tracking-wider">Categories</p>
          <p class="text-2xl font-black text-slate-deep font-display">{{ categoryOptions.length }}</p>
        </div>
      </div>
    </div>

    <!-- Controls Bar: Search & Category Filter -->
    <div class="bg-white p-4 rounded-2xl border border-slate-grey/20 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Search Input -->
      <div class="relative w-full sm:w-80">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-grey" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search product title, ID..."
          class="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-grey/30 bg-soft-cream/30 focus:outline-none focus:ring-2 focus:ring-slate-deep/40 transition-all"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-grey hover:text-slate-deep"
        >
          <X class="h-3.5 w-3.5" />
        </button>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0"
          :class="selectedCategory === cat ? 'bg-slate-deep text-soft-cream font-bold shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Product Data Table -->
    <div class="bg-white rounded-2xl border border-slate-grey/20 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-deep">
          <thead class="bg-slate-100/80 text-slate-grey font-bold uppercase tracking-wider border-b border-slate-grey/20 text-[11px]">
            <tr>
              <th scope="col" class="px-6 py-4">Product</th>
              <th scope="col" class="px-4 py-4">Category</th>
              <th scope="col" class="px-4 py-4">Price</th>
              <th scope="col" class="px-4 py-4">Status</th>
              <th scope="col" class="px-4 py-4">Sizes</th>
              <th scope="col" class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-grey/10 font-medium">
            <!-- Loading Skeletal Table Rows -->
            <template v-if="isLoading">
              <tr v-for="i in 5" :key="i" class="animate-pulse">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="h-12 w-12 rounded-xl bg-slate-200 shrink-0"></div>
                    <div class="space-y-1.5 flex-1">
                      <div class="h-4 bg-slate-200 rounded w-44"></div>
                      <div class="h-3 bg-slate-100 rounded w-20"></div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="h-6 w-20 bg-slate-200 rounded-md"></div>
                </td>
                <td class="px-4 py-4">
                  <div class="h-4 w-24 bg-slate-200 rounded"></div>
                </td>
                <td class="px-4 py-4">
                  <div class="h-6 w-20 bg-slate-200 rounded-full"></div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex gap-1">
                    <div class="h-4 w-6 bg-slate-200 rounded"></div>
                    <div class="h-4 w-6 bg-slate-200 rounded"></div>
                    <div class="h-4 w-6 bg-slate-200 rounded"></div>
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-2">
                    <div class="h-8 w-8 bg-slate-200 rounded-lg"></div>
                    <div class="h-8 w-8 bg-slate-200 rounded-lg"></div>
                    <div class="h-8 w-8 bg-slate-200 rounded-lg"></div>
                  </div>
                </td>
              </tr>
            </template>

            <!-- Empty Filter State -->
            <tr v-else-if="filteredProducts.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-slate-grey">
                <Package class="h-10 w-10 mx-auto mb-2 text-slate-300" />
                <p class="font-bold text-slate-deep">No products found</p>
                <p class="text-xs mt-0.5">Try adjusting your search query or category filter.</p>
              </td>
            </tr>

            <!-- Product Rows -->
            <tr
              v-else
              v-for="prod in filteredProducts"
              :key="prod.id"
              class="hover:bg-soft-cream/40 transition-colors group"
            >
              <!-- Image & Title -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-12 w-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-grey/20 shadow-xs">
                    <img
                      :src="prod.images[0]"
                      :alt="prod.title"
                      class="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-deep text-sm line-clamp-1">
                      {{ prod.title }}
                    </h4>
                    <span class="text-[11px] font-mono text-slate-grey">
                      ID: {{ prod.id }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Category -->
              <td class="px-4 py-4">
                <span class="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-warm-sand/30 text-slate-800 border border-warm-sand/50">
                  {{ prod.category }}
                </span>
              </td>

              <!-- Price -->
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="font-bold text-slate-deep text-sm">
                  {{ prod.formattedPrice || formatRupiah(prod.price) }}
                </div>
                <div v-if="prod.originalPrice" class="text-[11px] text-slate-grey line-through">
                  {{ prod.formattedOriginalPrice || formatRupiah(prod.originalPrice) }}
                </div>
              </td>

              <!-- Stock Status Badge -->
              <td class="px-4 py-4">
                <span
                  class="px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5"
                  :class="prod.inStock !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="prod.inStock !== false ? 'bg-emerald-500' : 'bg-red-500'"></span>
                  {{ prod.inStock !== false ? 'In Stock' : 'Out of Stock' }}
                </span>
              </td>

              <!-- Sizes -->
              <td class="px-4 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="s in prod.availableSizes"
                    :key="s"
                    class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {{ s }}
                  </span>
                </div>
              </td>

              <!-- Action Buttons -->
              <td class="px-6 py-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    @click="emit('open-product', prod)"
                    class="p-2 rounded-lg text-slate-grey hover:text-slate-deep hover:bg-warm-sand/30 transition-all"
                    title="Preview Product Modal"
                  >
                    <Eye class="h-4 w-4" />
                  </button>

                  <button
                    @click="openEditModal(prod)"
                    class="p-2 rounded-lg text-slate-grey hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                    title="Edit Product"
                  >
                    <Edit2 class="h-4 w-4" />
                  </button>

                  <button
                    @click="confirmDelete(prod)"
                    class="p-2 rounded-lg text-slate-grey hover:text-red-600 hover:bg-red-50 transition-all"
                    title="Delete Product"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create & Edit Product Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-grey/20 shadow-2xl relative my-8 text-slate-deep">
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-slate-grey/20 pb-4 mb-6">
            <div>
              <h3 class="font-display font-bold text-xl text-slate-deep">
                {{ isEditing ? 'Edit Product' : 'Add New Product' }}
              </h3>
              <p class="text-xs text-slate-grey">
                {{ isEditing ? `Updating product ID: ${formState.id}` : 'Fill in product details for the catalog' }}
              </p>
            </div>
            <button
              @click="showFormModal = false"
              class="p-2 rounded-xl text-slate-grey hover:text-slate-deep hover:bg-slate-100 transition-colors"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Form Body -->
          <form @submit.prevent="handleSaveProduct" class="space-y-5 text-xs">
            <!-- Row 1: Title & Category -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-deep mb-1">Product Title *</label>
                <input
                  v-model="formState.title"
                  type="text"
                  required
                  placeholder="e.g. Wild Poise Linen Cuban Shirt"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-grey/30 bg-soft-cream/20 focus:outline-none focus:ring-2 focus:ring-slate-deep/40 font-medium"
                />
              </div>

              <div>
                <label class="block font-bold text-slate-deep mb-1">Category *</label>
                <select
                  v-model="formState.category"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-grey/30 bg-soft-cream/20 focus:outline-none focus:ring-2 focus:ring-slate-deep/40 font-medium"
                >
                  <option v-for="cat in categoryOptions" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Row 2: Price & Original Price -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-deep mb-1">Price (IDR) *</label>
                <input
                  v-model.number="formState.price"
                  type="number"
                  required
                  min="0"
                  step="1000"
                  placeholder="249000"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-grey/30 bg-soft-cream/20 focus:outline-none focus:ring-2 focus:ring-slate-deep/40 font-medium"
                />
                <span class="text-[11px] text-slate-grey mt-0.5 block">
                  Preview: {{ formatRupiah(formState.price || 0) }}
                </span>
              </div>

              <div>
                <label class="block font-bold text-slate-deep mb-1">Original Price (IDR optional)</label>
                <input
                  v-model.number="formState.originalPrice"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="359000"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-grey/30 bg-soft-cream/20 focus:outline-none focus:ring-2 focus:ring-slate-deep/40 font-medium"
                />
                <span v-if="formState.originalPrice" class="text-[11px] text-slate-grey mt-0.5 block line-through">
                  Preview: {{ formatRupiah(formState.originalPrice) }}
                </span>
              </div>
            </div>

            <!-- Row 3: Stock Status & Sizes -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label class="block font-bold text-slate-deep mb-2">Availability Status</label>
                <label class="inline-flex items-center cursor-pointer gap-3">
                  <input
                    v-model="formState.inStock"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 relative"></div>
                  <span class="font-bold" :class="formState.inStock ? 'text-emerald-700' : 'text-slate-400'">
                    {{ formState.inStock ? 'In Stock' : 'Out of Stock' }}
                  </span>
                </label>
              </div>

              <div>
                <label class="block font-bold text-slate-deep mb-1.5">Available Sizes</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="size in availableSizeOptions"
                    :key="size"
                    type="button"
                    @click="toggleSize(size)"
                    class="px-3 py-1.5 rounded-lg font-bold border transition-all text-xs"
                    :class="formState.availableSizes.includes(size) ? 'bg-slate-deep text-warm-sand border-slate-deep shadow-xs' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Image URLs (Multi-line) -->
            <div>
              <label class="block font-bold text-slate-deep mb-1">
                Image URLs (One URL per line)
              </label>
              <textarea
                v-model="formState.imagesText"
                rows="3"
                placeholder="https://images.unsplash.com/photo-1596755094514-f87e34085b2c"
                class="w-full px-3.5 py-2 rounded-xl border border-slate-grey/30 bg-soft-cream/20 focus:outline-none focus:ring-2 focus:ring-slate-deep/40 font-mono text-[11px]"
              ></textarea>
            </div>

            <!-- Description -->
            <div>
              <label class="block font-bold text-slate-deep mb-1">Product Description</label>
              <textarea
                v-model="formState.description"
                rows="3"
                required
                placeholder="Product material, fit details, care instructions..."
                class="w-full px-3.5 py-2 rounded-xl border border-slate-grey/30 bg-soft-cream/20 focus:outline-none focus:ring-2 focus:ring-slate-deep/40 font-medium"
              ></textarea>
            </div>

            <!-- Modal Action Buttons -->
            <div class="pt-4 border-t border-slate-grey/20 flex items-center justify-end gap-3">
              <button
                type="button"
                @click="showFormModal = false"
                class="px-5 py-2.5 rounded-xl border border-slate-grey/30 text-slate-grey font-bold hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="btn-primary px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                <RefreshCw v-if="isSubmitting" class="h-4 w-4 animate-spin" />
                <Check v-else class="h-4 w-4" />
                <span>{{ isEditing ? 'Update Product' : 'Create Product' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-grey/20 shadow-2xl text-slate-deep space-y-4">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle class="h-5 w-5" />
            </div>
            <div>
              <h4 class="font-display font-bold text-lg">Delete Product</h4>
              <p class="text-xs text-slate-grey">This action cannot be undone.</p>
            </div>
          </div>

          <div v-if="productToDelete" class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 text-xs">
            <img :src="productToDelete.images[0]" class="h-10 w-10 object-cover rounded-lg" />
            <div>
              <p class="font-bold text-slate-deep">{{ productToDelete.title }}</p>
              <p class="text-[11px] text-slate-grey">ID: {{ productToDelete.id }}</p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 rounded-xl border border-slate-grey/30 text-xs font-bold text-slate-grey hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
            >
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </Transition>


  </div>
</template>
