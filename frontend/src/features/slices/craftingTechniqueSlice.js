import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices'

const token = window.localStorage.getItem('token');
const axiosConfig = {
  headers: {
    'Authorization': 'Bearer ' + token
  }
};

const API_URL = '/craftingTechniques';

// Thunk để lấy toàn bộ danh sách CraftingTechniques
export const fetchCraftingTechniques = createAsyncThunk('craftingTechniques/fetchCraftingTechniques', async () => {
  const response = await config.get(API_URL);
  return response.data;
});

// Thunk để lấy CraftingTechnique theo ID
export const fetchCraftingTechniquesById = createAsyncThunk(
  'craftingTechniques/fetchCraftingTechniquesById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await config.get(`${API_URL}/${id}`, axiosConfig);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk để tạo CraftingTechnique
export const createCraftingTechnique = createAsyncThunk('craftingTechniques/createCraftingTechnique', async (craftingTechniqueData, { rejectWithValue }) => {
  try {
    const response = await config.post(API_URL, craftingTechniqueData, axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk để cập nhật CraftingTechnique
export const updateCraftingTechnique = createAsyncThunk('craftingTechniques/updateCraftingTechnique', async ({ id, craftingTechniqueData }, { rejectWithValue }) => {
  try {
    const response = await config.put(`${API_URL}/${id}`, craftingTechniqueData, axiosConfig);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk để xóa CraftingTechnique
export const deleteCraftingTechnique = createAsyncThunk('craftingTechniques/deleteCraftingTechnique', async (id, { rejectWithValue }) => {
  try {
    await config.delete(`${API_URL}/${id}`, axiosConfig);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const craftingTechniqueSlice = createSlice({
  name: 'craftingTechniques',
  initialState: {
    craftingTechniques: [],
    filteredCraftingTechniques: [],
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
      state.filteredCraftingTechniques = state.craftingTechniques.filter(technique =>
        technique.techniqueName.toLowerCase().includes(action.payload.toLowerCase()) &&
        (state.isActive === undefined || technique.active === state.isActive)
      ) || [];
    },
    setIsActive: (state, action) => {
      state.isActive = action.payload;
      state.currentPage = 0;
      state.filteredCraftingTechniques = state.craftingTechniques.filter(technique =>
        technique.techniqueName.toLowerCase().includes(state.search.toLowerCase()) &&
        (action.payload === undefined || technique.active === action.payload)
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
      .addCase(fetchCraftingTechniques.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCraftingTechniques.fulfilled, (state, action) => {
        state.loading = false;
        state.craftingTechniques = action.payload || [];
        state.filteredCraftingTechniques = action.payload.filter(technique =>
          technique.techniqueName.toLowerCase().includes(state.search.toLowerCase()) &&
          (state.isActive === undefined || technique.active === state.isActive)
        ) || [];
      })
      .addCase(fetchCraftingTechniques.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.filteredCraftingTechniques = [];
      })
      .addCase(fetchCraftingTechniquesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCraftingTechniquesById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.craftingTechniques.findIndex((t) => t.techniqueId === action.payload.techniqueId);
        if (index >= 0) {
          state.craftingTechniques[index] = action.payload;
        } else {
          state.craftingTechniques.push(action.payload);
        }
        state.filteredCraftingTechniques = state.craftingTechniques.filter(technique =>
          technique.techniqueName.toLowerCase().includes(state.search.toLowerCase()) &&
          (state.isActive === undefined || technique.active === state.isActive)
        ) || [];
      })
      .addCase(fetchCraftingTechniquesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch technique';
      })
      .addCase(createCraftingTechnique.fulfilled, (state, action) => {
        state.craftingTechniques.push(action.payload);
        state.filteredCraftingTechniques = state.craftingTechniques.filter(technique =>
          technique.techniqueName.toLowerCase().includes(state.search.toLowerCase()) &&
          (state.isActive === undefined || technique.active === state.isActive)
        ) || [];
      })
      .addCase(createCraftingTechnique.rejected, (state, action) => {
        state.error = action.payload || 'Failed to create crafting technique';
      })
      .addCase(updateCraftingTechnique.fulfilled, (state, action) => {
        const index = state.craftingTechniques.findIndex((t) => t.techniqueId === action.payload.techniqueId);
        if (index !== -1) {
          state.craftingTechniques[index] = action.payload;
          state.filteredCraftingTechniques = state.craftingTechniques.filter(technique =>
            technique.techniqueName.toLowerCase().includes(state.search.toLowerCase()) &&
            (state.isActive === undefined || technique.active === state.isActive)
          ) || [];
        }
      })
      .addCase(updateCraftingTechnique.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update crafting technique';
      })
      .addCase(deleteCraftingTechnique.fulfilled, (state, action) => {
        state.craftingTechniques = state.craftingTechniques.map(technique =>
          technique.techniqueId === action.payload ? { ...technique, active: false } : technique
        );
        state.filteredCraftingTechniques = state.craftingTechniques.filter(technique =>
          technique.techniqueName.toLowerCase().includes(state.search.toLowerCase()) &&
          (state.isActive === undefined || technique.active === state.isActive)
        ) || [];
      })
      .addCase(deleteCraftingTechnique.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete crafting technique';
      });
  },
});

export const { setSearch, setIsActive, setPage, setPageSize } = craftingTechniqueSlice.actions;
export default craftingTechniqueSlice.reducer;