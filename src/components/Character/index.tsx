import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { charsState, setCurrentCharacter } from '../../state/characters'

import DesktopTabs from './Tabs'

import InfoTab from './InfoTab'
import SkillsTab from './SkillsTab'
import SpellsTab from './SpellsTab'
import EquipmentTab from './EquipmentTab'
import CombatTab from './CombatTab'
import FeaturesAndTraits from './FeaturesAndTraits'

import SideInfo from './SideInfo'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1;
  height: 100vh;
`

const TabContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`

type Props = {
  characterID?: string
  path: string
}

function Character(props: Props) {
  const [selectedTab, setSelectedTab] = useState('info')

  const [{ characters, characterID }] = charsState.use()

  const character = characters.find(char => char._id === characterID)

  useEffect(() => {
    setCurrentCharacter(props.characterID)
  }, [])

  if (!character) return null

  return (
    <Container>
      <ViewContainer>
        <DesktopTabs selectedTab={selectedTab} changeTab={setSelectedTab} />

        <TabContainer>
          {
            selectedTab === 'info' ? <InfoTab char={character} /> :

            (selectedTab === 'skills') ? <SkillsTab char={character} /> :

            (selectedTab === 'spells') ? <SpellsTab char={character} /> :

            (selectedTab === 'equipment') ? <EquipmentTab char={character} /> :

            (selectedTab === 'combat') ? <CombatTab char={character} /> :

            (selectedTab === 'features') ? <FeaturesAndTraits char={character} /> : ''
          }
        </TabContainer>
      </ViewContainer>

      <SideInfo char={character} />
    </Container>
  )
}

export default Character
