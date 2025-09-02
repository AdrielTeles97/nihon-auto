'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Product } from '@/types';

interface SupplierInfo {
  id: string;
  name: string;
  logo: string;
  description: string;
  founded: string;
  country: string;
  website: string;
  specialties: string[];
  total_products: number;
}

const suppliersData: Record<string, SupplierInfo> = {
  '3m': {
    id: '3m',
    name: '3M',
    logo: '/images/suppliers/3m-logo.svg',
    description: 'A 3M é uma empresa multinacional americana de tecnologia diversificada que opera em todo o mundo. Fundada em 1902, a empresa é conhecida por sua inovação constante e produtos de alta qualidade.',
    founded: '1902',
    country: 'Estados Unidos',
    website: 'www.3m.com',
    specialties: ['Abrasivos', 'Compostos', 'Ceras', 'Acessórios'],
    total_products: 47
  },
  'vonixx': {
    id: 'vonixx',
    name: 'VONIXX',
    logo: '/images/suppliers/vonixx-logo.svg',
    description: 'A Vonixx é uma marca brasileira especializada em produtos para detalhamento automotivo. Reconhecida pela qualidade e inovação, oferece soluções completas para cuidado veicular.',
    founded: '2010',
    country: 'Brasil',
    website: 'www.vonixx.com.br',
    specialties: ['Shampoos', 'Ceras', 'Removedores', 'Pretinhos'],
    total_products: 32
  },
  'chemical-guys': {
    id: 'chemical-guys',
    name: 'Chemical Guys',
    logo: '/images/suppliers/chemical-guys-logo.svg',
    description: 'Chemical Guys é uma marca americana premium especializada em produtos de detalhamento automotivo. Conhecida por sua qualidade superior e produtos inovadores.',
    founded: '1968',
    country: 'Estados Unidos',
    website: 'www.chemicalguys.com',
    specialties: ['Shampoos Premium', 'Ceras', 'Compostos', 'Acessórios'],
    total_products: 28
  },
  'meguiars': {
    id: 'meguiars',
    name: 'MEGUIAR\'S',
    logo: '/images/suppliers/meguiars-logo.svg',
    description: 'Meguiar\'s é uma marca americana com mais de 120 anos de tradição no cuidado automotivo. Líder mundial em produtos de detalhamento profissional.',
    founded: '1901',
    country: 'Estados Unidos',
    website: 'www.meguiars.com',
    specialties: ['Compostos', 'Ceras', 'Shampoos', 'Pneus'],
    total_products: 35
  }
};

// Mock products for demonstration
const generateMockProducts = (supplierName: string, count: number): Product[] => {
  const products: Product[] = [];
  const categories = ['Limpeza', 'Ceras', 'Compostos', 'Acessórios', 'Pneus'];
  
  for (let i = 1; i <= count; i++) {
    products.push({
      id: i,
      name: `${supplierName} Produto ${i}`,
      description: `Produto premium da linha ${supplierName} para cuidado automotivo profissional.`,
      price: Math.floor(Math.random() * 150) + 20,
      image: '/placeholder-product.svg',
      category: categories[Math.floor(Math.random() * categories.length)],
      brand: supplierName,
      inStock: Math.random() > 0.1,
      slug: `${supplierName.toLowerCase()}-produto-${i}`
    });
  }
  
  return products;
};

export default function SupplierPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const supplier = suppliersData[slug];
  
  useEffect(() => {
    if (supplier) {
      // Simulate loading products
      setTimeout(() => {
        const mockProducts = generateMockProducts(supplier.name, supplier.total_products);
        setProducts(mockProducts);
        setLoading(false);
      }, 1000);
    }
  }, [supplier]);
  
  if (!supplier) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fornecedor não encontrado</h1>
          <p className="text-gray-600 mb-8">O fornecedor que você está procurando não existe.</p>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao início
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Supplier Hero */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-red-400 hover:text-red-300 flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao início
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center p-4">
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 font-bold text-sm">{supplier.name}</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{supplier.name}</h1>
                  <p className="text-red-400 text-xl">{supplier.total_products} produtos disponíveis</p>
                </div>
              </div>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {supplier.description}
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h3 className="font-semibold text-red-400 mb-2">Fundada em</h3>
                  <p className="text-white">{supplier.founded}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-red-400 mb-2">País</h3>
                  <p className="text-white">{supplier.country}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-red-400 mb-2">Website</h3>
                  <p className="text-white">{supplier.website}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-red-400 mb-2">Produtos</h3>
                  <p className="text-white">{supplier.total_products}</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-6">Especialidades</h3>
                <div className="grid grid-cols-2 gap-4">
                  {supplier.specialties.map((specialty, index) => (
                    <div key={index} className="bg-red-600/20 rounded-xl p-4 text-center">
                      <Star className="w-6 h-6 text-red-400 mx-auto mb-2" />
                      <p className="font-medium">{specialty}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filters and View Toggle */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Todas as categorias</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Products Grid/List */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {filteredProducts.map((product) => (
                <div key={product.id} className={viewMode === 'grid'
                  ? 'bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-2'
                  : 'bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex items-center space-x-6'
                }>
                  <div className={viewMode === 'grid'
                    ? 'aspect-square bg-gray-100 relative overflow-hidden'
                    : 'w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0'
                  }>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={viewMode === 'grid' ? 'p-6' : 'flex-1'}>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-bold text-red-600">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'Em estoque' : 'Indisponível'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nenhum produto encontrado</h3>
              <p className="text-gray-600 mb-8">Tente alterar os filtros ou volte mais tarde.</p>
              <Button onClick={() => setSelectedCategory('all')} className="bg-red-600 hover:bg-red-700 text-white">
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}