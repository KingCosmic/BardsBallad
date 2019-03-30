import React from 'react';

import Container from '../atoms/Container';

import SavingThrows from './SavingThrows';
import Title from '../atoms/Title';
import List from '../atoms/List';
import Skills from './Skills';
import Feats from './Feats';

import { connect } from 'react-redux';

import levels from '../data/levels'

const SkillsTab = (props) => {
  const { char: { savingThrows, skills, stats, proficiency }, data } = props;

  // TODO: get feats here.

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
        <Container height='calc(30% - 20px)' margin='0 0 20px 0' padding='10px'>
          <Title margin='0 0 5px 0' header>Senses</Title>

          <List width='100%'>
            
          </List>
        </Container>

        <Skills skills={skills} stats={stats} data={data} prof={prof} />
      </Container>

      
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