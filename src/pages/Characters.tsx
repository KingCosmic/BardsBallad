import CharacterCreatorModal from '../modals/CharacterCreator'

import { useState } from 'react'
import Header from '../components/Header'
import { NavLink } from 'react-router'
import FloatingActionButton from '../components/FloatingActionButton'
import { useCharacters } from '../hooks/useCharacters'
import { openModal } from '../state/modals'
import { authState } from '../state/auth'

import { renameCharacter, deleteCharacter } from '../storage/methods/characters'

const Characters: React.FC = () => {
  const { characters, isLoading } = useCharacters()
  const { isLoggedIn, user } = authState.useValue()

  const [isCreating, setIsCreating] = useState(false)

  console.log(user)

  if (isLoading) return <></>

  return (
    <div>
      <Header title='Characters' />

      <CharacterCreatorModal isOpen={isCreating} setIsOpen={setIsCreating} />

      <div className='p-4'>
        {/* TODO: Searchbar */}

        {characters.length ? (
          characters.map(char => (
            <div
              key={char.local_id}
              className="relative flex flex-col max-w-96 p-4 transition-all duration-200 bg-white border rounded-xl hover:shadow-lg dark:bg-neutral-800 dark:border-neutral-700 hover:transform hover:scale-[1.02]"
            >
              <div className='absolute -top-3 -right-3 h-8 w-8 bg-purple-400 rounded-full'></div>

              <NavLink
                to={char.local_id}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-brand-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {char.name[0]}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h5 className="text-xl font-semibold text-neutral-900 truncate dark:text-white">
                    {char.name}
                  </h5>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {char.system.name} • Version {char.system.version}
                  </p>
                </div>
              </NavLink>

              <div className="flex justify-end gap-2 mt-4 border-t pt-3 dark:border-neutral-700">
                {
                  isLoggedIn && (
                    <button
                      onClick={() => {
                        // toggleSyncingCharacter(char.local_id)
                      }}
                      className="mr-auto inline-flex items-center px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-md dark:text-brand-400 dark:hover:bg-brand-700"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      {user?.synced_characers?.includes(char.local_id) ? 'UnSync' : 'Sync'}
                    </button>
                  )
                }

                <button
                  onClick={() => openModal({
                    type: 'edit_string',
                    title: 'Rename Character',
                    data: char.name,
                    onSave: (newName: string) => {
                      renameCharacter(char.local_id, newName)
                    }
                  })}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md dark:text-blue-400 dark:hover:bg-blue-900/30"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Rename
                </button>
                <button
                  onClick={() => openModal({
                    type: 'confirm',
                    title: 'Delete Character',
                    data: { type: 'danger', message: 'Are you sure you want to delete this character?' },
                    onSave: () => deleteCharacter(char.local_id)
                  })}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <h5>
            Doesn't look like you have any characters yet? Try creating one!
          </h5>
        )}

        <FloatingActionButton onClick={() => setIsCreating(true)} />
      </div>
    </div>
  )
}

export default Characters
