import React, { useState } from 'react'
import styled from 'styled-components'

import Modal from './Modal'

import SearchInput from '../Search'
import Feature from '../Character/FeaturesAndTraits/Feature'


import srdFeats from '../../system/feats'
import { featDefaults } from '../../system/constants'

import { addFeat } from '../../services/db'
import { cloneDeep, merge } from 'lodash'
import EditFeature from './EditFeature'

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

const CreateFeature = styled.p`
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

function AddFeature(props: Props) {
  const { isOpen, setIsOpen } = props

  const [search, setSearch] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [feature, setFeature] = useState(cloneDeep(featDefaults))

  const filteredSrd = srdFeats
    .filter(feat => feat.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Container>
        {
          isCreating ? (
            <EditFeature
              showFeats={() => setIsCreating(false)}
              confirm={() => {
                addFeat(feature).then(() => {
                  setIsCreating(false)
                  setIsOpen(false)
                })
              }}
              editFeature={(path:string, data:any) => setFeature(merge({}, feature, { [path]: data }))}
              featData={feature}
            />
          ) : (
            <Container>
              <SearchInput
                onSearch={setSearch}
                value={search}
                ph='Search Features...'
                bgStyle={{ backgroundColor: '#72767D', boxShadow: '0 2px 5px rgba(0, 0, 0, .2), 0 0 0 1px rgba(0, 0, 0, .1)' }}
              />

              <List>
                {
                  filteredSrd.map((feat, i) => <Feature data={feat} index={i} key={feat.id} onClick={() => {setIsCreating(true); setFeature(cloneDeep(feat))}} />)
                }
              </List>
                <CreateFeature onClick={() => { setIsCreating(true); setFeature(cloneDeep(featDefaults))}}>&#43;</CreateFeature>
            </Container>
          )
        }
      </Container>
    </Modal>
  )
}

export default AddFeature