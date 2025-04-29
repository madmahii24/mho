import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import React from "react";
import { BsBag } from "react-icons/bs";
import { useDispatch } from "react-redux";

import LikeButton from "@/components/LikeButton";
import productImage from "@/public/assets/images/product_1.webp";
import { addItem,toggleCartSidebar } from "@/store/cartSlice";

const ProductCard: FC<any> = ({ product }) => {
  const dispatch = useDispatch();
  const {
    productName,
    brandName,
    rating,
    sellingPrice,
    categoryId,
    categoryName,
    brandId,
    productId,
    coverImage = productImage
  } = product;
  const handleAddToCart = () => {
    dispatch(
      addItem({
        categoryId,
        categoryName,
        brandId,
        brandName,
        productId,
        productName,
        coverImage,
        rating,
        sellingPrice,
        quantity: 1
      })
    );
    dispatch(toggleCartSidebar())
  };
  return (
    <div className="group relative rounded-2xl p-4 shadow-md transition-all duration-300 hover:shadow-xl bg-white border border-green-50 hover:border-green-100">
      {/* Sale Badge */}
      {product.previousPrice && (
        <div className="absolute left-4 top-4 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
          SALE
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        <LikeButton className="absolute right-3 top-3 z-10 shadow-sm" />
        <Link
          href={`/products/${product.productId}`}
          className="block h-full w-full"
        >
          <Image
            src={productImage || "/placeholder-product.jpg"}
            alt={`${product.productName} cover photo`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            width={350}
            height={350}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+yHgAFWAJc08sB7wAAAABJRU5ErkJggg=="
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="mt-4">
        <div className="mb-2">
          <p className="text-sm font-medium text-green-600">
            {product.categoryName}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-gray-900 line-clamp-2">
            {product.productName}
          </h3>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold text-green-800">
              ₹{product.sellingPrice}
            </p>
            {product.previousPrice && (
              <p className="text-sm text-gray-400 line-through">
                ₹{product.previousPrice}
              </p>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-green-700 hover:shadow-md hover:-translate-y-0.5"
          onClick={handleAddToCart}
          type="button"
        >
          <BsBag /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
