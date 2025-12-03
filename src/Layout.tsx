import { Outlet } from 'react-router'
import ModalManager from './components/modal-manager'

const Layout: React.FC = () => {

  return (
    <div className='w-dvw h-dvh transition-colors overflow-x-hidden fantasy-gradient fantasy-atmospheric text-fantasy-text'>
      {/* Floating particles container */}
      <div className="fixed inset-0 pointer-events-none z-10" id="particleContainer" />

      {/* Content Outlet */}
      <Outlet />

      {/* Our Modal Manager */}
      <ModalManager />
    </div>
  )
}

export default Layout