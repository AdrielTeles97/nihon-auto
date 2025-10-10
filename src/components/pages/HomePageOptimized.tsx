'use client'

import React, { Suspense } from 'react'
import HeroSection from '@/components/hero-section'
import { BrandsCarouselOptimized } from '@/components/sections/BrandsCarouselOptimized'
import { ProductsGridOptimized } from '@/components/sections/ProductsGridOptimized'
import { CallToActionSection } from '@/components/sections/CallToActionSection'
import { CategoriesSection } from '@/components/sections/CategoriesSection'
import { WhyChooseSection } from '@/components/sections/WhyChooseSection'
import {
    ProductsGridSkeleton,
    BrandsCarouselSkeleton
} from '@/components/ui/brands-skeleton'

// Componente de loading para a página inicial
function HomePageSkeleton() {
    return (
        <div className="min-h-screen">
            {/* Hero Section Skeleton */}
            <div className="h-screen bg-gray-100 animate-pulse">
                <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                        <div className="h-12 bg-gray-200 rounded-lg w-96 mx-auto mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
                        <div className="flex gap-4 justify-center">
                            <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
                            <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Brands Section Skeleton */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <BrandsCarouselSkeleton />
                </div>
            </div>

            {/* Products Section Skeleton */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <ProductsGridSkeleton count={6} />
                </div>
            </div>
        </div>
    )
}

// Componente principal da página inicial
function HomePageContent() {
    return (
        <div className="min-h-screen">
            {/* Hero Section - Carrega instantaneamente */}
            <HeroSection />

            {/* Brands Section - Com Suspense */}
            <Suspense fallback={<BrandsCarouselSkeleton />}>
                <BrandsCarouselOptimized />
            </Suspense>

            {/* Categories Section - Carrega instantaneamente */}
            <Suspense
                fallback={
                    <div className="py-16 bg-gray-50">
                        <div className="h-64 bg-gray-200 rounded-lg mx-4"></div>
                    </div>
                }
            >
                <CategoriesSection />
            </Suspense>

            {/* Products Section - Com carregamento progressivo */}
            <Suspense fallback={<ProductsGridSkeleton count={6} />}>
                <ProductsGridOptimized />
            </Suspense>

            {/* Why Choose Section - Carrega instantaneamente */}
            <Suspense
                fallback={
                    <div className="py-16 bg-gray-50">
                        <div className="h-64 bg-gray-200 rounded-lg mx-4"></div>
                    </div>
                }
            >
                <WhyChooseSection />
            </Suspense>

            {/* Call to Action Section - Carrega instantaneamente */}
            <Suspense
                fallback={
                    <div className="py-16 bg-red-600">
                        <div className="h-32 bg-red-700 rounded-lg mx-4"></div>
                    </div>
                }
            >
                <CallToActionSection />
            </Suspense>
        </div>
    )
}

export function HomePageOptimized() {
    return (
        <Suspense fallback={<HomePageSkeleton />}>
            <HomePageContent />
        </Suspense>
    )
}
