import styled from 'styled-components';

const Text = styled.p`
  color: ${props => props.color ? props.theme[props.color] || props.color : props.theme.text};
  font-family: OpenSans;
  font-size: 1em;
  font-weight: 200;
`

export default Text;