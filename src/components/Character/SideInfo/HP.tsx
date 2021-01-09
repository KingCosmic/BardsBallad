import React, { useState } from 'react'
import styled from 'styled-components'

import EditModal from '../../Modals/EditHealth'

import { changeHp } from '../../../services/db'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 5px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
`

const BarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 10px;

  background-color: ${props => props.theme.elevated};
  border: 1px solid;
  border-color: ${props => props.theme.almostblack};
`

const BarFiller = styled.div<{ value: number }>`
  display: flex;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  width: ${props => `${props.value}%`};

  background-color: ${props => props.theme[props.color] || props.theme.text};
`

const Text = styled.p`
  color: ${props => props.theme.text};
  display: block;
  font-size: 0.9em;
`

const determinPercent = (current, max, temp = 0, isTemp = true) =>
  ((current + (isTemp ? temp : 0)) / (max + temp)) * 100

type Props = {
  hp: {
    current:number
    max:number
    temp:number
  }
}

function HP(props:Props) {
  const { hp } = props

  const [isEditing, setIsEditing] = useState(false)

  const tempRender = determinPercent(hp.current, hp.max, hp.temp)
  const hpRender = determinPercent(hp.current, hp.max, hp.temp, false)

  return (
    <Container onClick={() => setIsEditing(true)}>
      <EditModal
        isOpen={isEditing}
        setIsOpen={setIsEditing}
        defaultValue={hp}
        onConfirm={updatedhp => changeHp(updatedhp)}
      />
      <Text>
        HP: {hp.current}/{hp.max} {hp.temp ? ` (+${hp.temp})` : ''}
      </Text>
      <BarContainer>
        <BarFiller value={tempRender} color="blue" />
        <BarFiller value={hpRender} color="green" />
      </BarContainer>
    </Container>
  )
}

export default HP
