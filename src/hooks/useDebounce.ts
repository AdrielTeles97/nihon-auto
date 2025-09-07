import { useCallback, useEffect, useState } from 'react'

/**
 * Hook para implementar debounce em valores
 * @param value - Valor a ser "debouncado"
 * @param delay - Tempo em milissegundos para aguardar (padrão: 500ms)
 * @returns Valor após o delay
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

/**
 * Hook para busca com debounce
 * @param initialValue - Valor inicial
 * @param delay - Tempo em milissegundos para aguardar (padrão: 500ms)
 * @returns [searchTerm, debouncedSearchTerm, setSearchTerm]
 */
export function useSearch(initialValue: string = '', delay: number = 500) {
    const [searchTerm, setSearchTerm] = useState(initialValue)
    const debouncedSearchTerm = useDebounce(searchTerm, delay)

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value)
    }, [])

    return [searchTerm, debouncedSearchTerm, handleSearchChange] as const
}
