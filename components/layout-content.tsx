'use client'

import type React from "react"
import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <div className="min-h-screen" suppressHydrationWarning>
        {children}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden" suppressHydrationWarning>
      <Navbar />
      <main className="flex-1" suppressHydrationWarning>{children}</main>
      <Footer />
    </div>
  )
}