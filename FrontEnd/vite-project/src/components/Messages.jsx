import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'

function Messages({selectedUser}) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2">
      {  [1,2,3,4].map((msg) =>(
            <div className= {`flex `}>
              <Avatar className="w-8 h-8 mr-4">
                      <AvatarImage
                        className="w-8 h-8 border-1 border-green-600 rounded-full object-cover"
                        src={selectedUser?.profilePicture}
                      />
                      <AvatarFallback
                       className="w-10 border-1 border-green-600 rounded-full aspect-square bg-amber-500">User</AvatarFallback>
                    </Avatar>

                Hello
            </div>
        ))
    }
    </div>

  )
}

export default Messages