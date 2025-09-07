'use client'
import Link from 'next/link'
import { Menu, Search, ShoppingCart, X } from 'lucide-react'
import React, { useEffect } from 'react'
import Image from 'next/image'
import { Input } from '../ui/input'
import { useCart } from '@/contexts/cart-context'
import { useRouter, usePathname } from 'next/navigation'
import { useSearch } from '@/hooks/useDebounce'

// Updated with hover effects and cursor pointer - red hover color

const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'A nihon', href: '/a-nihon' },
    { name: 'Catálogo', href: '/produtos' },
    { name: 'Marcas', href: '/marcas' },
    { name: 'Atendimento', href: '/atendimento' }
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const { cart } = useCart()
    const router = useRouter()
    const pathname = usePathname()

    // Inicializar com o valor da URL apenas uma vez quando o componente montar
    const [initialized, setInitialized] = React.useState(false)
    const [searchTerm, debouncedSearchTerm, handleSearchChange] = useSearch('')

    // Inicializar o termo de busca apenas uma vez
    useEffect(() => {
        if (
            !initialized &&
            typeof window !== 'undefined' &&
            pathname === '/produtos'
        ) {
            const params = new URLSearchParams(window.location.search)
            const urlSearch = params.get('search') || ''
            if (urlSearch) {
                handleSearchChange(urlSearch)
            }
            setInitialized(true)
        }
    }, [pathname, initialized, handleSearchChange])

    // Efeito para navegar quando o termo de busca mudar (apenas quando debounced)
    useEffect(() => {
        if (!initialized) return // Não fazer nada até estar inicializado

        if (debouncedSearchTerm.trim() && pathname !== '/produtos') {
            // Se não estamos na página de produtos e há busca, navegar para lá
            router.push(
                `/produtos?search=${encodeURIComponent(
                    debouncedSearchTerm.trim()
                )}`
            )
        } else if (debouncedSearchTerm.trim() && pathname === '/produtos') {
            // Se estamos na página de produtos, atualizar apenas os parâmetros de busca
            const url = new URL(window.location.href)
            url.searchParams.set('search', debouncedSearchTerm.trim())
            url.searchParams.delete('page') // Reset página
            window.history.replaceState({}, '', url.toString()) // Use replaceState para não adicionar ao histórico
        } else if (!debouncedSearchTerm.trim() && pathname === '/produtos') {
            // Se busca foi limpa na página de produtos, remover parâmetro
            const url = new URL(window.location.href)
            url.searchParams.delete('search')
            url.searchParams.delete('page')
            window.history.replaceState({}, '', url.toString()) // Use replaceState para não adicionar ao histórico
        }
    }, [debouncedSearchTerm, pathname, router, initialized])

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            router.push(
                `/produtos?search=${encodeURIComponent(searchTerm.trim())}`
            )
        }
    }
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="bg-background/95 fixed z-50 w-full border-b backdrop-blur-3xl"
            >
                <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                            >
                                <Image
                                    src="/images/logo-nihon.png"
                                    alt="logo nihon"
                                    width={40}
                                    height={40}
                                />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={
                                    menuState == true
                                        ? 'Close Menu'
                                        : 'Open Menu'
                                }
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                            >
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="hidden lg:block">
                                <ul className="flex gap-8 text-sm">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-red-600 cursor-pointer block duration-200 hover:scale-105 transition-all"
                                            >
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-red-600 cursor-pointer block duration-200 hover:scale-105 transition-all"
                                            >
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:items-center sm:gap-3 sm:space-y-0 md:w-fit">
                                <form
                                    onSubmit={handleSearchSubmit}
                                    className="relative w-full"
                                >
                                    <Input
                                        placeholder="Buscar produtos..."
                                        className="pl-2 pr-16"
                                        value={searchTerm}
                                        onChange={e =>
                                            handleSearchChange(e.target.value)
                                        }
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        {searchTerm && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSearchChange('')
                                                }
                                                className="p-1 hover:bg-muted rounded-sm transition-colors"
                                                aria-label="Limpar busca"
                                            >
                                                <X className="h-3 w-3 text-muted-foreground" />
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className="p-1 hover:bg-muted rounded-sm transition-colors"
                                            aria-label="Buscar"
                                        >
                                            <Search className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    </div>
                                </form>
                                <div className="flex items-center justify-center">
                                    <div className="relative">
                                        <Link
                                            href="/carrinho"
                                            aria-label="Abrir carinho"
                                        >
                                            <ShoppingCart className="h-6 w-6 cursor-pointer hover:text-accent-foreground transition-colors" />
                                        </Link>
                                        {cart.itemCount > 0 && (
                                            <span className="absolute -top-2 -right-2 min-w-[1rem] h-4 px-1 rounded-full bg-red-600 text-white text-[10px] leading-4 text-center">
                                                {cart.itemCount > 10
                                                    ? '10+'
                                                    : cart.itemCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
