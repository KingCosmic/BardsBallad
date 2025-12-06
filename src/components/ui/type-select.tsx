import { type SystemType } from '@/db/system/schema'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './select'
import { Label } from './label'

type Props = {
  id?: string
  label?: string
  types: SystemType[]
  value: string
  onChange(val: string): void
  includeBuiltins?: boolean
}

const builtinTypes = ['string', 'number', 'boolean', 'enum', 'script', 'Calculation']

export default function TypeSelect({ id = 'type', label = 'Type', types, value, onChange, includeBuiltins = true }: Props) {
  return (
    <Label htmlFor={id}>
      {label}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className='w-[180px]'>
          <SelectValue placeholder='Select Type' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Builtins</SelectLabel>
            {includeBuiltins && builtinTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Custom Types</SelectLabel>
            {types.map(t => (
              <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Label>
  )
}