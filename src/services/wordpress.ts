import axios from 'axios';

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
  specifications?: Record<string, any>;
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

export interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  image?: string;
  parent?: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  sort?: 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
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
const WORDPRESS_BASE_URL = (process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/wp-json/wp/v2', '')) || '';
const WC_API_BASE_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_API_URL || '';
const WP_API_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';

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

const wpApi = axios.create({
  baseURL: WP_API_BASE_URL,
  timeout: 10000,
});

// Helper function to fetch media
async function fetchMedia(mediaId: number): Promise<string> {
  try {
    const response = await wpApi.get<WordPressMedia>(`/media/${mediaId}`);
    return response.data.source_url;
  } catch (error) {
    console.error('Erro ao buscar mídia:', error);
    return '/placeholder-product.svg';
  }
}

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
    specifications: wcProduct.attributes?.reduce((specs, attr) => {
      specs[attr.name] = attr.options.join(', ');
      return specs;
    }, {} as Record<string, any>) || {}
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
      return res.json();
    }
    const params: any = {
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

    // Aplicar ordenação
    if (filters?.sort) {
      switch (filters.sort) {
        case 'price-asc':
          params.orderby = 'price';
          params.order = 'asc';
          break;
        case 'price-desc':
          params.orderby = 'price';
          params.order = 'desc';
          break;
        case 'name-asc':
          params.orderby = 'title';
          params.order = 'asc';
          break;
        case 'name-desc':
          params.orderby = 'title';
          params.order = 'desc';
          break;
        default:
          // relevance - usar ordenação padrão do WooCommerce
          break;
      }
    }

    // Resolver brand -> ID (WooCommerce Brands) se informado
    const brandFilter = brand || filters?.brand;
    if (brandFilter) {
      try {
        const brandRes = await wcApi.get('/products/brands', { params: { slug: brandFilter } });
        const brandData = Array.isArray(brandRes.data) ? brandRes.data[0] : null;
        if (brandData?.id) {
          // Muitos plugins usam "brand" como query param com ID
          (params as any).brand = brandData.id;
        }
      } catch (e) {
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
    if (brandFilter && !(params as any).brand) {
      filteredProducts = filteredProducts.filter((p) => {
        const b = (p.brand || '').toLowerCase();
        const needle = brandFilter.toLowerCase();
        return b === needle || p.name.toLowerCase().includes(needle) || p.category.toLowerCase().includes(needle);
      });
    }

    // Informações de paginação dos headers
    const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1');
    const totalItems = parseInt(response.headers['x-wp-total'] || '0');

    return {
      products: filteredProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: perPage,
      },
    };
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
  try {
    const response = await wcApi.get<WooCommerceProduct>(`/products/${id}`);
    return transformWooCommerceProduct(response.data);
  } catch (error) {
    console.error('Erro ao buscar produto do WooCommerce:', error);
    return null;
  }
}

// Buscar produto por slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    if (typeof window !== 'undefined') {
      const res = await fetch(`/api/products/${slug}`);
      if (!res.ok) return null;
      return res.json();
    }
    const response = await wcApi.get<WooCommerceProduct[]>('/products', { params: { slug } });
    if (response.data.length === 0) return null;
    return transformWooCommerceProduct(response.data[0]);
  } catch (error) {
    console.error('Erro ao buscar produto por slug:', error);
    return null;
  }
}

// Fetch categories
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/api/categories');
    if (!response.ok) {
      throw new Error('Falha ao buscar categorias');
    }
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw new Error('Não foi possível carregar as categorias');
  }
}

// Buscar produtos em destaque
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const response = await wcApi.get('/products', {
      params: {
        featured: true,
        per_page: limit,
        status: 'publish'
      }
    });
    return response.data.map(transformWooCommerceProduct);
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
  try {
    const response = await fetch('/api/brands/wordpress');
    if (!response.ok) {
      throw new Error('Falha ao buscar marcas');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar marcas:', error);
    // Retornar array vazio em caso de erro - não usar dados mockados
    return [];
  }
}