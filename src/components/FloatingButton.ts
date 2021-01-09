import styled from 'styled-components'

type Props = {
  onClick?(): void
}

const FloatingButton = styled.p<Props>`
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.green};
  position: fixed;
  bottom: 30px;
  right: 20px;
  font-size: 2em;
  padding: 10px 20px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1);
`

export default FloatingButton
