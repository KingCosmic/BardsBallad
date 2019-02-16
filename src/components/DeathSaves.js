import React from 'react';

import GridItem from '../atoms/GridItem';
import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';
import CheckBox from '../atoms/CheckBox';

const DeathSaves = (props) => {
  const { ds } = props;

  return (
    <GridItem column='auto / span 6' alignItems='center' bg ol>

      <Text color='green' size='0.9em' weight='500'>SUCCESSES</Text>
      <Container direction='row' width='calc(2.4em + 10px)' justifyContent='space-between'>
        <CheckBox checked={ds.success.first} />
        <CheckBox checked={ds.success.second} />
        <CheckBox checked={ds.success.third} />
      </Container>

      <Text color='red' size='0.9em' weight='500'>FAILURES</Text>
      <Container direction='row' width='calc(2.4em + 10px)' justifyContent='space-between'>
        <CheckBox checked={ds.fails.first} failed/>
        <CheckBox checked={ds.fails.second} failed/>
        <CheckBox checked={ds.fails.third} failed/>
      </Container>

      <Title>DEATH SAVES</Title>
    </GridItem>
  )
}

export default DeathSaves;