'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Package, Wrench, Sparkles, Gift, Zap, Car } from 'lucide-react';
import { getCategories } from '@/services/wordpress';
import { ScrollReveal } from '@/components/motion-primitives/scroll-reveal';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  count: number;
  parent: number;
}

const getCategoryIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('eletrônico') || lowerName.includes('eletronico')) return Package;
  if (lowerName.includes('acessório') || lowerName.includes('acessorio')) return Wrench;
  if (lowerName.includes('limpeza')) return Sparkles;
  if (lowerName.includes('kit')) return Gift;
  if (lowerName.includes('performance')) return Zap;
  return Car;
};

const getCategoryGradient = (index: number) => {
  const gradients = [
    'from-red-500 to-red-600',
    'from-blue-500 to-blue-600', 
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-teal-500 to-teal-600'
  ];
  return gradients[index % gradients.length];
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoriesData = await getCategories();
        
        // Filtrar apenas categorias principais (parent = 0) e com produtos
        const mainCategories = categoriesData
          .filter(cat => cat.parent === 0 && cat.count > 0)
          .slice(0, 8); // Limitar a 8 categorias para o layout
        
        setCategories(mainCategories);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setError('Erro ao carregar categorias');
        
        // Fallback para categorias mock
        const mockCategories: Category[] = [
          {
            id: 1,
            name: 'Produtos de Limpeza',
            slug: 'limpeza',
            description: 'Produtos para limpeza e detalhamento automotivo',
            count: 45,
            parent: 0
          },
          {
            id: 2,
            name: 'Acessórios',
            slug: 'acessorios',
            description: 'Acessórios essenciais para seu veículo',
            count: 32,
            parent: 0
          },
          {
            id: 3,
            name: 'Kits Completos',
            slug: 'kits',
            description: 'Kits completos para cuidado automotivo',
            count: 18,
            parent: 0
          },
          {
            id: 4,
            name: 'Performance',
            slug: 'performance',
            description: 'Produtos para melhorar a performance',
            count: 25,
            parent: 0
          }
        ];
        setCategories(mockCategories);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded-lg w-96 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-xl mb-4" />
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <ScrollReveal>
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(239,68,68,0.1)_1px,transparent_1px)] bg-[length:80px_80px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[length:60px_60px]" />
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl"
          animate={{
            y: [0, 15, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="container mx-auto px-4 relative">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Explore por <span className="text-red-600 relative">
                Categorias
                <motion.div
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  viewport={{ once: true }}
                />
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Encontre exatamente o que precisa navegando por nossas categorias especializadas
            </motion.p>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => {
              const Icon = getCategoryIcon(category.name);
              const gradient = getCategoryGradient(index);
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    bounce: 0.3
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="group"
                >
                  <Link href={`/produtos?categoria=${category.slug}`}>
                    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-red-200 overflow-hidden">
                      {/* Main Image Container */}
                      <motion.div
                        className={`w-full h-48 ${category.image ? 'bg-gray-50' : `bg-gradient-to-br ${gradient}`} flex items-center justify-center relative overflow-hidden`}
                        whileHover={{ 
                          scale: 1.02 
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {category.image && !imageErrors.has(category.id) ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            width={300}
                            height={192}
                            className="w-full h-full object-contain p-4"
                            onError={() => {
                              setImageErrors(prev => new Set(prev).add(category.id));
                            }}
                          />
                        ) : (
                          <Icon className="h-16 w-16 text-white" />
                        )}
                        
                        {/* Hover Overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </motion.div>

                      {/* Bottom Info Bar */}
                      <div className="p-4 bg-white">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 group-hover:text-red-500 transition-colors">
                            {category.count} produtos
                          </span>
                          
                          <motion.div
                            className="flex items-center text-red-600 group-hover:text-red-700 transition-colors"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span className="text-sm font-semibold mr-1">Ver mais</span>
                            <ArrowRight className="h-4 w-4" />
                          </motion.div>
                        </div>
                      </div>

                      {/* Hover Effect Border */}
                      <motion.div
                        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Call to Action */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/categorias">
                <motion.button
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                  whileHover={{
                    boxShadow: "0 20px 40px rgba(239,68,68,0.3)"
                  }}
                >
                  {/* Button Background Animation */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <span className="relative z-10 flex items-center">
                    Ver Todas as Categorias
                    <motion.div
                      className="ml-2"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </ScrollReveal>
  );
}