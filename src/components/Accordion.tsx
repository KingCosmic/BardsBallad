import { PropsWithChildren } from 'react'

type AccordionProps = {
  id: string;
  title: string;
  isOpen: boolean;
  toggleState(isOpen: boolean): void;
}

const Accordion: React.FC<PropsWithChildren<AccordionProps>> = ({ children, id, title, isOpen, toggleState }) => {
  return (
    <>
      <h2>
        <button type='button'
          onClick={() => toggleState(!isOpen)}
          className={`${isOpen && 'bg-brand-100 dark:bg-neutral-800 text-brand-600 dark:text-white'} flex items-center justify-between w-full p-5 font-medium rtl:text-right text-neutral-500 border border-neutral-200 dark:border-neutral-700 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 gap-3`}
        >
          <span>{title}</span>
          <svg data-accordion-icon className={`${isOpen ? '' : 'rotate-180'} w-3 h-3 shrink-0`} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 10 6'>
            <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5 5 1 1 5'/>
          </svg>
        </button>
      </h2>
      <div className={`${isOpen ? 'flex' : 'hidden'} w-full`}>
        <div className='p-5 w-full border border-t-0 border-neutral-200 dark:border-neutral-700'>
          {children}
        </div>
      </div>
    </>
  )
}

export default Accordion