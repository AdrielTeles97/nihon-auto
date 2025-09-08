import React from 'react'
import { ProductsGrid } from '@/components/sections/ProductsGrid'
import { WhyChooseSection } from '@/components/sections/WhyChooseSection'
import { CategoriesSection } from '@/components/sections/CategoriesSection'
import { CallToActionSection } from '@/components/sections/CallToActionSection'

export function ProductsSection() {
    return (
        <>
            <ProductsGrid />
            <WhyChooseSection />
            <CategoriesSection />
            <CallToActionSection />
        </>
    )
}

export default ProductsSection
