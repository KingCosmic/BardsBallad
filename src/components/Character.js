import React from 'react';
import styled from 'styled-components';

import Text from '../atoms/Text';

import { getLevel } from '../data/levels';

const Container = styled.div`
  width: calc(33% - 30px);
  cursor: pointer;
  height: 100px;

  position: relative;
  display: inline-block;

  background: url('https://cdn.discordapp.com/attachments/391809595473002496/579335189331836939/233.png');
  background-size: cover;
  background-repeat: no-repeat;

  margin: 5px;
  padding: 10px;
  border-radius: 4px;
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
      <Name>{name} <br/> {job} ({getLevel(exp)})</Name>
    </Container>
  )
}

export default Character;