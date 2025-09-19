import { setSuggestedUser } from "@/redux/authSlice";
import {  } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useSuggestedUser =(refresh)=>{
    
    const dipatch = useDispatch();
    useEffect(()=>{

        const fetchAllusers = async()=>{
            try{
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/suggested` ,{withCredentials:true} );
                if(res.data.success){
                    
                    dipatch(setSuggestedUser(res.data.users));
                }
            }

            catch(err){
                console.log(err);
            }
        }
        fetchAllusers();

    },[refresh])
};
export default useSuggestedUser;
