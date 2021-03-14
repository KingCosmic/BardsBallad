import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { charsState, loadAll, createChar } from '../../state/characters'
import { syncCharacters, deleteCharacter } from '../../services/db'

import Layout from '../../components/Layout'

import DeleteConfirmation from '../../components/Modals/DeleteConfirmation'

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

function Creations(props:Props) {
  let [state] = charsState.use()
  
  const [id, setID] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!state.isLoaded) loadAll()

    if (!localStorage.getItem('synced')) syncCharacters()
  })

  return (
    <Layout>
      <DeleteConfirmation id={id} chars={state.characters} isOpen={deleting} setIsOpen={setDeleting} onConfirm={() => deleteCharacter(id)} />
      <Container>
        <CreationsList>
          {state.characters.map(character => (
            <Character key={character._id}  {...character} onDelete={id => {
              // set the id of the character we're deleting.
              setID(id)
              // tell the modal to open.
              setDeleting(true)
            }} />
          ))}
        </CreationsList>

        <FloatingButton onClick={() => createChar('DND5E')}>&#43;</FloatingButton>
      </Container>
    </Layout>
  )
}

export default Creations
