import Header from '../components/Header'
import { openModal } from '../state/modals';
import { useEffect, useState } from 'react';
import { MiscStorage } from '../lib/storage';
import FloatingActionButton from '../components/FloatingActionButton';
import { getMarketplaceItems, publishSystem, publishVersion } from '../lib/api';

type MarketplaceItem = {
  id: string,
  name: string,
  description: string,

  creator_id: string,

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
      className="relative flex flex-col max-w-96 p-4 tranasition-all duration-200 bg-white border rounded-xl hover:shadow-lg dark:bg-neutral-800 dark:border-neutral-700 hover:transform hover:scale-[1.02]"
    >
      <div
        onClick={() => openModal({
          type: 'marketplace_view',
          title: item.name,
          data: item,
          onSave: () => {

          },
        })}
        className="flex items-start space-x-4"
      >
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-brand-600 rounded-lg flex items-center justify-center">
          <span className="text-xl font-bold text-white">{item.name[0]}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h5 className="text-xl font-semibold text-neutral-900 truncate dark:text-white">
            {item.name}
          </h5>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Published {new Date(item.published_at).toDateString()}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4 border-t pt-3 dark:border-neutral-700">
        {/* <button
          onClick={() => {}}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md dark:text-blue-400 dark:hover:bg-blue-900/30"
        >
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Export
        </button> */}
      </div>
    </div>
  );
};

const Marketplace: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<any[]>([])

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

    const loadItems = async () => {
      const resp = await getMarketplaceItems()

      setItems(resp)
    }

    disclaimer()
    loadItems()
  }, [])

  return (
    <div>
      <Header title='Marketplace' />

      <div className='p-4'>
        <div className='flex flex-col items-center justify-center'>
          <img src='/images/marketplace.png' alt='Marketplace' className='w-1/2 mb-4' />
          <h2 className='text-2xl font-bold'>Welcome to the Marketplace!</h2>
          <p className='text-gray-600'>Explore and discover new systems and modules.</p>
        </div>
        <div>
          <h3 className='text-xl font-semibold mt-4'>Featured Systems</h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
            {items.map((item, index) => <ItemCard item={item} />)}
          </div>
        </div>
        <div>
          <h3 className='text-xl font-semibold mt-4'>Featured Themes</h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
            
          </div>
        </div>
      </div>

      <FloatingActionButton
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        buttons={[
          {
            name: 'Publish System',
            icon: '',
            onClick: () => openModal({
              type: 'PublishNewSystem',
              title: 'none',
              data: 'none',
              onSave: publishSystem
            })
          },
          {
            name: 'Publish Version',
            icon: '',
            onClick: () => openModal({
              type: 'PublishNewVersion',
              title: 'none',
              data: 'none',
              onSave: publishVersion
            })
          }
        ]}
      />
    </div>
  )
}

export default Marketplace