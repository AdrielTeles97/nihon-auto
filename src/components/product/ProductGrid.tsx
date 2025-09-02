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
  viewMode = 'grid'
}: ProductGridProps) {
  if (loading) {
    return (
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "space-y-4"
      }>
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5M9 5v-.5"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhum produto encontrado
        </h3>
        <p className="text-gray-600 max-w-md">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' 
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      : "space-y-4"
    }>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
}

// Componente para exibir produtos em destaque
export function FeaturedProductGrid({ 
  products, 
  loading = false 
}: { 
  products: Product[]; 
  loading?: boolean; 
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.slice(0, 4).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}