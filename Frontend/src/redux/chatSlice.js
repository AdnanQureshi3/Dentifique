import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:'chat',
    initialState:{
        onlineUsers:[],
        ChatMessages:[]
    },
    reducers:{
        setOnlineUsers:(state , action )=>{
            console.log("Online Users Updated" , action.payload)
            state.onlineUsers = action.payload;
        },
        setChatmessages:(state , action)=>{
            state.ChatMessages = action.payload;
        }
    }
})
export const {setOnlineUsers , setChatmessages} = chatSlice.actions;
export default chatSlice.reducer;