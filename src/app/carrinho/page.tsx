"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, CreditCard, MessageCircle, Mail } from "lucide-react";
import { toast } from "sonner";

export default function CarrinhoPage() {
    const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [discount, setDiscount] = useState(0);

    const subtotal = getCartTotal();
    const shipping = subtotal >= 99 ? 0 : 15;
    const total = subtotal - discount + shipping;

    const handleQuantityChange = (id: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(id);
            toast.success("Produto removido do carrinho");
        } else {
            updateQuantity(id, newQuantity);
        }
    };

    const handleRemoveItem = (id: number, name: string) => {
        removeFromCart(id);
        toast.success(`${name} removido do carrinho`);
    };

    const handleApplyCoupon = () => {
        // Mock coupon validation
        const validCoupons = {
            DESCONTO10: 0.1,
            PRIMEIRA20: 0.2,
            FRETE15: 15,
        };

        if (couponCode in validCoupons) {
            const couponValue = validCoupons[couponCode as keyof typeof validCoupons];
            if (couponCode === "FRETE15") {
                setDiscount(shipping);
            } else {
                setDiscount(subtotal * couponValue);
            }
            setAppliedCoupon(couponCode);
            toast.success("Cupom aplicado com sucesso!");
        } else {
            toast.error("Cupom inválido");
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setDiscount(0);
        setCouponCode("");
        toast.success("Cupom removido");
    };

    const handleWhatsAppQuote = () => {
        const message = `Olá! Gostaria de solicitar um orçamento para os seguintes produtos:\n\n${cart.items
            .map(
                (item) =>
                    `• ${item.product.name} (Qtd: ${item.quantity}) - R$ ${(item.product.price * item.quantity)
                        .toFixed(2)
                        .replace(".", ",")}`
            )
            .join("\n")}\n\nTotal: R$ ${total.toFixed(2).replace(".", ",")}\n\nObrigado!`;

        const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    const handleEmailQuote = () => {
        const subject = "Solicitação de Orçamento - Nihon";
        const body = `Olá!\n\nGostaria de solicitar um orçamento para os seguintes produtos:\n\n${cart.items
            .map(
                (item) =>
                    `• ${item.product.name} (Qtd: ${item.quantity}) - R$ ${(item.product.price * item.quantity)
                        .toFixed(2)
                        .replace(".", ",")}`
            )
            .join("\n")}\n\nTotal: R$ ${total.toFixed(2).replace(".", ",")}\n\nAguardo retorno.\n\nObrigado!`;

        const mailtoUrl = `mailto:contato@Nihon.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            body
        )}`;
        window.location.href = mailtoUrl;
    };

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <Header />

                <div className="container mx-auto px-4 py-16 pt-24">
                    <div className="max-w-md mx-auto text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="h-12 w-12 text-gray-400" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h1>

                        <p className="text-gray-600 mb-8">
                            Adicione produtos ao seu carrinho para continuar com a compra.
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
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Carrinho de Compras</h1>
                    <p className="text-gray-500">
                        {cart.items.reduce((acc, item) => acc + item.quantity, 0)} itens no seu carrinho
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-6">
                            {cart.items.map((item) => (
                                <div
                                    key={item.product.id}
                                    className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center gap-6">
                                        {/* Product Image */}
                                        <div className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                                        {item.product.name}
                                                    </h3>
                                                    {item.product.brand && (
                                                        <p className="text-gray-500 text-sm">{item.product.brand}</p>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-2"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Quantity and Price */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleQuantityChange(item.product.id, item.quantity - 1)
                                                            }
                                                            className="h-8 w-8 p-0 hover:bg-gray-100"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="px-4 py-1 text-sm font-medium min-w-[3rem] text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleQuantityChange(item.product.id, item.quantity + 1)
                                                            }
                                                            className="h-8 w-8 p-0 hover:bg-gray-100"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500 mb-1">
                                                        R$ {item.product.price.toFixed(2).replace(".", ",")} cada
                                                    </p>
                                                    <p className="font-bold text-xl text-gray-900">
                                                        R${" "}
                                                        {(item.product.price * item.quantity)
                                                            .toFixed(2)
                                                            .replace(".", ",")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Continue Shopping */}
                        <div className="mt-8">
                            <Link href="/produtos">
                                <Button variant="outline" className="text-gray-600 border-gray-200 hover:bg-gray-50">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Continuar Comprando
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:sticky lg:top-8">
                        <div className="bg-gray-50 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo</h2>

                            {/* Coupon */}
                            <div className="mb-6">
                                {!appliedCoupon ? (
                                    <div className="space-y-3">
                                        <Input
                                            placeholder="Código do cupom"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            className="border-gray-200 rounded-lg"
                                        />
                                        <Button
                                            onClick={handleApplyCoupon}
                                            className="w-full bg-black hover:bg-gray-800 text-white rounded-lg"
                                            disabled={!couponCode}
                                        >
                                            Aplicar Cupom
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                                        <div>
                                            <Badge className="bg-green-100 text-green-800">{appliedCoupon}</Badge>
                                            <p className="text-sm text-green-600 mt-1">
                                                Desconto: R$ {discount.toFixed(2).replace(".", ",")}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={handleRemoveCoupon}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Summary */}
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>
                                        Subtotal ({cart.items.reduce((acc, item) => acc + item.quantity, 0)} itens)
                                    </span>
                                    <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Desconto</span>
                                        <span>- R$ {discount.toFixed(2).replace(".", ",")}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-600">
                                    <span>Frete</span>
                                    <span>
                                        {shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2).replace(".", ",")}`}
                                    </span>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between text-xl font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <Button className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg text-lg font-semibold">
                                    Checkout
                                </Button>

                                <Button
                                    onClick={handleWhatsAppQuote}
                                    variant="outline"
                                    className="w-full border-green-200 text-green-600 hover:bg-green-50 py-3 rounded-lg"
                                >
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    WhatsApp
                                </Button>

                                <Button
                                    onClick={handleEmailQuote}
                                    variant="outline"
                                    className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-lg"
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Email
                                </Button>
                            </div>

                            {/* Clear Cart */}
                            <div className="mt-6 pt-6 border-t">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        clearCart();
                                        toast.success("Carrinho limpo");
                                    }}
                                    className="w-full text-red-500 hover:bg-red-50 py-2"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Limpar Carrinho
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
