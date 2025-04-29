import { useRouter } from "next/navigation";
import type { FC } from "react";
import React, { useEffect,useState } from "react";
import { BsBag, BsShare } from "react-icons/bs";
import { FaLeaf } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdOutlineLocalShipping,MdStar } from "react-icons/md";
import { PiSealCheckFill } from "react-icons/pi";
import { useDispatch } from "react-redux";

import Loader from "@/app/loading";
import ImageShowCase from "@/components/ImageShowCase";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import packet from "@/public/assets/images/product_1.webp";
import packet1 from "@/public/assets/images/product_2.webp";
// import products from "@/public/assets/images/product1.png";
import { addItem } from "@/store/cartSlice";

import type { OptionItem } from "./ProductOptions";
import ProductOptions from "./ProductOptions";

interface SectionProductHeaderProps {
  item: any;
}

// Example size options for banana chips
const sizeOptions: OptionItem[] = [
  { value: "small", label: "100g", inStock: true },
  { value: "medium", label: "250g", inStock: true, price: 150 },
  { value: "large", label: "500g", inStock: true, price: 350 },
  { value: "family", label: "1kg", inStock: false, price: 600 }
];

const SectionProductHeader: FC<SectionProductHeaderProps> = ({ item }) => {
  const dispatch = useDispatch();
  const shots = [packet, packet1];
  const Router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // State for selected options
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]?.value || '');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Set loading state to false after data is ready
  useEffect(() => {
    if (item) {
      // Simulate some loading time for images and data
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
    return () => {}; // Return empty cleanup function when item is falsy
  }, [item]);

  // Use item data or fallback to banana chips mock data if not available
  const productData = {
    productName: item?.productName || "Organic Banana Chips",
    brandName: item?.brandName || "Nature's Delight",
    rating: item?.rating || 4.8,
    reviews: item?.reviews || 54,
    piecesSold: item?.piecesSold || 1250,
    sellingPrice: item?.sellingPrice || 299,
    categoryId: item?.categoryId || "snacks-001",
    categoryName: item?.categoryName || "Healthy Snacks",
    brandId: item?.brandId || "nature-001",
    productId: item?.productId || "banana-chips-001",
    coverImage: item?.coverImage || packet
  };

  // Calculate final price based on selected options
  const calculateFinalPrice = () => {
    const basePrice = productData.sellingPrice;
    
    // Add size price if applicable
    const selectedSizeOption = sizeOptions.find(
      (option) => option.value === selectedSize
    );
    
    return selectedSizeOption?.price 
      ? basePrice + selectedSizeOption.price 
      : basePrice;
  };

  const unitPrice = calculateFinalPrice();
  const totalPrice = unitPrice * quantity;
  
  // Calculate original price (20% higher than unit price for more realistic discount)
  const originalPrice = Math.round(unitPrice * 1.2);
  const discount = originalPrice - unitPrice;
  const discountPercentage = Math.round((discount / originalPrice) * 100);

  const handleAddToCart = () => {
    // Get selected size information
    // const selectedSizeOption = sizeOptions.find(option => option.value === selectedSize);
    
    dispatch(
      addItem({
        categoryId: productData.categoryId,
        categoryName: productData.categoryName,
        brandId: productData.brandId,
        brandName: productData.brandName,
        productId: productData.productId,
        productName: productData.productName,
        coverImage: productData.coverImage,
        rating: productData.rating,
        sellingPrice: productData.sellingPrice,
        quantity,
        
      })
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    Router.push("/checkout");
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Add actual wishlist functionality here
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: productData.productName,
        text: `Check out ${productData.productName} from ${productData.brandName}!`,
        url: window.location.href,
      })
      .catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers without navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          // Replace alert with a more UI-friendly approach
          const notification = document.createElement('div');
          notification.textContent = 'Link copied to clipboard!';
          notification.style.position = 'fixed';
          notification.style.bottom = '20px';
          notification.style.left = '50%';
          notification.style.transform = 'translateX(-50%)';
          notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          notification.style.color = 'white';
          notification.style.padding = '10px 20px';
          notification.style.borderRadius = '4px';
          notification.style.zIndex = '9999';
          document.body.appendChild(notification);
          
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 2000);
        })
        .catch(err => console.error('Could not copy text: ', err));
    }
  };

  // Calculate estimated delivery
  // const getEstimatedDelivery = () => {
  //   const today = new Date();
  //   const deliveryDate = new Date(today);
  //   deliveryDate.setDate(today.getDate() + 4); // Delivery in 4 days
  //   return deliveryDate.toLocaleDateString('en-US', { 
  //     month: 'short', 
  //     day: 'numeric' 
  //   });
  // };

  // Quantity handlers
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="sticky top-24">
              <ImageShowCase shots={shots} />
            </div>

            <div className="flex flex-col">
              {/* Product tags - keep only the most important ones */}
              <div className="flex gap-2 mb-3">
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Organic</span>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Vegan</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {productData.productName}
              </h1>
              
              {/* Simplified brand and rating section */}
              <div className="flex items-center mb-6">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">
                    {productData.brandName}
                  </span>
                  <PiSealCheckFill className="text-blue-600" />
                </div>
                <div className="mx-4 h-5 w-px bg-gray-200" />
                <div className="flex items-center gap-1">
                  <MdStar className="text-yellow-400" />
                  <p className="text-sm">
                    <span className="font-medium">{productData.rating}</span>{" "}
                    <span className="text-gray-500">({productData.reviews})</span>
                  </p>
                </div>
              </div>

              {/* Simplified price display section */}
              <div className="mb-8 p-5 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center mb-2">
                  <h2 className="text-3xl font-semibold text-gray-900">
                    ₹{totalPrice}
                  </h2>
                  {discount > 0 && (
                    <>
                      <p className="ml-3 text-gray-500 line-through">
                        ₹{originalPrice * quantity}
                      </p>
                      <span className="ml-2 text-xs font-medium px-2 py-0.5 bg-red-100 text-red-600 rounded">
                        {discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
                
                {quantity > 1 && (
                  <p className="text-sm text-gray-500">
                    ₹{unitPrice} per item × {quantity} items
                  </p>
                )}
                
                <div className="flex items-center gap-2 mt-3 text-green-600">
                  <MdOutlineLocalShipping className="text-lg" />
                  <p className="text-sm font-medium">
                    Free shipping on orders above ₹499
                  </p>
                </div>
              </div>

              {/* Size options */}
              <ProductOptions
                optionName="Size"
                options={sizeOptions}
                selectedOption={selectedSize}
                onChange={setSelectedSize}
              />

              {/* Quantity selector */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quantity</h3>
                <div className="flex items-center">
                  <button
                    type="button"
                    className="w-10 h-10 rounded-l-lg bg-gray-100 border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <span className="text-xl font-medium">-</span>
                  </button>
                  <div className="w-16 h-10 border-t border-b border-gray-300 flex items-center justify-center">
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-r-lg bg-gray-100 border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    onClick={increaseQuantity}
                  >
                    <span className="text-xl font-medium">+</span>
                  </button>
                </div>
              </div>

              {/* Simplified product benefits - keep only 2 most important ones */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <FaLeaf className="text-green-500 text-xl mr-3" />
                  <span className="text-sm text-gray-600">100% Organic</span>
                </div>
                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <MdOutlineLocalShipping className="text-green-500 text-xl mr-3" />
                  <span className="text-sm text-gray-600">Fast Delivery</span>
                </div>
              </div>

              {/* Simplified action buttons - 2 columns instead of 3 */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  className="w-full rounded-lg bg-green-600 hover:bg-green-700 transition-all py-3.5 text-white font-medium shadow-sm"
                  onClick={handleBuyNow}
                  type="button"
                >
                  Buy Now
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-green-600 py-3.5 text-green-600 hover:bg-green-50 transition-all font-medium"
                  onClick={handleAddToCart}
                >
                  <BsBag /> Add to cart
                </button>
              </div>
              
              {/* Simplified wishlist and share options as a row */}
              <div className="flex justify-between mb-8">
                <button
                  type="button"
                  className={`flex items-center gap-1.5 text-sm transition-colors
                    ${isWishlisted 
                      ? 'text-red-500' 
                      : 'text-gray-600 hover:text-gray-900'}`}
                  onClick={handleWishlist}
                >
                  <FiHeart className={isWishlisted ? "fill-red-500" : ""} /> 
                  {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                </button>
                
                <button
                  type="button"
                  onClick={handleShareProduct}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <BsShare /> Share
                </button>
              </div>

              <Accordion
                type="single"
                collapsible
                className="border-t border-gray-200 pt-6"
              >
                <AccordionItem
                  value="item-1"
                  className="border-b border-gray-200 pb-2"
                >
                  <AccordionTrigger className="text-base font-medium py-2">
                    Product Description
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    <p className="mb-3">
                      Our crunchy banana chips are made from freshly harvested, organic
                      bananas that are sliced and gently fried to perfection. Each bite
                      delivers the authentic sweetness of ripe bananas with a satisfying
                      crunch.
                    </p>
                    <p>
                      Perfect for snacking, lunch boxes, or as a topping for
                      your smoothie bowls and desserts. Made with no artificial flavors,
                      preservatives, or added sugars - just pure banana goodness!
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem
                  value="item-2"
                  className="border-b border-gray-200 pb-2"
                >
                  <AccordionTrigger className="text-base font-medium py-2">
                    Nutritional Information
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <div className="space-y-2">
                      <p className="font-medium">Per 100g serving:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>Calories: 410 kcal</div>
                        <div>Protein: 2.3g</div>
                        <div>Carbohydrates: 58.6g</div>
                        <div>Fat: 18.2g</div>
                        <div>Fiber: 5.8g</div>
                        <div>Sugar: 34.2g</div>
                      </div>
                      <div className="mt-3 flex items-center text-xs text-amber-600 gap-1">
                        <IoMdInformationCircleOutline className="text-base" />
                        <span>Values may vary slightly between batches</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem
                  value="item-3"
                  className="border-b border-gray-200 pb-2"
                >
                  <AccordionTrigger className="text-base font-medium py-2">
                    Shipping Information
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li>Free shipping on orders above ₹499</li>
                      <li>Ships within 24 hours on business days</li>
                      <li>Typical delivery time: 3-5 business days</li>
                      <li>Secure packaging ensures freshness</li>
                      <li>Track your order through our app or website</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem
                  value="item-4"
                  className="border-b border-gray-200 pb-2"
                >
                  <AccordionTrigger className="text-base font-medium py-2">
                    Returns & Refunds
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <p className="mb-3">
                      We want you to be completely satisfied with your purchase. If you&apos;re not happy with your order for any reason, please contact our customer service team within 7 days of receiving your product.
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li>Damaged or defective products eligible for full refund or replacement</li>
                      <li>Products must be in original packaging</li>
                      <li>Refunds processed within 5-7 business days</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
      )}
    </div>
  );
};

export default SectionProductHeader;
