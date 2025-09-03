'use client';

import { Fragment, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import { Menu, X, ShoppingCart, ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import { cn } from '@/lib/utils'

const products = [
  {
    name: 'Catálogo',
    description: 'Veja todos os produtos',
    href: '/produtos',
  },
  {
    name: 'Categorias',
    description: 'Explore por categorias',
    href: '/categorias',
  },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { getCartItemCount } = useCart()
  const cartItemCount = getCartItemCount()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex h-16 items-center justify-between border-b border-gray-200">
          <div className="flex flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center">
              <Image
                src="/images/logo-nihon.png"
                alt="Nihon Auto Center"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="ml-2 text-lg font-bold">Nihon Auto Center</span>
            </Link>
          </div>
          <div className="flex md:hidden items-center space-x-4">
            <Link href="/carrinho" className="relative inline-flex items-center">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Link>
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Abrir menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <Popover.Group className="hidden md:flex md:gap-x-8">
            <Link href="/" className="text-sm font-semibold leading-6 text-gray-900">
              Início
            </Link>
            <Popover className="relative">
              <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                Produtos
                <ChevronDown className="h-4 w-4" />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-sm overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                  <div className="p-4">
                    {products.map((item) => (
                      <div
                        key={item.name}
                        className="group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                      >
                        <div className="flex-auto">
                          <Link href={item.href} className="block font-semibold text-gray-900">
                            {item.name}
                            <span className="absolute inset-0" />
                          </Link>
                          <p className="mt-1 text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
            <Link href="/sobre" className="text-sm font-semibold leading-6 text-gray-900">
              Sobre
            </Link>
            <Link href="/contato" className="text-sm font-semibold leading-6 text-gray-900">
              Contato
            </Link>
          </Popover.Group>
          <div className="hidden md:flex md:flex-1 md:justify-end">
            <Link href="/carrinho" className="relative inline-flex items-center">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Link>
          </div>
        </div>
      </nav>
      <Dialog as="div" className="md:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10 bg-black/20" aria-hidden="true" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center">
              <Image
                src="/images/logo-nihon.png"
                alt="Nihon Auto Center"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="ml-2 text-base font-bold">Nihon Auto Center</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Fechar menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        Produtos
                        <ChevronDown className={cn('h-5 w-5 flex-none', open ? 'rotate-180' : '')} />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {products.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Link
                  href="/"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Início
                </Link>
                <Link
                  href="/sobre"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sobre
                </Link>
                <Link
                  href="/contato"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contato
                </Link>
              </div>
              <div className="py-6">
                <Link
                  href="/carrinho"
                  className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Carrinho ({cartItemCount})
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}

