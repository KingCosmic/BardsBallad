import React from 'react';
import styled, { css } from 'styled-components';

import LI from '../atoms/ListItem';
import Container from '../atoms/Container';
import T from '../atoms/Text';

const ListItem = styled(LI)`
  padding: 5px;

  justify-content: space-between;

  flex-direction: row;

  cursor: pointer;

  &:hover {
    background-color: rgba(222, 223, 224, .1);
  }

  ${props => (Math.abs(props.index % 2) === 1) && css`
    background-color: rgba(0, 0, 0, .17);
  `}
`

const Text = styled(T)`
  font-size: 0.9vw;
`

const SubText = styled(Text)`
  color: rgba(255, 255, 255, .6);
`

const Square = styled(Container)`
  background-color: ${props => props.theme.grey};
  padding: 1px 5px;
  margin: 0 5px;
  border-radius: 4px;
`

const Spell = ({ item, name, school, source, casttime, ritual, concentration, range, verbal, somatic, material, id, onClick, index }) => (
  <ListItem key={id} onClick={() => onClick(item)}>
    <Container>
      <T>{name}</T>
      <SubText>{verbal ? 'V, ' : ''} {somatic ? 'S, ' : ''} {material ? `M (${material})` : ''}</SubText>
    </Container>
    <Container justifyContent='center' alignItems='flex-end'>
      <Container direction='row'>
        {ritual ? <Square><Text>R</Text></Square> : null}
        {concentration ? <Square><Text>C</Text></Square> : null}
        <Text color='gold'>{source}</Text>
      </Container>
      <Text>{casttime}, {range}</Text>
    </Container>
  </ListItem>
)

export default Spell;