import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices';

const token = window.localStorage.getItem('token');
const axiosConfig = {
  headers: {
    'Authorization': `Bearer ${token}`
  },
  timeout: 5000 // Increase timeout to 5 seconds to avoid timeout errors
};

const normalizeStatus = (status) => {
  if (!status) return 'PENDING'; // Default to PENDING if status is missing
  const normalized = status.toUpperCase();
  const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'CANCELLED'];
  return validStatuses.includes(normalized) ? normalized : 'PENDING';
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    console.log('JWT Token:', token);
    console.log('Fetching URL:', config.defaults.baseURL + '/orders');
    const response = await config.get('/orders', axiosConfig);
    console.log('Fetched orders:', response.data);
    // Normalize status in the response
    const normalizedOrders = response.data.map(order => ({
      ...order,
      status: normalizeStatus(order.status),
    }));
    return normalizedOrders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    if (error.code === 'ECONNABORTED') {
      return rejectWithValue('Request timed out. Please check if the backend server is running or increase the timeout.');
    } else if (error.response) {
      if (error.response.status === 403) {
        return rejectWithValue('Access denied. Please check your authentication credentials or permissions.');
      } else if (error.response.status === 401) {
        return rejectWithValue('Unauthorized. Please log in again.');
      }
    }
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await config.get(`/order-details?orderId=${orderId}`, axiosConfig);
      console.log('Fetched order details:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addOrder = createAsyncThunk('orders/addOrder', async (order, { rejectWithValue }) => {
  try {
    const response = await config.post('/orders', order, axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateOrder = createAsyncThunk('orders/updateOrder', async ({ id, order }, { rejectWithValue }) => {
  try {
    const response = await config.put(`/orders/${id}`, order, axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (id, { rejectWithValue }) => {
  try {
    await config.delete(`/orders/${id}`, axiosConfig);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    filteredOrders: [],
    statusFilter: 'PENDING',
    loading: false,
    error: null,
  },
  reducers: {
    setStatusFilter: (state, action) => {
      const newFilter = normalizeStatus(action.payload);
      state.statusFilter = newFilter;
      state.filteredOrders = state.orders.filter(
        (order) => normalizeStatus(order.status) === newFilter
      );
      console.log('Status filter set to:', newFilter);
      console.log('Filtered orders:', state.filteredOrders);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload || [];
        state.filteredOrders = state.orders.filter(
          (order) => normalizeStatus(order.status) === state.statusFilter
        );
        console.log('Orders fetched:', state.orders);
        console.log('Filtered orders updated:', state.filteredOrders);
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch orders';
        state.orders = [];
        state.filteredOrders = [];
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
        if (action.payload.status.toUpperCase() === state.statusFilter.toUpperCase()) {
          state.filteredOrders.push(action.payload);
        }
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex((ord) => ord.orderId === action.payload.orderId);
        if (index !== -1) {
          state.orders[index] = action.payload;
          state.filteredOrders = state.orders.filter(order =>
            order.status.toUpperCase() === state.statusFilter.toUpperCase()
          ) || [];
        }
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((ord) => ord.orderId !== action.payload);
        state.filteredOrders = state.orders.filter(order =>
          order.status.toUpperCase() === state.statusFilter.toUpperCase()
        ) || [];
      });
  },
});

export const { setStatusFilter } = orderSlice.actions;
export default orderSlice.reducer;