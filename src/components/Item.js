import React from 'react';
import styled from 'styled-components';

import LI from '../atoms/ListItem';
import Container from '../atoms/Container';
import Text from '../atoms/Text';

import { itemTypes } from '../data/constants';

const ListItem = styled(LI)`
  width: calc(100% - 12px);
  padding: 2px
  margin: 5px

  justify-content: space-between;
  align-items: center;

  flex-direction: row;

  cursor: pointer;

  border-bottom: 1px solid ${props => props.theme.grey};

  &:hover {
    background-color: ${props => props.theme.dark};
  }
`

const Description = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis; 
`

const Item = ({ item: { id, name, type, weight, value} }) => {
  return (
    <ListItem key={id}>
      <Container maxWidth='50%' flowY='hidden' flowWrap>
        <Text>{name}</Text>
        <Description size='0.8em'>{itemTypes[type]}</Description>
      </Container>

      <Container direction='row'>
        <Text margin='0 6px'>{weight} lb</Text>
        <Text margin='0 6px'>{value}</Text>
      </Container>
    </ListItem>
  )
}

export default Item;