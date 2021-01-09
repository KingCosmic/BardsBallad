import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Modal from './Modal'

import EditSpell from './EditSpell'

import ItemOptions from './ItemOptions'

import { cloneDeep, merge } from 'lodash'
import { editSpell, deleteSpell } from '../../services/db'

import { Spell as SpellType } from '../../types'
import { spellDefaults } from '../../system'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding-bottom: 0;
  overflow-y: auto;
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
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
  spells: SpellType[]
  spellID: string
  isOpen: boolean
  setIsOpen(open: boolean): void
}

function SpellInfo(props: Props) {
  const { isOpen, setIsOpen, spells, spellID } = props

  const [isEditing, setIsEditing] = useState(false)
  const [spell, setSpell] = useState(spellDefaults)

  useEffect(() => {
    setSpell(cloneDeep(spells.find(spell => spell.id === spellID) || spellDefaults))
  }, [spellID])

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      {isEditing ? (
        <EditSpell
          showSpells={() => setIsEditing(false)}
          confirm={() => {
            editSpell(spell)
            .then(() => {
              setIsOpen(false)
            })
          }}
          editSpell={(path: string, data: any) => setSpell(merge({}, spell, { [path]: data }))}
          spellData={spell}
        />
      ) : (
        <Container>
          <InfoContainer>
            <Name>{spell.name}</Name>
            <Text>CastTime: <SubText>{spell.casttime}</SubText></Text>
            <Text>Range: <SubText>{spell.range}</SubText></Text>
            <Text>Components: <SubText>{spell.verbal ? 'V, ' : ''} {spell.somatic ? 'S, ' : ''} {spell.material ? `M (${spell.material})` : ''}</SubText></Text>
            <Text>Duration: <SubText>{spell.concentration ? `Concentration, up to ${spell.duration}` : spell.duration}</SubText></Text>
            <Description>Description: <SubText>{spell.description}</SubText></Description>
            <Text>Higher Levels:<SubText>{spell.higherlevels}</SubText></Text>
          </InfoContainer>
          <ItemOptions
            deleteClick={() => {
              deleteSpell(spell.id)
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

export default SpellInfo