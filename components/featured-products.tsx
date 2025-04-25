"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import ProductCard from "@/components/product-card"
import { products } from "@/lib/products"

export default function FeaturedProducts() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [activeCategory, setActiveCategory] = useState("tops")

  // category бүрээс 4, 4-н бараа авж харуулах
  const topProducts = products.filter(product => product.category === "tops").slice(0, 4)
  const dressProducts = products.filter(product => product.category === "dresses").slice(0, 4)
  const accessoryProducts = products.filter(product => product.category === "accessories").slice(0, 4)

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

  // Сонгосон category идэвхтэй болгох
  const getActiveProducts = () => {
    switch (activeCategory) {
      case "tops":
        return topProducts
      case "dresses":
        return dressProducts
      case "accessories":
        return accessoryProducts
      default:
        return topProducts
    }
  }

  return (
    <section className="py-32 bg-pink-50 dark:bg-pink-950/30">
      <div className="container mx-auto px-4" ref={ref}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-16 gap-6">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 dark:from-pink-400 dark:to-violet-400"
          >
            Онцлох бараа
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className="flex space-x-2"
          >
            <Link href="/shop">
              <Button variant="outline" className="group text-lg px-6 py-4 rounded-full border-2 hover:bg-black/5 dark:hover:bg-white/5">
                Бүгдийн харах
                <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-row justify-center gap-4 mb-12"
        >
          <Button
            onClick={() => setActiveCategory("tops")}
            variant={activeCategory === "tops" ? "default" : "outline"}
            className={`rounded-full px-4 py-2 text-md md:text-lg ${
              activeCategory === "tops" 
                ? "bg-pink-500 hover:bg-pink-600 text-white" 
                : "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
            }`}
          >
            Цамц
          </Button>
          <Button
            onClick={() => setActiveCategory("dresses")}
            variant={activeCategory === "dresses" ? "default" : "outline"}
            className={`rounded-full px-4 py-2 text-md md:text-lg ${
              activeCategory === "dresses" 
                ? "bg-pink-500 hover:bg-pink-600 text-white" 
                : "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
            }`}
          >
            Даашинз
          </Button>
          <Button
            onClick={() => setActiveCategory("accessories")}
            variant={activeCategory === "accessories" ? "default" : "outline"}
            className={`rounded-full px-4 py-2 text-md md:text-lg ${
              activeCategory === "accessories" 
                ? "bg-pink-500 hover:bg-pink-600 text-white" 
                : "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
            }`}
          >
            Гоёл чимэглэл
          </Button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {getActiveProducts().map((product) => (
            <motion.div key={product.id} variants={itemVariants} className="group">
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
