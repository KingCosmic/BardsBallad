import React from 'react';

import GridItem from '../atoms/GridItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const HitDice = (props) => {
  const { hd } = props;

  return (
    <GridItem column='auto / span 6' justifyContent='center' alignItems='center' bg ol>
      <Title>Hit Dice</Title>
      <Text>{hd}</Text>
    </GridItem>
  )
}

export default HitDice;