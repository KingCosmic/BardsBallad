import React from 'react'
import styled from 'styled-components'

import SavingThrow from './SavingThrow'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  width: 100%;
`

const Title = styled.p`
  color: ${props => props.theme.gold};
  margin-bottom: 5px;
  font-size: 1.6em;
  border-bottom: 1px solid ${props => props.theme.gold};
`

const STR = 'strength'
const DEX = 'dexterity'
const CON = 'constitution'
const INT = 'intelligence'
const WIS = 'wisdom'
const CHA = 'charisma'

const SavingThrows = props => {
  return (
    <Container>
      <Title>Saving Throws</Title>

      <SavingThrow key="1" skill={STR} {...props} />

      <SavingThrow key="2" skill={DEX} {...props} />

      <SavingThrow key="3" skill={CON} {...props} />

      <SavingThrow key="4" skill={INT} {...props} />

      <SavingThrow key="5" skill={WIS} {...props} />

      <SavingThrow key="6" skill={CHA} {...props} />
    </Container>
  )
}

export default SavingThrows
