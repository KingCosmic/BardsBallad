
type CheckboxProps = {
  id: string;
  label: string;
  checked: any;
  onChange(val: boolean): void;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange }) => {
  return (
    <div className='flex items-center'>
      <input id={id} type='checkbox' checked={checked} onChange={() => onChange(!checked)} className='w-4 h-4 text-blue-600 bg-neutral-100 border-neutral-300 rounded focus:ring-brand-500 dark:focus:ring-brand-600 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600' />
      <label htmlFor={id} className='ms-2 text-sm font-medium text-neutral-900 dark:text-neutral-300'>{label}</label>
    </div>
  )
}

export default Checkbox