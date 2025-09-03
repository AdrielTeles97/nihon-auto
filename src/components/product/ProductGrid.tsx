'use client';

import React from 'react';
import { Product } from '@/types';
import { ProductCard, ProductCardSkeleton } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
  viewMode?: 'grid' | 'list';
}

export function ProductGrid({
  products,
  loading = false,
  emptyMessage = 'Nenhum produto encontrado.',
  viewMode = 'grid',
}: ProductGridProps) {
  const gridClass =
    viewMode === 'grid'
      ? 'grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'
      : 'space-y-6';

  if (loading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <h3 className="mb-3 text-2xl font-bold text-gray-900">
          Nenhum produto encontrado
        </h3>
        <p className="text-lg text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
}

// Componente para exibir produtos em destaque
export function FeaturedProductGrid({
  products,
  loading = false,
}: {
  products: Product[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {products.slice(0, 4).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

