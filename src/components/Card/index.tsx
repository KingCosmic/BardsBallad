import { PropsWithChildren } from 'react'

type CardProps = {
  title: string;
}

const Card: React.FC<PropsWithChildren<CardProps>> = ({ children, title }) => {
  return (
    <a className='block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'>

      <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
        {title}
      </h5>
    
      <div className='font-normal text-gray-700 dark:text-gray-400'>
        {children}
      </div>
    </a>
  )
}

export default Card