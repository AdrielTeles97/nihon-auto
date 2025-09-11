'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { BrandsSlider } from '@/components/sections/BrandsSlider'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Definir o tipo do slide
interface Slide {
    src: string
    alt: string
    title: string
    description: string
    showButtons: boolean
}

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0)

    const slides: Slide[] = [
        {
            src: '/images/nihon-hero-2.png',
            alt: 'Nihon acessórios Hero Image 2',
            title: '',
            description: '',
            showButtons: true
        },
        {
            src: '/images/slideweb1.webp',
            alt: 'Nihon acessórios Hero Image 4',
            title: '',
            description: '',
            showButtons: false
        },
        {
            src: '/images/nihon-hero-3.jpeg',
            alt: 'Nihon acessórios Hero Image 3',
            title: '',
            description: '',
            showButtons: false
        }
    ]

    // Auto-slide functionality
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length)
        }, 5000) // Change slide every 5 seconds

        return () => clearInterval(timer)
    }, [slides.length])

    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
    }

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
    }

    return (
        <>
            <main className="overflow-x-hidden">
                <section className="relative overflow-hidden h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] pt-20">
                    {/* Background Images Slider */}
                    <div className="absolute inset-0 z-0">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ${
                                    index === currentSlide
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                }`}
                            >
                                <Image
                                    src={slide.src}
                                    alt={slide.alt || 'Banner'}
                                    fill
                                    className="object-cover object-center"
                                    priority={index === 0}
                                    unoptimized
                                    sizes="100vw"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Black Gradient Overlay */}
                    {/* {<div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>} */}

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                        aria-label="Slide anterior"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                        aria-label="Próximo slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                    index === currentSlide
                                        ? 'bg-white'
                                        : 'bg-white/50 hover:bg-white/70'
                                }`}
                                aria-label={`Ir para slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Content */}
                    <div className="relative z-20 pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44">
                        <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
                            {slides[currentSlide].title && (
                                <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left text-white">
                                    <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-7xl text-white">
                                        {slides[currentSlide].title}
                                    </h1>
                                    {slides[currentSlide].description && (
                                        <p className="mt-8 max-w-2xl text-pretty text-lg text-white">
                                            {slides[currentSlide].description}
                                        </p>
                                    )}

                                    {slides[currentSlide].showButtons && (
                                        <div className="mt-8 sm:mt-12 flex flex-col items-center justify-center gap-3 sm:gap-2 sm:flex-row lg:justify-start">
                                            <Button
                                                asChild
                                                size="lg"
                                                className="w-full sm:w-auto px-5 text-base"
                                            >
                                                <Link href="/produtos">
                                                    <span className="text-nowrap">
                                                        Ver todos os produtos
                                                    </span>
                                                </Link>
                                            </Button>
                                            <Button
                                                key={2}
                                                asChild
                                                size="lg"
                                                variant="ghost"
                                                className="w-full sm:w-auto px-5 text-base"
                                            >
                                                <Link href="#link">
                                                    <span className="text-nowrap">
                                                        Entrar em contato
                                                    </span>
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
                <section className="bg-background pb-16 md:pb-32">
                    <div className="group relative m-auto max-w-6xl px-6">
                        <div className="flex flex-col items-center md:flex-row">
                            <div className="md:max-w-44 md:border-r md:pr-6">
                                <p className="text-end text-sm">
                                    As melhores marcas estão aqui
                                </p>
                            </div>
                            <BrandsSlider
                                limit={15}
                                speed={40}
                                speedOnHover={20}
                                gap={112}
                            />
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
