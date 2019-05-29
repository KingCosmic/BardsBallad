import React from 'react';

import Container from '../atoms/Container';

import SavingThrows from './SavingThrows';
import Title from '../atoms/Title';
import List from '../atoms/List';
import Skills from './Skills';

import levels from '../data/levels'
import Senses from './Senses';
import Proficiencies from './Proficiencies';

const SkillsTab = (props) => {
  const { char: { savingThrows, skills, stats, proficiency }, update } = props;

  const prof = Number(update['proficiency']) || proficiency

  return (
    <Container 
      height='calc(100% - 40px)' width='calc(100% - 40px)' padding='20px'
      direction='row'>

      <Container height='100%' width='50%'>
        <SavingThrows throws={savingThrows} stats={stats} data={update} prof={prof} />

        <Skills skills={skills} stats={stats} data={update} prof={prof} />
      </Container>

      <Container height='100%'>
        <Senses stats={stats} data={update} skills={skills} prof={prof} />

        <Proficiencies />
      </Container>
    </Container>
  )
}

export default SkillsTab;