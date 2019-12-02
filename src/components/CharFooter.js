import React from 'react';
import styled from 'styled-components';

import { FaInfo, FaRunning } from 'react-icons/fa';
import { GiSpellBook, GiBackpack, GiSwordBrandish, GiRearAura } from 'react-icons/gi';

const Container = styled.div`
  display: flex;
  width: 100vw;
  border-top: 1px solid ${props => props.theme.middleblack};
  background-color: ${props => props.theme.light};
  height: 60px;

  @media only screen and (min-width: 768px) {
    display: none;
  }
`

// just here to give extra color tbh
const OverlayContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100vw;
  height: 60px;
  background-color: rgba(32, 34, 37, .3);
`

const Icon = styled.div`
  color: ${props => props.selected ? props.theme.gold : props.theme.text};
  font-size: 2em;
  text-align: center;
  flex-grow: 1;
`

const CharFooter = ({ selectedTab, changeTab }) => {
  return (
    <Container>
      <OverlayContainer>
        <Icon selected={selectedTab === 'info'} onClick={() => changeTab('info')}><FaInfo /></Icon>
        <Icon selected={selectedTab === 'skills'} onClick={() => changeTab('skills')}><FaRunning /></Icon>
        <Icon selected={selectedTab === 'spells'} onClick={() => changeTab('spells')}><GiSpellBook /></Icon>
        <Icon selected={selectedTab === 'equipment'} onClick={() => changeTab('equipment')}><GiBackpack /></Icon>
        <Icon selected={selectedTab === 'combat'} onClick={() => changeTab('combat')}><GiSwordBrandish /></Icon>
        <Icon selected={selectedTab === 'features'} onClick={() => changeTab('features')}><GiRearAura /></Icon>
      </OverlayContainer>
    </Container>
  )
}

export default CharFooter