import React from 'react';

import Container from '../atoms/Container';
import Text from '../atoms/Text';
import BarContainer from '../atoms/BarContainer';
import BarFiller from '../atoms/BarFiller';

const determinPercent = (current, max) => `${(current / max) * 100}%`;

const EXP = (props) => {
  const { exp: { current, needed} } = props;

  return (
    <Container grow='1'>
      <Text size='0.9em'>EXP: {current}/{needed}</Text>
      <BarContainer width='100%' height='10px' bg ol>
        <BarFiller width={determinPercent(current, needed)} color='gold' />
      </BarContainer>
    </Container>
  )
}

export default EXP;