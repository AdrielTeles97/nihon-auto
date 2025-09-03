"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Product } from "@/types";
import { getProductBySlug } from "@/services/wordpress";
import { ProductSpecs } from "@/components/patterns/ProductSpecs";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const p = await getProductBySlug(String(params.slug));
        if (!p) setError("Produto não encontrado");
        setProduct(p);
      } catch (e) {
        setError("Erro ao carregar produto");
      } finally {
        setLoading(false);
      }
    };
    if (params.slug) load();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Carregando produto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold mb-2">Produto não encontrado</h1>
        <p className="text-gray-600 mb-6">O produto que você está procurando não existe.</p>
        <Link href="/produtos">
          <Button variant="default" className="bg-red-600 hover:bg-red-700">
            Voltar aos produtos
          </Button>
        </Link>
      </div>
    );
  }

  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const hasSpecs = product.specifications && Object.keys(product.specifications).length > 0;
  const hasExtraImages = Array.isArray(product.gallery) && product.gallery.length > 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/produtos" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Voltar aos produtos
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductGallery images={gallery} name={product.name} />
          <ProductInfo product={product} />
        </div>
      </div>
      
      {/* Additional Details Section */}
      {(hasSpecs || hasExtraImages) && (
        <div className="bg-white py-16">
          <ProductSpecs
            title="The Fine Details"
            description="Conheça os detalhes que tornam este produto especial. Materiais de primeira linha, design funcional e durabilidade pensada para o dia a dia."
            gallery={gallery}
            specs={product.specifications ?? {}}
          />
        </div>
      )}
    </div>
  );
}