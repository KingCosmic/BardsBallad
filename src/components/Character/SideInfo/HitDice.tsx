import React, { useState } from 'react'
import styled from 'styled-components'

import StringEditModal from '../../Modals/StringEdit'
import { changeHitDice } from '../../../services/db'

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

function HitDice(props) {
  const { value } = props

  const [isEditing, setIsEditing] = useState(false)

  return (
    <>
      <StringEditModal
        name='Hit Dice'
        defaultValue={value}
        isOpen={isEditing}
        setIsOpen={setIsEditing}
        onConfirm={(hd) => {changeHitDice(hd); setIsEditing(false);}}
      />
      <Container onClick={() => setIsEditing(true)}>
        <Title>HD</Title>

        <Text>{value}</Text>
      </Container>
    </>
  )
}

export default HitDice
