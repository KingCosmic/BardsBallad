import React, { useEffect } from 'react'
import styled from 'styled-components'

import { charsState, loadAll, createChar } from '../../state/characters'
import { syncCharacters } from '../../services/db'

import Layout from '../../components/Layout'

import FloatingButton from '../../components/FloatingButton'

import Character from '../../components/ListCharacter'

const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
  overflow-y: auto;
`

const CreationsList = styled.div`
  display: inline-block;
  width: 100%;
`

type Props = {
  path: string
}

function Creations(props: Props) {
  let [state] = charsState.use()

  useEffect(() => {
    if (!state.isLoaded) loadAll()

    if (!localStorage.getItem('synced')) syncCharacters()
  })

  return (
    <Layout>
      <Container>
        <CreationsList>
          {state.characters.map(character => (
            <Character key={character._id}  {...character} />
          ))}
        </CreationsList>

        <FloatingButton onClick={() => createChar('dnd:5e')}>&#43;</FloatingButton>
      </Container>
    </Layout>
  )
}

export default Creations
