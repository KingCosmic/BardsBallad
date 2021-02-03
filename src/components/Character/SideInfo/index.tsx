import React from 'react'
import styled from 'styled-components'

import Container from './Container'
import TopRow from './TopRow'

import HP from './HP'
import EXP from './EXP'
import ArmorClass from './ArmorClass'
import Speed from './Speed'
import Initiative from './Initiative'
import Proficiency from './Proficiency'
import PassivePerception from './PassivePerception'
import HitDice from './HitDice'
import Stat from './Stat'

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px;
`

function SideInfo(props) {
  const { char } = props
  const {
    hp,
    exp,
    stats,
    ac,
    speed,
    initiative,
    passivePerception,
    hitdice
  } = char

  return (
    <Container>
      <TopRow />

      <BottomContainer>
        <HP hp={hp} />
        <EXP current={exp} />

        <Row>
          <ArmorClass name="AC" path="ac" value={ac} />
          <Speed name="SPD" path="speed" value={speed} />
          <Initiative
            name="INIT"
            path="initiative"
            value={initiative}
          />
        </Row>
        <Row>
          <Proficiency
            name="PROF"
            path="proficiency"
            value={exp}
          />
          <PassivePerception
            path="passivePerception"
            value={passivePerception}
          />
          <HitDice path="hitdice" value={hitdice} />
        </Row>

        <Row>
          <Stat
            name="STR"
            path="strength"
            value={stats.strength}
          />
          <Stat
            name="DEX"
            path="dexterity"
            value={stats.dexterity}
          />
          <Stat
            name="CON"
            path="constitution"
            value={stats.constitution}
          />
        </Row>
        <Row>
          <Stat
            name="INT"
            path="intelligence"
            value={stats.intelligence}
          />
          <Stat
            name="WIS"
            path="wisdom"
            value={stats.wisdom}
          />
          <Stat
            name="CHA"
            path="charisma"
            value={stats.charisma}
          />
        </Row>
      </BottomContainer>
    </Container>
  )
}

export default SideInfo
