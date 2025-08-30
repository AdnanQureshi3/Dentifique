import { setPosts , setTrendingPosts} from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost =()=>{
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllPost = async()=>{
            try{
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/post/allpost` ,{withCredentials:true} );
                if(res.data.success){
                    // console.log(res.data);
                    dispatch(setPosts(res.data.posts));
                }
            }
            
            catch(err){
                console.log(err);
            }
        }
        fetchAllPost();
        const fetchTrendingPosts = async()=>{
            try{
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/post/trending` ,{withCredentials:true} );
                if(res.data.success){
                    console.log(res.data);
                    dispatch(setTrendingPosts(res.data.posts));
                }
            }
            
            catch(err){
                console.log(err);
            }
        }
        fetchTrendingPosts();

    },[])
};
export default useGetAllPost;
