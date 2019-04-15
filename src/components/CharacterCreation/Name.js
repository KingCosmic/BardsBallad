import React from 'react';

import Container from '../../atoms/Container';
import Title from '../../atoms/Title';
import Input from '../../atoms/Input';

const Name = () => {
  return (
    <Container justifyContent='center' alignItems='center' height='calc(100% - 80px)'>
      <Title>Choose your name.</Title>
      <Input defaultValue='Cosmic' padding='5px' margin='5px' />
    </Container>
  )
}

export default Name;