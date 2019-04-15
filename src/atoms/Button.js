import React from 'react';
import styled from 'styled-components';

import Text from './Text';

const Button = styled.div`
  padding: 5px;
  border: 1px solid white;
  border-radius: 4px;
  font-weight: 200;
  font-family: OpenSans;


  cursor: pointer;
  color: white;

  &:hover {
    background-color: white;
    color: ${props => props.theme.almostblack};
  }
`

export default Button;