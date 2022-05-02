import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import DeleteConfirmation from '../../components/Modals/DeleteConfirmation'
import CharacterBuilder from '../../components/Modals/CharacterBuilder'
import FloatingButton from '../../components/FloatingButton'
import Character from '../../components/ListCharacter'
import Layout from '../../components/Layout'

import { charsState, createChar } from '../../state/characters'
import { deleteCharacter } from '../../services/db'
import SEO from '../../components/seo'

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

function Creations() {
  let [CharState] = charsState.use()
  
  const [id, setID] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [isBuilding, setBuilding] = useState(false)

  return (
    <Layout>
      <SEO title='creations' />
      <DeleteConfirmation id={id} chars={CharState.characters} isOpen={deleting} setIsOpen={setDeleting} onConfirm={() => deleteCharacter(id)} />
      <CharacterBuilder isOpen={isBuilding} setIsOpen={setBuilding} onConfirm={() => {}} />
      <Container>
        <CreationsList>
          {CharState.characters.map(character => (
            <Character key={character._id}  {...character} onDelete={id => {
              // set the id of the character we're deleting.
              setID(id)
              // tell the modal to open.
              setDeleting(true)
            }}/>
          ))}
        </CreationsList>

        <FloatingButton onClick={() => createChar('DND5E')}>&#43;</FloatingButton>
      </Container>
    </Layout>
  )
}

export default Creations
