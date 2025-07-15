import Header from '@components/Header'

import FloatingActionButton from '@components/FloatingActionButton'
import React, { useState } from 'react'
import { openModal } from '@state/modals'
import importSystem from '@storage/methods/systems/importSystem'
import SubscriptionCard from '@components/Library/SubscriptionCard'
import CreateSubscription from '@modals/CreateSubscription'
import ImportFile from '@modals/ImportFile'
import useSubscriptionsWithData from '@hooks/useSubscriptionsWithData'
import importDatapack from '@storage/methods/datapacks/importDatapack'

const Library: React.FC = () => {
  const { subscriptions, isLoading } = useSubscriptionsWithData()

  const [isMenuOpen, setIsMenuOpen] = useState(false) 

  return (
    <div>
      <Header title='Your Collection' subtitle='Manage your extra content' />

      <div className='px-4'>
        {/* TODO: Searchbar */}

        {/* <div className='mb-5'>
          <Searchbar placeholder='' onSearch={() => {}} filters={[
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
        </div> */}

        {!subscriptions ? (
          <h5 className='mb-4 text-xl'>Loading...</h5>
        ) : (
          <h5 className='flex flex-col gap-4'>
            <div>
              <h4 className='mb-2 text-xl'>Subscribed Systems</h4>
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {subscriptions.filter(sub => sub.type === 'system').map(item => (
                  <SubscriptionCard key={item.item_id} itemData={item.item} subs={item.subscriptions} />
                ))}
              </div>
            </div>

            <div>
              <h4 className='mb-2 text-xl'>Subscribed Datapacks</h4>
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {subscriptions.filter(sub => sub.type === 'datapack').map(item => (
                  <SubscriptionCard key={item.item_id} itemData={item.item} subs={item.subscriptions} />
                ))}
              </div>
            </div>

            <div>
              <h4 className='mb-2 text-xl'>Subscribed Themes</h4>
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {subscriptions.filter(sub => sub.type === 'theme').map(item => (
                  <SubscriptionCard key={item.item_id} itemData={item.item} subs={item.subscriptions} />
                ))}
              </div>
            </div>
          </h5>
        )}

        <FloatingActionButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} buttons={[
          { name: 'Create', icon: '', onClick: () =>
              openModal('create-subscription', ({ id }) => <CreateSubscription id={id} onCreate={() => {}} />)
          },
          { name: 'Import', icon: '', onClick: () =>
              openModal('import-system', ({ id }) => <ImportFile id={id} title='Import System' onSave={async (fileContent: string) => {
                try {
                  const parsed = JSON.parse(fileContent)

                  switch (parsed.type) {
                    case 'system':
                      return await importSystem(parsed.item, parsed.version)
                    case 'datapack':
                      return await importDatapack(parsed.item, parsed.version)
                  }
                } catch (e) {
                  console.error(e)
                }
              }} />
            )
          }
          ]}
        />
      </div>
    </div>
  )
}

export default Library

