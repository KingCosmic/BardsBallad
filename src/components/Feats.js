import React from 'react';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import List from '../atoms/List';
import Feat from './Feat';

const renderFeats = (feats) => feats.map(feat => <Feat name={feat.name} description={feat.description} />)

const Feats = (props) => {
  return (
    <Container height='100%' width='70%' margin='0 0 0 20px' alignItems='center' bg>
      <Container width='100%' alignItems='center' bg>
        <Title margin='5px'>Feats</Title>
      </Container>

      <List flowY='auto' height='100%' width='100%'>
        {
          renderFeats([
            {
              name: 'Defense',
              description: 'While you are wearing armor, you gain a +1 bonus to AC.'
            },{
              name: 'Brute Force',
              description: 'Whenever you hit with a weapon that you\'re proficient with and deal damage, the weapon\'s damage increases by 1d4'
            },{
              name: 'Second Wind',
              description: 'On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.'
            },{
              name: 'Action Surge (x1)',
              description: 'On your turn, you can take one additional action on top of your regular action and a possible bonus action. Once you use this feature, you must finish a short or long rest before you can use it again.'
            },{
              name: 'Extra Attack (x1)',
              description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.'
            },
          ])
        }
      </List>
    </Container>
  )
}

export default Feats;