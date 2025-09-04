export function getWhatsAppUrl(message: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const base = 'https://wa.me';
  const text = encodeURIComponent(message);
  return number ? `${base}/${number}?text=${text}` : `${base}?text=${text}`;
}

