import React from 'react'
import styled from 'styled-components'

import TextArea from 'react-textarea-autosize'
import Property from './shared/Property'

import { Feat } from '../../types'

const DesktopHeader = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
`

const Container = styled.div<{ isCreating: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  padding: 0 15px;
  transition: 0.5s;
  background-color: ${props => props.theme.dark};
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const Input = styled.input`
  background-color: transparent;
  margin: 0;
  padding: 0;
  outline: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1em;
  font-weight: 200;
  font-family: 'OpenSans';

  &::placeholder {
    color: #8e9297;
  }
`

const Text = styled.p`
  color: ${props => props.theme.gold};
  margin: 10px 0 0;
`

const Title = styled.p`
  color: ${props => props.theme.gold};
  font-size: 0.9em;
`

const EditFeature = props => {
  const {
    editFeature,
    isCreating,
    showFeats,
    confirm,
    featData: {
      name,
      description
    },
  } = props

  return (
    <Container isCreating={isCreating}>
      <DesktopHeader>
        <p onClick={showFeats}>Back</p>

        <Title>Editing {name}</Title>

        <p onClick={confirm}>Confirm</p>
      </DesktopHeader>

      <Property
        title="Name"
        placeholder="Fireball"
        value={name}
        callback={value => editFeature('name', value)}
      />

      <Text>
        Description
      </Text>
      <TextArea
        placeholder="Feat description goes here"
        value={description}
        onChange={event => editFeature('description', event.target.value)}
      />
    </Container>
  )
}

export default EditFeature