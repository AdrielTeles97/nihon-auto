'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { ProductGrid } from '@/components/product/ProductGrid';
import { FilterSidebar } from '@/components/patterns/FilterSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid, List } from 'lucide-react';
import { Product, ProductFilters } from '@/types';
import { getProducts, getCategories } from '@/services/wordpress';

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sort, setSort] = useState<'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>('relevance');

  // Carregar produtos do WordPress
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const filters: ProductFilters = {};
        if (searchTerm) filters.search = searchTerm;
        if (selectedCategory) filters.category = selectedCategory;
        if (selectedBrand) filters.brand = selectedBrand;
        if (minPrice !== null) filters.minPrice = minPrice;
        if (maxPrice !== null) filters.maxPrice = maxPrice;
        
        const productsData = await getProducts(filters);
        let list = productsData.products;

        // Garantir filtro por preço mesmo quando a API não filtra
        list = list.filter(p => (minPrice === null || p.price >= minPrice) && (maxPrice === null || p.price <= maxPrice));

        // Ordenação local
        const sorted = [...list].sort((a, b) => {
          switch (sort) {
            case 'price-asc':
              return a.price - b.price;
            case 'price-desc':
              return b.price - a.price;
            case 'name-asc':
              return a.name.localeCompare(b.name);
            case 'name-desc':
              return b.name.localeCompare(a.name);
            default:
              return 0;
          }
        });

        setProducts(list);
        setFilteredProducts(sorted);
        
        // Extrair categorias e marcas únicas
        const uniqueCategories = [...new Set(productsData.products.map(p => p.category).filter(Boolean))];
        const uniqueBrands = [...new Set(productsData.products.map(p => p.brand).filter(Boolean))];
        
        setCategories(uniqueCategories);
        setBrands(uniqueBrands);
        
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        setError('Erro ao carregar produtos. Verifique se o WordPress está configurado corretamente.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [searchTerm, selectedCategory, selectedBrand, minPrice, maxPrice, sort]);


  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedBrand(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Nossos Produtos
            </h1>
            <p className="text-xl text-blue-100">
              Descubra nossa linha completa de produtos automotivos das melhores marcas
            </p>
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
                <a href="http://localhost:8080" target="_blank" rel="noopener noreferrer" className="underline">
                  http://localhost:8080
                </a>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Produtos</h2>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {/* Ordenação */}
              <div className="hidden md:flex items-center gap-3">
                <label htmlFor="sort" className="text-sm text-gray-600">Ordenar:</label>
                <select
                  id="sort"
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                >
                  <option value="relevance">Relevância</option>
                  <option value="price-asc">Preço: menor para maior</option>
                  <option value="price-desc">Preço: maior para menor</option>
                  <option value="name-asc">Nome: A → Z</option>
                  <option value="name-desc">Nome: Z → A</option>
                </select>
              </div>

              <div className="hidden md:flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
            {/* Sidebar */}
            <div className="order-2 lg:order-1">
              <FilterSidebar
                categories={categories}
                brands={brands}
                selectedCategory={selectedCategory}
                selectedBrand={selectedBrand}
                onCategoryChange={setSelectedCategory}
                onBrandChange={setSelectedBrand}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
              />
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                  {loading ? 'Carregando...' : `${filteredProducts.length} produto(s) encontrado(s)`}
                </p>
                <div className="flex gap-2 md:hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ProductGrid
                products={filteredProducts}
                loading={loading}
                viewMode={viewMode}
              />
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
                  <li><Link href="/produtos" className="hover:text-white">Todos os Produtos</Link></li>
                  <li><Link href="/categorias" className="hover:text-white">Categorias</Link></li>
                  <li><Link href="/marcas" className="hover:text-white">Marcas</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                  <li><Link href="/sobre" className="hover:text-white">Sobre Nós</Link></li>
                  <li><Link href="/contato" className="hover:text-white">Contato</Link></li>
                  <li><Link href="/termos" className="hover:text-white">Termos de Uso</Link></li>
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
