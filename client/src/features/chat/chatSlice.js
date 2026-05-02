import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import chatService from './chatService'

const initialState = {
    messages: [
        { _id: 'init-1', role: 'ai', text: 'Hi! I\'m Distriq AI. Ask me about events, bookings, or anything on the platform.' }
    ],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
}

export const sendChatMessage = createAsyncThunk(
    'chat/sendMessage',
    async (text, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await chatService.sendMessage(text, token)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        resetChat: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        },
        addUserMessage: (state, action) => {
            state.messages.push({ _id: Date.now().toString(), role: 'user', text: action.payload })
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendChatMessage.pending, (state) => {
                state.isLoading = true
            })
            .addCase(sendChatMessage.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.messages.push({ _id: Date.now().toString(), role: 'ai', text: action.payload })
            })
            .addCase(sendChatMessage.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.messages.push({ 
                    _id: Date.now().toString(),
                    role: 'ai', 
                    text: action.payload?.includes('quota') 
                        ? 'I am currently experiencing high demand and my quota is exceeded. Please try again later.' 
                        : action.payload || 'Something went wrong. Please try again.' 
                })
            })
    }
})

export const { resetChat, addUserMessage } = chatSlice.actions
export default chatSlice.reducer
