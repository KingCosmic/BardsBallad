import React from 'react';
import styled, { css } from 'styled-components';

import Text from './Text';

const TabsContainer = styled.div`
  width: 41%;
  margin: 10px 10px 0;

  border-bottom: 1px solid ${props => props.theme.grey};

  @media only screen and (max-width: 768px) {
    display: none;
  }
`

const Tab = styled(Text)`
  color: ${props => props.theme.text};
  font-family: OpenSans;
  margin: 0;
  padding: 0 10px 10px;

  float: left;

  cursor: pointer;
  position: relative;

  &:hover {
    color: ${props => props.theme.gold};
  }

  ${props => props.active && css`
    color: ${props => props.theme.gold}

    &:after {
      width: 0;
      height: 0;

      content: "";
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      bottom: 0;

      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-bottom: 7px solid ${props => props.theme.grey};
    }
  `}
`

const DesktopTabs = ({ selectedTab, changeTab }) => {
  return (
    <TabsContainer>
      <Tab active={selectedTab === 'info'} onClick={() => changeTab('info')}>info</Tab>

      <Tab active={selectedTab === 'skills'} onClick={() => changeTab('skills')}>skills</Tab>

      <Tab active={selectedTab === 'spells'} onClick={() => changeTab('spells')}>spells</Tab>

      <Tab active={selectedTab === 'equipment'} onClick={() => changeTab('equipment')}>equipment</Tab>

      <Tab active={selectedTab === 'combat'} onClick={() => changeTab('combat')}>combat</Tab>

      <Tab active={selectedTab === 'features'} onClick={() => changeTab('features')}>features & traits</Tab>
    </TabsContainer>
  )
}

export default DesktopTabs;