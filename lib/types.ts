export interface Product {
  id: string
  name: string
  price: number
  description: string
  images: string[]  // Main image is the first element in the array
  category: string
  selectedColor?: string
  selectedSize?: string
  quantity?: number
  features?: string[]
}
