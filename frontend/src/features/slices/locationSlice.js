import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices'
const token = window.localStorage.getItem('token');
const axiosConfig = {
  headers: {
    'Authorization': 'Bearer ' + token // Sử dụng Bearer authentication token ở đây
  }// Sử dụng Bearer authentication token ở đây
}

const API_URL = '/locations';

// Thunk để lấy toàn bộ danh sách Locations
export const fetchLocations = createAsyncThunk('locations/fetchLocations', async () => {
    const response = await config.get(API_URL);
    return response.data;
  });
  
  // Thunk để tạo Location
  export const createLocation = createAsyncThunk('locations/createLocation', async (locationData, { rejectWithValue }) => {
    try {
      const response = await config.post(API_URL, locationData,axiosConfig);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });
  
  // Thunk để cập nhật Location
  export const updateLocation = createAsyncThunk('locations/updateLocation', async ({ id, locationData }, { rejectWithValue }) => {
    try {
      const response = await config.put(`${API_URL}/${id}`, locationData,axiosConfig);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });
  
  // Thunk để xóa Location
  export const deleteLocation = createAsyncThunk('locations/deleteLocation', async (id, { rejectWithValue }) => {
    try {
      await config.delete(`${API_URL}/${id}`,axiosConfig);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });
  
  const locationSlice = createSlice({
    name: 'locations',
    initialState: {
      locations: [],
      filteredLocations: [], // Đảm bảo khởi tạo là mảng rỗng
      currentPage: 0,
      pageSize: 10,
      search: '',
      isActive: undefined,
      loading: false,
      error: null,
    },
    reducers: {
      setSearch: (state, action) => {
        state.search = action.payload;
        state.currentPage = 0;
        state.filteredLocations = state.locations.filter(location =>
          location.locationName.toLowerCase().includes(action.payload.toLowerCase()) &&
          (state.isActive === undefined || location.active === state.isActive)
        ) || []; // Đảm bảo filteredLocations là mảng
      },
      setIsActive: (state, action) => {
        state.isActive = action.payload;
        state.currentPage = 0;
        state.filteredLocations = state.locations.filter(location =>
          location.locationName.toLowerCase().includes(state.search.toLowerCase()) &&
          (action.payload === undefined || location.active === action.payload)
        ) || []; // Đảm bảo filteredLocations là mảng
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
        .addCase(fetchLocations.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchLocations.fulfilled, (state, action) => {
          state.loading = false;
          state.locations = action.payload || [];
          state.filteredLocations = action.payload.filter(location =>
            location.locationName.toLowerCase().includes(state.search.toLowerCase()) &&
            (state.isActive === undefined || location.active === state.isActive)
          ) || [];
        })
        .addCase(fetchLocations.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
          state.filteredLocations = []; // Đảm bảo là mảng rỗng khi có lỗi
        })
        .addCase(createLocation.fulfilled, (state, action) => {
          state.locations.push(action.payload);
          state.filteredLocations = state.locations.filter(location =>
            location.locationName.toLowerCase().includes(state.search.toLowerCase()) &&
            (state.isActive === undefined || location.active === state.isActive)
          ) || [];
        })
        .addCase(updateLocation.fulfilled, (state, action) => {
          const index = state.locations.findIndex((loc) => loc.locationId === action.payload.locationId);
          if (index !== -1) {
            state.locations[index] = action.payload;
            state.filteredLocations = state.locations.filter(location =>
              location.locationName.toLowerCase().includes(state.search.toLowerCase()) &&
              (state.isActive === undefined || location.active === state.isActive)
            ) || [];
          }
        })
        .addCase(deleteLocation.fulfilled, (state, action) => {
          state.locations = state.locations.map(location =>
            location.locationId === action.payload ? { ...location, active: false } : location
          );
          state.filteredLocations = state.locations.filter(location =>
            location.locationName.toLowerCase().includes(state.search.toLowerCase()) &&
            (state.isActive === undefined || location.active === state.isActive)
          ) || [];
        });
    },
  });
  
  export const { setSearch, setIsActive, setPage, setPageSize } = locationSlice.actions;
  export default locationSlice.reducer;