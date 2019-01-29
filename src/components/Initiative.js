import React from 'react';

import GridItem from '../atoms/GridItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const Initiative = (props) => {
  return (
    <GridItem column='auto / span 3' justifyContent='center' alignItems='center' bg>
      <Title>Initiative</Title>
      <Text margin='5px 0'>+3</Text>
    </GridItem>
  )
}

export default Initiative;