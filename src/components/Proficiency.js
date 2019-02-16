import React from 'react';

import GridItem from '../atoms/GridItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const Proficiency = (props) => {
  const { value } = props;

  return (
    <GridItem column='auto / span 3' justifyContent='center' alignItems='center' bg ol>
      <Title>Proficiency</Title>
      <Text margin='5px 0'>+{value}</Text>
    </GridItem>
  )
}

export default Proficiency;