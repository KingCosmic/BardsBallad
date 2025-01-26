import { PropsWithChildren } from 'react'

type CardProps = {
  title: string;
}

const Card: React.FC<PropsWithChildren<CardProps>> = ({ children, title }) => {
  return (
    <a className='block max-w-sm p-6 bg-white border border-neutral-200 rounded-lg shadow hover:bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700'>

      <h5 className='mb-2 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white'>
        {title}
      </h5>
    
      <div className='font-normal text-neutral-700 dark:text-neutral-400'>
        {children}
      </div>
    </a>
  )
}

export default Card