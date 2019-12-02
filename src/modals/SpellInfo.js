import React, { Component } from 'react';
import styled from 'styled-components';

import Header from '../components/Header';
import T from '../components/Text';

import EditSpell from './AddSpell/EditSpell';

import ItemOptions from '../components/ItemOptions';

import { FaArrowLeft, FaCheck } from 'react-icons/fa'

import { cloneDeep, merge, mergeUpdates } from '../helpers';

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

class SpellInfo extends Component {
  constructor(props) {
    super(props);

    const { spells, spellID } = props;

    this.state = {
      isEditing: false,
      spell: cloneDeep(spells.find(obj => obj.id === spellID))
    }

    this.toggleEditing = this.toggleEditing.bind(this)
    this.editSpell = this.editSpell.bind(this)
    this.confirmEdit = this.confirmEdit.bind(this)
    this.deleteSpell = this.deleteSpell.bind(this)
  }

  toggleEditing() {
    this.setState({
      isEditing: !this.state.isEditing
    })
  }

  editSpell(path, data) {
    this.setState({ spell: merge({}, this.state.spell, { [path]: data }) })
  }

  confirmEdit() {
    const { requestClose, syncData, characterID } = this.props;

    requestClose()
    syncData(
      characterID,
      {
        spells: mergeUpdates(this.props.spells, [{ ...this.state.spell }])
      }
    )
  }

  deleteSpell() {
    const { spellID, requestClose, syncData, characterID } = this.props;

    requestClose()
    syncData(
      characterID,
      {
        spells: mergeUpdates(this.props.spells, [{ remove: true, id: spellID }])
      }
    )
  }

  render() {
    const { requestClose } = this.props;
    const { isEditing,
      spell: {
        name, casttime, range, verbal, somatic, material,
        duration, concentration, description, higherlevels
      }
    } = this.state;

    return (
      <BackDrop onMouseDown={(e) => e.stopPropagation()}>
        <Header title={isEditing ? `editing ${name}` : name}
          LeftComponent={BackButton} leftClick={isEditing ? this.toggleEditing : requestClose}
          RightComponent={isEditing ? ConfirmButton : () => <ItemOptions deleteClick={this.deleteSpell} editClick={this.toggleEditing} />}
          rightClick={isEditing ? this.confirmEdit : undefined}
          bgStyles={{ zIndex: 60 }}
        />

        <DesktopOptions>
          <ItemOptions deleteClick={this.deleteSpell} editClick={this.toggleEditing} />
        </DesktopOptions>

        <InfoContainer>
          <Name>{name}</Name>
          <Text>CastTime: <SubText>{casttime}</SubText></Text>
          <Text>Range: <SubText>{range}</SubText></Text>
          <Text>Components: <SubText>{verbal ? 'V, ' : ''} {somatic ? 'S, ' : ''} {material ? `M (${material})` : ''}</SubText></Text>
          <Text>Duration: <SubText>{concentration ? `Concentration, up to ${duration}` : duration}</SubText></Text>
          <Description>Description: <SubText>{description}</SubText></Description>
          <Text>Higher Levels:<SubText>{higherlevels}</SubText></Text>
        </InfoContainer>
        <EditSpell showSpells={this.toggleEditing} confirm={this.confirmEdit} editSpell={this.editSpell} spellData={this.state.spell} creatingSpell={isEditing} />
      </BackDrop>
    )
  }
}

export default SpellInfo;