export function onlyDigits(v: string) {
  return (v || "").replace(/\D+/g, "")
}

export function maskCpfCnpj(v: string) {
  const digits = onlyDigits(v).slice(0, 14) // CPF 11, CNPJ 14
  if (digits.length <= 11) {
    // CPF: 000.000.000-00
    const p1 = digits.slice(0, 3)
    const p2 = digits.slice(3, 6)
    const p3 = digits.slice(6, 9)
    const p4 = digits.slice(9, 11)
    let out = p1
    if (p2) out += "." + p2
    if (p3) out += "." + p3
    if (p4) out += "-" + p4
    return out.slice(0, 14)
  }
  // CNPJ: 00.000.000/0000-00
  const p1 = digits.slice(0, 2)
  const p2 = digits.slice(2, 5)
  const p3 = digits.slice(5, 8)
  const p4 = digits.slice(8, 12)
  const p5 = digits.slice(12, 14)
  let out = p1
  if (p2) out += "." + p2
  if (p3) out += "." + p3
  if (p4) out += "/" + p4
  if (p5) out += "-" + p5
  return out.slice(0, 18)
}

export function maskPhoneBR(v: string) {
  const d = onlyDigits(v).slice(0, 11)
  const ddd = d.slice(0, 2)
  const nine = d.length > 10
  const p1 = nine ? d.slice(2, 7) : d.slice(2, 6)
  const p2 = nine ? d.slice(7, 11) : d.slice(6, 10)
  let out = ""
  if (ddd) out += `(${ddd}`
  if (ddd.length === 2) out += ") "
  if (p1) out += p1
  if (p2) out += "-" + p2
  return out
}

export function isEmail(v: string) {
  if (!v) return false
  // Simple RFC-5322-inspired, sufficient for UI validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v.trim())
}

export function isPhoneBR(v: string) {
  const d = onlyDigits(v)
  return d.length === 10 || d.length === 11
}

