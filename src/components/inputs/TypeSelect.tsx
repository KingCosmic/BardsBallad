import React from 'react'
import Select from './Select'
import { type SystemType } from '@storage/schemas/system'

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
    <Select id={id} label={label} value={value} onChange={onChange}>
      {includeBuiltins && builtinTypes.map(t => <option key={t} value={t}>{t}</option>)}

      {types.map(t => (
        <option key={t.name} value={t.name}>{t.name}</option>
      ))}
    </Select>
  )
}
