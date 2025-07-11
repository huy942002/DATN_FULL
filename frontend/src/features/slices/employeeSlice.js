import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../api/apiSevices'
const token = window.localStorage.getItem('token');
const axiosConfig = {
  headers: {
    'Authorization': 'Bearer ' + token // Sử dụng Bearer authentication token ở đây
  }// Sử dụng Bearer authentication token ở đây
}
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
  const response = await config.get('/employees',axiosConfig);
  return response.data;
});

export const addEmployee = createAsyncThunk('employees/addEmployee', async (employee) => {
  const response = await config.post('/employees', employee,axiosConfig);
  return response.data;
});

export const updateEmployee = createAsyncThunk('employees/updateEmployee', async ({ id, employee }) => {
  const response = await config.put(`/employees/${id}`, employee,axiosConfig);
  return response.data;
});

export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async (id) => {
  await config.delete(`/employees/${id}`,axiosConfig);
  return id;
});

const employeesSlice = createSlice({
  name: 'employee',
  initialState: {
    employees: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        state.employees[index] = action.payload;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(emp => emp.id !== action.payload);
      });
  },
});

export default employeesSlice.reducer;