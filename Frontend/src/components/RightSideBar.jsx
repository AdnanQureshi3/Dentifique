import React from 'react';
import { Heart, MessageCircle, FileText } from 'lucide-react';
import SuggestedUser from './SuggestedUser.jsx';
import { useSelector } from 'react-redux';
import { Link  , useNavigate} from 'react-router-dom';
import { setSelectedPost } from '@/redux/postSlice.js';
import CommentDialog from './CommentDialog.jsx';

function RightSideBar() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { trendingPosts } = useSelector(state => state.post);

  return (
    <div className="w-full p-4 bg-white rounded-md mt-2 shadow-md border space-y-6">

      {/* Profile Card */}
      <div onClick={() => { navigate(`/profile/${user._id}`) }}
       className="flex items-center gap-3 p-3 bg-gray-100 rounded-md cursor-pointer">
        <img src={user.profilePicture || "/default-avatar.png"} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
        <div>
          {/* <p className="font-semibold">{user.name}</p> */}
          <p className="text-semibold text-gray-800">@{user.username}</p>
          <p className='text-xs text-gray-00 '>{user.bio}</p>
        </div>
      </div>
      

     

      {/* Top Trending Posts */}
      <div>
        <h2 className="text-md font-semibold mb-2">Trending Posts</h2>
        <ul className="space-y-2">
          {trendingPosts.length > 0 ? (
            trendingPosts.map(post => (
              <li onClick={() => dispatch(setSelectedPost(post))}
               key={post._id} className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
                {post.image ? (
                  <img src={post.image} alt="Post" className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-300 rounded">
                    <FileText size={20} className="text-gray-700" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold">{post.title || post.caption}</p>
                  <div className="flex gap-3 text-gray-600 text-xs mt-1">
                    <span className="flex items-center gap-1"><Heart size={12} /> {post.likes.length || 0}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={12} /> {post.comments.length || 0}</span>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-xs text-gray-500">No trending posts yet</p>
          )}
        </ul>
      </div>
       {/* Suggested Users */}
      <div>
        <h2 className="text-md font-semibold mb-2">Suggested Users</h2>
        <SuggestedUser />
      </div>

      {/* Quick Links */}
      {/* <div>
        <h2 className="text-md font-semibold mb-2">Quick Links</h2>
        <ul className="space-y-1 text-sm text-blue-600">
          <li><Link to="/my-posts">My Posts</Link></li>
          <li><Link to="/bookmarks">Bookmarks</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </div> */}
    </div>
  );
}

export default RightSideBar;
