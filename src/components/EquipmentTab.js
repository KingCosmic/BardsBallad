import React from 'react';

import Container from '../atoms/Container';
import List from '../atoms/List';
import ListItem from '../atoms/ListItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const items = [
  {
    type: 'armor',
    name: 'chainmail',
    description: 'chainmail armor',
    equipped: true,
    effects: [
      { type: 'buff', what: 'AC', amount: 16 }
    ]
  },
]

const modifiers = [
  { title: 'chainmail', target: 'ac', amount: 16 }
]

const InventoryTab = (props) => {
  return (
    <Container direction='row' width='calc(100% - 20px)' height='calc(100% - 20px)' padding='10px'
      justifyContent='space-between' alignItems='center'
    >
      
      <Container width='50%' height='90%' padding='0 5px'>
        <Container padding='5px 0'>
          <Title size='1.3em' align='center'>Items</Title>
        </Container>

        <Container flowY='auto'>
          <List>
            {
              items.map((item, i) => {
                return (
                  <ListItem key={i} direction='column'>
                    <Title>{item.name}</Title>
                    <Text>{item.description}</Text>
                  </ListItem>
                )
              })
            }
          </List>
        </Container>
      </Container>

      <Container width='50%' height='90%' padding='0 5px'>
        <Container padding='5px 0'>
          <Title size='1.3em' align='center'>Modifiers</Title>
        </Container>

        <Container flowY='auto'>
          <List>
            {
              modifiers.map(({ title, amount, target }, i) => {
                return (
                  <ListItem key={i} direction='column'>
                    <Title>{title}</Title>
                    <Text>{amount > 0 ? 'increases' : 'decreases'} {target} by {amount}</Text>
                  </ListItem>
                )
              })
            }
          </List>
        </Container>
      </Container>

    </Container>
  )
}

export default InventoryTab;