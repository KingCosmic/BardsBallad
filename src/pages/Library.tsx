// import { IonActionSheet, IonButtons, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonMenuButton, IonNote, IonPage, IonSearchbar, IonText, IonTitle, IonToolbar } from '@ionic/react'

import { createSystem, deleteSystem, SystemData, systemsState } from '../state/systems'

import Pressable from '../components/Pressable'
import { useState } from 'react'

import { NavLink } from 'react-router'
import FloatingActionButton from '../components/FloatingActionButton'
import Header from '../components/Header'

const Library: React.FC = () => {
  const systems = systemsState.useValue()

  const [isDeleting, setIsDeleting] = useState<null | SystemData>(null)

  return (
    <div>
      <Header title='Library' />

      {/* <CharacterCreatorModal isOpen={isCreating} setIsOpen={setIsCreating} /> */}

      <div className='p-4'>
        {/* TODO: Searchbar */}

        <h6 style={{ paddingLeft: 12, paddingRight: 12 }}>
          Click on a system to edit it!
        </h6>

        {systems.length ? (
          systems.map(sys => (
            <NavLink key={sys.name} to={`systems/${sys.name}`} className='mb-4 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700'>
              <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>{sys.name}</h5>
              <p className='font-normal text-gray-700 dark:text-gray-400'>{sys.version}</p>
            </NavLink>
          ))
        ) : (
          <h5>
            Doesn't look like you have any systems, refreshing should load a backup of dnd5e
          </h5>
        )}

        <FloatingActionButton onClick={() => createSystem()} />
      </div>
    </div>
  )
}

export default Library
