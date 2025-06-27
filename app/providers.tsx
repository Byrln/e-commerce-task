"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { SessionProvider } from "next-auth/react"

import { CartProvider } from "@/hooks/use-cart"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  // This helps prevent hydration mismatch errors from browser extensions
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <SessionProvider>
      <CartProvider>
        {mounted ? children : null}
        {mounted && <Toaster />}
      </CartProvider>
    </SessionProvider>
  )
}
