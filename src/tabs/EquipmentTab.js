import React, { Component } from 'react';
import styled from 'styled-components';

import Item from '../components/Item';
import Text from '../components/Text';

import AddItemModal from '../modals/AddItem';
import ItemInfoModal from '../modals/ItemInfo';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
  padding-top: 70px;
  overflow-y: auto;

  @media only screen and (min-width: 768px) {
    padding: 5px;
  }
`

const ListContainer = styled.div`

`

const AddEquipment = styled(Text)`
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.green};
  position: fixed;
  bottom: 70px;
  right: 20px;
  font-size: 2em;
  padding: 7px 19px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, .2), 0 0 0 1px rgba(0, 0, 0, .1);
  cursor: pointer;

  @media only screen and (min-width: 768px) {
    right: 50%;
    bottom: 20px;
  }
`

const Rows = styled.div`
  margin-top: 5px;
  display: flex;
  align-items: center;

  flex-direction: row;
`

const InnerRows = styled.div`
  padding: 0 10px;
  display: flex;
  flex: 1;

  justify-content: space-between;
  align-items: center;

  flex-direction: row;
`

const RowText = styled(Text)`
  font-size: 0.6em;
`

class EquipmentTab extends Component {

  render() {
    const {
      char: { items, _id },
      syncData, openModal, closeModal
    } = this.props;

    return (
      <Container>

        <Rows>
          <RowText>EQUIP</RowText>
          <InnerRows>
            <RowText>NAME</RowText>
            <RowText>QUANTITY</RowText>
          </InnerRows>
        </Rows>
        <ListContainer>
          {
            items.map((item, i) => {
              return (
                <Item {...item} index={i} key={item.id} onClick={() => openModal({
                  id: 'iteminfomodal',
                  type: 'custom',
                  content: <ItemInfoModal characterID={_id} items={items} itemID={item.id} syncData={syncData} requestClose={() => closeModal({ id: 'iteminfomodal' })} />
                })} />
              )
            })
          }
        </ListContainer>

        <AddEquipment onClick={() => openModal({
          id: 'itemaddmodal',
          type: 'custom',
          content: <AddItemModal items={items} characterID={_id} requestClose={() => closeModal({ id: 'itemaddmodal' })} syncData={syncData} />
        })}>&#43;</AddEquipment>
      </Container>
    )
  }
}

export default EquipmentTab;