import React from 'react';

import ListItem from '../atoms/ListItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const Feat = (props) => {
  const { name, uses, description } = props;

  return (
    <ListItem direction='column' padding='0 10px' margin='20px 0'>
      <Title>{name} {uses > 0 ? `(x${uses})` : ''}</Title>

      <Text size='0.8em'>{description}</Text>
    </ListItem>
  )
}

export default Feat;