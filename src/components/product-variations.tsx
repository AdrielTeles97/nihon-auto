'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/products'
import { X } from 'lucide-react'

interface ProductVariationsProps {
    product: Product
    selectedAttrs: Record<string, string>
    onSelectionChange: (attrs: Record<string, string>) => void
}

interface VariationOption {
    value: string
    available: boolean
    inStock: boolean
}

export function ProductVariations({
    product,
    selectedAttrs,
    onSelectionChange
}: ProductVariationsProps) {
    // Normaliza chave de atributo: minúscula, sem espaços, sem prefixo pa_
    const normalizeKey = (key: string): string =>
        (key || '').toLowerCase().trim().replace(/^pa_/, '')

    // Normaliza valor: minúscula, sem espaços extras
    const normalizeValue = (val: string): string =>
        (val || '').toLowerCase().trim()

    // Extrai todos os atributos e valores dos ATRIBUTOS DO PRODUTO + variações
    const { attributeMap, attributeKeys, originalValues } = useMemo(() => {
        const map: Record<string, Set<string>> = {}
        const originals: Record<string, Map<string, string>> = {}

        // 1. Primeiro, adicionar TODOS os valores declarados nos atributos do produto
        ;(product.attributes || [])
            .filter(attr => attr.variation)
            .forEach(attr => {
                const normKey = normalizeKey(attr.name || '')
                if (!map[normKey]) {
                    map[normKey] = new Set()
                    originals[normKey] = new Map()
                }

                // Adicionar todos os valores possíveis do atributo
                ;(attr.options || []).forEach(option => {
                    const normValue = normalizeValue(option)
                    map[normKey].add(normValue)
                    if (!originals[normKey].has(normValue)) {
                        originals[normKey].set(normValue, option)
                    }
                })
            })

        // 2. Adicionar valores que aparecem nas variações (caso falte algum nos atributos)
        if (product.variations?.length) {
            product.variations.forEach(variation => {
                Object.entries(variation.attributes || {}).forEach(
                    ([key, value]) => {
                        const normKey = normalizeKey(key)
                        const normValue = normalizeValue(value)

                        if (!map[normKey]) {
                            map[normKey] = new Set()
                            originals[normKey] = new Map()
                        }
                        map[normKey].add(normValue)
                        if (!originals[normKey].has(normValue)) {
                            originals[normKey].set(normValue, value)
                        }
                    }
                )
            })
        }

        const keys = Object.keys(map).sort()
        return {
            attributeMap: map,
            attributeKeys: keys,
            originalValues: originals
        }
    }, [product.attributes, product.variations])

    // Para cada atributo, calcular quais valores estão disponíveis na seleção atual
    const availableOptions = useMemo(() => {
        const result: Record<string, VariationOption[]> = {}

        if (!product.variations?.length) return result

        attributeKeys.forEach(attrKey => {
            const values = Array.from(attributeMap[attrKey] || [])
            const options: VariationOption[] = []

            values.forEach(value => {
                // Filtrar variações que têm este valor
                const variationsWithValue = product.variations!.filter(
                    variation => {
                        const varValue = normalizeValue(
                            variation.attributes?.[attrKey] || ''
                        )
                        const match = varValue === value

                        if (attrKey === 'cor') {
                            console.log(
                                `Variação ${variation.id}: atributo[${attrKey}]="${varValue}" === "${value}"? ${match}`
                            )
                        }

                        return match
                    }
                )

                if (attrKey === 'cor') {
                    console.log(
                        `Cor "${value}": ${variationsWithValue.length} variações encontradas`,
                        variationsWithValue.map(v => v.id)
                    )
                }

                // Se não há nenhuma variação com este valor, marcar como indisponível
                if (variationsWithValue.length === 0) {
                    options.push({
                        value,
                        available: false,
                        inStock: false
                    })
                    return
                }

                // Verificar compatibilidade com outros atributos selecionados
                const compatibleVariations = variationsWithValue.filter(
                    variation => {
                        // Verificar compatibilidade com OUTROS atributos selecionados
                        for (const [selKey, selValue] of Object.entries(
                            selectedAttrs
                        )) {
                            if (!selValue) continue // ignorar vazios

                            const normSelKey = normalizeKey(selKey)
                            if (normSelKey === attrKey) continue // ignorar o próprio atributo

                            const varAttrValue = normalizeValue(
                                variation.attributes?.[normSelKey] || ''
                            )

                            // Se variação não define, não restringe
                            if (!varAttrValue) continue

                            // Se não bate com o selecionado, não é compatível
                            if (varAttrValue !== normalizeValue(selValue)) {
                                return false
                            }
                        }

                        return true
                    }
                )

                const hasInStock = compatibleVariations.some(
                    v => v.inStock !== false
                )
                const available = compatibleVariations.length > 0

                options.push({
                    value,
                    available,
                    inStock: hasInStock
                })
            })

            result[attrKey] = options
        })

        return result
    }, [product.variations, selectedAttrs, attributeKeys, attributeMap])

    const handleAttributeChange = (attributeKey: string, value: string) => {
        onSelectionChange({
            ...selectedAttrs,
            [attributeKey]: value
        })
    }

    // Obter nome de exibição do atributo
    const getDisplayName = (key: string): string => {
        const found = (product.attributes || []).find(
            a => normalizeKey(a.name || '') === key
        )
        if (found?.name) return found.name
        return key.charAt(0).toUpperCase() + key.slice(1)
    }

    // Obter valor original (com capitalização) para exibição
    const getOriginalValue = (attrKey: string, normValue: string): string => {
        return originalValues[attrKey]?.get(normValue) || normValue
    }

    if (!attributeKeys.length) return null

    return (
        <div className="space-y-6 pt-4">
            {attributeKeys.map(attrKey => {
                const currentValue = selectedAttrs[attrKey] || ''
                const options = availableOptions[attrKey] || []
                const displayName = getDisplayName(attrKey)

                const isColorAttribute =
                    attrKey.includes('cor') || attrKey.includes('color')
                const isStitchAttribute =
                    attrKey.includes('costura') ||
                    attrKey.includes('acabamento')

                // Log para debug
                console.log(`Atributo: ${attrKey}`, {
                    displayName,
                    options,
                    currentValue,
                    isColorAttribute,
                    isStitchAttribute
                })

                return (
                    <div key={attrKey} className="space-y-3">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">
                                {displayName}:
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            {currentValue && (
                                <span className="text-sm text-muted-foreground">
                                    {getOriginalValue(
                                        attrKey,
                                        normalizeValue(currentValue)
                                    )}
                                </span>
                            )}
                        </div>

                        {isColorAttribute ? (
                            <div className="flex flex-wrap gap-3">
                                {options.map(
                                    ({ value, available, inStock }) => {
                                        const originalValue = getOriginalValue(
                                            attrKey,
                                            value
                                        )
                                        const isSelected =
                                            normalizeValue(currentValue) ===
                                            value
                                        const isDisabled =
                                            !available || !inStock

                                        return (
                                            <div
                                                key={value}
                                                className="flex flex-col items-center gap-1"
                                            >
                                                <button
                                                    onClick={() =>
                                                        !isDisabled &&
                                                        handleAttributeChange(
                                                            attrKey,
                                                            originalValue
                                                        )
                                                    }
                                                    disabled={isDisabled}
                                                    className={cn(
                                                        'relative w-10 h-10 rounded-full border-2 transition-all duration-200 shadow-sm',
                                                        'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
                                                        'cursor-pointer active:scale-95',
                                                        isSelected
                                                            ? 'border-red-500 ring-2 ring-red-200 scale-110'
                                                            : 'border-gray-300 hover:border-red-400',
                                                        !isDisabled
                                                            ? 'hover:scale-110 hover:shadow-md'
                                                            : 'opacity-40 cursor-not-allowed',
                                                        getColorStyle(
                                                            originalValue
                                                        )
                                                    )}
                                                    title={
                                                        isDisabled
                                                            ? `${originalValue} (indisponível)`
                                                            : originalValue
                                                    }
                                                >
                                                    {isDisabled && (
                                                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/80">
                                                            <X
                                                                className="w-4 h-4 text-red-500"
                                                                strokeWidth={3}
                                                            />
                                                        </div>
                                                    )}
                                                </button>
                                                <span
                                                    className={cn(
                                                        'text-xs text-center max-w-[60px] truncate',
                                                        !isDisabled
                                                            ? 'text-gray-700'
                                                            : 'text-gray-400',
                                                        isSelected &&
                                                            'font-medium text-red-700'
                                                    )}
                                                >
                                                    {originalValue}
                                                </span>
                                            </div>
                                        )
                                    }
                                )}
                            </div>
                        ) : isStitchAttribute ? (
                            <div className="flex flex-wrap gap-2">
                                {options.map(
                                    ({ value, available, inStock }) => {
                                        const originalValue = getOriginalValue(
                                            attrKey,
                                            value
                                        )
                                        const isSelected =
                                            normalizeValue(currentValue) ===
                                            value
                                        const isDisabled =
                                            !available || !inStock

                                        return (
                                            <button
                                                key={value}
                                                onClick={() =>
                                                    !isDisabled &&
                                                    handleAttributeChange(
                                                        attrKey,
                                                        originalValue
                                                    )
                                                }
                                                disabled={isDisabled}
                                                className={cn(
                                                    'relative px-3 py-2 text-xs border rounded-lg transition-all duration-200',
                                                    'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1',
                                                    'min-w-[70px] text-center font-medium cursor-pointer active:scale-95',
                                                    isSelected
                                                        ? 'border-red-500 bg-red-50 text-red-700 shadow-sm ring-1 ring-red-200'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:border-red-400',
                                                    !isDisabled
                                                        ? 'hover:shadow-md'
                                                        : 'cursor-not-allowed bg-gray-50 text-gray-400 opacity-60'
                                                )}
                                                title={
                                                    isDisabled
                                                        ? `${originalValue} (indisponível)`
                                                        : originalValue
                                                }
                                            >
                                                <span
                                                    className={cn(
                                                        isDisabled &&
                                                            'line-through decoration-2'
                                                    )}
                                                >
                                                    {originalValue}
                                                </span>
                                                {isDisabled && (
                                                    <div className="absolute -top-1 -right-1">
                                                        <div className="w-4 h-4 rounded-full flex items-center justify-center shadow-sm bg-red-500">
                                                            <X
                                                                className="w-2.5 h-2.5 text-white"
                                                                strokeWidth={3}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    }
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {options.map(
                                    ({ value, available, inStock }) => {
                                        const originalValue = getOriginalValue(
                                            attrKey,
                                            value
                                        )
                                        const isSelected =
                                            normalizeValue(currentValue) ===
                                            value
                                        const isDisabled =
                                            !available || !inStock

                                        return (
                                            <button
                                                key={value}
                                                onClick={() =>
                                                    !isDisabled &&
                                                    handleAttributeChange(
                                                        attrKey,
                                                        originalValue
                                                    )
                                                }
                                                disabled={isDisabled}
                                                className={cn(
                                                    'relative px-4 py-2 text-sm border rounded-lg transition-all duration-200',
                                                    'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1',
                                                    'min-w-[80px] text-center font-medium cursor-pointer active:scale-95',
                                                    isSelected
                                                        ? 'border-red-500 bg-red-50 text-red-700 shadow-sm ring-1 ring-red-200'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:border-red-400',
                                                    !isDisabled
                                                        ? 'hover:shadow-md'
                                                        : 'cursor-not-allowed bg-gray-50 text-gray-400 opacity-60'
                                                )}
                                                title={
                                                    isDisabled
                                                        ? `${originalValue} (indisponível)`
                                                        : originalValue
                                                }
                                            >
                                                <span
                                                    className={cn(
                                                        isDisabled &&
                                                            'line-through decoration-2'
                                                    )}
                                                >
                                                    {originalValue}
                                                </span>
                                                {isDisabled && (
                                                    <div className="absolute -top-1 -right-1">
                                                        <div className="w-4 h-4 rounded-full flex items-center justify-center shadow-sm bg-red-500">
                                                            <X
                                                                className="w-2.5 h-2.5 text-white"
                                                                strokeWidth={3}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    }
                                )}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

// Detecta se é código hex ou rgb e retorna style inline; senão, retorna classe Tailwind
function getColorStyle(colorName: string): string {
    const name = colorName.toLowerCase().trim()

    // Detectar formato hex (#fff, #ffffff)
    if (/^#[0-9a-f]{3,6}$/i.test(name)) {
        return '' // retornaremos style inline depois
    }

    // Detectar formato rgb/rgba
    if (/^rgba?\(/.test(name)) {
        return '' // retornaremos style inline depois
    }

    // Mapeamento de nomes para classes Tailwind
    const colorMap: Record<string, string> = {
        preto: 'bg-black border-gray-400',
        black: 'bg-black border-gray-400',
        branco: 'bg-white border-gray-400',
        white: 'bg-white border-gray-400',
        branca: 'bg-white border-gray-400',

        marrom: 'bg-amber-800 border-amber-900',
        brown: 'bg-amber-800 border-amber-900',
        bege: 'bg-amber-100 border-amber-300',
        beige: 'bg-amber-100 border-amber-300',

        cinza: 'bg-gray-500 border-gray-600',
        gray: 'bg-gray-500 border-gray-600',
        grey: 'bg-gray-500 border-gray-600',
        grafite: 'bg-gray-700 border-gray-800',
        prata: 'bg-gray-300 border-gray-400',
        silver: 'bg-gray-300 border-gray-400',

        vermelho: 'bg-red-600 border-red-700',
        red: 'bg-red-600 border-red-700',
        bordô: 'bg-red-900 border-red-950',
        vinho: 'bg-red-800 border-red-900',

        azul: 'bg-blue-600 border-blue-700',
        blue: 'bg-blue-600 border-blue-700',
        marinho: 'bg-blue-900 border-blue-950',
        navy: 'bg-blue-900 border-blue-950',

        verde: 'bg-green-600 border-green-700',
        green: 'bg-green-600 border-green-700',

        amarelo: 'bg-yellow-500 border-yellow-600',
        yellow: 'bg-yellow-500 border-yellow-600',

        laranja: 'bg-orange-500 border-orange-600',
        orange: 'bg-orange-500 border-orange-600',

        rosa: 'bg-pink-400 border-pink-500',
        pink: 'bg-pink-400 border-pink-500',

        roxo: 'bg-purple-600 border-purple-700',
        purple: 'bg-purple-600 border-purple-700',
        lilás: 'bg-purple-400 border-purple-500',
        lilas: 'bg-purple-400 border-purple-500',

        dourado: 'bg-yellow-600 border-yellow-700',
        gold: 'bg-yellow-600 border-yellow-700',

        bronze: 'bg-amber-700 border-amber-800',
        cobre: 'bg-orange-700 border-orange-800'
    }

    // Procurar por match parcial
    for (const [key, className] of Object.entries(colorMap)) {
        if (name.includes(key)) {
            return className
        }
    }

    // Cor desconhecida: mostrar gradiente multicolorido como placeholder
    return 'bg-gradient-to-br from-gray-300 to-gray-400 border-gray-500'
}
