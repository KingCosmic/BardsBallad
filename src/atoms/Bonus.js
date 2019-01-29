import React from 'react';
import styled from 'styled-components';

import Text from './Text';

const determinMod = (val) => Math.round((val - 10.1) / 2);

const Bonus = styled(Text)`
  color: ${(props) => (props.value < 10) ? props.theme.red : props.theme.green};
  
  ::before {
    content: ${(props) => (props.value < 10) ? '' : `'+'`};
  }
`

export default (props) => <Bonus {...props}>{determinMod(props.value)}</Bonus>;