import { NextRequest, NextResponse } from 'next/server'

export function middleware(_request: NextRequest) {
    const response = NextResponse.next()

    // Remover CSP em desenvolvimento para evitar problemas
    if (process.env.NODE_ENV === 'development') {
        response.headers.delete('content-security-policy')
        response.headers.delete('Content-Security-Policy')
        response.headers.set('x-csp-disabled', 'development')
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
}
