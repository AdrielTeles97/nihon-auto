"use client";

import React, { useState } from "react";
import { ProductDetailImage, ProductThumbnailImage } from "@/components/ui/ProductImage";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-6">
      <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
        <ProductDetailImage
          src={images[selected]}
          alt={name}
          className="object-cover w-full h-full"
        />

        {/* Favorite button */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                selected === i
                  ? "border-blue-600 ring-2 ring-blue-100"
                  : "border-gray-200 hover:border-gray-300"
              } bg-white`}
            >
              <ProductThumbnailImage
                src={src}
                alt={`${name} ${i + 1}`}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

