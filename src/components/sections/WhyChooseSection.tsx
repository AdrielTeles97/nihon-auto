import React from 'react'
import { Clock, Truck, Shield, Award, Users, Star } from 'lucide-react'
import { DividerLines } from '@/components/ui/divider-lines'
import { NoiseBackground, DecorativeShape } from '@/components/ui/noise-shapes'
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
        icon: Clock,
        title: 'Atendimento 24/7',
        description:
            'Suporte especializado sempre disponível para auxiliar você'
    },
    {
        icon: Award,
        title: 'Melhor Preço',
        description:
            'Preços competitivos e condições especiais para grandes volumes'
    },
    {
        icon: Users,
        title: 'Equipe Especializada',
        description: 'Profissionais experientes em peças automotivas japonesas'
    },
    {
        icon: Star,
        title: 'Excelência',
        description: 'Mais de 10 anos de experiência no mercado automotivo'
    }
]

export function WhyChooseSection() {
    return (
        <section className="relative py-24 overflow-hidden bg-neutral-50">
            {/* Background com noise */}
            <NoiseBackground intensity="medium" color="neutral" />

            {/* Shapes decorativas */}
            <DecorativeShape
                variant="circle"
                color="red"
                size="lg"
                className="top-20 -right-32"
            />
            <DecorativeShape
                variant="rectangle"
                color="neutral"
                size="md"
                className="bottom-10 -left-20"
            />

            {/* Linhas divisórias */}
            <DividerLines variant="red" />

            <div className="relative container mx-auto px-4">
                {/* Título da seção */}
                <div className="text-center mb-16">
                    <div className="relative bg-background/40 backdrop-blur-sm border border-border/30 rounded-2xl p-6 lg:p-8">
                        <SectionTitle
                            title="Por que escolher a"
                            emphasis="Nihon Auto?"
                            subtitle="Nossos diferenciais que garantem a melhor experiência para você e seu veículo"
                        />
                    </div>
                </div>

                {/* Grid de diferenciais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {differentials.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={index}
                                className="group animate-in fade-in slide-in-from-bottom-4"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="relative bg-background/60 backdrop-blur-sm border border-border/40 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300 hover:border-red-500/30 h-full">
                                    {/* Noise background sutil */}
                                    <NoiseBackground
                                        intensity="light"
                                        className="rounded-xl"
                                    />

                                    <div className="relative z-10">
                                        <div className="bg-gradient-to-br from-red-50 to-red-100/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <Icon className="w-8 h-8 text-red-600" />
                                        </div>

                                        <h3 className="font-semibold text-lg mb-3">
                                            <EmphasisText variant="secondary">
                                                {item.title}
                                            </EmphasisText>
                                        </h3>

                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Estatísticas impressionantes */}
                <div className="relative bg-gradient-to-r from-red-600/10 via-red-500/5 to-red-400/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-red-200/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-white/30 rounded-2xl" />
                    <NoiseBackground
                        intensity="light"
                        color="red"
                        className="rounded-2xl"
                    />

                    <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                                +10
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Anos de experiência
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                                5K+
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Produtos disponíveis
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                                98%
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Satisfação dos clientes
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                                24h
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Suporte disponível
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shape SVG no final */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="relative block w-full h-16"
                >
                    <path
                        d="M1200,0H0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05C827.58,32.17,886.67,4.24,951.2,4.24Z"
                        className="fill-background"
                    />
                </svg>
            </div>
        </section>
    )
}
