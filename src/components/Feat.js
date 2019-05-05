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

const Feat = (props) => {
  const { name, uses, description, onClick } = props;

  return (
    <ListItem direction='column' onClick={onClick}>
      <Title size='1em' margin='10px 5px 5px'>{name} {uses > 0 ? `(x${uses})` : ''}</Title>

      <Text size='0.8em' margin='5px 5px 10px'>{description}</Text>
    </ListItem>
  )
}

export default Feat;