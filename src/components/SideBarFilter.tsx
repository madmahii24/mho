"use client";

import "rc-slider/assets/index.css";

import { pathOr } from "ramda";
import Slider from "rc-slider";
import React, { useEffect, useState } from "react";

import {
  getAllBrands,
  getAllCategory,
  getBrandsByCat
} from "@/utils/dataService";

interface Brands {
  id: number;
  categoryId: string;
  brandName: string;
}

interface Categories {
  id: number;
  name: string;
  desription: string;
}

// interface SidebarFiltersProps {
//   activeBrand: Brands | null;
//   setActiveBrand: (brand: Brands | null) => void;
//   activeCategory: Categories | null;
//   setActiveCategory: (category: Categories | null) => void;
// }

const PRICE_RANGE = [1, 50000];

const SidebarFilters: React.FC<any> = ({
  activeBrand,
  setActiveBrand,
  activeCategory,
  setActiveCategory
}) => {
  const [rangePrices, setRangePrices] = useState<[number, number]>([
    100, 10000
  ]);
  const [brands, setBrands] = useState<Brands[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);

  useEffect(() => {
    getAllCategory().then((res: any) => {
      // Ensure we have a valid array
      setCategories(Array.isArray(res) ? res : []);
    }).catch(error => {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    });
    
    if (activeCategory) {
      getBrandsByCat(activeCategory.id).then((res: any) => {
        // Ensure we have a valid array
        setBrands(Array.isArray(res) ? res : []);
      }).catch(error => {
        console.error(`Failed to fetch brands for category ${activeCategory.id}:`, error);
        setBrands([]);
      });
    } else {
      getAllBrands().then((res: any) => {
        // Ensure we have a valid array
        setBrands(Array.isArray(res) ? res : []);
      }).catch(error => {
        console.error("Failed to fetch brands:", error);
        setBrands([]);
      });
    }
  }, [activeCategory]);

  const renderBrandFilters = () => (
    <div className="mb-6">
      <h3 className="mb-3 text-base font-medium text-gray-700">Brands</h3>
      <div className="flex flex-wrap gap-2">
        {brands.map((brand) => (
          <button
            key={brand.id}
            type="button"
            onClick={() => setActiveBrand(brand)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeBrand?.id === brand.id
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {brand.brandName}
          </button>
        ))}
      </div>
    </div>
  );

  const renderCategoryFilters = () => (
    <div className="mb-6">
      <h3 className="mb-3 text-base font-medium text-gray-700">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeCategory?.id === category.id
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );

  const renderPriceFilters = () => (
    <div className="my-6">
      <h3 className="mb-4 text-base font-medium text-gray-700">Price Range</h3>
      <Slider
        range
        min={PRICE_RANGE[0]}
        max={PRICE_RANGE[1]}
        step={1}
        defaultValue={[
          pathOr(0, [0], rangePrices),
          pathOr(0, [1], rangePrices)
        ]}
        allowCross={false}
        onChange={(values) => setRangePrices(values as [number, number])}
        railStyle={{ backgroundColor: "#e5e7eb" }}
        trackStyle={[{ backgroundColor: "#22c55e" }]}
        handleStyle={[
          {
            borderColor: "#22c55e",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)"
          },
          {
            borderColor: "#22c55e",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)"
          }
        ]}
      />
      <div className="mt-4 flex justify-between space-x-4">
        <div className="w-1/2">
          <span className="block text-xs font-medium text-gray-500">Min</span>
          <div className="relative mt-1">
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              ₹
            </span>
            <input
              type="text"
              value={rangePrices[0]}
              disabled
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700"
            />
          </div>
        </div>
        <div className="w-1/2">
          <span className="block text-xs font-medium text-gray-500">Max</span>
          <div className="relative mt-1">
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              ₹
            </span>
            <input
              type="text"
              value={rangePrices[1]}
              disabled
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-medium text-gray-800">Filters</h2>
      <div className="divide-y divide-gray-100">
        {renderCategoryFilters()}
        {renderBrandFilters()}
        {renderPriceFilters()}

        <div className="pt-4">
          <button
            type="button"
            className="w-full rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarFilters;
