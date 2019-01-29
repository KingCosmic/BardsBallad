import React from 'react';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import List from '../atoms/List';
import Skill from './Skill';

const renderThrows = (throws) =>
  throws.map(t => <Skill value={t.value} skill={t.skill}  efficient={t.efficient} />)

const SavingThrows = (props) => {
  return (
    <Container height='30%' margin='0 0 20px 0' padding='10px' alignItems='center' bg>
      <Title margin='0 0 5px 0'>Saving Throws</Title>

      <List width='100%'>
        {
          renderThrows([
            {
              value: 8,
              skill: 'strength',
              efficient: true
            },{
              value: 3,
              skill: 'dexterity',
              efficient: false
            },{
              value: 6,
              skill: 'constitution',
              efficient: true
            },{
              value: 3,
              skill: 'intelligence',
              efficient: false
            },{
              value: 1,
              skill: 'wisdom',
              efficient: false
            },{
              value: 2,
              skill: 'charisma',
              efficient: false
            },
          ])
        }
      </List>
    </Container>
  )
}

export default SavingThrows;