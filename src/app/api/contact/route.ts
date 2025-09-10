import { submitContact } from '@/lib/wordpress-api'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validação básica
        const { name, email, subject, message } = body

        if (!name || !email || !message) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Nome, email e mensagem são obrigatórios'
                },
                { status: 400 }
            )
        }

        // Enviar para o WordPress
        const result = await submitContact({
            name,
            email,
            subject: subject || 'Contato pelo site',
            message
        })

        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Erro interno do servidor'
            },
            { status: 500 }
        )
    }
}
