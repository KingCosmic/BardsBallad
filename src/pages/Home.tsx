import Header from '@components/Header'
import React from "react";

const items: { title: string; date: string; description: string; }[] = [
  {
    title: 'Added Eruda debugging support, and started work on theme system.',
    date: 'Released on January 21st, 2025',
    description: 'Check your settings for themes and to enable Eruda!'
  },
  {
    title: 'Editor Released!',
    date: 'Released on January 16th, 2025',
    description: 'We\'ve released the Editor portion of BarsBallad, this will allow you to make your own systems! It includes visual drag and drop creation of character of tabs, and a custom visual code editor.'
  },
  {
    title: 'Beta Release',
    date: 'Released on August 14th, 2024',
    description: 'We\'re releasing BardsBallad into open beta! Please share all feedback through discord and github and share us with your friends!'
  }
]

type TimelineItemProps = {
  title: string;
  isLatest: boolean;
  date: string;
  description: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ title, isLatest, date, description }) => {
  return (
    <li className='mb-10 ms-6'>
      <span className='absolute flex items-center justify-center w-6 h-6 bg-brand-100 rounded-full -start-3 ring-8 ring-white dark:ring-neutral-900 dark:bg-brand-900'>
        <svg
          className='w-2.5 h-2.5 text-brand-800 dark:text-brand-300'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path d='M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z' />
        </svg>
      </span>
      <h3 className='flex items-center mb-1 text-lg font-semibold text-neutral-900 dark:text-white'>
        {title}{isLatest ? (
          <>
            {' '}
            <span className='bg-brand-100 text-brand-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-brand-900 dark:text-brand-300 ms-3'>
              Latest
            </span>
          </>
        ) : null}
      </h3>
      <time className='block mb-2 text-sm font-normal leading-none text-neutral-400 dark:text-neutral-500'>
        {date}
      </time>
      <p className='mb-4 text-base font-normal text-neutral-500 dark:text-neutral-400'>
        {description}
      </p>
      {/* <a
        href='#'
        className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700'
      >
        <svg
          className='w-3.5 h-3.5 me-2.5'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path d='M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z' />
          <path d='M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z' />
        </svg>{' '}
        Download ZIP
      </a> */}
    </li>
  )
}

const Home: React.FC = () => {
  return (
    <div>
      <Header title='Home' />

      <ol className='relative m-10 border-s border-neutral-200 dark:border-neutral-700'>
        {items.map((item, index) => <TimelineItem key={item.title} title={item.title} isLatest={index === 0} date={item.date} description={item.description} />)}
      </ol>
    </div>
  )
}

export default Home

