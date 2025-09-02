'use client'

import React from 'react'
import { Header } from '@/components/layout/Header'
import { Shield, Award, Users, Clock } from 'lucide-react'

export default function SobrePage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                            Sobre a{' '}
                            <span className="text-red-400">Nihon Auto</span>
                        </h1>
                        <p className="text-xl lg:text-2xl text-blue-100">
                            Excelência em acessórios automotivos japoneses.
                            Qualidade e tradição para seu veículo.
                        </p>
                    </div>
                </div>
            </section>

            {/* Nossa História */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Nossa História
                        </h2>
                        <div className="prose prose-lg max-w-none text-gray-600">
                            <p className="mb-6">
                                A Nihon Auto é especializada em acessórios
                                automotivos japoneses de alta qualidade. Nossa
                                empresa nasceu da paixão pela excelência e
                                precisão que caracteriza a indústria
                                automobilística japonesa.
                            </p>
                            <p className="mb-6">
                                Oferecemos uma ampla gama de produtos originais
                                e premium para veículos japoneses, incluindo
                                peças de reposição, acessórios de performance e
                                produtos de cuidado automotivo das melhores
                                marcas do mercado.
                            </p>
                            <p>
                                Localizados em Belém/PA, atendemos todo o Brasil
                                com qualidade, agilidade e atendimento
                                personalizado. Nossa missão é fornecer produtos
                                que agregam valor e performance ao seu veículo
                                japonês.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Nossos Valores */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                        Nossos Valores
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Qualidade
                            </h3>
                            <p className="text-gray-600">
                                Produtos originais e certificados das melhores
                                marcas do mercado mundial.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Excelência
                            </h3>
                            <p className="text-gray-600">
                                Compromisso com a excelência em todos os
                                aspectos do nosso negócio.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Relacionamento
                            </h3>
                            <p className="text-gray-600">
                                Construímos relacionamentos duradouros baseados
                                na confiança mútua.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Tradição
                            </h3>
                            <p className="text-gray-600">
                                Especialização em produtos japoneses com
                                qualidade e precisão incomparáveis.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Números */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                        Nihon Auto em Números
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-red-600 mb-2">
                                5+
                            </div>
                            <div className="text-gray-600">
                                Anos de Experiência
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-red-600 mb-2">
                                30+
                            </div>
                            <div className="text-gray-600">
                                Marcas Japonesas
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-red-600 mb-2">
                                500+
                            </div>
                            <div className="text-gray-600">
                                Produtos Disponíveis
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-red-600 mb-2">
                                1.000+
                            </div>
                            <div className="text-gray-600">
                                Clientes Satisfeitos
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        N
                                    </span>
                                </div>
                                <span className="text-xl font-bold">
                                    Nihon Auto
                                </span>
                            </div>
                            <p className="text-gray-400">
                                Excelência em acessórios automotivos japoneses.
                                Qualidade e tradição para seu veículo.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Produtos</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a
                                        href="/produtos"
                                        className="hover:text-white"
                                    >
                                        Todos os Produtos
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/categorias"
                                        className="hover:text-white"
                                    >
                                        Categorias
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/marcas"
                                        className="hover:text-white"
                                    >
                                        Marcas
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Empresa</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a
                                        href="/sobre"
                                        className="hover:text-white"
                                    >
                                        Sobre Nós
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/contato"
                                        className="hover:text-white"
                                    >
                                        Contato
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/termos"
                                        className="hover:text-white"
                                    >
                                        Termos de Uso
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Contato</h4>
                            <div className="space-y-2 text-gray-400">
                                <p>📧 vendas01@nihonauto.com.br</p>
                                <p>📱 (91) 5591-8237100</p>
                                <p>
                                    📍 Travessa José Pio, 541 - Umarizal -
                                    Belém/PA
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>
                            &copy; 2024 Nihon Acessórios Automotivos. Todos os
                            direitos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
