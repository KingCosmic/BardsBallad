import React from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import List from '../atoms/List';
import Text from '../atoms/Text';

import SpellTab from './SpellTab';
import Spell from './Spell';

const SpellsContainer = styled(Container)`
  border-bottom: 1px solid ${props => props.theme.almostblack};
`

const renderSpells = (spells) => {
  return spells.map(spell => <Spell spell={spell} /> )
}

const SpellsTab = (props) => {
  return (
    <Container height='100%' width='100%' justifyContent='space-between'>
      <Container direction='row' height='95%' margin='0 20px 10px 0' padding='20px'>
        <Container justifyContent='space-between'>
          <SpellTab section={0} usesLeft={0} maxUses={0} />
          <SpellTab section={1} usesLeft={4} maxUses={4} />
          <SpellTab section={2} usesLeft={3} maxUses={3} />
          <SpellTab section={3} usesLeft={2} maxUses={2} />
          <SpellTab section={4} usesLeft={0} maxUses={0} />
          <SpellTab section={5} usesLeft={0} maxUses={0} />
          <SpellTab section={6} usesLeft={0} maxUses={0} />
          <SpellTab section={7} usesLeft={0} maxUses={0} />
          <SpellTab section={8} usesLeft={0} maxUses={0} />
          <SpellTab section={9} usesLeft={0} maxUses={0} />
        </Container>

        <Container height='100%' width='80%' margin='0 0 0 20px' bg>
          <SpellsContainer direction='row' height='20px' padding='10px'>
            <Container width='4em'><Text>PREP</Text></Container>

            <Container width='30%'><Text>NAME</Text></Container>

            <Container width='30%'><Text>TAGS</Text></Container>
          </SpellsContainer>
          <List height='calc(100% - 20px)' flowY='scroll'>
            {renderSpells([
              {
                name: 'Guidance',
                prepared: false,
                type: 'normal',
                level: 0,
                tags: ['buff', 'ability check']
              },
            ])}
          </List>
        </Container>
      </Container>

      <Container direction='row' height='5%' justifyContent='space-evenly'>
        <Text>CLASS: WIZARD</Text>
        <Text>ABILITY: INT</Text>
        <Text>DC: 15</Text>
        <Text>BONUS +7</Text>
      </Container>
    </Container>
  )
}

export default SpellsTab;