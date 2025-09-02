# 🚗 Nihon Auto E-commerce - Codex Agent

## 📋 **Projeto Overview**

Sistema de e-commerce moderno para **Nihon Auto** (38+ anos no mercado automotivo). Arquitetura headless com frontend Next.js e backend WordPress/WooCommerce.

### **Tech Stack Atual**
```typescript
Frontend: Next.js 14+ + TypeScript + Tailwind CSS
Styling: Manrope Font (200-800 weights) + Tailwind
Backend: WordPress + WooCommerce (Hostinger)
Deploy: Frontend (Vercel) + Backend (Hostinger)
Components: shadcn/ui + OriginUI.com + ReactBits.dev
```

---

## 🌳 **Git Flow & Workflow**

### **Estrutura de Branches**
```bash
main                    # 🚀 Produção - Deploy automático Vercel
├── develop            # 🧪 Desenvolvimento - Staging environment
    ├── feature/header-component      # 🔧 Nova funcionalidade
    ├── feature/product-filters       # 🔧 Sistema de filtros
    ├── feature/banner-system         # 🔧 Sistema de banners
    ├── hotfix/mobile-responsive      # 🔥 Correção urgente
    └── release/v1.2.0               # 📦 Preparação para release
```

### **Comandos Git Obrigatórios**
```bash
# 1. Sempre começar do develop atualizado
git checkout develop
git pull origin develop

# 2. Criar feature branch
git checkout -b feature/nome-da-funcionalidade

# 3. Trabalhar na feature
git add .
git commit -m "feat: adiciona sistema de filtros responsivo"

# 4. Push e Pull Request
git push origin feature/nome-da-funcionalidade
# Criar PR: feature -> develop

# 5. Merge para main (apenas releases)
git checkout main
git merge develop
git push origin main
```

### **Convenção de Commits**
```bash
# Estrutura obrigatória
feat: nova funcionalidade
fix: correção de bug
style: mudanças de estilo/CSS
refactor: refatoração de código
perf: melhorias de performance
docs: documentação
test: testes

# Exemplos práticos
feat: adiciona componente ProductCard responsivo
fix: corrige layout mobile na página de produtos
style: atualiza cores do design system Nihon
refactor: otimiza service de WordPress API
perf: implementa lazy loading nas imagens
docs: atualiza README com instruções de deploy
```

### **Workflow de Desenvolvimento**
```bash
# 🔄 Ciclo completo de feature
1. git checkout develop
2. git pull origin develop
3. git checkout -b feature/product-gallery
4. # Desenvolver funcionalidade
5. npm run lint && npm run type-check
6. git add .
7. git commit -m "feat: adiciona galeria de produtos com zoom"
8. git push origin feature/product-gallery
9. # Criar Pull Request no GitHub
10. # Code Review + Merge para develop
11. # Deploy automático staging
12. # Teste no ambiente staging
13. # Merge develop -> main (deploy produção)
```

### **Branches de Deploy**
```yaml
# Vercel Deploy Settings
Production Branch: main
Preview Branch: develop
Feature Branches: Automatic previews

# Environment Variables por Branch
main (prod):
  NEXT_PUBLIC_WORDPRESS_API_URL: https://nihon.com/wp-json
  NEXT_PUBLIC_WHATSAPP_NUMBER: 5591999999999

develop (staging):
  NEXT_PUBLIC_WORDPRESS_API_URL: https://staging.nihon.com/wp-json
  NEXT_PUBLIC_WHATSAPP_NUMBER: 5591888888888
```

### **Pull Request Template**
```markdown
## 🚀 Descrição
Breve descrição da funcionalidade/correção

## 📱 Screenshots
- [ ] Mobile
- [ ] Tablet  
- [ ] Desktop

## ✅ Checklist
- [ ] Componente responsivo testado
- [ ] Performance Lighthouse >95
- [ ] TypeScript sem erros
- [ ] Segue padrões do Agent.md
- [ ] Testado no Chrome, Safari, Firefox
- [ ] Loading states implementados
- [ ] Error states implementados

## 🧪 Como Testar
1. Navegue para /produtos
2. Teste filtros e busca
3. Verifique responsividade
4. Teste orçamentos WhatsApp
```

---

## 🎯 **Regras de Desenvolvimento**

### **🔥 SEMPRE OBRIGATÓRIO**
- ✅ **Mobile-first responsive** - Funciona perfeitamente em todos os dispositivos
- ✅ **Design minimalista** - Interfaces limpas, foco no produto
- ✅ **Componentes modernos** - Usar OriginUI.com ou shadcn/ui
- ✅ **Animações sutis** - ReactBits.dev para micro-interações
- ✅ **Performance >95** - Lighthouse, Core Web Vitals verdes
- ✅ **TypeScript strict** - Tipagem completa, zero `any`
- ✅ **Git Flow rigoroso** - Feature branches, PRs obrigatórios

