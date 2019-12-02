import React from 'react';
import styled from 'styled-components';

import Text from './Text';

import { ReactComponent as Delete } from '../assets/delete.svg';

import { getLevel } from '../data/levels';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 5px;
  width: 90%;
  margin: 10px;
  border-radius: 5px;
  height: 180px;
  background: url('https://cdn.discordapp.com/attachments/391809595473002496/579335189331836939/233.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  cursor: pointer;

  @media only screen and (min-width: 768px) {
    display: inline-block;
    width: calc(33.33% - 30px);
    height: 120px;

    margin: 5px;

    background-position: 0% 0%;
  }
`

const OptionsButton = styled(Text)`
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 2em;
`


const Name = styled(Text)`
  position: absolute;
  left: 10px;
  bottom: 10px;
`

const Character = (props) => {
  const { name, job, exp, id, history } = props;

  return (
    <Container onClick={() => history.replace(`/characters/${id}`)}>
      <OptionsButton><Delete style={{ width: '1em', height: '1em' }}  /></OptionsButton>

      <Name>{name} <br /> {job} ({getLevel(exp).level})</Name>
    </Container>
  )
}

export default Character;