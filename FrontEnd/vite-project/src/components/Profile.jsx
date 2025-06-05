import useProfileUser from '@/Hooks/usegetProfileUser'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Heart, MessageCircle } from 'lucide-react'

function Profile() {
  const { id } = useParams();
  useProfileUser(id);
  const commonBTNCSS = "px-2 text-lg font-semibold rounded-lg transition-colors duration-200 cursor-pointer";
  const { userprofile, user } = useSelector(state => state.auth)
  const isLoggedInUser = (user?._id === userprofile._id);
  const isFollowing = true;
  function btnClass(extra = '') {
  return `${commonBTNCSS} ${extra}`;
}

const ActiveTabHandler = (tab)=>{
  setActiveTab(tab);
  // console.log(ActiveTab)
  if(tab === "Posts")
  setDisplayItem(userprofile?.posts);
else setDisplayItem(userprofile?.saved);

}

const [DispaleyItem , setDisplayItem] = useState(userprofile?.posts);
const [ActiveTab , setActiveTab] = useState("Posts");

  useEffect(() =>{
    ActiveTabHandler(ActiveTab)
  }, [id , userprofile]);

  if (!userprofile) return <div className="text-center mt-10">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10">
        <Avatar className='w-[15%] aspect-square '>
                     <AvatarImage className='object-cover w-full border-2 border-green-700 h-full rounded-full' src={user.profilePicture} alt='user' />
                     <AvatarFallback>User</AvatarFallback>
                   </Avatar>

        <div className="flex flex-col gap-3 items-center sm:items-start">
          <div className="flex flex-row gap-2">
            <span className="text-2xl  font-semibold"> {userprofile.username} </span>
            {
              isLoggedInUser ? (
<>            <Link to={'/account/edit'} >

                <button className={btnClass('bg-gray-600 text-white hover:gray-700')}>Edit Profile</button>
</Link>
                <button className={btnClass('bg-gray-600 text-white hover:gray-700')}>Settings</button>
</>
              ):(
                isFollowing ?(

                <>
                <button className={btnClass('bg-[#0095F6] text-white hover:bg-[#3192d2] ')}>Follow</button>
                <button className={btnClass('bg-[#0095F6] text-white hover:bg-[#3192d2] ')}>Message</button>
                </>
                ):(
                   <>
                <button className={btnClass('bg-[#0095F6] text-white hover:bg-[#3192d2] ')} >Follow</button>
               
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

        <span onClick={()=> ActiveTabHandler("Posts")} className= {`text-lg font-semibold mb-4 cursor-pointer ${ActiveTab === "Posts" ?'font-bold bg-gray-50 border-b':'' } `}> Posts </span>
        <span onClick={()=> ActiveTabHandler("Saved")} className= {`text-lg font-semibold mb-4 cursor-pointer ${ActiveTab === "Saved" ?'font-bold bg-gray-50 border-b':'' } `}>Saved</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          
          {(DispaleyItem.length > 0)
            ? DispaleyItem.map((post, i) =>{
              return (
                <div key={post._id || i} 
                className='relative cursor-pointer group'>
                   <img src= {post.image} alt="IMG"
                   className='rounded-sm w-full my-2 aspect-square object-cover ' />
                   <div className='absolute inset-0 flex items-center justify-center bottom-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-50 aspect-square transition-opacity duration-300'>
                    <div className='flex items-center text-white space-x-4'>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <Heart/>
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <MessageCircle/>
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>

                   </div>
                  
                </div>
              

              )
            } )
            : <p className="text-gray-500 col-span-3 text-center">No {ActiveTab} yet</p>
          }
        </div>
      </div>
    </div>
  )
}

export default Profile