### **🎨 Design System**
```css
/* Cores principais */
Primary: #dc2626 (Vermelho Nihon)
Secondary: #f8fafc (Cinza claro)
Text: #1f2937 (Cinza escuro)
Success: #16a34a
Error: #dc2626

/* Font Manrope obrigatória */
font-family: 'Manrope', sans-serif;
font-weights: 200, 300, 400, 500, 600, 700, 800;

/* Padrões responsivos */
Mobile: px-4, text-sm
Tablet: sm:px-6, sm:text-base  
Desktop: lg:px-8, lg:text-lg
```

---

## 🏗️ **Arquitetura Atual**

```
src/
├── app/
│   ├── page.tsx                 # Homepage com hero + produtos
│   ├── produtos/page.tsx        # Catálogo completo (arquivo ativo)
│   └── produto/[slug]/page.tsx  # Página individual
├── components/
│   ├── layout/Header.tsx        # Navegação principal
│   ├── product/
│   │   ├── ProductGrid.tsx      # Grid responsivo
│   │   └── ProductCard.tsx      # Card individual
│   └── ui/                      # shadcn/ui components
├── services/
│   └── wordpress.ts             # API WooCommerce
└── types/index.ts               # TypeScript definitions
```

---

## 🛠️ **Padrões de Código**

### **Componente Padrão (Base no código atual)**
```typescript
'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/types'

export default function ComponentName() {
    const [data, setData] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Sempre implementar loading states
    if (loading) return <LoadingSkeleton />
    if (error) return <ErrorMessage error={error} />

    return (
        <div className="min-h-screen bg-white">
            {/* Header sempre presente */}
            <Header />
            
            {/* Hero section com gradiente */}
            <section className="bg-gradient-to-br from-gray-50 to-white py-20">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900">
                        <span className="font-light">Palavra</span>{' '}
                        <span className="text-red-600">Destaque</span>
                    </h1>
                </div>
            </section>
            
            {/* Conteúdo principal */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    {/* Implementação */}
                </div>
            </section>
        </div>
    )
}
```

### **Filtros e Busca (Pattern atual)**
```typescript
// Sempre implementar filtros assim
const [searchTerm, setSearchTerm] = useState('')
const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
const [selectedBrand, setSelectedBrand] = useState<string | null>(null)

// Badge interativa para filtros
<Badge
    variant={selected ? 'default' : 'outline'}
    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
        selected 
            ? 'bg-red-600 hover:bg-red-700'
            : 'hover:border-red-500 hover:text-red-600'
    }`}
    onClick={() => setFilter(selected ? null : value)}
>
    {label}
</Badge>
```

### **Grid Responsivo (Pattern atual)**
```typescript
// Grid padrão para produtos
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {products.map(product => (
        <ProductCard key={product.id} product={product} />
    ))}
</div>

// Container com shadow e padding
<div className="bg-white rounded-xl shadow-sm p-6">
    <ProductGrid products={filteredProducts} loading={loading} />
