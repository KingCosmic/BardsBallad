import { useState } from 'react';

type SearchbarProps = {
  placeholder: string;
  onSearch: (query: string) => void;

  filters: { title: string, property: string, value: any }[];
};

const Searchbar: React.FC<SearchbarProps> = ({ filters, placeholder, onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <form className=''>
      <div className='flex relative'>
        <label
          htmlFor='search-dropdown'
          className='sr-only'
        >
          Search
        </label>
        <button
          id='dropdown-button'
          className='shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-neutral-900 bg-netrual-100 border border-neutral-300 rounded-s-lg hover:bg-neutral-200 focus:ring-4 focus:outline-none focus:ring-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:focus:ring-neutral-700 dark:text-neutral-100 dark:border-neutral-600'
          type='button'
          onClick={() => setIsOpen(!isOpen)}
        >
          All{' '}
          <svg
            className='w-2.5 h-2.5 ms-2.5'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 10 6'
          >
            <path
              stroke='currentColor'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='m1 1 4 4 4-4'
            />
          </svg>
        </button>
        <div
          id='dropdown'
          className={`${isOpen ? '' : 'hidden'} absolute top-full mt-3 z-10 bg-neutral-50 divide-y divide-neutral-100 rounded-lg shadow-sm w-44 dark:bg-neutral-700`}
        >
          <ul
            className='py-2 text-sm text-neutral-700 dark:text-neutral-200'
            aria-labelledby='dropdown-button'
          >
            {filters.map(filter => (
              <li>
                <button
                  type='button'
                  className='inline-flex w-full px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 dark:hover:text-neutral-50'
                >
                  {filter.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className='relative w-full'>
          <input
            type='search'
            id='search-dropdown'
            className='block p-2.5 w-full z-20 text-sm text-neutral-900 bg-neutral-50 rounded-e-lg border-s-neutral-50 border-s-2 border border-neutral-300 focus:ring-brand-500 focus:border-brand-500 dark:bg-neutral-700 dark:border-s-neutral-700  dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-neutral-50 dark:focus:border-brand-500'
            placeholder={placeholder}
            required
          />
          <button
            type='submit'
            className='absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-neutral-50 bg-brand-700 rounded-e-lg border border-brand-700 hover:bg-brand-800 focus:ring-4 focus:outline-none focus:ring-brand-300 dark:bg-brand-600 dark:hover:bg-brand-700 dark:focus:ring-brand-800'
          >
            <svg
              className='w-4 h-4'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 20 20'
            >
              <path
                stroke='currentColor'
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
              />
            </svg>
            <span className='sr-only'>Search</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Searchbar;
