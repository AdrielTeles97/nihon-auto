'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
  inStock?: boolean;
  slug: string;
}

interface Supplier {
  id: string;
  name: string;
  logo: string;
  description: string;
  featured: boolean;
  products: Product[];
}

interface FornecedorCardProps {
  fornecedor: Supplier;
}

export default function FornecedorCard({ fornecedor }: FornecedorCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="group bg-white shadow-lg hover:shadow-2xl rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-50 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-50" />
      
      {/* Featured Badge */}
      {fornecedor.featured && (
        <Badge className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-xs font-semibold">
          ⭐ Destaque
        </Badge>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="relative">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 p-2 shadow-md group-hover:shadow-lg transition-shadow duration-300">
            <Image 
              src={fornecedor.logo || '/images/placeholder-logo.svg'} 
              alt={fornecedor.name}
              width={48}
              height={48}
              className="w-full h-full object-contain rounded-lg"
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder-logo.svg';
              }}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="font-bold text-xl text-gray-900 group-hover:text-red-600 transition-colors duration-300">
            {fornecedor.name}
          </h2>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {fornecedor.description || 'Descrição não disponível'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs px-2 py-1">
              {fornecedor.products.length} produtos
            </Badge>
          </div>
        </div>
      </div>

      {/* Products Carousel */}
      {fornecedor.products.length > 0 ? (
        <div className="mb-6 relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
            }}
            navigation={{
              nextEl: `.swiper-button-next-${fornecedor.id}`,
              prevEl: `.swiper-button-prev-${fornecedor.id}`,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="!pb-8"
          >
            {fornecedor.products.map((produto) => (
              <SwiperSlide key={produto.id}>
                <Link href={`/produtos/${produto.slug}`}>
                  <div className="group/product border border-gray-200 rounded-xl p-4 hover:border-red-300 hover:shadow-lg transition-all duration-300 bg-white cursor-pointer">
                    <div className="relative mb-3">
                      <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                        <Image
                            src={produto.image || '/images/placeholder-product.svg'}
                            alt={produto.name}
                            width={120}
                            height={120}
                            className="w-full h-full object-contain group-hover/product:scale-105 transition-transform duration-300"
                            unoptimized
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder-product.svg';
                            }}
                          />
                      </div>

                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover/product:text-red-600 transition-colors">
                        {produto.name}
                      </h3>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg font-bold text-red-600">
                          {formatPrice(produto.price)}
                        </span>
                        {produto.category && (
                          <Badge variant="secondary" className="text-xs">
                            {produto.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Navigation Buttons */}
          <button className={`swiper-button-prev-${fornecedor.id} absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-red-600 hover:shadow-xl transition-all duration-300 -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0`}>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
          <button className={`swiper-button-next-${fornecedor.id} absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-red-600 hover:shadow-xl transition-all duration-300 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0`}>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="mb-6 p-8 text-center text-gray-500 bg-gray-50 rounded-xl">
          <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">Nenhum produto disponível</p>
        </div>
      )}

      {/* CTA Section */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{fornecedor.products.length} produtos disponíveis</span>
        </div>
        
        <Link href={`/fornecedores/${fornecedor.id}`}>
          <Button 
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
          >
            Ver todos
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>
      </div>
    </div>
  );
}