'use client';

import React, { useEffect, useState } from 'react';
import FornecedorCard from './FornecedorCard';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  slug: string;
  category?: string;
  inStock?: boolean;
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
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: {
    id: number;
    src: string;
    name: string;
    alt: string;
  };
  count: number;
}

export default function SupplierSections() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        // Fetch brands from WordPress
        const brandsResponse = await fetch('/api/brands/wordpress');
        const brandsData = await brandsResponse.json();
        const brands: WordPressBrand[] = brandsData.data || [];

        // For each brand, fetch some products
        const suppliersData = await Promise.all(
          brands.map(async (brand) => {
            try {
              const productsResponse = await fetch(`/api/products?brand=${brand.slug}`);
              const wpProductsResponse = await productsResponse.json();
              const wpProducts = (wpProductsResponse.products || []).slice(0, 3);

              const products: Product[] = wpProducts.map((product: any) => ({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price) || 0,
                image: product.images?.[0]?.src || '/images/placeholder-product.svg',
                slug: product.slug,
                category: product.categories?.[0]?.name || 'Eletrônicos',
                inStock: product.stock_status === 'instock'
              }));

              return {
                id: brand.slug,
                name: brand.name,
                logo: brand.image?.src || '/images/placeholder-logo.svg',
                description: brand.description || '',
                featured: brand.count > 10,
                products
              };
            } catch (error) {
              console.error(`Error fetching products for brand ${brand.name}:`, error);
              return {
                id: brand.slug,
                name: brand.name,
                logo: brand.image?.src || '/images/placeholder-logo.svg',
                description: brand.description || '',
                featured: false,
                products: []
              };
            }
          })
        );

        setSuppliers(suppliersData);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Nossos <span className="text-blue-600">Fornecedores</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Descubra produtos das marcas mais respeitadas do mercado.
          Cada fornecedor foi cuidadosamente selecionado pela qualidade e inovação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {suppliers.filter(supplier => supplier.products.length > 0).map((supplier) => (
           <FornecedorCard
             key={supplier.id}
             fornecedor={supplier}
           />
         ))}
       </div>

      {suppliers.filter(supplier => supplier.products.length > 0).length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum fornecedor disponível</h3>
          <p className="text-gray-600">
            Estamos trabalhando para adicionar novos fornecedores e produtos. Volte em breve!
          </p>
        </div>
      )}
    </div>
  );
}
