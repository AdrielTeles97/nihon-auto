import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Phone, MessageCircle, Mail } from 'lucide-react'
import { DividerLines } from '@/components/ui/divider-lines'
import { NoiseBackground, DecorativeShape } from '@/components/ui/noise-shapes'
import { EmphasisText } from '@/components/ui/emphasis-text'

export function CallToActionSection() {
    const handleGeneralQuote = () => {
        // Número fixo da Nihon Auto
        const nihonNumber = '559182337100'
        const message = `Olá! Gostaria de solicitar um orçamento geral para produtos automotivos.

Por favor, me envie informações sobre:
- Preços dos produtos disponíveis
- Condições de pagamento
- Prazos de entrega

Obrigado!`
        
        const whatsappUrl = `https://wa.me/${nihonNumber}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-red-900/20">
            {/* Background com noise */}
            <NoiseBackground intensity="strong" color="white" />

            {/* Shapes decorativas */}
            <DecorativeShape
                variant="circle"
                color="red"
                size="lg"
                className="top-0 left-0 opacity-30"
            />
            <DecorativeShape
                variant="rectangle"
                color="red"
                size="md"
                className="bottom-10 right-10 opacity-20"
            />

            {/* Linhas divisórias */}
            <DividerLines variant="red" />

            <div className="relative container mx-auto px-4 text-center text-white">
                {/* Título principal */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                        Pronto para encontrar a{' '}
                        <EmphasisText>peça perfeita</EmphasisText>?
                    </h2>
                    <p className="text-xl text-neutral-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Nossa equipe especializada está pronta para ajudar você
                        a encontrar exatamente o que precisa para seu veículo
                        japonês.
                    </p>
                </div>

                {/* Botões de ação */}
                <div
                    className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700"
                    style={{ animationDelay: '0.2s' }}
                >
                    <Link href="/produtos">
                        <Button
                            size="lg"
                            className="bg-red-600 hover:bg-red-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-4 text-lg"
                        >
                            <span className="text-white">
                                Explorar Produtos
                            </span>
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>

                    <Button
                        size="lg"
                        variant="outline"
                        className="group border-white/50 text-white hover:bg-white hover:border-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-4 text-lg backdrop-blur-sm bg-transparent"
                        onClick={handleGeneralQuote}
                    >
                        <span className="text-white group-hover:text-neutral-900 transition-colors">
                            Fazer Orçamento
                        </span>
                        <MessageCircle className="ml-2 w-5 h-5 text-white group-hover:text-neutral-900 transition-colors" />
                    </Button>
                </div>

                {/* Informações de contato */}
                <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700"
                    style={{ animationDelay: '0.4s' }}
                >
                    <div className="flex items-center justify-center gap-3 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <Phone className="w-6 h-6 text-red-400" />
                        <div className="text-left">
                            <div className="text-sm text-gray-300">
                                Ligue agora
                            </div>
                            <div className="font-semibold text-white">
                                (91) 9 8233-7100
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-3 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <MessageCircle className="w-6 h-6 text-red-400" />
                        <div className="text-left">
                            <div className="text-sm text-gray-300">
                                WhatsApp
                            </div>
                            <div className="font-semibold text-white">
                                Atendimento rápido
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-3 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <Mail className="w-6 h-6 text-red-400" />
                        <div className="text-left">
                            <div className="text-sm text-gray-300">E-mail</div>
                            <div className="font-semibold text-white">
                                Suporte 24/7
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent pointer-events-none" />
        </section>
    )
}
