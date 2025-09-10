import {
    Truck,
    Shield,
    Clock,
    Award,
    Users,
    Star,
    ArrowRight,
    CheckCircle,
    TrendingUp,
    Zap
} from 'lucide-react'
import Link from 'next/link'

const benefits = [
    {
        icon: Truck,
        title: 'Entrega Rápida',
        description:
            'Entrega expressa para todo o Brasil com rastreamento em tempo real',
        color: 'from-blue-500 to-blue-600'
    },
    {
        icon: Shield,
        title: 'Qualidade Garantida',
        description:
            'Produtos originais com garantia de fábrica e certificação',
        color: 'from-green-500 to-green-600'
    },
    {
        icon: Clock,
        title: 'Atendimento 24/7',
        description:
            'Suporte especializado sempre disponível para auxiliar você',
        color: 'from-purple-500 to-purple-600'
    },
    {
        icon: Award,
        title: 'Melhor Preço',
        description:
            'Preços competitivos e condições especiais para grandes volumes',
        color: 'from-yellow-500 to-yellow-600'
    },
    {
        icon: Users,
        title: 'Equipe Especializada',
        description: 'Profissionais experientes em peças automotivas japonesas',
        color: 'from-pink-500 to-pink-600'
    },
    {
        icon: Star,
        title: 'Excelência',
        description: 'Mais de 10 anos de experiência no mercado automotivo',
        color: 'from-indigo-500 to-indigo-600'
    }
]

const stats = [
    { value: '+10', label: 'Anos de experiência', icon: Award, change: '+15%' },
    { value: '5K+', label: 'Produtos disponíveis', icon: Star, change: '+23%' },
    {
        value: '98%',
        label: 'Satisfação dos clientes',
        icon: CheckCircle,
        change: '+5%'
    },
    { value: '24h', label: 'Suporte disponível', icon: Clock, change: '100%' }
]

const highlights = [
    'Especialistas em peças japonesas',
    'Garantia em todos os produtos',
    'Entrega expressa nacionalmente',
    'Suporte técnico especializado'
]

export function WhyChooseSection() {
    return (
        <section className="relative bg-black text-white py-20 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05)_76%,transparent_77%,transparent_100%)] bg-[length:100px_100px]" />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05)_76%,transparent_77%,transparent_100%)] bg-[length:100px_100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Hero Banner Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 px-6 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm border border-red-600/30">
                        <Star className="w-4 h-4" />
                        Líderes em Peças Automotivas Japonesas
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-white to-red-400 bg-clip-text text-transparent leading-tight">
                        Por que escolher a{' '}
                        <span className="text-red-500">Nihon Auto</span>?
                    </h2>

                    <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8 px-2">
                        Mais de uma década de experiência oferecendo as melhores
                        peças automotivas japonesas com qualidade garantida e
                        atendimento excepcional.
                    </p>
                </div>

                {/* Stats Highlight */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className="relative bg-zinc-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-800 hover:border-red-600/30 transition-all duration-500 group-hover:scale-105">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
                                </div>
                                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 group-hover:text-red-400 transition-colors">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">
                                    {stat.label}
                                </div>
                                <div className="flex items-center justify-center gap-1 text-xs text-green-400">
                                    <TrendingUp className="w-3 h-3" />
                                    {stat.change}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center mb-16 sm:mb-20">
                    {/* Left Side - Benefits */}
                    <div className="space-y-6 order-2 lg:order-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center lg:text-left">
                            Nossos Diferenciais
                        </h3>

                        <div className="space-y-4">
                            {highlights.map((highlight, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <CheckCircle className="w-6 h-6 text-green-400" />
                                    </div>
                                    <span className="text-lg text-gray-300 group-hover:text-white transition-colors">
                                        {highlight}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-8">
                            <Link
                                href="/produtos"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 group shadow-lg hover:shadow-red-600/25"
                            >
                                <Zap className="w-5 h-5" />
                                Ver Produtos
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/a-nihon"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-gray-600 hover:border-red-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-red-600/10"
                            >
                                Sobre Nós
                            </Link>
                        </div>
                    </div>

                    {/* Right Side - Features Visual */}
                    <div className="relative order-1 lg:order-2">
                        <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-sm border border-zinc-700">
                            <div className="grid grid-cols-1 gap-4 sm:gap-6">
                                {benefits.slice(0, 3).map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-zinc-800/50 rounded-lg sm:rounded-xl border border-zinc-700/50 hover:border-red-600/30 transition-all duration-300 group"
                                    >
                                        <div
                                            className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${benefit.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                                        >
                                            <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">
                                                {benefit.title}
                                            </h4>
                                            <p className="text-gray-400 text-xs sm:text-sm leading-tight">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Floating Elements - Hidden on mobile */}
                        <div className="hidden sm:block absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-red-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
                        <div className="hidden sm:block absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>
                </div>

                {/* Additional Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {benefits.slice(3).map((benefit, index) => (
                        <div
                            key={index}
                            className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800 hover:border-red-600/30 transition-all duration-500 hover:transform hover:-translate-y-2"
                        >
                            <div className="text-center">
                                <div
                                    className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                                >
                                    <benefit.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-red-400 transition-colors">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
