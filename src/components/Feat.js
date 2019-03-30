import React from 'react';
import styled from 'styled-components';

import LI from '../atoms/ListItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const ListItem = styled(LI)`

  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.almostblack};
  }
`

const Feat = (props) => {
  const { name, uses, description, onClick } = props;

  return (
    <ListItem direction='column' padding='10px 5px' onClick={onClick}>
      <Title>{name} {uses > 0 ? `(x${uses})` : ''}</Title>

      <Text size='0.8em'>{description}</Text>
    </ListItem>
  )
}

export default Feat;