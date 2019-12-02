import React from 'react';
import styled, { css } from 'styled-components';

import T from './Text';

import { schoolTypes } from '../data/constants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px;

  ${props => (Math.abs(props.index % 2) === 1) && css`
    background-color: rgba(0, 0, 0, .17);
  `}
`

const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Header = styled(T)`
  font-size: 1.2em;
`

const SubText = styled(T)`
  color: rgba(255, 255, 255, .7);
`

const Spell = ({ item, name, school, source, verbal, somatic, material, id, onClick, index }) => {
  const components = []

  if (verbal) components.push('V');
  if (somatic) components.push('S');
  if (material) components.push('M');

  return (
    <Container index={index} key={id} onClick={() => onClick(item)}>
      <InnerContainer>
        <Header>{name}</Header>
      </InnerContainer>
      <InnerContainer>
        <SubText>{schoolTypes[school]} ({components.join(', ')})</SubText>
      </InnerContainer>
    </Container>
  )
}

export default Spell;