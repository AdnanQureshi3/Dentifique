import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null
    },
    reducers:{

        setAuthuser:(state , action) =>{
            state.user = action.payload;
        }
    }
});

export const {setAuthuser} = authSlice.actions
export default authSlice.reducer
/* 
agr mei AuthSLice ko pura export karunga toh mujhe use karte time
 authSLice.reducer use karn padega or setAuthuser ko as a authSlice.actions use karna padega
*/