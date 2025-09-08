import React from 'react'
import Image from 'next/image'
import { Truck, Shield, Award } from 'lucide-react'
import { DividerLines } from '@/components/ui/divider-lines'
import { NoiseBackground } from '@/components/ui/noise-shapes'
import { SectionTitle, EmphasisText } from '@/components/ui/emphasis-text'

const differentials = [
    {
        icon: Truck,
        title: 'Entrega Rápida',
        description:
            'Entrega expressa para todo o Brasil com rastreamento em tempo real'
    },
    {
        icon: Shield,
        title: 'Qualidade Garantida',
        description: 'Produtos originais com garantia de fábrica e certificação'
    },
    {
        icon: Award,
        title: 'Melhor Preço',
        description:
            'Preços competitivos e condições especiais para grandes volumes'
    }
]

export function WhyChooseSection() {
    return (
        <section className="relative py-32 overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-red-900/20">
            {/* Background complexo com múltiplas camadas */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-neutral-900/60 to-red-950/40" />
            <NoiseBackground intensity="strong" color="white" />

            {/* Linhas divisórias com variações */}
            <DividerLines variant="red" />

            {/* Linhas adicionais mais sutis */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-200/20 to-transparent" />
                <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-200/20 to-transparent" />
                <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-red-100/10 to-transparent opacity-30" />
                <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-red-100/10 to-transparent opacity-30" />
            </div>

            <div className="relative container mx-auto px-4">
                {/* Título da seção com mais estilo */}
                <div className="text-center mb-20">
                    <div className="relative bg-gradient-to-br from-white/10 via-neutral-900/20 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 lg:p-12 shadow-2xl shadow-black/50">
                        <NoiseBackground
                            intensity="light"
                            color="neutral"
                            className="rounded-3xl"
                        />

                        {/* Glow effect mais sutil */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-3xl blur-2xl" />

                        {/* Elementos decorativos nos cantos mais sutis */}
                        <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-red-400/60 rounded-tl-lg" />
                        <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-red-400/60 rounded-br-lg" />
                        <div className="absolute top-4 right-4 w-4 h-4 border-r-1 border-t-1 border-white/30 rounded-tr-md" />
                        <div className="absolute bottom-4 left-4 w-4 h-4 border-l-1 border-b-1 border-white/30 rounded-bl-md" />

                        <div className="relative z-10">
                            <SectionTitle
                                title="Por que escolher a"
                                emphasis="Nihon Auto?"
                                subtitle="Nossa experiência e dedicação garantem as melhores soluções em peças automotivas japonesas para seu veículo"
                            />
                        </div>
                    </div>
                </div>

                {/* Banner Principal da Nihon */}
                <div className="mb-20">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src="/images/banner-padrao-nihon.png"
                            alt="Banner Promocional Nihon Auto - Peças e Acessórios Automotivos"
                            width={1200}
                            height={400}
                            className="w-full h-auto object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Grid de diferenciais com layout melhorado */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
                    {differentials.map((item, index) => {
                        const Icon = item.icon
                        const isHighlighted = index === 0 // Destaque apenas para o primeiro

                        return (
                            <div
                                key={index}
                                className={`group relative ${
                                    isHighlighted ? 'lg:scale-105' : ''
                                }`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div
                                    className={`relative backdrop-blur-sm border rounded-2xl p-8 text-center transition-all duration-500 hover:scale-105 h-full ${
                                        isHighlighted
                                            ? 'bg-gradient-to-br from-red-900/40 to-red-800/20 border-red-400/30 shadow-xl hover:shadow-2xl hover:shadow-red-500/20'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-xl hover:shadow-red-500/10'
                                    } hover:border-red-400/40`}
                                >
                                    {/* Noise background personalizado */}
                                    <NoiseBackground
                                        intensity={
                                            isHighlighted ? 'medium' : 'light'
                                        }
                                        color={
                                            isHighlighted ? 'red' : 'neutral'
                                        }
                                        className="rounded-2xl"
                                    />

                                    {/* Indicador de destaque */}
                                    {isHighlighted && (
                                        <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                    )}

                                    <div className="relative z-10">
                                        <div
                                            className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                                                isHighlighted
                                                    ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25'
                                                    : 'bg-gradient-to-br from-red-600/80 to-red-500/60'
                                            }`}
                                        >
                                            <Icon className="w-10 h-10 text-white" />
                                        </div>

                                        <h3 className="font-bold text-xl mb-4 text-white">
                                            <EmphasisText
                                                variant={
                                                    isHighlighted
                                                        ? 'accent'
                                                        : 'secondary'
                                                }
                                            >
                                                {item.title}
                                            </EmphasisText>
                                        </h3>

                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Elementos decorativos nos cantos */}
                                    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-red-300/30 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-red-300/30 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Estatísticas impressionantes com design melhorado */}
                <div className="relative mb-20">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-red-500/10 to-red-400/20 rounded-3xl blur-xl" />
                    <div className="relative bg-gradient-to-r from-red-600/10 via-red-500/5 to-red-400/10 backdrop-blur-sm rounded-3xl p-12 md:p-16 border border-red-200/30 shadow-2xl">
                        <NoiseBackground
                            intensity="strong"
                            color="red"
                            className="rounded-3xl"
                        />

                        <div className="relative">
                            <div className="text-center mb-12">
                                <h3 className="text-3xl font-bold mb-4">
                                    Números que{' '}
                                    <EmphasisText>comprovam</EmphasisText> nossa
                                    excelência
                                </h3>
                                <p className="text-gray-300 max-w-2xl mx-auto">
                                    Resultados conquistados através de anos de
                                    dedicação e compromisso com a qualidade
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-red-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative bg-background/60 backdrop-blur-sm border border-red-200/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                                        <div className="text-4xl md:text-5xl font-bold text-red-600 mb-3">
                                            +10
                                        </div>
                                        <div className="text-sm font-medium text-gray-300">
                                            Anos de experiência
                                        </div>
                                        <div className="mt-2 text-xs text-red-500/70">
                                            Desde 2014
                                        </div>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-0 bg-red-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative bg-background/60 backdrop-blur-sm border border-red-200/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                                        <div className="text-4xl md:text-5xl font-bold text-red-600 mb-3">
                                            5K+
                                        </div>
                                        <div className="text-sm font-medium text-gray-300">
                                            Produtos disponíveis
                                        </div>
                                        <div className="mt-2 text-xs text-red-500/70">
                                            Sempre em estoque
                                        </div>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-0 bg-red-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative bg-background/60 backdrop-blur-sm border border-red-200/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                                        <div className="text-4xl md:text-5xl font-bold text-red-600 mb-3">
                                            98%
                                        </div>
                                        <div className="text-sm font-medium text-gray-300">
                                            Satisfação dos clientes
                                        </div>
                                        <div className="mt-2 text-xs text-red-500/70">
                                            Avaliação média
                                        </div>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-0 bg-red-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative bg-background/60 backdrop-blur-sm border border-red-200/30 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                                        <div className="text-4xl md:text-5xl font-bold text-red-600 mb-3">
                                            24h
                                        </div>
                                        <div className="text-sm font-medium text-gray-300">
                                            Suporte disponível
                                        </div>
                                        <div className="mt-2 text-xs text-red-500/70">
                                            Todos os dias
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
