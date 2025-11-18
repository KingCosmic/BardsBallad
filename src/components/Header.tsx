import MenuButton from './MenuButton'
import { openSecondarySidebar } from '@state/sidebar'

import { MoreVertical } from 'lucide-react'

type HeaderProps = {
  title: string
  subtitle?: string
  options?: { onClick(): void, Content: React.FC }[]
  hasSidebar?: boolean
}

const Header: React.FC<HeaderProps> = ({ title, subtitle = '', options, hasSidebar = false }) => {
  return (
    <div className={`flex flex-row justify-between mb-8 ${(hasSidebar ? 'lg:w-[calc(100vw-36rem)]' : '')}`}>
      <div className='flex flex-row justify-between w-full items-center'>
        <MenuButton />

        <div>
          <h1 className='text-3xl font-light text-fantasy-text mb-2 drop-shadow-lg'>{title}</h1>
          <p className='text-sm text-fantasy-accent/80'>{subtitle}</p>
        </div>

        <div className='flex flex-row-reverse items-center'>
        {hasSidebar && (
          <button onClick={openSecondarySidebar} type='button' className='sm:hidden bg-fantasy-glass border border-fantasy-border rounded-lg p-3 backdrop-blur-lg text-fantasy-accent text-lg transition-all duration-300 hover:bg-fantasy-accent/20 hover:scale-105'>
            <span className='sr-only'>Open Details</span>
            <MoreVertical />
          </button>
        )}
  
        {options?.length && (
            <ul className='flex flex-row gap-2'>
              {options?.map(({ Content, onClick }, i) => (
                <li key={i} onClick={onClick} className='flex justify-center items-center bg-fantasy-dark text-fantasy-text border border-fantasy-border p-4 rounded-lg text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fantasy-dark/40 cursor-pointer'>
                  <Content />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header