import Header from '@components/Header'

import React from 'react'
import Searchbar from '@components/Searchbar'
import { useDeletedSubscriptions } from '@hooks/useDeletedSubscriptions'
import { useDeletedCharacters } from '@hooks/useDeletedCharacters'
import getVisualTextFromVersionID from '@utils/getVisualTextFromVersionID'
import DropdownButton from '@components/DropdownButton'
import JSONToFile from '@utils/JSONToFile'
import { openModal } from '@state/modals'
import ConfirmModal from '@modals/ConfirmModal'
import clearCharacter from '@storage/methods/characters/clearCharacter'
import reviveCharacter from '@storage/methods/characters/reviveCharacter'
import { useLiveQuery } from 'dexie-react-hooks'
import getItem from '@utils/items/getItem'
import { UserSubscription } from '@storage/schemas/userSubscription'
import clearSubscription from '@storage/methods/subscriptions/clearSubscription'

const GarbageCard = ({ sub }: { sub: UserSubscription }) => {
  const item = useLiveQuery(() => getItem(sub.resource_type, sub.resource_id), [sub])

  if (!item) return <p>loading</p>

  return (
    <div key={sub.local_id} className='fantasy-card-gradient card-top-border border border-fantasy-border rounded-2xl p-6 cursor-pointer transition-all duration-500 backdrop-blur-lg shadow-2xl hover:-translate-y-2 hover:shadow-fantasy-accent/20 hover:shadow-xl hover:border-fantasy-accent/40 relative'>
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 fantasy-accent-gradient rounded-xl flex items-center justify-center text-xl font-bold text-fantasy-dark mr-4 shadow-lg shadow-fantasy-accent/30">
          {item.name[0]}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-fantasy-text mb-1">{item.name}</h3>
          <div className="flex items-center gap-2 text-xs text-fantasy-accent/70">
            <span>🏹 {sub.resource_type}</span>
            <span className="bg-fantasy-accent/20 px-1.5 py-0.5 rounded text-[10px]">{getVisualTextFromVersionID(sub.version_id)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          className="flex-1 fantasy-accent-gradient text-fantasy-dark px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fantasy-accent/40"
          onClick={() => {}}
        >
          Revive {sub.resource_type}
        </button>
        <DropdownButton
          label='⚙️'
          options={[
            {
              label: 'export',
              onClick: () => JSONToFile(sub.resource_type, item, `${item.name}-export`),
            },
            {
              label: 'force delete',
              onClick: () =>
                openModal('confirm', ({ id }) => <ConfirmModal id={id} title={`Force Delete ${sub.resource_type}`} type='danger' message={`Are you sure you want to force delete this ${sub.resource_type}?`} onConfirm={() => clearSubscription(sub.local_id)} />)
            },
          ]}
        />
      </div>
    </div>
  )
}

const Garbage: React.FC = () => {
  const { subscriptions, isLoading: isSubscriptionsLoading } = useDeletedSubscriptions()
  const { characters, isLoading: isCharactersLoading } = useDeletedCharacters()

  return (
    <div>
      <Header title='The Catacombs' subtitle='Items permanently removed after 7 days' />

      <div className='px-4 pb-4'>
        {/* TODO: Searchbar */}

        <div className='mb-5'>
          <Searchbar placeholder='Search Catacombs...' onSearch={() => {}} filters={[
            {
              title: 'systems',
              property: 'type',
              value: 'system'
            },
            {
              title: 'datapacks',
              property: 'type',
              value: 'datapack'
            },
            {
              title: 'themes',
              property: 'type',
              value: 'theme'
            }
          ]} />
        </div>

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
                    <DropdownButton
                      label='⚙️'
                      options={[
                        {
                          label: 'export',
                          onClick: () => JSONToFile('character', char, `${char.name}-export`),
                        },
                        {
                          label: 'force delete',
                          onClick: () =>
                            openModal('confirm', ({ id }) => <ConfirmModal id={id} title='Force Delete Character' type='danger' message='Are you sure you want to force delete this character?' onConfirm={() => clearCharacter(char.local_id)} />)
                        },
                      ]}
                    />
                  </div>
                </div>
              ))}
              {subscriptions.map(sub => <GarbageCard sub={sub} />)}
            </div>
          </h5>
        )}

        {/* <FloatingActionButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} buttons={[
          { name: 'Create', icon: '', onClick: () =>
              openModal('create-subscription', ({ id }) => <CreateSubscription id={id} onCreate={() => {}} />)
          },
          { name: 'Import', icon: '', onClick: () =>
              openModal('import-system', ({ id }) => <ImportFile id={id} title='Import System' onSave={async (fileContent: string) => {
                try {
                  const parsed = JSON.parse(fileContent)
                  if (parsed && parsed.system && parsed.version) {
                    await importSystem(parsed.system, parsed.version)
                  }
                } catch (e) {
                  console.error(e)
                }
              }} />
            )
          }
          ]}
        /> */}
      </div>
    </div>
  )
}

export default Garbage