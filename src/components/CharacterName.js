import React from 'react';

import GridItem from '../atoms/GridItem';
import Title from '../atoms/Title';

const Name = (props) => {
  return (
    <GridItem column='1 / span 12'>
      <Title size='1.8em'>Goblin Slayer, Fighter lvl 5</Title>
    </GridItem>
  )
}

export default Name;