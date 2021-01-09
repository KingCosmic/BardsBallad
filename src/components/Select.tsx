import React from 'react'
import styled from 'styled-components'

import {
  Listbox,
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from '@reach/listbox'
import '@reach/listbox/styles.css'

const CustomListBox = styled(Listbox)`
  border: none;
  outline: none;
  color: ${props => props.theme.text};
  font-family: OpenSans;
  text-decoration: none;
`

type Props = {
  value: string
  options: { value: string, label: string }[]
  onChange(value: string): void
  multi?: boolean
}

function Select(props: Props) {
  const { value, options, multi = false, onChange } = props

  return (
    <CustomListBox defaultValue={`${value}`} onChange={onChange}>
      {options.map(({ value, label }, i) => (
        <ListboxOption value={`${value}`}>{`${label}`}</ListboxOption>
      ))}
    </CustomListBox>
  )
}

export default Select