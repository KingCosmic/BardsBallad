import React from 'react';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';
import List from '../atoms/List';
import ListItem from '../atoms/ListItem';

const Proficiency = ({ title, profs = [] }) => {
  return (
    <ListItem direction='column' minHeight='100px' margin='5px 0' hover>
      <Title size='0.9em'>{title}</Title>
      <Container direction='row' grow='1' flexWrap>
        {
          profs.map((prof, i) => {
            return (
              <Text size='0.85em'>{prof},</Text>
            )
          })
        }
      </Container>
    </ListItem>
  )
}

const Proficiencies = (props) => {
  return (
    <Container height='calc(70% - 20px)' padding='10px'>
      <Title margin='0 0 5px 0' header>Proficiencies</Title>

      <List flowY='scroll' width='100%' barWidth='0px'>
        <Proficiency title='ARMOR' />
        <Proficiency title='WEAPONS' profs={["Dart", "Dagger", "Sling", "Quarterstaffs", "Light Crossbows"]} />
        <Proficiency title='TOOLS' />
      </List>
    </Container>
  )
}

export default Proficiencies;