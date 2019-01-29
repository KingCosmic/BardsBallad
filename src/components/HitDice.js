import React from 'react';

import GridItem from '../atoms/GridItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const HitDice = (props) => {
  return (
    <GridItem column='auto / span 6' justifyContent='center' alignItems='center' bg>
      <Title>Hit Dice</Title>
      <Text>5d10</Text>
    </GridItem>
  )
}

export default HitDice;