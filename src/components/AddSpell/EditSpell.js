import React, { Component } from 'react';
import styled from 'styled-components';

import merge from 'lodash.merge';

import Container from '../../atoms/Container';
import Title from '../../atoms/Title';
import Text from '../../atoms/Text';
import Select from '../../atoms/Select';
import Checkbox from '../../atoms/CheckBox';

import { spellLevels, schoolOptions, boolOptions } from '../../data/constants';

const Input = styled.input`
  background-color: transparent;
  margin: 0;
  padding: 0;
  outline: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1vw;
  font-family: 'OpenSans';

  &::placeholder {
    color: #8e9297;
  }
`

const TextArea = styled.textarea`
  color: ${props => props.theme.text};
  width: 100%;
  min-height: 50px;
  height: auto;
  max-height: 150px;
  font-size: 1vw;
  font-weight: 100;

  margin: 0;

  border-style: none;
  outline: none;
  resize: none;

  background-color: transparent;
`

export class Property extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    }

    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.setState({
      value
    }, () => {
      this.props.callback(value)
    })
  }

  render() {
    const { callback, title, placeholder, type, options, multi = false, full = false } = this.props;
    const { value } = this.state;

    return (
      <Container margin='5px 0' width={full ? '100%' : '50%'}>
        <Text size='1.2vw' weight='200' color='gold'>{title}</Text>

        {
          (type && type === 'select') ?
            <Select value={value} options={options} multi={multi} onChange={this.onChange} /> :
            <Input type={type ? type : 'text'} placeholder={placeholder} value={value} onChange={({ target: { value } }) => this.onChange(value)} />
        }
      </Container>
    )
  }
}

class EditSpell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'Custom Spell',
      level: 0,
      school: 'A',
      ritual: false,
      casttime: '',
      range: '',
      duration: '',
      concentration: false,
      verbal: false,
      somatic: false,
      material: '',
      description: '',
      higherlevels: ''
    }

    this.editSpell = this.editSpell.bind(this)
  }

  componentWillMount() {
    this.setState({
      ...merge({}, this.state, this.props.spellInfo)
    })
  }

  editSpell(path, data) {
    this.setState({ [path]: data })
  }

  render() {
    const { goBack, addSpell } = this.props;
    const {
      name, level, school, ritual, casttime, range, duration, concentration, verbal, somatic, material,
      description, higherlevels
    } = this.state;

    return (
      <Container height='100%' width='100%'>
        <Container height='30px' margin='0 0 10px 0' justifyContent='space-around' direction='row'>
          <Text size='0.9rem' onClick={goBack}>Back</Text>

          <Title align='center'>New Spell</Title>

          <Text size='0.9rem' onClick={() => addSpell(this.state)}>Confirm</Text>
        </Container>
        <Container flowY='auto' height='calc(100% - 40px)' flowY='scroll'>
          <Container direction='row'>
            <Property title='Name' placeholder='Fireball' value={name} callback={(value) => this.editSpell('name', value)} />
            <Property title='Level' value={level} options={spellLevels} type='select' callback={(value) => this.editSpell('level', value)} />
          </Container>
          <Container direction='row'>
            <Property title='School' value={school} options={schoolOptions} type='select' callback={(value) => this.editSpell('school', value)} />
            <Property title='Ritual' value={ritual} options={boolOptions} type='select' callback={(value) => this.editSpell('ritual', value)} />
          </Container>
          <Container direction='row'>
            <Property title='Casting Time' placeholder='1 Action' value={casttime} callback={(value) => this.editSpell('casttime', value)} />
            <Property title='Range' placeholder='30 feet' value={range} callback={(value) => this.editSpell('range', value)} />
          </Container>
          <Container direction='row'>
            <Property title='Duration' placeholder='1 minute' value={duration} callback={(value) => this.editSpell('duration', value)} />
            <Property title='Concentration' type='select' value={concentration} options={boolOptions} callback={(value) => this.editSpell('concentration', value)} />
          </Container>

          <Container direction='row'>
            <Property title='Verbal' value={verbal} options={boolOptions} type='select' callback={(value) => this.editSpell('verbal', value)} />
            <Property title='Somatic' value={somatic} options={boolOptions} type='select' callback={(value) => this.editSpell('somatic', value)} />
          </Container>
          <Property title='Material' placeholder='A bit of sponge' value={material} callback={(value) => this.editSpell('material', value)} />

          <Title margin='10px 0 0'>Description</Title>
          <TextArea placeholder='Spell description goes here' value={description} onChange={(event) => this.editSpell('description', event.target.value)} />

          <Title margin='10px 0 0'>Higher Levels</Title>
          <TextArea placeholder='When you cast this spell using a spell slot of 5th level or higher, the bludgeoning damage increases by 1d8 for each slot level above 4th.' value={higherlevels} onChange={(event) => this.editSpell('higherlevels', event.target.value)} />
        </Container>
      </Container>
    )
  }
}

export default EditSpell;