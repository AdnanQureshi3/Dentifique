import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { MoreHorizontal } from 'lucide-react';
import Comment from './Comment.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts } from '@/redux/postSlice';
import parse from 'html-react-parser';
import { X } from "lucide-react"
import EmojiSelector from './EmojiSelector.jsx';


function CommentDialog({ deletePostHandler, Open, setOpen, post, saveHandler, saved }) {
    const isPost = post?.type === 'post';
    const [text, setText] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [Comments, setComment] = useState(post?.comments);
    const dispatch = useDispatch();
    const { posts } = useSelector(store => store.post);
    const { user } = useSelector(store => store.auth);

    const ChangeEventHandler = e => {
        const value = e.target.value.trim();
        setText(value ? value : '');
    };

    useEffect(() => {
        setComment(post?.comments);
        document.body.style.overflow = Open ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [Open]);

    const commentHanlder = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/post/${post._id}/addComment`, { text }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (res.data.success) {
                const updatedComment = [...Comments, res.data.comment];
                setComment(updatedComment);
                const updatedPosts = posts.map(p => p._id === post._id ? { ...p, comments: updatedComment } : p);
                dispatch(setPosts(updatedPosts));
                setText('');
                toast.success(res.data.msg);
            }
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to add comment');
        }
    };

    const handleKeyPress = e => {
        if (e.key === 'Enter' && text.trim()) commentHanlder();
    };

    return (
        <Dialog open={Open}>
            <DialogContent
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                // onInteractOutside={() => setOpen(false)}
                  onInteractOutside={() => setOpen(false)}
            >

                <div className={`flex ${isPost ? 'flex-row' : 'flex-row-reverse'} relative bg-white rounded-xl overflow-hidden shadow-2xl w-full max-w-6xl h-[85vh]`}>

                    <button onClick={() => setOpen(false)} className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded">
                        <X className="w-5 h-5" />
                        </button>

                    {/* Media Content Area */}
                    {isPost ? (
                        <div className='flex-1 relative overflow-hidden bg-gradient-to-br from-gray-900 to-black'>
                            <img 
                                src={post.image} 
                                alt="post" 
                                className='absolute inset-0 w-full h-full object-contain p-4' 
                            />
                        </div>
                    ) : (
                        <div className='flex-1 relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-auto p-6'>

                <button onClick={() => setOpen(false)} className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded">
                        <X className="w-5 h-5" />
                        </button>

                            <div className="max-w-3xl mx-auto ">
                                
                                <div className="bg-white text-wrap rounded-xl shadow-sm p-5 mb-4">
                                    <h1 className='text-3xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200'>
                                        {parse(String(post?.title || ''))}
                                    </h1>
                                    <div className=" max-w-none [&_pre]:text-wrap text-gray-700">
                                        {parse(String(post?.caption || ''))}
                                    </div>
                                </div>
                                
                                {post?.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {post.tags.map((tag, index) => (
                                            <span 
                                                key={index} 
                                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Comments Area */}
                    <div className={`w-full ${isPost ? 'md:w-[40%]' : 'md:w-[30%]'} flex flex-col bg-white`}>
                        <div className='p-5 border-b border-gray-200'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <Link to={`/profile/${post?.author?._id}`} className="group">
                                        <Avatar className="w-10 h-10 border-2 border-white shadow-md group-hover:border-blue-300 transition-colors">
                                            <AvatarImage 
                                                className='w-[70px] h-[70px] object-cover rounded-full' 
                                                src={post?.author?.profilePicture} 
                                            />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold flex items-center justify-center">
                                                {post?.author?.username?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div>
                                        <Link 
                                            to={`/profile/${post?.author?._id}`} 
                                            className='font-bold text-gray-800 hover:text-blue-600 transition-colors'
                                        >
                                            {post?.author?.username}
                                        </Link>
                                        <p className='text-xs text-gray-500 mt-1'>
                                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={saveHandler}
                                        className={`p-2 rounded-full transition-colors ${saved ? 'text-blue-500 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'}`}
                                    >
                                        {saved ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                    
                                    <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
                                        <DialogTrigger asChild>
                                            <MoreHorizontal className="text-gray-500 hover:text-gray-800 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors" />
                                        </DialogTrigger>
                                        <DialogContent className="w-56 p-0 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                                            <div className="py-2">
                                                {user && user._id !== post?.author?._id && (
                                                    <button className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Unfollow</span>
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={saveHandler}
                                                    className="w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 flex items-center gap-2"
                                                >
                                                    {saved ? (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                            </svg>
                                                            <span>Remove from saved</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                            </svg>
                                                            <span>Add to saved</span>
                                                        </>
                                                    )}
                                                </button>
                                                {user && user._id === post?.author?._id && (
                                                    <button 
                                                        onClick={deletePostHandler}
                                                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Delete</span>
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => setMenuOpen(false)}
                                                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>Cancel</span>
                                                </button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col flex-1 overflow-hidden'>
                            <div className='flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar'>
                                {Comments && [...Comments].reverse().map(c => (
                                    <Comment key={c._id} setComment={setComment} Comments={Comments} comment={c} post={post} />
                                ))}
                                
                                {Comments.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                                        <div className="bg-gray-100 p-5 rounded-full mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-700">No comments yet</h3>
                                        <p className="text-gray-500 mt-2">Be the first to share your thoughts!</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className='sticky bottom-0 bg-white border-t border-gray-200 p-4'>
                                <div className='flex items-center gap-2'>
                                <EmojiSelector onSelect={(emoji) => setText(prev => prev + emoji)} />
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        onChange={ChangeEventHandler}
                                        value={text}
                                        onKeyDown={handleKeyPress}
                                        className="flex-1 p-3 text-sm text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    <Button 
                                        onClick={commentHanlder} 
                                        disabled={!text}
                                        className="rounded-full px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50"
                                    >
                                        Post
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CommentDialog;