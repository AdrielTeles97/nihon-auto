'use client'

import { Button } from '@/components/ui/button'
import {
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Clock
} from 'lucide-react'
import { useCompanySettings } from '@/hooks/use-company-settings'
import { formatPhone } from '@/lib/format'
import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
    const { settings, loading } = useCompanySettings()
    const year = new Date().getFullYear()

    // Dados padrão enquanto carrega ou em caso de erro
    const companyData = settings || {
        whatsapp: '5591982337100',
        email: 'adrielt008@gmail.com',
        working_hours: 'Seg-Sex: 8h às 18h',
        address: 'Travessa José Pio, 541 - Umarizal - Belém/PA',
        company_name: 'Nihon Peças e Acessórios',
        company_description:
            'Especialistas em peças e acessórios automotivos com mais de 5 anos de experiência no mercado brasileiro.',
        social_media: {
            facebook: '',
            instagram: '',
            linkedin: ''
        }
    }

    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="relative w-32 h-10">
                                <Image
                                    src="/images/logo-nihon.png"
                                    alt="Nihon Auto"
                                    width={128}
                                    height={20}
                                    className="object-contain"
                                    sizes="128px"
                                />
                            </div>
                            <div>
                                <span className="font-playfair text-xl font-bold block">
                                    {loading
                                        ? 'Carregando...'
                                        : companyData.company_name}
                                </span>
                                <span className="text-sm text-primary-foreground/80">
                                    Sua especialista na região norte    
                                </span>
                                
                            </div>
                            
                        </div>
                        
                        
                        <div className="flex space-x-3">
                            {companyData.social_media.facebook && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-primary-foreground hover:bg-primary-foreground/10"
                                    asChild
                                >
                                    <a
                                        href={companyData.social_media.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Facebook className="h-4 w-4" />
                                    </a>
                                </Button>
                            )}
                            {companyData.social_media.instagram && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-primary-foreground hover:bg-primary-foreground/10"
                                    asChild
                                >
                                    <a
                                        href={companyData.social_media.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Instagram className="h-4 w-4" />
                                    </a>
                                </Button>
                            )}
                            {companyData.social_media.linkedin && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-primary-foreground hover:bg-primary-foreground/10"
                                    asChild
                                >
                                    <a
                                        href={companyData.social_media.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Linkedin className="h-4 w-4" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Navegação</h3>
                        <ul className="space-y-2 text-sm text-primary-foreground/80">
                            <li>
                                <Link
                                    href="/produtos"
                                    className="hover:text-primary-foreground transition-colors"
                                >
                                    Todos os Produtos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/a-nihon"
                                    className="hover:text-primary-foreground transition-colors"
                                >
                                    Sobre a Nihon
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/carrinho"
                                    className="hover:text-primary-foreground transition-colors"
                                >
                                    Carrinho de Compras
                                </Link>
                            </li>
                            <li>
                                <a
                                    href={`https://wa.me/${companyData.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary-foreground transition-colors"
                                >
                                    Solicitar Orçamento
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`mailto:${companyData.email}`}
                                    className="hover:text-primary-foreground transition-colors"
                                >
                                    Entre em Contato
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Contato</h3>
                        <div className="space-y-3 text-sm text-primary-foreground/80">
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 flex-shrink-0" />
                                <a
                                    href={`https://wa.me/${companyData.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary-foreground transition-colors"
                                >
                                    {loading
                                        ? 'Carregando...'
                                        : formatPhone(companyData.whatsapp)}
                                </a>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                <a
                                    href={`mailto:${companyData.email}`}
                                    className="hover:text-primary-foreground transition-colors break-all"
                                >
                                    {loading
                                        ? 'Carregando...'
                                        : companyData.email}
                                </a>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 flex-shrink-0" />
                                <span>
                                    {loading
                                        ? 'Carregando...'
                                        : companyData.working_hours}
                                </span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span className="text-pretty">
                                    {loading
                                        ? 'Carregando endereço...'
                                        : companyData.address}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/60 space-y-1">
                    <p>
                        &copy; {year}{' '}
                        {loading
                            ? 'Nihon Peças e Acessórios'
                            : companyData.company_name}
                        . Todos os direitos reservados.
                    </p>
                    <p>
                        Desenvolvido por:{' '}
                        <a
                            href="https://github.com/AdrielTeles97"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-4 hover:text-primary-foreground transition-colors"
                        >
                            Adriel Teles
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}