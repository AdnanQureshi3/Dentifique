
import { setProfileUser } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useProfileUser =(id)=>{
    
    const dispatch = useDispatch();
    useEffect(()=>{

        const fetchProfileuser = async()=>{
            try{
                 const res = await axios.get(`https://upchain-tvvm.onrender.com/api/user/${id}/getprofile` ,{withCredentials:true} );
            if(res.data.success){
                dispatch(setProfileUser(res.data.user));
                console.log(res.data.user)
            }
            }

            catch(err){
                 toast.error(err.response?.data?.msg || "Something went wrong")

            }
        }
        fetchProfileuser();

    },[id])
};
export default useProfileUser;
