import styled, { css } from 'styled-components';

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 7px;
  border-radius: 4px;
  font-weight: 200;
  font-family: OpenSans;
  text-align: center;

  width: ${props => props.width || 'auto'};
  opacity: .85;
  background-color: ${props => props.red ? props.theme.red : props.theme.green};
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