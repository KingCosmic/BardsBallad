import React from 'react';

import GridItem from '../atoms/GridItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

import { determinMod } from '../helpers';

const Initiative = (props) => {
  const { dex } = props;

  return (
    <GridItem column='auto / span 3' justifyContent='center' alignItems='center' bg ol>
      <Title>Initiative</Title>
      <Text margin='5px 0'>+{determinMod(dex)}</Text>
    </GridItem>
  )
}

export default Initiative;