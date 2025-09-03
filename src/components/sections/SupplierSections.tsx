'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
}

interface Supplier {
  id: string;
  name: string;
  logo: string;
  description: string;
  featured: boolean;
  products: Product[];
}

interface WordPressBrand {
  id: string;
  name: string;
  logo: string;
  slug: string;
  description?: string;
  featured?: boolean;
}



export function SupplierSections() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands');
        if (response.ok) {
          const result = await response.json();
            const brands: WordPressBrand[] = result.data || [];
          
          // Buscar produtos do WordPress para cada marca
          const suppliersData: Supplier[] = await Promise.all(
            brands.map(async (brand) => {
              try {
                const productsResponse = await fetch(`/api/products?brand=${brand.slug}`);
                let products: Product[] = [];
                
                if (productsResponse.ok) {
                  const wpProducts = await productsResponse.json();
                  products = wpProducts.slice(0, 3); // Máximo 3 produtos por fornecedor
                }
                
                return {
                  id: String(brand.id ?? brand.slug),
                  name: brand.name,
                  logo: brand.logo || brand.image || '',
                  description: brand.description || `Produtos premium da marca ${brand.name}`,
                  featured: brand.featured || false,
                  products
                };
              } catch (error) {
                console.error(`Erro ao carregar produtos da marca ${brand.name}:`, error);
                return {
                  id: String(brand.id ?? brand.slug),
                  name: brand.name,
                  logo: brand.logo || brand.image || '',
                  description: brand.description || `Produtos premium da marca ${brand.name}`,
                  featured: brand.featured || false,
                  products: []
                };
              }
            })
          );
          
          setSuppliers(suppliersData);
        }
      } catch (error) {
        console.error('Erro ao carregar marcas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-300 rounded w-96 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Explore por <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Fornecedor</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubra produtos das marcas mais respeitadas do mercado automotivo mundial.
            Cada fornecedor foi cuidadosamente selecionado pela qualidade e inovação.
          </p>
        </div>

        {/* Suppliers Grid */}
        <div className="space-y-20">
          {suppliers.filter(supplier => supplier.products.length > 0).length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowRight className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nenhum fornecedor disponível</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Estamos trabalhando para adicionar novos fornecedores e produtos. Volte em breve!
              </p>
            </div>
          ) : (
            suppliers.filter(supplier => supplier.products.length > 0).map((supplier, index) => (
            <React.Fragment key={supplier.id}>
              {index > 0 && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>
              )}
              <div className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
                {/* Supplier Info */}
                <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center p-4">
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 font-bold text-lg">{supplier.name}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">{supplier.name}</h3>
                    <p className="text-red-600 font-medium">{supplier.products.length} produtos em destaque</p>
                  </div>
                </div>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  {supplier.description}
                </p>
                
                <Link href={`/fornecedores/${supplier.id}`}>
                  <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-600/25">
                    Ver todos os produtos {supplier.name}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                </div>

                {/* Featured Products */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {supplier.products.map((product) => (
                      <Card key={product.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-2">
                        <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden p-3">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder-product.jpg';
                            }}
                          />
                          <Badge className="absolute top-3 right-3 bg-red-600 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Destaque
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors min-h-[3rem]">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold text-red-600">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Não encontrou o que procura?</h3>
            <p className="text-xl mb-8 text-red-100">
              Explore nosso catálogo completo com mais de 500 produtos de todas as marcas.
            </p>
            <Link href="/produtos">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105">
                Ver Catálogo Completo
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
