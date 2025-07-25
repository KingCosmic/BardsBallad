import { openSidebar } from '@state/sidebar'

const MenuButton: React.FC = () => {
  return (
    <button onClick={openSidebar} type='button' className='sm:hidden bg-fantasy-glass border border-fantasy-border rounded-lg p-4 mr-4 backdrop-blur-lg text-fantasy-accent text-lg transition-all duration-300 hover:bg-fantasy-accent/20 hover:scale-105'>
      <span className='sr-only'>Open sidebar</span>
      <svg className='w-6 h-6' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
        <path clipRule='evenodd' fillRule='evenodd' d='M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z'></path>
      </svg>
    </button>
  )
}

export default MenuButton
