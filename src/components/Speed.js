import React from 'react';

import GridItem from '../atoms/GridItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const Speed = (props) => {
  return (
    <GridItem column='auto / span 3' justifyContent='center' alignItems='center' bg>
      <Title>Speed</Title>
      <Text margin='5px 0'>30</Text>
    </GridItem>
  )
}

export default Speed;