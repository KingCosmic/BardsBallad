import React from 'react';

import GridItem from '../atoms/GridItem';
import Title from '../atoms/Title';

const Name = (props) => {
  const { name, job, level } = props;

  return (
    <GridItem column='1 / span 12'>
      <Title size='1.5em'>{name}, {job} level {level}</Title>
    </GridItem>
  )
}

export default Name;