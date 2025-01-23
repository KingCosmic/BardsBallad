// import { IonActionSheet, IonButtons, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonMenuButton, IonPage, IonSearchbar, IonText, IonTitle, IonToolbar } from '@ionic/react'
import { charactersState, deleteCharacter } from '../state/characters'
import { type CharacterData } from '../state/character'
// import { add } from 'ionicons/icons'
import CharacterCreatorModal from '../modals/CharacterCreator'

import Pressable from '../components/Pressable'
import { useState } from 'react'
import Header from '../components/Header'
import { NavLink } from 'react-router'
import FloatingActionButton from '../components/FloatingActionButton'

const Characters: React.FC = () => {
  const characters = charactersState.useValue()

  const [isDeleting, setIsDeleting] = useState<null | CharacterData>(null)
  const [isCreating, setIsCreating] = useState(false)

  return (
    <div>
      <Header title='Characters' />

      <CharacterCreatorModal isOpen={isCreating} setIsOpen={setIsCreating} />

      <div className='p-4'>
        {/* TODO: Searchbar */}

        {characters.length ? (
          characters.map(char => (
            <NavLink key={char.name} to={char.name} className='mb-4 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'>
              <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>{char.name}</h5>
              <p className='font-normal text-gray-700 dark:text-gray-400'>{char.system.name} - {char.system.version}</p>
            </NavLink>
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
