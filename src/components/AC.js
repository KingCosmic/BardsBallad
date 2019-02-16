import React from 'react';

import GridItem from '../atoms/GridItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const AC = (props) => {
  const { ac } = props;

  return (
    <GridItem flex column='auto / span 2' justifyContent='center' alignItems='center' bg ol>
      <Title>AC</Title>
      <Text>{ac}</Text>
    </GridItem>
  )
}

export default AC;