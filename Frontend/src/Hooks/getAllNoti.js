
import {  setNotificationArray } from "@/redux/notificationSlice";
import axios from "axios";

export const getAllNoti= async( dispatch)=>{
    console.log("notis are comming")

    try{
        const res = await axios.get(`https://upchain-tvvm.onrender.com/api/user/noti/get` , {withCredentials:true});
        
        if(res.data.success){
            // console.log("23567890m"  , res.data.messages)
            dispatch(setNotificationArray(res.data.notis));

        }

    }
    catch(err){
        console.log(err);

    }
}