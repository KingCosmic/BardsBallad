import React from 'react'

import Container from './Container'
import Tab from './Tab'

type Props = {
  selectedTab: string,
  changeTab(tab: string): void
}

const DesktopTabs = ({ selectedTab, changeTab }: Props) => {
  return (
    <Container>
      <Tab active={selectedTab === 'info'} onClick={() => changeTab('info')}>info</Tab>

      <Tab active={selectedTab === 'skills'} onClick={() => changeTab('skills')}>skills</Tab>

      <Tab active={selectedTab === 'spells'} onClick={() => changeTab('spells')}>spells</Tab>

      <Tab active={selectedTab === 'equipment'} onClick={() => changeTab('equipment')}>equipment</Tab>

      <Tab active={selectedTab === 'combat'} onClick={() => changeTab('combat')}>combat</Tab>

      <Tab active={selectedTab === 'features'} onClick={() => changeTab('features')}>features & traits</Tab>
    </Container>
  )
}

export default DesktopTabs