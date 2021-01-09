import React from 'react'
import styled from 'styled-components'

import MenuItem from './MenuItem'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 10px 10px 0;

  background: ${props => props.theme.sidebars};
  border-bottom: 1px solid black;
`

function TopRow(props) {
  return (
    <Container>
      <MenuItem>test</MenuItem>
    </Container>
  )
}

export default TopRow
