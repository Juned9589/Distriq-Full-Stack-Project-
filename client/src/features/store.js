import { configureStore } from '@reduxjs/toolkit'
import auth from './auth/authSlice'
import event from './event/eventSlice'
import order from "./orders/orderSlice"
import admin from './admin/adminSlice'
import chat from './chat/chatSlice'


const store = configureStore({

    reducer: { auth, event, order, admin, chat }
})

export default store