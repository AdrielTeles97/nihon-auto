'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { Product, ProductFilters } from '@/types'
import { getProducts, getCategories } from '@/services/wordpress'

export default function ProdutosPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    )
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [categories, setCategories] = useState<string[]>([])
    const [brands, setBrands] = useState<string[]>([])

    // Carregar produtos do WordPress
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true)
                setError(null)

                const filters: ProductFilters = {}
                if (searchTerm) filters.search = searchTerm
                if (selectedCategory) filters.category = selectedCategory
                if (selectedBrand) filters.brand = selectedBrand

                const productsData = await getProducts(filters)
                setProducts(productsData.products)
                setFilteredProducts(productsData.products)

                // Extrair categorias e marcas únicas
                const uniqueCategories = [
                    ...new Set(
                        productsData.products
                            .map(p => p.category)
                            .filter(Boolean)
                    )
                ]
                const uniqueBrands = [
                    ...new Set(
                        productsData.products.map(p => p.brand).filter(Boolean)
                    )
                ]

                setCategories(uniqueCategories)
                setBrands(uniqueBrands)
            } catch (err) {
                console.error('Erro ao carregar produtos:', err)
                setError(
                    'Erro ao carregar produtos. Verifique se o WordPress está configurado corretamente.'
                )
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [searchTerm, selectedCategory, selectedBrand])

    const clearFilters = () => {
        setSearchTerm('')
        setSelectedCategory(null)
        setSelectedBrand(null)
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-gray-50 to-white py-20 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(239,68,68,0.1)_25%,transparent_25%),linear-gradient(-45deg,rgba(239,68,68,0.1)_25%,transparent_25%)] bg-[length:60px_60px]" />
                </div>

                <div className="container mx-auto px-4 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
                            <span className="font-light">Nossos</span>{' '}
                            <span className="text-red-600">Produtos</span>
                        </h1>
                        <p className="text-xl font-medium text-gray-700 mb-8 max-w-3xl mx-auto">
                            Descubra nossa linha completa de{' '}
                            <span className="font-semibold text-red-600">
                                produtos automotivos
                            </span>{' '}
                            das melhores marcas do mercado
                        </p>

                        {/* Banner space - can be used for promotional banners */}
                        <div className="mt-12 max-w-5xl mx-auto">
                            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white shadow-2xl">
                                <div className="flex flex-col md:flex-row items-center justify-between">
                                    <div className="text-left mb-4 md:mb-0">
                                        <h3 className="text-2xl font-bold mb-2">
                                            🔥 Ofertas Especiais
                                        </h3>
                                        <p className="text-red-100">
                                            Encontre produtos com até 30% de
                                            desconto
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <span className="bg-yellow-500 text-black px-3 py-1 rounded-full font-semibold">
                                            🚚 Frete Grátis
                                        </span>
                                        <span className="bg-white/20 px-3 py-1 rounded-full">
                                            💳 12x sem juros
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Error Message */}
            {error && (
                <section className="py-4 bg-red-50 border-b border-red-200">
                    <div className="container mx-auto px-4">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <p>{error}</p>
                            <p className="text-sm mt-2">
                                Certifique-se de que o WordPress está rodando em{' '}
                                <a
                                    href="http://localhost:8080"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                >
                                    http://localhost:8080
                                </a>
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Filters and Search */}
            <section className="py-8 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                type="text"
                                placeholder="Buscar produtos..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-11 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-lg shadow-sm"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3 items-center">
                            <span className="text-sm font-medium text-gray-700 mr-2">
                                Filtros:
                            </span>

                            {/* Categories */}
                            <div className="flex flex-wrap gap-2">
                                {categories.map(category => (
                                    <Badge
                                        key={category}
                                        variant={
                                            selectedCategory === category
                                                ? 'default'
                                                : 'outline'
                                        }
                                        className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                                            selectedCategory === category
                                                ? 'bg-red-600 hover:bg-red-700'
                                                : 'hover:border-red-500 hover:text-red-600'
                                        }`}
                                        onClick={() =>
                                            setSelectedCategory(
                                                selectedCategory === category
                                                    ? null
                                                    : category
                                            )
                                        }
                                    >
                                        {category}
                                    </Badge>
                                ))}
                            </div>

                            {/* Brands */}
                            <div className="flex flex-wrap gap-2">
                                {brands.map(brand => (
                                    <Badge
                                        key={brand}
                                        variant={
                                            selectedBrand === brand
                                                ? 'default'
                                                : 'outline'
                                        }
                                        className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                                            selectedBrand === brand
                                                ? 'bg-red-600 hover:bg-red-700'
                                                : 'hover:border-red-500 hover:text-red-600'
                                        }`}
                                        onClick={() =>
                                            setSelectedBrand(
                                                selectedBrand === brand
                                                    ? null
                                                    : brand
                                            )
                                        }
                                    >
                                        {brand}
                                    </Badge>
                                ))}
                            </div>

                            {(selectedCategory ||
                                selectedBrand ||
                                searchTerm) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="ml-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500 transition-all duration-200"
                                >
                                    ✕ Limpar filtros
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {loading ? (
                                    'Carregando produtos...'
                                ) : (
                                    <>
                                        {filteredProducts.length > 0 ? (
                                            <>
                                                {filteredProducts.length}{' '}
                                                produto
                                                {filteredProducts.length !== 1
                                                    ? 's'
                                                    : ''}{' '}
                                                encontrado
                                                {filteredProducts.length !== 1
                                                    ? 's'
                                                    : ''}
                                                {(selectedCategory ||
                                                    selectedBrand ||
                                                    searchTerm) && (
                                                    <span className="text-red-600">
                                                        {' '}
                                                        com filtros aplicados
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            'Nenhum produto encontrado'
                                        )}
                                    </>
                                )}
                            </h2>
                            {(selectedCategory ||
                                selectedBrand ||
                                searchTerm) && (
                                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                                    {searchTerm && (
                                        <span>
                                            Busca:{' '}
                                            <strong>
                                                &ldquo;{searchTerm}&rdquo;
                                            </strong>
                                        </span>
                                    )}
                                    {selectedCategory && (
                                        <span>
                                            Categoria:{' '}
                                            <strong>{selectedCategory}</strong>
                                        </span>
                                    )}
                                    {selectedBrand && (
                                        <span>
                                            Marca:{' '}
                                            <strong>{selectedBrand}</strong>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <ProductGrid
                            products={filteredProducts}
                            loading={loading}
                            viewMode={viewMode}
                            emptyMessage={
                                searchTerm || selectedCategory || selectedBrand
                                    ? 'Nenhum produto encontrado com os filtros aplicados. Tente remover alguns filtros.'
                                    : 'Nenhum produto disponível no momento.'
                            }
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        M
                                    </span>
                                </div>
                                <span className="text-xl font-bold">
                                    Nihon Auto
                                </span>
                            </div>
                            <p className="text-gray-400">
                                Mais de 38 anos oferecendo excelência na
                                distribuição de acessórios automotivos.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Produtos</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a
                                        href="/produtos"
                                        className="hover:text-white"
                                    >
                                        Todos os Produtos
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/categorias"
                                        className="hover:text-white"
                                    >
                                        Categorias
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/marcas"
                                        className="hover:text-white"
                                    >
                                        Marcas
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Empresa</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a
                                        href="/sobre"
                                        className="hover:text-white"
                                    >
                                        Sobre Nós
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/contato"
                                        className="hover:text-white"
                                    >
                                        Contato
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/termos"
                                        className="hover:text-white"
                                    >
                                        Termos de Uso
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Contato</h4>
                            <div className="space-y-2 text-gray-400">
                                <p>📧 vendas01@nihonauto.com.br</p>
                                <p>📱 (91) 5591-8237100</p>
                                <p>
                                    📍 Travessa José Pio, 541 - Umarizal -
                                    Belém/PA
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>
                            &copy; 2024 Nihon Acessórios Automotivos. Todos os
                            direitos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
