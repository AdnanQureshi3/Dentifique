import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:'chat',
    initialState:{
        onlineUsers:[],
        ChatMessages:[]
    },
    reducers:{
        setOnlineUsers:(state , action)=>{
            state.onlineUsers = action.payload;
        },
        setChatmessages:(state , action)=>{
            state.ChatMessages = action.payload;
        }
    }
})
export const {setOnlineUsers , setChatmessages} = chatSlice.actions;
export default chatSlice.reducer;