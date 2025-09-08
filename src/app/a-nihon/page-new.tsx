'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import {
    ChevronRight,
    Users,
    Star,
    Shield,
    Truck,
    Heart,
    Target,
    Zap,
    MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Cover } from '@/components/ui/cover'
import { HeroHeader } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function ANihonPage() {
    return (
        <div className="min-h-screen bg-white">
            <HeroHeader />
            <main className="relative overflow-hidden">
                {/* Hero Section */}
                <section className="relative py-32 bg-white overflow-hidden">
                    {/* Linhas divisórias de fundo */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
                        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-200 to-transparent opacity-30" />
                        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-200 to-transparent opacity-30" />
                    </div>

                    <div className="relative container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-block mb-6">
                                <Badge
                                    variant="outline"
                                    className="border-black text-black bg-white px-4 py-2"
                                >
                                    <Heart className="h-4 w-4 mr-2" />
                                    Sobre a Nihon Auto
                                </Badge>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
                                <Cover className="bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent">
                                    A Nihon Acessórios Automotivos
                                </Cover>
                            </h1>

                            <p className="text-xl text-neutral-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                                Paixão por carros e pela experiência única de
                                dirigir. Transformamos seu veículo em uma
                                extensão perfeita do seu estilo.
                            </p>

                            {/* Linha decorativa */}
                            <div className="w-24 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto" />
                        </div>
                    </div>
                </section>

                {/* História Section */}
                <section className="relative py-32 bg-neutral-50 overflow-hidden">
                    {/* Noise Pattern */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `url('/noise.svg')`,
                            backgroundSize: '200px 200px',
                            backgroundRepeat: 'repeat'
                        }}
                    />

                    {/* Shapes */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-500/5 to-red-600/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-red-400/5 to-red-500/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />

                    {/* Linhas divisórias */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                    </div>

                    <div className="relative container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="order-2 lg:order-1"
                            >
                                <div className="relative">
                                    <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-red-500 rounded-tl-lg" />
                                    <div className="bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-2xl p-8 shadow-lg">
                                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-900">
                                            Nossa História
                                        </h2>
                                        <div className="space-y-6 text-neutral-700 leading-relaxed">
                                            <p>
                                                Na Nihon, somos apaixonados por
                                                carros e pela experiência de
                                                dirigir. Com uma vasta gama de
                                                acessórios de alta qualidade,
                                                estamos aqui para transformar
                                                seu veículo em uma extensão
                                                perfeita de seu estilo e
                                                necessidades.
                                            </p>
                                            <p>
                                                Desde itens de conforto e
                                                conveniência até soluções de
                                                desempenho e estética, nossa
                                                missão é proporcionar o melhor
                                                para você e seu carro.
                                            </p>
                                            <p>
                                                Com mais de 15 anos de
                                                experiência no mercado
                                                automotivo, construímos nossa
                                                reputação baseada na qualidade,
                                                confiabilidade e excelência no
                                                atendimento ao cliente.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-red-500 rounded-br-lg" />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="order-1 lg:order-2"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-100/50 to-transparent rounded-2xl" />
                                    <Image
                                        src="/images/logo-nihon.png"
                                        alt="Nihon Auto"
                                        width={500}
                                        height={400}
                                        className="relative z-10 w-full h-auto rounded-2xl shadow-2xl border border-white"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Valores Section */}
                <section className="relative py-32 bg-white overflow-hidden">
                    {/* Linhas divisórias */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
                        <div className="absolute top-0 left-16 w-px h-full bg-gradient-to-b from-transparent via-neutral-200 to-transparent opacity-50" />
                        <div className="absolute top-0 right-16 w-px h-full bg-gradient-to-b from-transparent via-neutral-200 to-transparent opacity-50" />
                    </div>

                    <div className="relative container mx-auto px-4">
                        <div className="text-center mb-16 max-w-4xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                <Cover className="bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent">
                                    Nossos Valores
                                </Cover>
                            </h2>
                            <p className="text-xl text-neutral-600 leading-relaxed">
                                Princípios que guiam nossa jornada e definem
                                nossa excelência
                            </p>
                            <div className="w-20 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-8" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {[
                                {
                                    icon: <Shield className="h-8 w-8" />,
                                    title: 'Qualidade',
                                    description:
                                        'Produtos selecionados com rigorosos padrões de qualidade e durabilidade.'
                                },
                                {
                                    icon: <Users className="h-8 w-8" />,
                                    title: 'Atendimento',
                                    description:
                                        'Equipe especializada pronta para oferecer o melhor suporte e orientação.'
                                },
                                {
                                    icon: <Target className="h-8 w-8" />,
                                    title: 'Precisão',
                                    description:
                                        'Soluções específicas para cada necessidade e modelo de veículo.'
                                },
                                {
                                    icon: <Truck className="h-8 w-8" />,
                                    title: 'Agilidade',
                                    description:
                                        'Entrega rápida e eficiente em todo o território nacional.'
                                },
                                {
                                    icon: <Star className="h-8 w-8" />,
                                    title: 'Excelência',
                                    description:
                                        'Compromisso com a satisfação total dos nossos clientes.'
                                },
                                {
                                    icon: <Zap className="h-8 w-8" />,
                                    title: 'Inovação',
                                    description:
                                        'Sempre em busca das mais modernas tecnologias automotivas.'
                                }
                            ].map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1
                                    }}
                                    className="group"
                                >
                                    <div className="relative bg-white border border-neutral-200 rounded-2xl p-8 h-full transition-all duration-300 hover:border-red-200 hover:shadow-lg hover:shadow-red-100/20">
                                        <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-full border border-red-200/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                                        </div>

                                        <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-white rounded-2xl flex items-center justify-center mb-6 group-hover:from-red-50 group-hover:to-red-100/50 transition-all duration-300 border border-neutral-200 group-hover:border-red-200">
                                            <div className="text-neutral-700 group-hover:text-red-600 transition-colors duration-300">
                                                {value.icon}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-semibold mb-4 text-neutral-900 group-hover:text-red-600 transition-colors duration-300">
                                            {value.title}
                                        </h3>

                                        <p className="text-neutral-600 leading-relaxed">
                                            {value.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative py-32 bg-neutral-900 overflow-hidden">
                    {/* Noise Pattern */}
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: `url('/noise.svg')`,
                            backgroundSize: '200px 200px',
                            backgroundRepeat: 'repeat'
                        }}
                    />

                    {/* Shapes */}
                    <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-full blur-3xl transform -translate-x-1/2" />
                    <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-gradient-to-tl from-red-400/10 to-red-500/5 rounded-full blur-3xl transform translate-x-1/2" />

                    {/* Linhas divisórias */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent" />
                        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-neutral-700 to-transparent opacity-50" />
                        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-neutral-700 to-transparent opacity-50" />
                    </div>

                    <div className="relative container mx-auto px-4 text-center">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                                <Cover className="bg-gradient-to-b from-white via-neutral-200 to-neutral-300 bg-clip-text text-transparent">
                                    Venha conhecer nossa loja
                                </Cover>
                            </h2>

                            <p className="text-xl text-neutral-300 mb-12 leading-relaxed">
                                Visite nosso showroom e descubra pessoalmente a
                                qualidade dos nossos produtos
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Button
                                    size="lg"
                                    className="bg-red-600 hover:bg-red-500 text-white px-8"
                                    asChild
                                >
                                    <Link href="/atendimento">
                                        <MapPin className="h-5 w-5 mr-2" />
                                        Como Chegar
                                    </Link>
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white/30 text-white hover:bg-white/10 px-8"
                                    asChild
                                >
                                    <Link href="/produtos">
                                        Ver Produtos
                                        <ChevronRight className="h-5 w-5 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
