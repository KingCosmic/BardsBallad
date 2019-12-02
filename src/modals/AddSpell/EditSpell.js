import React from 'react';
import styled from 'styled-components';

import Text from '../../components/Text';
import Select from '../../components/Select';
import TextArea from 'react-textarea-autosize';

import { spellLevels, schoolOptions, boolOptions } from '../../data/constants';

const DesktopHeader = styled.div`
  display: none;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;

  @media only screen and (min-width: 768px) {
    display: flex;
  }
`

const Container = styled.div`
  position: absolute;
  z-index: 50;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  height: auto;
  padding: 0 15px;
  padding-top: 60px;
  transition: 0.5s;
  background-color: ${props => props.theme.dark};

  right: ${props => props.creatingSpell ? '0' : '-100%'};

  @media only screen and (min-width: 768px) {
    padding-top: 0;
  }
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

const Title = styled(Text)`
  color: ${props => props.theme.gold};
  font-size: .9em;
`

const PropertyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0;
  width: ${props => props.full ? '100%' : '50%'};
`

const Property = (props) => {
  const { title, value, placeholder, type, options, multi = false, full = false, callback } = props;

  return (
    <PropertyContainer full={full}>
      <Title>{title}</Title>

      {
        (type && type === 'select') ?
          <Select value={value} options={options} multi={multi} onChange={callback} /> :
          <Input type={type ? type : 'text'} placeholder={placeholder} value={value} onChange={({ target: { value } }) => callback(value)} />
      }
    </PropertyContainer>
  )
}

const EditSpell = (props) => {
  const { editSpell, creatingSpell,
    showSpells, confirm,
    spellData: {
      name, level, school, ritual, casttime,
      range, duration, concentration, verbal,
      somatic, material, description, higherlevels
    }
  } = props;

  return (
    <Container creatingSpell={creatingSpell}>
      <DesktopHeader>
        <Text onClick={showSpells}>Back</Text>

        <Title>Editing {name}</Title>

        <Text onClick={confirm}>Confirm</Text>
      </DesktopHeader>

      <Row>
        <Property title='Name' placeholder='Fireball' value={name} callback={(value) => editSpell('name', value)} />
        <Property title='Level' value={level} options={spellLevels} type='select' callback={(value) => editSpell('level', value)} />
      </Row>
      <Row>
        <Property title='School' value={school} options={schoolOptions} type='select' callback={(value) => editSpell('school', value)} />
        <Property title='Ritual' value={ritual} options={boolOptions} type='select' callback={(value) => editSpell('ritual', value)} />
      </Row>
      <Row>
        <Property title='Casting Time' placeholder='1 Action' value={casttime} callback={(value) => editSpell('casttime', value)} />
        <Property title='Range' placeholder='30 feet' value={range} callback={(value) => editSpell('range', value)} />
      </Row>
      <Row>
        <Property title='Duration' placeholder='1 minute' value={duration} callback={(value) => editSpell('duration', value)} />
        <Property title='Concentration' type='select' value={concentration} options={boolOptions} callback={(value) => editSpell('concentration', value)} />
      </Row>

      <Row>
        <Property title='Verbal' value={verbal} options={boolOptions} type='select' callback={(value) => editSpell('verbal', value)} />
        <Property title='Somatic' value={somatic} options={boolOptions} type='select' callback={(value) => editSpell('somatic', value)} />
      </Row>
      <Property title='Material' placeholder='A bit of sponge' value={material} callback={(value) => editSpell('material', value)} />

      <Text margin='10px 0 0' color='gold'>Description</Text>
      <TextArea placeholder='Spell description goes here' value={description} onChange={(event) => editSpell('description', event.target.value)} />

      <Text margin='10px 0 0' color='gold'>Higher Levels</Text>
      <TextArea placeholder='When you cast this spell using a spell slot of 5th level or higher, the bludgeoning damage increases by 1d8 for each slot level above 4th.' value={higherlevels} onChange={(event) => editSpell('higherlevels', event.target.value)} />
    </Container>
  )
}

export default EditSpell;