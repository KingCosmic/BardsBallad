import styled from 'styled-components';

import Container from './Container';

const BarFiller = styled(Container)`
  height: 100%;

  position: absolute;

  background-color: ${props => props.theme[props.color] || props.theme.text };
`

export default BarFiller;