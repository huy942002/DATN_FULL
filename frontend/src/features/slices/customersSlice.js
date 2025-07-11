import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices';
const token = window.localStorage.getItem('token');
const axiosConfig = {
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchCustomerById',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await config.get(`/customers/${customerId}`, axiosConfig);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch all customers when the app starts
export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async () => {
  const response = await config.get("/customers", axiosConfig);
  return response.data;
});

export const addCustomer = createAsyncThunk('customers/addCustomer', async (customer) => {
  const response = await config.post("/customers", customer, axiosConfig);
  return response.data;
});

export const updateCustomer = createAsyncThunk('customers/updateCustomer', async ({ id, customer }) => {
  const response = await config.put(`/customers/${id}`, customer, axiosConfig);
  return response.data;
});

export const deleteCustomer = createAsyncThunk('customers/deleteCustomer', async (id) => {
  await config.delete(`/customers/${id}`, axiosConfig);
  return id;
});

export const fetchCustomersByIds = createAsyncThunk(
  'customers/fetchCustomersByIds',
  async (customerIds, { rejectWithValue }) => {
    try {
      const response = await config.post('/customers/by-ids', customerIds, axiosConfig);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    customersById: {}, // Lưu trữ khách hàng theo customerId
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload || [];
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.customers = [];
      })
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.customers[action.payload.id] = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCustomersByIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomersByIds.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.forEach((customer) => {
          state.customers[customer.id] = customer;
        });
      })
      .addCase(fetchCustomersByIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex((cust) => cust.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter((cust) => cust.id !== action.payload);
      });
  },
});

export default customersSlice.reducer;