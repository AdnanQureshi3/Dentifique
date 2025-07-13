import React, { useState } from 'react'
import Posts from './Posts'
import { PencilLine, FileText, Sparkles } from 'lucide-react'
import CreatePost from './CreatePost';
import CreateArticle from './ArticlePost';

function Feed() {
  const [OpenCreatePost, setOpenCreatePost] = useState(false);
  const [OpenCreateArticle, setOpenCreateArticle] = useState(false);
  return (
    <div className='flex-1 my-8 flex flex-col items-center pr-5'>
      <div className='w-full max-w-3xl px-4 border-b pb-4 mb-6'>

        <h1 className='text-xl font-bold mb-2 flex items-center gap-2'>
          <Sparkles className="w-5 h-5 text-blue-500" />
          What's Happening Now
        </h1>
        <p className='text-gray-600'>
          Stay updated with the latest posts from your friends and the community.
        </p>

        <div className='flex justify-around mt-4 mb-2'>
          <button onClick={() => {setOpenCreatePost(true)}}
           className='bg-blue-500 text-white px-4 py-2 cursor-pointer rounded flex items-center gap-2'>
            <PencilLine  className="w-4 h-4" />
            Create Post
          </button>
          <button onClick={() => {setOpenCreateArticle(true)}}
           className='bg-gray-300 cursor-pointer text-gray-700 px-4 py-2 rounded flex items-center gap-2'>
            <FileText className="w-4 h-4" />
            Write an Article
          </button>
        </div>

      </div>
      <Posts />
      <CreateArticle Open={OpenCreateArticle} setOpen={setOpenCreateArticle} />
      <CreatePost Open={OpenCreatePost} setOpen={setOpenCreatePost} />
    </div>
  )
}

export default Feed
