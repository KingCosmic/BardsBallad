import Header from '@components/Header'
import { closeModal, openModal } from '@state/modals';
import React, { useEffect, useMemo, useState } from 'react';
import { MiscStorage } from '@lib/storage';
import FloatingActionButton from '@components/FloatingActionButton';
import getVisualTextFromVersionID from '@utils/getVisualTextFromVersionID';
import { authState } from '@state/auth';
import { syncState } from '@state/sync';
import { useToast } from '@hooks/useToast';
import {getMarketplaceItems} from "@api/getMarketplaceItems";
import MarketplaceViewModal from '@modals/MarketplaceView';
import MarketplaceDisclaimer from '@modals/MarketplaceDisclaimer';
import PublishNewSystem from '@modals/PublishItem';
import { hasRole } from '@utils/roles/hasRole';
import Roles from '@/const/roles';

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
          <MarketplaceViewModal id={id} title={item.name} data={item} />
        ))}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-fantasy-border rounded-lg flex items-center justify-center">
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

  const { isLoggedIn, user } = authState.useValue()

  const { isOnline } = syncState.useValue()

  const isAdmin = useMemo(() => {
    if (!isLoggedIn) return false
    if (!user) return false

    if (!hasRole(user.role, Roles.ADMINISTRATOR)) return false
  }, [isLoggedIn, user])

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
        <Header title='Marketplace' subtitle='Coming soon: community-made systems, datapacks, & themes.' />

        <div className='flex justify-center items-center p-4'>
          <h2 className='text-3xl'>Marketplace is not available while you're offline!</h2>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title='Marketplace' subtitle='Coming soon: community-made systems, datapacks, & themes.' />

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
      
      {isAdmin && (
        <FloatingActionButton
          onClick={() => openModal('publish-item', ({ id }) => (
            <PublishNewSystem id={id} />
          ))}
        />
      )}
    </div>
  )
}

export default Marketplace

