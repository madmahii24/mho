/* eslint-disable no-param-reassign */

import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { StaticImageData } from "next/image";

interface CartItem {
  categoryId: number | string;
  categoryName: string;
  brandId: string | number;
  brandName: string;
  productId: string | number;
  productName: string;
  coverImage: StaticImageData | string;
  rating: number;
  sellingPrice: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  cartSidebarVisible: boolean;
}

const CART_STORAGE_KEY = "cartItems";

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  }
  return [];
};

const saveCartToStorage = (cartItems: CartItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  cartSidebarVisible: false
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const itemIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId
      );
      if (itemIndex !== -1) {
        // Use non-null assertion since we confirmed the index exists
        state.items[itemIndex]!.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      saveCartToStorage(state.items);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
      saveCartToStorage(state.items);
    },
    clearCart(state) {
      state.items = [];
      saveCartToStorage(state.items);
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string | number; quantity: number }>
    ) {
      const { productId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) => item.productId === productId
      );

      if (itemIndex !== -1) {
        if (quantity > 0) {
          // Use non-null assertion since index is confirmed
          state.items[itemIndex]!.quantity = quantity;
        } else {
          state.items.splice(itemIndex, 1);
        }
      }
      saveCartToStorage(state.items);
    },
    toggleCartSidebar: (state) => {
      state.cartSidebarVisible = !state.cartSidebarVisible;
    }
  }
});

export const {
  addItem,
  removeItem,
  clearCart,
  updateQuantity,
  toggleCartSidebar
} = cartSlice.actions;

export default cartSlice.reducer;
