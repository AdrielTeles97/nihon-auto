'use client'

import Image from 'next/image'
import Link from 'next/link'

interface BannerData {
    image: string
    alt: string
    title: string
    description: string
    link: string
    category: string
}

export function DoubleBanners() {
    const banners: BannerData[] = [
        {
            image: '/images/banner-audio-e-video.webp',
            alt: 'Áudio e Vídeo',
            title: 'Áudio e Vídeo',
            description: 'Sistemas multimídia premium para seu veículo',
            link: '/produtos?category=audio-e-video',
            category: 'Audio e Vídeo'
        },
        {
            image: '/images/banner-frisos.webp',
            alt: 'Frisos',
            title: 'Frisos',
            description: 'Proteção e estilo para seu carro',
            link: '/produtos?category=friso',
            category: 'Frisos'
        }
    ]

    return (
        <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50/20">
            {/* Grid decorativo de fundo */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-black to-transparent" />
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
            </div>

            <div className="relative container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
                    {banners.map((banner, index) => (
                        <Link
                            key={index}
                            href={banner.link}
                            className="group relative overflow-hidden rounded-2xl bg-black aspect-[16/9] md:aspect-[16/10] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
                        >
                            {/* Linhas decorativas */}
                            <div className="absolute inset-0 opacity-[0.06] z-10 pointer-events-none">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
                                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
                                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
                            </div>

                            {/* Imagem de fundo */}
                            <div className="absolute inset-0">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={banner.image}
                                        alt={banner.alt}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        onError={e => {
                                            const target =
                                                e.target as HTMLImageElement
                                            target.style.display = 'none'
                                        }}
                                    />
                                    {/* Fallback background com gradiente vermelho */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-700 to-black -z-10" />
                                </div>
                                {/* Overlay gradiente */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-500" />
                            </div>

                            {/* Conteúdo */}
                            <div className="relative h-full flex flex-col justify-end p-6 md:p-8 z-20">
                                {/* Badge da categoria */}
                                <div className="mb-4">
                                    <span className="inline-block px-4 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-full">
                                        {banner.category}
                                    </span>
                                </div>

                                {/* Título */}
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors duration-300">
                                    {banner.title}
                                </h3>

                                {/* Descrição */}
                                <p className="text-gray-200 text-base md:text-lg mb-4">
                                    {banner.description}
                                </p>

                                {/* Call to action */}
                                <div className="flex items-center gap-2 text-white group-hover:text-red-500 transition-colors duration-300">
                                    <span className="font-semibold">
                                        Explorar produtos
                                    </span>
                                    <svg
                                        className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
