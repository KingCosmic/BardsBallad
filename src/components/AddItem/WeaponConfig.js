import React from 'react';

import Container from '../../atoms/Container';
import Text from '../../atoms/Text';

import { Property } from './EditItem';
import PropertyInput from '../../atoms/PropertyInput';

import { propOptions, statOptions } from '../../data/constants';

const diceTypes = [
  '1d2',
  '1d3',
  '1d4',
  '1d5',
  '1d6',
  '1d8',
  '1d10',
  '1d12',
  '2d4',
  '2d6',
  '2d8',
  '2d10',
  '2d12',
  '3d4',
  '3d6',
  '3d8',
  '3d10',
  '3d12',
  '4d4',
  '4d6',
  '4d8',
  '4d10',
  '4d12'
]

const WeaponConfig = ({ range, longRange, attackStat, attackBonus, damageStat, additionalDamage, damage1, damage2, editItem }) => {
  return (
    <Container>
      <Container direction='row'>
        <Property title='Range' type='number' value={range} placeholder='15' callback={(value) => editItem('range', value)} />
        <Property title='Long Range' type='number' value={longRange} placeholder='30' callback={(value) => editItem('longRange', value)} />
      </Container>
      <Container direction='row'>
        <Property title='Attack Stat' value={attackStat} options={statOptions} callback={(value) => editItem('attackStat', value)} type='select' />
        <Property title='Attack Bonus' value={attackBonus} placeholder='0' callback={(value) => editItem('attackBonus', value)} />
      </Container>
      <Container direction='row'>
        <Property title='Damage Stat' value={damageStat} options={statOptions} callback={(value) => editItem('damageStat', value)} type='select' />
        <Property title='Additional Damage' value={additionalDamage} placeholder='2d6' callback={(value) => editItem('additionalDamage', value)} />
      </Container>
      <Container direction='row'>
        <Property title='Damage (one-handed)' value={damage1} placeholder='1d8' callback={(value) => editItem('damage1', value)} />
        <Property title='Damage (two-handed)' value={damage2} placeholder='1d10' callback={(value) => editItem('damage2', value)} />
      </Container>

      {
        //<PropertyInput />
      }

    </Container>
  )
}

export default WeaponConfig;