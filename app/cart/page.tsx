"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotal(newTotal)
  }, [cart])

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Таны сагс</h1>
        <p className="text-gray-500 mb-8">Таны сагс хоосон байна.</p>
        <Link href="/shop">
          <Button>Дэлгүүрлэлтээ үргэлжлүүлэх</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          {cart.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 border-b border-gray-200 py-4"
            >
              <img
                src={item.images?.[0] || '/images/placeholder.png'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">₮{item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="ml-4"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Хасах
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Захиалгын хураангуй</h2>
            <div className="flex justify-between mb-2">
              <span>Дэд нийт</span>
              <span>₮{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Хүргэлт</span>
              <span>Үнэгүй</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between font-semibold">
                <span>Нийт дүн</span>
                <span>₮{total.toFixed(2)}</span>
              </div>
            </div>
            <Link href="/checkout">
              <Button className="w-full mt-6">Төлбөр тооцоо руу үргэлжлүүлэх</Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={clearCart}
            >
              Сагс хоослох
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
