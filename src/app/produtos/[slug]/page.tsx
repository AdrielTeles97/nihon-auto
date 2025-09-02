'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
    ProductDetailImage,
    ProductThumbnailImage
} from '@/components/ui/ProductImage'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/types'
import { getProductBySlug } from '@/services/wordpress'
import {
    ShoppingCart,
    Heart,
    Share2,
    Shield,
    RotateCcw,
    Plus,
    Minus,
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function ProductDetailPage() {
    const params = useParams()
    const { addToCart } = useCart()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [activeTab, setActiveTab] = useState('specifications')

    // Carregar produto do WordPress
    useEffect(() => {
        const loadProduct = async () => {
            if (!params.slug) return

            try {
                setLoading(true)
                setError(null)

                const productData = await getProductBySlug(
                    params.slug as string
                )
                setProduct(productData)
            } catch (err) {
                console.error('Erro ao carregar produto:', err)
                setError(
                    'Produto não encontrado ou erro ao carregar do WordPress.'
                )

                // Fallback para produtos mock
                const mockProducts: Product[] = [
                    {
                        id: 1,
                        name: 'Espuma Mágica Gatlub 4 em 1',
                        description:
                            'Espuma para limpeza automotiva com fórmula avançada que remove sujeira, gordura e resíduos sem danificar a pintura. Produto desenvolvido especialmente para detalhamento automotivo profissional.',
                        price: 29.9,
                        image: '/placeholder-product.svg',
                        category: 'Limpeza',
                        brand: 'Gatlub',
                        inStock: true,
                        slug: 'espuma-magica-gatlub-4em1',
                        images: [
                            '/placeholder-product.svg',
                            '/placeholder-product.svg',
                            '/placeholder-product.svg'
                        ],
                        specifications: {
                            Volume: '500ml',
                            Tipo: 'Espuma ativa',
                            pH: 'Neutro',
                            Aplicação: 'Externa'
                        },
                        features: [
                            'Remove sujeira pesada',
                            'Não danifica a pintura',
                            'Fórmula biodegradável',
                            'Rendimento de até 20 lavagens'
                        ]
                    },
                    {
                        id: 2,
                        name: 'Kit Essencial 3M',
                        description:
                            'Kit completo para detalhamento automotivo com produtos profissionais da 3M.',
                        price: 159.9,
                        image: '/placeholder-product.svg',
                        category: 'Kits',
                        brand: '3M',
                        inStock: true,
                        slug: 'kit-essencial-3m',
                        images: [
                            '/placeholder-product.svg',
                            '/placeholder-product.svg'
                        ],
                        specifications: {
                            Itens: '5 produtos',
                            Marca: '3M',
                            Tipo: 'Kit completo'
                        },
                        features: [
                            'Produtos originais 3M',
                            'Kit completo para detalhamento',
                            'Economia de até 30%',
                            'Ideal para iniciantes'
                        ]
                    }
                ]

                const foundProduct = mockProducts.find(
                    p => p.slug === params.slug
                )
                setProduct(foundProduct || null)
            } finally {
                setLoading(false)
            }
        }

        loadProduct()
    }, [params.slug])

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity)
            toast.success(`${product.name} adicionado ao carrinho!`)
        }
    }

    const handleQuantityChange = (delta: number) => {
        setQuantity(Math.max(1, quantity + delta))
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product?.name,
                text: product?.description,
                url: window.location.href
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast.success('Link copiado para a área de transferência!')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-gray-200 aspect-square rounded-lg"></div>
                            <div className="space-y-4">
                                <div className="h-8 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">
                            {error
                                ? 'Erro ao carregar produto'
                                : 'Produto não encontrado'}
                        </h1>
                        <p className="text-gray-600 mb-4">
                            {error ||
                                'O produto que você está procurando não existe.'}
                        </p>
                        {error && (
                            <p className="text-sm text-gray-500 mb-8">
                                Verifique se o WordPress está rodando em{' '}
                                <a
                                    href="http://localhost:8080"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                >
                                    http://localhost:8080
                                </a>
                            </p>
                        )}
                        <Link href="/produtos">
                            <Button>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar aos produtos
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const images = product.images || [product.image]

    return (
        <div className="min-h-screen bg-white pt-20">
            <Header />

            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4 border-b">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link
                            href="/"
                            className="hover:text-red-600 transition-colors"
                        >
                            Início
                        </Link>
                        <span>/</span>
                        <Link
                            href="/produtos"
                            className="hover:text-red-600 transition-colors"
                        >
                            Produtos
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">
                            {product.name}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Product Details */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Images Gallery */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className="relative group">
                            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-lg max-w-lg mx-auto lg:mx-0 relative">
                                <ProductDetailImage
                                    src={images[selectedImage]}
                                    alt={product.name}
                                />
                                {/* Image Counter */}
                                {images.length > 1 && (
                                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {selectedImage + 1} / {images.length}
                                    </div>
                                )}
                                {/* Zoom Indicator */}
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <span className="text-xs text-gray-600 font-medium">
                                        🔍 Clique para ampliar
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        {images.length > 1 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-gray-700 text-center lg:text-left">
                                    Mais imagens
                                </h4>
                                <div className="flex space-x-3 justify-center lg:justify-start overflow-x-auto pb-2">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedImage(index)
                                            }
                                            className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                                selectedImage === index
                                                    ? 'border-red-500 ring-2 ring-red-200 shadow-lg scale-105'
                                                    : 'border-gray-200 hover:border-red-300 hover:shadow-md'
                                            }`}
                                        >
                                            <ProductThumbnailImage
                                                src={image}
                                                alt={`${product.name} ${
                                                    index + 1
                                                }`}
                                            />
                                            {selectedImage === index && (
                                                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Image Actions */}
                        <div className="flex items-center justify-center lg:justify-start space-x-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-600 hover:text-red-600 border-gray-300"
                            >
                                <Heart className="w-4 h-4 mr-2" />
                                Favoritar
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-600 hover:text-red-600 border-gray-300"
                                onClick={handleShare}
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Compartilhar
                            </Button>
                        </div>
                    </div>

                    {/* Promotional Banner */}
                    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white mb-8 shadow-lg">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="flex-1 mb-4 md:mb-0">
                                <h3 className="text-xl font-bold mb-2">
                                    🚚 Frete Grátis para Todo o Brasil
                                </h3>
                                <p className="text-red-100">
                                    Em compras acima de R$ 299,00 • Entrega
                                    expressa disponível
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">
                                        24h
                                    </div>
                                    <div className="text-xs text-red-200">
                                        Envio Rápido
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">
                                        30d
                                    </div>
                                    <div className="text-xs text-red-200">
                                        Garantia
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center mb-2">
                                <Badge
                                    variant="outline"
                                    className="bg-red-50 text-red-700 border-red-200"
                                >
                                    {product.category}
                                </Badge>
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {product.name}
                            </h1>

                            {product.brand && (
                                <p className="text-lg text-gray-600 mb-4">
                                    Marca:{' '}
                                    <span className="font-semibold">
                                        {product.brand}
                                    </span>
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="text-3xl font-bold text-red-600 mb-4">
                                R$ {product.price.toFixed(2).replace('.', ',')}
                            </div>

                            {product.inStock ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                    Em estoque
                                </Badge>
                            ) : (
                                <Badge variant="destructive">
                                    Fora de estoque
                                </Badge>
                            )}
                        </div>

                        <p className="text-gray-700 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Quantity and Add to Cart */}
                        {product.inStock && (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-medium text-gray-700">
                                        Quantidade:
                                    </span>
                                    <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleQuantityChange(-1)
                                            }
                                            disabled={quantity <= 1}
                                            className="hover:bg-gray-100 disabled:opacity-50"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                                            {quantity}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleQuantityChange(1)
                                            }
                                            className="hover:bg-gray-100"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleAddToCart}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                                    size="lg"
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Adicionar ao Carrinho
                                </Button>
                            </div>
                        )}

                        {/* Benefits */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Shield className="h-4 w-4" />
                                <span>Garantia de qualidade</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <RotateCcw className="h-4 w-4" />
                                <span>Troca em 30 dias</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                {/* Product Information Tabs */}
                <div className="mt-16">
                    <Card className="border border-gray-200 shadow-lg overflow-hidden">
                        {/* Tab Navigation */}
                        <div className="bg-white border-b border-gray-200">
                            <div className="flex space-x-0">
                                <button
                                    onClick={() =>
                                        setActiveTab('specifications')
                                    }
                                    className={`px-8 py-4 font-semibold text-sm uppercase tracking-wide transition-all duration-300 relative ${
                                        activeTab === 'specifications'
                                            ? 'text-red-600 bg-red-50 border-b-2 border-red-600'
                                            : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                                    }`}
                                >
                                    Especificações
                                    {activeTab === 'specifications' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`px-8 py-4 font-semibold text-sm uppercase tracking-wide transition-all duration-300 relative ${
                                        activeTab === 'description'
                                            ? 'text-red-600 bg-red-50 border-b-2 border-red-600'
                                            : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                                    }`}
                                >
                                    Descrição
                                    {activeTab === 'description' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600"></div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <CardContent className="p-8">
                            {/* Specifications Tab */}
                            {activeTab === 'specifications' && (
                                <div className="space-y-8">
                                    {product.specifications && (
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                                <div className="w-1 h-8 bg-red-600 rounded-full mr-4"></div>
                                                Especificações Técnicas
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {Object.entries(
                                                    product.specifications
                                                ).map(([key, value], index) => (
                                                    <div
                                                        key={key}
                                                        className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:border-red-300 hover:shadow-lg transition-all duration-300 group"
                                                    >
                                                        <div className="flex flex-col space-y-3">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="w-3 h-3 bg-red-600 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                                                                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                                                    {key}
                                                                </span>
                                                            </div>
                                                            <span className="text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-300">
                                                                {value}
                                                            </span>
                                                        </div>
                                                        <div className="mt-4 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {product.features && (
                                        <div className="mt-12">
                                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                                <div className="w-1 h-8 bg-red-600 rounded-full mr-4"></div>
                                                Características Principais
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {product.features.map(
                                                    (feature, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-md transition-all duration-300 group"
                                                        >
                                                            <div className="w-3 h-3 bg-red-600 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                                                            <span className="text-gray-700 font-semibold group-hover:text-red-600 transition-colors duration-300">
                                                                {feature}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Description Tab */}
                            {activeTab === 'description' && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                        <div className="w-1 h-8 bg-red-600 rounded-full mr-4"></div>
                                        Descrição do Produto
                                    </h3>
                                    <div className="prose prose-lg max-w-none">
                                        <p className="text-gray-700 leading-relaxed text-lg">
                                            {product.description ||
                                                'Este produto oferece qualidade excepcional e tecnologia avançada, proporcionando uma experiência única para o usuário. Desenvolvido com os mais altos padrões de qualidade, combina design elegante com funcionalidade superior.'}
                                        </p>
                                        <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border-l-4 border-red-600">
                                            <h4 className="text-xl font-bold text-gray-800 mb-3">
                                                Destaques do Produto
                                            </h4>
                                            <ul className="space-y-2 text-gray-700">
                                                <li className="flex items-center space-x-3">
                                                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                                    <span>
                                                        Qualidade premium
                                                        garantida
                                                    </span>
                                                </li>
                                                <li className="flex items-center space-x-3">
                                                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                                    <span>
                                                        Tecnologia de ponta
                                                    </span>
                                                </li>
                                                <li className="flex items-center space-x-3">
                                                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                                    <span>
                                                        Design moderno e
                                                        elegante
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Related Products Section */}
            <div className="bg-gray-50 py-16 mt-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Produtos Relacionados
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Descubra outros produtos que podem interessar você
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Related Product Card 1 */}
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">
                                        Produto Relacionado
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                                    Produto Relacionado 1
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-red-600">
                                        R$ 199,90
                                    </span>
                                    <Button
                                        size="sm"
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Ver
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Related Product Card 2 */}
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">
                                        Produto Relacionado
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                                    Produto Relacionado 2
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-red-600">
                                        R$ 299,90
                                    </span>
                                    <Button
                                        size="sm"
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Ver
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Related Product Card 3 */}
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">
                                        Produto Relacionado
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                                    Produto Relacionado 3
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-red-600">
                                        R$ 399,90
                                    </span>
                                    <Button
                                        size="sm"
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Ver
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Related Product Card 4 */}
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">
                                        Produto Relacionado
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                                    Produto Relacionado 4
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-red-600">
                                        R$ 499,90
                                    </span>
                                    <Button
                                        size="sm"
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Ver
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-16">
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
