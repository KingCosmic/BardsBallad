import React from 'react';
import { connect } from 'react-redux';

import { updateDeathSaveSuccesses, updateDeathSaveFails } from '../reducers/characters';

import GridItem from '../atoms/GridItem';
import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';
import CheckBox from '../atoms/CheckBox';

const figureOutDeathSaves = function (saveNumber, index) {
  let count = 0;
  if (index.first) count++;
  if (index.second) count++;
  if (index.third) count++;
  return saveNumber === count ? 0 : saveNumber;
};

const DeathSaves = (props) => {
  const { ds } = props;
  return (
    <GridItem column='auto / span 6' alignItems='center' bg ol>

      <Text color='green' size='0.9em' header>SUCCESSES</Text>
      <Container direction='row' width='calc(2.4em + 10px)' justifyContent='space-between'>
        <CheckBox checked={ds.success.first} onClick={() => {props.updateDeathSaveSuccesses(figureOutDeathSaves(1, ds.success));}}/>
        <CheckBox checked={ds.success.second} onClick={() => {props.updateDeathSaveSuccesses(figureOutDeathSaves(2, ds.success));}}/>
        <CheckBox checked={ds.success.third} onClick={() => {props.updateDeathSaveSuccesses(figureOutDeathSaves(3, ds.success));}}/>
      </Container>

      <Text color='red' size='0.9em' header>FAILURES</Text>
      <Container direction='row' width='calc(2.4em + 10px)' justifyContent='space-between'>
        <CheckBox checked={ds.fails.first} failed onClick={() => {props.updateDeathSaveFails(figureOutDeathSaves(1, ds.fails));}}/>
        <CheckBox checked={ds.fails.second} failed onClick={() => {props.updateDeathSaveFails(figureOutDeathSaves(2, ds.fails));}}/>
        <CheckBox checked={ds.fails.third} failed onClick={() => {props.updateDeathSaveFails(figureOutDeathSaves(3, ds.fails));}}/>
      </Container>

      <Title header>DEATH SAVES</Title>
    </GridItem>
  );
};

const mapStoreToProps = function () {
  return {};
};

export default connect(mapStoreToProps, {updateDeathSaveSuccesses, updateDeathSaveFails})(DeathSaves);

