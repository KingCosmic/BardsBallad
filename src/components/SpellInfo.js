
import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

import EditSpell from './AddSpell/EditSpell';

import { ReactComponent as Delete } from '../assets/delete.svg';
import { ReactComponent as Edit } from '../assets/edit.svg';

import { itemTypes, propertyTypes } from '../data/constants';
import { mergeUpdates } from '../helpers';

const BackDrop = styled(Container)`
  position: relative;
  width: 30%;
  min-height: 30%;
  height: ${props => props.editing ? '80%' : 'auto'};
  max-height: ${props => props.editing ? '80%' : '60%'};
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

class SpellInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editSpell: false
    }

    this.stopEdit = this.stopEdit.bind(this);
    this.editSpell = this.editSpell.bind(this);
  }

  stopEdit() {
    this.setState({
      editSpell: false
    })
  }

  editSpell() {
    this.setState({
      editSpell: true
    })
  }

  render() {
    const { spells, update, spellID, removeSpell, updateSpell } = this.props;
    const { editSpell } = this.state;

    const spellData = mergeUpdates(spells, update.spells || []);

    const spell = spellData.find(obj => obj.id === spellID);

    const {
      name, casttime, range, verbal, somatic, material,
      duration, concentration, description, higherlevels
    } = spell;

    if (editSpell) {
      return (
        <BackDrop editing={true} onMouseDown={(e) => e.stopPropagation()}>
          <EditSpell spellInfo={spell} addSpell={(spell) => updateSpell(spell.id, spell)} goBack={this.stopEdit} title='Edit Item' />
        </BackDrop>
      )
    }

    return (
      <BackDrop onMouseDown={(e) => e.stopPropagation()}>
        <Options>
          <Delete style={{ cursor: 'pointer', width: '1.7vw', height: '1.7vw' }} onClick={() => removeSpell(spellID)} />
          <Edit style={{ cursor: 'pointer', width: '1.7vw', height: '1.7vw' }} size='0.8rem' onClick={this.editSpell} />
        </Options>

        <Container padding='5px'>
          <Title size='1vw' margin='0 0 10px 0'>{name}</Title>
          <Text size='0.95vw'>CastTime: <SubText>{casttime}</SubText></Text>
          <Text size='0.95vw'>Range: <SubText>{range}</SubText></Text>
          <Text size='0.95vw'>Components: <SubText>{verbal ? 'V, ' : ''} {somatic ? 'S, ' : ''} {material ? `M (${material})` : ''}</SubText></Text>
          <Text size='0.95vw' margin='0 0 10px 0'>Duration: <SubText>{concentration ? `Concentration, up to ${duration}` : duration}</SubText></Text>
          <Text size='0.95vw'><SubText>{description}</SubText></Text>
        </Container>
      </BackDrop>
    )
  }
}

export default SpellInfo;