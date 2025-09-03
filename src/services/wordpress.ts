import axios from 'axios';
import { cache } from '@/lib/cache';

// WordPress/WooCommerce API interfaces
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand?: string;
  inStock: boolean;
  slug: string;
  gallery?: string[];
  specifications?: Record<string, string>;
}

// WooCommerce Product interface
export interface WooCommerceProduct {
  id: number;
  name: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  slug: string;
  status: string;
  stock_status: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  images: {
    id: number;
    src: string;
    alt: string;
  }[];
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  tags: {
    id: number;
    name: string;
    slug: string;
  }[];
  attributes: {
    id: number;
    name: string;
    options: string[];
  }[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// API Configuration (usar apenas variáveis de ambiente)
const WC_API_BASE_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_API_URL || '';

// WooCommerce API credentials (NUNCA deixe chaves no código)
const WC_CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

if (!WC_API_BASE_URL || !WP_API_BASE_URL) {
  console.warn('[wordpress.ts] URLs da API não configuradas. Defina NEXT_PUBLIC_WOOCOMMERCE_API_URL e NEXT_PUBLIC_WORDPRESS_API_URL no .env');
}
if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
  console.warn('[wordpress.ts] Chaves do WooCommerce ausentes. Defina WOOCOMMERCE_CONSUMER_KEY e WOOCOMMERCE_CONSUMER_SECRET no .env');
}

const wcApi = axios.create({
  baseURL: WC_API_BASE_URL,
  timeout: 10000,
  params: {
    consumer_key: WC_CONSUMER_KEY,
    consumer_secret: WC_CONSUMER_SECRET
  }
});


// Helper function to fetch media (reserved for future use)

// Transform WooCommerce product to our Product interface
function transformWooCommerceProduct(wcProduct: WooCommerceProduct): Product {
  const mainImage = wcProduct.images && wcProduct.images.length > 0 
    ? wcProduct.images[0].src 
    : '/placeholder-product.svg';
    
  const gallery = wcProduct.images ? wcProduct.images.map(img => img.src) : [];
  
  const category = wcProduct.categories && wcProduct.categories.length > 0 
    ? wcProduct.categories[0].name 
    : 'Sem categoria';
    
  // Extract brand from attributes or tags
  const brandAttribute = wcProduct.attributes?.find(attr => 
    attr.name.toLowerCase().includes('marca') || attr.name.toLowerCase().includes('brand')
  );
  const brand = brandAttribute?.options[0] || 
    wcProduct.tags?.find(tag => tag.name.toLowerCase().includes('marca'))?.name;
  
  return {
    id: wcProduct.id,
    name: wcProduct.name,
    description: wcProduct.description.replace(/<[^>]*>/g, ''),
    price: parseFloat(wcProduct.price) || 0,
    image: mainImage,
    category,
    brand,
    inStock: wcProduct.stock_status === 'instock',
    slug: wcProduct.slug,
    gallery,
    specifications: wcProduct.attributes?.reduce<Record<string, string>>(
      (specs, attr) => {
        specs[attr.name] = attr.options.join(', ');
        return specs;
      },
      {}
    ) || {}
  };
}

// Fetch products from WooCommerce API
export async function getProducts(options?: {
  filters?: ProductFilters;
  page?: number;
  limit?: number;
  brand?: string;
}): Promise<ProductsResponse> {
  const { filters, page = 1, limit = 12, brand } = options || {};
  const perPage = limit;
  const cacheKey = `products:${JSON.stringify({ filters, page, limit, brand })}`;
  const cached = cache.get<ProductsResponse>(cacheKey);
  if (cached) return cached;
  try {
    // No client, redireciona para API interna para não expor credenciais
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(perPage));
      if (brand) params.set('brand', brand);
      if (filters?.search) params.set('search', filters.search);
      if (filters?.category) params.set('category', filters.category);
      if (filters?.minPrice != null) params.set('minPrice', String(filters.minPrice));
      if (filters?.maxPrice != null) params.set('maxPrice', String(filters.maxPrice));
      if (filters?.inStock != null) params.set('inStock', String(!!filters.inStock));

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error(`Erro API interna /api/products: ${res.status}`);
      const data = await res.json();
      cache.set(cacheKey, data);
      return data;
    }
    const params: Record<string, unknown> = {
      page,
      per_page: perPage,
      status: 'publish'
    };

    // Aplicar filtros
    if (filters?.search) {
      params.search = filters.search;
    }

    if (filters?.category && filters.category !== 'Todas') {
      params.category = filters.category;
    }

    if (filters?.minPrice !== undefined) {
      params.min_price = filters.minPrice;
    }

    if (filters?.maxPrice !== undefined) {
      params.max_price = filters.maxPrice;
    }

    if (filters?.inStock !== undefined) {
      params.stock_status = filters.inStock ? 'instock' : 'outofstock';
    }

    // Resolver brand -> ID (WooCommerce Brands) se informado
    const brandFilter = brand || filters?.brand;
    if (brandFilter) {
      try {
        const brandRes = await wcApi.get('/products/brands', { params: { slug: brandFilter } });
          const brandData = Array.isArray(brandRes.data)
            ? brandRes.data[0]
            : null;
          if (brandData?.id) {
            // Muitos plugins usam "brand" como query param com ID
            params.brand = brandData.id;
          }
      } catch {
        // Continua sem brand param; faremos filtro local como fallback
      }
    }

