import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Link } from 'react-router-dom'

function Comment({ comment }) {
  return (
    <div className="flex items-start gap-2 my-3">
       <Link to={`/profile/${comment?.author._id}`} >
      <Avatar className="w-9 h-9">
        <AvatarImage src={comment?.author?.profilePicture} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      </Link>
      <div className="bg-gray-100 rounded-xl px-4 py-1 max-w-[80%]">
         <Link to={`/profile/${comment?.author._id}`} >
        <p className="text-sm font-semibold text-gray-800">{comment?.author?.username}</p>
        </Link>
        <p className="text-sm text-gray-700 mt-0">{comment?.content}</p>
      </div>
    </div>
  )
}

export default Comment
