import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import SuggestedUser from './SuggestedUser.jsx';

function RightSideBar() {
  const {user} = useSelector(store=>store.auth);
  return (
    <div>

      <div className="">


        <div className='flex flex-row border-b-[1px] pt-12 pb-5'>

        <Link className='h-10 w-10 bg-amber-400' to = {`/profile/${user?._id}`} >
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="user" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>

        <div className='flex flex-col items-center'>
        <h1 className="font-semibold text-sm">{user?.username} </h1>

        <span className="font-light text-sm">{user?.bio} I am a dev </span>
        </div>
        </div>
        <SuggestedUser/>

        
        </div>
        
    </div>
  )
}

export default RightSideBar