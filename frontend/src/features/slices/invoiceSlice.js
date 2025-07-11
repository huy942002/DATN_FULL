import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices';

const token = window.localStorage.getItem('token');
const axiosConfig = {
  headers: {
    'Authorization': 'Bearer ' + token
  }
};

export const fetchInvoices = createAsyncThunk('invoices/fetchInvoices', async () => {
  const response = await config.get('/invoices', axiosConfig);
  return response.data;
});

export const addCustomerInvoice = createAsyncThunk('invoices/addCustomerInvoice', async (invoice) => {
  const response = await config.post('/invoices', invoice);
  return response.data;
});

export const addInvoice = createAsyncThunk('invoices/addInvoice', async (invoice) => {
  const response = await config.post('/invoices', invoice, axiosConfig);
  return response.data;
});

export const updateInvoice = createAsyncThunk('invoices/updateInvoice', async ({ id, invoice }) => {
  const response = await config.put(`/invoices/${id}`, invoice, axiosConfig);
  return response.data;
});

export const deleteInvoice = createAsyncThunk('invoices/deleteInvoice', async (id) => {
  await config.delete(`/invoices/${id}`, axiosConfig);
  return id;
});

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: {
    invoices: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload || [];
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.invoices = [];
      })
      .addCase(addInvoice.fulfilled, (state, action) => {
        state.invoices.push(action.payload);
      })
      .addCase(addCustomerInvoice.fulfilled, (state, action) => {
        state.invoices.push(action.payload);
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        const index = state.invoices.findIndex((inv) => inv.invoiceId === action.payload.invoiceId);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter((inv) => inv.invoiceId !== action.payload);
      });
  },
});

export default invoiceSlice.reducer;