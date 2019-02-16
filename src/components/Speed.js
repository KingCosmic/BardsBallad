import React from 'react';

import GridItem from '../atoms/GridItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const Speed = (props) => {
  const { speed } = props;

  return (
    <GridItem column='auto / span 3' justifyContent='center' alignItems='center' bg ol>
      <Title>Speed</Title>
      <Text margin='5px 0'>{speed}</Text>
    </GridItem>
  )
}

export default Speed;