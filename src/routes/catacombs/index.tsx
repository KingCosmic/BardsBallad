import Header from '@/components/header'
import { useDeletedCharacters } from '@/hooks/characters/useDeletedCharacters'
import { useDeletedSubscriptions } from '@/hooks/subscriptions/useDeletedSubscriptions'
import React from 'react'
import GarbageCard from './garbage-card'
import GarbageCharacter from './garbage-character'

const Catacombs: React.FC = () => {
  const { subscriptions, isLoading: isSubscriptionsLoading } = useDeletedSubscriptions()
  const { characters, isLoading: isCharactersLoading } = useDeletedCharacters()

  return (
    <div>
      <Header title='The Catacombs' subtitle='Items permanently removed after 7 days' />

      <div className='p-4'>
        {/* TODO: Searchbar */}

        {(isSubscriptionsLoading || isCharactersLoading) ? (
          <h5 className='mb-4 text-xl'>Loading...</h5>
        ) : (
          <h5 className='flex flex-col gap-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
              {characters.map(char => <GarbageCharacter char={char} />)}
              {subscriptions.map(sub => <GarbageCard sub={sub} />)}
            </div>
          </h5>
        )}
      </div>
    </div>
  )
}

export default Catacombs