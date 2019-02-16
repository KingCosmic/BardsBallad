import React from 'react';

import Container from '../atoms/Container';

import SavingThrows from './SavingThrows';
import Skills from './Skills';
import Feats from './Feats';

import { connect } from 'react-redux';

import levels from '../data/levels'

const SkillsTab = (props) => {
  const { char: { savingThrows, skills, stats, feats }, data, prof} = props;

  // TODO: get feats here.

  return (
    <Container 
      height='calc(100% - 40px)' width='calc(100% - 40px)' padding='20px'
      direction='row' justifyContent='space-between'>

      <Container height='100%' width='30%'>
        <SavingThrows throws={savingThrows} stats={stats} data={data} prof={prof} />

        <Skills skills={skills} stats={stats} data={data} prof={prof} />
      </Container>

      <Feats feats={feats} />
    </Container>
  )
}

const mapStateToProps = (state) => {
  const { update: { data, empty }, character: { level } } = state.characters

  return {
    data,
    empty,
    prof: levels[level].prof
  }
}

export default connect(mapStateToProps, {})(SkillsTab);