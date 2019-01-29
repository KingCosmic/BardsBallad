import React from 'react';

import ListItem from '../atoms/ListItem';
import Container from '../atoms/Container';
import CheckBox from '../atoms/CheckBox';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const Spell = ({ spell }) => (
  <ListItem padding='10px 0' hover='almostblack'>
    {/*
      Have to give it a margin of 2em to make up for the width being less so the checkbox aligns D:
      -Cosmic
    */}
    <Container height='20px' width='2em' alignItems='center' margin='0 2em 0 0' float><CheckBox checked={spell.prepared}/></Container>
    <Container height='20px' width='30%' float><Title>{spell.name}</Title></Container>
    <Container height='20px' direction='row' grow='1' float>

      {
        spell.tags.map(tag => <Text margin='0 10px 0 0'>{tag},</Text>)
      }

    </Container>
  </ListItem>
)

export default Spell;