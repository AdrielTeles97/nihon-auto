import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { revalidateTag } from '@/lib/cache'

function computeSignature(raw: string, secret: string) {
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(raw, 'utf8')
    return hmac.digest('base64')
}

// Método GET para testes e verificação de conectividade
export async function GET() {
    return NextResponse.json({
        ok: true,
        message: 'Webhook endpoint está ativo e pronto para receber eventos',
        timestamp: new Date().toISOString(),
        secretConfigured: !!process.env.WC_WEBHOOK_SECRET
    })
}

export async function POST(request: NextRequest) {
    const url = new URL(request.url)
    const debug =
        url.searchParams.get('debug') === '1' ||
        process.env.WC_WEBHOOK_DEBUG === 'true'
    const secret = process.env.WC_WEBHOOK_SECRET
    const signature = request.headers.get('x-wc-webhook-signature')
    const topicHeader = request.headers.get('x-wc-webhook-topic') || ''
    const resourceHeader = request.headers.get('x-wc-webhook-resource') || ''
    const eventHeader = request.headers.get('x-wc-webhook-event') || ''
    const raw = await request.text()

    // Log para debug
    console.log('[WEBHOOK DEBUG]', {
        hasSecret: !!secret,
        hasSignature: !!signature,
        topic: topicHeader,
        resource: resourceHeader,
        event: eventHeader,
        rawLength: raw.length
    })

    // Signature verification
    if (secret) {
        const expected = computeSignature(raw, secret)
        const valid =
            !!signature &&
            crypto.timingSafeEqual(
                Buffer.from(signature),
                Buffer.from(expected)
            )
        if (!valid) {
            if (debug) {
                return NextResponse.json(
                    {
                        ok: false,
                        error: 'bad signature',
                        got: signature,
                        expected,
                        topicHeader,
                        resourceHeader,
                        eventHeader
                    },
                    { status: 401 }
                )
            }
            return NextResponse.json(
                { ok: false, error: 'bad signature' },
                { status: 401 }
            )
        }
    }

    try {
        const payload = JSON.parse(raw) as any
        const resource = String(
            payload?.resource || resourceHeader || ''
        ).toLowerCase()
        const topic = String(payload?.topic || topicHeader || '').toLowerCase()
        const event = String(payload?.event || eventHeader || '').toLowerCase()
        const id =
            String(
                payload?.id || payload?.resource_id || payload?.data?.id || ''
            ) || undefined

        const revalidated: string[] = []

        // Produtos - Revalidação granular e inteligente
        if (resource.includes('product') || topic.includes('product')) {
            // Sempre revalida a lista de produtos
            revalidateTag('wc:products')
            revalidated.push('wc:products')

            // Se for um produto específico, revalida apenas ele
            if (id) {
                revalidateTag(`wc:product:${id}`)
                revalidated.push(`wc:product:${id}`)

                // Se o produto foi deletado, revalida também produtos relacionados
                if (event.includes('deleted')) {
                    revalidateTag(`wc:product:${id}:related`)
                    revalidated.push(`wc:product:${id}:related`)
                }
            }

            // Log para debug
            if (debug) {
                console.log(`[WEBHOOK] Produto ${event}: ID ${id}`)
            }
        }

        // Categorias - Afeta produtos e listagens
        if (
            resource.includes('category') ||
            resource.includes('product_cat') ||
            topic.includes('product.category')
        ) {
            revalidateTag('wc:categories')
            revalidated.push('wc:categories')

            // Mudanças em categorias afetam listagem de produtos
            revalidateTag('wc:products')
            revalidated.push('wc:products')

            if (debug) {
                console.log(`[WEBHOOK] Categoria ${event}: ID ${id}`)
            }
        }

        // Marcas - Muito raro de mudar
        if (
            resource.includes('brand') ||
            resource.includes('product_brand') ||
            topic.includes('product.brand')
        ) {
            revalidateTag('wc:brands')
            revalidated.push('wc:brands')

            // Mudanças em marcas afetam produtos
            revalidateTag('wc:products')
            revalidated.push('wc:products')

            if (debug) {
                console.log(`[WEBHOOK] Marca ${event}: ID ${id}`)
            }
        }

        // Variações de produto
        if (
            topic.includes('product_variation') ||
            resource.includes('variation')
        ) {
            // Revalida o produto pai
            const parentId = payload?.parent_id || payload?.product_id
            if (parentId) {
                revalidateTag(`wc:product:${parentId}`)
                revalidated.push(`wc:product:${parentId}`)
            }

            // Revalida lista de produtos
            revalidateTag('wc:products')
            revalidated.push('wc:products')

            if (debug) {
                console.log(
                    `[WEBHOOK] Variação ${event}: ID ${id}, Produto Pai: ${parentId}`
                )
            }
        }

        // Log de sucesso
        const timestamp = new Date().toISOString()
        console.log(
            `[${timestamp}] Webhook processado: ${topic} | Revalidados: ${revalidated.join(
                ', '
            )}`
        )

        if (debug) {
            return NextResponse.json({
                ok: true,
                revalidated,
                resource,
                topic,
                event,
                id,
                timestamp
            })
        }
        return NextResponse.json({ ok: true, revalidated: revalidated.length })
    } catch (e) {
        const error = e instanceof Error ? e.message : 'Unknown error'
        console.error('[WEBHOOK ERROR]', error)
        return NextResponse.json({ ok: false, error }, { status: 200 })
    }
}
