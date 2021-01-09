import React from 'react'
import styled, { css } from 'styled-components'

import { schoolTypes } from '../../../system'

import { Spell as SpellType } from '../../../types'

type ContainerProps = {
  index: number
}

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px;
  cursor: pointer;

  ${props =>
    Math.abs(props.index % 2) === 1 &&
    css`
      background-color: rgba(0, 0, 0, 0.17);
    `}
`

const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Header = styled.p`
  font-size: 1.2em;
`

const SubText = styled.p`
  color: rgba(255, 255, 255, 0.7);
`

type Props = {
  item: SpellType
  onClick(): void
  index: number
}

function Spell({ item, onClick, index }: Props) {
  const components = []

  if (item.verbal) components.push('V')
  if (item.somatic) components.push('S')
  if (item.material) components.push('M')

  return (
    <Container index={index} key={item.id} onClick={onClick}>
      <InnerContainer>
        <Header>{item.name}</Header>
      </InnerContainer>
      <InnerContainer>
        <SubText>
          {schoolTypes[item.school]} ({components.join(', ')})
        </SubText>
      </InnerContainer>
    </Container>
  )
}

export default Spell
