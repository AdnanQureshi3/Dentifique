import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUser from './SuggestedUser.jsx'
import axios from 'axios'
import { setAuthuser } from '@/redux/authSlice.js'


function RightSideBar() {
  const dispatch = useDispatch();

  const handlePremiumUpgrade = async () => {
    // Logic to handle premium upgrade
    try{
      console.log("Upgrading to premium...");
      const res = await axios.get('https://upchain-tvvm.onrender.com/api/user/UpgradeToPremium', {
        withCredentials: true
      });
      if(res.data.success) {
        // dispatch(setAuthuser(res.data.user))
        
        console.log("Premium upgrade successful:", res.data.msg); 
      }
      
    }
    catch(error){
      console.error("Error upgrading to premium:", error);
    }
  };
  
  const { user } = useSelector(store => store.auth);
  return (
    <div className="w-full p-4 bg-white rounded-md mt-2 shadow-md border space-y-6">

      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-4">
        <h1 className="text-lg font-semibold mb-1">Try Premium</h1>
        <p className="text-sm mb-3">Get access to exclusive features and content</p>
        <button 
          onClick={handlePremiumUpgrade}
          type="button"
          className="inline-block bg-white text-blue-600 font-semibold text-sm px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Upgrade Now
        </button>
      </div>

      <SuggestedUser />
    </div>
  )
}

export default RightSideBar
