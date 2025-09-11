import React from 'react'
import ProductsGridServer from '@/components/sections/ProductsGridServer'
import { WhyChooseSection } from '@/components/sections/WhyChooseSection'
import { CategoriesSection } from '@/components/sections/CategoriesSection'
import { CallToActionSection } from '@/components/sections/CallToActionSection'

export function ProductsSection() {
    return (
        <>
            {/* Server wrapper pré-carrega 6 itens e injeta no client */}
            <ProductsGridServer />
            <WhyChooseSection />
            <CategoriesSection />
            <CallToActionSection />
        </>
    )
}

export default ProductsSection
