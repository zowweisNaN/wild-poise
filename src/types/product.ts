export type ShirtSize = 'S' | 'M' | 'L' | 'XL' | 'XXL'
export type ShirtCategory = 'All' | 'Short Sleeve' | 'Flannel' | 'Linen' | 'Hawaiian' | 'Batik'

export interface Product {
  id: string
  title: string
  price: number
  formattedPrice: string
  category: Exclude<ShirtCategory, 'All'>
  images: string[]
  availableSizes: ShirtSize[]
  description: string
  originalPrice?: number
  formattedOriginalPrice?: string
  inStock?: boolean
  shopeeUrl: string
  tokopediaUrl: string
  whatsappNumber?: string
}
