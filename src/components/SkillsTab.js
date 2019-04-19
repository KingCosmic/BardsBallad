import React from 'react';

import Container from '../atoms/Container';

import SavingThrows from './SavingThrows';
import Title from '../atoms/Title';
import List from '../atoms/List';
import ListItem from '../atoms/ListItem';
import Skills from './Skills';
import Feats from './Feats';

import { connect } from 'react-redux';

import levels from '../data/levels'
import Senses from './Senses';
import Text from '../atoms/Text';

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
        <Senses stats={stats} data={data} skills={skills} prof={prof} />

        <Container height='calc(70% - 20px)' padding='10px'>
          <Container direction='row' margin='0 0 5px 0' bg>
            <Title header>Proficiencies</Title>
            <Text size='0.8em'>Add Proficiency</Text>
          </Container>

          <List flowY='scroll' width='100%' barWidth='0px'>

          </List>
        </Container>
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