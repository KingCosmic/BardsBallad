
type TextareaProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange(value: string): void
}

const Textarea: React.FC<TextareaProps> = ({ id, label, placeholder, value, onChange }) => {
  return (
    <div>
      <label htmlFor={id} className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>{label}</label>
      <textarea id={id} rows={4} placeholder={placeholder} value={value} onChange={ev => onChange(ev.target.value)} className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
    </div>
  )
}

export default Textarea