import React from 'react';

import GridItem from '../atoms/GridItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const AC = (props) => {
  return (
    <GridItem flex column='auto / span 2' justifyContent='center' alignItems='center' bg>
      <Title fontWeight='500'>AC</Title>
      <Text weight='500'>19</Text>
    </GridItem>
  )
}

export default AC;