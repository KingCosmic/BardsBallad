import styled from 'styled-components';

import Text from './Text';

const Title = styled(Text)`
  color: ${(props) => props.theme.gold};
`

export default Title;