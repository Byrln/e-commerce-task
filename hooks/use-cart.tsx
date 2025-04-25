"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { findIndex, filter, map, debounce, cloneDeep, isEmpty, uniqBy } from "lodash"
import type { Product } from "@/lib/types"

export interface CartItem extends Product {
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
})

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  
  // Use useCallback to ensure the debounced function doesn't change between renders
  // This fixes the dependency array issue in useEffect
  const saveCart = useCallback((cartItems: CartItem[]) => {
    if (mounted && !isEmpty(cartItems)) {
      localStorage.setItem("lovable-cart", JSON.stringify(cartItems))
    }
  }, [mounted])
  
  // Create the debounced function with useCallback to maintain reference stability
  const debouncedSaveCart = useCallback(
    debounce((cartItems: CartItem[]) => saveCart(cartItems), 300),
    [saveCart]
  )

  // Load cart from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const storedCart = localStorage.getItem("lovable-cart")
    if (storedCart) {
      try {
        // Use cloneDeep to ensure we have a completely fresh copy
        // This prevents reference issues with nested objects
        const parsedCart = cloneDeep(JSON.parse(storedCart))
        
        // Use uniqBy to ensure no duplicate items in case of localStorage corruption
        const uniqueCart = uniqBy(parsedCart, item => 
          `${item.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`
        )
        
        setCart(uniqueCart)
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        localStorage.removeItem("lovable-cart")
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      debouncedSaveCart(cart)
    }
    
    // Cleanup function to ensure pending debounced calls are executed
    return () => {
      // Check if flush exists before calling it
      if (debouncedSaveCart && typeof debouncedSaveCart.flush === 'function') {
        debouncedSaveCart.flush()
      }
    }
  }, [cart, mounted, debouncedSaveCart])

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      // Check if the item with the same ID, color, and size already exists
      const existingItemIndex = findIndex(prevCart, (i) => 
        i.id === item.id && i.selectedColor === item.selectedColor && i.selectedSize === item.selectedSize
      )

      if (existingItemIndex !== -1) {
        // Item already exists with same options, update quantity
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + item.quantity,
        }
        return updatedCart
      } else {
        // Item doesn't exist with these options, add it
        return [...prevCart, item]
      }
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => filter(prevCart, (item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) => map(prevCart, (item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
