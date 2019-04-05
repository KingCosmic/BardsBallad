import styled from 'styled-components';

const getColor = (props) => props.failed ? props.theme.red : props.theme.green;

const CheckBox = styled.div`
  width: 12px;
  height: 12px;

  border-radius: 2px;

  margin: ${props => props.margin || 0};
  padding: ${props => props.padding || 0};

  background-color: ${props => props.checked ? getColor(props) : props.theme.grey};

  &:hover {
    background-color: ${getColor};
  }
`

export default CheckBox;