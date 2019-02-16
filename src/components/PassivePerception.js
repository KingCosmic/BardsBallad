import React from 'react';

import GridItem from '../atoms/GridItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

import { determinMod } from '../helpers';

const PassivePerception = (props) => {
  const { wis, skills, prof } = props;

  const mod = determinMod(wis);

  // determin passive perception
  const value = skills['perception'] ? (mod + prof + 10) : (mod + 10);

  return (
    <GridItem column='auto / span 3' justifyContent='center' alignItems='center' bg ol>
      <Title>Passive</Title>
      <Title>Perception</Title>
      <Text margin='5px 0'>{value}</Text>
    </GridItem>
  )
}

export default PassivePerception;