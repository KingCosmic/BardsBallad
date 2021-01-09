import styled from 'styled-components'

export default styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.blue};
  position: absolute;
  bottom: -5px;
  right: 5px;
  width: 25px;
  height: 25px;
  text-align: center;
  border-radius: 50%;
  color: ${props => props.theme.text};
  font-family: OpenSans;
  font-weight: 200;
  font-size: 0.9em;
`