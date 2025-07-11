import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices';

const token = window.localStorage.getItem('token');
const axiosConfig = {
  headers: {
    'Authorization': 'Bearer ' + token
  }
};

const initialState = {
  discounts: [],
  appliedDiscounts: [],
  status: 'idle',
  error: null,
  totalPages: 0,
  currentPage: 0
};

export const fetchDiscounts = createAsyncThunk('discounts/fetchDiscounts', async ({ page, size }, { rejectWithValue }) => {
  try {
    const response = await config.get(`/discounts?page=${page}&size=${size}`);
    if (!response.data || !Array.isArray(response.data.content)) {
      return {
        content: [],
        totalPages: 0,
        currentPage: page
      };
    }
    return {
      content: response.data.content,
      totalPages: response.data.totalPages || 0,
      currentPage: response.data.number || page
    };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch discounts');
  }
});

export const createDiscount = createAsyncThunk('discounts/createDiscount', async (discount, { rejectWithValue }) => {
  try {
    const response = await config.post('/discounts', discount, axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create discount');
  }
});

export const updateDiscount = createAsyncThunk('discounts/updateDiscount', async (discount, { rejectWithValue }) => {
  try {
    const response = await config.put('/discounts/update', discount, axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update discount');
  }
});

export const deleteDiscount = createAsyncThunk('discounts/deleteDiscount', async (id, { rejectWithValue }) => {
  try {
    await config.delete(`/discounts/${id}`, axiosConfig);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete discount');
  }
});

export const applyDiscount = createAsyncThunk('discounts/applyDiscount', async (discountCode, { rejectWithValue }) => {
  try {
    const response = await config.post('/discounts/apply', { code: discountCode }, axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to apply discount');
  }
});

export const discountSlice = createSlice({
  name: 'discounts',
  initialState,
  reducers: {
    resetAppliedDiscounts: (state) => {
      state.appliedDiscounts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscounts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDiscounts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.discounts = Array.isArray(action.payload.content) ? action.payload.content : [];
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.discounts = [];
      })
      .addCase(createDiscount.fulfilled, (state, action) => {
        state.discounts.push(action.payload);
      })
      .addCase(createDiscount.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateDiscount.fulfilled, (state, action) => {
        const index = state.discounts.findIndex((d) => d.discountId === action.payload.discountId);
        if (index !== -1) {
          state.discounts[index] = action.payload;
        }
      })
      .addCase(updateDiscount.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteDiscount.fulfilled, (state, action) => {
        state.discounts = state.discounts.filter((d) => d.discountId !== action.payload);
      })
      .addCase(deleteDiscount.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(applyDiscount.fulfilled, (state, action) => {
        if (!state.appliedDiscounts.find((discount) => discount.discountId === action.payload.discountId)) {
          state.appliedDiscounts.push(action.payload);
        } else {
          console.log('Discount already applied');
        }
      })
      .addCase(applyDiscount.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { resetAppliedDiscounts } = discountSlice.actions;

export default discountSlice.reducer;