'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  onError?: () => void;
}

export function ProductImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  sizes,
  priority = false,
  onError,
  ...props
}: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc('/images/placeholder-product.jpg');
      onError?.();
    }
  };

  const imageProps = {
    src: imageSrc,
    alt,
    className: cn('transition-all duration-300', className),
    onError: handleError,
    priority,
    sizes,
    ...props,
  };

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
      />
    );
  }

  return (
    <Image
      {...imageProps}
      width={width}
      height={height}
    />
  );
}

// Componente específico para cards de produto
export function ProductCardImage({
  src,
  alt,
  className,
  ...props
}: Omit<ProductImageProps, 'width' | 'height'>) {
  return (
    <ProductImage
      src={src}
      alt={alt}
      fill
      className={cn('object-contain group-hover:scale-105 transition-transform duration-300 bg-white p-2', className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  );
}

// Componente específico para detalhes do produto
export function ProductDetailImage({
  src,
  alt,
  width = 600,
  height = 600,
  className,
  ...props
}: ProductImageProps) {
  return (
    <ProductImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn('w-full h-full object-cover', className)}
      {...props}
    />
  );
}

// Componente para thumbnails
export function ProductThumbnailImage({
  src,
  alt,
  width = 80,
  height = 80,
  className,
  ...props
}: ProductImageProps) {
  return (
    <ProductImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn('w-full h-full object-cover', className)}
      {...props}
    />
  );
}