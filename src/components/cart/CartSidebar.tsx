'use client';

import React, { Fragment } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Carrinho de Compras
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <span className="sr-only">Fechar painel</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Badge variant="secondary">
                          {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'itens'}
                        </Badge>
                      </div>

                      {cart.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                            <svg
                              className="h-8 w-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                              />
                            </svg>
                          </div>
                          <h3 className="mb-2 text-lg font-semibold text-gray-900">
                            Carrinho vazio
                          </h3>
                          <p className="mb-4 text-gray-600">
                            Adicione produtos ao seu carrinho para continuar.
                          </p>
                          <Button onClick={onClose} variant="outline">
                            Continuar Comprando
                          </Button>
                        </div>
                      ) : (
                        <ul
                          role="list"
                          className="-my-6 mt-8 divide-y divide-gray-200"
                        >
                          {cart.items.map((item) => (
                            <li key={item.product.id} className="flex py-6">
                              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <Image
                                  src={item.product.image}
                                  alt={item.product.name}
                                  fill
                                  sizes="96px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="ml-4 flex flex-1 flex-col">
                                <div className="flex justify-between text-sm font-medium text-gray-900">
                                  <h4>{item.product.name}</h4>
                                  <p className="ml-4">
                                    {formatPrice(item.product.price)}
                                  </p>
                                </div>
                                {item.product.brand && (
                                  <p className="mt-1 text-xs text-gray-500">
                                    {item.product.brand}
                                  </p>
                                )}
                                <div className="mt-2 flex flex-1 items-end justify-between text-sm">
                                  <div className="flex items-center">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        updateQuantity(
                                          item.product.id,
                                          item.quantity - 1,
                                        )
                                      }
                                      disabled={item.quantity <= 1}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="mx-2 w-8 text-center text-sm font-medium">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        updateQuantity(
                                          item.product.id,
                                          item.quantity + 1,
                                        )
                                      }
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <div className="flex">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        removeFromCart(item.product.id)
                                      }
                                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {cart.items.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Total</p>
                          <p>{formatPrice(getCartTotal())}</p>
                        </div>
                        <div className="mt-6 space-y-2">
                          <Link href="/carrinho" onClick={onClose}>
                            <Button className="w-full" variant="outline">
                              Ver Carrinho Completo
                            </Button>
                          </Link>
                          <Link href="/orcamento" onClick={onClose}>
                            <Button className="w-full bg-red-600 hover:bg-red-700">
                              Solicitar Orçamento
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}