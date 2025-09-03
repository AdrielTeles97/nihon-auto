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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/produtos" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Voltar aos produtos
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
              <ProductDetailImage src={gallery[selectedImage]} alt={product.name} className="object-cover w-full h-full" />
              
              {/* Heart/Favorite icon */}
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === i ? "border-blue-600 ring-2 ring-blue-100" : "border-gray-200 hover:border-gray-300"
                    } bg-white`}
                  >
                    <ProductThumbnailImage src={src} alt={`${product.name} ${i + 1}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
            
            {/* Product Description below images */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição do Produto</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Product Info */}
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

            {/* Price */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</div>
              {product.price > 100 && (
                <p className="text-sm text-gray-500">ou 12x de {formatPrice(product.price / 12)} sem juros</p>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quantidade</label>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)} 
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

            {/* Product Features */}
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

            {/* Specifications */}
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
        </div>
      </div>
      
      {/* Additional Details Section */}
      {(hasSpecs || hasExtraImages) && (
        <div className="bg-white py-16">
          <ProductSpecs
            title="The Fine Details"
            description="Conheça os detalhes que tornam este produto especial. Materiais de primeira linha, design funcional e durabilidade pensada para o dia a dia."
            gallery={gallery}
            specs={product.specifications ?? {}}
          />
        </div>
      )}
    </div>
  );
}