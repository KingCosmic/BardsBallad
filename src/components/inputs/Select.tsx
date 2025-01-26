import { PropsWithChildren } from 'react';

type SelectProps = {
  id: string;
  label: string;
  value: string;
  onChange(val: string): void;
}

const Select: React.FC<PropsWithChildren<SelectProps>> = ({ id, label, value, onChange, children, }) => {
  return (
    <div className='mb-6'>
      <label
        htmlFor={id}
        className='block mb-2 text-sm font-medium text-neutral-900 dark:text-white'
      >
        {label}
      </label>
      <select
        id={id}
        className='bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-brand-500 dark:focus:border-brand-500'
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
      >
        {children}
      </select>
    </div>
  )
}

export default Select
