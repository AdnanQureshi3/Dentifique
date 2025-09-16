import useProfileUser from '@/Hooks/usegetProfileUser'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark, Settings, Edit3, Mail, Camera } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import Post from './Post'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import CommentDialog from './CommentDialog'
import axios from 'axios'
import { setAuthuser, setProfileUser } from '@/redux/authSlice'
import { FollowHandlerFunc } from '../Hooks/useFollownUnfollow.js'
import { useNavigate } from 'react-router-dom'
import { setSelectedUser } from '@/redux/authSlice'

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  useProfileUser(id, refresh);
  const commonBTNCSS = "px-4 py-2 font-medium rounded-md transition-all duration-300 cursor-pointer flex items-center gap-2";
  const { userprofile, user } = useSelector(state => state.auth)
  const isLoggedInUser = (user?._id === userprofile?._id);
  const isFollowing = userprofile?.followers?.includes(user?._id);

  const [Open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  function btnClass(extra = '') {
    return `${commonBTNCSS} ${extra}`;
  }

  const ActiveTabHandler = (tab) => {
    setActiveTab(tab);
    if (tab === "Posts")
      setDisplayItem(userprofile?.posts);
    else setDisplayItem(userprofile?.saved);
  }
  
  const RemovePhotoHandler = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/profile/removephoto`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthuser(res.data.user));
        dispatch(setProfileUser(res.data.user))
      }
    }
    catch (err) {
      // Error handling
    }
  }

  const [DispaleyItem, setDisplayItem] = useState(userprofile?.posts);
  const [ActiveTab, setActiveTab] = useState("Posts");

  useEffect(() => {
    ActiveTabHandler(ActiveTab)
  }, [id, userprofile]);

  if (!userprofile) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse text-gray-500">Loading profile...</div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className='w-32 h-32 cursor-pointer aspect-square relative group'>
            <Avatar className=''>
              <AvatarImage
                className='object-cover h-full w-full rounded-2xl border-4 border-indigo-100 shadow-md'
                src={userprofile?.profilePicture}
                alt='user'
              />
              <AvatarFallback className="flex items-center justify-center h-full w-full bg-indigo-100 rounded-2xl text-indigo-400 text-2xl font-bold">
                {userprofile?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {
              isLoggedInUser && (
                (userprofile?.profilePicture !== '/defaultPhoto.png') ? (
                  <div onClick={RemovePhotoHandler} className="absolute inset-0 bg-indigo-900 bg-opacity-70 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition duration-200 flex items-center justify-center text-white text-sm p-2">
                    <Camera size={20} className="mr-1" />
                    Remove
                  </div>
                ) : (
                  <Link to={'/account/edit'} >
                    <div className="absolute inset-0 bg-indigo-900 bg-opacity-70 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition duration-200 flex items-center justify-center text-white text-sm p-2">
                      <Camera size={20} className="mr-1" />
                      Update Photo
                    </div>
                  </Link>
                )
              )
            }
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-0">
                {userprofile?.username}
              </h1>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {
                  isLoggedInUser ? (
                    <>
                      <Link to={'/account/edit'} >
                        <button className={btnClass('bg-indigo-100 text-indigo-700 hover:bg-indigo-200 shadow-sm')}>
                          <Edit3 size={18} />
                          Edit Profile
                        </button>
                      </Link>
                      <button className={btnClass('bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm')}>
                        <Settings size={18} />
                        Settings
                      </button>
                    </>
                  ) : (
                    isFollowing ? (
                      <>
                        <button onClick={() => FollowHandlerFunc(userprofile?._id, dispatch)} className={btnClass('bg-red-100 text-red-700 hover:bg-red-200 shadow-sm')}>
                          Unfollow
                        </button>
                        <button onClick={()=>{
                          navigate("/chat");
                          console.log("Navigating to chat" , userprofile);
                          dispatch(setSelectedUser(userprofile));

                        }}
                         className={btnClass('bg-indigo-100 text-indigo-700 hover:bg-indigo-200 shadow-sm')}>
                          <Mail size={18} />
                          Message
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => FollowHandlerFunc(userprofile?._id, dispatch)} className={btnClass('bg-indigo-600 text-white hover:bg-indigo-700 shadow-md')}>
                          Follow
                        </button>
                      </>
                    )
                  )
                }
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-6 mb-4">
              <div className="flex flex-col items-center md:items-start">
                <span className="text-xl font-bold text-gray-800">{userprofile.posts?.length || 0}</span>
                <span className="text-sm text-gray-600">Posts</span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-xl font-bold text-gray-800">{userprofile.followers?.length || 0}</span>
                <span className="text-sm text-gray-600">Followers</span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-xl font-bold text-gray-800">{userprofile.following?.length || 0}</span>
                <span className="text-sm text-gray-600">Following</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700">{userprofile.bio || "This user hasn't added a bio yet."}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className='flex justify-center gap-6'>
          <button 
            onClick={() => ActiveTabHandler("Posts")} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${ActiveTab === "Posts" ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <span>Posts</span>
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
              {userprofile.posts?.length || 0}
            </span>
          </button>
          
          <button 
            onClick={() => ActiveTabHandler("Saved")} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${ActiveTab === "Saved" ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Bookmark size={18} />
            <span>Saved</span>
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        {DispaleyItem?.length > 0 ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {DispaleyItem.map((post, i) => (
  <div 
  key={post._id || i}
  onClick={() => { setOpen(true); setSelectedPost(post) }}
  className="relative cursor-pointer rounded-2xl overflow-hidden 
             bg-gradient-to-br from-white via-gray-50 to-gray-100 
             shadow-md hover:shadow-xl hover:scale-[1.02] 
             transition-all duration-300 border border-gray-200"
>
  {post?.type === "post" ? (
    <img 
      src={post.image} 
      alt="post" 
      className="w-full h-60 object-cover"
    />
  ) : (
    <div className="w-full h-60 flex flex-col items-start justify-center p-5">
      <h1 className="text-xl font-bold text-gray-800 mb-2 tracking-tight leading-snug">
        {post?.title}
      </h1>
      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
         {post?.caption?.replace(/<[^>]+>/g, '')}
      </p>
    </div>
  )}

  <div className="absolute bottom-2 right-2 flex items-center space-x-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
    <div className="flex items-center gap-1">
      <Heart size={14} />
      <span>{post?.likes?.length}</span>
    </div>
    <div className="flex items-center gap-1">
      <MessageCircle size={14} />
      <span>{post?.comments?.length}</span>
    </div>
  </div>
</div>

  ))}
</div>

        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              {ActiveTab === "Posts" ? (
                <Camera size={28} className="text-indigo-400" />
              ) : (
                <Bookmark size={28} className="text-indigo-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              No {ActiveTab.toLowerCase()} yet
            </h3>
            <p className="text-gray-500">
              {ActiveTab === "Posts" 
                ? "When you share posts, they will appear here." 
                : "Save interesting posts to view them later here."}
            </p>
          </div>
        )}
      </div>

      {/* Comment Dialog */}
      {selectedPost && (
        <CommentDialog Open={Open} setOpen={setOpen} post={selectedPost} />
      )}
    </div>
  )
}

export default Profile