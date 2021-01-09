import React, { useState } from 'react'
import styled from 'styled-components'

import ChangeName from '../../Modals/StringEdit'

import { changeName } from '../../../services/db'

const Text = styled.p`
  color: ${props => props.theme.gold};
  font-size: 1.7em;

  padding: 0 5px;
  width: 100%;

  @media only screen and (min-width: 768px) {
    font-size: 1.4vw;
  }
`

type Props = {
  name: string
}

function Name(props: Props) {
  const { name } = props

  const [isEditing, setIsEditing] = useState(false)

  return (
    <>
      <ChangeName
        isOpen={isEditing}
        setIsOpen={setIsEditing}
        defaultValue={name}
        onConfirm={updatedName => changeName(updatedName)}
      />
      <Text onClick={() => setIsEditing(true)}>{name}</Text>
    </>
  )
}

export default Name
