import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { DialogContent } from './ui/dialog'
import {  Bookmark, BookmarkCheck, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import {Badge} from '../components/ui/badge.jsx'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { setAuthuser } from '@/redux/authSlice'

function Post({post}) {
  const [text, settext] = useState("");
  const [Open, setOpen] = useState(false);
  const {user} = useSelector(store=>store.auth);
  const {posts} = useSelector(store=>store.post);
  const dispatch = useDispatch();
  const [Liked , setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [likeCounts, setlikeCounts] = useState(post?.likes?.length);
  const [comment , setComment] = useState(post?.comments);
  const [saved , setSaved] = useState(user?.saved?.includes(post._id) || false);

  useEffect(() =>{
    setComment(post.comments);
  }, [post]);
  


  const textchangeHandler = (e) => {
    const inputText = e.target.value.replace(/^\s+/, "");

    if (inputText) {
      settext(inputText);
    }
    else settext("");

  }
  const deletePostHandler = async ()=>{
    try{
      const res = await axios.delete(`http://localhost:8000/api/post/${post._id}/deletePost`, { withCredentials: true });
      console.log("deleted")

      if(res.data.success){
        const updatedPost = posts.filter((postItem)=>postItem._id != post._id);
        dispatch(setPosts(updatedPost));

        toast.success(res.data.msg);
      }

    }
    catch(error){
      console.log(error);
      toast.error(error.response.msg);
    }


  }
  const commentHanlder = async()=>{
    try{
      const res = await axios.post(`http://localhost:8000/api/post/${post._id}/addComment`, {text} , { 
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials: true });
        console.log("comment added");

        if(res.data.success){
          const updatedComment = [...comment , res.data.comment];
          setComment(updatedComment);

          const upadtedPostData = posts.map(p=>
            p._id === post._id ?{
              ...p , comments:updatedComment
            }:p
          )

          dispatch(setPosts(upadtedPostData));
          settext("");
        }

      toast.success(res.data.msg)

    }catch(err){
      console.log(err);
      toast.error(res.data.msg);

    }
  }

  const likeorUnlike = async()=>{
    try{
      const res = await axios.get(`http://localhost:8000/api/post/${post._id}/like_unlike`, { withCredentials: true });
      if(res.data.success){
        const likes = Liked?likeCounts - 1: likeCounts+1;
        setlikeCounts(likes)
        const updatedPostData = posts.map(
          p=>
            p._id === post._id?{
              ...p,
              likes:Liked?
               p.likes.filter(id => id !== user._id) : [...p.likes , user._id]
            }:p
        )
        dispatch(setPosts(updatedPostData))
        setLiked(!Liked);
        toast.success(res.data.msg)
      }
    }
    catch(err){
      console.log(err);
      toast.error(err.response.msg);

    }
  }
  const handleKeyPress = (e) => {
  if (e.key === 'Enter' && text.trim()) commentHanlder();
};
const saveHandler = async()=>{
  try{
      const res = await axios.get(`http://localhost:8000/api/post/${post._id}/save`, { withCredentials: true });
      if(res.data.success){
        dispatch(setAuthuser(res.data.user))
        toast.success(res.data.msg)
        if(res.data.str === "Saved"){
          setSaved(true);
        }
        else{
          setSaved(false);
        }
      }
    }
    catch(err){
    
      toast.error(err.response.msg);

    }
}

  return (
    <div className="w-full max-w-md mx-auto my-6  rounded-md">

      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3 px-2 py-1">
  <Link to={`/profile/${post.author._id}`} className="flex items-center gap-2">
    <Avatar className="h-8 w-8">
      <AvatarImage
        src={post?.author?.profilePicture}
        alt="user"
        className="object-cover"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <span className="font-semibold text-sm text-gray-800">{post.author.username}</span>
  </Link>

  {user?._id === post?.author._id && (
    <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5">
      Author
    </Badge>
  )}
</div>

        <Dialog>

          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          
          <DialogContent className="p-0 text-sm text-center bg-white border-0">
            {
              user &&  user._id !== post.author._id &&
              <Button className="w-full py-4 bg-gray-800 text-[#ED4956] rounded-none">Unfollow</Button>

            }
            <Button className="w-full py-4 bg-gray-800 text-white rounded-none">Add to favorites</Button>
 
          {
            user &&  user._id === post.author._id &&
            <Button onClick={deletePostHandler}  className="w-full py-4 bg-gray-800 text-[#ED4956] rounded-none">Delete</Button>
          }
          <Button className="w-full py-4 bg-gray-800 text-white rounded-none">Cancel</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <img
        src={post.image}
        className="w-full aspect-square object-cover"
        alt="post"
      />

      {/* Action Bar */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-4">
          {
            Liked ?
            <FaHeart onClick={likeorUnlike} size={'24'} className="text-xl  text-[#ed4956] cursor-pointer" />
            :
          <FaRegHeart onClick={likeorUnlike} size={'22'} className="text-xl cursor-pointer" />
          }
          
          <MessageCircle onClick={  () =>{
            dispatch(setSelectedPost(post));
            setOpen(true)}
            } className="text-xl cursor-pointer" />
          <Send className="text-xl cursor-pointer" />
        </div>
        {
            saved?
            <BookmarkCheck onClick={saveHandler} size={'24'} className="text-xl  cursor-pointer" />
            :
          <Bookmark onClick={saveHandler}  size={'24'} className="text-xl cursor-pointer" />
          }

        {/* <Bookmark className="text-xl cursor-pointer" /> */}
      </div>

      {/* Likes */}
      <div className="px-3 pb-3 text-sm font-medium">{likeCounts} likes </div>

      <p>
        <span className="px-3 pb-3 text-sm font-medium">{post.author.username}</span>
       {post.caption} 
      </p>
      {
        comment.length > 0 &&
        (
          <span onClick={  () =>{
            dispatch(setSelectedPost(post));
            setOpen(true)}
            }  className=' cursor-pointer text-gray-400 px-3 pb-3'> view all {comment.length} comments</span>
        )
      }


      <CommentDialog Open={Open} setOpen={setOpen} post ={post} />

      <div className=' px-3 pb-3 flex justify-between items-center'>
        <input
          type='text'
          placeholder='Add a Comment...'
          onChange={textchangeHandler}
          value={text}
          onKeyDown={handleKeyPress}
          className='  outline-none text-sm w-full'
        />

        {text &&
          <span onClick={commentHanlder} className='text-[#3BADF8] cursor-pointer' > Post </span>

        }
      </div>
    </div>

  )
}

export default Post 