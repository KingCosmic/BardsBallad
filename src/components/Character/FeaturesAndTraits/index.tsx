import React, { useState } from 'react'
import styled from 'styled-components'

import Feature from './Feature'

import AddFeatureModal from '../../Modals/AddFeature'
import FeatureInfoModal from '../../Modals/FeatInfo'

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

const ListContainer = styled.div``

const AddFeature = styled.p`
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

type Props = {
  char: Character
}

function FeaturesAndTraits(props: Props) {
  const [isAdding, setIsAdding] = useState(false)
  const [isViewing, setIsViewing] = useState(false)
  const [featID, setFeatID] = useState('')

  const { feats } = props.char

  return (
    <Container>
      <AddFeatureModal isOpen={isAdding} setIsOpen={setIsAdding} />
      <FeatureInfoModal isOpen={isViewing} setIsOpen={setIsViewing} feats={feats} featID={featID} />

      <EmptyText empty={feats.length === 0}>
        Looks like you don't have any feats, try adding some :(
      </EmptyText>

      <ListContainer>
        {
          feats.map((feat, i) => {
            return (
              <Feature data={feat} index={i} key={feat.id} onClick={() => { setIsViewing(true); setFeatID(feat.id) }} />
            )
          })
        }
      </ListContainer>

      <AddFeature onClick={() => setIsAdding(true)}>&#43;</AddFeature>
    </Container>
  )
}

export default FeaturesAndTraits