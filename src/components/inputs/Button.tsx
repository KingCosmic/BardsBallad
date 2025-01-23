import { PropsWithChildren } from 'react'

type ButtonProps = {
  className?: string;
  color: string;
  disabled?: boolean;
  onClick(): void;
}

const styles: { [key:string]: string } = {
  'primary': 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
  'light': 'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700',
  'danger': 'text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
}

// <button type='button'
//   className='py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
//   onClick={() => props.setIsOpen(false)}  
// >
//   Cancel
// </button>

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({ children, className = '', color, disabled = false, onClick }) => {
  return (
    <button
      type='button'
      className={`${styles[color]} me-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center ${className}`}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  )
}

export default Button