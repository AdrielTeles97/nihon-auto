import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
    try {
        const { tags } = await request.json()
        
        if (!tags || !Array.isArray(tags)) {
            return NextResponse.json({ 
                error: 'Tags array is required' 
            }, { status: 400 })
        }

        const revalidated: string[] = []
        
        for (const tag of tags) {
            revalidateTag(tag)
            revalidated.push(tag)
        }

        return NextResponse.json({
            ok: true,
            revalidated,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        return NextResponse.json({ 
            error: 'Failed to revalidate' 
        }, { status: 500 })
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Use POST to revalidate cache tags',
        example: {
            method: 'POST',
            body: {
                tags: ['wc:products', 'wc:product:673']
            }
        }
    })
}
