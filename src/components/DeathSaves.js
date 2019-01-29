import React from 'react';

import GridItem from '../atoms/GridItem';
import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';
import CheckBox from '../atoms/CheckBox';

const DeathSaves = (props) => {
  return (
    <GridItem column='auto / span 6' alignItems='center' bg>

      <Text color='green' size='0.9em' weight='500'>SUCCESSES</Text>
      <Container direction='row' width='calc(2.4em + 10px)' justifyContent='space-between'>
        <CheckBox />
        <CheckBox />
        <CheckBox />
      </Container>

      <Text color='red' size='0.9em' weight='500'>FAILURES</Text>
      <Container direction='row' width='calc(2.4em + 10px)' justifyContent='space-between'>
        <CheckBox failed/>
        <CheckBox failed/>
        <CheckBox failed/>
      </Container>

      <Title>DEATH SAVES</Title>
    </GridItem>
  )
}

export default DeathSaves;