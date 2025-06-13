import { getAllMessages } from '@/Hooks/getAllMessages'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Messages({selectedUser}) {
  const dispatch = useDispatch();
  const { ChatMessages } = useSelector(store => store.chat);
  useEffect(()=>{
    console.log(ChatMessages)
    getAllMessages(selectedUser._id , dispatch);
    console.log
  },[selectedUser?._id])
  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2">
      {  ChatMessages?.map((msg) =>(
            <div className= {`flex ${msg.senderId === selectedUser._id? 'justify-start' :'justify-end'} `}>
              

                {msg.message}
            </div>
        ))
    }
    </div>

  )
}

export default Messages