import React from 'react';

import ListItem from '../atoms/ListItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const Feat = (props) => {
  return (
    <ListItem direction='column' padding='0 10px' margin='20px 0'>
      <Title>{props.name}</Title>

      <Text size='0.8em'>{props.description}</Text>
    </ListItem>
  )
}

export default Feat;