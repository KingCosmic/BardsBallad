import styled, { css } from 'styled-components';

import Text from './Text';

const Filter = styled(Text)`
  ${props => props.active && css` color: ${props => props.theme.gold}; `}
  margin: 0 5px;
  padding: 2px;

  cursor: pointer;
  border-radius: 4px;


  &:hover {
    background-color: ${props => props.theme.middleblack};
  }
`

export default Filter;