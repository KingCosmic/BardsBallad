import Header from '@components/Header'

import FloatingActionButton from '@components/FloatingActionButton'
import React, { useMemo, useState } from 'react'
import { openModal } from '@state/modals'
import importSystem from '@storage/methods/systems/importSystem'
import { useSubscriptions } from '@hooks/useSubscriptions'
import SubscriptionCard from '@components/Library/SubscriptionCard'
import CreateSubscription from '@modals/CreateSubscription'
import ImportFile from '@modals/ImportFile'
import { UserSubscription } from '@storage/schemas/userSubscription'
import getItem from '@utils/items/getItem'
import { db, Item } from '@storage/index'
import { useLiveQuery } from 'dexie-react-hooks'

const Library: React.FC = () => {
  const subscriptions = useLiveQuery(async () => {
    const subs = await db.subscriptions.toArray()

    if (!subs) return []

    // filter out deleted characters
    const filteredSubs = subs.filter(sub => !sub.deleted_at).sort((a, b) => new Date(a.subscribed_at) > new Date(b.subscribed_at) ? -1 : 1)

    const grouped: { [local_id:string]: { item_id: string, item: Item, type: 'system' | 'theme' | 'datapack', versions: UserSubscription[] } } = {}
    const failedGrabs: { [local_id:string]: boolean } = {}

    for (let s = 0; s < filteredSubs.length; s++) {
      const item = filteredSubs[s]

      if (failedGrabs[item.resource_id]) continue

      if (!grouped[item.resource_id]) {
        const itemData = await getItem(item.resource_type, item.resource_id)
        
        if (!itemData) {
          failedGrabs[item.resource_id] = true
          continue
        }

        grouped[item.resource_id] = {
          item_id: item.resource_id,
          item: itemData, 
          type: item.resource_type,
          versions: []
        }
      }

      grouped[item.resource_id].versions.push(item)
    }

    return Object.values(grouped)
  }, [])

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div>
      <Header title='Library' />

      <div className='p-4'>
        {/* TODO: Searchbar */}

        {/* <Searchbar placeholder='' onSearch={() => {}} /> */}

        {!subscriptions ? (
          <h5 className='mb-4 text-xl'>Loading...</h5>
        ) : (
          <h5 className='flex flex-col gap-4'>
            <div>
              <h4 className='mb-2 text-xl'>Subscribed Systems</h4>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {subscriptions.filter(sub => sub.type === 'system').map(item => (
                  <SubscriptionCard key={item.item_id} itemData={item.item} versions={item.versions} />
                ))}
              </div>
            </div>

            <div>
              <h4 className='mb-2 text-xl'>Subscribed Datapacks</h4>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {subscriptions.filter(sub => sub.type === 'datapack').map(item => (
                  <SubscriptionCard key={item.item_id} itemData={item.item} versions={item.versions} />
                ))}
              </div>
            </div>

            <div>
              <h4 className='mb-2 text-xl'>Subscribed Themes</h4>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {subscriptions.filter(sub => sub.type === 'theme').map(item => (
                  <SubscriptionCard key={item.item_id} itemData={item.item} versions={item.versions} />
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
        />
      </div>
    </div>
  )
}

export default Library

