import React from 'react';
import styled from 'styled-components';

import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';

import Button from '../atoms/Button';
import Con from '../atoms/Container';

import { connect } from 'react-redux';
import { syncData, restoreAllSpellSlots } from '../reducers/update';

import { mergeUpdates } from '../helpers';

const Container = styled(Con)`
  position: absolute;
  top: 10px;
  right: 10px;
`

const DataOptions = (props) => {
  const { syncData, restoreAllSpellSlots, update, character } = props;
  const { _id, items, feats, spells } = character; 

  const updateData = cloneDeep(update);

  if (updateData.items) updateData.items = mergeUpdates(items, updateData.items);
  if (updateData.feats) updateData.feats = mergeUpdates(feats, updateData.feats);
  if (updateData.spells) updateData.spells = mergeUpdates(spells, updateData.spells);
  if (updateData.spellSlots) updateData.spellSlots = merge({}, character.spellSlots, updateData.spellSlots);

  return (
    <Container direction='row'>
      <Button onClick={() => restoreAllSpellSlots(updateData.spellSlots || character.spellSlots)} margin='0 5px'>RASSB</Button>
      <Button onClick={() => syncData(_id, updateData)} disabled={update.changes.length === 0} width='50px' margin='0 5px'>Save</Button>
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    update: state.update,
    character: state.characters.character
  }
}

export default connect(mapStateToProps, { syncData, restoreAllSpellSlots })(DataOptions);