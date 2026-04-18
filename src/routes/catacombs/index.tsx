import Header from '@/components/header'
import React from 'react'
import GarbageCard from './garbage-card'
import PageContent from '@/components/page-content'
import { useDeletedSubscriptions } from '@/db/subscription/hooks/useDeletedSubscriptions'

const Catacombs: React.FC = () => {
  const { subscriptions, isLoading: isSubscriptionsLoading } = useDeletedSubscriptions()

  return (
    <div>
      <Header title='The Catacombs' subtitle='Items permanently removed after 7 days' />

      <PageContent className='p-4'>
        {/* TODO: Searchbar */}

        {(isSubscriptionsLoading) ? (
          <h5 className='mb-4 text-xl'>Loading...</h5>
        ) : (
          <h5 className='flex flex-col gap-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
              {subscriptions.map(sub => <GarbageCard sub={sub} />)}
            </div>
          </h5>
        )}
      </PageContent>
    </div>
  )
}

export default Catacombs