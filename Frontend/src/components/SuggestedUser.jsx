import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { FollowHandlerFunc } from '../Hooks/useFollownUnfollow.js'
import useSuggestedUser from '@/Hooks/getAllSuggestedUser.jsx'


function SuggestedUser() {
  const { suggestedUser, user } = useSelector(store => store.auth)
  const dispatch = useDispatch();
  

  return (
    <div className='w-full p-4 bg-white rounded-md mt-2 shadow-md border space-y-6'>
      <div className='flex justify-between'>
        <span className='font-semibold text-sm text-gray-500'>Whom to follow.</span>
        <span className='font-semibold text-sm'>See All</span>
      </div>

      <div className='flex flex-col gap-2 mt-4'>
        {Array.isArray(suggestedUser) &&
          suggestedUser?.filter(u => user._id !== u._id)
            .map(u => (

              <div key={u._id} className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Link to={`/profile/${u._id}`}>
                    <Avatar className="w-10 h-10 mr-4">
                      <AvatarImage
                        className="w-10 h-10 border-2 border-green-600 rounded-full object-cover"
                        src={u?.profilePicture}
                      />
                      <AvatarFallback
                        className="w-10 border-2 border-green-600 rounded-full aspect-square bg-amber-500">User</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className='flex flex-col'>
                    <h1 className='font-semibold text-sm'>{u.username}</h1>
                    <span className='font-light text-xs text-gray-500'>{u.bio || 'I am a dev'}</span>
                  </div>
                </div>
                <button
                  onClick={() => FollowHandlerFunc(u?._id, dispatch)}
                  className='text-blue-500 text-sm font-semibold cursor-pointer'
                >
                  {user.following.includes(u._id) ? 'UnFollow' : 'Follow'}
                </button>

              </div>
            ))}
      </div>
    </div>
  )
}

export default SuggestedUser
