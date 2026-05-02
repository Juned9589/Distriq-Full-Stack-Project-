import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import eventService from './eventService';

const initialState = {
    events: [],
    event: {},
    eventComments: [],
    eventLoading: false,
    eventSuccess: false,
    eventError: false,
    eventErrorMessage: ""
}

const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getEvents.pending, (state, action) => {
                state.eventLoading = true
                state.eventSuccess = false
                state.eventError = false
            })
            .addCase(getEvents.fulfilled, (state, action) => {
                state.eventLoading = false
                state.eventSuccess = true
                state.events = action.payload
                state.eventError = false
            })
            .addCase(getEvents.rejected, (state, action) => {
                state.eventLoading = false
                state.eventSuccess = false
                state.eventError = true
                state.eventErrorMessage = action.payload
            })
            .addCase(getSingleEvent.pending, (state, action) => {
                state.eventLoading = true
                state.eventSuccess = false
                state.eventError = false
            })
            .addCase(getSingleEvent.fulfilled, (state, action) => {
                state.eventLoading = false
                state.eventSuccess = true
                state.event = action.payload
                state.eventError = false
            })
            .addCase(getSingleEvent.rejected, (state, action) => {
                state.eventLoading = false
                state.eventSuccess = false
                state.eventError = true
                state.eventErrorMessage = action.payload
            })
            .addCase(getEventComment.pending, (state, action) => {
                state.eventLoading = true
                state.eventSuccess = false
                state.eventError = false
            })
            .addCase(getEventComment.fulfilled, (state, action) => {
                state.eventLoading = false
                state.eventSuccess = true
                state.eventComments = action.payload
                state.eventError = false
            })
            .addCase(getEventComment.rejected, (state, action) => {
                state.eventLoading = false
                state.eventSuccess = false
                state.eventError = true
                state.eventErrorMessage = action.payload
            })
    }
});

export const { } = eventSlice.actions

export default eventSlice.reducer


// Get Events
export const getEvents = createAsyncThunk("EVENTS/FETCH", async (limit, thunkAPI) => {

    try {
        return await eventService.fetchEvents(limit)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})


// Get Event
export const getSingleEvent = createAsyncThunk("SINGLE/EVENT/FETCH", async (eid, thunkAPI) => {



    try {
        return await eventService.fetchSingleEvent(eid)
    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

// Get Event Comment
export const getEventComment = createAsyncThunk("FETCH/EVENT/COMMENT", async (eid, thunkAPI) => {


    try {
        return await eventService.fetchEventComments(eid)

    } catch (error) {
        let message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})