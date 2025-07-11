import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices';

const token = window.localStorage.getItem('token');
const axiosConfig = {
  headers: {
    'Authorization': 'Bearer ' + token
  }
};

const API_URL = '/furnitureTypes';

// Thunk để lấy toàn bộ danh sách FurnitureTypes
export const fetchFurnitureTypes = createAsyncThunk('furnitureTypes/fetchFurnitureTypes', async () => {
  const response = await config.get(API_URL);
  return response.data;
});

// Thunk để lấy FurnitureType theo ID
export const fetchFurnitureTypesById = createAsyncThunk(
  'furnitureTypes/fetchFurnitureTypesById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await config.get(`${API_URL}/${id}`, axiosConfig);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk để tạo FurnitureType
export const createFurnitureType = createAsyncThunk('furnitureTypes/createFurnitureType', async (furnitureTypeData, { rejectWithValue }) => {
  try {
    const response = await config.post(API_URL, furnitureTypeData, axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk để cập nhật FurnitureType
export const updateFurnitureType = createAsyncThunk('furnitureTypes/updateFurnitureType', async ({ id, furnitureTypeData }, { rejectWithValue }) => {
  try {
    const response = await config.put(`${API_URL}/${id}`, furnitureTypeData, axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk để xóa FurnitureType
export const deleteFurnitureType = createAsyncThunk('furnitureTypes/deleteFurnitureType', async (id, { rejectWithValue }) => {
  try {
    await config.delete(`${API_URL}/${id}`, axiosConfig);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const furnitureTypeSlice = createSlice({
  name: 'furnitureTypes',
  initialState: {
    furnitureTypes: [],
    filteredFurnitureTypes: [],
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
      state.filteredFurnitureTypes = state.furnitureTypes.filter(type =>
        type.typeName.toLowerCase().includes(action.payload.toLowerCase()) &&
        (state.isActive === undefined || type.active === state.isActive)
      ) || [];
    },
    setIsActive: (state, action) => {
      state.isActive = action.payload;
      state.currentPage = 0;
      state.filteredFurnitureTypes = state.furnitureTypes.filter(type =>
        type.typeName.toLowerCase().includes(state.search.toLowerCase()) &&
        (action.payload === undefined || type.active === action.payload)
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
      .addCase(fetchFurnitureTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFurnitureTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.furnitureTypes = action.payload || [];
        state.filteredFurnitureTypes = action.payload.filter(type =>
          type.typeName.toLowerCase().includes(state.search.toLowerCase()) &&
          (state.isActive === undefined || type.active === state.isActive)
        ) || [];
      })
      .addCase(fetchFurnitureTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.filteredFurnitureTypes = [];
      })
      .addCase(fetchFurnitureTypesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFurnitureTypesById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.furnitureTypes.findIndex((t) => t.furnitureTypeId === action.payload.furnitureTypeId);
        if (index >= 0) {
          state.furnitureTypes[index] = action.payload;
        } else {
          state.furnitureTypes.push(action.payload);
        }
        state.filteredFurnitureTypes = state.furnitureTypes.filter(type =>
          type.typeName.toLowerCase().includes(state.search.toLowerCase()) &&
          (state.isActive === undefined || type.active === state.isActive)
        ) || [];
      })
      .addCase(fetchFurnitureTypesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch furniture type';
      })
      .addCase(createFurnitureType.fulfilled, (state, action) => {
        state.furnitureTypes.push(action.payload);
        state.filteredFurnitureTypes = state.furnitureTypes.filter(type =>
          type.typeName.toLowerCase().includes(state.search.toLowerCase()) &&
          (state.isActive === undefined || type.active === state.isActive)
        ) || [];
      })
      .addCase(createFurnitureType.rejected, (state, action) => {
        state.error = action.payload || 'Failed to create furniture type';
      })
      .addCase(updateFurnitureType.fulfilled, (state, action) => {
        const index = state.furnitureTypes.findIndex((t) => t.furnitureTypeId === action.payload.furnitureTypeId);
        if (index !== -1) {
          state.furnitureTypes[index] = action.payload;
          state.filteredFurnitureTypes = state.furnitureTypes.filter(type =>
            type.typeName.toLowerCase().includes(state.search.toLowerCase()) &&
            (state.isActive === undefined || type.active === state.isActive)
          ) || [];
        }
      })
      .addCase(updateFurnitureType.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update furniture type';
      })
      .addCase(deleteFurnitureType.fulfilled, (state, action) => {
        // Cập nhật furnitureTypes: đặt isActive = false cho mục bị xóa
        state.furnitureTypes = state.furnitureTypes.map(type =>
          type.furnitureTypeId === action.payload ? { ...type, active: false } : type
        );
        // Cập nhật filteredFurnitureTypes: chỉ giữ các mục khớp với search và isActive
        state.filteredFurnitureTypes = state.furnitureTypes.filter(type =>
          type.typeName.toLowerCase().includes(state.search.toLowerCase()) &&
          (state.isActive === undefined || type.active === state.isActive)
        );
      })
      .addCase(deleteFurnitureType.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete furniture type';
      });
  },
});

export const { setSearch, setIsActive, setPage, setPageSize } = furnitureTypeSlice.actions;
export default furnitureTypeSlice.reducer;