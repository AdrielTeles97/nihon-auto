'use client';

import React from 'react';
import Link from 'next/link';
import { ProductCardImage } from '@/components/ui/ProductImage';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Olá! Tenho interesse no produto: ${product.name}`;
    const url = getWhatsAppUrl(message);
    window.open(url, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-500 h-full flex flex-row border border-gray-100 hover:border-red-200 hover:-translate-y-1">
        <Link href={`/produtos/${product.slug}`}>
          <div className="relative w-48 h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
            <ProductCardImage
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Fora de Estoque
                </span>
              </div>
            )}
          </div>
        </Link>

        <div className="flex-1 flex flex-col p-6 relative">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <image href="/images/noise/noise-red.svg" width="100%" height="100%" className="object-cover" />
            </svg>
          </div>
          
          <Link href={`/produtos/${product.slug}`} className="flex-1 relative z-10">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-900 line-clamp-2 text-lg group-hover:text-red-600 transition-colors">
                  {product.name}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-block px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                  {product.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                {product.description}
              </p>
            </div>
          </Link>

          <div className="mt-6 flex items-center justify-between relative z-10">
            <div className="space-y-2">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-500 ml-1">(4.8)</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleWhatsApp}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
              >
                Orçamento
              </Button>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:bg-gray-300 text-white py-2 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {product.inStock ? 'Adicionar' : 'Indisponível'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-gray-100 hover:border-red-200 hover:-translate-y-2">
      <Link href={`/produtos/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <ProductCardImage
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Heart/Favorite icon */}
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
            <svg className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          {/* Quick View Button */}
          <button className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100">
            <Eye className="w-5 h-5 text-gray-600" />
          </button>

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                Fora de Estoque
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col relative">
        {/* Background Pattern */}
        <div className="absolute bottom-0 right-0 w-12 h-12 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <image href="/images/noise/noise-red.svg" width="100%" height="100%" className="object-cover" />
          </svg>
        </div>
        
        <Link href={`/produtos/${product.slug}`} className="flex-1 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-block px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                {product.category}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight text-lg group-hover:text-red-600 transition-colors">
              {product.name}
            </h3>
          </div>
        </Link>
        
        <div className="mt-4 space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 ml-1">(4.8)</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleWhatsApp}
              className="flex-1 h-10 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors font-medium"
            >
              Orçamento
            </Button>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 h-10 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-300 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-1"
            >
              <ShoppingCart className="w-4 h-4" />
              {product.inStock ? 'Adicionar' : 'Indisponível'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton({ viewMode = 'grid' }: { viewMode?: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden">
        <div className="flex">
          <div className="w-32 h-32 bg-gray-200 animate-pulse flex-shrink-0" />
          <div className="flex-1 p-4 flex justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
            <div className="ml-4 flex flex-col justify-between items-end">
              <div className="space-y-1">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
              </div>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-full">
      <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
        </div>
        <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
      </CardFooter>
    </Card>
  );
}
