import React, { useState } from 'react'
import styled from 'styled-components'

import NumberEditModal from '../../Modals/NumberEdit'
import { changeAC } from '../../../services/db'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  align-items: center;

  background: ${props => props.theme.sidebars};
  width: 32%;
  padding: 5px;
  margin: 5px;
  justify-content: center;
  border: 1px solid ${props => props.theme.almostblack};
`

const Text = styled.p`
  font-size: 1.25vw;
`

const Title = styled(Text)`
  color: ${props => props.theme.gold};
`

function ArmorClass(props) {
  const { name, value } = props

  const [isEditing, setIsEditing] = useState(false)

  return (
    <>
      <NumberEditModal
        name={name}
        defaultValue={value}
        isOpen={isEditing}
        setIsOpen={setIsEditing}
        onConfirm={(ac) => {changeAC(ac); setIsEditing(false);}}
      />
      <Container onClick={() => setIsEditing(true)}>
        <Title>{name}</Title>

        <Text>{value}</Text>
      </Container>
    </>
  )
}

export default ArmorClass
