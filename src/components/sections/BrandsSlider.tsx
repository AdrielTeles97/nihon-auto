'use client'
import { useEffect, useState } from 'react'
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider'
import Image from 'next/image'
import type { Brand } from '@/types/brands'

interface BrandsSliderProps {
    limit?: number
    speed?: number
    speedOnHover?: number
    gap?: number
}

export function BrandsSlider({
    limit = 12,
    speed = 40,
    speedOnHover = 20,
    gap = 112
}: BrandsSliderProps) {
    const [brands, setBrands] = useState<Brand[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchBrands() {
            try {
                setLoading(true)
                const response = await fetch(
                    `/api/brands?limit=${limit}&orderBy=id&order=desc`
                )

                if (!response.ok) {
                    throw new Error('Erro ao carregar marcas')
                }

                const data = await response.json()

                if (data.success && Array.isArray(data.data)) {
                    // Filtrar apenas marcas com imagem/logo
                    const brandsWithImages = data.data.filter(
                        (brand: Brand) =>
                            brand.image && brand.image.trim() !== ''
                    )
                    setBrands(brandsWithImages)
                } else {
                    throw new Error('Dados inválidos recebidos da API')
                }
            } catch (err) {
                console.error('Erro ao buscar marcas:', err)
                setError(
                    err instanceof Error ? err.message : 'Erro desconhecido'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchBrands()
    }, [limit])

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-pulse text-sm text-muted-foreground">
                    Carregando marcas...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center py-8">
                <div className="text-sm text-red-500">{error}</div>
            </div>
        )
    }

    if (brands.length === 0) {
        return (
            <div className="flex justify-center py-8">
                <div className="text-sm text-muted-foreground">
                    Nenhuma marca encontrada
                </div>
            </div>
        )
    }

    return (
        <div className="relative py-6 md:w-[calc(100%-11rem)]">
            <InfiniteSlider speedOnHover={speedOnHover} speed={speed} gap={gap}>
                {brands.map(brand => (
                    <div
                        key={brand.id}
                        className="flex items-center justify-center"
                    >
                        <Image
                            className="mx-auto h-8 w-auto object-contain dark:invert"
                            src={brand.image || '/images/placeholder-logo.svg'}
                            alt={`${brand.name} Logo`}
                            height={32}
                            width={120}
                            title={brand.name}
                            priority={false}
                            unoptimized={true}
                            onError={e => {
                                // Fallback para imagem de placeholder em caso de erro
                                const target = e.target as HTMLImageElement
                                target.src = '/images/placeholder-logo.svg'
                            }}
                        />
                    </div>
                ))}
            </InfiniteSlider>
        </div>
    )
}
