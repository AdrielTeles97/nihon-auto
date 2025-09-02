'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight, Package, Sparkles, Wrench, Gift } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  productCount: number;
  slug: string;
  icon: React.ReactNode;
  color: string;
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock categories data
  const mockCategories: Category[] = [
    {
      id: 1,
      name: "Limpeza",
      description: "Produtos para limpeza e lavagem automotiva",
      image: "/placeholder-product.svg",
      productCount: 45,
      slug: "limpeza",
      icon: <Sparkles className="h-6 w-6" />,
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "Enceramento",
      description: "Ceras, selantes e produtos de proteção",
      image: "/placeholder-product.svg",
      productCount: 28,
      slug: "enceramento",
      icon: <Package className="h-6 w-6" />,
      color: "bg-green-500"
    },
    {
      id: 3,
      name: "Acessórios",
      description: "Panos, aplicadores e ferramentas",
      image: "/placeholder-product.svg",
      productCount: 67,
      slug: "acessorios",
      icon: <Wrench className="h-6 w-6" />,
      color: "bg-purple-500"
    },
    {
      id: 4,
      name: "Kits",
      description: "Kits completos para detalhamento",
      image: "/placeholder-product.svg",
      productCount: 15,
      slug: "kits",
      icon: <Gift className="h-6 w-6" />,
      color: "bg-orange-500"
    },
    {
      id: 5,
      name: "Pneus e Rodas",
      description: "Produtos específicos para pneus e rodas",
      image: "/placeholder-product.svg",
      productCount: 22,
      slug: "pneus-rodas",
      icon: <Package className="h-6 w-6" />,
      color: "bg-red-500"
    },
    {
      id: 6,
      name: "Interior",
      description: "Produtos para limpeza e proteção do interior",
      image: "/placeholder-product.svg",
      productCount: 31,
      slug: "interior",
      icon: <Sparkles className="h-6 w-6" />,
      color: "bg-indigo-500"
    },
    {
      id: 7,
      name: "Vidros",
      description: "Limpadores e protetores para vidros",
      image: "/placeholder-product.svg",
      productCount: 18,
      slug: "vidros",
      icon: <Package className="h-6 w-6" />,
      color: "bg-cyan-500"
    },
    {
      id: 8,
      name: "Motor",
      description: "Produtos para limpeza e proteção do motor",
      image: "/placeholder-product.svg",
      productCount: 24,
      slug: "motor",
      icon: <Wrench className="h-6 w-6" />,
      color: "bg-gray-500"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCategories(mockCategories);
      setFilteredCategories(mockCategories);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [categories, searchTerm]);

  const totalProducts = categories.reduce((sum, category) => sum + category.productCount, 0);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Categorias de Produtos
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Explore nossa ampla gama de produtos organizados por categoria
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar categorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white text-gray-900"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{categories.length}</div>
              <div className="text-gray-600">Categorias</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalProducts}+</div>
              <div className="text-gray-600">Produtos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">38+</div>
              <div className="text-gray-600">Anos de Experiência</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Todas as Categorias</h2>
            <p className="text-gray-600">
              {loading ? 'Carregando...' : `${filteredCategories.length} categoria(s) encontrada(s)`}
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="bg-gray-200 h-32 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((category) => (
                <Link key={category.id} href={`/produtos?categoria=${category.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-200">
                    <CardContent className="p-6">
                      {/* Icon and Image */}
                      <div className="relative mb-4">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                          <Image
                            src={category.image}
                            alt={category.name}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        <div className={`absolute -top-2 -right-2 ${category.color} text-white p-2 rounded-full shadow-lg`}>
                          {category.icon}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </h3>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {category.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-2">
                          <Badge variant="outline" className="text-xs">
                            {category.productCount} produtos
                          </Badge>
                          
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0">
                            Ver produtos
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          
          {!loading && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma categoria encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                Tente buscar por outro termo ou navegue por todas as categorias.
              </p>
              <Button onClick={() => setSearchTerm('')}>
                Ver todas as categorias
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Não encontrou o que procura?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Entre em contato conosco e nossa equipe especializada te ajudará a encontrar o produto ideal.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <span className="mr-2">📱</span>
                WhatsApp
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                <span className="mr-2">📧</span>
                Email
              </Button>
            </div>
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
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold">Montecarlo</span>
              </div>
              <p className="text-gray-400">
                Mais de 38 anos oferecendo excelência na distribuição de acessórios automotivos.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produtos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/produtos" className="hover:text-white">Todos os Produtos</a></li>
                <li><a href="/categorias" className="hover:text-white">Categorias</a></li>
                <li><a href="/marcas" className="hover:text-white">Marcas</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/sobre" className="hover:text-white">Sobre Nós</a></li>
                <li><a href="/contato" className="hover:text-white">Contato</a></li>
                <li><a href="/termos" className="hover:text-white">Termos de Uso</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <div className="space-y-2 text-gray-400">
                <p>📧 contato@montecarlo.com.br</p>
                <p>📱 (11) 99999-9999</p>
                <p>📍 São Paulo, SP</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Montecarlo. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}