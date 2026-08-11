<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Product, ShirtCategory } from './types/product'
import { categories } from './data/products'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import ProductModal from './components/ProductModal.vue'
import HomeView from './views/HomeView.vue'
import CollectionView from './views/CollectionView.vue'
import DashboardView from './views/DashboardView.vue'
import { useProducts } from './composables/useProducts'

// ── Firebase Products Composable ──────────────────────────────────────────────
const {
  products,
  isLiveFirebase,
  isFirebaseConfigured,
  isSeeding,
  seedSuccess,
  init: initProducts,
  seedDatabase,
  addProduct,
  updateProduct,
  deleteProduct
} = useProducts()

// ── Navigation & Page Routing State ────────────────────────────────────────────
const activePage = ref<'home' | 'collection' | 'dashboard'>('collection')
const activeProduct = ref<Product | null>(null)
const homeCategory = ref<ShirtCategory>('All')

function syncPageFromUrl() {
  const path = window.location.pathname.toLowerCase()
  if (path.includes('dashboard') || window.location.hash === '#dashboard') {
    activePage.value = 'dashboard'
  } else if (path.includes('home') || window.location.hash === '#home') {
    activePage.value = 'home'
  } else {
    activePage.value = 'collection'
  }
}

onMounted(() => {
  initProducts()
  syncPageFromUrl()
  window.addEventListener('popstate', syncPageFromUrl)
})

onUnmounted(() => {
  window.removeEventListener('popstate', syncPageFromUrl)
})

// ── Home View Filtered Products ───────────────────────────────────────────────
const homeFilteredProducts = computed(() => {
  if (homeCategory.value === 'All') return products.value
  return products.value.filter(p => p.category === homeCategory.value)
})

// ── Handlers ──────────────────────────────────────────────────────────────────
function navigateTo(page: 'home' | 'collection' | 'dashboard') {
  activePage.value = page
  const targetPath = page === 'dashboard' ? '/dashboard' : page === 'home' ? '/home' : '/'
  if (window.location.pathname !== targetPath) {
    window.history.pushState({}, '', targetPath)
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function openProduct(p: Product) {
  activeProduct.value = p
  document.body.style.overflow = 'hidden'
}

function closeProduct() {
  activeProduct.value = null
  document.body.style.overflow = ''
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-soft-cream text-slate-deep">
    <!-- Header with page switcher & Firebase Status -->
    <AppHeader
      :active-page="activePage"
      :is-live-firebase="isLiveFirebase"
      :is-firebase-configured="isFirebaseConfigured"
      :is-seeding="isSeeding"
      :seed-success="seedSuccess"
      @navigate="navigateTo"
      @seed="seedDatabase"
    />

    <!-- Main Content -->
    <main class="flex-1">
      <!-- 1. Home View (Original First Page Layout) -->
      <HomeView
        v-if="activePage === 'home'"
        :products="products"
        :categories="categories"
        :active-category="homeCategory"
        :filtered-products="homeFilteredProducts"
        @change-category="homeCategory = $event"
        @open-product="openProduct"
        @go-to-collection="navigateTo('collection')"
      />

      <!-- 2. Collection View (New Etcetera-Style Catalog Page Layout in Brand Theme) -->
      <CollectionView
        v-else-if="activePage === 'collection'"
        :products="products"
        :categories="categories"
        @open-product="openProduct"
        @go-to-home="navigateTo('home')"
      />

      <!-- 3. Dashboard View (CRUD Product Management Page) -->
      <DashboardView
        v-else-if="activePage === 'dashboard'"
        :products="products"
        :is-live-firebase="isLiveFirebase"
        :is-firebase-configured="isFirebaseConfigured"
        :is-seeding="isSeeding"
        :seed-success="seedSuccess"
        @add-product="addProduct"
        @update-product="updateProduct"
        @delete-product="deleteProduct"
        @open-product="openProduct"
        @seed-database="seedDatabase"
      />
    </main>

    <!-- Footer -->
    <AppFooter />

    <!-- Product Detail Modal (Shared between pages) -->
    <ProductModal
      :product="activeProduct"
      @close="closeProduct"
    />
  </div>
</template>
