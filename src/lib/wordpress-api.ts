// Configuração da API do WordPress
export const WORDPRESS_API_BASE =
    process.env.WORDPRESS_BASE_URL || 'http://localhost/wordpress'

export const API_ENDPOINTS = {
    // Endpoints do plugin Nihon Auto
    QUOTE: `${WORDPRESS_API_BASE}/wp-json/nihon-auto/v1/quote`,
    CONTACT: `${WORDPRESS_API_BASE}/wp-json/nihon-auto/v1/contact`,
    SETTINGS: `${WORDPRESS_API_BASE}/wp-json/nihon-auto/v1/settings`,

    // Endpoints padrão do WordPress
    PRODUCTS: `${WORDPRESS_API_BASE}/wp-json/wc/v3/products`,
    CATEGORIES: `${WORDPRESS_API_BASE}/wp-json/wc/v3/products/categories`,
    BRANDS: `${WORDPRESS_API_BASE}/wp-json/nihon-auto/v1/brands`
}

// Tipos para as requisições
export interface QuoteRequest {
    name: string
    document?: string
    email?: string
    phone?: string
    cart_items: {
        product: {
            id: string | number
            name: string
            slug?: string
            image?: string
            categories?: any[]
        }
        quantity: number
    }[]
    message?: string
}

export interface ContactRequest {
    name: string
    email: string
    phone?: string
    subject?: string
    message: string
}

export interface ApiResponse<T = unknown> {
    success: boolean
    message: string
    data?: T
    id?: number
}

// Função para enviar pedido de orçamento
export async function submitQuote(data: QuoteRequest): Promise<ApiResponse> {
    try {
        console.log('Enviando cotação:', data)

        const response = await fetch(API_ENDPOINTS.QUOTE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        console.log('Response status:', response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Error response:', errorText)
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('Quote result:', result)
        return result
    } catch (error) {
        console.error('Erro ao enviar orçamento:', error)
        return {
            success: false,
            message: 'Erro ao enviar pedido de orçamento. Tente novamente.'
        }
    }
}

// Função para enviar contato
export async function submitContact(
    data: ContactRequest
): Promise<ApiResponse> {
    try {
        console.log('Enviando contato:', data)

        const response = await fetch(API_ENDPOINTS.CONTACT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        console.log('Contact response status:', response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Contact error response:', errorText)
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('Contact result:', result)
        return result
    } catch (error) {
        console.error('Erro ao enviar contato:', error)
        return {
            success: false,
            message: 'Erro ao enviar contato. Tente novamente.'
        }
    }
}

// Função para obter configurações públicas (WhatsApp, etc.)
export async function getPublicSettings(): Promise<{
    whatsapp?: string
    email?: string
    business_hours?: string
    address?: string
}> {
    try {
        const response = await fetch(API_ENDPOINTS.SETTINGS)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error('Erro ao obter configurações:', error)
        return {
            whatsapp: '5511999999999' // Fallback
        }
    }
}
