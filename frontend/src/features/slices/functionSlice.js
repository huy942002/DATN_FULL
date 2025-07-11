import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices'
const token = window.localStorage.getItem('token');
const axiosConfig = {
  headers: {
    'Authorization': 'Bearer ' + token // Sử dụng Bearer authentication token ở đây
  }// Sử dụng Bearer authentication token ở đây
}
// Thunk để lấy danh sách Functions
export const fetchFunctions = createAsyncThunk('functions/fetchFunctions', async () => {
  const response = await config.get('/functions');
  return response.data;
});

// Thunk để tạo Function
export const createFunction = createAsyncThunk('functions/createFunction', async (functionData, { rejectWithValue }) => {
  try {
    const response = await config.post('/functions', functionData,axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk để cập nhật Function
export const updateFunction = createAsyncThunk('functions/updateFunction', async ({ id, functionData }, { rejectWithValue }) => {
  try {
    const response = await config.put(`/functions/${id}`, functionData,axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk để xóa Function
export const deleteFunction = createAsyncThunk('functions/deleteFunction', async (id, { rejectWithValue }) => {
  try {
    await config.delete(`/functions/${id}`,axiosConfig);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const functionSlice = createSlice({
  name: 'functions',
  initialState: {
    functions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFunctions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFunctions.fulfilled, (state, action) => {
        state.loading = false;
        state.functions = action.payload;
      })
      .addCase(fetchFunctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createFunction.fulfilled, (state, action) => {
        state.functions.push(action.payload);
      })
      .addCase(updateFunction.fulfilled, (state, action) => {
        const index = state.functions.findIndex((f) => f.functionId === action.payload.functionId);
        if (index !== -1) {
          state.functions[index] = action.payload;
        }
      })
      .addCase(deleteFunction.fulfilled, (state, action) => {
        state.functions = state.functions.filter((f) => f.functionId !== action.payload);
      });
  },
});

export default functionSlice.reducer;