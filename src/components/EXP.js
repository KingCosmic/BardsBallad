import React from 'react';

import Container from '../atoms/Container';
import Text from '../atoms/Text';
import BarContainer from '../atoms/BarContainer';
import BarFiller from '../atoms/BarFiller';

const EXP = (props) => {
  return (
    <Container grow='1'>
      <Text size='0.9em'>EXP: 6500/14000</Text>
      <BarContainer width='100%' height='10px' bg>
        <BarFiller width='46%' color='gold' />
      </BarContainer>
    </Container>
  )
}

export default EXP;