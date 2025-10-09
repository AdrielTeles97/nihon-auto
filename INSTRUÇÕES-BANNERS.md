# Instruções para Banners

## 📐 Hero Carousel (Topo da Página)

### Dimensões Recomendadas:

-   **1900 x 725 pixels**
-   Formato: webp ou web
-   Qualidade: Alta resolução

### Localização dos arquivos:

Coloque seus banners na pasta `public/images/`

### Banners atuais configurados:

1. `/images/nihon-hero-2.webp`
2. `/images/banner-02-nihon.webp`
3. `/images/nihon-hero-3.webp`

### Como adicionar novos banners:

Edite o arquivo `src/components/hero-section.tsx` e adicione no array `slides`:

```typescript
{
    src: '/images/seu-banner.webp',
    alt: 'Descrição do banner',
    title: 'Título (opcional)',
    description: 'Descrição (opcional)',
    showButtons: false // true para mostrar botões
}
```

---

## 🎯 Banners Duplos (Antes do Footer)

### Dimensões Recomendadas:

-   **Formato 16:9 ou 16:10**
-   Mínimo: 800 x 600 pixels
-   Recomendado: 1200 x 800 pixels
-   Formato: webp ou web

### Imagens necessárias:

1. **Banner Áudio e Vídeo**

    - Arquivo: `public/images/banner-audio-e-video.webp` ✅
    - Link: Leva para `/produtos?category=audio-e-video`

2. **Banner Frisos**
    - Arquivo: `public/images/banner-frisos.webp` ✅
    - Link: Leva para `/produtos?category=frisos`

### Como customizar os banners:

Edite o arquivo `src/components/sections/DoubleBanners.tsx`:

```typescript
const banners: BannerData[] = [
    {
        image: '/images/sua-imagem.webp',
        alt: 'Descrição da imagem',
        title: 'Título do Banner',
        description: 'Descrição do produto/categoria',
        link: '/produtos?category=slug-da-categoria', // Use o slug da categoria do WooCommerce
        category: 'Nome da Categoria'
    }
    // ... adicione mais banners
]
```

**Nota:** Use o parâmetro `category` (não `categoria`) seguido do **slug** da categoria do WooCommerce.

---

## ✨ Ajustes Realizados

### Hero Carousel:

-   ✅ Otimizado para banners **1900x725**
-   ✅ Fundo preto para melhor contraste
-   ✅ `object-contain` para manter proporções sem cortar
-   ✅ Centralizado vertical e horizontalmente
-   ✅ Altura responsiva adaptada ao formato

### Banners Duplos:

-   ✅ Layout responsivo (2 colunas desktop, 1 coluna mobile)
-   ✅ Efeito hover elegante com zoom
-   ✅ Gradiente overlay para melhor legibilidade
-   ✅ Linhas decorativas estilo moderno
-   ✅ Call-to-action com animação
-   ✅ Badges de categoria

---

## 📝 Próximos Passos

1. **✅ Imagens dos banners adicionadas:**

    - ✅ `public/images/banner-audio-e-video.webp`
    - ✅ `public/images/banner-frisos.webp`

2. **Verifique os slugs das categorias no WooCommerce:**

    - Certifique-se que as categorias `audio-e-video` e `frisos` existem
    - Ou ajuste os links no componente `DoubleBanners.tsx` para os slugs corretos

3. **Teste a responsividade:**

    - Mobile
    - Tablet
    - Desktop

4. **Personalize conforme necessário:**
    - Cores
    - Textos
    - Animações
