import React, { Component } from 'react';
import styled from 'styled-components';

import merge from 'lodash.merge';

import Container from '../../atoms/Container';
import Title from '../../atoms/Title';
import Text from '../../atoms/Text';
import Select from '../../atoms/Select';

import WeaponConfig from './WeaponConfig';

import { typeOptions, rarityOptions, boolOptions } from '../../data/constants';

const Input = styled.input`
  background-color: transparent;
  margin: 0;
  padding: 0;
  outline: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 0.9em;
  font-family: 'OpenSans';

  &::placeholder {
    color: #8e9297;
  }
`

const TextArea = styled.textarea`
  color: ${props => props.theme.text};
  width: 100%;
  height: 80px;
  max-height: 200px;
  font-size: 0.9em;
  font-weight: 100;

  margin: 0;

  border-style: none;
  outline: none;
  resize: none;
  cursor: pointer;

  background-color: transparent;
`

export const Property = ({ callback, title, placeholder, type, value, options, multi = false, full = false }) => {
  return (
    <Container margin='5px 0' width={full ? '100%' : '50%'}>
      <Text size='0.8rem' weight='200' color='gold'>{title}</Text>

      {
        (type && type === 'select') ?
          <Select value={value} options={options} multi={multi} onChange={(value) => callback(value)} /> : 
          <Input type={type ? type : 'text'} placeholder={placeholder} value={value} onChange={({ target: { value } }) => callback(value)} />
      }
    </Container>
  )
}

class EditItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'Custom Item',
      rarity: 'N',
      category: 'G',
      magic: false,
      attackStat: 'AUTO',
      attackBonus: '',
      damageStat: 'AUTO',
      additionalDamage: '',
      damage1: '2d6',
      damage2: '',
      range: '',
      longRange: '',
      properties: [],
      requirements: [],
      modifiers: [],
      weight: 0,
      quantity: 1,
      value: 0,
      desc: '',
      reqAttune: false,
      charges: '',
      sources: []
    }

    this.editItem = this.editItem.bind(this)
  }

  componentWillMount() {
    this.setState({
      ...merge({}, this.state, this.props.itemInfo)
    })
  }

  editItem(path, data) {
    this.setState({ [path]: data })
  }

  render() {
    const { goBack, addItem, title = 'New Item' } = this.props;
    const { name, magic, rarity, desc, category, quantity, range, longRange, attackStat, attackBonus, damageStat, damageBonus, damage1, damage2, additionalDamage, value, weight } = this.state;

    const weaponProps = { range, longRange, attackStat, attackBonus, damageStat, damageBonus, damage1, damage2, additionalDamage, editItem: this.editItem }

    return (
      <Container height='100%' width='100%'>
        <Container height='30px' margin='0 0 10px 0' justifyContent='space-around' direction='row'>
          <Text size='0.9rem' onClick={goBack}>Back</Text>

          <Title align='center'>{title}</Title>

          <Text size='0.9rem' onClick={() => addItem(this.state)}>Confirm</Text>
        </Container>
        <Container flowY='auto' height='calc(100% - 40px)'>
          <Container>
            <Container direction='row'>
              <Property title='Name' placeholder='Greatsword' value={name} callback={(value) => this.editItem('name', value)} />
              <Property title='Rarity' value={rarity} options={rarityOptions} type='select' callback={(value) => this.editItem('rarity', value)} />
            </Container>
            <Container direction='row'>
              <Property title='Category' value={category} options={typeOptions} type='select' callback={(value) => this.editItem('category', value)} />
              <Property title='Magic Item' value={magic} options={boolOptions} type='select' callback={(value) => this.editItem('magic', value)} />
            </Container>

            {
              ['M', 'R'].includes(category) ? <WeaponConfig {...weaponProps} /> : null
            }

            <Container direction='row'>
              <Property title='Value' value={value} placeholder='50 gp' callback={(value) => this.editItem('value', Number(value))} />
              <Property title='Weight (in lb)' value={weight} type='number' callback={(value) => this.editItem('weight', Number(value))} />
            </Container>

            <Property title='quantity' value={quantity} type='number' callback={(value) => this.editItem('quantity', Number(value))} />

            <Title margin='10px 0 0'>Description</Title>
            <TextArea placeholder='Item description goes here' value={desc} onChange={(event) => this.editItem('desc', event.target.value)} />
          </Container>
        </Container>
      </Container>
    )
  }
}

export default EditItem;