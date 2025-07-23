import useProfileUser from '@/Hooks/usegetProfileUser'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Heart, MessageCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import Post from './Post'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import CommentDialog from './CommentDialog'
import axios from 'axios'
import { setAuthuser, setProfileUser } from '@/redux/authSlice'
import { FollowHandlerFunc } from '../Hooks/useFollownUnfollow.js'

function Profile() {
  const { id } = useParams();
  const [refresh, setRefresh] = useState(false);
  useProfileUser(id, refresh);
  const commonBTNCSS = "px-2 text-lg font-semibold rounded-lg transition-colors duration-200 cursor-pointer";
  const { userprofile, user } = useSelector(state => state.auth)
  const isLoggedInUser = (user?._id === userprofile?._id);
 const isFollowing = userprofile?.followers?.includes(user?._id);

  const dispatch = useDispatch();
  const [Open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  function btnClass(extra = '') {
    return `${commonBTNCSS} ${extra}`;
  }

  const ActiveTabHandler = (tab) => {
    setActiveTab(tab);
    // console.log(ActiveTab)
    if (tab === "Posts")
      setDisplayItem(userprofile?.posts);
    else setDisplayItem(userprofile?.saved);

  }
  const RemovePhotoHandler = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/user/profile/removephoto', { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthuser(res.data.user));
        dispatch(setProfileUser(res.data.user))
      }

    }
    catch (err) {

    }
  }


  const [DispaleyItem, setDisplayItem] = useState(userprofile?.posts);
  const [ActiveTab, setActiveTab] = useState("Posts");

  useEffect(() => {
    ActiveTabHandler(ActiveTab)
  }, [id, userprofile]);

  if (!userprofile) return <div className="text-center mt-10">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10">
        <div className='w-[15%] cursor-pointer aspect-square relative group'>

          <Avatar className=''>
            <AvatarImage
              className='object-cover h-full w-full rounded-full border-2 border-green-700'
              src={
                userprofile?.profilePicture
              }
              alt='user'
            />
          </Avatar>
          {
            isLoggedInUser &&(

              (userprofile?.profilePicture !== '/defaultPhoto.png') ? (

              <div onClick={RemovePhotoHandler} className="absolute inset-0 bg-black bg-opacity-20 rounded-full opacity-0 group-hover:opacity-70 cursor-pointer transition duration-200 flex items-center justify-center text-white text-sm">
                Remove Photo</div>
            ) : (
               <Link to={'/account/edit'} >
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full opacity-0 group-hover:opacity-70 cursor-pointer transition duration-200 flex items-center justify-center text-white text-sm">
                Update Photo</div>
              </Link>
            ))


          }
        </div>

        <div className="flex flex-col gap-3 items-center sm:items-start">
          <div className="flex flex-row gap-2">
            <span className="text-2xl  font-semibold"> {userprofile?.username} </span>
            {
              isLoggedInUser ? (
                <>            <Link to={'/account/edit'} >

                  <button className={btnClass('bg-gray-600 text-white hover:gray-700')}>Edit Profile</button>
                </Link>
                  <button className={btnClass('bg-gray-600 text-white hover:gray-700')}>Settings</button>
                </>
              ) : (
                isFollowing ? (

                  <>
                    <button onClick={() => FollowHandlerFunc(userprofile?._id, dispatch)} className={btnClass('bg-[#0095F6] text-white hover:bg-[#3192d2] ')}>Unfollow</button>
                    <button className={btnClass('bg-[#0095F6] text-white hover:bg-[#3192d2] ')}>Message</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => FollowHandlerFunc(u?._id, dispatch)} className={btnClass('bg-[#0095F6] text-white hover:bg-[#3192d2] ')} >Follow</button>

                  </>
                )

              )
            }


          </div>

          <div className="flex gap-6 text-gray-800 text-md  ">
            <span className='text-black'><b>{userprofile.posts?.length || 0}</b> posts</span>
            <span className='text-black'><b>{userprofile.followers?.length || 0}</b> followers</span>
            <span className='text-black'><b>{userprofile.following?.length || 0}</b> following</span>
          </div>
          <p className="text-gray-700 text-sm">{userprofile.bio || "No bio"}</p>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-300 mb-6" />

      {/* Posts Section */}
      <div className='items-center'>

        <div className='flex flex-row gap-3'>

          <span onClick={() => ActiveTabHandler("Posts")} className={`text-lg font-semibold mb-4 cursor-pointer ${ActiveTab === "Posts" ? 'font-bold bg-gray-50 border-b' : ''} `}> Posts </span>
          <span onClick={() => ActiveTabHandler("Saved")} className={`text-lg font-semibold mb-4 cursor-pointer ${ActiveTab === "Saved" ? 'font-bold bg-gray-50 border-b' : ''} `}>Saved</span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4">

          {(DispaleyItem?.length > 0)
            ? DispaleyItem.map((post, i) => {
              return (
                <div onClick={() => { setOpen(true); setSelectedPost(post) }} key={post._id || i}
                  className='relative cursor-pointer group'>


                  <img src={post.image} alt="IMG"
                    className='rounded-sm w-full my-2 aspect-square object-cover ' />
                  <div className='absolute inset-0 flex items-center justify-center bottom-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-50 aspect-square transition-opacity duration-300'>
                    <div className='flex items-center text-white space-x-4'>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>

                  </div>

                </div>


              )
            })
            : <p className="text-gray-500 col-span-3 text-center">No {ActiveTab} yet</p>
          }
        </div>
        {
          selectedPost &&
          <CommentDialog Open={Open} setOpen={setOpen} post={selectedPost} />
        }
      </div>
      {/* <Dialog className={'z-1000 relative'} open={open} onOpenChange={setopen} >
              <DialogContent
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-xl w-full max-w-2xl"
              >
                <DialogTitle>
      <VisuallyHidden>Post Details</VisuallyHidden>
    </DialogTitle>
                 {selectedPost && <Post post={selectedPost} />}
              </DialogContent>
            </Dialog> */}
    </div>
  )
}

export default Profile
