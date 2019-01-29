import React from 'react';

import GridItem from '../atoms/GridItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const PassivePerception = (props) => {
  return (
    <GridItem column='auto / span 3' justifyContent='center' alignItems='center' bg>
      <Title>Passive</Title>
      <Title>Perception</Title>
      <Text margin='5px 0'>16</Text>
    </GridItem>
  )
}

export default PassivePerception;