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

// Converte links do YouTube em iframes responsivos
export function enhanceDescription(html: string): string {
  if (!html) return ''
  let out = html

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
    ALLOWED_ATTR: ['href','target','rel','src','alt','title','width','height','style','loading','allow','allowfullscreen','frameborder'],
    ADD_TAGS: ['iframe'],
  })
}

// Prepara HTML pronto para dangerouslySetInnerHTML
export function prepareDescription(html: string): { __html: string } {
  const enhanced = enhanceDescription(html)
  const safe = sanitizeDescription(enhanced)
  return { __html: safe }
}

