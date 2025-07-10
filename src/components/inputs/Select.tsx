import { forwardRef, HTMLAttributes, PropsWithChildren, StyleHTMLAttributes } from 'react';

type SelectProps = {
  id: string;
  containerClassName?: string;
  labelClassName?: string;
  className?: string;
  label: string;
  value: string;
  onChange(val: string): void;

  style?: React.CSSProperties;
}

const Select: React.FC<PropsWithChildren<SelectProps>> = forwardRef(({ id, label, value, onChange, children, style, containerClassName, labelClassName, className }, ref) => {
  return (
    // @ts-ignore
    <div className={containerClassName ? containerClassName : `mb-6`} style={style} ref={ref}>
      <label
        htmlFor={id}
        className={`block mb-2 text-sm font-medium text-neutral-900 dark:text-white ${labelClassName}`}
      >
        {label}
      </label>
      <select
        id={id}
        className={`${className} block w-full p-3 bg-fantasy-dark text-fantasy-text border border-fantasy-border rounded-lg text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fantasy-dark/40 cursor-pointer`}
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
      >
        {children}
      </select>
    </div>
  )
})

export default Select
