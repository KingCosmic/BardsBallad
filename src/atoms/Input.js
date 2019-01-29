import styled from 'styled-components';

const Input = styled.input`
  width: ${props => props.width || '250px'};
  height: ${props => props.height || '30px'};

  margin: ${props => props.margin || 0};
  padding: ${props => props.padding || 0};

  text-align: ${props => props.align || 'left'};
`

export default Input;