import React from 'react';
import styled from 'styled-components';

import Text from './Text';

const Button = styled.div`
  padding: 5px;
  border-radius: 4px;
  font-weight: 200;
  font-family: OpenSans;

  background-color: ${props => props.theme.green};
  color: ${props => props.theme.text};

  cursor: pointer;
`

export default Button;