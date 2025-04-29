"use client";

import { Dialog, Transition } from "@headlessui/react";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaBagShopping } from "react-icons/fa6";
import { MdClose, MdStar } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import InputNumber from "@/shared/InputNumber/InputNumber";
import { removeItem, toggleCartSidebar } from "@/store/cartSlice";
import type { RootState } from "@/store/store";

const CartSideBar: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const isVisible = useSelector(
    (state: RootState) => state.cart.cartSidebarVisible
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSide = () => dispatch(toggleCartSidebar());

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
  };

  const renderProduct = (item: any) => {
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

    return (
      <div
        key={productId}
        className="group flex w-full py-6 last:pb-0 hover:bg-green-50/50 rounded-lg px-3 transition-all duration-300"
      >
        <div className="relative w-20 h-20 md:w-28 md:h-28 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
          <Image
            fill
            src={coverImage}
            alt={productName}
            className="object-contain object-center p-2 transition-transform duration-300 group-hover:scale-105"
          />
          <Link
            onClick={() => toggleSide()}
            className="absolute inset-0"
            href={`/products/${productId}`}
          />
        </div>

        <div className="ml-5 flex flex-1 flex-col justify-between">
          <div>
            <div className="flex justify-between">
              <div className="space-y-1">
                <h3 className="font-medium text-neutral-900 hover:text-green-600 transition-colors">
                  <Link onClick={() => toggleSide()} href={`/products/${productId}`}>
                    {productName}
                  </Link>
                </h3>
                <div className="space-x-2 text-sm text-neutral-500">
                  <span>{brandName}</span>
                  <span>•</span>
                  <span>{categoryName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MdStar className="text-green-500" />
                  <span className="text-sm font-medium">{rating}</span>
                </div>
              </div>
              <span className="font-semibold text-green-600">₹{sellingPrice}</span>
            </div>
          </div>
          <div className="flex w-full items-end justify-between text-sm pt-3">
            <button
              type="button"
              onClick={() => handleRemoveItem(productId)}
              className="flex items-center gap-2 text-neutral-500 hover:text-red-500 transition-colors"
            >
              <AiOutlineDelete className="text-xl" />
              <span className="text-sm">Remove</span>
            </button>
            <div>
              <InputNumber defaultValue={quantity} productId={productId} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <Transition appear show={isVisible} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50"
          onClose={toggleSide}
        >
          <div className="fixed inset-y-0 right-0 w-full max-w-md outline-none focus:outline-none">
            <Transition.Child
              as={Fragment}
              enter="transition duration-200 transform"
              enterFrom="opacity-0 translate-x-full"
              enterTo="opacity-100 translate-x-0"
              leave="transition duration-150 transform"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 translate-x-full"
            >
              <div className="relative z-20 h-full">
                <div className="h-full shadow-xl ring-1 ring-black/5">
                  <div className="flex flex-col h-full bg-white">
                    {/* Header - sticky at top */}
                    <div className="sticky top-0 bg-white z-10 px-6 py-5 border-b border-neutral-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-neutral-900 flex" >
                        <ShoppingCart className="mr-4" size={32} /> Shopping Cart
                        </h3>
                        <button
                          className="rounded-full p-2 hover:bg-neutral-100 transition-colors"
                          type="button"
                          onClick={() => toggleSide()}
                        >
                          <MdClose className="text-2xl text-neutral-500" />
                        </button>
                      </div>
                    </div>

                    {/* Scrollable content - hidden scrollbars on large screens */}
                    <div className="flex-1 pl-2 pr-5 py-5 pb-40 overflow-y-auto scrollbar-hide">
                      <div className="divide-y divide-neutral-200">
                        {cartItems.length > 0 ? (
                          cartItems.map((item) => renderProduct(item))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-16 text-center">
                            <FaBagShopping className="text-5xl text-neutral-300 mb-4" />
                            <p className="text-neutral-500 mb-2">
                              Your cart is empty
                            </p>
                            <ButtonSecondary
                              href="/products"
                              onClick={() => toggleSide()}
                              className="mt-4"
                            >
                              Continue Shopping
                            </ButtonSecondary>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Checkout container - sticky at bottom */}
                    {cartItems.length > 0 && (
                      <div
                        className="sticky bottom-0 left-0 right-0 bg-white p-6 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] border-t border-neutral-200"
                        style={{ 
                          paddingBottom: "max(1.5rem, calc(1.5rem + env(safe-area-inset-bottom)))"
                        }}
                      >
                        <div className="flex justify-between mb-4">
                          <div>
                            <span className="text-lg font-medium text-neutral-900">
                              Subtotal
                            </span>
                            <span className="block text-sm text-neutral-500 mt-0.5">
                              Shipping and taxes calculated at checkout
                            </span>
                          </div>
                          <span className="text-xl font-semibold text-green-600">
                            ₹
                            {cartItems.reduce(
                              (total, item) =>
                                total + item.sellingPrice * item.quantity,
                              0
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <ButtonPrimary
                            href="/checkout"
                            onClick={() => toggleSide()}
                            className="w-full flex-1 bg-green-600 hover:bg-green-700"
                          >
                            Checkout
                          </ButtonPrimary>
                          <ButtonSecondary
                            onClick={() => toggleSide()}
                            className="w-full flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50"
                          >
                            Close
                          </ButtonSecondary>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm" />
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => toggleSide()}
        className="mx-4 flex items-center gap-2 rounded-full sm:bg-green-50 bg-none sm:px-4 sm:py-2 p-2 text-green-600 hover:bg-green-100 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-opacity-75"
      >
        <FaBagShopping className="sm:text-xl text-2xl text-green-800" />
        <span className="text-sm font-medium sm:block hidden">
          {mounted ? `${cartItems.length} items` : "Loading..."}
        </span>
      </button>

      {renderContent()}
    </>
  );
};

// CSS to hide scrollbars but maintain functionality
const globalStyles = `
@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
}
`;

// Add the global styles to the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = globalStyles;
  document.head.appendChild(styleSheet);
}

export default CartSideBar;