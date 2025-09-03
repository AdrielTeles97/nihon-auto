"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Button } from "@/components/ui/button";
import { AnimatedText } from "@/components/motion-primitives/animated-text";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface BannerItem {
  id: string;
  title: string;
  highlight: string;
  subtitle: string;
  image: string;
  cta: {
    label: string;
    href: string;
  };
}

const banners: BannerItem[] = [
  {
    id: "acessorios",
    title: "NIHON",
    highlight: "ACESSÓRIOS",
    subtitle: "Excelência em peças automotivas de alta qualidade",
    image: "/images/nihon-auto-template1.png",
    cta: { label: "Explorar Produtos", href: "/produtos" },
  },
  {
    id: "historia",
    title: "MAIS DE 38 ANOS",
    highlight: "DE EXPERIÊNCIA",
    subtitle: "Tradicionalidade que garante confiança em cada compra",
    image: "/images/banner-02.jpg",
    cta: { label: "Nossa História", href: "/sobre" },
  },
];

export function BannerCarousel() {
  return (
    <section className="relative w-full h-[600px] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        effect="fade"
        className="h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="relative h-full w-full">
            <Image
              src={banner.image}
              alt=""
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                <AnimatedText text={banner.title} className="mr-2" />
                <span className="text-red-500"><AnimatedText text={banner.highlight} delay={0.3} /></span>
              </h1>
              <p className="mt-6 text-lg text-gray-200 max-w-2xl">
                {banner.subtitle}
              </p>
              <div className="mt-10">
                <Link href={banner.cta.href}>
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                    {banner.cta.label}
                  </Button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default BannerCarousel;

