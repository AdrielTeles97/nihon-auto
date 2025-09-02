"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

interface FilterSidebarProps {
  title?: string;
  categories: string[];
  brands?: string[];
  selectedCategory: string | null;
  onCategoryChange: (value: string | null) => void;
  selectedBrand: string | null;
  onBrandChange: (value: string | null) => void;
  minPrice?: number | null;
  maxPrice?: number | null;
  onMinPriceChange?: (value: number | null) => void;
  onMaxPriceChange?: (value: number | null) => void;
}

export function FilterSidebar({
  title = "Filtros",
  categories,
  brands = [],
  selectedCategory,
  onCategoryChange,
  selectedBrand,
  onBrandChange,
  minPrice = null,
  maxPrice = null,
  onMinPriceChange,
  onMaxPriceChange,
}: FilterSidebarProps) {
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({
    categorias: true,
    marcas: true,
    preco: true,
  });

  const toggle = (key: string) =>
    setOpenGroups((p) => ({ ...p, [key]: !p[key] }));

  const hasAnyFilter = useMemo(
    () => Boolean(selectedCategory || selectedBrand || minPrice !== null || maxPrice !== null),
    [selectedCategory, selectedBrand, minPrice, maxPrice]
  );

  return (
    <aside className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h3>
      </div>

      {/* Categorias */}
      <div className="py-4 border-t first:border-t-0">
        <button
          type="button"
          className="w-full flex items-center justify-between text-left"
          onClick={() => toggle("categorias")}
        >
          <span className="text-sm font-semibold text-gray-900">Categorias</span>
          <span className="text-gray-400">{openGroups.categorias ? "–" : "+"}</span>
        </button>
        {openGroups.categorias && (
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  checked={selectedCategory === null}
                  onChange={() => onCategoryChange(null)}
                />
                <span className="text-gray-700">Todas</span>
              </label>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    checked={selectedCategory === c}
                    onChange={() => onCategoryChange(c)}
                  />
                  <span className="text-gray-700">{c}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Marcas */}
      {brands.length > 0 && (
        <div className="py-4 border-t">
          <button
            type="button"
            className="w-full flex items-center justify-between text-left"
            onClick={() => toggle("marcas")}
          >
            <span className="text-sm font-semibold text-gray-900">Marcas</span>
            <span className="text-gray-400">{openGroups.marcas ? "–" : "+"}</span>
          </button>
          {openGroups.marcas && (
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="brand"
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    checked={selectedBrand === null}
                    onChange={() => onBrandChange(null)}
                  />
                  <span className="text-gray-700">Todas</span>
                </label>
              </li>
              {brands.map((b) => (
                <li key={b}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      checked={selectedBrand === b}
                      onChange={() => onBrandChange(b)}
                    />
                    <span className="text-gray-700">{b}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Preço */}
      <div className="py-4 border-t">
        <button
          type="button"
          className="w-full flex items-center justify-between text-left"
          onClick={() => toggle("preco")}
        >
          <span className="text-sm font-semibold text-gray-900">Preço</span>
          <span className="text-gray-400">{openGroups.preco ? "–" : "+"}</span>
        </button>
        {openGroups.preco && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Mínimo</label>
              <input
                type="number"
                min={0}
                step={1}
                value={minPrice ?? ""}
                onChange={(e) => onMinPriceChange?.(e.target.value === "" ? null : Math.max(0, Number(e.target.value)))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Máximo</label>
              <input
                type="number"
                min={0}
                step={1}
                value={maxPrice ?? ""}
                onChange={(e) => onMaxPriceChange?.(e.target.value === "" ? null : Math.max(0, Number(e.target.value)))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="∞"
              />
            </div>
          </div>
        )}
      </div>

      {hasAnyFilter && (
        <div className="pt-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onCategoryChange(null);
              onBrandChange(null);
              onMinPriceChange?.(null);
              onMaxPriceChange?.(null);
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </aside>
  );
}
