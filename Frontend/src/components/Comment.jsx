import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts } from '@/redux/postSlice';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function Comment({ comment, post, setComment, Comments }) {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const { posts } = useSelector(store => store.post)
  const isAuthor = user?._id === comment?.author?._id;
  let isLiked = comment?.likes?.includes(user?._id) || false;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment?.content);

  const updatePostState = (updatedComment) => {
    const updatedPosts = posts.map(post => {
      if (post._id === comment.postId) {
        const updatedComments = post.comments.map(c => c._id === updatedComment._id ? updatedComment : c);
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    dispatch(setPosts(updatedPosts));
  };

  const deleteCommentHandler = async (id) => {
    try {
      const res = await axios.delete(`https://upchain-tvvm.onrender.com/api/post/${id}/deleteComment`, { withCredentials: true });
      if (res.data.success) {
        const updatedPosts = posts.map(p => {
          if (p._id === res.data.postId) {
            const updatedComments = post.comments.filter(c => c._id !== id);
            setComment(updatedComments)
            return { ...p, comments: updatedComments };
          }
          return p;
        });
        dispatch(setPosts(updatedPosts));
        toast.success("Comment deleted");
      }
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  const likeCommentHandler = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/post/${id}/comment/likeUnlike`, { withCredentials: true });
      if (res.data.success) {
        const updatedComment = res.data.updatedComment;
        updatePostState(updatedComment);
        setComment(prev => prev.map(c => c._id === updatedComment._id ? updatedComment : c));
        isLiked = !isLiked;
      }
    } catch (err) {
      toast.error(err.response?.msg || "Error liking comment");
    }
  };

  const editCommentHandler = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/post/${id}/comment/edit`, 
        { text: editedText }, 
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      
      if (res.data.success) {
        const updatedComment = res.data.updatedComment;
        updatePostState(updatedComment);
        setComment(prev => prev.map(c => c._id === updatedComment._id ? updatedComment : c));
        setIsEditing(false);
        toast.success("Comment updated");
      }
    } catch (err) {
      toast.error("Error updating comment");
    }
  };

  return (
    <div className="flex items-start gap-3 my-4 group">
      <Link to={`/profile/${comment?.author._id}`} className="transition-transform hover:scale-105">
        <Avatar className="w-9 h-9 border-2 border-white shadow-md">
          <AvatarImage 
            src={comment?.author?.profilePicture} 
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-medium flex items-center justify-center">
            {comment?.author?.username?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-3 rounded-2xl shadow-sm relative border border-gray-200 transition-all duration-300 group-hover:shadow-md">
        <div className="flex items-center justify-between mb-1">
          <Link 
            to={`/profile/${comment?.author._id}`} 
            className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors"
          >
            {comment?.author?.username}
          </Link>
          
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-0.5 rounded-full">
              {comment?.likes?.length > 0 ? comment?.likes?.length : "0"}
            </span>
            <button
              onClick={() => likeCommentHandler(comment._id)}
              className={`p-1 rounded-full transition-colors ${isLiked ? 'text-[#ed4956]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {isLiked ? 
                <FaHeart size={14} className="transition-transform hover:scale-110" /> : 
                <FaRegHeart size={14} className="transition-transform hover:scale-110" />
              }
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all resize-none"
              rows="2"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => editCommentHandler(comment._id)}
                className="px-3 py-1 text-xs text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-700 mt-1 break-words">{comment?.content}</p>
        )}

        {isAuthor && !isEditing && (
          <div className="absolute -bottom-3 right-3 flex items-center gap-3 bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
              title="Edit comment"
            >
              <Edit size={14} />
            </button>
            <button 
              onClick={() => deleteCommentHandler(comment._id)}
              className="p-1 text-gray-500 hover:text-red-500 transition-colors"
              title="Delete comment"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;