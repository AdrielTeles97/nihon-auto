'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Product {
    id: number
    name: string
    price: number
    image: string
    category: string
    slug: string
    brand?: string
    description?: string
}

interface Supplier {
    id: number
    name: string
    slug: string
    logo?: string
    description?: string
    website?: string
    featured?: boolean
    products?: Product[]
    banner?: string
    video?: string
    categoryCount?: number
    totalProducts?: number
    categories?: string[]
}

export function SupplierSections() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showAll, setShowAll] = useState(false)

    // Limitar quantidade de fornecedores exibidos
    const maxSuppliersToShow = 6
    const suppliersToDisplay = showAll
        ? suppliers
        : suppliers.slice(0, maxSuppliersToShow)

    // Função para gerar descrição dinâmica baseada na marca
    const getSupplierDescription = (supplier: Supplier) => {
        if (
            supplier.description &&
            supplier.description !==
                `Produtos premium da marca ${supplier.name} para cuidado automotivo.`
        ) {
            return supplier.description
        }

        // Descrições personalizadas baseadas no nome da marca
        const descriptions: { [key: string]: string } = {
            toyota: 'Peças originais e acessórios premium para veículos Toyota. Qualidade japonesa garantida.',
            honda: 'Componentes automotivos Honda com tecnologia avançada e durabilidade excepcional.',
            nissan: 'Produtos Nissan originais para máximo desempenho e confiabilidade do seu veículo.',
            yamaha: 'Acessórios e peças Yamaha com a precisão e qualidade que você já conhece.',
            wolks: 'Soluções automotivas Wolks com inovação e qualidade para seu veículo.',
            mazda: 'Peças e acessórios Mazda para manter a performance e elegância do seu carro.',
            mitsubishi:
                'Componentes Mitsubishi de alta qualidade para resistência e durabilidade.',
            subaru: 'Produtos Subaru desenvolvidos para aventura e performance em qualquer terreno.',
            lexus: 'Acessórios premium Lexus para o máximo em luxo e sofisticação automotiva.',
            infiniti:
                'Peças Infiniti com tecnologia de ponta para performance excepcional.'
        }

        const brandKey = supplier.name.toLowerCase()
        return (
            descriptions[brandKey] ||
            'Produtos automotivos premium com qualidade superior e garantia de excelência.'
        )
    }

    useEffect(() => {
        async function fetchSuppliers() {
            try {
                const response = await fetch('/api/suppliers?products=true')
                if (!response.ok) {
                    throw new Error('Falha ao buscar fornecedores')
                }
                const data = await response.json()
                setSuppliers(data.data || data) // Aceita tanto { data: [...] } quanto [...]
            } catch (err) {
                console.error('Erro ao buscar fornecedores:', err)
                setError(
                    err instanceof Error ? err.message : 'Erro desconhecido'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchSuppliers()
    }, [])

    if (loading) {
        return (
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        Carregando fornecedores...
                    </p>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <div className="text-center">
                    <p className="text-red-600">Erro: {error}</p>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            {/* Título da Seção */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-black mb-2">
                    MARCAS <span className="text-red-600">DESTAQUE</span>
                </h2>
                <div className="w-24 h-1 bg-red-600 mx-auto"></div>
            </div>

            {/* Renderizar cada fornecedor */}
            <div className="space-y-12">
                {suppliersToDisplay &&
                Array.isArray(suppliersToDisplay) &&
                suppliersToDisplay.length > 0 ? (
                    suppliersToDisplay.map(supplier => (
                        <Card
                            key={supplier.id}
                            className="overflow-hidden border-0 shadow-xl"
                        >
                            <div className="grid lg:grid-cols-3 min-h-[600px]">
                                {/* Banner da Marca - Lado Esquerdo */}
                                <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-900 flex flex-col justify-between p-8 text-white">
                                    <div className="absolute inset-0 bg-black/10"></div>

                                    {/* Logo da Marca */}
                                    <div className="relative z-10">
                                        <div className="bg-white rounded-lg p-6 inline-block mb-6">
                                            <h3 className="text-3xl font-bold text-red-600">
                                                {supplier.name.toUpperCase()}
                                            </h3>
                                            <p className="text-gray-600 text-sm font-medium">
                                                {supplier.totalProducts
                                                    ? `${supplier.totalProducts} produtos`
                                                    : 'Produtos premium'}
                                            </p>
                                        </div>

                                        <h4 className="text-2xl font-bold mb-4 text-balance">
                                            {getSupplierDescription(supplier)}
                                        </h4>
                                        <p className="text-red-100 text-lg leading-relaxed">
                                            Descubra nossa linha completa de
                                            produtos profissionais para deixar
                                            seu veículo impecável.
                                        </p>
                                    </div>

                                    {/* Botão para página do fornecedor */}
                                    <div className="relative z-10">
                                        <Button className="bg-white text-red-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 text-lg">
                                            Ver Todos os Produtos
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Produtos - Lado Direito */}
                                <div className="bg-gray-50 p-8 lg:col-span-2">
                                    {supplier.products &&
                                    supplier.products.length > 0 ? (
                                        <div className="flex gap-4 overflow-x-auto pb-4 h-full items-center">
                                            {supplier.products
                                                .slice(0, 4)
                                                .map(produto => (
                                                    <Card
                                                        key={produto.id}
                                                        className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-red-300 bg-white flex-shrink-0 w-64"
                                                    >
                                                        <CardContent className="p-4">
                                                            <div className="aspect-square bg-white rounded-lg mb-3 overflow-hidden border border-gray-100 relative">
                                                                <Image
                                                                    src={
                                                                        produto.image ||
                                                                        '/placeholder-product.svg'
                                                                    }
                                                                    alt={
                                                                        produto.name
                                                                    }
                                                                    fill
                                                                    className="object-contain group-hover:scale-105 transition-transform duration-300 p-2"
                                                                />
                                                            </div>

                                                            <div className="space-y-1 mb-3">
                                                                <h4 className="font-bold text-black text-sm leading-tight uppercase">
                                                                    {
                                                                        produto.name
                                                                    }
                                                                </h4>
                                                                <p className="text-gray-600 text-sm">
                                                                    {produto.description ||
                                                                        produto.category}
                                                                </p>
                                                                <p className="text-red-600 font-bold text-lg">
                                                                    {produto.price
                                                                        ? `R$ ${produto.price.toFixed(
                                                                              2
                                                                          )}`
                                                                        : 'Consulte'}
                                                                </p>
                                                            </div>

                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full border border-gray-300 text-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 font-bold text-sm bg-transparent"
                                                            >
                                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                                ORÇAR
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                                    Em Breve
                                                </h3>
                                                <p className="text-gray-500">
                                                    Produtos desta marca
                                                    chegando em breve!
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center">
                        <p className="text-gray-600">
                            Nenhum fornecedor encontrado.
                        </p>
                    </div>
                )}
            </div>

            {/* Botão Ver Mais Marcas */}
            {suppliers.length > maxSuppliersToShow && (
                <div className="text-center mt-12">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 text-lg"
                    >
                        {showAll
                            ? 'Ver Menos Marcas'
                            : `Ver Mais Marcas (+${
                                  suppliers.length - maxSuppliersToShow
                              })`}
                        <ArrowRight
                            className={`w-5 h-5 ml-2 transition-transform duration-300 ${
                                showAll ? 'rotate-180' : ''
                            }`}
                        />
                    </button>
                </div>
            )}
        </section>
    )
}
