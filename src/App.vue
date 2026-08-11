<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Product, ShirtCategory } from './types/product'
import { categories } from './data/products'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import ProductModal from './components/ProductModal.vue'
import HomeView from './views/HomeView.vue'
import CollectionView from './views/CollectionView.vue'
import DashboardView from './views/DashboardView.vue'
import LoginView from './views/LoginView.vue'
import { useProducts } from './composables/useProducts'
import { useAuth } from './composables/useAuth'

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

const { isAdmin } = useAuth()

// ── Navigation & Page Routing State ────────────────────────────────────────────
const activePage = ref<'home' | 'collection' | 'dashboard' | 'login'>('collection')
const activeProduct = ref<Product | null>(null)
const homeCategory = ref<ShirtCategory>('All')

function syncPageFromUrl() {
  const path = window.location.pathname.toLowerCase()
  if (path.includes('dashboard')) {
    if (isAdmin.value) {
      activePage.value = 'dashboard'
    } else {
      activePage.value = 'login'
      window.history.replaceState({}, '', '/login')
    }
  } else if (path.includes('login')) {
    if (isAdmin.value) {
      activePage.value = 'dashboard'
      window.history.replaceState({}, '', '/dashboard')
    } else {
      activePage.value = 'login'
    }
  } else if (path.includes('home')) {
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
  // Guard dashboard: redirect to login if not admin
  if (page === 'dashboard' && !isAdmin.value) {
    activePage.value = 'login'
    window.history.pushState({}, '', '/login')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  activePage.value = page
  const targetPath = page === 'dashboard' ? '/dashboard' : page === 'home' ? '/home' : '/'
  if (window.location.pathname !== targetPath) {
    window.history.pushState({}, '', targetPath)
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onAuthenticated() {
  // After login, go to dashboard
  activePage.value = 'dashboard'
  window.history.pushState({}, '', '/dashboard')
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
  <!-- Login page renders standalone (no header/footer) -->
  <LoginView
    v-if="activePage === 'login'"
    @authenticated="onAuthenticated"
  />

  <!-- Main app shell for all other pages -->
  <div v-else class="min-h-screen flex flex-col bg-soft-cream text-slate-deep">
    <!-- Header -->
    <AppHeader
      :active-page="activePage as 'home' | 'collection' | 'dashboard'"
      :is-live-firebase="isLiveFirebase"
      :is-firebase-configured="isFirebaseConfigured"
      :is-seeding="isSeeding"
      :seed-success="seedSuccess"
      @navigate="navigateTo"
      @seed="seedDatabase"
    />

    <!-- Main Content -->
    <main class="flex-1">
      <!-- 1. Home View -->
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

      <!-- 2. Collection View -->
      <CollectionView
        v-else-if="activePage === 'collection'"
        :products="products"
        :categories="categories"
        @open-product="openProduct"
        @go-to-home="navigateTo('home')"
      />

      <!-- 3. Dashboard View (only shown when authenticated) -->
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
