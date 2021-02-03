import React from 'react'
import styled from 'styled-components'

import TextArea from 'react-textarea-autosize'
import Property from './shared/Property'

import {
  spellLevels, schoolOptions, boolOptions
} from '../../system/constants'

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

const EditSpell = props => {
  const {
    editSpell,
    isCreating,
    showSpells,
    confirm,
    spellData: {
      name,
      level,
      school,
      ritual,
      casttime,
      range,
      duration,
      concentration,
      verbal,
      somatic,
      material,
      description,
      higherlevels,
    },
  } = props

  return (
    <Container isCreating={isCreating}>
      <DesktopHeader>
        <p onClick={showSpells}>Back</p>

        <Title>Editing {name}</Title>

        <p onClick={confirm}>Confirm</p>
      </DesktopHeader>

      <Row>
        <Property
          title="Name"
          placeholder="Fireball"
          value={name}
          callback={value => editSpell('name', value)}
        />
        <Property
          title="Level"
          value={level}
          options={spellLevels}
          type="select"
          callback={value => editSpell('level', value)}
        />
      </Row>
      <Row>
        <Property
          title="School"
          value={school}
          options={schoolOptions}
          type="select"
          callback={value => editSpell('school', value)}
        />
        <Property
          title="Ritual"
          value={ritual}
          options={boolOptions}
          type="select"
          callback={value => editSpell('ritual', value)}
        />
      </Row>
      <Row>
        <Property
          title="Casting Time"
          placeholder="1 Action"
          value={casttime}
          callback={value => editSpell('casttime', value)}
        />
        <Property
          title="Range"
          placeholder="30 feet"
          value={range}
          callback={value => editSpell('range', value)}
        />
      </Row>
      <Row>
        <Property
          title="Duration"
          placeholder="1 minute"
          value={duration}
          callback={value => editSpell('duration', value)}
        />
        <Property
          title="Concentration"
          type="select"
          value={concentration}
          options={boolOptions}
          callback={value => editSpell('concentration', value)}
        />
      </Row>

      <Row>
        <Property
          title="Verbal"
          value={verbal}
          options={boolOptions}
          type="select"
          callback={value => editSpell('verbal', value)}
        />
        <Property
          title="Somatic"
          value={somatic}
          options={boolOptions}
          type="select"
          callback={value => editSpell('somatic', value)}
        />
      </Row>
      <Property
        title="Material"
        placeholder="A bit of sponge"
        value={material}
        callback={value => editSpell('material', value)}
      />

      <Text>
        Description
      </Text>
      <TextArea
        placeholder="Spell description goes here"
        value={description}
        onChange={event => editSpell('description', event.target.value)}
      />

      <Text>
        Higher Levels
      </Text>
      <TextArea
        placeholder="When you cast this spell using a spell slot of 5th level or higher, the bludgeoning damage increases by 1d8 for each slot level above 4th."
        value={higherlevels}
        onChange={event => editSpell('higherlevels', event.target.value)}
      />
    </Container>
  )
}

export default EditSpell