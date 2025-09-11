'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { HeroHeader } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Minus, Plus, Trash } from 'lucide-react'
import { useMemo, useState } from 'react'
import { isEmail, isPhoneBR, maskCpfCnpj, maskPhoneBR } from '@/lib/format'

export default function CarrinhoPage() {
    const { cart, updateQuantity, removeItem, clearCart, submitQuoteRequest } =
        useCart()

    const [name, setName] = useState('')
    const [doc, setDoc] = useState('') // CPF/CNPJ (mascarado)
    const [contact, setContact] = useState('') // e-mail ou telefone
    const [submitted, setSubmitted] = useState<null | 'email' | 'whatsapp'>(
        null
    )
    const [loading, setLoading] = useState(false)

    const isContactValid = useMemo(() => {
        const v = contact.trim()
        if (!v) return false
        return v.includes('@') ? isEmail(v) : isPhoneBR(v)
    }, [contact])

    async function handleQuoteRequest() {
        if (!name || !isContactValid) return

        setLoading(true)
        try {
            // Determinar se é email ou telefone
            const isEmailContact = contact.includes('@')

            const result = await submitQuoteRequest({
                name: name.trim(),
                document: doc.trim(),
                email: isEmailContact ? contact.trim() : '', // deixar vazio se for telefone
                phone: isEmailContact ? '' : contact.trim() // deixar vazio se for email
            })

            if (result.success) {
                setSubmitted('email') // indicar sucesso
                setName('')
                setDoc('')
                setContact('')
            } else {
                alert(result.message || 'Erro ao enviar solicitação')
            }
        } catch (error) {
            console.error('Erro:', error)
            alert('Erro ao enviar solicitação. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    // WhatsApp como alternativa
    const summaryText = useMemo(() => {
        const items = cart.items
            .map(
                it =>
                    `• ${it.product.name} (cod: ${
                        it.product.slug ?? it.product.id
                    }) x${it.quantity}`
            )
            .join('%0A')
        return (
            `Olá, gostaria de solicitar orçamento:%0A%0A` +
            `${items}%0A%0A` +
            `Dados:%0A` +
            `Nome: ${name || '-'}%0A` +
            `CPF/CNPJ: ${doc || '-'}%0A` +
            `Contato: ${contact || '-'}`
        )
    }, [cart.items, name, doc, contact])

    const waHref = `https://wa.me/559182337100?text=${summaryText}`

    function finalizeWhatsApp() {
        setSubmitted('whatsapp')
        clearCart()
        setName('')
        setDoc('')
        setContact('')
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <HeroHeader />
            <main className="container mx-auto px-4 pt-24 pb-10 flex-1">
                {submitted && (
                    <div className="mb-6 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900">
                        Sua solicitação de orçamento foi enviada. Retornaremos
                        nos contatos fornecidos o mais breve possível. A Nihon
                        agradece seu contato.
                    </div>
                )}
                <h1 className="text-2xl font-semibold mb-6">Seu carinho</h1>

                {cart.items.length === 0 ? (
                    <div className="text-center space-y-4">
                        <p className="text-muted-foreground">
                            Seu carinho está vazio.
                        </p>
                        <Button asChild>
                            <Link href="/produtos">Voltar às compras</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-6">
                            {cart.items.map(
                                ({
                                    product,
                                    quantity,
                                    variationId,
                                    selectedAttributes,
                                    variationImage
                                }) => {
                                    const cartItemKey = variationId
                                        ? `${product.id}-${variationId}`
                                        : String(product.id)
                                    const displayImage =
                                        variationImage ||
                                        product.image ||
                                        '/images/placeholder-product.svg'
                                    return (
                                        <div
                                            key={cartItemKey}
                                            className="flex gap-4 items-center border rounded-lg p-4"
                                        >
                                            <div className="h-20 w-20 rounded bg-gray-50 overflow-hidden">
                                                <Image
                                                    src={displayImage}
                                                    alt={product.name}
                                                    width={80}
                                                    height={80}
                                                    className="h-full w-full object-contain"
                                                    sizes="80px"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium leading-tight">
                                                    {product.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Código:{' '}
                                                    {product.sku ||
                                                        product.code ||
                                                        product.slug ||
                                                        product.id}
                                                </div>
                                                {selectedAttributes &&
                                                    Object.keys(
                                                        selectedAttributes
                                                    ).length > 0 && (
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {Object.entries(
                                                                selectedAttributes
                                                            ).map(
                                                                ([
                                                                    key,
                                                                    value
                                                                ]) => (
                                                                    <span
                                                                        key={
                                                                            key
                                                                        }
                                                                        className="mr-2"
                                                                    >
                                                                        {key}:{' '}
                                                                        {value}
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            product.id,
                                                            Math.max(
                                                                1,
                                                                quantity - 1
                                                            ),
                                                            variationId
                                                        )
                                                    }
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="w-6 text-center">
                                                    {quantity}
                                                </span>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            product.id,
                                                            quantity + 1,
                                                            variationId
                                                        )
                                                    }
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        removeItem(
                                                            product.id,
                                                            variationId
                                                        )
                                                    }
                                                    aria-label="Remover"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                }
                            )}

                            <div className="flex items-center gap-3">
                                <Button variant="secondary" asChild>
                                    <Link href="/produtos">
                                        Voltar às compras
                                    </Link>
                                </Button>
                                <Button variant="ghost" onClick={clearCart}>
                                    Limpar carinho
                                </Button>
                            </div>
                        </div>

                        <aside className="space-y-4 border rounded-lg p-4 h-fit">
                            <h2 className="font-medium">Solicitar orçamento</h2>
                            <div className="space-y-2 text-sm">
                                <label className="block">
                                    <span className="text-muted-foreground">
                                        Nome
                                    </span>
                                    <input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="mt-1 w-full rounded-md border px-3 py-2 bg-background"
                                        placeholder="Seu nome"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-muted-foreground">
                                        CPF / CNPJ
                                    </span>
                                    <input
                                        value={doc}
                                        onChange={e =>
                                            setDoc(maskCpfCnpj(e.target.value))
                                        }
                                        maxLength={18}
                                        className="mt-1 w-full rounded-md border px-3 py-2 bg-background"
                                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-muted-foreground">
                                        E-mail ou Telefone
                                    </span>
                                    <input
                                        value={contact}
                                        onChange={e => {
                                            const v = e.target.value
                                            if (/@|[a-zA-Z]/.test(v))
                                                return setContact(v)
                                            setContact(maskPhoneBR(v))
                                        }}
                                        className="mt-1 w-full rounded-md border px-3 py-2 bg-background"
                                        placeholder="email@exemplo.com ou (91) 99999-9999"
                                        aria-invalid={!isContactValid}
                                    />
                                    {!isContactValid && contact && (
                                        <p className="mt-1 text-xs text-red-600">
                                            Informe um e‑mail válido ou telefone
                                            (10–11 dígitos).
                                        </p>
                                    )}
                                </label>
                            </div>

                            {/* Informativo sobre contato */}
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-800">
                                <p className="font-medium mb-1">
                                    ℹ️ Como receber o orçamento:
                                </p>
                                <p className="mb-1">
                                    • <strong>E-mail:</strong> Receberá o
                                    orçamento detalhado por e-mail
                                </p>
                                <p>
                                    • <strong>Telefone:</strong> Entraremos em
                                    contato via WhatsApp
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Button
                                    className="w-full"
                                    disabled={
                                        !name || !isContactValid || loading
                                    }
                                    onClick={handleQuoteRequest}
                                >
                                    {loading
                                        ? 'Enviando...'
                                        : 'Solicitar Orçamento'}
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
