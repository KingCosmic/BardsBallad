import { PropsWithChildren } from 'react'

type AccordionProps = {
  id: string;
  title: string;
  isOpen: boolean;
  toggleState(isOpen: boolean): void;
}

const Accordion: React.FC<PropsWithChildren<AccordionProps>> = ({ children, id, title, isOpen, toggleState }) => {
  return (
    <div className='bg-fantasy-glass'>
      <h2>
        <button type='button'
          onClick={() => toggleState(!isOpen)}
          className={`flex items-center justify-between w-full p-5 font-medium rtl:text-right border border-fantasy-border hover:bg-fantasy-dark gap-3 ${isOpen ? 'bg-fantasy-dark text-fantasy-text' : 'text-fantasy-text-muted'}`}
        >
          <span>{title}</span>
          <svg data-accordion-icon className={`${isOpen ? '' : 'rotate-180'} w-3 h-3 shrink-0`} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 10 6'>
            <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5 5 1 1 5'/>
          </svg>
        </button>
      </h2>
      <div className={`${isOpen ? 'flex' : 'hidden'} w-full`}>
        <div className='p-5 w-full border border-t-0 border-fantasy-border'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Accordion