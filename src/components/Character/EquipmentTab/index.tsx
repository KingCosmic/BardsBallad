import React, { useState } from 'react'
import styled from 'styled-components'

import Item from './Item'

import AddItemModal from '../../Modals/AddItem'
import ItemInfoModal from '../../Modals/ItemInfo'

import { Character } from '../../../types'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  overflow-y: auto;
  width: 50%;
`

type EmptyProps = {
  empty?: boolean
}

const EmptyText = styled.p<EmptyProps>`
  font-size: 2em;
  display: ${props => (props.empty ? 'block' : 'none')};
`

const AddEquipment = styled.p`
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

const Rows = styled.div`
  align-items: center;
  flex-direction: row;
  margin-bottom: 8px;
  display: flex;
`

const InnerRows = styled.div`
  display: flex;
  flex: 1;

  justify-content: space-between;
  align-items: center;

  flex-direction: row;
`

const RowText = styled.p`
  font-size: .9em;
  width: 64px;
  text-align: center;
`

const NameText = styled.p`
  font-size: .9em;
`

type Props = {
  char: Character
}

function EquipmentTab(props: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isViewing, setIsViewing] = useState(false)
  const [itemID, setItemID] = useState('')

  const {
    char: { items }
  } = props

  return (
    <Container>
      <AddItemModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <ItemInfoModal isOpen={isViewing} setIsOpen={setIsViewing} items={items} itemID={itemID} />

      <EmptyText empty={items.length === 0}>
        Looks like you don't have any items, try adding some :(
      </EmptyText>
      {items.length > 0 ?
        (
          <>
            <Rows>
              <RowText>EQUIP</RowText>
              <InnerRows>
                <NameText>NAME</NameText>
                <RowText>QUANTITY</RowText>
              </InnerRows>
            </Rows>
            <div>
              {items.map((item, i) => {
                return (
                  <Item data={item} index={i} key={item.id} onClick={() => { setIsViewing(true); setItemID(item.id) }} />
                )
              })}
            </div>
          </>
        ) : null
      }

      <AddEquipment onClick={() => setIsOpen(true)}>&#43;</AddEquipment>
    </Container>
  )
}

export default EquipmentTab
