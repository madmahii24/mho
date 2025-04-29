"use client";

import { useEffect, useState } from "react";

import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { getAllBestSellingProducts } from "@/utils/dataService";

const defaultSort = "relevance";

const BestSellers = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRangeBounds, setPriceRangeBounds] = useState([0, 1000]);
  // const [filters, setFilters] = useState({
  //   brand: "all",
  //   category: "all",
  //   priceRange: [0, 1000],
  // });
  const [modalFilters, setModalFilters] = useState({
    brand: "all",
    category: "all",
    priceRange: [0, 1000],
  });
  const [sortOrder, setSortOrder] = useState(defaultSort);

  // Fetch filtered data from the backend.
  const fetchFilteredData = async () => {
    setIsLoading(true);
    try {
      const res = await getAllBestSellingProducts();
      // Ensure we have a valid array
      setData(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Failed to fetch filtered data:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // On initial mount, fetch all data and determine price bounds.
  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      try {
        const res = await getAllBestSellingProducts();
        
        // Ensure res is a valid array
        if (!Array.isArray(res)) {
          console.error("Expected array but got:", typeof res);
          setData([]);
          setPriceRangeBounds([0, 1000]);
          setModalFilters({
            brand: "all",
            category: "all",
            priceRange: [0, 1000],
          });
          return;
        }
        
        setData(res);
        
        // Safely extract prices with validation
        const prices = res
          .map(prod => {
            const price = parseFloat(prod.price);
            return Number.isNaN(price) ? 0 : price;
          })
          .filter(price => Number.isFinite(price));
        
        // Set default bounds if no valid prices
        if (prices.length === 0) {
          setPriceRangeBounds([0, 1000]);
        } else {
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRangeBounds([minPrice, maxPrice]);
        }
        
        const bounds = prices.length > 0 
          ? [Math.min(...prices), Math.max(...prices)]
          : [0, 1000];
          
        const defaultFilters = {
          brand: "all",
          category: "all",
          priceRange: bounds,
        };
        setModalFilters(defaultFilters);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        setData([]);
        setPriceRangeBounds([0, 1000]);
      } finally {
        setIsLoading(false);
      }
    };
    initialFetch();
  }, []);

  // Handle sort order change.
  const handleSortChange = async (val: string) => {
    setSortOrder(val);
    await fetchFilteredData();
  };

  // Apply modal filters.
  const applyFilters = async () => {
    // setFilters(modalFilters);
    await fetchFilteredData();
  };

  // Global reset to default filters and sort order.
  const resetAll = async () => {
    const defaultFiltersObj = {
      brand: "all",
      category: "all",
      priceRange: priceRangeBounds,
    };
    // setFilters(defaultFiltersObj);
    setModalFilters(defaultFiltersObj);
    setSortOrder(defaultSort);
    await fetchFilteredData();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Our Best Selling Products</h1>

      {/* Sort and Filter Controls */}
      <div className="flex items-center gap-4 mb-6">
        <Select value={sortOrder} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="asc">Price: Low to High</SelectItem>
            <SelectItem value="desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Filters</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 my-4">
              {/* Brand Filter */}
              <Select
                value={modalFilters.brand}
                onValueChange={(val) =>
                  setModalFilters((prev) => ({ ...prev, brand: val }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  <SelectItem value="BrandA">Brand A</SelectItem>
                  <SelectItem value="BrandB">Brand B</SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select
                value={modalFilters.category}
                onValueChange={(val) =>
                  setModalFilters((prev) => ({ ...prev, category: val }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Range Slider */}
              <div>
                <p>
                  Price Range: &#8377;{modalFilters.priceRange[0]} - &#8377;
                  {modalFilters.priceRange[1]}
                </p>
                <Slider
                  value={modalFilters.priceRange}
                  onValueChange={(val) =>
                    setModalFilters((prev) => ({ ...prev, priceRange: val }))
                  }
                  min={priceRangeBounds[0]}
                  max={priceRangeBounds[1]}
                  step={1}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={applyFilters}>Apply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button onClick={resetAll} variant="destructive">
          Reset All
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`skeleton-item-${index}-${Date.now()}`} className="h-[450px] w-full" />
          ))
        ) : data.length > 0 ? (
          data.map((product) => (
            <ProductCard 
              key={product.slug || product.id || product.productId || `product-${product.productName || product.name}`} 
              product={product} 
            />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default BestSellers;
