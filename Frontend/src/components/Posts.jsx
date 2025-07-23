import React from 'react'
import Post from './Post'
import Article from './Article.jsx'
import { useSelector } from 'react-redux'

function Posts() {
  const {posts} = useSelector(store=>store.post)
  return (
    <div>
      {
        posts.map((item ) =>{
          if(item.type === 'post'){
            return <Post key={item._id} post={item} />
          }
          if(item.type === 'article'){
            return <Article key={item._id} post={item} />
          } 
        } )
      }
    </div>
  )
}

export default Posts