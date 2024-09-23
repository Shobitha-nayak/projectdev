// src/store/slices/authSlice.js (Add token refresh logic)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/token/';

export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password }, thunkAPI) => {
        try {
            const response = await axios.post(API_URL, { username, password });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (refresh, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}refresh/`, { refresh });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Update extraReducers to handle token refresh
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        access: localStorage.getItem('access') || null,
        refresh: localStorage.getItem('refresh') || null,
        status: 'idle',
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.access = null;
            state.refresh = null;
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.access = action.payload.access;
                state.refresh = action.payload.refresh;
                localStorage.setItem('access', action.payload.access);
                localStorage.setItem('refresh', action.payload.refresh);
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.access = action.payload.access;
                localStorage.setItem('access', action.payload.access);
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.access = null;
                state.refresh = null;
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
