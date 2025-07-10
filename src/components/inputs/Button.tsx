import { PropsWithChildren } from 'react'

type ButtonProps = {
  id?: string;
  className?: string;
  color: string;
  disabled?: boolean;
  onClick(): void;
}

const styles: { [key:string]: string } = {
  'primary': 'fantasy-accent-gradient text-fantasy-dark transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fantasy-accent/40 border-none',
  'light': 'text-neutral-900 bg-white border-neutral-300 hover:bg-neutral-100 focus:ring-neutral-100 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600 dark:focus:ring-neutral-700',
  'danger': 'border-red-600 text-red-600 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition',
  'disabled': 'border-neutral-600 bg-neutral-400 text-fantasy-text-muted cursor-not-allowed opacity-50'
}

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({ children, className = '', color, disabled = false, onClick, id }) => {
  return (
    <button
      id={id}
      type='button'
      className={`${disabled ? styles['disabled'] : styles[color]} me-2.5 focus:ring-4 border focus:outline-none font-medium rounded-lg transition text-sm px-4 py-2 text-center ${className}`}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  )
}

export default Button