import React from 'react';

import Container from '../atoms/Container';

import SavingThrows from './SavingThrows';
import Skills from './Skills';
import Feats from './Feats';

const SkillsTab = (props) => {
  return (
    <Container 
      height='calc(100% - 40px)' width='calc(100% - 40px)' padding='20px'
      direction='row' justifyContent='space-between'>

      <Container height='100%' width='30%'>
        <SavingThrows />

        <Skills />
      </Container>

      <Feats />
      
    </Container>
  )
}

export default SkillsTab;