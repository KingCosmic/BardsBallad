import React from 'react';
import styled from 'styled-components';

import C from '../atoms/Container';

import AddItem from './AddItem';
import ItemInfo from './ItemInfo';

import { connect } from 'react-redux';
import { hideModal } from '../reducers/ui';
import { addItem, removeItem, updateItem } from '../reducers/update';

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

const Modal = ({ overlay, hideModal, addItem, removeItem, updateItem, items, update, itemID }) => {
  return (
    <Container visible={overlay !== ''} onClick={hideModal}>
      {
        (overlay === 'AddItem') ? <AddItem addItem={addItem} /> :
        (overlay === 'ItemInfo') ? <ItemInfo items={items} update={update} itemID={itemID} removeItem={removeItem} updateItem={updateItem} /> : ''
      }
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    overlay: state.ui.overlay,
    items: state.characters.character.items,
    update: state.update,
    itemID: state.ui.itemID
  }
}

export default connect(mapStateToProps, { hideModal, addItem, removeItem, updateItem })(Modal);