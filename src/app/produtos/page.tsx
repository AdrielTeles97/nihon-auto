"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar } from "@/components/patterns/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Product, ProductFilters, ProductsResponse } from "@/services/wordpress";
import { getProducts, getCategories, getBrands } from "@/services/wordpress";

export default function ProdutosPage() {
    const [productsResponse, setProductsResponse] = useState<ProductsResponse>({
        products: [],
        pagination: { currentPage: 1, totalPages: 0, totalItems: 0, itemsPerPage: 12 },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [categories, setCategories] = useState<string[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [sort, setSort] = useState<"relevance" | "price-asc" | "price-desc" | "name-asc" | "name-desc">("relevance");
    const [currentPage, setCurrentPage] = useState(1);

    // Carregar categorias e marcas
    useEffect(() => {
        const loadFilters = async () => {
            try {
                const [categoriesData, brandsData] = await Promise.all([getCategories(), getBrands()]);

                setCategories(categoriesData.map((c) => c.name));
                setBrands(brandsData.map((b) => b.name));
            } catch (err) {
                console.error("Erro ao carregar filtros:", err);
                // Não mostrar erro para filtros, apenas log no console
            }
        };

        loadFilters();
    }, []);

    // Carregar produtos do WordPress com paginação
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
                if (sort !== "relevance") filters.sort = sort;

                const productsData = await getProducts({
                    filters,
                    page: currentPage,
                    limit: 12,
                });

                // Ordenação local se necessário
                const sortedProducts = [...productsData.products];
                if (sort !== "relevance") {
                    sortedProducts.sort((a, b) => {
                        switch (sort) {
                            case "price-asc":
                                return a.price - b.price;
                            case "price-desc":
                                return b.price - a.price;
                            case "name-asc":
                                return a.name.localeCompare(b.name);
                            case "name-desc":
                                return b.name.localeCompare(a.name);
                            default:
                                return 0;
                        }
                    });
                }

                setProductsResponse({
                    ...productsData,
                    products: sortedProducts,
                });
            } catch (err) {
                console.error("Erro ao carregar produtos:", err);
                setError("Erro ao carregar produtos. Verifique se o WordPress está configurado corretamente.");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [searchTerm, selectedCategory, selectedBrand, minPrice, maxPrice, sort, currentPage]);

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory(null);
        setSelectedBrand(null);
        setMinPrice(null);
        setMaxPrice(null);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const renderPagination = () => {
        const { currentPage: page, totalPages } = productsResponse.pagination;
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-center space-x-2 mt-8">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                </Button>

                {startPage > 1 && (
                    <>
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(1)}>
                            1
                        </Button>
                        {startPage > 2 && <span className="px-2">...</span>}
                    </>
                )}

                {pages.map((pageNum) => (
                    <Button
                        key={pageNum}
                        variant={pageNum === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={pageNum === page ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                        {pageNum}
                    </Button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="px-2">...</span>}
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(totalPages)}>
                            {totalPages}
                        </Button>
                    </>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="flex items-center gap-1"
                >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-20 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <svg
                        className="absolute top-0 left-0 w-full h-full"
                        viewBox="0 0 1200 800"
                        preserveAspectRatio="none"
                    >
                        <image href="/images/waves.svg" width="100%" height="100%" className="object-cover" />
                    </svg>
                </div>
                <div className="absolute inset-0 opacity-5">
                    <svg
                        className="absolute top-0 right-0 w-1/2 h-full"
                        viewBox="0 0 600 800"
                        preserveAspectRatio="none"
                    >
                        <image href="/images/noise/noise-red.svg" width="100%" height="100%" className="object-cover" />
                    </svg>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl lg:text-6xl font-bold mb-6 tracking-tight">Catálogo de Produtos</h1>
                        <p className="text-xl text-red-100 leading-relaxed">
                            Descubra nossa linha completa de produtos automotivos das melhores marcas japonesas
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
                                Certifique-se de que o WordPress está rodando em{" "}
                                <a
                                    href="https://darksalmon-cobra-736244.hostingersite.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                >
                                    https://darksalmon-cobra-736244.hostingersite.com
                                </a>
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Filters and Search */}
            <section className="relative py-8 bg-gray-50 border-b border-gray-200">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <svg
                        className="absolute bottom-0 left-0 w-full h-32"
                        viewBox="0 0 1200 200"
                        preserveAspectRatio="none"
                    >
                        <image href="/images/waves.svg" width="100%" height="100%" className="object-cover" />
                    </svg>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Catálogo</h2>
                            <p className="text-gray-600">
                                {loading
                                    ? "Carregando..."
                                    : `${productsResponse.pagination.totalItems} produto(s) encontrado(s)`}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder="Buscar produtos..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-10 bg-white"
                                />
                            </div>

                            {/* Ordenação */}
                            <div className="flex items-center gap-3">
                                <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap">
                                    Ordenar:
                                </label>
                                <select
                                    id="sort"
                                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 min-w-[180px]"
                                    value={sort}
                                    onChange={(e) => {
                                        setSort(e.target.value as typeof sort);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="relevance">Relevância</option>
                                    <option value="price-asc">Preço: menor para maior</option>
                                    <option value="price-desc">Preço: maior para menor</option>
                                    <option value="name-asc">Nome: A → Z</option>
                                    <option value="name-desc">Nome: Z → A</option>
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                    className={viewMode === "grid" ? "bg-red-600 hover:bg-red-700" : ""}
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                    className={viewMode === "list" ? "bg-red-600 hover:bg-red-700" : ""}
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
                            <ProductGrid products={productsResponse.products} loading={loading} viewMode={viewMode} />

                            {/* Pagination */}
                            {renderPagination()}
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
                                    <a href="/produtos" className="hover:text-white">
                                        Todos os Produtos
                                    </a>
                                </li>
                                <li>
                                    <a href="/categorias" className="hover:text-white">
                                        Categorias
                                    </a>
                                </li>
                                <li>
                                    <a href="/marcas" className="hover:text-white">
                                        Marcas
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Empresa</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a href="/sobre" className="hover:text-white">
                                        Sobre Nós
                                    </a>
                                </li>
                                <li>
                                    <a href="/contato" className="hover:text-white">
                                        Contato
                                    </a>
                                </li>
                                <li>
                                    <a href="/termos" className="hover:text-white">
                                        Termos de Uso
                                    </a>
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
