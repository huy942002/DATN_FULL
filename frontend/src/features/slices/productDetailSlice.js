import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices';
import { debounce } from 'lodash';
const API_URL = '/product-details';
const axiosConfig = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};
const token = window.localStorage.getItem('token');

// Async Thunks
export const fetchAll = createAsyncThunk(
  'productDetails/fetchAll',
  async ({ search, isActive, page, size }, { rejectWithValue }) => {
    try {
      const response = await config.get(API_URL, {
        params: { search, isActive, page, size }
      });
      console.log('API Response:', response.data); // Log response for debugging
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message); // Log error for debugging
      return rejectWithValue(error.response?.data || 'Lỗi khi tải danh sách');
    }
  }
);

export const fetchById = createAsyncThunk(
  'productDetails/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await config.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Lỗi khi tải chi tiết');
    }
  }
);

export const fetchByProductId = createAsyncThunk(
  'productDetails/fetchByProductId',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await config.get(`${API_URL}/by-product/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Lỗi khi tải danh sách theo productId');
    }
  }
);

export const create = createAsyncThunk(
  'productDetails/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await config.post(API_URL, data, axiosConfig);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Lỗi khi tạo mới');
    }
  }
);

export const update = createAsyncThunk(
  'productDetails/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await config.put(`${API_URL}/${id}`, data, axiosConfig);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Lỗi khi cập nhật');
    }
  }
);

export const remove = createAsyncThunk(
  'productDetails/remove',
  async (id, { rejectWithValue }) => {
    try {
      await config.delete(`${API_URL}/${id}`, axiosConfig);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Lỗi khi xóa');
    }
  }
);

// Upload image for ProductColorDetail
export const uploadProductColorDetailImage = createAsyncThunk(
  'productDetails/uploadImage',
  async ({ productDetailsId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await config.post(
        `/images/product-detail/${productDetailsId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + token,
          },
        }
      );
      return response.data; // Returns the fileDownloadUri
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const productDetailSlice = createSlice({
  name: 'productDetails',
  initialState: {
    page: {
      content: [],
      totalPages: 0,
      totalElements: 0,
      number: 0,
      size: 10,
    },
    search: '',
    productId: null,
    byProductDetails: [], // Danh sách ProductColorDetail theo productId
    isActive: 'all',
    loading: false,
    error: null,
    current: null,
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page.number = 0;
      state.byProductDetails = [];
    },
    setIsActive: (state, action) => {
      state.isActive = action.payload;
      state.page.number = 0;
      state.byProductDetails = [];
    },
    setPage: (state, action) => {
      state.page.number = action.payload;
    },
    setPageSize: (state, action) => {
      state.page.size = action.payload;
      state.page.number = 0;
    },
    resetCurrent: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload;
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(fetchByProductId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchByProductId.fulfilled, (state, action) => {
        state.loading = false;
        state.byProductDetails = action.payload;
      })
      .addCase(fetchByProductId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(create.fulfilled, (state) => {
        // Không thêm trực tiếp vào content vì cần làm mới danh sách
      })
      .addCase(update.fulfilled, (state, action) => {
        const index = state.page.content.findIndex(
          (item) => item.productDetailsId === action.payload.productDetailsId
        );
        if (index !== -1) {
          state.page.content[index] = action.payload;
        }
      })
      .addCase(remove.fulfilled, (state, action) => {
        state.page.content = state.page.content.filter(
          (item) => item.productDetailsId !== action.payload
        );
      });
  },
});

export const { setSearch, setIsActive, setPage, setPageSize, resetCurrent } = productDetailSlice.actions;

// Thêm debouncedSetSearch
export const debouncedSetSearch = debounce((dispatch, search) => {
  dispatch(setSearch(search));
}, 300);

export default productDetailSlice.reducer;