import Header from '../components/Header'

import FloatingActionButton from '../components/FloatingActionButton'
import React, { useState } from 'react'
import { openModal } from '../state/modals'
import importSystem from '../storage/methods/systems/importSystem'
import { useSubscriptions } from '../hooks/useSubscriptions'
import SubscriptionCard from '../components/Library/SubscriptionCard'

const Library: React.FC = () => {
  const { subscriptions, isLoading } = useSubscriptions()

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div>
      <Header title='Library' />

      <div className='p-4'>
        {/* TODO: Searchbar */}

        {/* <Searchbar placeholder='' onSearch={() => {}} /> */}

        {isLoading ? (
          <h5 className='mb-4 text-xl'>Loading...</h5>
        ) : (
          <h5 className='flex flex-col gap-4'>
            <div>
              <h4 className='mb-2 text-xl'>Subscribed Systems</h4>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {subscriptions.filter(sub => sub.resource_type === 'system').map((sys) => (
                  <SubscriptionCard key={sys.local_id} subscription={sys} />
                ))}
              </div>
            </div>
          </h5>
        )}

        <FloatingActionButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} buttons={[
          { name: 'Create System', icon: '', onClick: () => openModal({
            type: 'create_subscription',
            title: 'Create Subscription',
            data: undefined,
            onSave: () => {}
            })
          },
          { name: 'Import System', icon: '', onClick: () => openModal({
              type: 'import_file',
              title: 'Import System',
              data: undefined,
              onSave: async (fileContent: string) => {
                try {
                  const parsed = JSON.parse(fileContent)
                  if (parsed && parsed.system && parsed.version) {
                    await importSystem(parsed.system, parsed.version)
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
