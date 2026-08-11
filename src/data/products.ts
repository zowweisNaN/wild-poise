import type { Product } from '../types/product'

export const categories = ['All', 'Short Sleeve', 'Flannel', 'Linen', 'Hawaiian', 'Batik'] as const

export const products: Product[] = [
  {
    id: 'wp-01',
    title: 'Wild Poise Cuban Linen Resort Shirt',
    price: 249000,
    formattedPrice: 'Rp 249.000',
    originalPrice: 359000,
    formattedOriginalPrice: 'Rp 359.000',
    inStock: true,
    category: 'Linen',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&auto=format&fit=crop&q=80'
    ],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Wild Poise unisex apparel. Kemeja linen santai berkerah Cuban yang dirancang khusus untuk kenyamanan maksimal sehari-hari dengan siluet relaxed fit yang versatile.',
    shopeeUrl: 'https://shopee.co.id/search?keyword=wild%20poise%20linen',
    tokopediaUrl: 'https://www.tokopedia.com/search?q=wild%20poise%20linen',
    whatsappNumber: '628123456789'
  },
  {
    id: 'wp-02',
    title: 'Wild Poise Vintage Flannel Overshirt',
    price: 269000,
    formattedPrice: 'Rp 269.000',
    originalPrice: 399000,
    formattedOriginalPrice: 'Rp 399.000',
    inStock: true,
    category: 'Flannel',
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80'
    ],
    availableSizes: ['M', 'L', 'XL'],
    description: 'Wild Poise unisex apparel. Kemeja flannel bermotif kotak klasik dengan sentuhan vintage. Terbuat dari katun flannel lembut yang hangat dan tetap breathable.',
    shopeeUrl: 'https://shopee.co.id/search?keyword=wild%20poise%20flannel',
    tokopediaUrl: 'https://www.tokopedia.com/search?q=wild%20poise%20flannel',
    whatsappNumber: '628123456789'
  },
  {
    id: 'wp-03',
    title: 'Wild Poise Botanical Hawaiian Shirt',
    price: 229000,
    formattedPrice: 'Rp 229.000',
    inStock: false,
    category: 'Hawaiian',
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80'
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    description: 'Wild Poise unisex apparel. Kemeja motif tropis eksklusif dari seri Botanical. Desain bold dan fresh cocok untuk outfit santai, pantai, maupun iklim tropis.',
    shopeeUrl: 'https://shopee.co.id/search?keyword=wild%20poise%20hawaiian',
    tokopediaUrl: 'https://www.tokopedia.com/search?q=wild%20poise%20hawaiian',
    whatsappNumber: '628123456789'
  },
  {
    id: 'wp-04',
    title: 'Wild Poise Modern Fusion Batik Shirt',
    price: 299000,
    formattedPrice: 'Rp 299.000',
    originalPrice: 429000,
    formattedOriginalPrice: 'Rp 429.000',
    inStock: true,
    category: 'Batik',
    images: [
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
    ],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Wild Poise unisex apparel. Perpaduan warisan budaya batik modern dengan gaya kasual urban kontemporer. Potongan trendi cocok untuk semi-formal dan momen kasual.',
    shopeeUrl: 'https://shopee.co.id/search?keyword=wild%20poise%20batik',
    tokopediaUrl: 'https://www.tokopedia.com/search?q=wild%20poise%20batik',
    whatsappNumber: '628123456789'
  },
  {
    id: 'wp-05',
    title: 'Wild Poise Minimalist Short Sleeve Shirt',
    price: 199000,
    formattedPrice: 'Rp 199.000',
    originalPrice: 279000,
    formattedOriginalPrice: 'Rp 279.000',
    inStock: true,
    category: 'Short Sleeve',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80'
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    description: 'Wild Poise unisex apparel. Kemeja lengan pendek esensial berwarna netral polos dengan bahan premium rayon katun yang adem dan nyaman sepanjang hari.',
    shopeeUrl: 'https://shopee.co.id/search?keyword=wild%20poise%20short%20sleeve',
    tokopediaUrl: 'https://www.tokopedia.com/search?q=wild%20poise%20short%20sleeve',
    whatsappNumber: '628123456789'
  },
  {
    id: 'wp-06',
    title: 'Wild Poise Breeze Oversized Linen Shirt',
    price: 259000,
    formattedPrice: 'Rp 259.000',
    inStock: true,
    category: 'Linen',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&auto=format&fit=crop&q=80'
    ],
    availableSizes: ['M', 'L', 'XL', 'XXL'],
    description: 'Wild Poise unisex apparel. Linen shirt bertekstur lembut dalam nuansa earthy tone. Memberikan tampilan Effortless Chic yang santai dan modern.',
    shopeeUrl: 'https://shopee.co.id/search?keyword=wild%20poise%20breeze%20linen',
    tokopediaUrl: 'https://www.tokopedia.com/search?q=wild%20poise%20breeze%20linen',
    whatsappNumber: '628123456789'
  },
  {
    id: 'wp-07',
    title: 'Wild Poise Shadow Plaid Flannel Shirt',
    price: 279000,
    formattedPrice: 'Rp 279.000',
    originalPrice: 389000,
    formattedOriginalPrice: 'Rp 389.000',
    inStock: true,
    category: 'Flannel',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80'
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    description: 'Wild Poise unisex apparel. Flannel bermotif shadow plaid gelap yang edgy. Dapat dipakai sebagai kemeja utama maupun outer/overshirt layering.',
    shopeeUrl: 'https://shopee.co.id/search?keyword=wild%20poise%20shadow%20flannel',
    tokopediaUrl: 'https://www.tokopedia.com/search?q=wild%20poise%20shadow%20flannel',
    whatsappNumber: '628123456789'
  },
  {
    id: 'wp-08',
    title: 'Wild Poise Sunset Resort Hawaiian Shirt',
    price: 239000,
    formattedPrice: 'Rp 239.000',
    originalPrice: 349000,
    formattedOriginalPrice: 'Rp 349.000',
    inStock: true,
    category: 'Hawaiian',
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    description: 'Wild Poise unisex apparel. Motif cetak gradasi warna hangat terinspirasi dari keindahan sunset. Ringan, jatuh sempurna di badan, dan siap melengkapi gaya liburan.',
    shopeeUrl: 'https://shopee.co.id/search?keyword=wild%20poise%20sunset%20hawaiian',
    tokopediaUrl: 'https://www.tokopedia.com/search?q=wild%20poise%20sunset%20hawaiian',
    whatsappNumber: '628123456789'
  }
]
