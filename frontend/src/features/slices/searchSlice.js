import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSearchResults = createAsyncThunk('search/fetchSearchResults', async ({
  page = 0,
  size = 20,
  productName = "",
  description = "",
  price = "",
  weight = "",
  dimensions = "",
  styleId = "",
  woodTypeId = "",
  techniqueId = "",
  priceRangeId = "",
  productStatus = "",
  ratingCount = "",
  discountedPrice = "",
  furnitureTypeId = "",
  locationId = "",
  functionId = "",
  discountType = "",
  discountValue = "",
  discountStartDate = "",
  discountEndDate = "",
  discountIsActive = "",
}) => {
  try {
    const params = { page, size };
    if (productName) params.productName = productName;
    if (description) params.description = description;
    if (price) params.price = price;
    if (weight) params.weight = weight;
    if (dimensions) params.dimensions = dimensions;
    if (styleId) params.styleId = styleId;
    if (woodTypeId) params.woodTypeId = woodTypeId;
    if (techniqueId) params.techniqueId = techniqueId;
    if (priceRangeId) params.priceRangeId = priceRangeId;
    if (productStatus) params.productStatus = productStatus;
    if (ratingCount) params.ratingCount = ratingCount;
    if (discountedPrice) params.discountedPrice = discountedPrice;
    if (furnitureTypeId) params.furnitureTypeId = furnitureTypeId;
    if (locationId) params.locationId = locationId;
    if (functionId) params.functionId = functionId;
    if (discountType) params.discountType = discountType;
    if (discountValue) params.discountValue = discountValue;
    if (discountStartDate) params.discountStartDate = discountStartDate;
    if (discountEndDate) params.discountEndDate = discountEndDate;
    if (discountIsActive) params.discountIsActive = discountIsActive;

    const response = await axios.get('http://localhost:8080/api/search/products', { params });
    return { 
      products: response.data.content || [], 
      totalPages: response.data.totalPages || 1, 
      currentPage: page 
    };
  } catch (error) {
    throw new Error(`Failed to fetch search results: ${error.message}`);
  }
});

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    products: [],
    pagination: { totalPages: 1, currentPage: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.products = [];
      state.pagination = { totalPages: 1, currentPage: 0 };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination.totalPages = action.payload.totalPages;
        state.pagination.currentPage = action.payload.currentPage;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;