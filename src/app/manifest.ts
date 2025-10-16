import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Nihon Acessórios Automotivos',
        short_name: 'Nihon Auto',
        description:
            'Catálogo virtual de produtos automotivos da Nihon Acessórios Automotivos',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#dc2626',
        orientation: 'portrait-primary',
        icons: [
            {
                src: '/images/logo-nihon.png',
                sizes: 'any',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/images/logo-nihon.png',
                sizes: 'any',
                type: 'image/png',
                purpose: 'any'
            }
        ],
        categories: ['shopping', 'automotive'],
        lang: 'pt-BR',
        dir: 'ltr'
    }
}
