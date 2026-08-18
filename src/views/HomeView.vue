<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { Product, ShirtCategory } from "../types/product";
import ProductCard from "../components/ProductCard.vue";
import ProductSkeleton from "../components/ProductSkeleton.vue";
import CategoryFilter from "../components/CategoryFilter.vue";
import {
  ShoppingBag,
  TrendingUp,
  Truck,
  RotateCcw,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "@lucide/vue";

const props = defineProps<{
  products: Product[];
  categories: readonly ShirtCategory[];
  activeCategory: ShirtCategory;
  filteredProducts: Product[];
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: "change-category", cat: ShirtCategory): void;
  (e: "open-product", product: Product): void;
  (e: "go-to-collection"): void;
}>();

interface HeroSlide {
  id: number;
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  tag: string;
  image: string;
  primaryCtaText: string;
  primaryCtaAction: "collection" | "category";
  categoryFilter?: ShirtCategory;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    badge: "Wild Poise Collection 2025",
    titlePrefix: "Wild Poise",
    titleHighlight: "Unisex Apparel",
    subtitle:
      "Kemeja kasual unisex berdesain modern, adem, dan versatile. Pilih gaya Anda, pesan langsung via Shopee, Tokopedia, atau WhatsApp.",
    tag: "NEW ARRIVALS",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1600&auto=format&fit=crop&q=80",
    primaryCtaText: "Explore Collection",
    primaryCtaAction: "collection",
    secondaryCtaText: "Chat via WhatsApp",
    secondaryCtaUrl: "https://wa.me/6287761561909",
  },
  {
    id: 2,
    badge: "Premium Cuban Linen",
    titlePrefix: "Resort Comfort",
    titleHighlight: "Urban Elegance",
    subtitle:
      "Bahan linen premium berpori tinggi yang dingin dan adem di iklim tropis. Hadir dengan siluet relaxed fit yang timeless dan Effortless Chic.",
    tag: "BEST SELLER",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1600&auto=format&fit=crop&q=80",
    primaryCtaText: "Shop Linen Shirts",
    primaryCtaAction: "category",
    categoryFilter: "Linen",
    secondaryCtaText: "View All Products",
    secondaryCtaUrl: "#catalog",
  },
  {
    id: 3,
    badge: "Vintage Flannel Series",
    titlePrefix: "Classic Plaid",
    titleHighlight: "Statement Layering",
    subtitle:
      "Sentuhan motif vintage khas Wild Poise dengan katun flannel super lembut. Sangat pas dipakai sebagai kemeja utama maupun overshirt.",
    tag: "POPULAR CATEGORY",
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1600&auto=format&fit=crop&q=80",
    primaryCtaText: "Explore Flannels",
    primaryCtaAction: "category",
    categoryFilter: "Flannel",
    secondaryCtaText: "Full Catalog",
    secondaryCtaUrl: "#catalog",
  },
  {
    id: 4,
    badge: "Heritage & Tropical Fusion",
    titlePrefix: "Botanical &",
    titleHighlight: "Modern Batik",
    subtitle:
      "Perpaduan corak tropis Botanical yang fresh dan warisan batik modern kontemporer untuk gaya kasual yang berkarakter.",
    tag: "LIMITED EDITION",
    image:
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=1600&auto=format&fit=crop&q=80",
    primaryCtaText: "Shop Hawaiian & Batik",
    primaryCtaAction: "category",
    categoryFilter: "Hawaiian",
    secondaryCtaText: "Order via WhatsApp",
    secondaryCtaUrl: "https://wa.me/6287761561909",
  },
];

const currentSlide = ref(0);
const activeSlide = computed(() => slides[currentSlide.value] ?? slides[0]);
const isPaused = ref(false);
let autoplayInterval: ReturnType<typeof setInterval> | null = null;

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
}

function goToSlide(index: number) {
  currentSlide.value = index;
}

function startAutoplay() {
  stopAutoplay();
  autoplayInterval = setInterval(() => {
    if (!isPaused.value) {
      nextSlide();
    }
  }, 5000);
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}

