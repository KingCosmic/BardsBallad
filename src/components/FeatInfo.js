import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

import EditFeat from './AddFeature/EditFeat';

import { ReactComponent as Delete } from '../assets/delete.svg';
import { ReactComponent as Edit } from '../assets/edit.svg';

import { mergeUpdates } from '../helpers';

const BackDrop = styled(Container)`
  position: relative;
  width: 30%;
  min-height: 30%;
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
      isEditing: false
    }

    this.stopEdit = this.stopEdit.bind(this);
    this.startEdit = this.startEdit.bind(this);
  }

  stopEdit() {
    this.setState({
      isEditing: false
    })
  }

  startEdit() {
    this.setState({
      isEditing: true
    })
  }

  render() {
    const { feats, update, featID, removeFeat, updateFeat } = this.props;
    const { isEditing } = this.state;

    const featdata = mergeUpdates(feats, update.feats || []);

    const feat = featdata.find(obj => obj.id === featID);

    const {
      name, desc, uses
    } = feat;

    if (isEditing) {
      return (
        <BackDrop editing={true} onMouseDown={(e) => e.stopPropagation()}>
          <EditFeat featInfo={feat} addFeat={(feat) => updateFeat(featID, feat)} goBack={this.stopEdit} title='Edit Feat' />
        </BackDrop>
      )
    }

    return (
      <BackDrop onMouseDown={(e) => e.stopPropagation()}>
        <Options>
          <Delete style={{ cursor: 'pointer', width: '1.7vw', height: '1.7vw' }} onClick={() => removeFeat(featID)} />
          <Edit style={{ cursor: 'pointer', width: '1.7vw', height: '1.7vw' }} size='0.8rem' onClick={this.startEdit} />
        </Options>

        <Title>{name}</Title>
        <Text size='0.95vw' margin='0 0 10px 0'><SubText>{uses}</SubText></Text>

        <Text margin='5px 0 0 0'><SubText>{desc}</SubText></Text>
      </BackDrop>
    )
  }
}

export default ItemInfo;