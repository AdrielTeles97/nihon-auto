'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Phone,
    MapPin,
    Mail,
    Clock,
    Send,
    MessageCircle,
    User,
    FileText,
    CheckCircle,
    HeadphonesIcon,
    Users
} from 'lucide-react'
import { HeroHeader } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { maskPhoneBR } from '@/lib/format'

interface ContactForm {
    name: string
    phone: string
    email: string
    subject: string
    message: string
}

export default function AtendimentoPage() {
    const [formData, setFormData] = useState<ContactForm>({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<
        'idle' | 'success' | 'error'
    >('idle')

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target
        let formattedValue = value

        // Aplicar formatação específica para o campo telefone
        if (name === 'phone') {
            formattedValue = maskPhoneBR(value)
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus('idle')

        try {
            // Enviar para o WordPress
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message
                })
            })

            if (response.ok) {
                const result = await response.json()
                if (result.success) {
                    setSubmitStatus('success')
                    // Limpar formulário
                    setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        subject: '',
                        message: ''
                    })
                } else {
                    throw new Error(result.message || 'Erro ao enviar mensagem')
                }
            } else {
                throw new Error('Erro na conexão')
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error)
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <HeroHeader />

            {/* Hero Banner Section */}
            <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-black via-red-950 to-black">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="w-full h-full bg-repeat"
                        style={{
                            backgroundImage: `url('/noise.svg')`,
                            backgroundSize: '200px 200px'
                        }}
                    />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-red-900/20 to-black/20" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center text-white">
                        <Badge className="mb-6 bg-red-600/20 text-red-100 border-red-500/30 text-base px-4 py-2">
                            <HeadphonesIcon className="h-4 w-4 mr-2" />
                            Atendimento Especializado
                        </Badge>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-red-100 to-red-200 bg-clip-text text-transparent">
                            Entre em Contato
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
                            Nossa equipe está pronta para atender suas
                            necessidades em peças automotivas japonesas. Entre
                            em contato conosco através dos canais abaixo ou
                            preencha nosso formulário.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 text-base w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <a href="tel:91982337100">
                                    <Phone className="h-5 w-5 mr-2" />
                                    Ligar Agora
                                </a>
                            </Button>

                            <Button
                                asChild
                                variant="secondary"
                                size="lg"
                                className="bg-white/90 text-black border-2 border-white hover:bg-white hover:scale-105 px-8 py-3 text-base w-full sm:w-auto font-semibold transition-all duration-300 shadow-lg"
                            >
                                <a href="mailto:vendas01@nihonauto.com.br">
                                    <Mail className="h-5 w-5 mr-2" />
                                    Enviar E-mail
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div
                        className="w-full h-full bg-repeat"
                        style={{
                            backgroundImage: `url('/noise.svg')`,
                            backgroundSize: '200px 200px'
                        }}
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
                                Informações de Contato
                            </h2>
                            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                                Escolha a forma mais conveniente para entrar em
                                contato conosco
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-12">
                            {/* Telefone */}
                            <div className="group bg-white border-2 border-gray-200 hover:border-red-500 rounded-2xl p-6 text-center hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:-translate-y-2">
                                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Phone className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-lg font-bold mb-3 text-black">
                                    Telefone
                                </h3>
                                <p className="text-gray-600 mb-3 text-sm">
                                    Fale diretamente com nossa equipe
                                </p>
                                <a
                                    href="tel:91982337100"
                                    className="text-red-600 font-bold text-base hover:text-red-700 transition-colors"
                                >
                                    (91) 98233-7100
                                </a>
                            </div>

                            {/* E-mail */}
                            <div className="group bg-white border-2 border-gray-200 hover:border-red-500 rounded-2xl p-6 text-center hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:-translate-y-2">
                                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Mail className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-lg font-bold mb-3 text-black">
                                    E-mail
                                </h3>
                                <p className="text-gray-600 mb-3 text-sm">
                                    Envie sua solicitação por e-mail
                                </p>
                                <a
                                    href="mailto:vendas01@nihonauto.com.br"
                                    className="text-black font-semibold hover:text-red-600 transition-colors text-sm break-words"
                                >
                                    vendas01@nihonauto.com.br
                                </a>
                            </div>

                            {/* Endereço */}
                            <div className="group bg-white border-2 border-gray-200 hover:border-red-500 rounded-2xl p-6 text-center hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:-translate-y-2">
                                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <MapPin className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-lg font-bold mb-3 text-black">
                                    Endereço
                                </h3>
                                <p className="text-gray-600 mb-3 text-sm">
                                    Visite nosso local
                                </p>
                                <address className="text-black font-semibold not-italic leading-relaxed text-sm">
                                    Travessa José Pio, 541
                                    <br />
                                    Umarizal - Belém/PA
                                </address>
                            </div>

                            {/* Horário de Funcionamento */}
                            <div className="group bg-gradient-to-br from-red-50 to-white border-2 border-red-200 hover:border-red-500 rounded-2xl p-6 text-center hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:-translate-y-2">
                                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Clock className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-lg font-bold mb-3 text-black">
                                    Horário de Funcionamento
                                </h3>
                                <div className="text-gray-800 space-y-1">
                                    <p className="font-semibold text-sm">
                                        Segunda à Sexta
                                    </p>
                                    <div className="space-y-1">
                                        <p className="text-red-600 font-bold text-sm">
                                            08:00 - 12:00
                                        </p>
                                        <p className="text-red-600 font-bold text-sm">
                                            14:00 - 18:00
                                        </p>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-3 space-y-1">
                                        <p>Sábados: 08:00 - 12:00</p>
                                        <p>Domingos: Fechado</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-20 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div
                        className="w-full h-full bg-repeat"
                        style={{
                            backgroundImage: `url('/noise.svg')`,
                            backgroundSize: '200px 200px'
                        }}
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        {/* Header do formulário */}
                        <div className="text-center mb-12">
                            <Badge className="mb-4 bg-red-50 text-red-600 border-red-200 text-base px-4 py-2">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Formulário de Contato
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
                                Envie sua Mensagem
                            </h2>
                            <p className="text-gray-700 text-lg">
                                Preencha o formulário abaixo e nossa equipe
                                entrará em contato o mais breve possível
                            </p>
                        </div>

                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 lg:p-12 shadow-2xl">
                            {/* Status Messages */}
                            {submitStatus === 'success' && (
                                <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl">
                                    <div className="flex items-center text-green-800">
                                        <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                                        <div>
                                            <h3 className="font-bold">
                                                Mensagem enviada com sucesso!
                                            </h3>
                                            <p className="text-sm mt-1">
                                                Entraremos em contato em breve
                                                através do telefone ou e-mail
                                                informado.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-xl">
                                    <div className="flex items-center text-red-800">
                                        <MessageCircle className="h-6 w-6 mr-3 text-red-600" />
                                        <div>
                                            <h3 className="font-bold">
                                                Erro ao enviar mensagem
                                            </h3>
                                            <p className="text-sm mt-1">
                                                Por favor, tente novamente ou
                                                entre em contato diretamente por
                                                telefone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Nome e Telefone */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="name"
                                            className="flex items-center text-sm font-bold text-black"
                                        >
                                            <User className="h-4 w-4 mr-2 text-red-600" />
                                            Nome Completo *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-black font-medium"
                                            placeholder="Digite seu nome completo"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="phone"
                                            className="flex items-center text-sm font-bold text-black"
                                        >
                                            <Phone className="h-4 w-4 mr-2 text-red-600" />
                                            Telefone *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            maxLength={15}
                                            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-black font-medium"
                                            placeholder="(91) 98233-7100"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="email"
                                        className="flex items-center text-sm font-bold text-black"
                                    >
                                        <Mail className="h-4 w-4 mr-2 text-red-600" />
                                        E-mail *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-black font-medium"
                                        placeholder="seu@email.com"
                                    />
                                </div>

                                {/* Assunto */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="subject"
                                        className="flex items-center text-sm font-bold text-black"
                                    >
                                        <FileText className="h-4 w-4 mr-2 text-red-600" />
                                        Assunto *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-black font-medium"
                                    >
                                        <option value="">
                                            Selecione o assunto da sua mensagem
                                        </option>
                                        <option value="duvida-produto">
                                            Dúvida sobre produto
                                        </option>
                                        <option value="orcamento">
                                            Solicitação de orçamento
                                        </option>
                                        <option value="suporte">
                                            Suporte técnico
                                        </option>
                                        <option value="parceria">
                                            Parceria comercial
                                        </option>
                                        <option value="disponibilidade">
                                            Consulta de disponibilidade
                                        </option>
                                        <option value="outros">
                                            Outros assuntos
                                        </option>
                                    </select>
                                </div>

                                {/* Mensagem */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="message"
                                        className="flex items-center text-sm font-bold text-black"
                                    >
                                        <MessageCircle className="h-4 w-4 mr-2 text-red-600" />
                                        Mensagem *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 resize-none text-black font-medium"
                                        placeholder="Descreva detalhadamente sua solicitação, incluindo informações sobre o veículo se necessário (marca, modelo, ano)..."
                                    />
                                </div>

                                {/* Botão de Envio */}
                                <div className="text-center pt-4">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 min-w-[200px] border-2 border-red-600"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin h-5 w-5 mr-3 border-2 border-current border-t-transparent rounded-full" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5 mr-3" />
                                                Enviar Mensagem
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-sm text-gray-600 mt-4 font-medium">
                                        Responderemos sua mensagem em até 24
                                        horas úteis
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}
