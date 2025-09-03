"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
    backgroundImage: string;
    title: string;
    highlight: string;
    subtitle: string;
    primaryAction: {
        label: string;
        href: string;
    };
    secondaryAction?: {
        label: string;
        href: string;
    };
    productImage?: string;
    productImageAlt?: string;
}

export function HeroSection({
    backgroundImage,
    title,
    highlight,
    subtitle,
    primaryAction,
    secondaryAction,
    productImage,
    productImageAlt,
}: HeroSectionProps) {
    return (
        <section className="relative isolate overflow-hidden text-center">
            <Image
                src={backgroundImage}
                alt=""
                fill
                priority
                className="absolute inset-0 -z-10 h-full w-full object-cover"
            />
            <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
                <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
                    {title} <span className="text-red-500">{highlight}</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-200">{subtitle}</p>
                <div className="mt-10 flex items-center justify-center gap-6">
                    <Link href={primaryAction.href}>
                        <Button
                            size="lg"
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            {primaryAction.label}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    {secondaryAction && (
                        <Link href={secondaryAction.href}>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white hover:text-black"
                            >
                                {secondaryAction.label}
                            </Button>
                        </Link>
                    )}
                </div>
                {productImage && (
                    <div className="mt-16 flex justify-center">
                        <Image
                            src={productImage}
                            alt={productImageAlt || ""}
                            width={500}
                            height={500}
                            className="object-contain"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}

export default HeroSection;
