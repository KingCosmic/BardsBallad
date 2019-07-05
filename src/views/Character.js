import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import Container from '../atoms/Container';
import Text from '../atoms/Text';

import InfoTab from '../components/InfoTab';
import SkillsTab from '../components/SkillsTab';
import SpellsTab from '../components/SpellsTab';
import EquipmentTab from '../components/EquipmentTab';
import CombatTab from '../components/CombatTab';

import FeaturesAndTraits from '../components/FeaturesAndTraits';

import DataOptions from '../components/DataOptions';

import CharacterStats from '../components/CharacterStats';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  showItemInfo, showAddItem, editItem, showAddSpell, showSpellInfo,
  showAddFeat, showEditSpellslots
} from '../reducers/ui';
import { loadOne, changeCharacter } from '../reducers/characters';
import { updateData, revertData, updateSpellslots } from '../reducers/update';

import styles from '../css/CharacterOverlay.module.scss';

const Tab = styled(Text)`
  color: ${props => props.theme.text};
  font-family: OpenSans;
  margin: 0;
  padding: 0 10px 10px;

  float: left;

  cursor: pointer;
  position: relative;

  &:hover {
    color: ${props => props.theme.gold};
  }

  ${props => props.active && css`
    color: ${props => props.theme.gold}

    &:after {
      width: 0;
      height: 0;

      content: "";
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      bottom: 0;

      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-bottom: 7px solid ${props => props.theme.grey};
    }
  `}
`

class CharacterOverlay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 0
    }

    this.changeTab = this.changeTab.bind(this);
  }

  componentWillMount() {
    const id = this.props.match.params.characterID;

    if (this.props.characters.length === 0) return this.props.loadOne(id);

    const newChar = this.props.characters.filter(char => char._id === id);

    if (newChar.length === 0) return this.props.loadOne(id);

    this.props.changeCharacter(newChar[0]._id)
  }

  changeTab(tab) {
    this.setState({
      currentTab: tab
    })
  }

  render() {
    const { currentTab } = this.state;
    const {
      character, addSpell, showAddItem, update,
      editItem, updateData, editing, revertData,
      showItemInfo, showAddFeat, showAddSpell, showSpellInfo,
      showEditSpellslots, updateSpellslots
    } = this.props;

    if (!character) return null

    return (
      <div className={styles.container}>
        <Container height='5.5%' padding='0 15px' noFlex>

          <div className={styles.tabs}>
            <Tab active={currentTab === 0} onClick={() => this.changeTab(0)}>info</Tab>

            <Tab active={currentTab === 1} onClick={() => this.changeTab(1)}>skills</Tab>

            <Tab active={currentTab === 2} onClick={() => this.changeTab(2)}>spells</Tab>

            <Tab active={currentTab === 3} onClick={() => this.changeTab(3)}>equipment</Tab>

            <Tab active={currentTab === 4} onClick={() => this.changeTab(4)}>combat</Tab>

            <Tab active={currentTab === 5} onClick={() => this.changeTab(5)}>features & traits</Tab>
          </div>

          <DataOptions />

        </Container>


        <Container direction='row' width='100%' height='calc(100% - 5.5%)'>
          <Container width='75%' margin='0 10px 0 0'>
            {
              (currentTab === 0) ? <InfoTab char={character} /> :
              
              (currentTab === 1) ? <SkillsTab char={character} update={update} updateData={updateData} revertData={revertData}  /> :
              
              (currentTab === 2) ? <SpellsTab char={character} data={update} showAddSpell={showAddSpell} showSpellInfo={showSpellInfo} 
                showEditSpellslots={showEditSpellslots} updateSpellslots={updateSpellslots} /> :

              (currentTab === 3) ? <EquipmentTab char={character} showItemInfo={showItemInfo} showAddItem={showAddItem} update={update}
                updateData={updateData} revertData={revertData} /> :

              (currentTab === 4) ? <CombatTab char={character} data={update} editItem={editItem}
                updateData={updateData} editing={editing} revertData={revertData} /> :

              (currentTab === 5) ? <FeaturesAndTraits char={character}  update={update}
                showAddFeat={showAddFeat} /> : ''
        }
          </Container>

          <CharacterStats char={character} data={update} editItem={editItem}
            updateData={updateData} editing={editing} revertData={revertData} 
          />
        </Container>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    characters: state.characters.characters,
    editing: state.ui.editing,
    character: state.characters.character,
    update: state.update
  }
}

export default withRouter(connect(mapStateToProps, {
  loadOne, changeCharacter, showAddSpell,
  showAddItem, editItem, updateData, revertData, showItemInfo,
  showAddFeat, showSpellInfo, showEditSpellslots,
  updateSpellslots
})(CharacterOverlay));