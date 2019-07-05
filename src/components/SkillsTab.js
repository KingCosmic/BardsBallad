import React from 'react';

import Container from '../atoms/Container';

import SavingThrows from './SavingThrows';
import Skills from './Skills';

import Senses from './Senses';
import Proficiencies from './Proficiencies';

const SkillsTab = (props) => {
  const {
    char: { savingThrows, skills, stats, armorProfs, weaponProfs, toolProfs, proficiency },
    update, updateData, revertData
  } = props;

  const prof = Number(update['proficiency']) || proficiency

  return (
    <Container 
      height='calc(100% - 10px)' width='calc(100% - 40px)' padding='5px 20px'
      direction='row'>

      <Container height='100%' width='50%'>
        <SavingThrows throws={savingThrows} stats={stats} update={update} prof={prof} />

        <Skills skills={skills} stats={stats} update={update} prof={prof} />
      </Container>

      <Container height='100%' width='50%'>
        <Senses stats={stats} data={update} skills={skills} prof={prof} />

        <Proficiencies updateData={updateData} revertData={revertData} armorProfs={armorProfs} weaponProfs={weaponProfs} toolProfs={toolProfs} update={update} />
      </Container>
    </Container>
  )
}

export default SkillsTab;