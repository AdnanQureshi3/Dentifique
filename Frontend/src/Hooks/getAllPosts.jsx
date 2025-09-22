import { addPosts, setTrendingPosts } from "@/redux/postSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";


const useGetAllPost = () => {
  const dispatch = useDispatch();
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading , setLoading] = useState(false);

  const fetchPosts = async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/post/allpost`,
        { params: { limit: 10, cursor }, withCredentials: true }
      );
      console.log(res.data);

      if (res.data.success) {
        dispatch(addPosts(res.data.posts));   
        setCursor(res.data.nextCursor);    
        setHasMore(res.data.hasMore);       
      }
    } catch (err) {
      console.log(err);
    }
    finally{
        setLoading(false);
    }
  };


  const fetchTrendingPosts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/post/trending`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setTrendingPosts(res.data.posts));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return { fetchPosts, fetchTrendingPosts, hasMore , loading };
};

export default useGetAllPost;
