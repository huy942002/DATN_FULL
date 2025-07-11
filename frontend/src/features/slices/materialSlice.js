import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices'

const token = window.localStorage.getItem('token');
const axiosConfig = {
    headers: {
        'Authorization': 'Bearer ' + token // Sử dụng Bearer authentication token ở đây
    }// Sử dụng Bearer authentication token ở đây
}

// Lấy danh sách material
export const fetchMaterials = createAsyncThunk(
    'material/fetchMaterials',
    async () => {
        const response = await config.get('/materials/');
        return response.data;
    }
);

// Tạo hoặc cập nhật material
export const createMaterial = createAsyncThunk(
    'material/createMaterial',
    async (material) => {
        const response = await config.post('/materials/', material, axiosConfig);
        return response.data;
    }
);

// Xóa material
export const deleteMaterial = createAsyncThunk(
    'material/deleteMaterial',
    async (id) => {
        await config.delete(`/materials/${id}`, axiosConfig);
        return id;
    }
);

export const updateMaterial = createAsyncThunk('material/updateMaterial', async (materialss) => {
    const response = await config.put('/materials/update', materialss, axiosConfig);
    return response.data;
});

const materialSlice = createSlice({
    name: 'material',
    initialState: {
        materials: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMaterials.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMaterials.fulfilled, (state, action) => {
                state.loading = false;
                state.materials = action.payload;
            })
            .addCase(fetchMaterials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createMaterial.fulfilled, (state, action) => {
                state.materials.push(action.payload);
            })
            .addCase(updateMaterial.pending, (state) => {
                    state.loading = true;
                  })
                  .addCase(updateMaterial.fulfilled, (state, action) => {
                    state.loading = false;
                    if (action.payload.id) {
                      state.materials = state.materials.map((item) =>
                        item.id === action.payload.id ? action.payload : item,
                      );
                    }
                    // state.rooms = state.rooms.filter((x) => x.status === 1);
                  })
                  .addCase(updateMaterial.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                  })
            .addCase(deleteMaterial.fulfilled, (state, action) => {
                state.materials = state.materials.filter(
                    (material) => material.materialID !== action.payload
                );
            });
    },
});

export default materialSlice.reducer;
