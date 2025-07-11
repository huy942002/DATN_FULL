import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices'
const token = window.localStorage.getItem('token');
const axiosConfig = {
  headers: {
    'Authorization': 'Bearer ' + token // Sử dụng Bearer authentication token ở đây
  }// Sử dụng Bearer authentication token ở đây
}

const API_URL = '/woodtypes';
const IMAGE_API_URL = 'http://localhost:8080/api/images';

// Thunk để lấy toàn bộ danh sách WoodTypes
export const fetchWoodTypes = createAsyncThunk('woodTypes/fetchWoodTypes', async () => {
  const response = await config.get(API_URL);
  return response.data;
});

// Thunk để tạo WoodType
export const createWoodType = createAsyncThunk('woodTypes/createWoodType', async (woodTypeData, { rejectWithValue }) => {
  try {
    const response = await config.post(API_URL, woodTypeData, axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk để cập nhật WoodType
export const updateWoodType = createAsyncThunk('woodTypes/updateWoodType', async ({ id, woodTypeData }, { rejectWithValue }) => {
  try {
    const response = await config.put(`${API_URL}/${id}`, woodTypeData, axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk để xóa WoodType
export const deleteWoodType = createAsyncThunk('woodTypes/deleteWoodType', async (id, { rejectWithValue }) => {
  try {
    await config.delete(`${API_URL}/${id}`, axiosConfig);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk để upload ảnh
export const uploadImage = createAsyncThunk('woodTypes/uploadImage', async ({ woodTypeId, file }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await config.post(`${IMAGE_API_URL}/woodtype/${woodTypeId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + token // Sử dụng Bearer authentication token ở đây
      },
    });
    return response.data; // Trả về fileDownloadUri
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


// Fetch single product by ID
export const fetchWoodTypesById = createAsyncThunk(
  'woodTypes/fetchWoodTypesById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await config.get(`${API_URL}/${id}`, axiosConfig);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const woodTypeSlice = createSlice({
  name: 'woodTypes',
  initialState: {
    woodTypes: [],
    filteredWoodTypes: [],
    currentPage: 0,
    pageSize: 10,
    search: '',
    isActive: true,
    loading: false,
    error: null,
    uploadLoading: false,
    uploadError: null,
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
      state.currentPage = 0;
      state.filteredWoodTypes = state.woodTypes.filter(woodType =>
        woodType.woodTypeName.toLowerCase().includes(action.payload.toLowerCase()) &&
        (state.isActive === undefined || woodType.active === state.isActive)
      ) || [];
    },
    setIsActive: (state, action) => {
      state.isActive = action.payload;
      state.currentPage = 0;
      state.filteredWoodTypes = state.woodTypes.filter(woodType =>
        woodType.woodTypeName.toLowerCase().includes(state.search.toLowerCase()) &&
        (action.payload === undefined || woodType.active === action.payload)
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
      .addCase(fetchWoodTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWoodTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.woodTypes = action.payload || [];
        state.filteredWoodTypes = action.payload.filter(woodType =>
          woodType.woodTypeName.toLowerCase().includes(state.search.toLowerCase()) &&
          (state.isActive === undefined || woodType.active === state.isActive)
        ) || [];
      })
      .addCase(fetchWoodTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.filteredWoodTypes = [];
      })
      .addCase(createWoodType.fulfilled, (state, action) => {
        state.woodTypes.push(action.payload);
        state.filteredWoodTypes = state.woodTypes.filter(woodType =>
          woodType.woodTypeName.toLowerCase().includes(state.search.toLowerCase()) &&
          (state.isActive === undefined || woodType.active === state.isActive)
        ) || [];
      })
      .addCase(updateWoodType.fulfilled, (state, action) => {
        const index = state.woodTypes.findIndex((wt) => wt.woodTypeId === action.payload.woodTypeId);
        if (index !== -1) {
          state.woodTypes[index] = action.payload;
          state.filteredWoodTypes = state.woodTypes.filter(woodType =>
            woodType.woodTypeName.toLowerCase().includes(state.search.toLowerCase()) &&
            (state.isActive === undefined || woodType.active === state.isActive)
          ) || [];
        }
      })
      .addCase(deleteWoodType.fulfilled, (state, action) => {
        state.woodTypes = state.woodTypes.map(woodType =>
          woodType.woodTypeId === action.payload ? { ...woodType, active: false } : woodType
        );
        state.filteredWoodTypes = state.woodTypes.filter(woodType =>
          woodType.woodTypeName.toLowerCase().includes(state.search.toLowerCase()) &&
          (state.isActive === undefined || woodType.active === state.isActive)
        ) || [];
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
        state.uploadError = action.payload || 'Failed to upload image';
      })
      // Fetch single product
      .addCase(fetchWoodTypesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWoodTypesById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.woodTypes.findIndex((p) => p.woodTypeId === action.payload.woodTypeId);
        if (index >= 0) {
          state.woodTypes[index] = action.payload;
        } else {
          state.woodTypes.push(action.payload);
        }
      })
      .addCase(fetchWoodTypesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch product';
      });
  },
});

export const { setSearch, setIsActive, setPage, setPageSize } = woodTypeSlice.actions;
export default woodTypeSlice.reducer;