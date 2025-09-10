import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { revalidateTag } from '@/lib/cache'

function computeSignature(raw: string, secret: string) {
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(raw, 'utf8')
    return hmac.digest('base64')
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
        const id =
            String(
                payload?.id || payload?.resource_id || payload?.data?.id || ''
            ) || undefined

        // Produtos
        if (resource.includes('product') || topic.includes('product')) {
            revalidateTag('wc:products')
            if (id) revalidateTag(`wc:product:${id}`)
        }

        // Categorias
        if (
            resource.includes('category') ||
            resource.includes('product_cat') ||
            topic.includes('product.category')
        ) {
            revalidateTag('wc:categories')
            revalidateTag('wc:products')
        }

        // Marcas (plugin comum usa product_brand)
        if (
            resource.includes('brand') ||
            resource.includes('product_brand') ||
            topic.includes('product.brand')
        ) {
            revalidateTag('wc:brands')
            revalidateTag('wc:products')
        }

        if (debug) {
            return NextResponse.json({
                ok: true,
                revalidated: true,
                resource,
                topic,
                id
            })
        }
        return NextResponse.json({ ok: true, revalidated: true })
    } catch (e) {
        return NextResponse.json({ ok: false }, { status: 200 })
    }
}
