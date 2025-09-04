"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { Cart, CartItem, Product } from "@/types"

type CartContextValue = {
  cart: Cart
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number | string) => void
  updateQuantity: (productId: number | string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function calcTotals(items: CartItem[]): { total: number; itemCount: number } {
  const itemCount = items.reduce((acc, it) => acc + it.quantity, 0)
  const total = items.reduce((acc, it) => acc + (it.product.price ?? 0) * it.quantity, 0)
  return { total, itemCount }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("nihon_cart")
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  // persist
  useEffect(() => {
    try {
      localStorage.setItem("nihon_cart", JSON.stringify(items))
    } catch {}
  }, [items])

  const actions = useMemo(
    () => ({
      addItem: (product: Product, quantity = 1) => {
        setItems(prev => {
          const idx = prev.findIndex(ci => String(ci.product.id) === String(product.id))
          if (idx >= 0) {
            const copy = [...prev]
            copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + quantity }
            return copy
          }
          return [...prev, { product, quantity }]
        })
      },
      removeItem: (productId: number | string) => {
        setItems(prev => prev.filter(ci => String(ci.product.id) !== String(productId)))
      },
      updateQuantity: (productId: number | string, quantity: number) => {
        setItems(prev =>
          prev.map(ci =>
            String(ci.product.id) === String(productId) ? { ...ci, quantity: Math.max(1, quantity) } : ci,
          ),
        )
      },
      clearCart: () => setItems([]),
    }),
    [],
  )

  const cart = useMemo<Cart>(() => ({ items, ...calcTotals(items) }), [items])

  const value: CartContextValue = { cart, ...actions }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

