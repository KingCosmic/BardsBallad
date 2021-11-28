import React from 'react'
import styled, { css } from 'styled-components'

const Input = styled.input`
  margin: 0 15px;
  color: rgba(20, 20, 20, 0.85);
  border: none;
  background: ${props => props.theme.elevated};
  border: 2px solid ${props => props.theme.sidebars};
  padding: 10px;
  border-radius: 4px;
  appearance: none;
  color: ${props => props.theme.gold};
  font-size: 1.4em;
  width: 100%;
  text-align: center;

  &:focus {
    outline: none;
  }
`

type Props = {}

function ChooseName(props:Props) {
  const { } = props

  return (
    <div className='flex flex-col items-center p-4'>

      <p className='mb-4'>what is your name adventurer?</p>

      <Input
        type='text'
        spellCheck='false'
        defaultValue={''}
        onChange={e => {}}
      />
    </div>
  )
}

export default ChooseName
