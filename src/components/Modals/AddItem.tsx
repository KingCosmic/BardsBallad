import React, { useState } from 'react'
import styled from 'styled-components'

import Modal from './Modal'
import EditItem from './EditItem'

import SearchInput from '../Search'
import Item from '../Character/EquipmentTab/Item'

import srdEquipment from '../../system/items'
import { itemDefaults } from '../../system'

import { addItem } from '../../services/db'
import { cloneDeep, merge } from 'lodash'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px);
  width: 100%;
  padding: 10px;
  padding-bottom: 0;
  overflow-y: auto;
`

const List = styled.div`
  overflow-y: auto;
  padding: 10px 0;
`

const CreateItem = styled.p`
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.green};
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 2em;
  padding: 7px 19px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`

type Props = {
  isOpen: boolean
  setIsOpen(open: boolean): void
}

function AddItem(props: Props) {
  const { isOpen, setIsOpen } = props

  const [search, setSearch] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [item, setItem] = useState(cloneDeep(itemDefaults))

  const filteredSrd = srdEquipment
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 25)

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      
      {isCreating ? (
        <EditItem
          showItems={() => setIsCreating(false)}
          confirm={() => {
            addItem(item).then(() => {
              setIsCreating(false)
              setIsOpen(false)
            })
          }}
          editItem={(path: string, data: any) => setItem(merge({}, item, { [path]: data }))}
          itemData={item}
        />
      ) : (
        <Container>
          <SearchInput
            onSearch={setSearch}
            value={search}
            ph='Search Equipment...'
            bgStyle={{ backgroundColor: '#72767D', boxShadow: '0 2px 5px rgba(0, 0, 0, .2), 0 0 0 1px rgba(0, 0, 0, .1)' }}
          />

          <List>
            {filteredSrd
              .map((item, i) => {
                return <Item data={item} index={i} key={item.id} onClick={() => {setIsCreating(true); setItem(cloneDeep(item))}} />
              })}
          </List>
          <CreateItem onClick={() => {setIsCreating(true); setItem(cloneDeep(itemDefaults))}}>&#43;</CreateItem>
        </Container>
      )}
    </Modal>
  )
}

export default AddItem
