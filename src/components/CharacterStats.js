import React from 'react';

import Container from '../atoms/Container';

import Name from './CharacterName';
import Class from './CharacterClass';
import HP from './HP';
import EXP from './EXP';
import Gold from './Gold';
import PassivePerception from './PassivePerception';
import Proficiency from './Proficiency';
import Speed from './Speed';
import AC from './AC';
import Initiatve from './Initiative'
import HitDice from './HitDice';
import CharacterStat from './CharacterStat';

const CharacterStats = (props) => {
  const { char, data, editItem, updateData, editing, revertData } = props;

  const propData = { data, editItem, updateData, editing, revertData };

  const {
    name, job, hp, exp, ac,
    passivePerception, proficiency,
    hitdice, speed,
    initiative, stats, pieces
  } = char;

  const renderExp = data['exp'] || exp;

  const { copper, silver, etherium, gold, platinum } = pieces;

  const { strength, dexterity, constitution, intelligence, wisdom, charisma } = stats;

  return (
    <Container width='25%'>

      <Name value={name} {...propData} />
      <Class value={job} {...propData} exp={renderExp} />

      <Container padding='5px'>
        <HP hp={hp} path='hp' {...propData} />
        <EXP exp={exp} path='exp' {...propData} />
      </Container>

      <Container direction='row'>
        <Gold type='SP' amount={silver} path='pieces.silver' {...propData} />
        <Gold type='EP' amount={etherium} path='pieces.etherium' {...propData} />
        <Gold type='GP' amount={gold} path='pieces.gold' {...propData} />
        <Gold type='PP' amount={platinum} path='pieces.platinum' {...propData} />
      </Container>

      <Container direction='row'>
        <AC ac={ac} path='ac' {...propData} />
        <Speed speed={speed} path='speed' {...propData} />
        <Initiatve value={initiative} path='initiative' {...propData} />
      </Container>

      <Container direction='row'>
        <Proficiency value={proficiency} path='proficiency' {...propData} />

        <PassivePerception value={passivePerception} path='passivePerception' {...propData} />

        <HitDice path='hitdice' hd={hitdice} {...propData} />
      </Container>

      <Container direction='row'>
        <CharacterStat name='STR' val={strength} path='stats.strength' {...propData} />
        <CharacterStat name='DEX' val={dexterity} path='stats.dexterity' {...propData} />
        <CharacterStat name='CON' val={constitution} path='stats.constitution' {...propData} />
      </Container>
      <Container direction='row'>
        <CharacterStat name='INT' val={intelligence} path='stats.intelligence' {...propData} />
        <CharacterStat name='WIS' val={wisdom} path='stats.wisdom' {...propData} />
        <CharacterStat name='CHA' val={charisma} path='stats.charisma' {...propData} />
      </Container>

    </Container>
  )
}

export default CharacterStats;