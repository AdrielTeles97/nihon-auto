export function getWhatsAppUrl(message: string) {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
    const base = 'https://wa.me'
    const text = encodeURIComponent(message)
    return number ? `${base}/${number}?text=${text}` : `${base}?text=${text}`
}

export function getWhatsAppQuoteUrl(productName: string, productCode: string) {
    // Número fixo da Nihon acessórios
    const nihonNumber = '559182337100'
    const base = 'https://wa.me'

    const message = `Olá! Gostaria de solicitar um orçamento para o seguinte produto:

📱 *${productName}*
🔢 *Código:* ${productCode}

Por favor, me envie as informações de preço e disponibilidade.

Obrigado!`

    const text = encodeURIComponent(message)
    return `${base}/${nihonNumber}?text=${text}`
}
