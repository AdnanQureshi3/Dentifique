import React, { useEffect } from 'react'
import Feed from './Feed'
import RightSidebar from './RightSidebar'
import { Outlet } from 'react-router-dom'
import useGetAllPost from '@/Hooks/getAllPosts'

function Home() {
 
    useGetAllPost();
  return (
    <div className='flex'>

      <div className='flex-grow'>
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home