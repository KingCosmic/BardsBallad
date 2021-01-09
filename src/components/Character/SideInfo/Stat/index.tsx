import React, { useState } from 'react'
import styled from 'styled-components'

import B from './Bonus'

import NumberEditModal from '../../../Modals/NumberEdit';
import { changeStat } from '../../../../services/db';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  align-items: center;
  width: 32%;
  border: 1px solid ${props => props.theme.almostblack};
  background: ${props => props.theme.sidebars};
  margin: 5px;
  justify-content: center;
  cursor: pointer;
`

const Text = styled.p`
  font-size: 1.25vw;
`

const Title = styled(Text)`
  color: ${props => props.theme.gold};
`

const Bonus = styled(B)`
  font-size: 1.25vw;
`

function Stat(props) {
  const { name, path, value } = props

  const [isEditing, setIsEditing] = useState(false)

  return (
    <>
      <NumberEditModal
        name={name}
        defaultValue={value}
        isOpen={isEditing}
        setIsOpen={setIsEditing}
        onConfirm={(stat) => {changeStat(path, stat); setIsEditing(false); }}
      />
      <Container onClick={() => setIsEditing(true)}>
        <Title>{name}</Title>

        <Bonus value={value} />

        <Text>{value}</Text>
      </Container>
    </>
  )
}

export default Stat
