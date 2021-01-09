import React, { Component } from 'react'
import styled from 'styled-components'

import { determinMod } from '../../../../system'

import { toggleSave } from '../../../../services/db'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 5px;
  width: 100%;
  margin-top: 5px;
`

const CheckBox = styled.div<{ checked: boolean }>`
  width: 1.5em;
  height: 1.5em;
  background-color: ${props =>
    props.checked
      ? props.theme[props.color || 'green'] || props.color
      : props.theme.grey};
  margin-right: 5px;
  cursor: pointer;
`

const Text = styled.p`
  font-size: 1.3em;
  padding: 0 5px;
`

const Value = styled.p`
  text-decoration: underline ${props => props.theme.grey};
  margin-right: 5px;
`

function SavingThrow(props) {
  const { throws, skill, stats, prof } = props

  const efficient = throws[skill]
  const mod = determinMod(stats[skill])

  return (
    <Container>
      <CheckBox onClick={() => {
        console.log(skill, !efficient)
        toggleSave(skill, !efficient)
      }} checked={efficient} />

      <Value>
        {(efficient ? mod + prof : mod) < 0
          ? efficient
            ? mod + prof
            : mod
          : `+${efficient ? mod + prof : mod}`}
      </Value>

      <Text>{skill || 'saving throw'}</Text>
    </Container>
  )
}

export default SavingThrow
