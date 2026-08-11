import { ref } from 'vue'
import type { Product } from '../types/product'
import type { ShirtSize } from '../types/product'

export function useCheckout(product: Product) {
  const selectedSize = ref<ShirtSize | null>(null)

  function selectSize(size: ShirtSize) {
    selectedSize.value = size
  }

  function openShopee() {
    window.open(product.shopeeUrl, '_blank', 'noopener,noreferrer')
  }

  function openTokopedia() {
    window.open(product.tokopediaUrl, '_blank', 'noopener,noreferrer')
  }

  function openWhatsApp() {
    const size = selectedSize.value ? ` ukuran *${selectedSize.value}*` : ''
    const message = encodeURIComponent(
      `Halo, saya tertarik dengan *${product.title}*${size} - ${product.formattedPrice}. Apakah masih tersedia?`
    )
    const url = `https://wa.me/${product.whatsappNumber}?text=${message}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return {
    selectedSize,
    selectSize,
    openShopee,
    openTokopedia,
    openWhatsApp,
  }
}
