import React, { useState } from 'react'
import styled from 'styled-components'

import EditModal from '../../Modals/EditEXP'

import { changeExp } from '../../../services/db'
import { getLevel } from '../../../system'

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
  color: rgb(255, 255, 255, 0.8);
  display: block;
  font-size: 0.9em;
`

const determinPercent = (current:number, max:number) =>
  current > max ? 100 : (current / max) * 100

type Props = {
  current: number
}

function EXP(props: Props) {
  const { current } = props

  const [isEditing, setIsEditing] = useState(false)

  const max = getLevel(current).expToNext

  const expRender = determinPercent(current, max)

  return (
    <Container onClick={() => setIsEditing(true)}>
      <EditModal
        isOpen={isEditing}
        setIsOpen={setIsEditing}
        defaultValue={current}
        onConfirm={updatedExp => changeExp(updatedExp)}
      />
      <Text>
        EXP: {current}/{max}
      </Text>
      <BarContainer>
        <BarFiller value={expRender} color="gold" />
      </BarContainer>
    </Container>
  )
}

export default EXP
