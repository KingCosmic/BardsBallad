import React from 'react'
import styled from 'styled-components'

import { Character } from '../../../types'

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
  width: 80%;
  text-align: center;

  &:focus {
    outline: none;
  }
`

type Props = {
  data:Character
}

function EditingInfo(props:Props) {
  return (
    <>
      <Input />
    </>
  )
}

export default EditingInfo