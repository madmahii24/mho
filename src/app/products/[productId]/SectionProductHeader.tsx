import { useRouter } from "next/navigation";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
// Add these new icon imports
import { BiCheckShield, BiRecycle } from "react-icons/bi";
import { BsBag } from "react-icons/bs";
import { FaLeaf } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { GiMedicines, GiWeight } from "react-icons/gi";
import {
  MdOutlineHealthAndSafety,
  MdStar,
  MdStarOutline
} from "react-icons/md";
import { PiSealCheckFill } from "react-icons/pi";
import { TbPlant } from "react-icons/tb";
import { useDispatch } from "react-redux";

import Loader from "@/app/loading";
import ImageShowCase from "@/components/ImageShowCase";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import packet from "@/public/assets/images/mho_ws_ps_1.png";
import packet1 from "@/public/assets/images/mho_ws_ps_2.png";
import packet2 from "@/public/assets/images/mho_ws_ps_4.png";
import { addItem } from "@/store/cartSlice";

import type { OptionItem } from "./ProductOptions";

// Define product data interface for type safety
interface ProductSize {
  id: number;
  unitName: string;
  unitNo: number;
  sellingPrice: number;
  maxRetailPrice: number;
}

interface DescriptionPointer {
  id: number;
  heading: string;
  description: string;
}

interface Ingredient {
  id: number;
  name: string;
  description: string;
}

interface ProductData {
  productId: number;
  categoryId: number;
  productName: string;
  brandName: string;
  description: string;
  couponCode: string;
  sellingPrice: number;
  brandId: number;
  categoryName: string;
  isBestSelling: boolean;
  subscriptionValidityDays: number | null;
  status: string;
  quantity: number;
  reviewCount: number;
  rating: number;
  highlyRtdbyCustFor: string;
  productStarLine: string;
  productShortDesc: string;
  oneLineFeedBack: string;
  productQualites: string;
  offerText: string;
  productSizes: ProductSize[];
  prodDescDetailPointers: DescriptionPointer[];
  ingredients: Ingredient[];
  faqs: any[];
}

interface SectionProductHeaderProps {
  item: ProductData;
}

