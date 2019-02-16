import React from 'react';

import Container from '../atoms/Container';
import Text from '../atoms/Text';
import BarContainer from '../atoms/BarContainer';
import BarFiller from '../atoms/BarFiller';

const determinPercent = (current, max) => `${(current / max) * 100}%`;

const Component = (props) => {
  const { hp: { max, current, temp } } = props;

  return (
    <Container grow='1'>
      <Text size='0.9em'>HP: {current}/{max}</Text>

      <BarContainer width='100%' height='10px' bg ol>
        <BarFiller width={determinPercent(temp, max)} color='green' />
        <BarFiller width={determinPercent(current, max)} color='red' />
      </BarContainer>
    </Container>
  )
}

export default Component;