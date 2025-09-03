"use client";

import React, { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types";
import { toast } from "sonner";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { cart, addToCart, updateQuantity } = useCart();
  const cartItem = cart.items.find((item) => item.product.id === product.id);
  const [quantity, setQuantity] = useState(cartItem?.quantity ?? 1);

  const handleQuantityChange = (newQuantity: number) => {
    const qty = Math.max(1, newQuantity);
    setQuantity(qty);
    if (cartItem) {
      updateQuantity(product.id, qty);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const handleWhatsApp = () => {
    const message = `Olá! Tenho interesse no produto: ${product.name}`;
    window.open(getWhatsAppUrl(message), "_blank");
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">(4.8) 127 avaliações</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</div>
        {product.price > 100 && (
          <p className="text-sm text-gray-500">ou 12x de {formatPrice(product.price / 12)} sem juros</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Quantidade</label>
          <div className="flex items-center space-x-3">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="p-2 hover:bg-gray-50 transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="p-2 hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Adicionar ao carrinho</span>
          </button>
          <Button variant="outline" onClick={handleWhatsApp} className="px-6">
            Orçamento
          </Button>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900">Características</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Frete grátis em pedidos acima de R$ 200</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Política de devolução de 30 dias</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Garantia de 1 ano inclusa</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição do Produto</h3>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900">Especificações</h3>
          <div className="space-y-3">
            {Object.entries(product.specifications).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2">
                <span className="text-sm text-gray-600">{k}</span>
                <span className="text-sm font-medium text-gray-900">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

