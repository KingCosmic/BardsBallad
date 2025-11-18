import { PropsWithChildren } from 'react'

type ButtonProps = {
  id?: string;
  className?: string;
  color: 'primary' | 'light' | 'danger' | 'disabled';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?(): void;
}

const styles: { [key:string]: string } = {
  'primary': 'fantasy-accent-gradient text-fantasy-dark transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fantasy-accent/40 border-none',
  'light': 'bg-white/10 text-fantasy-text border border-white/20 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:bg-white/20',
  'danger': 'border-red-600 text-red-600 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition',
  'disabled': 'border-gray-600 bg-gray-400 text-fantasy-text-muted cursor-not-allowed opacity-50'
}

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({ children, className = '', type = 'button', color, disabled = false, onClick, id }) => {
  return (
    <button
      type={type}
      id={id}
      className={`${disabled ? styles['disabled'] : styles[color]} me-2.5 focus:ring-4 border focus:outline-none font-medium rounded-lg transition text-sm p-2 text-center ${className}`}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  )
}

export default Button