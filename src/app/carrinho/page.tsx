'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import {
    Trash2,
    Plus,
    Minus,
    ShoppingBag,
    ArrowLeft,
    Truck,
    CreditCard,
    MessageCircle,
    Mail
} from 'lucide-react'
import { toast } from 'sonner'

export default function CarrinhoPage() {
    const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } =
        useCart()
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
    const [discount, setDiscount] = useState(0)

    const subtotal = getCartTotal()
    const shipping = subtotal >= 99 ? 0 : 15
    const total = subtotal - discount + shipping

    const handleQuantityChange = (id: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(id)
            toast.success('Produto removido do carrinho')
        } else {
            updateQuantity(id, newQuantity)
        }
    }

    const handleRemoveItem = (id: number, name: string) => {
        removeFromCart(id)
        toast.success(`${name} removido do carrinho`)
    }

    const handleApplyCoupon = () => {
        // Mock coupon validation
        const validCoupons = {
            DESCONTO10: 0.1,
            PRIMEIRA20: 0.2,
            FRETE15: 15
        }

        if (couponCode in validCoupons) {
            const couponValue =
                validCoupons[couponCode as keyof typeof validCoupons]
            if (couponCode === 'FRETE15') {
                setDiscount(shipping)
            } else {
                setDiscount(subtotal * couponValue)
            }
            setAppliedCoupon(couponCode)
            toast.success('Cupom aplicado com sucesso!')
        } else {
            toast.error('Cupom inválido')
        }
    }

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null)
        setDiscount(0)
        setCouponCode('')
        toast.success('Cupom removido')
    }

    const handleWhatsAppQuote = () => {
        const message = `Olá! Gostaria de solicitar um orçamento para os seguintes produtos:\n\n${cart.items
            .map(
                item =>
                    `• ${item.product.name} (Qtd: ${item.quantity}) - R$ ${(
                        item.product.price * item.quantity
                    )
                        .toFixed(2)
                        .replace('.', ',')}`
            )
            .join('\n')}\n\nTotal: R$ ${total
            .toFixed(2)
            .replace('.', ',')}\n\nObrigado!`

        const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(
            message
        )}`
        window.open(whatsappUrl, '_blank')
    }

    const handleEmailQuote = () => {
        const subject = 'Solicitação de Orçamento - Nihon Auto'
        const body = `Olá!\n\nGostaria de solicitar um orçamento para os seguintes produtos:\n\n${cart.items
            .map(
                item =>
                    `• ${item.product.name} (Qtd: ${item.quantity}) - R$ ${(
                        item.product.price * item.quantity
                    )
                        .toFixed(2)
                        .replace('.', ',')}`
            )
            .join('\n')}\n\nTotal: R$ ${total
            .toFixed(2)
            .replace('.', ',')}\n\nAguardo retorno.\n\nObrigado!`

        const mailtoUrl = `mailto:vendas01@nihonauto.com.br?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(body)}`
        window.location.href = mailtoUrl
    }

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <Header />

                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-md mx-auto text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="h-12 w-12 text-gray-400" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Seu carrinho está vazio
                        </h1>

                        <p className="text-gray-600 mb-8">
                            Adicione produtos ao seu carrinho para continuar com
                            a compra.
                        </p>

                        <Link href="/produtos">
                            <Button size="lg">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Continuar Comprando
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Breadcrumb */}
            <div className="bg-white py-4 border-b">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">
                            Início
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900">Carrinho</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Carrinho de Compras
                    </h1>
                    <Link href="/produtos">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Continuar Comprando
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map(item => (
                            <Card key={item.product.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {item.product.name}
                                            </h3>
                                            {item.product.brand && (
                                                <p className="text-sm text-gray-600">
                                                    Marca: {item.product.brand}
                                                </p>
                                            )}
                                            <p className="text-lg font-bold text-blue-600 mt-1">
                                                R${' '}
                                                {item.product.price
                                                    .toFixed(2)
                                                    .replace('.', ',')}
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center border rounded-lg">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.product.id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="px-3 py-1 min-w-[2.5rem] text-center">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.product.id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleRemoveItem(
                                                        item.product.id,
                                                        item.product.name
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            Subtotal do item:
                                        </span>
                                        <span className="font-semibold text-lg">
                                            R${' '}
                                            {(
                                                item.product.price *
                                                item.quantity
                                            )
                                                .toFixed(2)
                                                .replace('.', ',')}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Clear Cart */}
                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    clearCart()
                                    toast.success('Carrinho limpo')
                                }}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Limpar Carrinho
                            </Button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        {/* Coupon */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Cupom de Desconto
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!appliedCoupon ? (
                                    <div className="space-y-3">
                                        <Input
                                            placeholder="Digite o código do cupom"
                                            value={couponCode}
                                            onChange={e =>
                                                setCouponCode(
                                                    e.target.value.toUpperCase()
                                                )
                                            }
                                        />
                                        <Button
                                            onClick={handleApplyCoupon}
                                            className="w-full"
                                            disabled={!couponCode}
                                        >
                                            Aplicar Cupom
                                        </Button>
                                        <div className="text-xs text-gray-500">
                                            <p>Cupons disponíveis:</p>
                                            <p>
                                                • DESCONTO10 - 10% de desconto
                                            </p>
                                            <p>
                                                • PRIMEIRA20 - 20% de desconto
                                            </p>
                                            <p>• FRETE15 - Frete grátis</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Badge className="bg-green-100 text-green-800">
                                                {appliedCoupon}
                                            </Badge>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Desconto: R${' '}
                                                {discount
                                                    .toFixed(2)
                                                    .replace('.', ',')}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleRemoveCoupon}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Resumo do Pedido
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span>
                                        Subtotal (
                                        {cart.items.reduce(
                                            (acc, item) => acc + item.quantity,
                                            0
                                        )}{' '}
                                        itens):
                                    </span>
                                    <span>
                                        R${' '}
                                        {subtotal.toFixed(2).replace('.', ',')}
                                    </span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Desconto:</span>
                                        <span>
                                            - R${' '}
                                            {discount
                                                .toFixed(2)
                                                .replace('.', ',')}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="flex items-center">
                                        <Truck className="mr-1 h-4 w-4" />
                                        Frete:
                                    </span>
                                    <span>
                                        {shipping === 0
                                            ? 'Grátis'
                                            : `R$ ${shipping
                                                  .toFixed(2)
                                                  .replace('.', ',')}`}
                                    </span>
                                </div>

                                {subtotal < 99 && shipping > 0 && (
                                    <p className="text-xs text-gray-600">
                                        Frete grátis para compras acima de R$
                                        99,00
                                    </p>
                                )}

                                <Separator />

                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-blue-600">
                                        R$ {total.toFixed(2).replace('.', ',')}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="space-y-3">
                            <Button
                                onClick={handleWhatsAppQuote}
                                className="w-full bg-green-600 hover:bg-green-700"
                            >
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Solicitar Orçamento via WhatsApp
                            </Button>

                            <Button
                                onClick={handleEmailQuote}
                                variant="outline"
                                className="w-full"
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Solicitar Orçamento por Email
                            </Button>

                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">
                                    Ou continue para finalizar a compra:
                                </p>
                                <Button className="w-full" size="lg">
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    Finalizar Compra
                                </Button>
                            </div>
                        </div>

                        {/* Security Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-sm mb-2">
                                Compra Segura
                            </h4>
                            <div className="space-y-1 text-xs text-gray-600">
                                <p>✓ Dados protegidos com SSL</p>
                                <p>✓ Garantia de qualidade</p>
                                <p>✓ Troca em até 30 dias</p>
                                <p>✓ Suporte especializado</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        M
                                    </span>
                                </div>
                                <span className="text-xl font-bold">
                                    Nihon Auto
                                </span>
                            </div>
                            <p className="text-gray-400">
                                Mais de 38 anos oferecendo excelência na
                                distribuição de acessórios automotivos.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Produtos</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a
                                        href="/produtos"
                                        className="hover:text-white"
                                    >
                                        Todos os Produtos
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/categorias"
                                        className="hover:text-white"
                                    >
                                        Categorias
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/marcas"
                                        className="hover:text-white"
                                    >
                                        Marcas
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Empresa</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a
                                        href="/sobre"
                                        className="hover:text-white"
                                    >
                                        Sobre Nós
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/contato"
                                        className="hover:text-white"
                                    >
                                        Contato
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/termos"
                                        className="hover:text-white"
                                    >
                                        Termos de Uso
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Contato</h4>
                            <div className="space-y-2 text-gray-400">
                                <p>📧 vendas01@nihonauto.com.br</p>
                                <p>📱 (91) 5591-8237100</p>
                                <p>
                                    📍 Travessa José Pio, 541 - Umarizal -
                                    Belém/PA
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>
                            &copy; 2024 Nihon Acessórios Automotivos. Todos os
                            direitos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
