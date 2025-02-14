
type TextareaProps = {
  id: string;
  label: string;
  value: string;
  onChange(value: string): void
}

const Textarea: React.FC<TextareaProps> = ({ id, label, value, onChange }) => {
  return (
    <div>
      <label htmlFor={id} className='block mb-2 text-sm font-medium text-neutral-900 dark:text-white'>{label}</label>
      <textarea id={id} rows={4} value={value} onChange={ev => onChange(ev.target.value)} className='block p-2.5 w-full text-sm text-neutral-900 bg-neutral-50 rounded-lg border border-neutral-300 focus:ring-brand-500 focus:border-brand-500 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-brand-500 dark:focus:border-brand-500' />
    </div>
  )
}

export default Textarea