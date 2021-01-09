import React from 'react'
import styled from 'styled-components'

import ListSection from '../../ListSection'

import { Character } from '../../../types'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  overflow-y: auto;
  width: 50%;
`

type Props = {
  char: Character
}

function CombatTab(props: Props) {
  const { char } = props

  const { conditions, actions, creatures } = char

  return (
    <Container>
      <ListSection title='Conditions' data={conditions} showOnEmpty />

      <ListSection title='Attacks' data={actions} showOnEmpty />

      <ListSection title='Creatures' data={creatures} showOnEmpty />
    </Container>
  )
}

export default CombatTab