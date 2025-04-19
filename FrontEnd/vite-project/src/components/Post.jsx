import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { DialogContent } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'

function Post() {
  const [text, settext] = useState("");
  const [Open, setOpen] = useState(false);

  const textchangeHandler = (e) => {
    const inputText = e.target.value.trim();
    if (inputText) {
      settext(inputText);
    }
    else settext("");

  }

  return (
    <div className="w-full max-w-md mx-auto my-6  rounded-md">

      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="" alt="user" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm">username</span>
        </div>
        <Dialog>

          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="p-0 text-sm text-center bg-white border-0">
            <Button className="w-full py-4 bg-gray-800 text-[#ED4956] rounded-none">Unfollow</Button>
            <Button className="w-full py-4 bg-gray-800 text-white rounded-none">Add to favorites</Button>
            <Button className="w-full py-4 bg-gray-800 text-white rounded-none">Cancel</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <img
        src="https://images.unsplash.com/photo-1733506903133-9d65b66d299a?w=600&auto=format"
        className="w-full aspect-square object-cover"
        alt="post"
      />

      {/* Action Bar */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-4">
          <FaRegHeart className="text-xl cursor-pointer" />
          <MessageCircle onClick={() => setOpen(true)} className="text-xl cursor-pointer" />
          <Send className="text-xl cursor-pointer" />
        </div>
        <Bookmark className="text-xl cursor-pointer" />
      </div>

      {/* Likes */}
      <div className="px-3 pb-3 text-sm font-medium">1,234 likes</div>

      <p>
        <span className="px-3 pb-3 text-sm font-medium">username</span>
        Work hard, that's how you'll get it
      </p>
      <span onClick={() => setOpen(true)} className=' cursor-pointer text-gray-400 px-3 pb-3'> view all 342 comments</span>


      <CommentDialog Open={Open} setOpen={setOpen} />

      <div className=' px-3 pb-3 flex justify-between items-center'>
        <input
          type='text'
          placeholder='Add a Comment...'
          onChange={textchangeHandler}
          value={text}
          className='  outline-none text-sm w-full'
        />

        {text &&
          <span className='text-[#3BADF8] '> Post </span>

        }
      </div>
    </div>

  )
}

export default Post 