import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost =()=>{
    const dipatch = useDispatch();
    useEffect(()=>{
        const fetchAllPost = async()=>{
            try{
                const res = await axios.get('http://localhost:8000/api/post/allpost' ,{withCredentials:true} );
                if(res.data.success){
                    console.log(res.data);
                    dipatch(setPosts(res.data.posts));
                }
            }
            
            catch(err){
                console.log(err);
            }
        }
        fetchAllPost();

    },[])
};
export default useGetAllPost;
