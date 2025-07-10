import Header from '@components/Header'
import { closeModal, openModal } from '@state/modals';
import React, { useEffect, useState } from 'react';
import { MiscStorage } from '@lib/storage';
import FloatingActionButton from '@components/FloatingActionButton';
import getVisualTextFromVersionID from '@utils/getVisualTextFromVersionID';
import createSubscription from '@storage/methods/subscriptions/createSubscription';
import saveSystem from '@storage/methods/systems/saveSystem';
import saveVersionedResource from '@storage/methods/versionedresources/saveVersionedResource';
import { authState } from '@state/auth';
import { syncState } from '@state/sync';
import { useToast } from '@hooks/useToast';
import {getMarketplaceItems} from "@api/getMarketplaceItems";
import {getSubscriptionData} from "@api/getSubscriptionData";
import {publishItem} from "@api/publishItem";
import MarketplaceViewModal from '@modals/MarketplaceView';
import MarketplaceDisclaimer from '@modals/MarketplaceDisclaimer';
import PublishNewSystem from '@modals/PublishItem';

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
  const { addToast } = useToast()

  return (
    <div
      key={item.name}
      className="fantasy-card-gradient border border-fantasy-border rounded-2xl p-6 cursor-pointer transition-all duration-500 backdrop-blur-lg shadow-2xl hover:-translate-y-2 hover:shadow-fantasy-accent/20 hover:shadow-xl hover:border-fantasy-accent/40 relative"
      onClick={() =>
        openModal('view marketplace item', ({ id }) => (
          <MarketplaceViewModal id={id} title={item.name} data={item} onSubscribe={async (version_id: string) => {
            try {
              const subscriptionData = await getSubscriptionData(version_id)

              const { baseData, versionData } = subscriptionData

              const sys = await saveSystem(baseData)

              if (!sys) return addToast('Failed to create system.', 'error')

              const vers = await saveVersionedResource(versionData)

              if (!vers) return addToast('Failed to create version.', 'error')

              const sub = await createSubscription('system', sys.local_id, vers.local_id, false)

              if (!sub) return addToast('Failed to create subscription.', 'error')

              addToast('Subscription created!', 'success')
            } catch(e) {
              console.error(`Error creating subscription: ${e}`)
              addToast(`Error creating subscription`, 'error')
            }
          }} />
        ))}
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
  const [items, setItems] = useState<MarketplaceItem[]>([])

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

      openModal('marketplace-disclaimer', ({ id }) => (
        <MarketplaceDisclaimer onAccept={() => {
          closeModal(id)
          MiscStorage.set('seen-marketplace-disclaimer', true)
        }} />
      ))
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
      <Header title='Marketplace' subtitle='Discover amazing systems, themes, and content created by the community' />

      <div className='px-4 pb-4'>
        {/* Categories */}
        <div>
          <h3 className='text-3xl font-semibold mt-4'>Browse Categories</h3>
          <div className='flex flex-wrap gap-3 mt-2'>
            {[
              '⚔️ Game Systems (40)',
              '📦 Datapacks (100+)',
              '🎨 Themes (32)',
            ].map(item => (
              <span key={item} className='cursor-pointer bg-gradient-to-br from-fantasy-accent/20 to-fantasy-accent-dark/10 border border-fantasy-accent/30 rounded-xl px-4 py-2 text-sm leading-relaxed'>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className='text-3xl font-semibold mt-4 mb-2'>Featured Systems</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {items.filter(i => i.resource_type === 'system').map((item, index) => <ItemCard key={index} item={item} />)}
          </div>
        </div>
        <div>
          <h3 className='text-3xl font-semibold mt-4'>Featured Datapacks</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {items.filter(i => i.resource_type === 'datapack').map((item, index) => <ItemCard key={index} item={item} />)}
          </div>
        </div>
        <div>
          <h3 className='text-3xl font-semibold mt-4'>Featured Themes</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {items.filter(i => i.resource_type === 'datapack').map((item, index) => <ItemCard key={index} item={item} />)}
          </div>
        </div>
      </div>
      
      {isLoggedIn && (
        <FloatingActionButton
          onClick={() => openModal('publish-item', ({ id }) => (
            <PublishNewSystem id={id} onPublish={publishItem} />
          ))}
        />
      )}
    </div>
  )
}

export default Marketplace

