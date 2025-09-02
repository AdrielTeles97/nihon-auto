'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid, List } from 'lucide-react';
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
        
        const productsData = await getProducts(filters);
        setProducts(productsData.products);
        setFilteredProducts(productsData.products);
        
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
  }, [searchTerm, selectedCategory, selectedBrand]);


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
      <section className="py-8 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 mr-2">Filtros:</span>
              
              {/* Categories */}
              <div className="flex flex-wrap gap-1">
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              
              {/* Brands */}
              <div className="flex flex-wrap gap-1">
                {brands.map(brand => (
                  <Badge
                    key={brand}
                    variant={selectedBrand === brand ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                  >
                    {brand}
                  </Badge>
                ))}
              </div>
              
              {(selectedCategory || selectedBrand || searchTerm) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              )}
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
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
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <p className="text-gray-600">
              {loading ? 'Carregando...' : `${filteredProducts.length} produto(s) encontrado(s)`}
            </p>
          </div>
          
          <ProductGrid 
            products={filteredProducts} 
            loading={loading}
            viewMode={viewMode}
          />
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