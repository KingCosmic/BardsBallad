import React from 'react';
import styled from 'styled-components';

import ListItem from '../atoms/ListItem';
import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const School = styled(Text)`
  font-size: 0.6em;
  border: 1px solid ${props => props.theme.grey};
  border-radius: 4px;
`

const Component = styled(Container)`
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: ${props => props.theme.grey};
  border-radius: 50%;
`

const Spell = ({ name, school, id, onClick }) => (
  <ListItem hover='almostblack' cursor='pointer' direction='row' justifyContent='space-between'
    onClick={() => onClick(id)}
  >
    <Container padding='5px'>
      <Title padding='5px'>{name}</Title>
      <School align='center'>{school}</School>  
    </Container>
    <Container justifyContent='center' alignItems='center'>
      <Component margin='5px'><Text lineHeight='20px' size='0.8em'>C</Text></Component>
    </Container>
  </ListItem>
)

export default Spell;