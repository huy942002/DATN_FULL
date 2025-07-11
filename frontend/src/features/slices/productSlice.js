import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices';
import { debounce } from 'lodash';

const token = window.localStorage.getItem('token');
const axiosConfig = {
  headers: {
    Authorization: 'Bearer ' + token,
  },
};

const API_URL = '/products';
const IMAGE_API_URL = 'http://localhost:8080/api/images';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ search = '', isActive, page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await config.get(API_URL, {
        params: { search, isActive, page, size },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch products';
      return rejectWithValue({ message, status: error.response?.status });
    }
  }
);

export const fetchProductsPos = createAsyncThunk(
  'products/fetchProductsPos',
  async ({ search = '', categoryId, furnitureTypeId, colorId, sortBy = 'productName', sortDirection = 'ASC', page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await config.get(`${API_URL}/pos`, {
        params: { search, categoryId, furnitureTypeId, colorId, sortBy, sortDirection, page, size },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch POS products';
      return rejectWithValue({ message, status: error.response?.status });
    }
  }
);

export const fetchDiscount = createAsyncThunk(
  'products/fetchDiscount',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await config.get(`/discounts/product/${productId}`, axiosConfig);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch discount');
    }
  }
);

export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await config.get(`${API_URL}/${productId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch product';
      return rejectWithValue({ message, status: error.response?.status });
    }
  }
);

export const createProduct = createAsyncThunk('products/createProduct', async (formData, { rejectWithValue }) => {
  try {
    const response = await config.post(API_URL, formData, axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create product');
  }
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await config.put(`${API_URL}/${id}`, formData, axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update product');
  }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    await config.delete(`${API_URL}/${id}`, axiosConfig);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
  }
});

export const uploadImagesbulk = createAsyncThunk('products/uploadImagesbulk', async ({ productId, files }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    const response = await config.post(`${IMAGE_API_URL}/product/${productId}/bulk`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to upload images');
  }
});

export const uploadImage = createAsyncThunk('products/uploadImage', async ({ productId, file }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await config.post(`${IMAGE_API_URL}/product/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to upload image');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    totalPages: 0,
    totalElements: 0,
    currentProduct: null,
    loading: false,
    error: null,
    currentPage: 0,
    pageSize: 10,
    search: '',
    categoryId: null,
    furnitureTypeId: null,
    colorId: null,
    sortBy: 'productName',
    sortDirection: 'ASC',
    uploadLoading: false,
    uploadError: null,
    isActive: undefined,
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
      state.currentPage = 0;
    },setCategoryId: (state, action) => {
      state.categoryId = action.payload ? parseInt(action.payload) : null;
      state.currentPage = 0;
    },
    setFurnitureTypeId: (state, action) => {
      state.furnitureTypeId = action.payload ? parseInt(action.payload) : null;
      state.currentPage = 0;
    },
    setColorId: (state, action) => {
      state.colorId = action.payload ? parseInt(action.payload) : null;
      state.currentPage = 0;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.currentPage = 0;
    },
    setSortDirection: (state, action) => {
      state.sortDirection = action.payload;
      state.currentPage = 0;
    },
    setIsActive: (state, action) => {
      state.isActive = action.payload;
      state.currentPage = 0;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 0;
    },
    resetCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.content || [];
        state.totalPages = action.payload.totalPages || 0;
        state.totalElements = action.payload.totalElements || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        if (action.payload.status === 404) {
          state.products = [];
          state.totalPages = 0;
          state.totalElements = 0;
        }
      })
      .addCase(fetchDiscount.fulfilled, (state, action) => {
        // Lưu chiết khấu nếu cần
      })
      .addCase(fetchDiscount.rejected, (state, action) => {
        state.error = action.payload;
      }).addCase(fetchProductsPos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsPos.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.content || [];
        state.totalPages = action.payload.totalPages || 0;
        state.totalElements = action.payload.totalElements || 0;
      })
      .addCase(fetchProductsPos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        if (action.payload.status === 404) {
          state.products = [];
          state.totalPages = 0;
          state.totalElements = 0;
        }
      })
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.totalElements += 1;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((p) => p.productId === action.payload.productId);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct && state.currentProduct.productId === action.payload.productId) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadImagesbulk.pending, (state) => {
        state.uploadLoading = true;
        state.uploadError = null;
      })
      .addCase(uploadImagesbulk.fulfilled, (state) => {
        state.uploadLoading = false;
      })
      .addCase(uploadImagesbulk.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadError = action.payload;
      })
      .addCase(uploadImage.pending, (state) => {
        state.uploadLoading = true;
        state.uploadError = null;
      })
      .addCase(uploadImage.fulfilled, (state) => {
        state.uploadLoading = false;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadError = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p.productId !== action.payload);
        state.totalElements -= 1;
        if (state.currentProduct && state.currentProduct.productId === action.payload) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearch, setCategoryId, setFurnitureTypeId, setColorId, setSortBy, 
  setSortDirection, setPage, setPageSize, setIsActive, resetCurrentProduct } = productSlice.actions;

export const debouncedSetSearch = debounce((dispatch, search) => {
  dispatch(setSearch(search));
}, 300);

export default productSlice.reducer;