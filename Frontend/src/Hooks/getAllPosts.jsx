import { addPosts, setTrendingPosts } from "@/redux/postSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";


const useGetAllPost = () => {
  const dispatch = useDispatch();


  const fetchPosts = async () => {
  
  
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/post/allpost`,
        { withCredentials: true }
      );

      console.log(res.data);

      if (res.data.success) {
        dispatch(addPosts(res.data.posts));   
      }
    } catch (err) {
      console.log(err);
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

  return { fetchPosts, fetchTrendingPosts };
};

export default useGetAllPost;
