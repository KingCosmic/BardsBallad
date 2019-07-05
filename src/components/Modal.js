import React from 'react';
import styled from 'styled-components';

import C from '../atoms/Container';

import AddItem from './AddItem';
import ItemInfo from './ItemInfo';
import AddSpell from './AddSpell';
import SpellInfo from './SpellInfo';
import AddFeature from './AddFeature';
import EditSpellSlots from './EditSpellSlots';

import { connect } from 'react-redux';
import { hideModal } from '../reducers/ui';
import {
  addItem, removeItem, updateItem, addSpell, removeSpell, updateSpell, updateSpellslots,
  addFeat
} from '../reducers/update';

const Container = styled(C)`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10000;
  background-color: rgba(0, 0, 0, .85);
  justify-content: center;
  align-items: center;

  display: ${props => props.visible ? 'flex' : 'none'};
`

const Modal = ({
  overlay, hideModal, addItem, removeItem, updateItem, addSpell, updateSpell,
  removeSpell, items, spells, update, itemID, spellID, spellSlots, slotsLevel,
  updateSpellslots
}) => {
  return (
    <Container visible={overlay !== ''} onMouseDown={hideModal}>
      {
        (overlay === 'AddItem') ? <AddItem addItem={addItem} /> :
        (overlay === 'ItemInfo') ? <ItemInfo items={items} update={update} itemID={itemID} removeItem={removeItem} updateItem={updateItem} /> :
        (overlay === 'AddSpell') ? <AddSpell addSpell={addSpell} /> :
        (overlay === 'SpellInfo') ? <SpellInfo spells={spells} update={update} spellID={spellID} removeSpell={removeSpell} updateSpell={updateSpell} /> :
        (overlay === 'AddFeat') ? <AddFeature addFeat={addFeat} /> :
        (overlay === 'EditSpellSlots') ? <EditSpellSlots slots={spellSlots} level={slotsLevel} update={update} goBack={hideModal} editSlots={updateSpellslots} /> : ''
      }
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    overlay: state.ui.overlay,
    items: state.characters.character.items,
    update: state.update,
    itemID: state.ui.itemID,
    spells: state.characters.character.spells,
    spellID: state.ui.spellID,
    spellSlots: state.characters.character.spellSlots,
    slotsLevel: state.ui.slotsLevel
  }
}

export default connect(mapStateToProps, { hideModal, addItem, removeItem, updateItem, addSpell, updateSpell, removeSpell, updateSpellslots })(Modal);