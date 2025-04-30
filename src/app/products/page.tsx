"use client";

import React, { useEffect, useState } from "react";
import { LuFilter } from "react-icons/lu";
import { MdOutlineFilterList, MdSearch } from "react-icons/md";

import ProductCard from "@/components/ProductCard";
import SidebarFilters from "@/components/SideBarFilter";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Input from "@/shared/Input/Input";
import {
  getAllBestSellingProductsByBrand,
  getProductByBrandId
} from "@/utils/dataService";
// Define your types
interface Brand {
  id: string;
  brandName: string;
}



const Page: React.FC = () => {
  const [activeBrand, setActiveBrand] = useState<Brand>({
    id: "1",
    brandName: "All"
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]); // start with an empty array
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);

  useEffect(() => {
    if (activeBrand.brandName === "All") {
      getAllBestSellingProductsByBrand().then((res: any) => {
        setProducts(res);
      });
    } else {
      getProductByBrandId(activeBrand.id).then((res: any) => {
        setProducts(res);
      });
    }
  }, [activeBrand]);

  return (
    <main className="container mx-auto py-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <LuFilter className="text-green-600" />
            <span>{isFilterVisible ? "Hide Filters" : "Show Filters"}</span>
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`lg:block lg:w-64 ${isFilterVisible ? "block" : "hidden"}`}
        >
          <SidebarFilters
            activeBrand={activeBrand}
            setActiveBrand={setActiveBrand}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </aside>

        {/* Main Content */}
        <section className="flex-1">
          {/* Search and Sort Bar */}
          <div className="mb-6 flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 px-3">
              <MdSearch className="text-xl text-gray-400" />
              <Input
                type="text"
                rounded="rounded-lg"
                placeholder="Search products..."
                sizeClass="h-10 py-2"
                className="w-full border-0 bg-transparent placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <ButtonSecondary className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                <MdOutlineFilterList className="text-green-600" />
                Most Popular
              </ButtonSecondary>
            </div>
          </div>

          {/* Products Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-800">
              {activeBrand.brandName !== "All"
                ? `${activeBrand.brandName} Products`
                : "All Products"}
            </h2>
            <p className="text-sm text-gray-500">
              {products.length ? `${products.length} products` : "Loading..."}
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.length > 0
              ? products.map((product,index) => (
                  <ProductCard key={`Product_key-${index}`}product={product} />
                ))
              : Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`product-skeleton-${index}`}
                    className="h-64 animate-pulse rounded-lg bg-gray-100"
                  />
                ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Page;
