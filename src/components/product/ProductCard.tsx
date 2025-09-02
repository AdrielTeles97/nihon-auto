'use client';

import React from 'react';
import Link from 'next/link';
import { ProductCardImage } from '@/components/ui/ProductImage';
import { ShoppingCart, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
        <div className="flex">
          <Link href={`/produtos/${product.slug}`} className="flex-shrink-0">
            <div className="relative w-32 h-32 overflow-hidden bg-gray-50 rounded-lg p-2">
              <ProductCardImage src={product.image} alt={product.name} sizes="128px" className="object-contain" />

              {!product.inStock && (
                <Badge variant="destructive" className="absolute top-1 left-1 text-xs">
                  Fora de Estoque
                </Badge>
              )}
            </div>
          </Link>

          <div className="flex-1 p-4 flex justify-between gap-4">
            <div className="flex-1">
              <Link href={`/produtos/${product.slug}`}>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
                    {product.brand && (
                      <Badge variant="secondary" className="text-xs">
                        {product.brand}
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                </div>
              </Link>
            </div>

            <div className="flex flex-col items-end justify-between">
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.price > 100 && (
                  <p className="text-xs text-gray-500">ou 12x de {formatPrice(product.price / 12)}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleWhatsApp}>
                  Orçamento
                </Button>
                <Button size="sm" disabled={!product.inStock} onClick={handleAddToCart} className="bg-red-600 hover:bg-red-700">
                  {product.inStock ? (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Adicionar
                    </>
                  ) : (
                    'Indisponível'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden h-full flex flex-col rounded-2xl border-gray-200 hover:shadow-md transition-shadow">
      <Link href={`/produtos/${product.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 p-4">
          <ProductCardImage
            src={product.image}
            alt={product.name}
            className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />

          {!product.inStock && (
            <Badge variant="destructive" className="absolute top-3 left-3">
              Fora de Estoque
            </Badge>
          )}

          {product.brand && (
            <Badge variant="secondary" className="absolute top-3 right-3">
              {product.brand}
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-5 flex-1">
        <Link href={`/produtos/${product.slug}`}>
          <div className="space-y-2">
            <p className="text-[11px] text-gray-500 uppercase tracking-wide">{product.category}</p>
            <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[2.75rem]">{product.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
          </div>
        </Link>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex flex-col min-w-[8rem]">
          <span className="text-lg font-semibold text-gray-900">{formatPrice(product.price)}</span>
          {product.price > 100 && (
            <span className="text-xs text-gray-500">12x de {formatPrice(product.price / 12)}</span>
          )}
        </div>

        <div className="flex gap-2 ml-auto">
          <Button size="sm" variant="outline" onClick={handleWhatsApp} className="whitespace-nowrap">
            Orçamento
          </Button>
          <Button
            size="sm"
            disabled={!product.inStock}
            onClick={handleAddToCart}
            className="bg-red-600 hover:bg-red-700 whitespace-nowrap"
          >
            {product.inStock ? (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Adicionar
              </>
            ) : (
              "Indisponível"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
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
