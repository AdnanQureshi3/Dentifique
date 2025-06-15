import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setAuthuser } from "./authSlice.js";
import postSlice from './postSlice.js';
import authSlice from './authSlice.js'
import socketSlice from './socketSLice.js'
import chatSlice from './chatSlice.js'
import notificationSlice from './NotificationSlice.js'

import {

    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    auth: authSlice,
    post:postSlice,
    socketio:socketSlice,
    chat:chatSlice,
    notification:notificationSlice


})
const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          ignoredPaths: ['Socketio.socket'],
          ignoredActionPaths: ['payload'] 

        },
      }),
  })
/*
cd frontend
cd vite-project
npm run dev

cd backend 
npm run dev
*/

export default store;