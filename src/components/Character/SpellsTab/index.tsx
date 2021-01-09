import React, { useState } from 'react'
import styled from 'styled-components'

import ListSection from '../../ListSection'
import SpellSlots from './SpellSlots'
import Spell from './Spell'

import AddSpellModal from '../../Modals/AddSpell'
import SpellInfoModal from '../../Modals/SpellInfo'

import { Character, Spell as SpellType } from '../../../types'

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

const AddSpell = styled.p`
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

const listFilter = (level: number) => (spell: SpellType) =>
  spell.level === level

type Props = {
  char: Character
}

function SpellsTab(props: Props) {
  const [isAdding, setIsAdding] = useState(false)
  const [isViewing, setIsViewing] = useState(false)
  const [spellID, setSpellID] = useState('')

  const {
    char: { spells, spellSlots },
  } = props

  return (
    <Container>
      <AddSpellModal isOpen={isAdding} setIsOpen={setIsAdding} />
      <SpellInfoModal isOpen={isViewing}
        setIsOpen={setIsViewing}
        spells={spells} spellID={spellID}
      />
      <EmptyText empty={spells.length === 0}>
        Looks like you don't have any spells, try adding some :(
      </EmptyText>

      <ListContainer>

        {/* make sure our spellslots are in the correct order 
            and then map them to everything
        */}
        {spellSlots.sort((a, b) => a.level - b.level).map((slot, index) => {
          return (
            <ListSection
              title={slot.level > 0 ? `Level ${slot.level}` : 'Cantrips'}
              filter={listFilter(slot.level)}
              data={spells}
              Component={Spell}
              onClick={(spell) => {setIsViewing(true); setSpellID(spell.id)}}
              HeaderExtra={slot.level === 0 ? undefined : () => (
                <SpellSlots
                  slots={spellSlots[index]}
                  onClick={() => {}}
                  edit={() => {}}
                  level={slot.level}
                />
              )}
            />
          )
        })}
      </ListContainer>

      <AddSpell onClick={() => setIsAdding(true)}>&#43;</AddSpell>
    </Container>
  )
}

export default SpellsTab
