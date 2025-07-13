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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() =>{
    setComment(post?.comments);
  }, [post]);

  const textchangeHandler = (e) => {
    const inputText = e.target.value.replace(/^\s+/, "");
    settext(inputText);
  }

  const deletePostHandler = async ()=>{
    try{
      const res = await axios.delete(`http://localhost:8000/api/post/${post._id}/deletePost`, { withCredentials: true });
      if(res.data.success){
        const updatedPost = posts.filter((postItem)=>postItem._id != post._id);
        dispatch(setPosts(updatedPost));
        toast.success(res.data.msg);
      }
    } catch(error){
      toast.error(error.response.msg);
    }
  }

  const commentHanlder = async()=>{
    try{
      const res = await axios.post(`http://localhost:8000/api/post/${post._id}/addComment`, {text} , { 
        headers:{ 'Content-Type':'application/json' }, withCredentials: true });
      if(res.data.success){
        const updatedComment = [...comment , res.data.comment];
        setComment(updatedComment);
        const upadtedPostData = posts.map(p => p._id === post._id ? { ...p , comments:updatedComment } : p);
        dispatch(setPosts(upadtedPostData));
        settext("");
        toast.success(res.data.msg);
      }
    } catch(err){
      toast.error(err.response.msg);
    }
  }

  const likeorUnlike = async()=>{
    try{
      const res = await axios.get(`http://localhost:8000/api/post/${post._id}/like_unlike`, { withCredentials: true });
      if(res.data.success){
        const likes = Liked?likeCounts - 1: likeCounts+1;
        setlikeCounts(likes)
        const updatedPostData = posts.map(p =>
          p._id === post._id ? {
            ...p,
            likes: Liked ? p.likes.filter(id => id !== user._id) : [...p.likes , user._id]
          } : p
        )
        dispatch(setPosts(updatedPostData))
        setLiked(!Liked);
        toast.success(res.data.msg)
      }
    } catch(err){
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
        setSaved(res.data.str === "Saved")
      }
    } catch(err){
      toast.error(err.response.msg);
    }
  }

  const isTextOnly = !post.image || post.type === 'article';

  return (
    <div className="w-full max-w-md mx-auto my-6 rounded-md bg-white shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3 px-2 py-1">
          <Link to={`/profile/${post.author._id}`} className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post?.author?.profilePicture} alt="user" className="object-cover" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-sm text-gray-800">{post.author.username}</span>
          </Link>
          {user?._id === post?.author._id && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5">Author</Badge>
          )}
        </div>
        <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="w-64 cursor-pointer p-0 overflow-hidden bg-white rounded-xl shadow-lg border border-gray-200">
            {user && user._id !== post.author._id && (
              <Button className="w-full cursor-pointer py-3 text-red-500 bg-white hover:bg-gray-100 rounded-none border-b">Unfollow</Button>
            )}
            <Button onClick={saveHandler} className="w-full cursor-pointer py-3 bg-white hover:bg-gray-100 text-gray-800 rounded-none border-b">
              {saved ? 'Remove from favourite' : 'Add to favourite'}
            </Button>
            {user && user._id === post.author._id && (
              <Button onClick={deletePostHandler} className="w-full py-3 cursor-pointer text-red-600 bg-white hover:bg-gray-100 rounded-none border-b">Delete</Button>
            )}
            <Button onClick={() => setMenuOpen(false)} className="w-full cursor-pointer py-3 bg-white hover:bg-gray-100 text-gray-700 rounded-none">Cancel</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image or Text */}
      {isTextOnly ? (
        <div
          className="px-4 pb-3 text-sm text-gray-800 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: post.caption }}
        />
      ) : (
        <img src={post.image} className="w-full aspect-square object-cover" alt="post" />
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-4">
          {Liked ? (
            <FaHeart onClick={likeorUnlike} size={24} className="text-[#ed4956] cursor-pointer" />
          ) : (
            <FaRegHeart onClick={likeorUnlike} size={22} className="cursor-pointer" />
          )}
          <MessageCircle onClick={() => { dispatch(setSelectedPost(post)); setOpen(true) }} className="cursor-pointer" />
          <Send className="cursor-pointer" />
        </div>
        {saved ? (
          <BookmarkCheck onClick={saveHandler} size={24} className="cursor-pointer" />
        ) : (
          <Bookmark onClick={saveHandler} size={24} className="cursor-pointer" />
        )}
      </div>

      {/* Likes and Caption */}
      <div className="px-3 pb-1 text-sm font-medium">{likeCounts} likes</div>
      {!isTextOnly && <p className="px-3 text-sm"><span className="font-medium">{post.author.username}</span> {post.caption}</p>}

      {/* Comments */}
      {comment.length > 0 && (
        <span onClick={() => { dispatch(setSelectedPost(post)); setOpen(true) }} className='cursor-pointer text-gray-400 px-3 pb-3'>
          view all {comment.length} comments
        </span>
      )}

      <CommentDialog deletePostHandler={deletePostHandler} saved={saved} saveHandler={saveHandler} Open={Open} setOpen={setOpen} post={post} />

      <div className='px-3 pb-3 flex justify-between items-center'>
        <input
          type='text'
          placeholder='Add a Comment...'
          onChange={textchangeHandler}
          value={text}
          onKeyDown={handleKeyPress}
          className='outline-none text-sm w-full'
        />
        {text && <span onClick={commentHanlder} className='text-[#3BADF8] cursor-pointer'>Post</span>}
      </div>
    </div>
  )
}

export default Post;
