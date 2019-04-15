import React from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';

import SavingThrows from './SavingThrows';
import Skills from './Skills';
import Feats from './Feats';

import { connect } from 'react-redux';

import levels from '../data/levels'

const Search = styled.input`
  width: calc(100%);
  background: rgba(114, 118, 125, .3);
  border: 1px solid black;
  border-radius: 5px 0 0 5px;

  height: 44px;
  font-size: 16px;
  font-weight: 200;
  font-family: OpenSans;

  color: white;
  border: none;
  outline: none;

  padding: 0 12px;
  box-shadow: none;
`

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