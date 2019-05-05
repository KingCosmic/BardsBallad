import React from 'react';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const Gold = (props) => {
  return (
    <Container width='40%' margin='5px 0' padding='5px' direction='row' alignItems='center'>
      <Title margin='0 10px 0 0' header>{props.type}</Title>
      <Text header>{props.amount}</Text>
    </Container>
  )
}

export default Gold;