</div>
```

---

## 🎨 **Componentes Obrigatórios**

### **1. ProductCard Moderno**
```typescript
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function ProductCard({ product }: { product: Product }) {
    const requestQuote = () => {
        const message = `Interesse no produto: ${product.name}`
        const whatsapp = `https://wa.me/5591999999999?text=${encodeURIComponent(message)}`
        window.open(whatsapp, '_blank')
    }

    return (
        <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="aspect-square bg-gray-50 p-4">
                <Image 
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                />
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={requestQuote}
                >
                    Solicitar Orçamento
                </Button>
            </div>
        </Card>
    )
}
```

### **2. Hero Section Template**
```typescript
// Hero padrão com gradiente e banner promocional
<section className="bg-gradient-to-br from-gray-50 to-white py-20 relative overflow-hidden">
    <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(239,68,68,0.1)_25%,transparent_25%)] bg-[length:60px_60px]" />
    </div>
    
    <div className="container mx-auto px-4 relative">
        <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
            <span className="font-light">Palavra</span>{' '}
            <span className="text-red-600">Destaque</span>
        </h1>
        
        {/* Banner promocional */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">🔥 Ofertas Especiais</h3>
            <p>Encontre produtos com até 30% de desconto</p>
        </div>
    </div>
</section>
```

### **3. Sistema de Orçamentos**
```typescript
// Função padrão para WhatsApp
const requestQuote = (product: Product) => {
    const message = `Olá! Gostaria de solicitar orçamento para: ${product.name}`
    const whatsappUrl = `https://wa.me/5591999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
}

// Botão padrão de orçamento
<Button 
    className="w-full bg-red-600 hover:bg-red-700 transition-colors"
    onClick={() => requestQuote(product)}
>
    📱 Solicitar Orçamento
</Button>
```

---

## 🔌 **Integrações WordPress**

### **API Endpoints Atuais**
```typescript
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL

// Produtos
GET /wp-json/wc/v3/products
GET /wp-json/wc/v3/products/categories  
GET /wp-json/wp/v2/product_brands

// Banners personalizados
GET /wp-json/nihon/v1/banners/{type}
```

### **Filtros de Produtos**
```typescript
interface ProductFilters {
    search?: string
    category?: string  
    brand?: string
    page?: number
    per_page?: number
}

// Implementação atual no service
export async function getProducts(filters: ProductFilters = {}) {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.category) params.append('category', filters.category)
    
    const response = await fetch(`${API_URL}/products?${params}`)
    return response.json()
}
```

---

## 📱 **Padrões Responsivos Obrigatórios**

### **Breakpoints Tailwind**
```css
/* Mobile First - sempre implementar */
.responsive-grid {
    @apply grid grid-cols-1;           /* Mobile */
    @apply sm:grid-cols-2;             /* Tablet */
    @apply lg:grid-cols-3;             /* Desktop */
    @apply xl:grid-cols-4;             /* Large Desktop */
}

.responsive-text {
    @apply text-2xl sm:text-3xl lg:text-4xl xl:text-5xl;
}

.responsive-spacing {
    @apply px-4 sm:px-6 lg:px-8;
    @apply py-8 sm:py-12 lg:py-20;
}
```

### **Container Padrão**
```typescript
// Sempre usar este container
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
    {/* Conteúdo */}
</div>
```

---

## 🚀 **Performance Guidelines**

### **Images Otimizadas**
```typescript
import Image from 'next/image'

// Sempre usar Next.js Image
<Image 
    src={product.image}
    alt={product.name}
    width={400}
    height={400}
    className="object-contain"
    loading="lazy"
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ"
/>
```

### **Loading States**
```typescript
// Skeleton padrão
export function ProductSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-8 rounded"></div>
        </div>
    )
}
```

---

## 🎯 **Objetivos de Qualidade**

### **Métricas Obrigatórias**
- ✅ Lighthouse Performance: >95
- ✅ Lighthouse Accessibility: >90  
- ✅ Core Web Vitals: Todos verdes
- ✅ Mobile Experience: Perfeita
- ✅ Loading Time: <2s

### **UX Requirements**
- ✅ Jornada fluida até orçamento WhatsApp
- ✅ Filtros intuitivos e responsivos
- ✅ Busca instantânea
- ✅ Cards hover suaves
- ✅ Estados de loading e erro

---

## 🔧 **Comandos e Environment**

### **Desenvolvimento**
```bash
npm run dev              # Local development
npm run build           # Production build
npm run lint            # ESLint check
npm run type-check      # TypeScript check

# Git workflow commands
git checkout develop                    # Switch to develop
git pull origin develop               # Update develop
git checkout -b feature/new-feature   # Create feature branch
git push origin feature/new-feature   # Push feature branch
```

### **Environment Variables**
```env
# Production (.env.production)
NEXT_PUBLIC_WORDPRESS_API_URL=https://nihon.com/wp-json
NEXT_PUBLIC_WHATSAPP_NUMBER=5591999999999

# Development (.env.local)
NEXT_PUBLIC_WORDPRESS_API_URL=https://staging.nihon.com/wp-json
NEXT_PUBLIC_WHATSAPP_NUMBER=5591888888888
```

---

## 🎨 **Recursos Modernos Obrigatórios**

### **Animações Sutis**
```typescript
// Usar ReactBits.dev ou Framer Motion
import { motion } from 'framer-motion'

<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="hover:scale-105 transition-transform"
>
```

### **Componentes OriginUI**
```typescript
// Sempre buscar componentes modernos em:
// https://originui.com
// https://ui.shadcn.com

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
```

---

## 🚗 **Contexto do Cliente**

**Nihon Auto Center**: 38+ anos no mercado automotivo
**Objetivo**: Modernizar presença digital, facilitar orçamentos
**Diferencial**: Design fora da curva + UX excepcional
**Meta**: Referência em e-commerce automotivo brasileiro

---

## 🏆 **Padrão de Excelência**

Este projeto deve ser **REFERÊNCIA** em:
- 🎨 **Design moderno** inspirado em Dribbble/Awwwards
- ⚡ **Performance excepcional** com Next.js otimizado  
- 📱 **Mobile experience** perfeita
- 🔄 **UX fluida** até conversão (orçamento)
- 🧩 **Código limpo** e escalável
- 🌳 **Git Flow profissional** com branches organizadas

**Sempre entregar trabalho fora da curva!** 🚀