import React from 'react';
import styled from 'styled-components';

import TextArea from 'react-textarea-autosize';
import Property from './shared/Property'

import { rarityOptions, typeOptions } from '../../system/constants';
import { Item } from '../../types';

const DesktopHeader = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  height: auto;
  overflow-y: auto;
  padding: 0 15px;
  transition: 0.5s;
  background-color: ${props => props.theme.dark};
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const Title = styled.p`
  color: ${props => props.theme.gold};
  font-size: 1.2em;
`

type Props = {
  editItem: (path: string, value: any) => void
  showItems: () => void
  confirm: () => void
  itemData: Item
}

const EditItem = (props: Props) => {
  const { editItem,
    showItems, confirm,
    itemData: {
      name, rarity, description,
      type, quantity, range, dmgType,
      dmg1, dmg2, value, weight
    }
  } = props;

  return (
    <Container>
      <DesktopHeader>
        <p onClick={showItems}>Back</p>

        <Title>Editing {name}</Title>

        <p onClick={confirm}>Confirm</p>
      </DesktopHeader>
      <Row>
        <Property title='Name' placeholder='Greatsword' value={name} callback={(value) => editItem('name', value)} />
        <Property title='Rarity' value={rarity} options={rarityOptions} type='select' callback={(value) => editItem('rarity', value)} />
      </Row>
      <Row>
        <Property title='Type' value={type} options={typeOptions} type='select' callback={(value) => editItem('type', value)} />
      </Row>

      {
        ['M', 'R'].includes(type) ? (
          <>
            <Row>
              <Property title='Range' type='number' value={range} placeholder='15' callback={(value) => editItem('range', value)} />
            </Row>
            <Row>
              <Property title='Damage (one-handed)' value={dmg1} placeholder='1d8' callback={(value) => editItem('dmg1', value)} />
              <Property title='Damage (two-handed)' value={dmg2} placeholder='1d10' callback={(value) => editItem('dmg2', value)} />
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
      <TextArea placeholder='Item description goes here' value={description} onChange={(event) => editItem('description', event.target.value)} />
    </Container>
  )
}

export default EditItem