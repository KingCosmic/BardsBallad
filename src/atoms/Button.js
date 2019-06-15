import styled, { css } from 'styled-components';

const Button = styled.div`
  padding: 5px;
  border-radius: 4px;
  font-weight: 200;
  font-family: OpenSans;
  text-align: center;
  height: 27px;
  width: ${props => props.width || 'auto'};
  opacity: .85;
  line-height: 27px;
  background-color: ${props => props.theme.green};
  color: rgb(250, 250, 250);
  cursor: pointer;

  margin: ${props => props.margin || 0};

  ${props => props.disabled && css`
    opacity: 0.4;
    cursor: not-allowed;
  `}

  &:active {
    opacity: 0.5;
  }
`

export default Button;