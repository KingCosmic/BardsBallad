import { openSidebar } from '@state/sidebar'

const MenuButton: React.FC = () => {
  return (
    <button onClick={openSidebar} type='button' className='inline-flex items-center p-2 mt-2 ms-3 text-sm text-neutral-500 rounded-lg sm:hidden hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:ring-neutral-600'>
      <span className='sr-only'>Open sidebar</span>
      <svg className='w-6 h-6' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
        <path clipRule='evenodd' fillRule='evenodd' d='M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z'></path>
      </svg>
    </button>
  )
}

export default MenuButton
