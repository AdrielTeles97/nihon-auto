'use client';

import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider'
import { ProgressiveBlur } from '@/components/motion-primitives/progressive-blur'
import { useEffect, useState } from 'react'

interface Brand {
  id: string;
  name: string;
  logo: string;
  slug: string;
}

// Logos padrão como fallback
const defaultLogos = [
  { name: '3M' },
  { name: 'VONIXX' },
  { name: 'Chemical Guys' },
  { name: 'MEGUIAR\'S' },
  { name: 'SONAX' },
  { name: 'MOTHERS' },
  { name: 'TURTLE WAX' },
  { name: 'GATLUB' },
];

export default function LogoCloud() {
    const [logos, setLogos] = useState(defaultLogos);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                // Tentar buscar marcas do WordPress
                const response = await fetch('/api/brands/wordpress?logocloud=true&limit=8');
                
                if (response.ok) {
                    const data = await response.json();
                    
                    if (data.success && data.data.length > 0) {
                        // Converter marcas do WordPress para formato do LogoCloud
                        const wordpressLogos = data.data.map((brand: Brand) => ({
                            name: brand.name,
                            logo: brand.logo,
                        }));
                        
                        setLogos(wordpressLogos);
                        console.log('LogoCloud carregado com marcas do WordPress:', wordpressLogos.length);
                    } else {
                        console.warn('Nenhuma marca encontrada no WordPress, usando logos padrão');
                    }
                } else {
                    console.warn('Erro ao buscar marcas do WordPress, usando logos padrão');
                }
            } catch (error) {
                console.warn('Erro ao conectar com WordPress, usando logos padrão:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    if (loading) {
        return (
            <section className="bg-background overflow-hidden py-16">
                <div className="group relative m-auto max-w-7xl px-6">
                    <div className="flex flex-col items-center md:flex-row">
                        <div className="md:max-w-44 md:border-r md:pr-6">
                            <p className="text-end text-sm">As melhores marcas</p>
                        </div>
                        <div className="relative py-6 md:w-[calc(100%-11rem)]">
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-background overflow-hidden py-16">
            <div className="group relative m-auto max-w-7xl px-6">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="md:max-w-44 md:border-r md:pr-6">
                        <p className="text-end text-sm">As melhores marcas</p>
                    </div>
                    <div className="relative py-6 md:w-[calc(100%-11rem)]">
                        <InfiniteSlider
                            speedOnHover={3.5}
                            speed={3}
                            gap={112}>
                            {logos.map((logo, index) => (
                                <div key={index} className="flex">
                                    {logo.logo ? (
                                        <img
                                            src={logo.logo}
                                            alt={`${logo.name} logo`}
                                            className="mx-auto h-8 w-auto object-contain transition-all duration-300 hover:scale-110"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                const textDiv = target.nextElementSibling as HTMLElement;
                                                if (textDiv) textDiv.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div 
                                        className={`mx-auto h-8 w-fit flex items-center justify-center ${logo.name.length > 10 ? 'text-xl' : 'text-2xl'} font-bold text-gray-600 ${logo.logo ? 'hidden' : 'flex'}`}
                                        style={{ display: logo.logo ? 'none' : 'flex' }}
                                    >
                                        {logo.name}
                                    </div>
                                </div>
                            ))}
                        </InfiniteSlider>

                        <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                        <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                        <ProgressiveBlur
                            className="pointer-events-none absolute left-0 top-0 h-full w-20"
                            direction="left"
                            blurIntensity={1}
                        />
                        <ProgressiveBlur
                            className="pointer-events-none absolute right-0 top-0 h-full w-20"
                            direction="right"
                            blurIntensity={1}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}