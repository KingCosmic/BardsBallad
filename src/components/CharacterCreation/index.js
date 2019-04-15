import React from 'react';
import styled from 'styled-components';

import { IconContext } from 'react-icons';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import Container from '../../atoms/Container';

import ChooseName from './Name';
import ChooseRace from './Race';

const Section = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 5px;

  background-color: ${props => props.active ? props.theme.gold : props.theme.grey};
`

const CharacterCreation = ({ stage, changeStage }) => {
  return (
    <Container width='100%' height='100%' >
      {
        (stage === 1) ? <ChooseName /> :
        (stage === 2) ? <ChooseRace /> : ''
      }
      <Container width='100%' height='80px' direction='row' justifyContent='center' alignItems='center'>
        <IconContext.Provider value={{ style: { cursor: 'pointer' }, color: 'white', size: '30px' }}>
          <IoIosArrowBack onClick={() => changeStage(stage === 1 ? 1 : stage - 1)} />

          <Section active={stage === 1} />
          <Section active={stage === 2} />
          <Section active={stage === 3} />
          <Section active={stage === 4} />

          <IoIosArrowForward onClick={() => changeStage(stage === 4 ? 4 : stage + 1)}/>
        </IconContext.Provider>
      </Container>
    </Container>
  )
}

export default CharacterCreation;