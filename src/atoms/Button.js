import React from 'react';
import styled, { css } from 'styled-components';

import Text from './Text';

const Button = styled.div`
  padding: 5px;
  border-radius: 4px;
  font-weight: 200;
  font-family: OpenSans;
  text-align: center;
  height: 27px;
  width: ${props => props.width || 'auto'};
  opacity: .7;
  line-height: 27px;
  background-color: ${props => props.theme.green};
  color: ${props => props.theme.text};
  cursor: pointer;

  ${props => props.disabled && css`
    opacity: 0.4;
    cursor: not-allowed;
  `}

  &:active {
    opacity: 0.5;
  }
`

export default Button;