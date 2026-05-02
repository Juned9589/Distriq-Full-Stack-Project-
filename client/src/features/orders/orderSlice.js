import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import orderService from './orderService';

const initialState = {
    order: {},
    orders: [],
    coupon: {},
    orderLoading: false,
    orderSuccess: false,
    orderError: false,
    orderErrorMessage: ""
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetOrder: (state) => {
            state.order = {};
            state.orderSuccess = false;
            state.orderError = false;
            state.orderErrorMessage = "";
            state.orderLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTickets.pending, (state, action) => {
                state.orderLoading = true
                state.orderSuccess = false
                state.orderError = false
            })
            .addCase(getTickets.fulfilled, (state, action) => {
                state.orderLoading = false
                state.orderSuccess = true
                state.orders = action.payload
                state.orderError = false
            })
            .addCase(getTickets.rejected, (state, action) => {
                state.orderLoading = false
                state.orderSuccess = false
                state.orderError = true
                state.orderErrorMessage = action.payload
            })
            .addCase(applyCoupon.pending, (state, action) => {
                state.orderLoading = true
                state.orderSuccess = false
                state.orderError = false
            })
            .addCase(applyCoupon.fulfilled, (state, action) => {
                state.orderLoading = false
                state.orderSuccess = true
                state.coupon = action.payload
                state.orderError = false
            })
            .addCase(applyCoupon.rejected, (state, action) => {
                state.orderLoading = false
                state.orderSuccess = false
                state.orderError = true
                state.orderErrorMessage = action.payload
            })
            .addCase(bookTicket.pending, (state, action) => {
                state.orderLoading = true
                state.orderSuccess = false
                state.orderError = false
            })
            .addCase(bookTicket.fulfilled, (state, action) => {
                state.orderLoading = false
                state.orderSuccess = true
                state.order = action.payload
                state.orderError = false
            })
            .addCase(bookTicket.rejected, (state, action) => {
                state.orderLoading = false
                state.orderSuccess = false
                state.orderError = true
                state.orderErrorMessage = action.payload
            })
            .addCase(ticketCancel.pending, (state, action) => {
                state.orderLoading = true
                state.orderSuccess = false
                state.orderError = false
            })
            .addCase(ticketCancel.fulfilled, (state, action) => {
                state.orderLoading = false
                state.orderSuccess = true
                state.orders = [action.payload]
                state.orderError = false
            })
            .addCase(ticketCancel.rejected, (state, action) => {
                state.orderLoading = false
                state.orderSuccess = false
                state.orderError = true
                state.orderErrorMessage = action.payload
            })
    }
});

export const { resetOrder } = orderSlice.actions

export default orderSlice.reducer


//Get Tickets 

export const getTickets = createAsyncThunk("FETCH/TIKCETS", async (_, thunkAPI) => {

    let token = thunkAPI.getState().auth.user.token

    try {
        return await orderService.fetchTickets(token)

    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }

})

export const applyCoupon = createAsyncThunk("APPLY/COUPON", async (couponCode, thunkAPI) => {

    try {
        return await orderService.checkCoupon(couponCode)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

// Book Ticket 
export const bookTicket = createAsyncThunk("BOOK/TICKET", async (formData, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await orderService.bookTicket(formData, token)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }

})


// cancel Ticket 
export const ticketCancel = createAsyncThunk("CANCEL/TICKET", async (tid, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await orderService.cancelTicket(tid, token)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }

})




