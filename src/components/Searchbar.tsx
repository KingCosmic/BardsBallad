import { useState } from 'react';

type SearchbarProps = {
  placeholder: string;
  onSearch: (query: string) => void;

  filters: { title: string, property: string, value: any }[];
};

const Searchbar: React.FC<SearchbarProps> = ({ filters, placeholder, onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <form className='bg-fantasy-glass rounded-lg border border-fantasy-border'>
      <div className='flex relative'>
        <label
          htmlFor='search-dropdown'
          className='sr-only'
        >
          Search
        </label>
        <div className='flex relative w-full'>
          <button
            type='submit'
            className='p-2.5 text-sm font-medium h-full text-fantasy-text'
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
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
              />
            </svg>
            <span className='sr-only'>Search</span>
          </button>
          <input
            type='search'
            id='search-dropdown'
            className='block p-2.5 w-full bg-transparent z-20 text-sm text-fantasy-text placeholder:text-fantasy-text-muted focus:ring-fantasy-accent focus:ring-1 focus:outline-none focus:ring-fantasy-accent-dark'
            placeholder={placeholder}
          />
        </div>
        <button
          id='dropdown-button'
          className='shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center rounded-e-lg border-l border-fantasy-medium hover:bg-fantasy-light focus:ring-1 focus:outline-none focus:ring-fantasy-accent-dark'
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
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='m1 1 4 4 4-4'
            />
          </svg>
        </button>
        <div
          id='dropdown'
          className={`${isOpen ? '' : 'hidden'} absolute top-full end-0 mt-3 z-10 bg-neutral-50 divide-y divide-neutral-100 rounded-lg shadow-sm w-44`}
        >
          <ul
            className='py-2 text-sm text-neutral-700 dark:text-neutral-200'
            aria-labelledby='dropdown-button'
          >
            {filters.map(filter => (
              <li key={filter.title}>
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
      </div>
    </form>
  );
};

export default Searchbar;
