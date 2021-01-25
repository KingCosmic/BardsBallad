import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { charsState, setCurrentCharacter } from '../../../state/characters'

import Layout from '../../../components/Layout'

import DesktopTabs from '../../../components/Character/Tabs'

import InfoTab from '../../../components/Character/InfoTab'
import SkillsTab from '../../../components/Character/SkillsTab'
import SpellsTab from '../../../components/Character/SpellsTab'
import EquipmentTab from '../../../components/Character/EquipmentTab'
import CombatTab from '../../../components/Character/CombatTab'
import FeaturesAndTraits from '../../../components/Character/FeaturesAndTraits'

import SideInfo from '../../../components/Character/SideInfo'

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
  characterID?:string,
  path:string,
  params?: {
    characterID:string
  }
}

function Character(props: Props) {
  const [selectedTab, setSelectedTab] = useState('info')

  const [{ characters, characterID }] = charsState.use()

  const character = characters.find(char => char._id === characterID)

  useEffect(() => {
    setCurrentCharacter(props.params.characterID)
  }, [props.params.characterID])

  if (!character) return null

  return (
    <Layout>
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
    </Layout>
  )
}

export default Character
