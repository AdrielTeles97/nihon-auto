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
    FileText
} from 'lucide-react'
import Image from 'next/image'
import { HeroHeader } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus('idle')

        try {
            // Aqui você pode implementar o envio do formulário
            // Para um webhook ou API de contato
            await new Promise(resolve => setTimeout(resolve, 2000)) // Simulação

            console.log('Formulário enviado:', formData)
            setSubmitStatus('success')

            // Limpar formulário
            setFormData({
                name: '',
                phone: '',
                email: '',
                subject: '',
                message: ''
            })
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
            {/* Hero Section com Background */}
            <section className="relative h-96 md:h-[32rem] lg:h-[40rem] overflow-hidden">
                <Image
                    src="/images/banner-atendimento.svg"
                    alt="Fale Conosco"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white max-w-4xl mx-auto px-4">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                            Fale com a Gente
                        </h1>
                        <p className="text-xl md:text-2xl opacity-90 mb-8">
                            Estamos aqui para ajudar você com suas necessidades
                            em telecomunicações
                        </p>
                        <Badge className="bg-primary text-primary-foreground text-lg px-6 py-2">
                            <MessageCircle className="h-5 w-5 mr-2" />
                            Atendimento Especializado
                        </Badge>
                    </div>
                </div>
            </section>

            {/* Informações de Contato */}
            <section className="py-20 bg-background relative overflow-hidden">
                {/* Background com noise pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div
                        className="w-full h-full bg-repeat"
                        style={{
                            backgroundImage: `url('/noise.svg')`,
                            backgroundSize: '200px 200px'
                        }}
                    />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Cards de Informações */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {/* Telefone */}
                        <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                <Phone className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">
                                Telefone
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Ligue para nós durante nosso horário comercial
                            </p>
                            <a
                                href="tel:+5511999999999"
                                className="text-primary font-semibold text-lg hover:underline"
                            >
                                (11) 99999-9999
                            </a>
                        </div>

                        {/* Endereço */}
                        <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                <MapPin className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">
                                Endereço
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Visite nosso escritório
                            </p>
                            <address className="text-primary font-medium not-italic">
                                Rua das Telecomunicações, 123
                                <br />
                                São Paulo - SP
                                <br />
                                CEP: 01234-567
                            </address>
                        </div>

                        {/* Horário */}
                        <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                <Clock className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">
                                Horário
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Nosso horário de funcionamento
                            </p>
                            <div className="text-primary font-medium">
                                <p>Segunda à Sexta</p>
                                <p>08:00 - 18:00</p>
                                <p className="text-muted-foreground mt-2 text-sm">
                                    Sábados: 08:00 - 12:00
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Formulário de Contato */}
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 lg:p-12">
                            {/* Header do formulário */}
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold mb-4">
                                    Formulário de Contato
                                </h2>
                                <p className="text-muted-foreground">
                                    Preencha os dados abaixo e entraremos em
                                    contato o mais breve possível
                                </p>
                            </div>

                            {/* Status Messages */}
                            {submitStatus === 'success' && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
                                    <div className="flex items-center">
                                        <Send className="h-5 w-5 mr-2" />
                                        Mensagem enviada com sucesso! Entraremos
                                        em contato em breve.
                                    </div>
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
                                    <div className="flex items-center">
                                        <MessageCircle className="h-5 w-5 mr-2" />
                                        Erro ao enviar mensagem. Tente
                                        novamente.
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nome e Telefone */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="flex items-center text-sm font-medium text-foreground mb-2"
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            Nome Completo
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                                            placeholder="Seu nome completo"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="flex items-center text-sm font-medium text-foreground mb-2"
                                        >
                                            <Phone className="h-4 w-4 mr-2" />
                                            Telefone
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                                            placeholder="(11) 99999-9999"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="flex items-center text-sm font-medium text-foreground mb-2"
                                    >
                                        <Mail className="h-4 w-4 mr-2" />
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                                        placeholder="seu@email.com"
                                    />
                                </div>

                                {/* Assunto */}
                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="flex items-center text-sm font-medium text-foreground mb-2"
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        Assunto
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                                    >
                                        <option value="">
                                            Selecione um assunto
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
                                        <option value="reclamacao">
                                            Reclamação
                                        </option>
                                        <option value="outros">Outros</option>
                                    </select>
                                </div>

                                {/* Mensagem */}
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="flex items-center text-sm font-medium text-foreground mb-2"
                                    >
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Mensagem
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 resize-none"
                                        placeholder="Descreva sua solicitação ou dúvida..."
                                    />
                                </div>

                                {/* Botão de Envio */}
                                <div className="text-center">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                        className="px-8 py-4 text-lg"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin h-5 w-5 mr-2 border-2 border-current border-t-transparent rounded-full" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5 mr-2" />
                                                Enviar Formulário
                                            </>
                                        )}
                                    </Button>
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
