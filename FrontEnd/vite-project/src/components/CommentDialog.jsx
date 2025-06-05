import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { MoreHorizontal } from 'lucide-react';
import Comment from './Comment';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner'
import axios from 'axios';
import { setPosts } from '@/redux/postSlice';
import { useEffect } from 'react';




function CommentDialog({ Open, setOpen, post }) {
    

    const [text, setText] = useState("");
    const selectedPost = useSelector(store => store.selectedPost)
    const [Comments, setComment] = useState(post?.comments);
    const dispatch = useDispatch();
    const {posts} = useSelector(store=>store.post);
    const ChangeEventHandler = (e) => {
        const text = e.target.value;
        if (text.trim()) {
            setText(text);
        }
        else setText("");
    }
    useEffect(() => {
        setComment(post.comments)

  if (Open) document.body.style.overflow = 'hidden';
  else document.body.style.overflow = 'auto';

  return () => {
    document.body.style.overflow = 'auto';
  };
}, [Open]);

    const commentHanlder = async()=>{
    try{
      const res = await axios.post(`http://localhost:8000/api/post/${post._id}/addComment`, {text} , { 
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials: true });
        
        if(res.data.success){
            console.log("comment added");
          const updatedComment = [...Comments , res.data.comment];
          setComment(updatedComment);

          const upadtedPostData = posts.map(p=>
            p._id === post._id ?{
              ...p , comments:updatedComment
            }:p
          )

          dispatch(setPosts(upadtedPostData));
          setText("");
          toast.success(res.data.msg)

        }


    }catch(err){
      console.log(err);
      toast.error(res.data.msg);

    }
  }
  const handleKeyPress = (e) => {
  if (e.key === 'Enter' && text.trim()) commentHanlder();
};




    return (
        <Dialog open={Open}>
            <DialogContent
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[70%] md:w-[60%] max-w-4xl p-0 h-[85vh] bg-white rounded-lg shadow-lg z-50 overflow-hidden"
                onInteractOutside={() => setOpen(false)} >
                <div className='flex flex-1 h-full'>

                    {/* Image Section */}
                    <div className='w-[45%]  bg-gray-100'>
                        <img
                            src={post.image}
                            alt="post"
                            className=' absolute w-[45%] top-1/2 -translate-y-1/2 transform  object-cover rounded-lg '
                        />
                    </div>

                    {/* Content Section */}
                    <div className='w-full sm:w-[55%] p-4 flex flex-col justify-between'>
                        <div className='flex items-center justify-between border-b-[1px] pb-2 border-gray-6 00 '>
                            <div className='flex items-center gap-3'>
                                <Link to={`/profile/${post?.author._id}`} >
                                    <Avatar className=" w-2 rounded-full">
                                        <AvatarImage className='w-10 aspect-square border-2 border-green-600 rounded-full' src={post.author.profilePicture} />
                                        {/* <AvatarFallback></AvatarFallback> */}
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link to={`/profile/${post?.author._id}`} className='font-semibold text-sm text-gray-800 hover:text-blue-500 transition duration-200 ease-in'>
                                        {post.author.username}
                                    </Link>
                                    <p className='text-xs text-gray-500 mt-1'>Just now</p>
                                </div>
                            </div>

                            {/* More Options Dialog */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className="cursor-pointer text-gray-500 hover:text-gray-800 transition duration-200 relative z-10" />
                                </DialogTrigger>
                                <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-2 p-0 text-sm text-center bg-white border-0 rounded-lg shadow-lg">
                                    <Button className="w-full py-4 bg-gray-800 text-[#ED4956] rounded-none hover:bg-red-600">
                                        Unfollow
                                    </Button>
                                    <Button className="w-full py-4 bg-gray-800 text-white rounded-none hover:bg-gray-700">
                                        Add to favorites
                                    </Button>
                                    <Button className="w-full py-4 bg-gray-800 text-white rounded-none hover:bg-gray-700">
                                        Cancel
                                    </Button>
                                </DialogContent>
                            </Dialog>


                        </div>

                        {/* Comments Section */}

                        {/* <hr />  */}

                        <div className='flex flex-col h-full'>
                            <div className='flex-1 overflow-y-auto pr-1 space-y-2'>
{Comments && [...Comments].reverse().map(c => <Comment key={c._id} comment={c} />)}
                            </div>
                            <div className='mt-10 flex sticky bottom-3 bg-white  items-center gap-2'>
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    onChange={ChangeEventHandler}
                                    value={text}
                                    onKeyDown={handleKeyPress}
                                    className="w-full p-2 text-sm text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Button onClick={commentHanlder}
                                    disabled={!text}
                                    variant={'outline'}
                                    className='cursor-pointer'>Post</Button>
                            </div>
                        </div>

                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CommentDialog;
