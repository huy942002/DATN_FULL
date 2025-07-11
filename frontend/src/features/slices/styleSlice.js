import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices'
const token = window.localStorage.getItem('token');
const axiosConfig = {
  headers: {
    'Authorization': 'Bearer ' + token // Sử dụng Bearer authentication token ở đây
  }// Sử dụng Bearer authentication token ở đây
}

// Thunk để lấy danh sách Styles
export const fetchStyles = createAsyncThunk('styles/fetchStyles', async () => {
  const response = await config.get("/styles");
  return response.data;
});

// Thunk để tạo Style
export const createStyle = createAsyncThunk('styles/createStyle', async (styleData, { rejectWithValue }) => {
  try {
    const response = await config.post('/styles', styleData,axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk để cập nhật Style
export const updateStyle = createAsyncThunk('styles/updateStyle', async ({ id, styleData }, { rejectWithValue }) => {
  try {
    const response = await config.put(`/styles/${id}`, styleData,axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk để xóa Style
export const deleteStyle = createAsyncThunk('styles/deleteStyle', async (id, { rejectWithValue }) => {
  try {
    await config.delete(`/styles/${id}`,axiosConfig);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const styleSlice = createSlice({
  name: 'styles',
  initialState: {
    styles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStyles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStyles.fulfilled, (state, action) => {
        state.loading = false;
        state.styles = action.payload;
      })
      .addCase(fetchStyles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createStyle.fulfilled, (state, action) => {
        state.styles.push(action.payload);
      })
      .addCase(updateStyle.fulfilled, (state, action) => {
        const index = state.styles.findIndex((s) => s.styleId === action.payload.styleId);
        if (index !== -1) {
          state.styles[index] = action.payload;
        }
      })
      .addCase(deleteStyle.fulfilled, (state, action) => {
        state.styles = state.styles.filter((s) => s.styleId !== action.payload);
      });
  },
});

export default styleSlice.reducer;