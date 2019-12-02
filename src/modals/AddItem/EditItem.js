import React from 'react';
import styled from 'styled-components';

import Text from '../../components/Text';
import Select from '../../components/Select';
import TextArea from 'react-textarea-autosize';

import { rarityOptions, typeOptions, boolOptions, statOptions } from '../../data/constants';

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

  right: ${props => props.creatingItem ? '0' : '-100%'};

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
  font-size: 1.2em;
`

const PropertyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0;
  width: ${props => props.full ? '100%' : '50%'};
  border-bottom: 1px solid grey;
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

const EditItem = (props) => {
  const { editItem, creatingItem,
    showItems, confirm,
    itemData: {
      name, magic, rarity, desc, category, quantity,
      range, longRange, attackStat, attackBonus, damageStat,
      damage1, damage2, additionalDamage, value, weight
    }
  } = props;

  return (
    <Container creatingItem={creatingItem}>
      <DesktopHeader>
        <Text onClick={showItems}>Back</Text>

        <Title>Editing {name}</Title>

        <Text onClick={confirm}>Confirm</Text>
      </DesktopHeader>
      <Row>
        <Property title='Name' placeholder='Greatsword' value={name} callback={(value) => editItem('name', value)} />
        <Property title='Rarity' value={rarity} options={rarityOptions} type='select' callback={(value) => editItem('rarity', value)} />
      </Row>
      <Row>
        <Property title='Category' value={category} options={typeOptions} type='select' callback={(value) => editItem('category', value)} />
        <Property title='Magic Item' value={magic} options={boolOptions} type='select' callback={(value) => editItem('magic', value)} />
      </Row>

      {
        ['M', 'R'].includes(category) ? (
          <>
            <Row>
              <Property title='Range' type='number' value={range} placeholder='15' callback={(value) => editItem('range', value)} />
              <Property title='Long Range' type='number' value={longRange} placeholder='30' callback={(value) => editItem('longRange', value)} />
            </Row>
            <Row>
              <Property title='Attack Stat' value={attackStat} options={statOptions} callback={(value) => editItem('attackStat', value)} type='select' />
              <Property title='Attack Bonus' value={attackBonus} placeholder='0' callback={(value) => editItem('attackBonus', value)} />
            </Row>
            <Row>
              <Property title='Damage Stat' value={damageStat} options={statOptions} callback={(value) => editItem('damageStat', value)} type='select' />
              <Property title='Additional Damage' value={additionalDamage} placeholder='2d6' callback={(value) => editItem('additionalDamage', value)} />
            </Row>
            <Row>
              <Property title='Damage (one-handed)' value={damage1} placeholder='1d8' callback={(value) => editItem('damage1', value)} />
              <Property title='Damage (two-handed)' value={damage2} placeholder='1d10' callback={(value) => editItem('damage2', value)} />
            </Row>
          </>
        ) : ''
      }

      <Row>
        <Property title='Value' value={value} placeholder='50 gp' callback={(value) => editItem('value', Number(value))} />
        <Property title='Weight (in lb)' value={weight} type='number' callback={(value) => editItem('weight', Number(value))} />
      </Row>

      <Property title='quantity' value={quantity} type='number' callback={(value) => editItem('quantity', Number(value))} />

      <Title>Description</Title>
      <TextArea placeholder='Item description goes here' value={desc} onChange={(event) => editItem('desc', event.target.value)} />
    </Container>
  )
}

export default EditItem;