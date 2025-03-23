import { PropsWithChildren } from 'react'

type ButtonProps = {
  id?: string;
  className?: string;
  color: string;
  disabled?: boolean;
  onClick(): void;
}

const styles: { [key:string]: string } = {
  'primary': 'text-white bg-brand-700 hover:bg-brand-800 focus:ring-brand-300 dark:bg-brand-600 dark:hover:bg-brand-700 dark:focus:ring-brand-800 border-brand-700',
  'light': 'text-neutral-900 bg-white border-neutral-300 hover:bg-neutral-100 focus:ring-neutral-100 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600 dark:focus:ring-neutral-700',
  'danger': 'border-red-600 text-red-600 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition',
  'disabled': 'border-neutral-600 bg-neutral-400 text-neutral-700 cursor-not-allowed opacity-50'
}

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({ children, className = '', color, disabled = false, onClick, id }) => {
  return (
    <button
      id={id}
      type='button'
      className={`${disabled ? styles['disabled'] : styles[color]} me-2.5 focus:ring-4 border focus:outline-none font-medium rounded-lg transition text-sm px-5 py-2.5 text-center ${className}`}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  )
}

export default Button