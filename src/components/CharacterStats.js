import React from 'react';

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

import styles from '../css/CharacterStats.module.scss';

const CharacterStats = (props) => {
  return (
    <div className={styles.container}>
      <div className='needed_this_to_push_the_other_stuff_to_the_bottom_xD' />
      <Grid width='450px' columns='repeat(12, 1fr)' rows='auto' gap='10px'>

        <Name />

        <GridItem column='auto / span 10'>
          <HP />
          <EXP />
        </GridItem>

        <AC />

        <Gold type='CP' amount={0} />
        <Gold type='SP' amount={0} />
        <Gold type='EP' amount={0} />
        <Gold type='GP' amount={10} />
        <Gold type='PP' amount={0} />

        <HitDice />
        <DeathSaves />

        <PassivePerception />
        <Speed />
        <Initiatve />
        <Proficiency />

        <CharacterStat name='STR' val={20} />
        <CharacterStat name='DEX' val={13} />
        <CharacterStat name='CON' val={16} />
        <CharacterStat name='INT' val={14} />
        <CharacterStat name='WIS' val={16} />
        <CharacterStat name='CHA' val={15} />
      </Grid>
    </div>
  )
}

export default CharacterStats;