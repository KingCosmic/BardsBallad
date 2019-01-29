import React from 'react';

import GridItem from '../atoms/GridItem';
import Title from '../atoms/Title';
import Bonus from '../atoms/Bonus';
import Text from '../atoms/Text';

const CharacterStat = (props) => {
  const { name, val } = props;

  return (
    <GridItem column='auto / span 2' alignItems='center' bg>
      <Title>{name}</Title>

      <Bonus value={val} />

      <Text>{val}</Text>
    </GridItem>
  )
}

export default CharacterStat;