import React, { useState } from 'react'
import styled from 'styled-components'

import Property from '../../Modals/shared/Property'
import TextArea from 'react-textarea-autosize';

import { Character, InfoObject } from '../../../types'

const Container = styled.div`
  height: 100%;
  width: 100%;
`

const Title = styled.p`
  color: ${props => props.theme.gold};
  font-size: 1.2em;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin: 5px 0;
`

const SaveButton = styled.p`
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.green};
  position: fixed;
  right: calc(50% + 60px);
  bottom: 20px;
  font-size: 2em;
  padding: 7px 19px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`

type Props = {
  data:Character,
  saveData(info:InfoObject):void
}

function EditingInfo(props:Props) {
  const { data, saveData } = props;

  const [name, setName] = useState(data.name)
  const [job, setJob] = useState(data.job)
  const [background, setBackground] = useState(data.background)
  const [race, setRace] = useState(data.race)
  const [alignment, setAlignment] = useState(data.alignment)
  const [age, setAge] = useState(data.age)
  const [backstory, setBackstory] = useState(data.backstory)

  return (
    <Container>
      <Row>
        <Property title='Name' placeholder='Aliza Cartwight' value={name} callback={setName} />
        <Property title='Class' placeholder='Pyromancer Sorcerer' value={job} callback={setJob} />
      </Row>

      <Row>
        <Property title='Background' placeholder='FolkHero' value={background} callback={setBackground} />
        <Property title='Race' placeholder='Half-Elf' value={race} callback={setRace} />
      </Row>

      <Row>
        <Property title='Alignment' placeholder='Chaotic/Good' value={alignment} callback={setAlignment} />
        <Property title='Age' type='number' placeholder='23' value={age} callback={setAge} />
      </Row>

      <Title>Backstory</Title>
      <TextArea placeholder='backstory goes here' value={backstory} onChange={(event) => setBackstory(event.target.value)} />

      <SaveButton onClick={() => saveData({
        name,
        job,
        background,
        race,
        alignment,
        age,
        backstory
      })}>&#43;</SaveButton>
    </Container>
  )
}

export default EditingInfo