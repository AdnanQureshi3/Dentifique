import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, Heart, Edit } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts } from '@/redux/postSlice';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function Comment({ comment, post, setComment, Comments }) {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const { posts } = useSelector(store => store.post)
  const isAuthor = user?._id === comment?.author?._id;
  const isLiked = comment?.likes?.includes(user?._id) || false;
 


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
      const res = await axios.delete(`http://localhost:8000/api/post/${id}/deleteComment`, { withCredentials: true });
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
      if (res.data.success)
        {
           const updatedComment = res.data.updatedComment;

          updatePostState(updatedComment );

          setComment(prev =>
          prev.map(c => c._id === updatedComment._id ? updatedComment : c));
          console.log(res.data.str)
          isLiked  = !isLiked ;

          
        } 


      

    } catch {
      toast.error(err.res.msg);
    }
  };

  const editCommentHandler = async (id) => {
    try {

      const res = await axios.put(`http://localhost:8000/api/post/${id}/comment/edit`, { text: editedText }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (res.data.success) {
       const updatedComment = res.data.updatedComment;
        updatePostState(res.data.updatedComment);
        
        setComment(prev =>
          prev.map(c => c._id === updatedComment._id ? updatedComment : c)
        );


        setIsEditing(false);
        toast.success("Comment updated");
      }
    } catch {
      toast.error("Error updating comment");
    }
  };

  return (
    <div className="flex items-start gap-2 my-2 group">
      <Link to={`/profile/${comment?.author._id}`}>
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </Link>

      <div className="bg-gray-100 px-3 py-2 rounded-lg w-full max-w-[85%] relative">
        <div>
          <Link to={`/profile/${comment?.author._id}`} className="text-sm font-semibold text-gray-800 hover:underline">
            {comment?.author?.username}
          </Link>
          {isEditing ? (
            <div className="mt-1">
              <input
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="text-sm border px-2 py-1 rounded w-full mt-1"
              />
              <button onClick={() => { editCommentHandler(comment._id) }} className="text-blue-500 text-xs font-semibold mt-1">
                Save
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-700 mt-1 break-words">{comment?.content}</p>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-600 mt-3">
          <div
            className={`cursor-pointer flex items-center gap-1 `}
            onClick={() => likeCommentHandler(comment._id)}
          >
            <span>{comment?.likes?.length> 0 && comment?.likes?.length} </span>
            {
                        isLiked ?
                        <FaHeart size={16} className="text-xl  text-[rgb(240,100,100)] cursor-pointer" />
                        :
                      <FaRegHeart size={14} className="text-xl cursor-pointer" />
                      }
            {/* <Heart size={14} /> */}
          </div>
          {isAuthor && (
            <>
              <div className="cursor-pointer flex items-center gap-1 text-blue-500" onClick={() => setIsEditing(!isEditing)}>
                <Edit size={14} />
                <span>Edit</span>
              </div>
              <div className="cursor-pointer flex items-center gap-1 text-red-500" onClick={() => deleteCommentHandler(comment._id)}>
                <Trash2 size={14} />
                <span>Delete</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>

  );
}

export default Comment;
