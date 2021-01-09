import React, { useState } from 'react'
import styled from 'styled-components'

import SelectProficiency from '../../Modals/SelectSkillProficiency'

import { determinMod, skillToStat } from '../../../system'

const modForStage = {
  0: (mod: number): number => mod,
  1: (mod: number, prof: number): number => mod + Math.floor(prof / 2),
  2: (mod: number, prof: number): number => mod + prof,
  3: (mod: number, prof: number): number => mod + prof * 2,
}

const skillMap = {
  animalHandling: 'animal handling',
  sleightOfHand: 'sleight of hand',
}

const stageMap: { [val: number]: string } = { 1: 'blue', 2: 'green', 3: 'gold' }

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 5px;
  margin-top: 5px;
`

type CheckProps = {
  checked?: boolean
  color?: string
}

const CheckBox = styled.div<CheckProps>`
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

const Value = styled(Text)`
  text-decoration: underline ${props => props.theme.grey};
  margin-right: 5px;
`

type Props = {
  stats: { [val: string]: number }
  skills: { [val: string]: number }
  skill: string
  prof: number
}

function Skill(props: Props) {
  const { stats, skills, skill, prof } = props
  const [isOpen, setIsOpen] = useState(false)

  const efficient: number = skills[skill]

  const value: number = stats[skillToStat(skill) as string]

  const mod = determinMod(value)

  return (
    <>
      <SelectProficiency
        skill={skill}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        defaultValue={efficient}
      />
      <Container>
        <CheckBox
          onClick={() => setIsOpen(true)}
          checked={efficient !== 0}
          color={stageMap[efficient]}
        />

        <Value>
          {modForStage[efficient](mod, prof) < 0
            ? modForStage[efficient](mod, prof)
            : `+${modForStage[efficient](mod, prof)}`}
        </Value>

        <Text>{skillMap[skill] || skill}</Text>
      </Container>
    </>
  )
}

export default Skill
