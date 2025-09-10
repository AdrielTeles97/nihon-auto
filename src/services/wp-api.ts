import axios from 'axios'

// Resolve a WooCommerce base URL from envs
function resolveBaseUrl(): string {
    const site = (
        process.env.WORDPRESS_BASE_URL ||
        process.env.NEXT_PUBLIC_WOOCOMMERCE_API_URL ||
        ''
    ).trim()

    if (!site) {
        // Sensible fallback to avoid breaking in dev
        return 'https://darksalmon-cobra-736244.hostingersite.com/wp-json/wc/v3'
    }

    // If caller already provided the full wc api path, just normalize trailing slash
    if (site.includes('/wp-json/wc/')) {
        return site.replace(/\/$/, '')
    }

    return site.replace(/\/$/, '') + '/wp-json/wc/v3'
}

const baseURL = resolveBaseUrl()

const CONSUMER_KEY =
    process.env.WOOCOMMERCE_CONSUMER_KEY ||
    process.env.WC_CONSUMER_KEY ||
    process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY ||
    ''

const CONSUMER_SECRET =
    process.env.WOOCOMMERCE_CONSUMER_SECRET ||
    process.env.WC_CONSUMER_SECRET ||
    process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET ||
    ''

export const wpApi = axios.create({
    baseURL,
    timeout: 15000,
    params: {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET
    }
})

export function assertWooConfig() {
    if (!baseURL || !CONSUMER_KEY || !CONSUMER_SECRET) {
        // Missing WooCommerce configuration
    }
}

export type WPImage = {
    id: number
    src: string
    alt?: string
    name?: string
}
