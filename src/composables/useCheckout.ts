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
    const phone = '6287761561909'
    const size = selectedSize.value ? `\nUkuran: *${selectedSize.value}*` : ''
    const price = product.formattedPrice ? `\nHarga: ${product.formattedPrice}` : ''
    const message = encodeURIComponent(
      `Halo, saya ingin memesan *${product.title}*${size}${price}\nApakah stok masih tersedia?`
    )
    const url = `https://wa.me/${phone}?text=${message}`
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
