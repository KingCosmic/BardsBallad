import React, { useState } from 'react'
import styled from 'styled-components'

import Modal from './Modal'

import { setSkillProficiency } from '../../services/db'

const skillMap = {
  animalHandling: 'animal handling',
  sleightOfHand: 'sleight of hand',
}

const Title = styled.p`
  color: ${props => props.theme.gold};
  font-size: 1.8em;
  padding-top: 10px;
`

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin: 10px 0;
`

const ProfText = styled.p`
  width: 2em;
`

type CheckProps = {
  checked?: boolean
  color?: string
}

const CheckBox = styled.div<CheckProps>`
  background-color: ${props =>
    props.checked ? props.theme[props.color as string] : props.theme.grey};
  width: 2em;
  height: 2em;
`

type ButtonProps = {
  cancel?: boolean
}

const Button = styled.p<ButtonProps>`
  background-color: ${props =>
    props.cancel ? props.theme.red : props.theme.green};
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  font-size: 1.3em;
  text-align: center;
`

type Props = {
  skill: string
  defaultValue: number
  isOpen: boolean
  setIsOpen(open: boolean): void
}

function SelectSkillProficiency(props: Props) {
  const { skill, isOpen, setIsOpen, defaultValue } = props

  const [value, setValue] = useState(defaultValue)

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Title>{(skillMap[skill] || skill).toUpperCase()}</Title>

      <Row>
        <ProfText>not</ProfText>
        <ProfText>half</ProfText>
        <ProfText>prof</ProfText>
        <ProfText>expert</ProfText>
      </Row>
      <Row>
        <CheckBox
          color="text"
          checked={value === 0}
          onClick={() => setValue(0)}
        />
        <CheckBox
          color="blue"
          checked={value === 1}
          onClick={() => setValue(1)}
        />
        <CheckBox
          color="green"
          checked={value === 2}
          onClick={() => setValue(2)}
        />
        <CheckBox
          color="gold"
          checked={value === 3}
          onClick={() => setValue(3)}
        />
      </Row>

      <Row>
        <Button onClick={() => setIsOpen(false)} cancel>
          cancel
        </Button>
        <Button onClick={() => {
          setSkillProficiency(skill, value)
          .then(() => {
            setIsOpen(false)
          })
        }}>confirm</Button>
      </Row>
    </Modal>
  )
}
export default SelectSkillProficiency
