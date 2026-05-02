import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { adminService } from './adminService.js';
import axios from 'axios'


const initialState = {
    users: [],
    events: [],
    orders: [],
    ratings: [],
    coupons: [],
    edit: { event: null, isEdit: false },
    adminLoading: false,
    adminSuccess: false,
    adminError: false,
    adminErrorMessage: ""
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        editEvent: (state, action) => {
            return {
                ...state,
                edit: { event: action.payload, isEdit: true }
            }
        },
        resetEdit: (state) => {
            return {
                ...state,
                edit: { event: null, isEdit: false }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state, action) => {
                state.adminLoading = true
                state.adminSuccess = false
                state.adminError = false
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = true
                state.users = action.payload
                state.adminError = false
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = false
                state.adminError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(getAllEvents.pending, (state, action) => {
                state.adminLoading = true
                state.adminSuccess = false
                state.adminError = false
            })
            .addCase(getAllEvents.fulfilled, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = true
                state.events = action.payload
                state.adminError = false
            })
            .addCase(getAllEvents.rejected, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = false
                state.adminError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(getAllOrders.pending, (state, action) => {
                state.adminLoading = true
                state.adminSuccess = false
                state.adminError = false
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = true
                state.orders = action.payload
                state.adminError = false
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = false
                state.adminError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(getAllRatings.pending, (state, action) => {
                state.adminLoading = true
                state.adminSuccess = false
                state.adminError = false
            })
            .addCase(getAllRatings.fulfilled, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = true
                state.ratings = action.payload
                state.adminError = false
            })
            .addCase(getAllRatings.rejected, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = false
                state.adminError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(getAllCoupons.pending, (state, action) => {
                state.adminLoading = true
                state.adminSuccess = false
                state.adminError = false
            })
            .addCase(getAllCoupons.fulfilled, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = true
                state.coupons = action.payload
                state.adminError = false
            })
            .addCase(getAllCoupons.rejected, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = false
                state.adminError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(couponCreate.pending, (state, action) => {
                state.adminLoading = true
                state.adminSuccess = false
                state.adminError = false
            })
            .addCase(couponCreate.fulfilled, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = true
                state.coupons = [action.payload, ...state.coupons]
                state.adminError = false
            })
            .addCase(couponCreate.rejected, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = false
                state.adminError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(adminCreateEvent.pending, (state, action) => {
                state.adminLoading = true
                state.adminSuccess = false
                state.adminError = false
            })
            .addCase(adminCreateEvent.fulfilled, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = true
                state.events = [action.payload, ...state.events]
                state.adminError = false
            })
            .addCase(adminCreateEvent.rejected, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = false
                state.adminError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(updateEventAdmin.pending, (state) => {
                state.adminLoading = true
            })

            // .addCase(updateEventAdmin.fulfilled, (state, action) => {
            //     state.edit.event = action.payload; // ✅ sync updated event back into edit
            //     state.adminLoading = false;
            // })

            .addCase(updateEventAdmin.fulfilled, (state, action) => {
                const updated = action.payload;

                // replaces the old event in the list with the updated one
                state.events = state.events.map((ev) =>
                    ev._id === updated._id ? updated : ev
                );

                state.edit = null;          // clear edit state
                state.adminLoading = false;
            })

            .addCase(updateEventAdmin.rejected, (state, action) => {
                state.adminLoading = false
                state.adminError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(updateCouponAdmin.pending, (state) => {
                state.adminLoading = true;
            })
            .addCase(updateCouponAdmin.fulfilled, (state, action) => {
                state.adminLoading = false;

                state.coupons = state.coupons.map(coupon =>
                    coupon._id === action.payload._id ? action.payload : coupon
                );
            })
            .addCase(updateCouponAdmin.rejected, (state, action) => {
                state.adminLoading = false;
                state.adminError = true;
                state.adminErrorMessage = action.payload;
            })
            .addCase(updateUserAdmin.pending, (state) => {
                state.adminLoading = true;
            })
            .addCase(updateUserAdmin.fulfilled, (state, action) => {
                state.adminLoading = false;
                state.users = state.users.map(user =>
                    user._id === action.payload._id ? action.payload : user
                );
            })
            .addCase(updateUserAdmin.rejected, (state, action) => {
                state.adminLoading = false;
                state.adminError = true;
                state.adminErrorMessage = action.payload;
            })
    }
});

export const { editEvent, resetEdit } = adminSlice.actions

export default adminSlice.reducer


//Get All Users
export const getAllUsers = createAsyncThunk("FETCH/ADMIN/USERS", async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.fetchAllUsers(token)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

//Get All Events
export const getAllEvents = createAsyncThunk("FETCH/ADMIN/EVENTS", async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.fetchAllEvents(token)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})


//Get All Orders
export const getAllOrders = createAsyncThunk("FETCH/ADMIN/ORDERS", async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.fetchAllOrders(token)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

//Get All Ratings
export const getAllRatings = createAsyncThunk("FETCH/ADMIN/RATINGS", async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.fetchAllRatings(token)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

//Get All Coupons
export const getAllCoupons = createAsyncThunk("FETCH/ADMIN/COUPONS", async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.fetchAllCoupons(token)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})


//createCoupons
export const couponCreate = createAsyncThunk("CREATE/COUPONS", async (formData, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.createCoupon(formData, token)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

//create Event 
export const adminCreateEvent = createAsyncThunk("ADMIN/CREATE/EVENTS", async (formData, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.adminEventCreate(formData, token)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

export const updateEventAdmin = createAsyncThunk(
    "admin/updateEvent",
    async ({ id, formData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;

            const { data } = await axios.put(
                `/api/admin/events/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

export const updateCouponAdmin = createAsyncThunk(
    "admin/updateCoupon",
    async ({ id, couponData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await adminService.updateCoupon(id, couponData, token);
        } catch (error) {
            let message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateUserAdmin = createAsyncThunk(
    "admin/updateUser",
    async ({ id, userData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await adminService.updateUser(id, userData, token);
        } catch (error) {
            let message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);