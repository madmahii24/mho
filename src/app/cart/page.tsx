"use client";

import Image from "next/image";
import Link from "next/link";
import { AiOutlineDelete } from "react-icons/ai";
import { MdStar } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import LikeButton from "@/components/LikeButton";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import InputNumber from "@/shared/InputNumber/InputNumber";
import { removeItem } from "@/store/cartSlice";
import type { RootState } from "@/store/store";

const renderProduct = (item: any, dispatch: any) => {
  const {
    categoryName,
    brandName,
    productId,
    productName,
    coverImage,
    rating,
    sellingPrice,
    quantity,
  } = item;

  const handleRemove = () => {
    dispatch(removeItem(productId));
  };

  return (
    <div
      key={productId}
      className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-md shadow transition-all hover:shadow-md"
    >
      <div className="relative w-56 h-56 shrink-0 overflow-hidden rounded-md bg-gray-50">
        <Image
          fill
          src={coverImage}
          alt={productName}
          className="object-cover object-center"
        />
        <Link className="absolute inset-0" href={`/products/${productId}`} />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/products/${productId}`}>
              <h3 className="text-xl font-semibold text-gray-900 hover:text-green-600">
                {productName}
              </h3>
            </Link>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <span>{brandName}</span>
              <span className="mx-1">•</span>
              <span>{categoryName}</span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-600">
              <MdStar className="text-lg text-green-500 mr-1" />
              <span>{rating}</span>
            </div>
          </div>
          <span className="text-xl font-bold text-green-600">₹{sellingPrice}</span>
        </div>

        <div className="flex justify-between items-center border-t border-gray-200 pt-2">
          <div className="flex items-center gap-3">
            <LikeButton />
            <button
              onClick={handleRemove}
              type="button"
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <AiOutlineDelete className="text-2xl" />
            </button>
          </div>
          <InputNumber defaultValue={quantity} productId={productId} />
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.sellingPrice * item.quantity,
    0
  );
  const tax = 0;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-16 lg:px-8 lg:py-20">
        <h2 className="text-4xl font-medium text-gray-900 lg:text-5xl">
          Shopping Cart
        </h2>

        <div className="mt-16 flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-6">
            {cartItems.length > 0 ? (
              cartItems.map((item) => renderProduct(item, dispatch))
            ) : (
              <div className="rounded-md bg-white p-6 text-center text-lg text-gray-500">
                Your cart is empty.
              </div>
            )}
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block lg:w-px lg:bg-gray-200" />

          <div className="lg:w-[400px] lg:pl-8">
            <div className="sticky top-8 rounded-md bg-white p-6 shadow">
              <h3 className="text-2xl font-semibold text-gray-900">
                Order Summary
              </h3>

              <div className="mt-6 space-y-4 text-base">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated tax</span>
                  <span className="font-medium text-gray-900">
                    ₹{tax.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <ButtonSecondary
                className="mt-6 w-full rounded-lg bg-green-600 px-6 py-3 text-center text-lg font-medium text-white transition-colors hover:bg-green-700"
                href="/checkout"
              >
                Proceed to Checkout
              </ButtonSecondary>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
