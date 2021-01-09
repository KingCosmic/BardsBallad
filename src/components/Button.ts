import styled, { css } from 'styled-components'

type Props = {
  disabled?: boolean
}

const Button = styled.button<Props>`
  background-color: ${props => props.theme.blue};
  color: ${props => props.theme.text};

  font-family: OpenSans;
  font-size: 1.2em;
  padding: 8px 12px;
  border-radius: 4px;
  border: none;

  cursor: pointer;

  ${props =>
    props.disabled &&
    css`
      opacity: 0.4;
      cursor: not-allowed;
    `}

  @media only screen and (min-width: 768px) {
    padding: 6px;
    font-size: 1vw;
    font-weight: 200;
  }
`

export default Button
