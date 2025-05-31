import useProfileUser from '@/Hooks/usegetProfileUser'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

function Profile() {
  const { id } = useParams()
  useProfileUser(id) 
  const commonBTNCSS = "px-2 text-lg font-semibold rounded-lg transition-colors duration-200 cursor-pointer";
  const { userprofile } = useSelector(state => state.auth)
  const isLoggedInUser = false, isFollowing = true;
  function btnClass(extra = '') {
  return `${commonBTNCSS} ${extra}`;
}
  if (!userprofile) return <div className="text-center mt-10">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10">
        <Avatar className="h-32 w-32">
          <AvatarImage className='rounded-full border-2 ' src="https://assets.leetcode.com/users/Adnan_Qureshi_61/avatar_1739424746.png" alt="user" />
          <AvatarFallback className="text-3xl">
            {userprofile.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-3 items-center sm:items-start">
          <div className="flex flex-row gap-2">
            <span className="text-2xl  font-semibold"> {userprofile.username} </span>
            {
              isLoggedInUser ? (
<>
                <button className={btnClass('bg-gray-600 text-white hover:gray-700')}>Edit Profile</button>
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
      <div>
        <h2 className="text-lg font-semibold mb-4">Posts</h2>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          
          {(userprofile.posts && userprofile.posts.length > 0)
            ? userprofile.posts.map((postId, i) => (
                <div
                  key={i} Post
                  className="bg-gray-200 h-40 sm:h-60 w-full rounded-md animate-pulse"
                />
              ))
            : <p className="text-gray-500 col-span-3 text-center">No posts yet</p>
          }
        </div>
      </div>
    </div>
  )
}

export default Profile
