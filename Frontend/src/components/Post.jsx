import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { DialogContent } from './ui/dialog';
import { Bookmark, BookmarkCheck, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge.jsx';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { setAuthuser } from '@/redux/authSlice';
import EmojiSelector from './EmojiSelector';

function Post({ post }) {
  const [text, settext] = useState("");
  const [Open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const dispatch = useDispatch();
  const [Liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [likeCounts, setlikeCounts] = useState(post?.likes?.length);
  const [comment, setComment] = useState(post?.comments);
  const [saved, setSaved] = useState(user?.saved?.includes(post._id) || false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setComment(post?.comments);
  }, [post]);

  const textchangeHandler = (e) => {
    const inputText = e.target.value.replace(/^\s+/, "");
    settext(inputText ? inputText : "");
  }

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`http://localhost:8000/api/post/${post._id}/deletePost`, { withCredentials: true });
      if (res.data.success) {
        const updatedPost = posts.filter((postItem) => postItem._id != post._id);
        dispatch(setPosts(updatedPost));
        toast.success(res.data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.msg);
    }
  }

  const commentHanlder = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/post/${post._id}/addComment`, { text }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        const updatedComment = [...comment, res.data.comment];
        setComment(updatedComment);
        const upadtedPostData = posts.map(p =>
          p._id === post._id ? {
            ...p, comments: updatedComment
          } : p
        )
        dispatch(setPosts(upadtedPostData));
        settext("");
        toast.success(res.data.msg);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.msg);
    }
  }

  const likeorUnlike = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/post/${post._id}/like_unlike`, { withCredentials: true });
      if (res.data.success) {
        const likes = Liked ? likeCounts - 1 : likeCounts + 1;
        setlikeCounts(likes);
        const updatedPostData = posts.map(
          p =>
            p._id === post._id ? {
              ...p,
              likes: Liked ?
                p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
            } : p
        );
        dispatch(setPosts(updatedPostData));
        setLiked(!Liked);
        toast.success(res.data.msg);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.msg);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && text.trim()) commentHanlder();
  };
  
  const saveHandler = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/post/${post._id}/save`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthuser(res.data.user));
        toast.success(res.data.msg);
        setSaved(res.data.str === "Saved");
      }
    } catch (err) {
      toast.error(err.response.msg);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto my-6 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link 
            to={`/profile/${post.author._id}`} 
            className="flex items-center gap-2 group"
          >
            <Avatar className="h-10 w-10 border-2 border-white shadow-md group-hover:border-blue-300 transition-colors">
              <AvatarImage
                src={post?.author?.profilePicture}
                alt="user"
                className="object-cover rounded-full"
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold flex items-center justify-center">
                {post.author.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                {post.author.username}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </Link>

          {user?._id === post?.author._id && (
            <Badge className="ml-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm">
              Author
            </Badge>
          )}
        </div>

        <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
          <DialogTrigger asChild>
            <MoreHorizontal className="text-gray-500 hover:text-gray-800 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors" />
          </DialogTrigger>
          
          <DialogContent className="w-56 p-0 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="py-2">
              {user && user._id !== post.author._id && (
                <Button className="w-full text-left py-3 text-red-500 hover:bg-red-50 rounded-none border-b flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Unfollow</span>
                </Button>
              )}
              <Button 
                onClick={saveHandler} 
                className="w-full text-left py-3 hover:bg-gray-100 text-gray-800 rounded-none border-b flex items-center gap-2"
              >
                {saved ? (
                  <>
                    <BookmarkCheck size={18} />
                    <span>Remove from saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark size={18} />
                    <span>Add to saved</span>
                  </>
                )}
              </Button>
              {user && user._id === post.author._id && (
                <Button
                  onClick={deletePostHandler}
                  className="w-full text-left py-3 text-red-600 hover:bg-red-50 rounded-none border-b flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Delete</span>
                </Button>
              )}
              <Button 
                onClick={() => setMenuOpen(false)} 
                className="w-full text-left py-3 hover:bg-gray-100 text-gray-700 rounded-none flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Cancel</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <div className="relative overflow-hidden group">
        <img
          src={post.image}
          className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
          alt="post"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-4">
          <button 
            onClick={likeorUnlike}
            className="flex items-center gap-1 group"
          >
            {Liked ? (
              <FaHeart size={24} className="text-[#ed4956] transition-transform hover:scale-110" />
            ) : (
              <FaRegHeart size={22} className="text-gray-600 transition-all duration-300 group-hover:text-[#ed4956] hover:scale-110" />
            )}
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {likeCounts}
            </span>
          </button>
          
          <button 
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="flex items-center gap-1 group"
          >
            <MessageCircle className="text-gray-600 transition-all duration-300 group-hover:text-blue-500 hover:scale-110" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {comment.length}
            </span>
          </button>
          
          <button className="text-gray-600 hover:text-blue-500 transition-colors hover:scale-110">
            <Send />
          </button>
        </div>
        
        <button 
          onClick={saveHandler}
          className={`p-2 rounded-full transition-colors ${saved ? 'text-blue-500 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          {saved ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
        </button>
      </div>

      {/* Caption */}
      <div className="px-5 pb-2">
        <p className="text-gray-800">
          <span className="font-bold mr-2">{post.author.username}</span>
          {post.caption}
        </p>
      </div>

      {/* Comments Preview */}
      {comment.length > 0 && (
        <div className="px-5 pb-3">
          <button 
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium inline-flex items-center"
          >
            View all {comment.length} comments
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Add Comment */}
      <div className='px-5 pb-4 flex items-center gap-2 border-t border-gray-200 pt-3'>
         <EmojiSelector onSelect={(emoji) => settext(prev => prev + emoji)} />
        <input
          type='text'
          placeholder='Add a comment...'
          onChange={textchangeHandler}
          value={text}
          onKeyDown={handleKeyPress}
          className='flex-1 p-3 text-sm text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
        />
        {text && (
          <button 
            onClick={commentHanlder}
            className="text-blue-500 hover:text-blue-700 font-medium px-4 py-2 rounded-full hover:bg-blue-50 transition-colors"
          >
            Post
          </button>
        )}
      </div>

      <CommentDialog 
        deletePostHandler={deletePostHandler} 
        saved={saved} 
        saveHandler={saveHandler} 
        Open={Open} 
        setOpen={setOpen} 
        post={post} 
      />
    </div>
  )
}

export default Post;