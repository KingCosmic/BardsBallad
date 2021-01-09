import React, { useState } from 'react'
import styled from 'styled-components'

import NumberEditModal from '../../Modals/NumberEdit';
import { changeSpeed } from '../../../services/db';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  padding: 5px;
  align-items: center;
  width: 32%;
  border: 1px solid ${props => props.theme.almostblack};
  background: ${props => props.theme.sidebars};
  margin: 5px;
  justify-content: center;
`

const Text = styled.p`
  font-size: 1.25vw;
`

const Title = styled(Text)`
  color: ${props => props.theme.gold};
`

function Speed(props) {
  const { name, value } = props

  const [isEditing, setIsEditing] = useState(false)

  return (
    <>
      <NumberEditModal
        name={name}
        defaultValue={value}
        isOpen={isEditing}
        setIsOpen={setIsEditing}
        onConfirm={(spd) => {changeSpeed(spd); setIsEditing(false);}}
      />
      <Container onClick={() => setIsEditing(true)}>
        <Title>{name}</Title>

        <Text>{value}</Text>
      </Container>
    </>
  )
}

export default Speed
