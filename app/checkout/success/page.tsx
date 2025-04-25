"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag } from "lucide-react"

export default function CheckoutSuccessPage() {
  // Generate a random order number
  const orderNumber = `LOV-${Math.floor(100000 + Math.random() * 900000)}`

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <div className="flex justify-center mb-6">
          <CheckCircle size={80} className="text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Баярлалаа!</h1>
        <p className="text-xl mb-2">Таны захиалга амжилттай хийгдлээ.</p>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Захиалгын дугаар: <span className="font-medium">{orderNumber}</span>
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="font-semibold mb-4">Захиалгын мэдээлэл</h2>
          <div className="space-y-2 text-left">
            <p className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Захиалгын дугаар:</span>
              <span>{orderNumber}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Огноо:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Төлбөрийн хэлбэр:</span>
              <span>Кредит карт</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Хүргэлтийн төрөл:</span>
              <span>Энгийн хүргэлт</span>
            </p>
          </div>
        </div>

        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Захиалгын баталгаажуулалтыг таны имэйл хаяг руу илгээсэн. Захиалгын явцыг хянахын тулд имэйлээ шалгана уу.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop">
            <Button variant="outline" className="w-full sm:w-auto">
              <ShoppingBag size={18} className="mr-2" />
              Үргэлжлүүлэн дэлгүүрлэх
            </Button>
          </Link>
          <Link href="/">
            <Button className="w-full sm:w-auto">Нүүр хуудас руу буцах</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
