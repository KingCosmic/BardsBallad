
type CheckboxProps = {
  id: string;
  label: string;
  checked: any;
  onChange(val: boolean): void;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange }) => {
  return (
    <div className='flex items-center'>
      <input id={id} type='checkbox' checked={checked} onChange={() => onChange(!checked)} className='w-4 h-4 rounded focus:ring-2 focus:ring-fantasy-accent ring-offset-fantasy-text-muted border-fantasy-border' />
      <label htmlFor={id} className='ms-2 text-sm font-medium text-fantasy-text'>{label}</label>
    </div>
  )
}

export default Checkbox