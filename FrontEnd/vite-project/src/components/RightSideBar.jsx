import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUser from './SuggestedUser.jsx'

function RightSideBar() {
  const { user } = useSelector(store => store.auth)

  return (
    <div className="w-full p-4 bg-white rounded-md mt-2 shadow-md border space-y-6">

      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-4">
        <h1 className="text-lg font-semibold mb-1">Try Premium</h1>
        <p className="text-sm mb-3">Get access to exclusive features and content</p>
        <Link 
          to="/premium" 
          className="inline-block bg-white text-blue-600 font-semibold text-sm px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Upgrade Now
        </Link>
      </div>

      <SuggestedUser />
    </div>
  )
}

export default RightSideBar
