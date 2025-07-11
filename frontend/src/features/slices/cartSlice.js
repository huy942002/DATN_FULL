import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const CART_COOKIE_NAME = 'cart';
const CART_EXPIRY_DAYS = 30;

const loadCartFromCookie = () => {
  const cartData = Cookies.get(CART_COOKIE_NAME);
  return cartData ? JSON.parse(cartData) : [];
};

const saveCartToCookie = (items) => {
  Cookies.set(CART_COOKIE_NAME, JSON.stringify(items), { expires: CART_EXPIRY_DAYS });
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromCookie(),
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        item => item.productId === action.payload.productId && item.productDetailsId === action.payload.productDetailsId
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      saveCartToCookie(state.items);
    },
    removeFromCart: (state, action) => {
      const { productId, productDetailsId } = action.payload;
      state.items = state.items.filter(
        item => !(item.productId === productId && item.productDetailsId === productDetailsId)
      );
      saveCartToCookie(state.items);
    },
    updateCartItemQuantity: (state, action) => {
      const { productId, productDetailsId, quantity } = action.payload;
      const item = state.items.find(
        item => item.productId === productId && item.productDetailsId === productDetailsId
      );
      if (item) {
        item.quantity = quantity;
      }
      saveCartToCookie(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToCookie(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;