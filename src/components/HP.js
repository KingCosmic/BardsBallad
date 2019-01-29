import React from 'react';

import Container from '../atoms/Container';
import Text from '../atoms/Text';
import BarContainer from '../atoms/BarContainer';
import BarFiller from '../atoms/BarFiller';

const Component = (props) => {
  return (
    <Container grow='1'>
      <Text size='0.9em'>HP: 49/49</Text>

      <BarContainer width='100%' height='10px' bg>
        <BarFiller width='0%' color='green' />
        <BarFiller width='100%' color='red' />
      </BarContainer>
    </Container>
  )
}

export default Component;