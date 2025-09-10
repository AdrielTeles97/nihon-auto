import { NextResponse } from 'next/server'

// Força o Next.js a não cachear esta rota
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
    try {
        // Por enquanto, vamos usar dados diretos do plugin WordPress que já estão salvos
        // Baseado na imagem, os dados atuais são:
        const companyData = {
            whatsapp: '5591992475485',
            email: 'adrielt008@gmail.com',
            working_hours: 'Seg-Sex: 8h às 20h',
            address: 'Travessa José Pio, 541 - Umarizal - Belém/PA',
            company_name: 'Nihon Peças e Acessórios',
            company_description:
                'Especialistas em peças e acessórios automotivos com mais de 15 anos de experiência no mercado brasileiro.',
            social_media: {
                facebook: '',
                instagram: '',
                linkedin: ''
            }
        }

        const response = NextResponse.json(companyData)

        // Headers para evitar cache
        response.headers.set(
            'Cache-Control',
            'no-cache, no-store, must-revalidate'
        )
        response.headers.set('Pragma', 'no-cache')
        response.headers.set('Expires', '0')

        return response
    } catch (error) {
        // Retornar dados padrão em caso de erro
        const fallbackData = {
            whatsapp: '5591992475485',
            email: 'adrielt008@gmail.com',
            working_hours: 'Seg-Sex: 8h às 20h',
            address: 'Travessa José Pio, 541 - Umarizal - Belém/PA',
            company_name: 'Nihon Peças e Acessórios',
            company_description:
                'Especialistas em peças e acessórios automotivos com mais de 15 anos de experiência no mercado brasileiro.',
            social_media: {
                facebook: '',
                instagram: '',
                linkedin: ''
            }
        }

        const response = NextResponse.json(fallbackData)

        // Headers para evitar cache mesmo no fallback
        response.headers.set(
            'Cache-Control',
            'no-cache, no-store, must-revalidate'
        )
        response.headers.set('Pragma', 'no-cache')
        response.headers.set('Expires', '0')

        return response
    }
}
