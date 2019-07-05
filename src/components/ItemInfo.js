import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

import EditItem from './AddItem/EditItem';

import { ReactComponent as Delete } from '../assets/delete.svg';
import { ReactComponent as Edit } from '../assets/edit.svg';

import { itemTypes, propertyTypes } from '../data/constants';
import { mergeUpdates } from '../helpers';

const BackDrop = styled(Container)`
  position: relative;
  width: 30%;
  min-height: 30%;
  height: ${props => props.editing ? '80%' : 'auto'};
  max-height: ${props => props.editing ? '80%' : '50%'};
  border-radius: 8px;
  background-color: ${props => props.theme.dark};
  box-shadow: 0 2px 10px rgba(0, 0, 0, .2), 0 0 0 1px rgba(28, 36, 43 .6);
  padding: 20px;
  overflow-y: auto;
`

const Options = styled(Container)`
  flex-direction: row;
  position: absolute;
  top: 20px;
  right: 20px;
`

const SubText = styled.span`
  color: rgba(255, 255, 255, .6);
  font-size: 0.95vw;
`

class ItemInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      edititem: false
    }

    this.stopEdit = this.stopEdit.bind(this);
    this.editItem = this.editItem.bind(this);
  }

  stopEdit() {
    this.setState({
      editItem: false
    })
  }

  editItem() {
    this.setState({
      editItem: true
    })
  }

  render() {
    const { items, update, itemID, removeItem, updateItem } = this.props;
    const { editItem } = this.state;

    const itemdata = mergeUpdates(items, update.items || []);

    const item = itemdata.find(obj => obj.id === itemID);

    const {
      name, category, range, longRange,
      damage1, damage2, properties,
      value, weight, desc
    } = item;

    if (editItem) {
      return (
        <BackDrop editing={true} onMouseDown={(e) => e.stopPropagation()}>
          <EditItem itemInfo={item} addItem={(item) => updateItem(itemID, item)} goBack={this.stopEdit} title='Edit Item' />
        </BackDrop>
      )
    }

    return (
      <BackDrop onMouseDown={(e) => e.stopPropagation()}>
        <Options>
          <Delete style={{ cursor: 'pointer', width: '1.7vw', height: '1.7vw' }} onClick={() => removeItem(itemID)} />
          <Edit style={{ cursor: 'pointer', width: '1.7vw', height: '1.7vw' }} size='0.8rem' onClick={this.editItem} />
        </Options>

        <Title>{name}</Title>
        <Text size='0.95vw' margin='0 0 10px 0'><SubText>{itemTypes[category]}</SubText></Text>

        {
          ['M', 'R'].includes(category) ?
            <Container>
              <Text size='0.95vw'>Range: <SubText>{range}/{longRange}</SubText></Text>
              <Text size='0.95vw'>Damage {damage2 ? '(one-handed)' : ''}: <SubText>{damage1}</SubText></Text>
              { damage2 && <Text size='0.8rem'>Damage (two-handed): <SubText>{damage2}</SubText></Text> }
              <Text size='0.95vw'>Properties: <SubText>{properties.map(prop => propertyTypes[prop]).join(', ')}</SubText></Text>
            </Container> : null
        }
        <Text size='0.95vw'>Value: <SubText>{value}</SubText></Text>
        <Text size='0.95vw'>Weight: <SubText>{weight} lbs</SubText></Text>

        <Text margin='5px 0 0 0'><SubText>{desc}</SubText></Text>
      </BackDrop>
    )
  }
}

export default ItemInfo;