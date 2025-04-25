"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { BlurImage } from "@/components/ui/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/types"

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { addToCart } = useCart()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)
    
    try {
      // Simulate a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500))
      
      addToCart({ ...product, quantity: 1 })
      
      toast({
        title: "Сагслагдаа",
        description: `${product.name} амжилттай таны сагсанд нэмэгдлээ.`,
      })
    } catch (error) {
      toast({
        title: "Алдаа гарлаа",
        description: "Сагсанд нэмэх үед алдаа гарлаа. Дахин оролдоно уу.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Link href={`/shop/${product.id}`}>
      <motion.div
        className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative aspect-square overflow-hidden bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />

          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              className="w-full bg-white hover:bg-gray-100 text-black" 
              size="sm" 
              onClick={handleAddToCart}
              isLoading={isLoading}
              loadingText="Сагслаж байна..."
            >
              <ShoppingBag size={16} className="mr-2" />
              Сагслах
            </Button>
          </motion.div>
        </div>

        <div className="p-4">
          <h3 className="font-medium mb-1 truncate">{product.name}</h3>
          <p className="text-gray-900 dark:text-gray-100 font-semibold">₮{product.price.toLocaleString()}</p>
        </div>
      </motion.div>
    </Link>
  )
}