    // Try to fetch from WooCommerce API first
    const response = await wcApi.get<WooCommerceProduct[]>('/products', { params });

    const products: Product[] = response.data.map(wcProduct =>
      transformWooCommerceProduct(wcProduct)
    );

    // Filtro local (fallback caso a API não tenha aplicado)
    let filteredProducts = products;
    if (brandFilter && !('brand' in params)) {
      filteredProducts = filteredProducts.filter((p) => {
        const b = (p.brand || '').toLowerCase();
        const needle = brandFilter.toLowerCase();
        return b === needle || p.name.toLowerCase().includes(needle) || p.category.toLowerCase().includes(needle);
      });
    }

    // Informações de paginação dos headers
    const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1');
    const totalItems = parseInt(response.headers['x-wp-total'] || '0');

    const result = {
      products: filteredProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: perPage,
      },
    };
    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erro ao buscar produtos do WooCommerce:', error);
    // Return empty result if WooCommerce API fails
    return {
      products: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: perPage,
      },
    };
  }
}

// Fetch single product
export async function getProduct(id: number): Promise<Product | null> {
  const cacheKey = `product:${id}`;
  const cached = cache.get<Product>(cacheKey);
  if (cached) return cached;
  try {
    const response = await wcApi.get<WooCommerceProduct>(`/products/${id}`);
    const product = transformWooCommerceProduct(response.data);
    cache.set(cacheKey, product);
    return product;
  } catch (error) {
    console.error('Erro ao buscar produto do WooCommerce:', error);
    return null;
  }
}

// Buscar produto por slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const cacheKey = `product-slug:${slug}`;
  const cached = cache.get<Product | null>(cacheKey);
  if (cached) return cached;
  try {
    if (typeof window !== 'undefined') {
      const res = await fetch(`/api/products/${slug}`);
      if (!res.ok) return null;
      const data = await res.json();
      cache.set(cacheKey, data);
      return data;
    }
    const response = await wcApi.get<WooCommerceProduct[]>('/products', { params: { slug } });
    if (response.data.length === 0) {
      cache.set(cacheKey, null);
      return null;
    }
    const product = transformWooCommerceProduct(response.data[0]);
    cache.set(cacheKey, product);
    return product;
  } catch (error) {
    console.error('Erro ao buscar produto por slug:', error);
    return null;
  }
}

// Fetch categories
export async function getCategories(): Promise<Category[]> {
  const cacheKey = 'categories';
  const cached = cache.get<Category[]>(cacheKey);
  if (cached) return cached;
  try {
    const response = await wcApi.get('/products/categories');
    interface WooCommerceCategory {
      id: number;
      name: string;
      slug: string;
      count: number;
    }
    const categories = (response.data as WooCommerceCategory[]).map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      count: cat.count,
    }));
    cache.set(cacheKey, categories);
    return categories;
  } catch (error) {
    console.warn('WooCommerce API não disponível, usando categorias mock:', error);
    const categories = [
      { id: 1, name: 'Smartphones', slug: 'smartphones', count: 10 },
      { id: 2, name: 'Notebooks', slug: 'notebooks', count: 15 },
      { id: 3, name: 'Tablets', slug: 'tablets', count: 8 },
      { id: 4, name: 'Acessórios', slug: 'acessorios', count: 12 },
      { id: 5, name: 'Audio & Video', slug: 'audio-video', count: 6 }
    ];
    cache.set(cacheKey, categories);
    return categories;
  }
}

// Buscar produtos em destaque
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const cacheKey = `featured:${limit}`;
  const cached = cache.get<Product[]>(cacheKey);
  if (cached) return cached;
  try {
    const response = await wcApi.get('/products', {
      params: {
        featured: true,
        per_page: limit,
        status: 'publish'
      }
    });
    const products = response.data.map(transformWooCommerceProduct);
    cache.set(cacheKey, products);
    return products;
  } catch (error) {
    console.error('Erro ao buscar produtos em destaque:', error);
    return [];
  }
}

// Interface para marcas do WooCommerce
export interface WooCommerceBrand {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  image?: {
    id: number;
    src: string;
    alt: string;
  };
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  image?: string;
}

// Função para transformar marca do WooCommerce
function transformWooCommerceBrand(wcBrand: WooCommerceBrand): Brand {
  return {
    id: wcBrand.id,
    name: wcBrand.name,
    slug: wcBrand.slug,
    description: wcBrand.description,
    count: wcBrand.count,
    image: wcBrand.image?.src
  };
}

// Buscar marcas do WooCommerce
export async function getBrands(): Promise<Brand[]> {
  const cacheKey = 'brands';
  const cached = cache.get<Brand[]>(cacheKey);
  if (cached) return cached;
  try {
    const response = await wcApi.get('/products/brands', {
      params: {
        per_page: 100,
        hide_empty: true // Só mostrar marcas que têm produtos
      }
    });
    const brands = response.data.map(transformWooCommerceBrand);
    cache.set(cacheKey, brands);
    return brands;
  } catch (error) {
    console.error('Erro ao buscar marcas do WooCommerce:', error);
    // Retornar array vazio em caso de erro - não usar dados mockados
    return [];
  }
}
