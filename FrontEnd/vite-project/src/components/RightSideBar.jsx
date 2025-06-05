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


        <div className='flex items-center gap-4 border-b pt-12 pb-5 px-4'>

  <Link className='h-16 w-16' to={`/profile/${user?._id}`}>
    <Avatar className='h-full w-full'>
      <AvatarImage
        className='object-cover h-full w-full rounded-full border-2 border-green-700'
        src={user.profilePicture}
        alt='user'
      />
      <AvatarFallback>User</AvatarFallback>
    </Avatar>
  </Link>

  <div className='flex flex-col justify-center'>
    <h1 className="font-semibold text-base">{user?.username}</h1>
    <span className="font-light text-sm text-gray-600">{user?.bio || 'I am a dev'}</span>
  </div>

</div>

        <SuggestedUser/>

        
        </div>
        
    </div>
  )
}

export default RightSideBar