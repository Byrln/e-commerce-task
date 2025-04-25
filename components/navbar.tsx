"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Menu, X, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useCart } from "@/hooks/use-cart"

export default function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { cart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const navLinks = [
    { href: "/", label: "Нүүр" },
    { href: "/shop", label: "Дэлгүүр" },
    { href: "/#about", label: "Бидний тухай" },
    { href: "/#contact", label: "Холбоо барих" },
  ]

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
      suppressHydrationWarning
    >
      <div className="container mx-auto px-4" suppressHydrationWarning>
        <div className="flex items-center justify-between h-16" suppressHydrationWarning>
          <Link href="/" className="text-2xl font-bold">
            Wave Fashion
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" suppressHydrationWarning>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-black dark:hover:text-white ${
                  pathname === link.href ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4" suppressHydrationWarning>
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            )}

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center" suppressHydrationWarning>
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg overflow-hidden"
            suppressHydrationWarning
          >
            <div className="container mx-auto px-4 py-4" suppressHydrationWarning>
              <nav className="flex flex-col space-y-4" suppressHydrationWarning>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-lg font-medium py-2 transition-colors hover:text-black dark:hover:text-white ${
                      pathname === link.href ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"
                    }`}
                    onClick={toggleMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
