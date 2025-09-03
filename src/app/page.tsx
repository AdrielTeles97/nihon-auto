"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Star, Shield, Truck, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { FeaturedProductGrid } from "@/components/product/ProductGrid";
import LogoCloud from "@/components/motion-primitives/logo-cloud";
import SupplierSections from "@/components/sections/SupplierSections";
import CategoriesSection from "@/components/sections/CategoriesSection";
import { Product } from "@/types";
import { getProducts } from "@/services/wordpress";
import { ScrollReveal } from "@/components/motion-primitives/scroll-reveal";
import { AnimatedText, TypewriterText } from "@/components/motion-primitives/animated-text";
import { motion } from "framer-motion";

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFeaturedProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Buscar os primeiros 6 produtos como produtos em destaque
                const productsData = await getProducts({});
                setFeaturedProducts(productsData.products.slice(0, 6));
            } catch (err) {
                console.error("Erro ao carregar produtos em destaque:", err);
                setError("Erro ao carregar produtos. WordPress pode não estar configurado.");

                // Fallback para produtos mock em caso de erro
                const mockProducts: Product[] = [
                    {
                        id: 1,
                        name: "Espuma Mágica Gatlub 4 em 1",
                        description: "Espuma para limpeza automotiva com fórmula avançada",
                        price: 29.9,
                        image: "/placeholder-product.svg",
                        category: "Limpeza",
                        brand: "Gatlub",
                        inStock: true,
                        slug: "espuma-magica-gatlub-4em1",
                    },
                    {
                        id: 2,
                        name: "Kit Essencial 3M",
                        description: "Kit completo para detalhamento automotivo",
                        price: 159.9,
                        image: "/placeholder-product.svg",
                        category: "Kits",
                        brand: "3M",
                        inStock: true,
                        slug: "kit-essencial-3m",
                    },
                    {
                        id: 3,
                        name: "Pano Microfibra 300GSM",
                        description: "Pano de microfibra premium para acabamento",
                        price: 19.9,
                        image: "/placeholder-product.svg",
                        category: "Acessórios",
                        inStock: true,
                        slug: "pano-microfibra-300gsm",
                    },
                    {
                        id: 4,
                        name: "Removedor Paraflu Vonixx",
                        description: "Removedor de resíduos e contaminantes",
                        price: 45.9,
                        image: "/placeholder-product.svg",
                        category: "Limpeza",
                        brand: "Vonixx",
                        inStock: true,
                        slug: "removedor-paraflu-vonixx",
                    },
                ];

                setFeaturedProducts(mockProducts);
            } finally {
                setLoading(false);
            }
        };

        loadFeaturedProducts();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <motion.div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
                    style={{
                        backgroundImage: "url(/images/nihon-auto-template1.png)",
                    }}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 8, ease: "easeOut" }}
                />
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                />

                {/* Animated particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[
                        { left: 21.6, top: 92.2, delay: 0 },
                        { left: 13.2, top: 31.1, delay: 0.5 },
                        { left: 94.0, top: 24.9, delay: 1.0 },
                        { left: 54.5, top: 28.2, delay: 1.5 },
                        { left: 73.8, top: 67.5, delay: 0.2 },
                        { left: 43.1, top: 58.6, delay: 0.7 },
                        { left: 11.5, top: 67.9, delay: 1.2 },
                        { left: 18.6, top: 95.3, delay: 1.7 },
                        { left: 82.6, top: 34.2, delay: 0.3 },
                        { left: 54.1, top: 38.5, delay: 0.8 },
                        { left: 76.6, top: 95.6, delay: 1.3 },
                        { left: 24.0, top: 13.0, delay: 1.8 },
                        { left: 30.5, top: 4.5, delay: 0.4 },
                        { left: 24.4, top: 96.6, delay: 0.9 },
                        { left: 47.6, top: 53.1, delay: 1.4 },
                        { left: 7.3, top: 63.0, delay: 1.9 },
                        { left: 15.7, top: 6.9, delay: 0.6 },
                        { left: 80.9, top: 60.7, delay: 1.1 },
                        { left: 38.1, top: 28.2, delay: 1.6 },
                        { left: 8.2, top: 68.0, delay: 0.1 },
                    ].map((particle, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-red-500/30 rounded-full"
                            style={{
                                left: `${particle.left}%`,
                                top: `${particle.top}%`,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                                duration: 3 + (i % 3),
                                repeat: Infinity,
                                delay: particle.delay,
                            }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
                    {/* Main title and subtitle area */}
                    <motion.div
                        className="mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1 }}
                    >
                        <h1 className="text-6xl lg:text-8xl font-bold mb-6 tracking-wider">
                            <span className="text-white">NIHON</span>
                            <br />
                            <span className="text-red-500">ACESSÓRIOS</span>
                        </h1>
                        <p className="text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                            Excelência em peças automotivas de alta qualidade
                        </p>
                    </motion.div>

                    {/* Buttons positioned lower, above scroll indicator */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-8 justify-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 3 }}
                    >
                        <motion.div whileHover={{ scale: 1.08, y: -3 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/produtos">
                                <Button
                                    size="lg"
                                    className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 text-lg font-bold border-0 shadow-2xl rounded-md"
                                >
                                    Explorar Produtos
                                    <ArrowRight className="ml-3 h-5 w-5" />
                                </Button>
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.08, y: -3 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/sobre">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-black px-12 py-4 text-lg font-bold rounded-md shadow-2xl pointer"
                                >
                                    Nossa História
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 3.5 }}
                >
                    <motion.div
                        className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <motion.div
                            className="w-1 h-3 bg-white/70 rounded-full mt-2"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </motion.div>
                </motion.div>
            </section>

            {/* Marcas em Destaque com LogoCloud */}
            <ScrollReveal>
                <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

                    <div className="container mx-auto px-4">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Nossos <span className="text-red-600">Fornecedores</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                Parcerias estratégicas com as melhores marcas do mercado automotivo
                            </p>
                            <motion.div
                                className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"
                                initial={{ width: 0 }}
                                whileInView={{ width: 96 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                viewport={{ once: true }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <LogoCloud />
                        </motion.div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Seções por Fornecedor */}
            <SupplierSections />

            {/* Seção de Categorias */}
            <CategoriesSection />

            {/* Produtos em Destaque */}
            <ScrollReveal>
                <section className="py-20 bg-white relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(239,68,68,0.1)_25%,transparent_25%),linear-gradient(-45deg,rgba(239,68,68,0.1)_25%,transparent_25%)] bg-[length:60px_60px]" />
                    </div>

                    <div className="container mx-auto px-4 relative">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Produtos em <span className="text-red-600">Destaque</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                Seleção especial dos produtos mais procurados pelos nossos clientes
                            </p>
                            <motion.div
                                className="w-32 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"
                                initial={{ width: 0 }}
                                whileInView={{ width: 128 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                viewport={{ once: true }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <FeaturedProductGrid products={featuredProducts} loading={loading} />
                        </motion.div>

                        <motion.div
                            className="text-center mt-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                                <Link href="/produtos">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                                    >
                                        Ver Todos os Produtos
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Stats Section */}
            <ScrollReveal>
                <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Números que <span className="text-red-600">Impressionam</span>
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Nossa trajetória de sucesso refletida em números
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { number: "500+", label: "Produtos", delay: 0.1 },
                                { number: "50+", label: "Marcas", delay: 0.2 },
                                { number: "1000+", label: "Clientes", delay: 0.3 },
                                { number: "5+", label: "Anos", delay: 0.4 },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center group"
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: stat.delay }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:bg-red-50">
                                        <motion.div
                                            className="text-4xl md:text-5xl font-black text-red-600 mb-3"
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{
                                                duration: 0.6,
                                                delay: stat.delay + 0.2,
                                                type: "spring",
                                                bounce: 0.4,
                                            }}
                                            viewport={{ once: true }}
                                        >
                                            {stat.number}
                                        </motion.div>
                                        <div className="text-gray-700 font-medium text-lg group-hover:text-red-700 transition-colors">
                                            {stat.label}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Diferenciais */}
            <ScrollReveal>
                <section className="py-20 bg-white relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1)_1px,transparent_1px)] bg-[length:50px_50px]" />
                    </div>

                    <div className="container mx-auto px-4 relative">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Por que escolher a <span className="text-red-600">Nihon?</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Diferenciais que fazem toda a diferença na sua experiência
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Shield,
                                    title: "Qualidade Garantida",
                                    description: "Produtos originais das melhores marcas do mercado automotivo.",
                                    delay: 0.1,
                                    gradient: "from-green-500 to-green-600",
                                },
                                {
                                    icon: Truck,
                                    title: "Entrega Rápida",
                                    description: "Receba seus produtos com agilidade e segurança em todo o Brasil.",
                                    delay: 0.2,
                                    gradient: "from-blue-500 to-blue-600",
                                },
                                {
                                    icon: HeadphonesIcon,
                                    title: "Suporte Especializado",
                                    description:
                                        "Nossa equipe está pronta para ajudar você a escolher o produto ideal.",
                                    delay: 0.3,
                                    gradient: "from-purple-500 to-purple-600",
                                },
                            ].map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: item.delay }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -10 }}
                                        className="group"
                                    >
                                        <div className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 bg-gradient-to-br from-white to-gray-50 rounded-lg">
                                            <div className="p-8 text-center relative overflow-hidden">
                                                {/* Background decoration */}
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full transform translate-x-16 -translate-y-16" />

                                                <motion.div
                                                    className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                                    transition={{ duration: 0.6 }}
                                                >
                                                    <Icon className="h-10 w-10 text-white" />
                                                </motion.div>

                                                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-red-600 transition-colors">
                                                    {item.title}
                                                </h3>

                                                <p className="text-gray-600 leading-relaxed text-lg">
                                                    {item.description}
                                                </p>

                                                {/* Hover effect line */}
                                                <motion.div
                                                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-500 to-red-600"
                                                    initial={{ width: 0 }}
                                                    whileHover={{ width: "100%" }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">M</span>
                                </div>
                                <span className="text-xl font-bold">Nihon</span>
                            </div>
                            <p className="text-gray-400">
                                Mais de 38 anos oferecendo excelência na distribuição de acessórios automotivos.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Produtos</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <Link href="/produtos" className="hover:text-white">
                                        Todos os Produtos
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/categorias" className="hover:text-white">
                                        Categorias
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/marcas" className="hover:text-white">
                                        Marcas
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Empresa</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <Link href="/sobre" className="hover:text-white">
                                        Sobre Nós
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contato" className="hover:text-white">
                                        Contato
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/termos" className="hover:text-white">
                                        Termos de Uso
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Contato</h4>
                            <div className="space-y-2 text-gray-400">
                                <p>📧 contato@Nihon.com.br</p>
                                <p>📱 (11) 99999-9999</p>
                                <p>📍 São Paulo, SP</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 Nihon. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
