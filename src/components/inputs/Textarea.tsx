
type TextareaProps = {
  id: string;
  label: string;
  value: string;
  onChange(value: string): void
}

const Textarea: React.FC<TextareaProps> = ({ id, label, value, onChange }) => {
  return (
    <div>
      <label htmlFor={id} className='block mb-2 text-sm font-medium text-fantasy-text'>{label}</label>
      <textarea id={id} rows={4} value={value} onChange={ev => onChange(ev.target.value)} className='block p-2.5 w-full text-sm placeholder-fantasy-text-muted text-fantasy-text bg-fantasy-dark rounded-lg border border-fantasy-border focus:ring-fantasy-accent focus:border-fantasy-accent' />
        
    </div>
  )
}

export default Textarea