"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { HeroHeader } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Minus, Plus, Trash } from "lucide-react"
import { useMemo, useState } from "react"
import { isEmail, isPhoneBR, maskCpfCnpj, maskPhoneBR } from "@/lib/format"

export default function CarrinhoPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart()

  const [name, setName] = useState("")
  const [doc, setDoc] = useState("") // CPF/CNPJ (mascarado)
  const [contact, setContact] = useState("") // e-mail ou telefone
  const [submitted, setSubmitted] = useState<null | "email" | "whatsapp">(null)

  const summaryText = useMemo(() => {
    const items = cart.items
      .map((it) => `• ${it.product.name} (cod: ${it.product.slug ?? it.product.id}) x${it.quantity}`)
      .join("%0A")
    return (
      `Olá, gostaria de solicitar orçamento:%0A%0A` +
      `${items}%0A%0A` +
      `Dados:%0A` +
      `Nome: ${name || "-"}%0A` +
      `CPF/CNPJ: ${doc || "-"}%0A` +
      `Contato: ${contact || "-"}`
    )
  }, [cart.items, name, doc, contact])

  const mailtoHref = `mailto:vendas01@nihonauto.com.br?subject=Orçamento&body=${summaryText}`
  const waHref = `https://wa.me/559182337100?text=${summaryText}`

  const isContactValid = useMemo(() => {
    const v = contact.trim()
    if (!v) return false
    return v.includes("@") ? isEmail(v) : isPhoneBR(v)
  }, [contact])

  function finalize(kind: "email" | "whatsapp") {
    setSubmitted(kind)
    clearCart()
    setName("")
    setDoc("")
    setContact("")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeroHeader />
      <main className="container mx-auto px-4 pt-24 pb-10 flex-1">
        {submitted && (
          <div className="mb-6 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900">
            Sua solicitação de orçamento foi enviada. Retornaremos nos contatos fornecidos o mais breve possível. A Nihon agradece seu contato.
          </div>
        )}
        <h1 className="text-2xl font-semibold mb-6">Seu carinho</h1>

        {cart.items.length === 0 ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Seu carinho está vazio.</p>
            <Button asChild>
              <Link href="/produtos">Voltar às compras</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              {cart.items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 items-center border rounded-lg p-4">
                  <div className="h-20 w-20 rounded bg-gray-50 overflow-hidden">
                    <Image src={product.image || "/images/placeholder-product.svg"} alt={product.name} width={80} height={80} className="h-full w-full object-contain" unoptimized />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium leading-tight">{product.name}</div>
                    <div className="text-xs text-muted-foreground">Código: {product.slug ?? product.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
                    <span className="w-6 text-center">{quantity}</span>
                    <Button size="icon" variant="outline" onClick={() => updateQuantity(product.id, quantity + 1)}><Plus className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => removeItem(product.id)} aria-label="Remover"><Trash className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-3">
                <Button variant="secondary" asChild>
                  <Link href="/produtos">Voltar às compras</Link>
                </Button>
                <Button variant="ghost" onClick={clearCart}>Limpar carinho</Button>
              </div>
            </div>

            <aside className="space-y-4 border rounded-lg p-4 h-fit">
              <h2 className="font-medium">Solicitar orçamento</h2>
              <div className="space-y-2 text-sm">
                <label className="block">
                  <span className="text-muted-foreground">Nome</span>
                  <input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 bg-background" placeholder="Seu nome" />
                </label>
                <label className="block">
                  <span className="text-muted-foreground">CPF / CNPJ</span>
                  <input
                    value={doc}
                    onChange={e => setDoc(maskCpfCnpj(e.target.value))}
                    maxLength={18}
                    className="mt-1 w-full rounded-md border px-3 py-2 bg-background"
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  />
                </label>
                <label className="block">
                  <span className="text-muted-foreground">E-mail ou Telefone</span>
                  <input
                    value={contact}
                    onChange={e => {
                      const v = e.target.value
                      if (/@|[a-zA-Z]/.test(v)) return setContact(v)
                      setContact(maskPhoneBR(v))
                    }}
                    className="mt-1 w-full rounded-md border px-3 py-2 bg-background"
                    placeholder="email@exemplo.com ou (91) 99999-9999"
                    aria-invalid={!isContactValid}
                  />
                  {!isContactValid && contact && (
                    <p className="mt-1 text-xs text-red-600">Informe um e‑mail válido ou telefone (10–11 dígitos).</p>
                  )}
                </label>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full" disabled={!name || !isContactValid}>
                  <a href={mailtoHref} onClick={() => finalize("email")}>Solicitar por e‑mail</a>
                </Button>
                <Button asChild variant="secondary" className="w-full" disabled={!name || !isContactValid}>
                  <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => finalize("whatsapp")}>Solicitar pelo WhatsApp</a>
                </Button>
                </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
