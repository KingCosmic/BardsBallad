import React from 'react';
import styled, { css } from 'styled-components';

import LI from '../atoms/ListItem';
import Title from '../atoms/Title';
import T from '../atoms/Text';
import Container from '../atoms/Container';
import Clamp from '../atoms/Clamp';

import { renderReq } from '../helpers';

const ListItem = styled(LI)`
  padding: 5px;
  cursor: pointer;
  flex-direction: column;

  &:hover {
    background-color: rgba(222, 223, 224, .1);
  }

  ${props => (Math.abs(props.index % 2) === 1) && css`
    background-color: rgba(0, 0, 0, .17);
  `}
`

const Description = styled(T)`
  font-size: 1vw;
  margin-top: 5px;
  color: rgba(255, 255, 255, .6);
  font-family: Nunito;
`

const Text = styled(T)`
  font-size: 0.9vw;
`

const Feat = (props) => {
  const { name, uses, prerequisite, description, source, index, onClick, showRequirements = false } = props;

  return (
    <ListItem index={index} onClick={onClick}>
      <Container width='100%' direction='row' justifyContent='space-between' alignItems='center'>
        <Container>
          <Title size='1.1vw'>{name} {uses > 0 ? `(x${uses})` : ''}</Title>
          <Text>{showRequirements ? renderReq(prerequisite) : 'Class: Wild Magic'}</Text>
        </Container>
          <Title size='1.1vw'>{source || 'CUSTOM'}</Title>
      </Container>

      <Clamp text={description} component={Description} />
    </ListItem>
  )
}

export default Feat;