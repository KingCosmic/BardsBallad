import React, { useState } from 'react'
import styled from 'styled-components'

import ChangeClass from '../../Modals/StringEdit'

import { changeJob } from '../../../services/db'

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
  job: string
}

function Class(props: Props) {
  const { job } = props

  const [isEditing, setIsEditing] = useState(false)

  return (
    <>
      <ChangeClass
        isOpen={isEditing}
        setIsOpen={setIsEditing}
        defaultValue={job}
        onConfirm={updatedClass => changeJob(updatedClass)}
      />
      <Text onClick={() => setIsEditing(true)}>{job}</Text>
    </>
  )
}

export default Class
