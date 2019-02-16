import React from 'react';

import Container from '../atoms/Container';
import Grid from '../atoms/Grid';
import GridItem from '../atoms/GridItem';

import Name from './CharacterName';
import HP from './HP';
import EXP from './EXP';
import AC from './AC';
import Gold from './Gold';
import PassivePerception from './PassivePerception';
import Speed from './Speed';
import Initiatve from './Initiative'
import Proficiency from './Proficiency';
import HitDice from './HitDice';
import DeathSaves from './DeathSaves';
import CharacterStat from './CharacterStat';

import levels from '../data/levels';

const CharacterStats = (props) => {
  const {
    name, job, level, hp, exp, ac,
    hitdice, deathsaves,
    speed, skills, pieces, stats
  } = props.char;

  const prof = levels[level].prof;

  const { copper, silver, etherium, gold, platinum } = pieces;

  const { strength, dexterity, constitution, intelligence, wisdom, charisma } = stats;

  return (
    <Container justifyContent='space-between'>
      <div className='needed_this_to_push_the_other_stuff_to_the_bottom_xD' />
      <Grid width='450px' columns='repeat(12, 1fr)' rows='auto' gap='10px'>

        <Name name={name} job={job} level={level} />

        <GridItem column='auto / span 10'>
          <HP hp={hp} />
          <EXP exp={exp} />
        </GridItem>

        <AC ac={ac} />

        <Gold type='CP' amount={copper} />
        <Gold type='SP' amount={silver} />
        <Gold type='EP' amount={etherium} />
        <Gold type='GP' amount={gold} />
        <Gold type='PP' amount={platinum} />

        <HitDice hd={hitdice} />
        <DeathSaves ds={deathsaves} />

        <PassivePerception wis={wisdom} skills={skills} prof={prof} />
        <Speed speed={speed} />
        <Initiatve dex={dexterity} />
        <Proficiency value={prof} />

        <CharacterStat name='STR' val={strength} />
        <CharacterStat name='DEX' val={dexterity} />
        <CharacterStat name='CON' val={constitution} />
        <CharacterStat name='INT' val={intelligence} />
        <CharacterStat name='WIS' val={wisdom} />
        <CharacterStat name='CHA' val={charisma} />
      </Grid>
    </Container>
  )
}

export default CharacterStats;