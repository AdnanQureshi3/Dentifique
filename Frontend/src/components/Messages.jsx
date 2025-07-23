import { getAllMessages } from '@/Hooks/getAllMessages'
import useRTM from '@/Hooks/useRTM'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Messages({ selectedUser }) {

  useRTM();
  const dispatch = useDispatch()
  const { ChatMessages } = useSelector(store => store.chat)

  useEffect(() => {
    getAllMessages(selectedUser._id, dispatch)
    
  }, [selectedUser?._id])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2">
      { ChatMessages && ChatMessages.length > 0 ? (ChatMessages?.map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${msg.senderId === selectedUser._id ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
              msg.senderId === selectedUser._id
                ? 'bg-gray-200 text-black rounded-bl-none'
                : 'bg-blue-600 text-white rounded-br-none'
            }`}
          >
            {msg.message}
          </div>
        </div>
      ))):(
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
    <div className="text-5xl">💬</div>
    <div className="text-xl mt-2">No messages yet</div>
    <div className="text-lg">Start the conversation</div>
  </div>
      )
    
    }
      
    </div>
  )
}

export default Messages