function handlePrimaryCta(slide: HeroSlide) {
  if (slide.primaryCtaAction === "category" && slide.categoryFilter) {
    emit("change-category", slide.categoryFilter);
    const catalogEl = document.getElementById("catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  } else {
    emit("go-to-collection");
  }
}

// Mouse & Touch Dragging State for Carousel
const isDragging = ref(false);
const dragStartX = ref(0);
const dragOffset = ref(0);

function handleDragStart(clientX: number) {
  isDragging.value = true;
  dragStartX.value = clientX;
  dragOffset.value = 0;
  isPaused.value = true;
}

function handleDragMove(clientX: number) {
  if (!isDragging.value) return;
  dragOffset.value = clientX - dragStartX.value;
}

function handleDragEnd() {
  if (!isDragging.value) return;
  const threshold = 40;
  if (dragOffset.value < -threshold) {
    nextSlide();
  } else if (dragOffset.value > threshold) {
    prevSlide();
  }
  isDragging.value = false;
  dragOffset.value = 0;
  isPaused.value = false;
}

// Mouse Event Handlers
function onMouseDown(e: MouseEvent) {
  const target = e.target as HTMLElement | null;
  if (target && (target.closest("button") || target.closest("a"))) return;
  handleDragStart(e.clientX);
}

function onMouseMove(e: MouseEvent) {
  handleDragMove(e.clientX);
}

function onMouseUp() {
  handleDragEnd();
}

function onMouseLeave() {
  if (isDragging.value) {
    handleDragEnd();
  }
  isPaused.value = false;
}

// Touch Event Handlers
function onTouchStart(e: TouchEvent) {
  const target = e.target as HTMLElement | null;
  if (target && (target.closest("button") || target.closest("a"))) return;
  if (e.touches.length > 0) {
    handleDragStart(e.touches[0].clientX);
  }
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length > 0) {
    handleDragMove(e.touches[0].clientX);
  }
}

function onTouchEnd() {
  handleDragEnd();
}

onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<template>
  <div>
    <!-- ── Full Device-Height Hero Carousel Section ─────────────────────── -->
    <section
      class="relative overflow-hidden bg-slate-deep text-soft-cream h-[calc(100vh-4rem)] min-h-[600px] flex flex-col justify-between select-none cursor-grab active:cursor-grabbing transition-cursor duration-150"
      :class="{ 'cursor-grabbing': isDragging }"
      @mouseenter="isPaused = true"
      @mouseleave="onMouseLeave"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend.passive="onTouchEnd"
    >
      <!-- Background Image & Overlay Carousel -->
      <div class="absolute inset-0 pointer-events-none">
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="absolute inset-0 transition-opacity duration-700 ease-in-out"
          :class="index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'"
        >
          <img
            :src="slide.image"
            :alt="slide.titlePrefix"
            class="h-full w-full object-cover object-center transform transition-transform duration-10000 scale-105"
            draggable="false"
          />
          <!-- Dark gradient overlays for readability -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/75 to-slate-900/40"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-slate-deep via-transparent to-slate-deep/40"
          />
        </div>

        <!-- Ambient decorative blobs -->
        <div
          class="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-warm-sand/15 blur-3xl pointer-events-none z-20"
        />
        <div
          class="absolute bottom-12 -left-16 h-64 w-64 rounded-full bg-slate-grey/15 blur-3xl pointer-events-none z-20"
        />
      </div>

      <!-- Carousel Slide Main Content -->
      <div
        class="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full my-auto py-8 transition-transform duration-75 ease-out"
        :style="{ transform: isDragging ? `translateX(${dragOffset}px)` : 'translateX(0px)' }"
      >
        <div class="max-w-2xl">
          <Transition name="slide-fade" mode="out-in">
            <div :key="currentSlide" class="space-y-4">
              <!-- Tag & Badge -->
              <div class="flex items-center gap-3 flex-wrap">
                <span
                  class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-warm-sand text-slate-deep shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles class="h-3.5 w-3.5" />
                  {{ activeSlide.tag }}
                </span>
                <span
                  class="text-xs font-semibold text-warm-sand/90 tracking-wide uppercase border-l border-warm-sand/30 pl-3"
                >
                  {{ activeSlide.badge }}
                </span>
              </div>

              <!-- Main Heading -->
              <h1
                class="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.15] text-soft-cream tracking-tight"
              >
                {{ activeSlide.titlePrefix }}<br />
                <span class="text-warm-sand drop-shadow-xs">{{
                  activeSlide.titleHighlight
                }}</span>
              </h1>

              <!-- Subtitle -->
              <p
                class="text-slate-grey/90 text-base sm:text-lg leading-relaxed max-w-xl font-normal"
              >
                {{ activeSlide.subtitle }}
              </p>

              <!-- Action Buttons -->
              <div class="pt-3 flex flex-wrap gap-4 items-center">
                <button
                  @click="handlePrimaryCta(activeSlide)"
                  class="btn-primary bg-warm-sand text-slate-deep hover:bg-warm-sand/90 px-7 py-3.5 text-sm sm:text-base font-bold shadow-xl flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 group rounded-xl"
                >
                  {{ activeSlide.primaryCtaText }}
                  <ArrowRight
                    class="h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                </button>

                <a
                  v-if="activeSlide.secondaryCtaUrl"
                  :href="activeSlide.secondaryCtaUrl"
                  :target="
                    activeSlide.secondaryCtaUrl.startsWith('http')
                      ? '_blank'
                      : '_self'
                  "
                  rel="noopener noreferrer"
                  class="btn-outline border-soft-cream/30 text-soft-cream hover:bg-soft-cream/10 hover:border-soft-cream px-6 py-3.5 text-sm sm:text-base font-semibold rounded-xl backdrop-blur-xs transition-all"
                >
                  {{ activeSlide.secondaryCtaText }}
                </a>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Carousel Navigation Controls & Indicators -->
      <div
        class="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pb-6 flex items-center justify-between gap-4"
      >
        <!-- Arrow Buttons & Dot Indicators -->
        <div class="flex items-center gap-4">
          <button
            @click="prevSlide"
            class="h-10 w-10 rounded-full bg-slate-900/60 hover:bg-warm-sand hover:text-slate-deep text-soft-cream border border-slate-700/60 backdrop-blur-md flex items-center justify-center transition-all shadow-md focus:outline-none"
            aria-label="Previous Slide"
          >
            <ChevronLeft class="h-5 w-5" />
          </button>

          <div class="flex items-center gap-2">
            <button
              v-for="(_, i) in slides"
              :key="i"
              @click="goToSlide(i)"
              class="h-2.5 rounded-full transition-all duration-300 focus:outline-none"
              :class="
                i === currentSlide
                  ? 'w-8 bg-warm-sand'
                  : 'w-2.5 bg-slate-600/70 hover:bg-slate-400'
              "
              :aria-label="`Go to slide ${i + 1}`"
            />
          </div>

          <button
            @click="nextSlide"
            class="h-10 w-10 rounded-full bg-slate-900/60 hover:bg-warm-sand hover:text-slate-deep text-soft-cream border border-slate-700/60 backdrop-blur-md flex items-center justify-center transition-all shadow-md focus:outline-none"
            aria-label="Next Slide"
          >
            <ChevronRight class="h-5 w-5" />
          </button>
        </div>

        <!-- Counter & Autoplay State -->
        <div
          class="hidden sm:flex items-center gap-3 text-xs font-mono tracking-wider text-slate-grey"
        >
          <span>0{{ currentSlide + 1 }} / 0{{ slides.length }}</span>
          <span class="h-1 w-1 rounded-full bg-slate-grey/50" />
          <span
            class="text-[11px] font-sans font-medium text-warm-sand/80 uppercase"
          >
            {{ isPaused ? "Paused" : "Autoplay" }}
          </span>
        </div>
      </div>

      <!-- Feature Strip integrated into bottom of Hero section -->
      <div
        class="relative z-20 border-t border-slate-grey/20 bg-slate-deep/90 backdrop-blur-md"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div class="flex items-center gap-3 text-slate-grey">
              <Truck class="h-5 w-5 flex-shrink-0 text-warm-sand" />
              <span class="text-xs sm:text-sm font-medium"
                >Free shipping &gt; Rp 300K</span
              >
            </div>
            <div class="flex items-center gap-3 text-slate-grey">
              <RotateCcw class="h-5 w-5 flex-shrink-0 text-warm-sand" />
              <span class="text-xs sm:text-sm font-medium"
                >7-day free return</span
              >
            </div>
            <div class="hidden sm:flex items-center gap-3 text-slate-grey">
              <TrendingUp class="h-5 w-5 flex-shrink-0 text-warm-sand" />
              <span class="text-xs sm:text-sm font-medium"
                >1,200+ happy customers</span
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Featured Products Grid ───────────────────────────────────────── -->
    <section
      id="catalog"
      class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
      >
        <div>
          <h2 class="section-title text-3xl sm:text-4xl mb-1">
            Featured Shirts
          </h2>
          <p class="text-slate-grey text-sm">
            Showing {{ filteredProducts.length }} product{{
              filteredProducts.length !== 1 ? "s" : ""
            }}
          </p>
        </div>
        <CategoryFilter
          :categories="categories"
          :active="activeCategory"
          @change="emit('change-category', $event)"
        />
      </div>

      <!-- Loading state (Skeletal Grid) -->
      <div
        v-if="isLoading"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <ProductSkeleton v-for="i in 8" :key="i" />
      </div>

      <!-- Empty state -->
      <div
        v-else-if="filteredProducts.length === 0"
        class="flex flex-col items-center justify-center py-24 text-center"
      >
        <ShoppingBag class="h-12 w-12 text-slate-grey/40 mb-4" />
        <h3 class="font-display font-semibold text-slate-deep text-lg mb-2">
          No products found
        </h3>
        <p class="text-slate-grey text-sm max-w-sm">
          No shirts found in this category.
        </p>
      </div>

      <!-- Product Grid -->
      <TransitionGroup
        v-else
        name="grid"
        tag="div"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @open="emit('open-product', $event)"
        />
      </TransitionGroup>

      <!-- View Full Catalog CTA banner -->
      <div class="mt-14 text-center pt-8 border-t border-slate-grey/20">
        <button
          @click="emit('go-to-collection')"
          class="btn-primary bg-slate-deep text-soft-cream hover:bg-slate-deep/90 px-8 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2 shadow-md transition-all hover:scale-105"
        >
          View Full Catalog & Filters
          <ArrowRight class="h-4 w-4" />
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.grid-move,
.grid-enter-active,
.grid-leave-active {
  transition: all 0.35s ease;
}
.grid-enter-from,
.grid-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}
.grid-leave-active {
  position: absolute;
}
</style>
