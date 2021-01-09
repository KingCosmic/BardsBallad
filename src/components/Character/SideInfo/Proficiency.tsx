import React from 'react'
import styled from 'styled-components'

import { getLevel } from '../../../system'

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

function Proficiency(props) {
  const { name, value } = props

  return (
    <Container>
      <Title>{name}</Title>

      <Text>+{getLevel(value).prof}</Text>
    </Container>
  )
}

export default Proficiency
