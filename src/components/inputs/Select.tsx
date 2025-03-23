import { forwardRef, HTMLAttributes, PropsWithChildren, StyleHTMLAttributes } from 'react';

type SelectProps = {
  id: string;
  className?: string;
  label: string;
  value: string;
  onChange(val: string): void;

  style?: React.CSSProperties;
}

const Select: React.FC<PropsWithChildren<SelectProps>> = forwardRef(({ id, label, value, onChange, children, style, className }, ref) => {
  return (
    // @ts-ignore
    <div className={`mb-6`} style={style} ref={ref}>
      <label
        htmlFor={id}
        className='block mb-2 text-sm font-medium text-neutral-900 dark:text-white'
      >
        {label}
      </label>
      <select
        id={id}
        className={`${className} bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-brand-500 dark:focus:border-brand-500`}
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
      >
        {children}
      </select>
    </div>
  )
})

export default Select
