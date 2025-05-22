import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

function Posts() {
  const {posts} = useSelector(store=>store.post)
  return (
    <div>

      {
        posts.map((item ) => <Post key={item._id} post = {item} />)
      }
    </div>
  )
}

export default Posts