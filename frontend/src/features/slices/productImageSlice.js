import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices';

const token = window.localStorage.getItem('token');
const axiosConfig = {
  headers: {
    Authorization: 'Bearer ' + token,
  },
};

export const fetchProductImages = createAsyncThunk(
  'productImages/fetchProductImages',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await config.get(`/product-images/product/${productId}`);
      const productImages = Array.isArray(response.data) ? response.data : response.data.data || [];
      return productImages;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProductImage = createAsyncThunk(
  'productImages/deleteProductImage',
  async (id, { rejectWithValue }) => {
    try {
      const response = await config.delete(`/api/product-images/${id}`, {}, axiosConfig);
      if (!response.ok) throw new Error('Failed to delete image');
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productImageSlice = createSlice({
  name: 'productImages',
  initialState: {
    images: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    // Add reset action
    resetProductImages(state) {
      state.images = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductImages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductImages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.images = action.payload;
      })
      .addCase(fetchProductImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteProductImage.fulfilled, (state, action) => {
        state.images = state.images.filter((image) => image.imageId !== action.payload);
      })
      .addCase(deleteProductImage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Export the reset action
export const { resetProductImages } = productImageSlice.actions;
export default productImageSlice.reducer;