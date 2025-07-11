import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices';

const token = window.localStorage.getItem('token');
const axiosConfig = {
  headers: {
    'Authorization': 'Bearer ' + token
  }
};

export const fetchOrderDetails = createAsyncThunk('orderDetails/fetchOrderDetails', async () => {
  const response = await config.get('/order-details', axiosConfig);
  return response.data;
});

export const addOrderDetail = createAsyncThunk('orderDetails/addOrderDetail', async (orderDetail) => {
  const response = await config.post('/order-details', orderDetail, axiosConfig);
  return response.data;
});

export const updateOrderDetail = createAsyncThunk('orderDetails/updateOrderDetail', async ({ id, orderDetail }) => {
  const response = await config.put(`/order-details/${id}`, orderDetail, axiosConfig);
  return response.data;
});

export const deleteOrderDetail = createAsyncThunk('orderDetails/deleteOrderDetail', async (id) => {
  await config.delete(`/order-details/${id}`, axiosConfig);
  return id;
});

const orderDetailSlice = createSlice({
  name: 'orderDetail',
  initialState: {
    orderDetails: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload || [];
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.orderDetails = [];
      })
      .addCase(addOrderDetail.fulfilled, (state, action) => {
        state.orderDetails.push(action.payload);
      })
      .addCase(updateOrderDetail.fulfilled, (state, action) => {
        const index = state.orderDetails.findIndex((od) => od.orderDetailId === action.payload.orderDetailId);
        if (index !== -1) {
          state.orderDetails[index] = action.payload;
        }
      })
      .addCase(deleteOrderDetail.fulfilled, (state, action) => {
        state.orderDetails = state.orderDetails.filter((od) => od.orderDetailId !== action.payload);
      });
  },
});

export default orderDetailSlice.reducer;