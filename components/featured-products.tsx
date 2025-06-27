"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import ProductCard from "@/components/product-card"
// import { products } from "@/lib/products" // Removed static import

interface Product {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  category: string
  features: string[]
  inventory: number
  avgRating: number
  reviewCount: number
}

export default function FeaturedProducts() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch featured products from API
  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products?limit=4&sortBy=createdAt&sortOrder=desc')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setFeaturedProducts(data.products)
    } catch (error) {
      console.error('Error fetching featured products:', error)
      // Fallback to empty array on error
      setFeaturedProducts([])
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="py-32 bg-gradient-to-b from-transparent to-pink-50 dark:to-pink-950/30">
      <div className="container mx-auto px-4" ref={ref}>
        <div className="flex justify-between items-center mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 dark:from-pink-400 dark:to-violet-400"
          >
            Онцлох Цуглуулга
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/shop">
              <Button variant="outline" className="group text-lg px-6 py-4 rounded-full border-2 hover:bg-black/5 dark:hover:bg-white/5">
                Бүгдийг харах
                <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 mb-4"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 mb-2"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
      </div>
    </section>
  )
}
