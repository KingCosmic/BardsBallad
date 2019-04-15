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

import { connect } from 'react-redux';
import { editItem } from '../reducers/ui';
import { updateData, revertData } from '../reducers/characters';

const CharacterStats = (props) => {
  const { char, data, editItem, updateData, editing, revertData } = props;

  const propData = { data, editItem, updateData, editing, revertData };

  const {
    name, job, level, hp, exp, ac,
    passivePerception, proficiency,
    initiative,
    hitdice, deathsaves,
    speed, pieces, stats
  } = char;

  const { copper, silver, etherium, gold, platinum } = pieces;

  const { strength, dexterity, constitution, intelligence, wisdom, charisma } = stats;

  return (
    <Container justifyContent='space-between'>
      <div className='needed_this_to_push_the_other_stuff_to_the_bottom_xD' />
      <Grid width='450px' columns='repeat(12, 1fr)' rows='auto' gap='10px'>

        <Name name={name} job={job} level={level} />

        <GridItem column='auto / span 10'>
          <HP hp={hp} path='hp' {...propData} />
          <EXP exp={exp} />
        </GridItem>

        <HitDice hd={hitdice} {...propData} />
        

        <Gold type='CP' amount={copper} />
        <Gold type='SP' amount={silver} />
        <Gold type='EP' amount={etherium} />
        <Gold type='GP' amount={gold} />
        <Gold type='PP' amount={platinum} />

        <AC ac={ac} path='ac' {...propData} />
        <DeathSaves ds={deathsaves} />
        <PassivePerception value={passivePerception} path='passivePerception' {...propData} />
        

        <Speed speed={speed} path='speed' {...propData} />
        <Initiatve value={initiative} path='initiative' {...propData} />
        <Proficiency value={proficiency} path='proficiency' {...propData} />

        <CharacterStat name='STR' val={strength} path='stats.strength' {...propData} />
        <CharacterStat name='DEX' val={dexterity} path='stats.dexterity' {...propData} />
        <CharacterStat name='CON' val={constitution} path='stats.constitution' {...propData} />
        <CharacterStat name='INT' val={intelligence} path='stats.intelligence' {...propData} />
        <CharacterStat name='WIS' val={wisdom} path='stats.wisdom' {...propData} />
        <CharacterStat name='CHA' val={charisma} path='stats.charisma' {...propData}/>
      </Grid>
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    editing: state.ui.editing,
    data: state.characters.update.data,
    empty: state.characters.update.empty
  }
}

export default connect(mapStateToProps, { editItem, updateData, revertData })(CharacterStats);