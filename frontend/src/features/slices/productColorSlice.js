import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices'
const token = window.localStorage.getItem('token');
const axiosConfig ={
  headers: {
    'Authorization': 'Bearer ' + token // Sử dụng Bearer authentication token ở đây
}// Sử dụng Bearer authentication token ở đây
}
export const getProductColors = createAsyncThunk('productColors/getProductColors', async () => {
  const response = await config.get('/product-colors');
  return response.data;
});

export const createProductColor = createAsyncThunk('productColors/createProductColor', async (color) => {
  const response = await config.post('/product-colors', color,axiosConfig);
  return response.data;
});

export const updateProductColor = createAsyncThunk('productColors/updateProductColor', async (color) => {
  const response = await config.put(`/product-colors/update`, color,axiosConfig);
  return response.data;
});

export const deleteProductColor = createAsyncThunk('productColors/deleteProductColor', async (id) => {
  await config.delete(`/product-colors/${id}`,axiosConfig);
  return id;
});

const productColorSlice = createSlice({
  name: 'productColors',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductColors.fulfilled, (state, action) => action.payload)
      .addCase(createProductColor.fulfilled, (state, action) => [...state, action.payload])
      .addCase(updateProductColor.fulfilled, (state, action) =>
        state.map((color) => (color.id === action.payload.id ? action.payload : color))
      )
      .addCase(deleteProductColor.fulfilled, (state, action) =>
        state.filter((color) => color.id !== action.payload)
      );
  },
});

export default productColorSlice.reducer;
