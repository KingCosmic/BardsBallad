import React from 'react';
import styled from 'styled-components';

import Name from './CharacterName';
import Class from './CharacterClass';
import HP from './HP';
import EXP from './EXP';
import ArmorClass from './ArmorClass';
import Speed from './Speed';
import Initiative from './Initiative';
import Proficiency from './Proficiency';
import PassivePerception from './PassivePerception';
import HitDice from './HitDice';
import Stat from './Stat';

const Container = styled.div`
  transition: 0.5s;
  position: fixed;
  z-index: 50;
  top: 0;
  width: 85%;
  height: 100%;
  overflow-y: auto;
  background: linear-gradient(50deg, rgba(146, 146, 146, 0.02) 0%, rgba(146, 146, 146, 0.02) 25%,rgba(82, 82, 82, 0.02) 25%, rgba(82, 82, 82, 0.02) 50%,rgba(217, 217, 217, 0.02) 50%, rgba(217, 217, 217, 0.02) 75%,rgba(41, 41, 41, 0.02) 75%, rgba(41, 41, 41, 0.02) 100%),linear-gradient(252deg, rgba(126, 126, 126, 0.01) 0%, rgba(126, 126, 126, 0.01) 25%,rgba(117, 117, 117, 0.01) 25%, rgba(117, 117, 117, 0.01) 50%,rgba(219, 219, 219, 0.01) 50%, rgba(219, 219, 219, 0.01) 75%,rgba(41, 41, 41, 0.01) 75%, rgba(41, 41, 41, 0.01) 100%),linear-gradient(272deg, rgba(166, 166, 166, 0.01) 0%, rgba(166, 166, 166, 0.01) 20%,rgba(187, 187, 187, 0.01) 20%, rgba(187, 187, 187, 0.01) 40%,rgba(238, 238, 238, 0.01) 40%, rgba(238, 238, 238, 0.01) 60%,rgba(204, 204, 204, 0.01) 60%, rgba(204, 204, 204, 0.01) 80%,rgba(5, 5, 5, 0.01) 80%, rgba(5, 5, 5, 0.01) 100%),linear-gradient(86deg, rgba(143, 143, 143, 0.02) 0%, rgba(143, 143, 143, 0.02) 12.5%,rgba(36, 36, 36, 0.02) 12.5%, rgba(36, 36, 36, 0.02) 25%,rgba(23, 23, 23, 0.02) 25%, rgba(23, 23, 23, 0.02) 37.5%,rgba(223, 223, 223, 0.02) 37.5%, rgba(223, 223, 223, 0.02) 50%,rgba(101, 101, 101, 0.02) 50%, rgba(101, 101, 101, 0.02) 62.5%,rgba(94, 94, 94, 0.02) 62.5%, rgba(94, 94, 94, 0.02) 75%,rgba(148, 148, 148, 0.02) 75%, rgba(148, 148, 148, 0.02) 87.5%,rgba(107, 107, 107, 0.02) 87.5%, rgba(107, 107, 107, 0.02) 100%),linear-gradient(25deg, rgba(2, 2, 2, 0.02) 0%, rgba(2, 2, 2, 0.02) 16.667%,rgba(51, 51, 51, 0.02) 16.667%, rgba(51, 51, 51, 0.02) 33.334%,rgba(26, 26, 26, 0.02) 33.334%, rgba(26, 26, 26, 0.02) 50.001000000000005%,rgba(238, 238, 238, 0.02) 50.001%, rgba(238, 238, 238, 0.02) 66.668%,rgba(128, 128, 128, 0.02) 66.668%, rgba(128, 128, 128, 0.02) 83.33500000000001%,rgba(21, 21, 21, 0.02) 83.335%, rgba(21, 21, 21, 0.02) 100.002%),linear-gradient(325deg, rgba(95, 95, 95, 0.03) 0%, rgba(95, 95, 95, 0.03) 14.286%,rgba(68, 68, 68, 0.03) 14.286%, rgba(68, 68, 68, 0.03) 28.572%,rgba(194, 194, 194, 0.03) 28.572%, rgba(194, 194, 194, 0.03) 42.858%,rgba(51, 51, 51, 0.03) 42.858%, rgba(51, 51, 51, 0.03) 57.144%,rgba(110, 110, 110, 0.03) 57.144%, rgba(110, 110, 110, 0.03) 71.42999999999999%,rgba(64, 64, 64, 0.03) 71.43%, rgba(64, 64, 64, 0.03) 85.71600000000001%,rgba(31, 31, 31, 0.03) 85.716%, rgba(31, 31, 31, 0.03) 100.002%),linear-gradient(90deg, hsl(80,0%,14%),hsl(80,0%,14%));
  border-left: 1px solid ${props => props.theme.almostblack};
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  right: ${props => props.isOpen ? '0' : '-100%'};

  @media screen and (device-aspect-ratio: 40/71) {
    width: 100%;
  }

  @media only screen and (min-width: 768px) {
    width: 25%;
    position: static;
    background: transparent;
    border: none;
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const TopRow = styled(Row)`
  width: 100%;
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media only screen and (min-width: 768px) {
    margin: 5px;
  }
`

const MenuItem = styled.a`
  padding: 10px 15px;
  text-decoration: none;
  font-size: 2.3em;
  color: ${props => props.theme.text};
  display: block;
`

const CloseButton = styled(MenuItem)`
  font-size: 3em;

  @media only screen and (min-width: 768px) {
    display: none;
  }
`

const SideInfo = (props) => {
  const { open, requestClose, char, syncData, openModal, closeModal } = props;
  const { name, job, hp: { current, max, temp }, exp, stats, ac, speed, initiative, proficiency, passivePerception, hitdice } = char;

  const extraProps = { syncData, characterID: char._id, openModal, closeModal }

  return (
    <Container isOpen={open}>
      <TopRow>
        <CloseButton onClick={requestClose}>&times;</CloseButton>
      </TopRow>

      <BottomContainer>
        <Name name={name} {...extraProps} />
        <Class job={job} exp={exp} {...extraProps} />

        <HP current={current} max={max} temp={temp} {...extraProps} />
        <EXP current={exp} {...extraProps} />

        <Row>
          <ArmorClass name='AC' path='ac' value={ac} {...extraProps} />
          <Speed name='SPD' path='speed' value={speed} {...extraProps} /> 
          <Initiative name='INIT' path='initiative' value={initiative} {...extraProps} />
        </Row>
        <Row>
          <Proficiency name='PROF' path='proficiency' value={proficiency} {...extraProps} />
          <PassivePerception path='passivePerception' value={passivePerception} {...extraProps} />
          <HitDice path='hitdice' value={hitdice} {...extraProps} />
        </Row>

        <Row>
          <Stat name='STR' path='stats.strength' value={stats.strength} {...extraProps} />
          <Stat name='DEX' path='stats.dexterity' value={stats.dexterity} {...extraProps} />
          <Stat name='CON' path='stats.constitution' value={stats.constitution} {...extraProps} />
        </Row>
        <Row>
          <Stat name='INT' path='stats.intelligence' value={stats.intelligence} {...extraProps} />
          <Stat name='WIS' path='stats.wisdom' value={stats.wisdom} {...extraProps} />
          <Stat name='CHA' path='stats.charisma' value={stats.charisma} {...extraProps}s />
        </Row>
      </BottomContainer>
    </Container>
  )
}

export default SideInfo;