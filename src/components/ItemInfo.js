import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

import EditItem from './AddItem/EditItem';

import { itemTypes, propertyTypes } from '../data/constants';
import { mergeUpdates } from '../helpers';

const BackDrop = styled(Container)`
  position: relative;
  width: 30%;
  min-height: 30%;
  max-height: 50%;
  border-radius: 8px;
  background-color: ${props => props.theme.dark};
  box-shadow: 0 2px 10px rgba(0, 0, 0, .2), 0 0 0 1px rgba(28, 36, 43 .6);
  padding: 20px;
`

const Options = styled(Container)`
  position: absolute;
  top: 20px;
  right: 20px;
`

const SubText = styled.span`
  color: rgba(255, 255, 255, .6);
  font-size: 0.8rem;
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
      value, weight
    } = item;

    if (editItem) {
      return (
        <BackDrop onClick={(e) => e.stopPropagation()}>
          <EditItem itemInfo={item} addItem={(item) => {
            console.log(item)
            updateItem(itemID, item)
          }} goBack={this.stopEdit} />
        </BackDrop>
      )
    }

    return (
      <BackDrop onClick={(e) => e.stopPropagation()}>
        <Options>
          <Text size='0.8rem' onClick={() => removeItem(itemID)}>Delete</Text>
          <Text size='0.8rem' onClick={this.editItem}>Edit</Text>
        </Options>

        <Title>{name}</Title>
        <Text size='0.8rem'>{itemTypes[category]}</Text>

        {
          <Container margin='10px 0 0 0'>
            <Text size='0.8rem'>Range: <SubText>{range}/{longRange}</SubText></Text>
            <Text size='0.8rem'>Damage {damage2 ? '(one-handed)' : ''}: <SubText>{damage1}</SubText></Text>
            { damage2 && <Text size='0.8rem'>Damage (two-handed): <SubText>{damage2}</SubText></Text> }
            <Text size='0.8rem'>Properties: <SubText>{properties.map(prop => propertyTypes[prop]).join(', ')}</SubText></Text>
          </Container>
        }
        <Text size='0.8rem'>Value: <SubText>{value}</SubText></Text>
        <Text size='0.8rem'>Weight: <SubText>{weight} lbs</SubText></Text>
      </BackDrop>
    )
  }
}

export default ItemInfo;