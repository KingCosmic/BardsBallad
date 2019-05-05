import React from 'react';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

import Name from './CharacterName';
import HP from './HP';
import EXP from './EXP';
import PassivePerception from './PassivePerception';
import Proficiency from './Proficiency';
import Speed from './Speed';
import AC from './AC';
import Initiatve from './Initiative'
import HitDice from './HitDice';
import DeathSaves from './DeathSaves';
import CharacterStat from './CharacterStat';

const CharacterStats = (props) => {
  const { char, data, editItem, updateData, editing, revertData } = props;

  const propData = { data, editItem, updateData, editing, revertData };

  const {
    name, job, level, hp, exp, ac,
    passivePerception, proficiency,
    hitdice, deathsaves, speed,
    initiative, pieces, stats
  } = char;

  const { strength, dexterity, constitution, intelligence, wisdom, charisma } = stats;

  return (
    <Container width='25%' justifyContent='space-between'>
      <div className='needed_this_to_push_the_other_stuff_to_the_bottom_xD' />
      <Container>

        <Title size='1.2em'>{name}</Title>
        <Text size='1em'>{job}, {level}</Text>

        <Container padding='5px'>
          <HP hp={hp} path='hp' {...propData} />
          <EXP exp={exp} />
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
    </Container>
  )
}

export default CharacterStats;