'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { demoProducts } from '@/data/products'
import { useCart } from '@/contexts/cart-context'
import { useRouter } from 'next/navigation'

const productTypes = [
    { name: 'ABA CRAZY', count: 8 },
    { name: 'ABRAÇADEIRA', count: 28 },
    { name: 'ACABAMENTO DO APOIO BRAÇO', count: 6 },
    { name: 'ACENDEDOR DE CIGARRO', count: 1 },
    { name: 'ADAPTADOR', count: 28 },
    { name: 'ADESIVO', count: 21 },
    { name: 'AERODUTO', count: 4 },
    { name: 'AEROFOLIO', count: 35 }
]

const manufacturers = [
    { name: 'VESTCAR', count: 17 },
    { name: 'VHIP', count: 84 },
    { name: 'VNC', count: 3 },
    { name: 'VONDER', count: 122 },
    { name: 'WESTERN', count: 83 },
    { name: 'WILLTEC', count: 17 },
    { name: 'WORLD FILM', count: 88 },
    { name: 'WORLDCOMP', count: 3 }
]

const products = [
    {
        id: 'MC-67963',
        name: 'ABRAÇADEIRA CINTA NYLON 14X5.6MM 20 UND',
        image: '/images/placeholder-product.svg',
        code: 'MC-67963'
    },
    {
        id: 'MC-88688',
        name: 'ABRAÇADEIRA CINTA NYLON 2.5X10CM PR (100 UN)',
        image: '/images/placeholder-product.svg',
        code: 'MC-88688'
    },
    {
        id: 'MC-6584',
        name: 'ABRAÇADEIRA CINTA NYLON 2.5X10CM PR (200 UN)',
        image: '/images/placeholder-product.svg',
        code: 'MC-6584'
    },
    {
        id: 'MC-88683',
        name: 'ABRAÇADEIRA CINTA NYLON 3.6X15CM PR (100 UN)',
        image: '/images/placeholder-product.svg',
        code: 'MC-88683'
    },
    {
        id: 'MC-6085',
        name: 'ABRAÇADEIRA CINTA NYLON 4.8X20CM PR (100 UN)',
        image: '/images/placeholder-product.svg',
        code: 'MC-6085'
    },
    {
        id: 'MC-88681',
        name: 'ABRAÇADEIRA CINTA NYLON 7.6X30CM PR (100 UN)',
        image: '/images/placeholder-product.svg',
        code: 'MC-88681'
    }
]

export function ProductsGrid() {
    const [showAllTypes, setShowAllTypes] = useState(false)
    const [showAllManufacturers, setShowAllManufacturers] = useState(false)
    const { addItem } = useCart()
    const router = useRouter()

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar com filtros */}
            <div className="lg:w-64 flex-shrink-0">
                <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b">
                        Filtrar produtos
                    </h3>

                    {/* Tipo de Produto */}
                    <div className="mb-6">
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                            TIPO DE PRODUTO
                            <ChevronDown className="h-4 w-4 ml-auto" />
                        </h4>
                        <div className="space-y-2">
                            {productTypes
                                .slice(
                                    0,
                                    showAllTypes ? productTypes.length : 5
                                )
                                .map(type => (
                                    <div
                                        key={type.name}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="mr-2"
                                            />
                                            <span className="text-blue-600 hover:underline">
                                                {type.name}
                                            </span>
                                        </label>
                                        <span className="text-gray-500">
                                            ({type.count})
                                        </span>
                                    </div>
                                ))}
                            {!showAllTypes && (
                                <button
                                    onClick={() => setShowAllTypes(true)}
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    Ver mais...
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Fabricantes */}
                    <div>
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                            FABRICANTES
                            <ChevronDown className="h-4 w-4 ml-auto" />
                        </h4>
                        <div className="space-y-2">
                            {manufacturers
                                .slice(
                                    0,
                                    showAllManufacturers
                                        ? manufacturers.length
                                        : 5
                                )
                                .map(manufacturer => (
                                    <div
                                        key={manufacturer.name}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="mr-2"
                                            />
                                            <span className="text-blue-600 hover:underline">
                                                {manufacturer.name}
                                            </span>
                                        </label>
                                        <span className="text-gray-500">
                                            ({manufacturer.count})
                                        </span>
                                    </div>
                                ))}
                            {!showAllManufacturers && (
                                <button
                                    onClick={() =>
                                        setShowAllManufacturers(true)
                                    }
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    Ver mais...
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de produtos */}
            <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {demoProducts.map(product => (
                        <Card
                            key={product.id}
                            className="hover:shadow-lg transition-shadow"
                        >
                            <CardContent className="p-4">
                                <Link href={`/produtos/${product.id}`}>
                                    <div className="aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden">
                                        <Image
                                            src={
                                                product.image || '/images/placeholder-product.svg'
                                            }
                                            alt={product.name}
                                            className="w-full h-full object-contain"
                                            width={200}
                                            height={200}
                                            unoptimized
                                        />
                                    </div>
                                </Link>
                                <div className="text-xs text-gray-500 mb-1">
                                    {product.slug ?? product.id}
                                </div>
                                <Link href={`/produtos/${product.id}`} className="block">
                                    <h3 className="font-medium text-sm text-gray-800 mb-3 line-clamp-2 hover:underline">
                                        {product.name}
                                    </h3>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-red-600 border-red-600 hover:bg-red-50 bg-transparent mb-4 cursor-pointer"
                                >
                                    Orçamento
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-red-600 border-red-600 hover:bg-red-50 bg-transparent cursor-pointer"
                                    onClick={() => { addItem(product as any, 1); router.push('/carrinho') }}
                                >
                                    Adicionar ao carinho
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
