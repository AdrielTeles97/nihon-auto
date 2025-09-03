'use client';

import React from 'react';
import Link from 'next/link';
import { ProductCardImage } from '@/components/ui/ProductImage';
import { ShoppingCart } from 'lucide-react';
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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);

  if (viewMode === 'list') {
    return (
      <div className="group relative flex h-full overflow-hidden rounded-xl border border-gray-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl">
        <Link
          href={`/produtos/${product.slug}`}
          className="relative h-48 w-48 shrink-0 overflow-hidden bg-gray-100"
        >
          <ProductCardImage
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900">
                Fora de Estoque
              </span>
            </div>
          )}
        </Link>
        <div className="relative flex flex-1 flex-col p-6">
          <Link href={`/produtos/${product.slug}`} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600">
              {product.name}
            </h3>
            <span className="inline-block rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
              {product.category}
            </span>
            <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
              {product.description}
            </p>
          </Link>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            <div className="flex gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={handleWhatsApp}
                className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
              >
                Orçamento
              </Button>
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300"
              >
                {product.inStock ? 'Adicionar' : 'Indisponível'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-100">
        <Link href={`/produtos/${product.slug}`}>
          <ProductCardImage
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900">
              Fora de Estoque
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            <Link href={`/produtos/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">
          {formatPrice(product.price)}
        </p>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleWhatsApp}
            className="border-white text-white hover:bg-white hover:text-gray-900"
          >
            Orçamento
          </Button>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300"
          >
            <ShoppingCart className="h-4 w-4" />
            {product.inStock ? 'Adicionar' : 'Indisponível'}
          </Button>
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
          <div className="h-32 w-32 shrink-0 animate-pulse bg-gray-200" />
          <div className="flex flex-1 justify-between p-4">
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/4 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="ml-4 flex flex-col items-end justify-between">
              <div className="space-y-1">
                <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-hidden">
      <div className="aspect-square animate-pulse bg-gray-200" />
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="space-y-1">
          <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
      </CardFooter>
    </Card>
  );
}

