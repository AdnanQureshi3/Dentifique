
import axios from "axios";

import { setChatmessages } from "@/redux/chatSlice";

export const getAllMessages= async(receiverId , dispatch)=>{

    try{
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats/get/${receiverId}` , {withCredentials:true});
        
        if(res.data.success){
            // console.log("23567890m"  , res.data.messages)
            dispatch(setChatmessages(res.data.messages));
        }

    }
    catch(err){
        console.log(err);

    }
}