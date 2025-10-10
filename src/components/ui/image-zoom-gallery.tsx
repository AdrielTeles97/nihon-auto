'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { X, ZoomIn, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageZoomGalleryProps {
    images: string[]
    productName: string
}

export function ImageZoomGallery({
    images,
    productName
}: ImageZoomGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isZooming, setIsZooming] = useState(false)
    const [zoomEnabled, setZoomEnabled] = useState(true)
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
    const imageRef = useRef<HTMLDivElement>(null)

    // Filtrar imagens válidas (não vazias e não com erro)
    const validImages = images.filter(
        (img, index) => img && img.trim() !== '' && !imageErrors.has(index)
    )
    const currentImage =
        validImages[selectedIndex] ||
        validImages[0] ||
        '/images/placeholder-product.svg'

    const handleImageError = (index: number) => {
        console.warn(`Erro ao carregar imagem ${index}:`, images[index])
        setImageErrors(prev => new Set(prev).add(index))
    }

    // Navegação por teclado e controle de scroll
    useEffect(() => {
        if (!isModalOpen) return

        // Prevenir scroll do body
        document.body.classList.add('modal-open')

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsModalOpen(false)
            } else if (e.key === 'ArrowLeft') {
                handlePrevious()
            } else if (e.key === 'ArrowRight') {
                handleNext()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.classList.remove('modal-open')
        }
    }, [isModalOpen, selectedIndex])

    const handlePrevious = () => {
        setSelectedIndex(prev =>
            prev === 0 ? validImages.length - 1 : prev - 1
        )
    }

    const handleNext = () => {
        setSelectedIndex(prev =>
            prev === validImages.length - 1 ? 0 : prev + 1
        )
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current || !isZooming || !zoomEnabled) return

        const rect = imageRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        setZoomPosition({ x, y })
    }

    const handleMouseEnter = () => {
        if (zoomEnabled) {
            setIsZooming(true)
        }
    }

    const handleMouseLeave = () => {
        setIsZooming(false)
    }

    return (
        <>
            {/* Galeria Principal */}
            <div className="space-y-4">
                {/* Imagem Principal com Lupa */}
                <div
                    ref={imageRef}
                    className={cn(
                        'relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200 group',
                        zoomEnabled &&
                            (isZooming ? 'zoom-cursor-active' : 'zoom-cursor')
                    )}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Image
                        src={currentImage}
                        alt={`${productName} - Imagem ${selectedIndex + 1}`}
                        fill
                        className={cn(
                            'object-contain transition-transform duration-200',
                            isZooming && zoomEnabled && 'scale-150'
                        )}
                        style={
                            isZooming && zoomEnabled
                                ? {
                                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                  }
                                : undefined
                        }
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                        priority
                        onError={() => handleImageError(selectedIndex)}
                        unoptimized={currentImage.includes(
                            'nihonacessoriosautomotivos.com.br'
                        )}
                    />

                    {/* Botão Toggle Zoom */}
                    <button
                        onClick={() => setZoomEnabled(!zoomEnabled)}
                        className={cn(
                            'absolute top-4 left-4 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110',
                            zoomEnabled
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-white/90 text-gray-700 hover:bg-white'
                        )}
                        aria-label={
                            zoomEnabled ? 'Desativar zoom' : 'Ativar zoom'
                        }
                        title={zoomEnabled ? 'Desativar zoom' : 'Ativar zoom'}
                    >
                        <ZoomIn className="w-5 h-5" />
                    </button>

                    {/* Overlay de Zoom */}
                    {isZooming && zoomEnabled && (
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                <ZoomIn className="w-4 h-4" />
                                Zoom ativo
                            </div>
                        </div>
                    )}

                    {/* Botão de Expandir */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                        aria-label="Expandir imagem"
                    >
                        <Maximize2 className="w-5 h-5" />
                    </button>

                    {/* Navegação de Imagens (se houver múltiplas) */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevious}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                                aria-label="Imagem anterior"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                                aria-label="Próxima imagem"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Miniaturas */}
                {validImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {validImages.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedIndex(index)}
                                className={cn(
                                    'relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200',
                                    selectedIndex === index
                                        ? 'border-red-500 ring-2 ring-red-200'
                                        : 'border-gray-200 hover:border-gray-300'
                                )}
                            >
                                <Image
                                    src={image}
                                    alt={`${productName} - Miniatura ${
                                        index + 1
                                    }`}
                                    fill
                                    className="object-contain bg-gray-50"
                                    sizes="80px"
                                    onError={() => handleImageError(index)}
                                    unoptimized={image.includes(
                                        'nihonacessoriosautomotivos.com.br'
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                )}

                {/* Dica de Zoom */}
                <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                    <ZoomIn className="w-4 h-4" />
                    {zoomEnabled
                        ? 'Passe o mouse sobre a imagem para dar zoom'
                        : 'Zoom desativado - clique no ícone para ativar'}
                </div>
            </div>

            {/* Modal de Imagem Expandida */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 modal-overlay"
                    onClick={() => setIsModalOpen(false)}
                >
                    {/* Botão Fechar - Maior e mais visível */}
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-4 right-4 text-white hover:text-red-500 p-3 rounded-full bg-black/70 hover:bg-black/90 transition-all duration-200 hover:scale-110 z-10 shadow-xl border-2 border-white/20"
                        aria-label="Fechar"
                        title="Fechar (ESC)"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Contador de Imagens e Instruções */}
                    <div className="absolute top-4 left-4 z-10 space-y-2">
                        {validImages.length > 1 && (
                            <div className="text-white bg-black/70 px-4 py-2 rounded-full text-sm shadow-xl border-2 border-white/20">
                                {selectedIndex + 1} / {validImages.length}
                            </div>
                        )}
                        <div className="text-white bg-black/70 px-4 py-2 rounded-full text-xs shadow-xl border-2 border-white/20 flex items-center gap-2">
                            <span>ESC para fechar</span>
                            {validImages.length > 1 && (
                                <span>• ← → para navegar</span>
                            )}
                        </div>
                    </div>

                    {/* Imagem Expandida */}
                    <div
                        className="relative w-full h-full max-w-6xl max-h-[90vh]"
                        onClick={e => e.stopPropagation()}
                    >
                        <Image
                            src={currentImage}
                            alt={`${productName} - Imagem ${selectedIndex + 1}`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1536px) 100vw, 1536px"
                            priority
                        />
                    </div>

                    {/* Navegação no Modal */}
                    {validImages.length > 1 && (
                        <>
                            <button
                                onClick={e => {
                                    e.stopPropagation()
                                    handlePrevious()
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 hover:scale-110"
                                aria-label="Imagem anterior"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button
                                onClick={e => {
                                    e.stopPropagation()
                                    handleNext()
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 hover:scale-110"
                                aria-label="Próxima imagem"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </>
                    )}

                    {/* Miniaturas no Modal */}
                    {validImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
                            {validImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={e => {
                                        e.stopPropagation()
                                        setSelectedIndex(index)
                                    }}
                                    className={cn(
                                        'relative w-16 h-16 rounded overflow-hidden border-2 transition-all duration-200',
                                        selectedIndex === index
                                            ? 'border-white ring-2 ring-white/50'
                                            : 'border-transparent hover:border-white/50'
                                    )}
                                >
                                    <Image
                                        src={image}
                                        alt={`Miniatura ${index + 1}`}
                                        fill
                                        className="object-contain bg-gray-900"
                                        sizes="64px"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
