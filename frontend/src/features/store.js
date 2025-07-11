import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import productColorReducer from "./slices/productColorSlice";
import materialReducer from './slices/materialSlice';
import employeeReducer from './slices/employeeSlice';
import customersReducer from './slices/customersSlice';
import productsReducer from './slices/productSlice';
import discountReducer from './slices/discountSlice';
import woodTypeReducer from './slices/woodTypeSlice';

import categoryReducer from "./slices/categorySlice";
import functionReducer from './slices/functionSlice';
import styleReducer from './slices/styleSlice';
import locationReducer from './slices/locationSlice';
import craftingTechniqueReducer from './slices/craftingTechniqueSlice';
import priceRangeReducer from './slices/priceRangeSlice';
import furnitureTypeReducer from './slices/furnitureTypeSlice';
import productImageReducer from './slices/productImageSlice';
import productDetailsReducer from "./slices/productDetailSlice";
import homeReducer from "./slices/homeSlice";
import cartReducer from "./slices/cartSlice"
import searchReducer from './slices/searchSlice';
import orderReducer from './slices/orderSlice';
import invoiceReducer from './slices/invoiceSlice';
import orderDetailReducer from './slices/orderDetailSlice';
import supplierReducer from './slices/supplierSlice';

const reducer = combineReducers({
  category: categoryReducer,
  productColors: productColorReducer,
  material: materialReducer,
  employee: employeeReducer,
  customers: customersReducer,
  products: productsReducer,
  discounts: discountReducer,
  functions: functionReducer,
  styles: styleReducer,
  woodTypes: woodTypeReducer,
  locations: locationReducer,
  craftingTechniques: craftingTechniqueReducer,
  priceRanges: priceRangeReducer,
  furnitureTypes: furnitureTypeReducer,
  productImages: productImageReducer,
  productDetailsReducer: productDetailsReducer,
  home: homeReducer, // Thay products và slides bằng home
  cart: cartReducer,
  search: searchReducer,
  order: orderReducer,
  invoice: invoiceReducer,
  orderDetail: orderDetailReducer,
  suppliers: supplierReducer,
});
const store = configureStore({
  reducer,
});
export default store;
