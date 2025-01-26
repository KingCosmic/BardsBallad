
type TextInputProps = {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange(val: string): void;
  isValid: boolean;
  errorMessage: string;
}

const TextInput: React.FC<TextInputProps> = ({ id, label, placeholder, value, onChange, isValid, errorMessage }) => {
  const labelClasses = (isValid) ? '' : 'text-red-700 dark:text-red-500'
  const inputClasses = (isValid) ? 'border border-neutral-600' : 'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500'
  const messageClasses = (isValid) ? '' : 'text-red-600 dark:text-red-500'

  return (
    <div className='mb-6'>
      <label htmlFor={id} className={`${labelClasses} block mb-2 text-sm font-medium`}>{label}</label>
      <input type='text' value={value} onChange={(ev) => onChange(ev.target.value)} placeholder={placeholder} id={id} className={`${inputClasses} text-sm rounded-lg block w-full p-2.5 dark:bg-neutral-700 dark:placeholder:text-neutral-300`} />
      <p className={`${messageClasses} mt-2 text-sm`}>{isValid ? '' : errorMessage}</p>
    </div>
  )
}

export default TextInput