'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onSearchChange?: (search: string) => void;
}

export function Header({ onSearchChange }: HeaderProps) {
  const { getCartItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInHeroSection, setIsInHeroSection] = useState(false);
  const { scrollToSection } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      
      // Only show hero styling on homepage and when at the top
      const isHomePage = window.location.pathname === '/';
      setIsInHeroSection(isHomePage && scrollY < window.innerHeight * 0.8);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange?.(searchTerm);
  };

  const cartItemCount = getCartItemCount();

  return (
    <motion.header 
      className={cn(
        "fixed top-0 z-50 w-full border-b transition-all duration-500 group",
        isInHeroSection && !isScrolled
          ? "bg-transparent backdrop-blur-none border-transparent hover:bg-white/90 hover:backdrop-blur-md hover:shadow-lg hover:border-gray-200" 
          : "bg-white/95 backdrop-blur-md shadow-lg border-gray-200"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.25, 0, 1] }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/logo-nihon.png"
              alt="Nihon Auto Center"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className={cn(
              "text-xl font-bold transition-colors duration-500",
              isInHeroSection && !isScrolled
                ? "text-white group-hover:text-gray-900"
                : "text-gray-900"
            )}>Nihon Auto Center</span>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={cn(
                "transition-colors duration-500",
                isInHeroSection && !isScrolled
                  ? "text-white/90 hover:text-white group-hover:text-gray-600 group-hover:hover:text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Início
            </Link>
            <Link
              href="/produtos"
              className={cn(
                "transition-colors duration-500",
                isInHeroSection && !isScrolled
                  ? "text-white/90 hover:text-white group-hover:text-gray-600 group-hover:hover:text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Produtos
            </Link>
            <Link
              href="/categorias"
              className={cn(
                "transition-colors duration-500",
                isInHeroSection && !isScrolled
                  ? "text-white/90 hover:text-white group-hover:text-gray-600 group-hover:hover:text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Categorias
            </Link>
            <Link
              href="/sobre"
              className={cn(
                "transition-colors duration-500",
                isInHeroSection && !isScrolled
                  ? "text-white/90 hover:text-white group-hover:text-gray-600 group-hover:hover:text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Sobre
            </Link>
            <Link
              href="/contato"
              className={cn(
                "transition-colors duration-500",
                isInHeroSection && !isScrolled
                  ? "text-white/90 hover:text-white group-hover:text-gray-600 group-hover:hover:text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Contato
            </Link>
          </nav>

          {/* Busca */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pr-10"
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Carrinho */}
            <Link href="/carrinho">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <Link href="/carrinho">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Menu Mobile Expandido */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden border-t bg-white/95 backdrop-blur-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: [0.25, 0.25, 0, 1] }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Busca Mobile */}
                <motion.form 
                  onSubmit={handleSearchSubmit} 
                  className="relative mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <Input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full px-3"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </motion.form>

                {/* Links de Navegação */}
                {[
                  { href: '/', label: 'Início' },
                  { href: '/produtos', label: 'Produtos' },
                  { href: '/categorias', label: 'Categorias' },
                  { href: '/sobre', label: 'Sobre' },
                  { href: '/contato', label: 'Contato' },
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 1) * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}