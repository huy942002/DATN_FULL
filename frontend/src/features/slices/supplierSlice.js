import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices'
const token = window.localStorage.getItem('token');
const axiosConfig = {
  headers: {
    'Authorization': 'Bearer ' + token // Sử dụng Bearer authentication token ở đây
  }// Sử dụng Bearer authentication token ở đây
}

export const fetchSuppliers = createAsyncThunk('suppliers/fetchSuppliers', async () => {
    const response = await config.get('/api/suppliers',axiosConfig);
    return response.data.content;
});

export const createSupplier = createAsyncThunk('suppliers/createSupplier', async (supplierData, { rejectWithValue }) => {
    try {
        const response = await config.post('/api/suppliers', supplierData, axiosConfig);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateSupplier = createAsyncThunk('suppliers/updateSupplier', async ({ id, supplierData }, { rejectWithValue }) => {
    try {
        const response = await config.put(`/api/suppliers/${id}`, supplierData,axiosConfig);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteSupplier = createAsyncThunk('suppliers/deleteSupplier', async (id, { rejectWithValue }) => {
    try {
        await config.delete(`/api/suppliers/${id}`,axiosConfig);
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const supplierSlice = createSlice({
    name: 'suppliers',
    initialState: {
        suppliers: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuppliers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSuppliers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.suppliers = action.payload;
            })
            .addCase(fetchSuppliers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createSupplier.fulfilled, (state, action) => {
                state.suppliers.push(action.payload);
            })
            .addCase(createSupplier.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(updateSupplier.fulfilled, (state, action) => {
                const index = state.suppliers.findIndex((supplier) => supplier.supplierId === action.payload.supplierId);
                if (index !== -1) {
                    state.suppliers[index] = action.payload;
                }
            })
            .addCase(updateSupplier.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteSupplier.fulfilled, (state, action) => {
                state.suppliers = state.suppliers.filter((supplier) => supplier.supplierId !== action.payload);
            })
            .addCase(deleteSupplier.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default supplierSlice.reducer;