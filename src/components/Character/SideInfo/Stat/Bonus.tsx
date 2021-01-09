import React from 'react'
import styled from 'styled-components'

import { determinMod } from '../../../../system'

const Bonus = styled.p<{ value: number }>`
  color: ${props => (props.value < 10 ? props.theme.red : props.theme.green)};
`

export default props => (
  <Bonus {...props}>
    {(props.value > 10 ? '+' : '') + determinMod(props.value)}
  </Bonus>
)
