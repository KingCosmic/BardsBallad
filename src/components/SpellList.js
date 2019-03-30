import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import List from '../atoms/List';
import Text from '../atoms/Text';

import Spell from './Spell';

const Section = styled(Container)`
  border: 1px solid ${props => props.theme.almostblack};

  justify-content: space-between;
`

const Header = styled(Container)`
  border-bottom: 1px solid ${props => props.theme.almostblack};
`

const Footer = styled(Container)`
  border-top: 1px solid ${props => props.theme.almostblack};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.almostblack};
  }
`

const DropdownContent = styled(Container)`
  display: none;
  position: absolute;
  background-color: ${props => props.theme.light};
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 12px 16px;
  z-index: 1;
`

const DropdownCont = styled(Container)`
  position: relative;
  display: inline-block;
  cursor: pointer;

  &:hover ${DropdownContent} {
    display: block;
  }
`

const lvlToSlot = {
  0: 'cantrips',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine'
}

class SpellList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLevel: 0
    }
  }

  render() {
    const { changeSpell, spells, slots, addSpell } = this.props;

    const { currentLevel } = this.state;

    const { current, max } = slots[lvlToSlot[currentLevel]] || { current: 0, max: 0 };

    const { one, two, three, four, five, six, seven, eight, nine } = slots;

    return (
      <Section height='calc(100% - 1px)' width='30%'>
        <Header direction='row' justifyContent='space-between'>
          <DropdownCont padding='5px'>
            <Text>Cantrips</Text>

            <DropdownContent>
              <Text>Cantrips</Text>
              <Text>First Level {one.current}/{one.max}</Text>
              <Text>Second Level {two.current}/{two.max}</Text>
              <Text>Third Level {three.current}/{three.max}</Text>
              <Text>Fourth Level {four.current}/{four.max}</Text>
              <Text>Fifth Level {five.current}/{five.max}</Text>
              <Text>Sixth Level {six.current}/{six.max}</Text>
              <Text>Seventh Level {seven.current}/{seven.max}</Text>
              <Text>Eighth Level {eight.current}/{eight.max}</Text>
              <Text>Nineth Level {nine.current}/{nine.max}</Text>
            </DropdownContent>  
          </DropdownCont>

          <Container padding='5px'><Text>{current}/{max}</Text></Container>
        </Header>
        <Container flowY='scroll'>
          <List>
            {
              spells.filter(spell => spell.level === currentLevel)
              .map(spell => <Spell onClick={changeSpell} {...spell} key={spell.id} />)
            }
          </List>
        </Container>
        <Footer alignItems='center' padding='5px' onClick={() => addSpell(currentLevel)}>
          <Text>Add Spell</Text>
        </Footer>
      </Section>
    )
  }
}

export default SpellList;