import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Modal from './Modal'

import EditItem from './EditItem'

import ItemOptions from './ItemOptions'

import { cloneDeep, merge } from 'lodash'
import { editItem, deleteItem } from '../../services/db'

import { Item as ItemType } from '../../types'
import { itemTypes, propertyTypes, itemDefaults } from '../../system/constants'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`

const Text = styled.p`
  font-size: 1.2em;
  margin: 5px 0;
`

const Name = styled(Text)`
  display: block;
  color: ${props => props.theme.gold};
`

const SubText = styled.span`
  color: rgba(255, 255, 255, .6);
  font-size: 1em;
`

const Description = styled(Text)`
  margin-top: 10px;
`

type Props = {
  items: ItemType[]
  itemID: string
  isOpen: boolean
  setIsOpen(open: boolean): void
}

function ItemInfo(props: Props) {
  const { isOpen, setIsOpen, items, itemID } = props

  const [isEditing, setIsEditing] = useState(false)
  const [item, setItem] = useState(itemDefaults)

  useEffect(() => {
    setItem(cloneDeep(items.find(item => item.id === itemID) || itemDefaults))
  }, [itemID])

  const {
    name, description, type, range,
    dmg1, dmg2, value, weight, properties = []
  } = item

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      {isEditing ? (
        <EditItem
          showItems={() => setIsEditing(false)}
          confirm={() => {
            editItem(item)
              .then(() => {
                setIsOpen(false)
              })
          }}
          editItem={(path: string, data: any) => setItem(merge({}, item, { [path]: data }))}
          itemData={item}
        />
      ) : (
        <Container>
          <InfoContainer>
            <Name>{name}</Name>
            <Text><SubText>{itemTypes[type]}</SubText></Text>

            {
              ['M', 'R'].includes(type) ?
                <>
                  <Text>Range: <SubText>{range ? range : '5ft'}</SubText></Text>
                  <Text>Damage {dmg1 ? '(one-handed)' : ''}: <SubText>{dmg2}</SubText></Text>
                  {dmg2 && <Text>Damage (two-handed): <SubText>{dmg2}</SubText></Text>}
                  <Text>Properties: <SubText>{properties.map(prop => propertyTypes[prop]).join(', ')}</SubText></Text>
                </> : null
            }
            <Text>Value: <SubText>{value}</SubText></Text>
            <Text>Weight: <SubText>{weight} lbs</SubText></Text>

            <Description><SubText>{description}</SubText></Description>
          </InfoContainer>
          <ItemOptions
            deleteClick={() => {
              deleteItem(item.id)
              .then(() => {
                setIsOpen(false)
              })
            }}
            closeClick={() => setIsOpen(false)}
            editClick={() => setIsEditing(true)}
          />
        </Container>
      )}
    </Modal>
  )
}

export default ItemInfo