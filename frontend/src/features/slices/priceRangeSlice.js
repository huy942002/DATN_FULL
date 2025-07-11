import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices'

const token = window.localStorage.getItem('token');
const axiosConfig = {
  headers: {
    'Authorization': 'Bearer ' + token
  }
};

const API_URL = '/priceRanges';

// Thunk để lấy toàn bộ danh sách PriceRanges
export const fetchPriceRanges = createAsyncThunk('priceRanges/fetchPriceRanges', async () => {
  const response = await config.get(API_URL);
  return response.data;
});

// Thunk để lấy PriceRange theo ID
export const fetchPriceRangesById = createAsyncThunk(
  'priceRanges/fetchPriceRangesById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await config.get(`${API_URL}/${id}`, axiosConfig);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk để tạo PriceRange
export const createPriceRange = createAsyncThunk('priceRanges/createPriceRange', async (priceRangeData, { rejectWithValue }) => {
  try {
    const response = await config.post(API_URL, priceRangeData, axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk để cập nhật PriceRange
export const updatePriceRange = createAsyncThunk('priceRanges/updatePriceRange', async ({ id, priceRangeData }, { rejectWithValue }) => {
  try {
    const response = await config.put(`${API_URL}/${id}`, priceRangeData, axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk để xóa PriceRange
export const deletePriceRange = createAsyncThunk('priceRanges/deletePriceRange', async (id, { rejectWithValue }) => {
  try {
    await config.delete(`${API_URL}/${id}`, axiosConfig);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const priceRangeSlice = createSlice({
  name: 'priceRanges',
  initialState: {
    priceRanges: [],
    filteredPriceRanges: [],
    currentPage: 0,
    pageSize: 10,
    search: '',
    isActive: true,
    loading: false,
    error: null,
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
      state.currentPage = 0;
      state.filteredPriceRanges = state.priceRanges.filter(range =>
        range.priceRangeName.toLowerCase().includes(action.payload.toLowerCase()) &&
        (state.isActive === undefined || range.active === state.isActive)
      ) || [];
    },
    setIsActive: (state, action) => {
      state.isActive = action.payload;
      state.currentPage = 0;
      state.filteredPriceRanges = state.priceRanges.filter(range =>
        range.priceRangeName.toLowerCase().includes(state.search.toLowerCase()) &&
        (action.payload === undefined || range.active === action.payload)
      ) || [];
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPriceRanges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriceRanges.fulfilled, (state, action) => {
        state.loading = false;
        state.priceRanges = action.payload || [];
        state.filteredPriceRanges = action.payload.filter(range =>
          range.priceRangeName.toLowerCase().includes(state.search.toLowerCase()) &&
          (state.isActive === undefined || range.active === state.isActive)
        ) || [];
      })
      .addCase(fetchPriceRanges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.filteredPriceRanges = [];
      })
      .addCase(fetchPriceRangesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriceRangesById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.priceRanges.findIndex((r) => r.priceRangeId === action.payload.priceRangeId);
        if (index >= 0) {
          state.priceRanges[index] = action.payload;
        } else {
          state.priceRanges.push(action.payload);
        }
        state.filteredPriceRanges = state.priceRanges.filter(range =>
          range.priceRangeName.toLowerCase().includes(state.search.toLowerCase()) &&
          (state.isActive === undefined || range.active === state.isActive)
        ) || [];
      })
      .addCase(fetchPriceRangesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch price range';
      })
      .addCase(createPriceRange.fulfilled, (state, action) => {
        state.priceRanges.push(action.payload);
        state.filteredPriceRanges = state.priceRanges.filter(range =>
          range.priceRangeName.toLowerCase().includes(state.search.toLowerCase()) &&
          (state.isActive === undefined || range.active === state.isActive)
        ) || [];
      })
      .addCase(createPriceRange.rejected, (state, action) => {
        state.error = action.payload || 'Failed to create price range';
      })
      .addCase(updatePriceRange.fulfilled, (state, action) => {
        const index = state.priceRanges.findIndex((r) => r.priceRangeId === action.payload.priceRangeId);
        if (index !== -1) {
          state.priceRanges[index] = action.payload;
          state.filteredPriceRanges = state.priceRanges.filter(range =>
            range.priceRangeName.toLowerCase().includes(state.search.toLowerCase()) &&
            (state.isActive === undefined || range.active === state.isActive)
          ) || [];
        }
      })
      .addCase(updatePriceRange.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update price range';
      })
      .addCase(deletePriceRange.fulfilled, (state, action) => {
        state.priceRanges = state.priceRanges.map(range =>
          range.priceRangeId === action.payload ? { ...range, active: false } : range
        );
        state.filteredPriceRanges = state.priceRanges.filter(range =>
          range.priceRangeName.toLowerCase().includes(state.search.toLowerCase()) &&
          (state.isActive === undefined || range.active === state.isActive)
        ) || [];
      })
      .addCase(deletePriceRange.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete price range';
      });
  },
});

export const { setSearch, setIsActive, setPage, setPageSize } = priceRangeSlice.actions;
export default priceRangeSlice.reducer;