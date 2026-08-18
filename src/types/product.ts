export type ShirtSize = 'S' | 'M' | 'L' | 'XL' | 'XXL'
export type ShirtCategory = string

export interface CategoryItem {
  id: string
  name: string
  description?: string
}

export interface Product {
  id: string
  title: string
  price: number
  formattedPrice: string
  category: string
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
