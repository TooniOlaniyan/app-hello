import Loader from '@/components/shared/Loader'
import PostCard from '@/components/shared/PostCard'
import { useGetPostMutation } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'
import React from 'react'

const Home = () => {
  const {data: posts , isPending: isPostLoading , isError:isErrorPost} = useGetPostMutation()


  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
          <h2 className='h3-bold md:h2-bold w-full text-left'>Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader/>


          ) : (
            <ul className='flex flex-col w-full flex-1 gap-9'>
              {posts?.documents.map((post:Models.Document) => (
                <PostCard key={post.$createdAt} post={post} />
              ))}
              

            </ul>

          )}

        </div>

      </div>
    </div>
  )
}

export default Home