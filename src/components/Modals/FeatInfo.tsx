import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Modal from './Modal'

import EditFeature from './EditFeature'

import ItemOptions from './ItemOptions'

import { cloneDeep, merge } from 'lodash'
import { editFeat, deleteFeat } from '../../services/db'

import { Feat } from '../../types'
import { featDefaults } from '../../system/constants'

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
  feats:Feat[]
  featID:string
  isOpen:boolean
  setIsOpen(open:boolean):void
}

function FeatInfo(props:Props) {
  const { isOpen, setIsOpen, feats, featID } = props

  const [isEditing, setIsEditing] = useState(false)
  const [feat, setFeat] = useState(featDefaults)

  useEffect(() => {
    setFeat(cloneDeep(feats.find(feat => feat.id === featID) || featDefaults))
  }, [featID])

  const { name, description } = feat

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      {isEditing ? (
        <EditFeature
          showFeats={() => setIsEditing(false)}
          confirm={() => {
            editFeat(feat)
            .then(() => {
              setIsOpen(false)
            })
          }}
          editFeature={(path: string, data: any) => setFeat(merge({}, feat, { [path]: data }))}
          featData={feat}
        />
      ) : (
        <Container>
          <InfoContainer>
            <Name>{name}</Name>
            <Description><SubText>{description}</SubText></Description>
          </InfoContainer>
          <ItemOptions
            deleteClick={() => {
              deleteFeat(feat.id)
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

export default FeatInfo