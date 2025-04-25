import { NavLink } from 'react-router';
import Header from '../components/Header'
import { openModal } from '../state/modals';

const testSystems = [
  {
    name: 'Pathfinder 2e',
    description: 'A fantasy role-playing game set in a world of magic and adventure.',
    version: '2.0.0',
  },
  {
    name: 'Pathfinder 3e',
    description: 'A fantasy role-playing game set in a world of magic and adventure.',
    version: '2.0.0',
  },
  {
    name: 'Dungeons And Dragons 5e',
    description: 'A fantasy role-playing game set in a world of magic and adventure.',
    version: '2.0.0',
  }
]

const SystemCard: React.FC<{ sys: { name: string, description: string, version: string } }> = ({ sys }) => {
  return (
    <div
      key={sys.name}
      className="relative flex flex-col max-w-96 p-4 tranasition-all duration-200 bg-white border rounded-xl hover:shadow-lg dark:bg-neutral-800 dark:border-neutral-700 hover:transform hover:scale-[1.02]"
    >
      <div
        onClick={() => openModal({
          type: 'marketplace_view',
          title: sys.name,
          data: sys,
          onSave: () => {

          },
        })}
        className="flex items-start space-x-4"
      >
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-brand-600 rounded-lg flex items-center justify-center">
          <span className="text-xl font-bold text-white">{sys.name[0]}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h5 className="text-xl font-semibold text-neutral-900 truncate dark:text-white">
            {sys.name}
          </h5>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Version {sys.version}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4 border-t pt-3 dark:border-neutral-700">
        <button
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
        </button>
      </div>
    </div>
  );
};

const Marketplace: React.FC = () => {
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
            {testSystems.map((system, index) => <SystemCard sys={system} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Marketplace