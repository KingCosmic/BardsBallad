import React from 'react';
import styled from 'styled-components';

import cloneDeep from 'lodash.clonedeep';

import Button from '../atoms/Button';
import Con from '../atoms/Container';

import { connect } from 'react-redux';
import { syncData } from '../reducers/update';

import { mergeUpdates } from '../helpers';
import DeathSaves from './DeathSaves';

const Container = styled(Con)`
  position: absolute;
  top: 10px;
  right: 10px;
`

const DataOptions = (props) => {
  const { syncData, update, character } = props;
  const { _id, items, feats } = character; 

  const updateData = cloneDeep(update);

  if (updateData.items) updateData.items = mergeUpdates(items, updateData.items);
  if (updateData.feats) updateData.feats = mergeUpdates(feats, updateData.feats);

  return (
    <Container>
      <Button onClick={() => syncData(_id, updateData)} disabled={update.changes.length === 0} width='50px'>Save</Button>
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    update: state.update,
    character: state.characters.character
  }
}

export default connect(mapStateToProps, { syncData })(DataOptions);