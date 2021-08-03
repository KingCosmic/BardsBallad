import React from 'react'
import { Link } from 'gatsby'

const PostCard = ({ post }) => {
  const url = `/${post.slug}/`

  return (
    <Link to={url} className='w-full rounded bg-purple-600 h-80'>
      <img src={post.feature_image} className='bg-contain bg-center w-full h-56 rounded-t'/>
      <div className='p-3'>
        <h2 className='text-white'>{post.title}</h2>
        <p className='text-gray-300'>{post.excerpt}</p>
      </div>
    </Link>
  )
}

export default PostCard;