const SectionProductHeader: FC<SectionProductHeaderProps> = ({ item }) => {
  const dispatch = useDispatch();
  const shots = [packet, packet1, packet2]; // This should ideally come from product images
  const Router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showZoomView] = useState(true);

  // Parse product qualities
  const highlightedFeatures = item?.productQualites
    ? item.productQualites.split("|").map((item) => item.trim())
    : [];

  // Generate size options from product sizes
  const sizeOptions: OptionItem[] =
    item?.productSizes?.map((size) => ({
      value: `${size.unitNo}${size.unitName}`,
      label: `${size.unitNo}${size.unitName}`,
      inStock: true
    })) || [];

  // State for selected options
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]?.value || "");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Set loading state to false after data is ready
  useEffect(() => {
    if (item) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [item]);

  // Auto-select the first size option when options change or become available
  useEffect(() => {
    if (
      sizeOptions.length > 0 &&
      (!selectedSize ||
        !sizeOptions.find((option) => option.value === selectedSize))
    ) {
      setSelectedSize(sizeOptions[0]?.value || "");
    }
  }, [sizeOptions, selectedSize]);

  // Find the selected size data
  const selectedSizeData = item?.productSizes?.find(
    (size) => `${size.unitNo}${size.unitName}` === selectedSize
  );

  // Calculate price and discount
  const unitPrice = selectedSizeData?.sellingPrice || item?.sellingPrice;
  const originalPrice = selectedSizeData?.maxRetailPrice;
  // const discount = originalPrice && unitPrice ? originalPrice - unitPrice : 0;

  const handleAddToCart = () => {
    if (!item) return;

    dispatch(
      addItem({
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        brandId: item.brandId,
        brandName: item.brandName,
        productId: item.productId,
        productName: item.productName,
        coverImage: packet, // Should be replaced with actual product image
        rating: item.rating,
        sellingPrice: unitPrice,
        quantity
      })
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    Router.push("/checkout");
  };

  // Quantity handlers
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (item?.quantity && quantity < item.quantity) {
      setQuantity(quantity + 1);
    } else {
      setQuantity(quantity + 1); // When stock data isn't available
    }
  };

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  // Render star ratings with support for half stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Render full stars
    for (let i = 0; i < fullStars; i += 1) {
      stars.push(<MdStar key={`full-${i}`} className="text-green-500" />);
    }

    // Render half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative inline-block">
          <MdStarOutline className="text-gray-300" />
          <div className="absolute top-0 left-0 overflow-hidden w-1/2">
            <MdStar className="text-green-500" />
          </div>
        </div>
      );
    }

    // Render remaining empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i += 1) {
      stars.push(
        <MdStarOutline key={`empty-${i}`} className="text-gray-300" />
      );
    }

    return stars;
  };

  if (!item) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column: Product Image */}
          <div className="bg-white rounded-lg">
            <ImageShowCase shots={shots} showZoomView={showZoomView} />

            {/* Product description - visible only on desktop */}
            <div className="mt-12 hidden md:block px-4 py-4">
              {item.productShortDesc && (
                <div className="mb-5">
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {item.productShortDesc}
                  </p>
                </div>
              )}

              {/* Customer feedback - desktop */}
              {item.oneLineFeedBack && (
                <div className="bg-green-50 p-4 rounded-md mt-4">
                  <p className="text-gray-700 text-sm italic">
                    &ldquo;{item.oneLineFeedBack}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col space-y-5">
            {/* Brand and Product name */}
            {item.productName && (
              <h1 className="text-5xl font-normal text-gray-900">
                {item.productName}
              </h1>
            )}

            {/* Rating and Wishlist */}
            <div className="flex items-center justify-between">
              {item.rating && (
                <div className="flex items-center">
                  <div className="flex mr-2">{renderStars(item.rating)}</div>
                  {item.reviewCount > 0 && (
                    <span className="text-gray-500 text-md font-medium">
                      {item.rating.toFixed(1)} ({item.reviewCount} reviews)
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="flex items-center p-2 rounded-full hover:bg-gray-50"
                type="button"
              >
                <FiHeart
                  className={
                    isWishlisted
                      ? "fill-green-500 text-green-500"
                      : "text-gray-400"
                  }
                  size={20}
                />
              </button>
            </div>

            {/* Highly rated for */}
            {item.highlyRtdbyCustFor && (
              <div className="inline-flex items-center bg-green-50 px-3 py-1.5 rounded-md">
                <PiSealCheckFill className="text-green-600 mr-1.5" size={16} />
                <span className="text-green-700 font-medium text-sm">
                  Highly rated for:{" "}
                  <span className="font-semibold">
                    {item.highlyRtdbyCustFor}
                  </span>
                </span>
              </div>
            )}

            {item.productStarLine && (
              <p className="text-gray-600 text-md font-medium mt-1">
                {item.productStarLine}
              </p>
            )}

            {/* Size Variant Selection - Compact UI */}
            <div className="">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-medium text-gray-700">Size</p>
                {sizeOptions.length > 4 && (
                  <button
                    type="button"
                    className="text-xs text-green-600 hover:underline"
                  >
                    Size Guide
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sizeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`min-w-[48px] px-2 py-1 text-sm rounded-md border transition-all
                      ${
                        selectedSize === option.value
                          ? "border-green-500 bg-green-50 text-green-700 font-medium"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }
                      ${!option.inStock ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handleSizeSelect(option.value)}
                    disabled={!option.inStock}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing - Minimal UI */}
            <div className="border border-gray-200 rounded-md p-3">
              <p className="text-sm font-semibold text-gray-800 mb-2">Price</p>
              <div className="flex flex-wrap items-center gap-2">
                {originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{originalPrice}
                  </span>
                )}
                <span className="text-2xl font-bold text-green-700">
                  ₹{unitPrice}
                </span>
                {item.offerText && (
                  <div className="flex flex-row gap-2  ">
                    <p className="text-[12px] text-gray-400 mt-1">
                      Incl. all taxes
                    </p>
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                      {item.offerText}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity selector */}
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-4">
                Quantity
              </span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <button
                  type="button"
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors border-r border-gray-300"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <span className="text-gray-700 text-xl font-medium">−</span>
                </button>
                <div className="w-16 h-12 flex items-center justify-center bg-white">
                  <span className="text-gray-900 text-lg font-medium">
                    {quantity}
                  </span>
                </div>
                <button
                  type="button"
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors border-l border-gray-300"
                  onClick={increaseQuantity}
                >
                  <span className="text-gray-700 text-xl font-medium">+</span>
                </button>
              </div>
            </div>

            {/* Call to action buttons */}
            <div className="flex gap-3">
              <button
                className="flex-1 py-3 bg-white border border-gray-200 hover:border-gray-300 text-gray-800 rounded-md font-medium transition-all flex items-center justify-center"
                onClick={handleAddToCart}
                type="button"
              >
                <BsBag className="mr-2" size={16} /> Add to Cart
              </button>
              <button
                className="flex-1 py-3 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-all"
                onClick={handleBuyNow}
                type="button"
              >
                Buy Now
              </button>
            </div>

            {/* Product description - visible only on mobile */}
            <div className="mt-8 block md:hidden">
              {item.productShortDesc && (
                <div className="mb-5">
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {item.productShortDesc}
                  </p>
                </div>
              )}

              {/* Customer feedback - mobile */}
              {item.oneLineFeedBack && (
                <div className="bg-green-50 p-4 rounded-md mt-4">
                  <p className="text-gray-700 text-sm italic">
                    &ldquo;{item.oneLineFeedBack}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {highlightedFeatures.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {highlightedFeatures.map((feature, idx) => {
                  // Choose appropriate icon based on feature text
                  let FeatureIcon = BiRecycle; // Default icon

                  if (feature.toLowerCase().includes("natural")) {
                    FeatureIcon = FaLeaf;
                  } else if (feature.toLowerCase().includes("organic")) {
                    FeatureIcon = TbPlant;
                  } else if (
                    feature.toLowerCase().includes("free") ||
                    feature.toLowerCase().includes("no ")
                  ) {
                    FeatureIcon = BiCheckShield;
                  } else if (
                    feature.toLowerCase().includes("weight") ||
                    feature.toLowerCase().includes("light")
                  ) {
                    FeatureIcon = GiWeight;
                  } else if (
                    feature.toLowerCase().includes("safe") ||
                    feature.toLowerCase().includes("health")
                  ) {
                    FeatureIcon = MdOutlineHealthAndSafety;
                  } else if (
                    feature.toLowerCase().includes("eco") ||
                    feature.toLowerCase().includes("sustainable")
                  ) {
                    FeatureIcon = BiRecycle;
                  } else if (
                    feature.toLowerCase().includes("medical") ||
                    feature.toLowerCase().includes("tested")
                  ) {
                    FeatureIcon = GiMedicines;
                  }

                  return (
                    <span
                      key={`feature-${feature.substring(0, 10)}-${idx}`}
                      className="px-4 py-2 text-neutral-900 text-sm rounded-full border flex items-center gap-1"
                      title={feature}
                    >
                      <FeatureIcon className="text-green-600" size={16} />
                      {feature}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Product details accordion */}
            <div className="mt-4 pt-4">
              <Accordion type="single" collapsible className="space-y-1">
                {item.ingredients?.length > 0 && (
                  <AccordionItem value="ingredients">
                    <AccordionTrigger className="text-sm px-2 py-2 hover:bg-gray-50 rounded">
                      Key Ingredients
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600 px-2 py-2">
                      <ul className="space-y-1">
                        {item.ingredients.map((ingredient) => (
                          <li key={ingredient.id}>
                            <span className="font-medium text-gray-700">
                              {ingredient.name}:
                            </span>{" "}
                            {ingredient.description}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {item.prodDescDetailPointers?.map((pointer) => (
                  <AccordionItem
                    key={pointer.id}
                    value={`pointer-${pointer.id}`}
                  >
                    <AccordionTrigger className="text-sm px-2 py-2 hover:bg-gray-50 rounded">
                      {pointer.heading}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600 px-2 py-2">
                      <p>{pointer.description}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionProductHeader;
