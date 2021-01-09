import React from 'react'
import styled from 'styled-components'

import Skill from './Skill'

import { SkillNames } from '../../../system'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  width: 100%;
`

const Title = styled.p`
  color: ${props => props.theme.gold};
  margin-bottom: 5px;
  font-size: 2em;
  border-bottom: 1px solid ${props => props.theme.gold};
`

type Props = {
  skills: { [val: string]: number }
  stats: { [val: string]: number }
  prof: number
}

function Skills(props: Props) {
  const { skills, prof, stats } = props

  return (
    <Container>
      <Title>Skills</Title>

      <Skill
        key="1"
        skill={SkillNames.AC}
        skills={skills}
        prof={prof}
        stats={stats}
      />
      <Skill
        key="2"
        skill={SkillNames.AH}
        skills={skills}
        prof={prof}
        stats={stats}
      />
      <Skill
        key="3"
        skill={SkillNames.AR}
        skills={skills}
        prof={prof}
        stats={stats}
      />
      <Skill
        key="4"
        skill={SkillNames.AT}
        skills={skills}
        prof={prof}
        stats={stats}
      />
      <Skill
        key="5"
        skill={SkillNames.DE}
        skills={skills}
        prof={prof}
        stats={stats}
      />
      <Skill
        key="6"
        skill={SkillNames.HI}
        skills={skills}
        prof={prof}
        stats={stats}
      />
      <Skill
        key="7"
        skill={SkillNames.IN}
        skills={skills}
        prof={prof}
        stats={stats}
      />
      <Skill
        key="8"
        skill={SkillNames.INT}
        skills={skills}
        prof={prof}
        stats={stats}
      />
      <Skill
        key="9"
        skill={SkillNames.INV}
        skills={skills}
        prof={prof}
        stats={stats}
      />
      <Skill
        key="10"
        skill={SkillNames.MED}
        skills={skills}
        prof={prof}
        stats={stats}
      />
      <Skill
        key="11"
        skill={SkillNames.NAT}
        skills={skills}
        prof={prof}
        stats={stats}
      />
      <Skill
        key="12"
        skill={SkillNames.PER}
        skills={skills}
        prof={prof}
        stats={stats}
      />
      <Skill
        key="13"
        skill={SkillNames.PERF}
        skills={skills}
        prof={prof}
        stats={stats}
      />
      <Skill
        key="14"
        skill={SkillNames.PERS}
        skills={skills}
        prof={prof}
        stats={stats}
      />
      <Skill
        key="15"
        skill={SkillNames.REL}
        skills={skills}
        prof={prof}
        stats={stats}
      />
      <Skill
        key="16"
        skill={SkillNames.SOH}
        skills={skills}
        prof={prof}
        stats={stats}
      />
      <Skill
        key="17"
        skill={SkillNames.STE}
        skills={skills}
        prof={prof}
        stats={stats}
      />
      <Skill
        key="18"
        skill={SkillNames.SUR}
        skills={skills}
        prof={prof}
        stats={stats}
      />
    </Container>
  )
}

export default Skills
