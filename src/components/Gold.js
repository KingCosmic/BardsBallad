import React from 'react';

import GridItem from '../atoms/GridItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const Gold = (props) => {
  return (
    <GridItem column='auto / span 2' height='30px' direction='row'
      justifyContent='space-around' alignItems='center' bg ol
    >
      <Title header>{props.type}</Title>
      <Text header>{props.amount}</Text>
    </GridItem>
  )
}

export default Gold;