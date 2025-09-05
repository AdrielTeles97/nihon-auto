import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const products = [
    {
        id: 1,
        name: 'Abraçadeira Cinta Nylon 200mm x8 (100 UN)',
        category: 'Abraçadeiras',
        image: '/images/placeholder-product.svg',
        inStock: true,
        featured: true
    },
    {
        id: 2,
        name: 'Abraçadeira Cinta Nylon 150mm x6 (100 UN)',
        category: 'Abraçadeiras',
        image: '/images/placeholder-product.svg',
        inStock: true,
        featured: false
    },
    {
        id: 3,
        name: 'Abraçadeira Cinta Nylon 300mm x10 (50 UN)',
        category: 'Abraçadeiras',
        image: '/images/placeholder-product.svg',
        inStock: true,
        featured: false
    },
    {
        id: 4,
        name: 'Conector RJ45 Cat6 Blindado (100 UN)',
        category: 'Conectores',
        image: '/images/placeholder-product.svg',
        inStock: true,
        featured: true
    },
    {
        id: 5,
        name: 'Cabo de Rede Cat6 UTP 305m Azul',
        category: 'Cabos',
        image: '/images/placeholder-product.svg',
        inStock: false,
        featured: false
    },
    {
        id: 6,
        name: 'Organizador de Cabos 1U Rack',
        category: 'Organizadores',
        image: '/images/placeholder-product.svg',
        inStock: true,
        featured: false
    }
]

const categories = [
    'Todos',
    'Abraçadeiras',
    'Conectores',
    'Cabos',
    'Organizadores'
]

export function ProductsSection() {
    return (
        <section id="produtos" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-playfair text-3xl lg:text-4xl font-bold mb-4">
                        Nossos Produtos
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
                        Equipamentos profissionais de telecomunicações com
                        qualidade garantida para suas instalações e projetos.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map(category => (
                        <Button
                            key={category}
                            variant={
                                category === 'Todos' ? 'default' : 'outline'
                            }
                            size="sm"
                            className="rounded-full"
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <Card
                            key={product.id}
                            className="group hover:shadow-lg transition-all duration-300 border-border/50"
                        >
                            <CardHeader className="p-0">
                                <div className="relative overflow-hidden rounded-t-lg h-48">
                                    <Image
                                        src={product.image || '/images/placeholder-product.svg'}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority={false}
                                      />
                                    {product.featured && (
                                        <Badge className="absolute top-3 left-3 bg-accent">
                                            Destaque
                                        </Badge>
                                    )}
                                    {!product.inStock && (
                                        <Badge
                                            variant="destructive"
                                            className="absolute top-3 right-3"
                                        >
                                            Esgotado
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {product.category}
                                    </Badge>
                                    <CardTitle className="text-sm font-medium leading-tight text-balance">
                                        {product.name}
                                    </CardTitle>
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 pt-0 flex gap-2">
                                <Button
                                    size="sm"
                                    className="flex-1"
                                    disabled={!product.inStock}
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    {product.inStock
                                        ? 'Adicionar no carinho'
                                        : 'Indisponível'}
                                </Button>
                                <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/produtos">
                            Ver Todos os Produtos
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
