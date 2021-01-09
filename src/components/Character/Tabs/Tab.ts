import styled from 'styled-components'

type Props = {
  active: boolean
}

export default styled.p<Props>`
  color: ${props => props.active ? props.theme.gold : props.theme.text};
  font-family: OpenSans;
  margin: 0;
  padding: 0 10px 10px;

  float: left;

  cursor: pointer;
  position: relative;

  &:hover {
    color: ${props => props.theme.gold};
  }
`
