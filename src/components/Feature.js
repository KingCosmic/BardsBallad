import React from 'react';
import styled, { css } from 'styled-components';

import T from './Text';
import Clamp from './Clamp';

import { renderReq } from '../helpers';

const Container = styled.div`
  display: flex;
  padding: 5px;
  cursor: pointer;
  flex-direction: column;

  ${props => (Math.abs(props.index % 2) === 1) && css`
    background-color: rgba(0, 0, 0, .17);
  `}
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled(T)`
  color: ${props => props.theme.gold};
  font-size: 1.1em;
`

const Description = styled(T)`
  font-size: 1em;
  margin-top: 5px;
  color: rgba(255, 255, 255, .6);
`

const Text = styled(T)`
  font-size: 0.9em;
`

const Feature = (props) => {
  const { name, uses, prerequisite, desc, source, index, onClick, showRequirements = false } = props;

  return (
    <Container index={index} onClick={onClick}>
      <Header width='100%' direction='row' justifyContent='space-between' alignItems='center'>
        <Info>
          <Title>{name} {uses > 0 ? `(x${uses})` : ''}</Title>
          <Text>{showRequirements ? renderReq(prerequisite) : 'Class: Wild Magic'}</Text>
        </Info>
        <Title>{source || 'CUSTOM'}</Title>
      </Header>

      <Clamp text={desc} component={Description} />
    </Container>
  )
}

export default Feature;