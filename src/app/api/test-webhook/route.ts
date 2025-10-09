import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const url = new URL(request.url)
    const debug = url.searchParams.get('debug') === '1'
    
    return NextResponse.json({
        ok: true,
        message: 'Teste de webhook funcionando!',
        timestamp: new Date().toISOString(),
        debug: debug,
        secretConfigured: !!process.env.WC_WEBHOOK_SECRET,
        method: 'GET'
    })
}

export async function POST(request: NextRequest) {
    const url = new URL(request.url)
    const debug = url.searchParams.get('debug') === '1'
    
    return NextResponse.json({
        ok: true,
        message: 'Teste de webhook POST funcionando!',
        timestamp: new Date().toISOString(),
        debug: debug,
        secretConfigured: !!process.env.WC_WEBHOOK_SECRET,
        method: 'POST'
    })
}
