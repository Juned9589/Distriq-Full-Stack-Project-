import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";
import { bookTicket, ticketCancel } from "../orders/orderSlice";

let userExist = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: userExist || null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ""
            localStorage.removeItem('user')
        },
        resetState: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.user = action.payload
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.isSuccess = false
                state.isError = false
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isError = false
                state.user = action.payload
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(bookTicket.fulfilled, (state, action) => {
                if (state.user && action.payload?.billedAmount) {
                    state.user.credits -= action.payload.billedAmount
                    localStorage.setItem('user', JSON.stringify(state.user))
                }
            })
            .addCase(ticketCancel.fulfilled, (state, action) => {
                if (state.user && action.payload?.billedAmount) {
                    state.user.credits += action.payload.billedAmount
                    localStorage.setItem('user', JSON.stringify(state.user))
                }
            })
            .addCase(getMe.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
            })
            .addCase(getMe.rejected, (state, action) => {
                state.isLoading = false
            })
            // Global matcher for unauthorized errors across any thunk
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    const message = String(action.payload || action.error?.message || "").toLowerCase();
                    if (message.includes("jwt expired") || message.includes("unauthorized access") || message.includes("no token found")) {
                        state.user = null
                        state.isError = true
                        state.message = "Session expired. Please login again."
                        localStorage.removeItem('user')
                    }
                }
            )
    }
})

export const { logoutUser, resetState } = authSlice.actions

export default authSlice.reducer

// Register user
export const registerUser = createAsyncThunk("AUTH/REGISTER", async (formData, thunkAPI) => {
    try {
        return await authService.register(formData)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

// Login User
export const loginUser = createAsyncThunk("AUTH/LOGIN", async (formData, thunkAPI) => {
    try {
        return await authService.login(formData)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

// Get Latest User Data
export const getMe = createAsyncThunk("AUTH/GET_ME", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await authService.getMe(token)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})
