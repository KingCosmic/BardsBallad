import styled from 'styled-components';

const CheckBox = styled.div`
  width: 12px;
  height: 12px;

  border-radius: 2px;

  cursor: pointer;

  margin: ${props => props.margin || 0};
  padding: ${props => props.padding || 0};

  background-color: ${props => props.checked ? props.color || props.theme.green : props.theme.grey};

  &:hover {
    background-color: ${props => props.hover || props.theme.green};
  }
`

export default CheckBox;