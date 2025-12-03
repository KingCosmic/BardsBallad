import Header from '@/components/header'
import { DropdownButton } from '@/components/ui/dropdown-button'
import reviveCharacter from '@/db/character/methods/reviveCharacter'
import { useDeletedCharacters } from '@/hooks/characters/useDeletedCharacters'
import { useDeletedSubscriptions } from '@/hooks/subscriptions/useDeletedSubscriptions'
import ConfirmModal from '@/modals/confirm'
import { openModal } from '@/state/modals'
import React from 'react'
import GarbageCard from './garbage-card'
import JSONToFile from '@/utils/object/JSONToFile'
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import clearCharacter from '@/db/character/methods/clearCharacter'
import getVisualTextFromVersionID from '@/utils/misc/getVisualTextFromVersionID'

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
              {characters.map((char, i) => (
                <div key={char.local_id} style={{ zIndex: `${characters.length - i}`}} className='fantasy-card-gradient card-top-border border border-fantasy-border rounded-2xl p-6 cursor-pointer transition-all duration-500 backdrop-blur-lg shadow-2xl hover:-translate-y-2 hover:shadow-fantasy-accent/20 hover:shadow-xl hover:border-fantasy-accent/40 relative'>
                  {/* Character Header */}
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 fantasy-accent-gradient rounded-xl flex items-center justify-center text-xl font-bold text-fantasy-dark mr-4 shadow-lg shadow-fantasy-accent/30">
                      {char.name[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-fantasy-text mb-1">{char.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-fantasy-accent/70">
                        <span>🏹 Ranger</span>
                        <span className="bg-fantasy-accent/20 px-1.5 py-0.5 rounded text-[10px]">{getVisualTextFromVersionID(char.system.local_id)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Character actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      className="flex-1 fantasy-accent-gradient text-fantasy-dark px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fantasy-accent/40"
                      onClick={() => reviveCharacter(char.local_id)}
                    >
                      Revive Adventurer
                    </button>
                    <DropdownButton variant='outline' label='⚙️'>
                      <DropdownMenuContent className='w-56' align='start'>
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => JSONToFile('character', char, `${char.name}-export`)}>
                            Export
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => {
                            openModal('confirm', ({ id }) => <ConfirmModal id={id} title='Force Delete Character' type='danger' message='Are you sure you want to force delete this character?' onConfirm={() => clearCharacter(char.local_id)} />)
                          }}>
                            Force Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownButton>
                  </div>
                </div>
              ))}
              {subscriptions.map(sub => <GarbageCard sub={sub} />)}
            </div>
          </h5>
        )}
      </div>
    </div>
  )
}

export default Catacombs