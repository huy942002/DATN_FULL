import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices'
const token = window.localStorage.getItem('token');
const axiosConfig = {
  headers: {
    'Authorization': 'Bearer ' + token // Sử dụng Bearer authentication token ở đây
  }// Sử dụng Bearer authentication token ở đây
}
// Thunk để lấy danh sách categories
export const GetAllCategories = createAsyncThunk('category/GetAllCategories', async () => {
  const response = await config.get('/categories');
  return response.data;
});

// Thunk để thêm mới category
export const saveCategory = createAsyncThunk('category/saveCategory', async (category) => {
  const response = await config.post('/categories', category, axiosConfig);
  return response.data;
});

export const updateCategory = createAsyncThunk('category/updateCategory', async (category) => {
  const response = await config.put(`/categories/update`, category, axiosConfig);
  return response.data;
});

// Thunk để xóa category
export const deleteCategory = createAsyncThunk('category/deleteCategory', async (id) => {
  await config.delete(`/categories/${id}`, axiosConfig);
  return id;
});

// Slice
const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(GetAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.id) {
          state.colors = state.colors.map((item) =>
            item.id === action.payload.id ? action.payload : item,
          );
        }
        // state.rooms = state.rooms.filter((x) => x.status === 1);
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(category => category.categoryID !== action.payload);
      });
  },
});

export default categorySlice.reducer;
