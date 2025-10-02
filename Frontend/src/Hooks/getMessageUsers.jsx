import { setMessageUsers} from "@/redux/authSlice";
import {  } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useMessageUsers =()=>{
    
    const dispatch = useDispatch();
    useEffect(()=>{

        const fetchAllusers = async()=>{
            try{
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/conversationUsers` ,{withCredentials:true} );
                if(res.data.success){
                    console.log(res.data.MessageUsers , "message users");
                    dispatch(setMessageUsers(res.data.MessageUsers));
                }
            }

            catch(err){
                console.log(err);
            }
        }
        fetchAllusers();

    },[dispatch])
};
export default useMessageUsers;
