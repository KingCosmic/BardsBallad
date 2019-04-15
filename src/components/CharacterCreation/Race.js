import React from 'react';

import Container from '../../atoms/Container';
import Input from '../../atoms/Input';
import List from '../../atoms/List';
import ListItem from '../../atoms/ListItem';
import Title from '../../atoms/Title';

import races from '../../data/races';

const renderRaces = (races) => {
  return races.map(race => {
    const { name } = race;

    return (
      <ListItem padding='5px' margin='5px 0' hover='dark' cursor>
        <Title>{name}</Title>
      </ListItem>
    )
  })
}

const Race = () => {
  return (
    <Container alignItems='center' height='calc(100% - 80px)'>
      <Input placeholder='search races' padding='5px' margin='90px 0 20px 0' />

      <List width='30%' height='calc(100% - 140px)'>
        {
          renderRaces(races)
        }
      </List>

    </Container>
  )
}

export default Race;