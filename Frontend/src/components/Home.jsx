import React, { useEffect } from 'react'
import Feed from './Feed'
import RightSideBar from "./RightSideBar.jsx";
import { Outlet } from 'react-router-dom'
import useGetAllPost from '../Hooks/getAllPosts.jsx'
import useSuggestedUser from '../Hooks/getAllSuggestedUser.jsx'
import {useDispatch} from "react-redux";
import { setPosts } from '@/redux/postSlice';

function Home() {
  const { fetchPosts, hasMore  } = useGetAllPost();
   const dispatch = useDispatch();
 

    useSuggestedUser();

     useEffect(() => {
    // dispatch(setPosts([]));
    fetchPosts();

  }, []);
   

  return (
    <div className='flex w-full justify-center px-4'>
      <div className='flex justify-between  w-full max-w-6xl'>
        <div className='w-full max-w-2xl'>
          <Feed />
          <div>load</div>
          <Outlet />
        </div>
        <div className='w-[30%] '>
          <RightSideBar />
        </div>
      </div>
    </div>
  )
}

export default Home
