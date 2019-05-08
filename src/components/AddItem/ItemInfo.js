import React from 'react';

import Container from '../../atoms/Container';
import Title from '../../atoms/Title';
import Text from '../../atoms/Text';
import Button from '../../atoms/Button';
import InlineEdit from '../../atoms/InlineEdit';

import constants from '../../data/constants';

const ItemInfo = (props) => {
  return (
    <Container height='100%' width='100%'>
      <Container height='30px' margin='0 0 10px 0' justifyContent='center'>
        <Title align='center'>Check Item</Title>
      </Container>
      <Container flowY='auto' height='calc(100% - 40px)'>
        <Container>
          <Title>Greatsword</Title>
          <Text size='0.98vw'>Rarity: None</Text>
          <Text size='0.98vw'>Value: 50 gp</Text>
          <Text size='0.98vw'>Weight: 6 lbs</Text>

          <Text size='0.98vw'>Type: Martial Weapon</Text>

          

          <InlineEdit placeholder='Here are my ideals' path='description' value={'big fucking sword.'} />
        </Container>
      </Container>
    </Container>
  )
}

export default ItemInfo;