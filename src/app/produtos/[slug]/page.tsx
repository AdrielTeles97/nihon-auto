"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ProductDetailImage, ProductThumbnailImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types";
import { getProductBySlug } from "@/services/wordpress";
import { ShoppingCart, Plus, Minus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ProductSpecs } from "@/components/patterns/ProductSpecs";
import { Header } from "@/components/layout/Header";

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const p = await getProductBySlug(String(params.slug));
        if (!p) setError("Produto não encontrado");
        setProduct(p);
      } catch (e) {
        setError("Erro ao carregar produto");
      } finally {
        setLoading(false);
      }
    };
    if (params.slug) load();
  }, [params.slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const message = `Olá! Tenho interesse no produto: ${product.name}`;
    window.open(getWhatsAppUrl(message), "_blank");
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Carregando produto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold mb-2">Produto não encontrado</h1>
        <p className="text-gray-600 mb-6">O produto que você está procurando não existe.</p>
        <Link href="/produtos">
          <Button variant="default" className="bg-red-600 hover:bg-red-700">
            Voltar aos produtos
          </Button>
        </Link>
      </div>
    );
  }

  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const hasSpecs = product.specifications && Object.keys(product.specifications).length > 0;
  const hasExtraImages = Array.isArray(product.gallery) && product.gallery.length > 1;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/produtos" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <div className="space-y-4 lg:sticky lg:top-20 self-start">
            <div className="relative aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden p-4">
              <ProductDetailImage src={gallery[selectedImage]} alt={product.name} />
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden border ${
                      selectedImage === i ? "border-red-600" : "border-gray-200"
                    } bg-gray-50`}
                  >
                    <ProductThumbnailImage src={src} alt={`${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div>
              {product.brand && <Badge variant="secondary">{product.brand}</Badge>}
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
              <p className="text-gray-600 mt-2 max-w-prose">{product.description}</p>
            </div>

            <div className="flex items-end gap-4">
              <span className="text-3xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
              {product.price > 100 && (
                <span className="text-sm text-gray-500">ou 12x de {formatPrice(product.price / 12)}</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-lg border border-gray-200">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-50">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-50">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button onClick={handleAddToCart} className="bg-red-600 hover:bg-red-700">
                <ShoppingCart className="h-4 w-4 mr-2" /> Adicionar ao carrinho
              </Button>
              <Button variant="outline" onClick={handleWhatsApp}>Orçamento</Button>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mt-6">
                <h2 className="font-semibold text-gray-900 mb-3">Especificações</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                      <span className="text-gray-500">{k}</span>
                      <span className="text-gray-900 font-medium">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Specs & detail sections (show only when there is data to show) */}
      {(hasSpecs || hasExtraImages) && (
        <ProductSpecs
          title="The Fine Details"
          description="Conheça os detalhes que tornam este produto especial. Materiais de primeira linha, design funcional e durabilidade pensada para o dia a dia."
          gallery={gallery}
          specs={product.specifications ?? {}}
        />
      )}
    </div>
  );
}
