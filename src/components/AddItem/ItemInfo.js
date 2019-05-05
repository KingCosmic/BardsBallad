import React from 'react';

import Container from '../../atoms/Container';
import Title from '../../atoms/Title';
import Text from '../../atoms/Text';
import Button from '../../atoms/Button';

const ItemInfo = () => {
  return (
    <Container height='100%' width='100%'>
      <Container height='30px' margin='0 0 10px 0' justifyContent='center'>
        <Title align='center'>Check Item</Title>
      </Container>
      <Container flowY='auto' height='calc(100% - 40px)'>
        <Container>
          <Title>Greatsword</Title>
          <Container direction='row' justifyContent='space-between'>
            <Text size='0.8em'>Type: Martial Weapon</Text>
          </Container>
        </Container>
      </Container>
    </Container>
  )
}

export default ItemInfo;