import styled from 'styled-components'

export default styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  height: 100vh;
  overflow-x: hidden;

  background-color: ${props => props.theme.sidebars};
  border-right: 1px solid black;
`
