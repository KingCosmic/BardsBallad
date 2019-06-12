import React from 'react';
import styled, { css } from 'styled-components';

import { Link } from "react-router-dom";
import Text from '../atoms/Text';

import levels from '../data/levels';

const getLevel = (exp) => Object.keys(levels).find(lvl => exp <= levels[lvl].exp)

const Container = styled(Link)`
  width: calc(32% - 20px);
  height: 100px;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-decoration: none;

  background: url('https://cdn.discordapp.com/attachments/391809595473002496/579335189331836939/233.png');
  background-size: contain;
  background-repeat: no-repeat;

  margin: 0;
  padding: 10px;
`

const Character = (props) => {
  const { name, job, exp, id } = props;

  return (
    <Container to={`/characters/${id}`}>
      <Text>{name}</Text><Text>{job} ({getLevel(exp)})</Text>
    </Container>
  )
}

export default Character;