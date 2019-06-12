import React from 'react';
import styled from 'styled-components';

import LI from '../atoms/ListItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const ListItem = styled(LI)`

  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.dark};
  }
`

const Description = styled(Text)`
  font-size: 1vw;
  margin: 5px 5px 10px;
  color: rgba(255, 255, 255, .9);
  font-family: Nunito;
`

const Feat = (props) => {
  const { name, uses, description, onClick } = props;

  return (
    <ListItem direction='column' onClick={onClick}>
      <Title size='1em' margin='10px 5px 0'>{name} {uses > 0 ? `(x${uses})` : ''}</Title>

      <Description>{description}</Description>
    </ListItem>
  )
}

export default Feat;