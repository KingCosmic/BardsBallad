import * as React from 'react'
import styled from 'styled-components'

const Styling = styled.p`
  text-align: center;
  color: ${props => props.theme.text};
  pointer-events: all;
  padding: 5px;
  cursor: pointer;

  :hover {
    background: #3F56D0;
  }
`

type Props = {
  children: React.ReactNode
  onClick?(): void
}

function MenuItem(props: Props) {
  const { children } = props

  return <Styling>{children}</Styling>
}

export default MenuItem
