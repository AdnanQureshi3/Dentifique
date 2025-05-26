import { setSuggestedUser } from "@/redux/authSlice";
import {  } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useSuggestedUser =()=>{
    const dipatch = useDispatch();
    useEffect(()=>{
        const fetchAllusers = async()=>{
            try{
                const res = await axios.get('http://localhost:8000/api/user/suggested' ,{withCredentials:true} );
                if(res.data.success){
                    console.log(res.data);
                    dipatch(setSuggestedUser(res.data.users));
                }
            }

            catch(err){
                console.log(err);
            }
        }
        fetchAllusers();

    },[])
};
export default useSuggestedUser;
