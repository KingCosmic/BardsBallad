import React from 'react';

import Container from '../atoms/Container';

import SavingThrows from './SavingThrows';
import Title from '../atoms/Title';
import List from '../atoms/List';
import Skills from './Skills';

import { connect } from 'react-redux';

import levels from '../data/levels'
import Senses from './Senses';
import Proficiencies from './Proficiencies';

const SkillsTab = (props) => {
  const { char: { savingThrows, skills, stats, proficiency }, data } = props;

  const prof = Number(data['proficiency']) || proficiency

  return (
    <Container 
      height='calc(100% - 40px)' width='calc(100% - 40px)' padding='20px'
      direction='row'>

      <Container height='100%' width='50%'>
        <SavingThrows throws={savingThrows} stats={stats} data={data} prof={prof} />

        <Skills skills={skills} stats={stats} data={data} prof={prof} />
      </Container>

      <Container height='100%'>
        <Senses stats={stats} data={data} skills={skills} prof={prof} />

        <Proficiencies />
      </Container>
    </Container>
  )
}

const mapStateToProps = (state) => {
  const { update: { data, empty }, character: { level } } = state.characters

  return {
    data,
    empty
  }
}

export default connect(mapStateToProps, {})(SkillsTab);