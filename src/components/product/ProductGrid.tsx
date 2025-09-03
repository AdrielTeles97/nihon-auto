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
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        : "space-y-6"
      }>
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center py-16 text-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <image href="/images/waves.svg" width="100%" height="100%" className="object-cover" />
          </svg>
        </div>
        
        <div className="relative z-10">
          <div className="w-32 h-32 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <svg
              className="w-16 h-16 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5M9 5v-.5"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-600 max-w-md text-lg">
            {emptyMessage}
          </p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-red-600 to-red-800 rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-3">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <image href="/images/noise/noise-red.svg" width="100%" height="100%" className="object-cover" />
        </svg>
      </div>
      
      <div className={viewMode === 'grid' 
        ? "relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        : "relative z-10 space-y-6"
      }>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} viewMode={viewMode} />
        ))}
      </div>
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
      <div className="relative">
        <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <image href="/images/waves.svg" width="100%" height="100%" className="object-cover" />
          </svg>
        </div>
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute bottom-0 left-0 w-40 h-40 opacity-3">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <image href="/images/noise/noise-red.svg" width="100%" height="100%" className="object-cover" />
        </svg>
      </div>
      
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}