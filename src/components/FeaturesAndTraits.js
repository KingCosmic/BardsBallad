import React from 'react';

import Container from '../atoms/Container';

import SavingThrows from './SavingThrows';
import Skills from './Skills';
import Feats from './Feats';

import { connect } from 'react-redux';

import levels from '../data/levels'

const FeaturesAndTraits = (props) => {
  const { char: { feats }, data } = props;

  // TODO: get feats here.

  return (
    <Container 
      height='calc(100% - 40px)' width='calc(100% - 40px)' padding='20px'
      direction='row' justifyContent='space-between'>

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

export default connect(mapStateToProps, {})(FeaturesAndTraits);