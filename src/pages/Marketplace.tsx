import Header from '../components/Header'
import { openModal } from '../state/modals';
import { useEffect, useState } from 'react';
import { MiscStorage } from '../lib/storage';
import FloatingActionButton from '../components/FloatingActionButton';
import { getMarketplaceItems, getSubscriptionData, publishItem } from '../lib/api';
import getVisualTextFromVersionID from '../utils/getVisualTextFromVersionID';
import createSubscription from '../storage/methods/subscriptions/createSubscription';
import saveSystem from '../storage/methods/systems/saveSystem';
import saveVersionedResource from '../storage/methods/versionedresources/saveVersionedResource';
import { authState } from '../state/auth';
import { syncState } from '../state/sync';

type MarketplaceItem = {
  id: string,
  name: string,
  description: string,

  creator_id: string,
  creator_username: string,

  version: string,

  resource_type: string,
  resource_id: string,

  updated_at: string,
  published_at: string
  is_public: boolean
}

const ItemCard: React.FC<{ item: MarketplaceItem }> = ({ item }) => {
  return (
    <div
      key={item.name}
      className="relative cursor-pointer flex flex-col max-w-96 p-4 tranasition-all duration-200 bg-white border rounded-xl hover:shadow-lg dark:bg-neutral-800 dark:border-neutral-700 hover:transform hover:scale-[1.02]"
      onClick={() => openModal({
        type: 'marketplace_view',
        title: item.name,
        data: item,
        onSave: async (version_id: string) => {
          const subscriptionData = await getSubscriptionData(version_id)

          const { baseData, versionData } = subscriptionData

          const sys = await saveSystem(baseData)

          if (!sys) return

          const vers = await saveVersionedResource(versionData)

          if (!vers) return

          createSubscription('system', sys.local_id, vers.local_id, false)
        }
      })}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-brand-600 rounded-lg flex items-center justify-center">
          <span className="text-xl font-bold text-white">{item.name[0]}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h5 className="text-xl font-semibold text-neutral-900 truncate dark:text-white">
            {item.name}
          </h5>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {item.creator_username} | Version {getVisualTextFromVersionID(item.version)}
          </p>
        </div>
      </div>
    </div>
  );
};

const Marketplace: React.FC = () => {
  const [items, setItems] = useState<any[]>([])

  const { isLoggedIn } = authState.useValue()

  const { isOnline } = syncState.useValue()

  useEffect(() => {
    if (!isOnline) return setItems([])

    const loadItems = async () => {
      const resp = await getMarketplaceItems()

      setItems(resp)
    }

    loadItems()
  }, [isOnline])

  useEffect(() => {
    const disclaimer = async () => {
      const hasSeenDisclaimer = await MiscStorage.get('seen-marketplace-disclaimer')

      if (hasSeenDisclaimer) return

      openModal({
        title: '',
        type: 'marketplace_disclaimer',
        data: '',
        onSave: () => {
          MiscStorage.set('seen-marketplace-disclaimer', true)
        }
      })
    }

    disclaimer()
  }, [])

  if (!isOnline) {
    return (
      <div className='h-full'>
        <Header title='Marketplace' />

        <div className='flex justify-center items-center p-4'>
          <h2 className='text-3xl'>Marketplace is not available while you're offline!</h2>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title='Marketplace' />

      <div className='p-4'>
        <div className='flex flex-col items-center justify-center'>
          <div className='bg-brand-700 rounded-lg p-8 text-center w-full md:w-10/12 h-40 bg-[url("/marketplace.png")] bg-cover bg-no-repeat bg-top'>
            <h2 className='text-2xl font-bold'>Welcome to the Marketplace!</h2>
            <p className='text-neutral-100'>Explore and discover new systems and modules.</p>
          </div>
        </div>
        <div>
          <h3 className='text-xl font-semibold mt-4'>Featured Systems</h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
            {items.map((item, index) => <ItemCard key={index} item={item} />)}
          </div>
        </div>
        <div>
          <h3 className='text-xl font-semibold mt-4'>Featured Themes</h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
            
          </div>
        </div>
      </div>
      
      {isLoggedIn && (
        <FloatingActionButton
          onClick={() => openModal({
            type: 'PublishItem',
            title: 'none',
            data: 'none',
            onSave: publishItem
          })}
        />
      )}
    </div>
  )
}

export default Marketplace