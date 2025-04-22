import Header from '../components/Header'

import { useSystems } from '../hooks/useSystems'
import SystemCard from '../components/Library/SystemCard'
import { themesState } from '../state/themes'
import ThemeCard from '../components/Library/ThemeCard'
import FloatingActionButton from '../components/FloatingActionButton'
import { useState } from 'react'
import { openModal } from '../state/modals'
import importSystem from '../storage/methods/systems/importSystem'

const Library: React.FC = () => {
  const { systems, isLoading } = useSystems()
  const themes = themesState.useValue()

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div>
      <Header title='Library' />

      <div className='p-4'>
        {/* TODO: Searchbar */}

        {
          isLoading && (
            <h5>Loading...</h5>
          ) || !systems && (
            <h5>
              Doesn't look like you have any systems, refreshing should load a backup of dnd5e
            </h5>
          ) || (
            <div className='flex flex-col gap-4'>

              <div>
                <h4 className='mb-1 text-xl'>Your Systems</h4>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {systems.map((sys) => (
                    <SystemCard key={sys.local_id} sys={sys} />
                  ))}
                </div>
              </div>

              <div>
                <h4 className='mb-1 text-xl'>Your Themes</h4>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {themes.map((theme) => (
                    <ThemeCard key={theme.name} theme={theme} />
                  ))}
                </div>
              </div>
            </div>
          )
        }

        <FloatingActionButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} buttons={[
          { name: 'Create System', icon: '', onClick: () => {} },
          { name: 'Import System', icon: '', onClick: () => openModal({
              type: 'import_file',
              title: 'Import System',
              data: undefined,
              onSave: async (fileContent: string) => {
                try {
                  const parsed = JSON.parse(fileContent)
                  if (parsed) {
                    await importSystem(parsed)
                  }
                } catch (e) {
                  console.error(e)
                }
              }
            })
          }
          ]}
        />
      </div>
    </div>
  )
}

export default Library
