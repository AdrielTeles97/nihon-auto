"use client";

import Image from "next/image";

interface ProductSpecsProps {
  title?: string;
  description?: string;
  gallery?: string[];
  specs?: Record<string, string | number | boolean>;
}

export function ProductSpecs({
  title = "Os Detalhes",
  description,
  gallery = [],
  specs = {},
}: ProductSpecsProps) {
  const images = gallery.length > 0 ? gallery : ["/images/placeholder-product.jpg"]; 
  const side = images[0];
  const side2 = images[1] ?? images[0];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
          {description && (
            <p className="text-gray-600 max-w-3xl mx-auto mt-3">
              {description}
            </p>
          )}
        </div>

        {/* Image pair like Tailwind UI */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
            <div className="relative w-full pt-[66%]">
              <Image
                src={side}
                alt="Detalhe do produto"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
            <div className="relative w-full pt-[66%]">
              <Image
                src={side2}
                alt="Detalhe do produto"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Key-value specs */}
        {Object.keys(specs).length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Especificações</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(specs).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-sm"
                >
                  <dt className="text-gray-500">{k}</dt>
                  <dd className="text-gray-900 font-medium">{String(v)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}

