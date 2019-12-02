import React from 'react';
import styled, { css } from 'styled-components';

import T from './Text';

//import { itemTypes } from '../data/constants';

const Text = styled(T)`
  font-size: 1.2em;

  @media only screen and (min-width: 768px) {
    font-size: 1em;
  }
`

const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 5px;
  align-items: center;

  flex-direction: row;

  ${props => (Math.abs(props.index % 2) === 1) && css`
    background-color: rgba(0, 0, 0, .17);
  `}
`

const EquippedCheckbox = styled.div`
  width: 1.2em;
  height: 1.2em;
  border: 1px solid ${props => props.theme.gold};
  border-radius: 50%;
  margin-right: 10px;

  @media only screen and (min-width: 768px) {
    width: .9em;
    height: .9em;
  }
`

const InnerContainer = styled.div`
  display: flex;
  flex: 1;

  justify-content: space-between;
  align-items: center;

  flex-direction: row;
`

const Item = ({ index, id, name, quantity, category, weight, value, onClick }) => {
  return (
    <Container onClick={onClick} key={id} index={index}>
      <EquippedCheckbox />
      <InnerContainer>
        <Text>{name}</Text>
        <Text>{quantity > 1 ? quantity : ''}</Text>
      </InnerContainer>
    </Container>
  )
}

export default Item;