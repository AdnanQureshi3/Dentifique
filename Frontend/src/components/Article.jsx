import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { DialogContent } from './ui/dialog'
import { Bookmark, BookmarkCheck,  MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog.jsx'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { Badge } from './ui/badge.jsx'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { setAuthuser } from '@/redux/authSlice'
import parse from 'html-react-parser';
import EmojiSelector from './EmojiSelector.jsx'
import ReportHandler from '@/Hooks/ReportHandler'
import CopyBox from './Copy.jsx'

function Article({ post }) {
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
    const [openCopy  ,setopenCopy] = useState(false);

    useEffect(() => {
        setComment(post?.comments);
    }, [post]);

    const textchangeHandler = (e) => {
        const inputText = e.target.value.replace(/^\s+/, "");
        settext(inputText ? inputText : "");
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/post/${post._id}/deletePost`, { withCredentials: true });
            if (res.data.success) {
                const updatedPost = posts.filter((postItem) => postItem._id != post._id);
                dispatch(setPosts(updatedPost));
                toast.success(res.data.msg);
            }
        }
        catch (error) {
            console.log(error);
            toast.error(error.response.msg);
        }
    }

    const commentHanlder = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/post/${post._id}/addComment`, { text }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedComment = [...comment, res.data.comment];
                setComment(updatedComment);
                const upadtedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedComment } : p
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
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/post/${post._id}/like_unlike`, { withCredentials: true });
            if (res.data.success) {
                const likes = Liked ? likeCounts - 1 : likeCounts + 1;
                setlikeCounts(likes);
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: Liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
                setLiked(!Liked);
                toast.success(res.data.msg);
            }
        }
        catch (err) {
            console.log(err);
            toast.error(err.response.msg);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && text.trim()) commentHanlder();
    };

    const saveHandler = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/post/${post._id}/save`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthuser(res.data.user));
                toast.success(res.data.msg);
                setSaved(res.data.str === "Saved");
            }
        }
        catch (err) {
            toast.error(err.response.msg);
        }
    }

    const [showReport, setShowReport] = useState(false);


    return (
        <div className="w-full max-w-2xl mx-auto my-8 bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <Link
                        to={`/profile/${post.author._id}`}
                        className="flex items-center gap-2 group"
                    >
                        <Avatar className="h-10 w-10 border-2 border-white shadow-md transition-transform duration-300 group-hover:scale-105">
                            <AvatarImage
                                src={post?.author?.profilePicture}
                                alt="user"
                                className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-medium">
                                {post.author.username.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                {post.author.username}
                            </span>
                            <span className="text-xs text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString()}
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
                        <MoreHorizontal className="cursor-pointer text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100" />
                    </DialogTrigger>
                    <DialogContent className="w-56 p-0 overflow-hidden bg-white rounded-xl shadow-xl border border-gray-200">
                        {user && user._id !== post.author._id && (
                            <Button className="w-full py-3 text-red-500 bg-white hover:bg-red-50 rounded-none border-b border-gray-100 flex items-center justify-start gap-2">
                                <span>Unfollow</span>
                            </Button>
                        )}
                        <Button
                            onClick={saveHandler}
                            className="w-full py-3 bg-white hover:bg-gray-50 text-gray-800 rounded-none border-b border-gray-100 flex items-center justify-start gap-2"
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
                                className="w-full py-3 text-red-600 bg-white hover:bg-red-50 rounded-none border-b border-gray-100 flex items-center justify-start gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>Delete</span>
                            </Button>
                        )}
                        {user && user._id === post.author._id && (
                            <Button
                                onClick={() =>{setShowReport(true)}}
                                className="w-full py-3 text-red-600 bg-white hover:bg-red-50 rounded-none border-b border-gray-100 flex items-center justify-start gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 2a1 1 0 00-1 1v18a1 1 0 102 0v-7h9.382l1.724 3.447A1 1 0 0020 17V5a1 1 0 00-1.894-.447L16.382 8H7V3a1 1 0 00-1-1z" />
                                </svg>

                                <span>Report</span>
                            </Button>
                        )} 
                        <Button
                            onClick={() => setMenuOpen(false)}
                            className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-none flex items-center justify-start gap-2"
                        >
                            <span>Cancel</span>
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Content */}
            <div className="p-5">
                <h1 className='text-2xl font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100'>
                    {parse(String(post?.title || ''))}
                </h1>

                <div className="prose prose-sky max-w-none break-words
                    [&_pre]:bg-gray-900 [&_pre]:text-gray-800 [&_pre]:p-4 
                    [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:shadow-inner
                    [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
                    [&_a]:text-blue-500 [&_a]:hover:underline
                    [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:text-gray-600
                    [&_ol]:list-decimal [&_ul]:list-disc [&_li]:ml-5
                ">
                    {parse(String(post?.caption || '').slice(0, 400))}
                    {String(post?.caption || '').length > 400 && (
                        <button
                            onClick={() => setOpen(true)}
                            className='text-blue-500 hover:text-blue-700 font-medium transition-colors mt-2 inline-flex items-center'
                        >
                            ...Read more
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-b border-gray-100 bg-gray-50">
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
                        onClick={() => { dispatch(setSelectedPost(post)); setOpen(true) }}
                        className="flex items-center gap-1 group"
                    >
                        <MessageCircle className="text-gray-600 transition-all duration-300 group-hover:text-blue-500 hover:scale-110" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                            {comment.length}
                        </span>
                    </button>

                    <button onClick={() =>{
                        console.log("opening");
                            setopenCopy(true);
                        }} className="text-gray-600 hover:text-blue-500 transition-colors hover:scale-110">
                        <Send  />
                    </button>
                </div>

                <button
                    onClick={saveHandler}
                    className={`p-2 rounded-full transition-colors ${saved ? 'text-blue-500 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    {saved ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
                </button>
            </div>

            {/* Comments Preview */}
            {comment.length > 0 && (
                <div className="px-5 py-3 bg-white">
                    <div
                        onClick={() => { dispatch(setSelectedPost(post)); setOpen(true) }}
                        className="cursor-pointer text-gray-500 hover:text-blue-500 transition-colors inline-flex items-center"
                    >
                        View all {comment.length} comments
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>

                    {/* Show last comment */}
                    {comment.length > 0 && (
                        <div className="mt-2 flex items-start gap-2">
                            <span className="font-semibold text-sm text-gray-800">
                                {comment[comment.length - 1].author.username}:
                            </span>
                            <p className="text-gray-600 text-sm line-clamp-2">
                                {comment[comment.length - 1].text}
                            </p>
                        </div>
                    )}
                </div>
            )}
            <CopyBox url= {`${import.meta.env.VITE_API_URL}/api/post/${post._id}`} 
            open={openCopy} setOpen= {setopenCopy} />

            {/* Add Comment */}
            <div className='px-5 py-3 flex items-center gap-2 border-t border-gray-100 '>

                {/* <div className='flex-1 outline-none py-2 px-3 text-sm rounded-lg border items-center border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors'> */}

                <EmojiSelector onSelect={(emoji) => settext(prev => prev + emoji)} />
                <input
                    type='text'
                    placeholder='Add a comment...'
                    onChange={textchangeHandler}
                    value={text}
                    onKeyDown={handleKeyPress}
                    className='flex-1 outline-none py-2 px-3 text-sm rounded-lg border items-center border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors'
                />
                {/* </div> */}

                {text && (
                    <button
                        onClick={commentHanlder}
                        className="text-blue-500 hover:text-blue-700 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        Post
                    </button>
                )}
            </div>
            {/* const [showReport, setShowReport] = useState(false); */}

            {showReport && (
                <ReportHandler
                    post={post}
                    user={user}
                    type="Article"
                    onClose={() => setShowReport(false)}
                />
            )}

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

export default Article;