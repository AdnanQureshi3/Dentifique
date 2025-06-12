import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setAuthuser } from "./authSlice.js";
import postSlice from './postSlice.js';
import authSlice from './authSlice.js'
import socketSlice from './socketSLice.js'
import chatSlice from './chatSlice.js'
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

import { Socket } from "socket.io-client";
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    auth: authSlice,
    post:postSlice,
    Socketio:socketSlice,
    chat:chatSlice

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

export default store;