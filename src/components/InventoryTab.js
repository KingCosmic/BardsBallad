import React from 'react';

import Container from '../atoms/Container';
import List from '../atoms/List';
import ListItem from '../atoms/ListItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const renderItems = (items) => {
  return items.map((item, i) => {
    return (
      <ListItem key={i} direction='row'>
        <Title>{item.name}</Title>
        <Text>{item.description}</Text>
      </ListItem>
    )
  })
}

const InventoryTab = (props) => {
  return (
    <Container direction='row' width='calc(100% - 20px)' height='calc(100% - 20px)' padding='10px' justifyContent='center' alignItems='center'>
      
      <Container width='50%' height='90%' bg>
        <Container padding='5px' bg>
          <Title align='center'>Items</Title>
        </Container>

        <Container flowY='auto'>
          <List>
            {
              renderItems([
                {
                  type: 'armor',
                  name: 'chainmail',
                  description: 'chainmail armor',
                  equipped: true,
                  effects: [
                    { type: 'buff', what: 'AC', amount: 16 }
                  ]
                },
                {
                  name: ''
                }
              ])
            }
          </List>
        </Container>
      </Container>

    </Container>
  )
}

export default InventoryTab;