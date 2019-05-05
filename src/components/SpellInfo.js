import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';
import Bold from '../atoms/Bold';
import SpellEditing from './SpellEditing';

const Header = styled(Container)`
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.almostblack};
`

const Section = styled(Container)`
  border: 1px solid ${props => props.theme.almostblack};
  border-left: none;
`

class SpellInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    }
  }

  render() {
    const { spell, editing, editSpell } = this.props

    const { name } = spell;


    if (editing) {
      return <SpellEditing spell={spell} />
    } else {
      return (
        <Section height='calc(100% - 1px)' width='70%'>
          <Header>
            <Container padding='5px'><Text>Prepared: false</Text></Container>
  
            <Container padding='5px' onClick={editSpell}><Text>Edit</Text></Container>
          </Header>
          <Container padding='5px'>
            <Title size='2em' margin='0 0 10px 0'>{name}</Title>
            <Text size='0.8em'><Bold weight='300'>Casting Time:</Bold> 1 action</Text>
            <Text size='0.8em'><Bold weight='300'>Range:</Bold> Touch</Text>
            <Text size='0.8em'><Bold weight='300'>Components:</Bold> V, S</Text>
            <Text size='0.8em' margin='0 0 10px 0'><Bold weight='300'>Duration:</Bold> Concentration, up to 1 minute</Text>
            <Text size='0.9em' weight='100' sub>You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends.</Text>
          </Container>
        </Section>
      )
    }
  }
}

export default SpellInfo;