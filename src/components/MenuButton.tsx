import { openMainSidebar } from '@state/sidebar'

import { Menu } from 'lucide-react'

const MenuButton: React.FC = () => {
  return (
  <button onClick={openMainSidebar} type='button' className='sm:hidden bg-fantasy-glass border border-fantasy-border rounded-lg p-3 backdrop-blur-lg text-fantasy-accent text-lg transition-all duration-300 hover:bg-fantasy-accent/20 hover:scale-105'>
      <span className='sr-only'>Open sidebar</span>
      <Menu />
    </button>
  )
}

export default MenuButton
