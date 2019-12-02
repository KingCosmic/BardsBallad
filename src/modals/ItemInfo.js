import React, { Component } from 'react';
import styled from 'styled-components';

import Header from '../components/Header';
import T from '../components/Text';

import EditItem from './AddItem/EditItem';

import ItemOptions from '../components/ItemOptions';

import { FaArrowLeft, FaCheck } from 'react-icons/fa'

import { cloneDeep, merge, mergeUpdates } from '../helpers';
import { itemTypes, propertyTypes } from '../data/constants';

const BackDrop = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 60px 0 15px;
  overflow-x: hidden;
  height: 100%;
  width: 100%;

  border: 1px solid ${props => props.theme.middleblack};
  background-color: ${props => props.theme.dark};
  box-shadow: 0 2px 10px rgba(0, 0, 0, .2), 0 0 0 1px rgba(28, 36, 43 .6);

  @media only screen and (min-width: 768px) {
    border-radius: 8px;
    padding: 0;
  }
`

const DesktopOptions = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 15px;
`

const Text = styled(T)`
  font-size: 1.2em;
  margin: 5px 0;
`

const Name = styled(Text)`
  display: none;
  color: ${props => props.theme.gold};

  @media only screen and (min-width: 768px) {
    display: block;
  }
`

const SubText = styled.span`
  color: rgba(255, 255, 255, .6);
  font-size: 1em;
`

const Description = styled(Text)`
  margin-top: 10px;
`

const BackButton = styled(FaArrowLeft)`
  color: ${props => props.theme.text};
  font-size: 30px;
  height: 60px;
`

const ConfirmButton = styled(FaCheck)`
  color: ${props => props.theme.green};
  font-size: 30px;
  height: 60px;
`

class ItemInfo extends Component {
  constructor(props) {
    super(props);

    const { items, itemID } = props;

    this.state = {
      isEditing: false,
      item: cloneDeep(items.find(obj => obj.id === itemID))
    }

    this.toggleEditing = this.toggleEditing.bind(this)
    this.editItem = this.editItem.bind(this)
    this.confirmEdit = this.confirmEdit.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
  }

  toggleEditing() {
    this.setState({
      isEditing: !this.state.isEditing
    })
  }

  editItem(path, data) {
    this.setState({ item: merge({}, this.state.item, { [path]: data }) })
  }

  confirmEdit() {
    const { requestClose, syncData, characterID } = this.props;

    requestClose()
    syncData(
      characterID,
      {
        items: mergeUpdates(this.props.items, [{ ...this.state.item }])
      }
    )
  }

  deleteItem() {
    const { itemID, requestClose, syncData, characterID } = this.props;

    requestClose()
    syncData(
      characterID,
      {
        items: mergeUpdates(this.props.items, [{ remove: true, id: itemID }])
      }
    )
  }

  render() {
    const { requestClose } = this.props;
    const { isEditing,
      item: {
        name, desc, category, range, longRange,
        damage1, damage2, value, weight, properties = []
      }
    } = this.state;

    return (
      <BackDrop onMouseDown={(e) => e.stopPropagation()}>
        <Header title={isEditing ? `editing ${name}` : name}
          LeftComponent={BackButton} leftClick={isEditing ? this.toggleEditing : requestClose}
          RightComponent={isEditing ? ConfirmButton : () => <ItemOptions deleteClick={this.deleteItem} editClick={this.toggleEditing} />}
          rightClick={isEditing ? this.confirmEdit : undefined}
          bgStyles={{ zIndex: 60 }}
        />

        <DesktopOptions>
          <ItemOptions deleteClick={this.deleteItem} editClick={this.toggleEditing} />
        </DesktopOptions>

        <InfoContainer>
          <Name>{name}</Name>
          <Text><SubText>{itemTypes[category]}</SubText></Text>

          {
            ['M', 'R'].includes(category) ?
              <>
                <Text>Range: <SubText>{range}/{longRange}</SubText></Text>
                <Text>Damage {damage2 ? '(one-handed)' : ''}: <SubText>{damage1}</SubText></Text>
                {damage2 && <Text>Damage (two-handed): <SubText>{damage2}</SubText></Text>}
                <Text>Properties: <SubText>{properties.map(prop => propertyTypes[prop]).join(', ')}</SubText></Text>
              </> : null
          }
          <Text>Value: <SubText>{value}</SubText></Text>
          <Text>Weight: <SubText>{weight} lbs</SubText></Text>

          <Description><SubText>{desc}</SubText></Description>
        </InfoContainer>
        <EditItem showItems={this.toggleEditing} confirm={this.confirmEdit} itemData={this.state.item} editItem={this.editItem} creatingItem={isEditing} />
      </BackDrop>
    )
  }
}

export default ItemInfo;