import React from 'react';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import List from '../atoms/List';
import Skill from './Skill';

import { skillToStat } from '../data/skills';

const AC = 'acrobatics';
const AH = 'animalHandling';
const AR = 'arcana';
const AT = 'athletics';
const DE = 'deception';
const HI = 'history';
const IN = 'insight';
const INT = 'intimidation';
const INV = 'investigation';
const MED = 'medicine';
const NAT = 'nature';
const PER = 'perception';
const PERF = 'performance';
const PERS = 'persuasion';
const REL = 'religion';
const SOH = 'sleightOfHand';
const STE = 'stealth';
const SUR = 'survival';

const Skills = (props) => {
  const { skills, stats, update, prof } = props;

  return (
    <Container height='calc(70% - 20px)' padding='10px'>
      <Title margin='0 0 5px 0' header>Skills</Title>

      <List flowY='scroll' width='100%' barWidth='0px'>
        <Skill
          key={AC} stats={stats} skill={AC} stat={skillToStat(AC)} efficient={skills[AC]}
          prof={prof} update={update}
        />

        <Skill
          key={AH} stats={stats} skill={AH} stat={skillToStat(AH)} efficient={skills[AH]}
          prof={prof} update={update}
        />

        <Skill
          key={AR} stats={stats} skill={AR} stat={skillToStat(AR)} efficient={skills[AR]}
          prof={prof} update={update}
        />

        <Skill
          key={AT} stats={stats} skill={AT} stat={skillToStat(AT)} efficient={skills[AT]}
          prof={prof} update={update}
        />

        <Skill
          key={DE} stats={stats} skill={DE} stat={skillToStat(DE)} efficient={skills[DE]}
          prof={prof} update={update}
        />

        <Skill
          key={HI} stats={stats} skill={HI} stat={skillToStat(HI)} efficient={skills[HI]}
          prof={prof} update={update}
        />

        <Skill
          key={IN} stats={stats} skill={IN} stat={skillToStat(IN)} efficient={skills[IN]}
          prof={prof} update={update}
        />

        <Skill
          key={INT} stats={stats} skill={INT} stat={skillToStat(INT)} efficient={skills[INT]}
          prof={prof} update={update}
        />

        <Skill
          key={INV} stats={stats} skill={INV} stat={skillToStat(INV)} efficient={skills[INV]}
          prof={prof} update={update}
        />

        <Skill
          key={MED} stats={stats} skill={MED} stat={skillToStat(MED)} efficient={skills[MED]}
          prof={prof} update={update}
        />

        <Skill
          key={NAT} stats={stats} skill={NAT} stat={skillToStat(NAT)} efficient={skills[NAT]}
          prof={prof} update={update}
        />

        <Skill
          key={PER} stats={stats} skill={PER} stat={skillToStat(PER)} efficient={skills[PER]}
          prof={prof} update={update}
        />

        <Skill
          key={PERF} stats={stats} skill={PERF} stat={skillToStat(PERF)} efficient={skills[PERF]}
          prof={prof} update={update}
        />

        <Skill
          key={PERS} stats={stats} skill={PERS} stat={skillToStat(PERS)} efficient={skills[PERS]}
          prof={prof} update={update}
        />

        <Skill
          key={REL} stats={stats} skill={REL} stat={skillToStat(REL)} efficient={skills[REL]}
          prof={prof} update={update}
        />

        <Skill
          key={SOH} stats={stats} skill={SOH} stat={skillToStat(SOH)} efficient={skills[SOH]}
          prof={prof} update={update}
        />

        <Skill
          key={STE} stats={stats} skill={STE} stat={skillToStat(STE)} efficient={skills[STE]}
          prof={prof} update={update}
        />

        <Skill
          key={SUR} stats={stats} skill={SUR} stat={skillToStat(SUR)} efficient={skills[SUR]}
          prof={prof} update={update}
        />
        
      </List>
    </Container>
  )
}

export default Skills;