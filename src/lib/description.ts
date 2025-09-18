import DOMPurify from 'isomorphic-dompurify'

// Padrões de URL do YouTube que suportamos
const YT_PATTERNS: RegExp[] = [
  /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})[^\s<]*/gi,
  /https?:\/\/(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{6,})[^\s<]*/gi,
  /https?:\/\/(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})[^\s<]*/gi
]

function toEmbed(id: string) {
  const src = `https://www.youtube.com/embed/${id}`
  return `<div class="video-responsive"><iframe src="${src}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>`
}

// Resolve o domínio do WordPress para absolutizar URLs relativas
function wpOrigin(): string {
  const pub = (process.env.NEXT_PUBLIC_WP_SITE_ORIGIN || process.env.NEXT_PUBLIC_WOOCOMMERCE_API_URL || '').trim()
  if (pub) {
    try {
      const u = new URL(pub.includes('/wp-json/') ? pub : pub + '/wp-json/')
      return u.origin
    } catch {}
  }
  // Fallback padrão (igual ao usado no serviço server-side)
  return 'https://darksalmon-cobra-736244.hostingersite.com'
}

function absolutizeRelativeUrls(input: string): string {
  const origin = wpOrigin()
  let out = input

  // 1) Promover atributos de lazy-loading para src/srcset
  out = out.replace(/\sdata-(?:lazy-)?(?:src|original)=(['"])(https?:[^'"\s>]+|\/\/[^'"\s>]+|\/(?!\/)[^'"\s>]+)\1/gi, (_m, q, val: string) => ` src=${q}${val}${q}`)
  out = out.replace(/\sdata-srcset=(["'])([^"']+)\1/gi, (_m, q, val: string) => ` srcset=${q}${val}${q}`)

  // 2) Absolutizar src/href que começam com '/'
  out = out.replace(/\ssrc=(["'])\/(?!\/)/gi, (_m, q) => ` src=${q}${origin}/`)
  out = out.replace(/\shref=(["'])\/(?!\/)/gi, (_m, q) => ` href=${q}${origin}/`)

  // 2b) Absolutizar src/href relativos (ex.: wp-content/uploads)
  out = out.replace(/\ssrc=(["'])(?!https?:|\/\/|data:|#|\/)\s*([^"'>\s]+)\1/gi, (_m, q, p: string) => ` src=${q}${origin}/${p.replace(/^\.?\//,'')}${q}`)
  out = out.replace(/\shref=(["'])(?!https?:|\/\/|#|\/)\s*([^"'>\s]+)\1/gi, (_m, q, p: string) => ` href=${q}${origin}/${p.replace(/^\.?\//,'')}${q}`)

  // 3) Tratar srcset (lista separada por vírgulas)
  out = out.replace(/\ssrcset=(["'])([^"'\n]+)\1/gi, (_m, q, val: string) => {
    const norm = val
      .split(',')
      .map(part => part.trim())
      .map(part => {
        const [url, size] = part.split(/\s+/, 2)
        const isRelative = !!url && !/^https?:/i.test(url) && !/^\//.test(url) && !/^\/\//.test(url)
        const abs = url
          ? url.startsWith('/') && !url.startsWith('//')
            ? origin + url
            : isRelative
              ? origin + '/' + url.replace(/^\.?\//, '')
              : url
          : url
        return [abs, size].filter(Boolean).join(' ')
      })
      .join(', ')
    return ` srcset=${q}${norm}${q}`
  })

  return out
}

// Converte links do YouTube em iframes responsivos + ajusta URLs relativas
export function enhanceDescription(html: string): string {
  if (!html) return ''
  let out = absolutizeRelativeUrls(html)

  // Links em texto puro
  for (const rx of YT_PATTERNS) {
    out = out.replace(rx, (_m, id) => toEmbed(String(id)))
  }

  // Âncoras <a href="...">...</a>
  out = out.replace(/<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, (full, href) => {
    for (const rx of YT_PATTERNS) {
      const m = String(href).match(rx)
      if (m && m[1]) return toEmbed(m[1])
    }
    return full
  })

  return out
}

// Sanitiza preservando tags necessárias para formatação e mídia
export function sanitizeDescription(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'p','br','strong','em','u','s','ul','ol','li','blockquote','code','pre',
      'h1','h2','h3','h4','h5','h6','hr','span','div','img','a','figure','figcaption',
      'table','thead','tbody','tr','th','td','iframe'
    ],
    ALLOWED_ATTR: ['href','target','rel','src','alt','title','width','height','style','loading','allow','allowfullscreen','frameborder','srcset'],
    ADD_TAGS: ['iframe'],
  })
}

// Prepara HTML pronto para dangerouslySetInnerHTML
export function prepareDescription(html: string): { __html: string } {
  const enhanced = enhanceDescription(html)
  const safe = sanitizeDescription(enhanced)
  return { __html: safe }
}