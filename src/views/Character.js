import React, { Component } from 'react';
import styled from 'styled-components';

import Header from '../components/Header';
import DesktopTabs from '../components/DesktopTabs';

import SideInfo from '../components/SideInfo';

import { FaInfoCircle } from 'react-icons/fa';

import InfoTab from '../tabs/InfoTab';
import SkillsTab from '../tabs/SkillsTab';
import SpellsTab from '../tabs/SpellsTab';
import EquipmentTab from '../tabs/EquipmentTab';
import CombatTab from '../tabs/CombatTab';
import FeaturesAndTraits from '../tabs/FeaturesAndTraits';

import Footer from '../components/CharFooter';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { showAddItem, editItem, toggleSideNav } from '../reducers/ui';
import { openModal, closeModal } from '../reducers/modals';
import {
  loadOne, changeCharacter, addSpell,
  updateData, revertData, syncData
} from '../reducers/characters';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  @media only screen and (min-width: 768px) {
    background: ${props => props.theme.light};
  }
`

const ViewContainer = styled.div`
  display: flex;
  flex-direction: row;

  width: 100%;
  height: calc(100% - 61px);
  justify-content: space-between;

  @media only screen and (min-width: 768px) {
    height: 100%;
    padding: 0 10px;
  }
`

const TabContainer = styled.div`
  width: 100%;
  height: 100%;

  @media only screen and (min-width: 768px) {
    width: 41%;
  }
`

const SideInfoButton = styled(FaInfoCircle)`
  color: ${props => props.theme.text};
  font-size: 30px;
  line-height: 60px;
`

class CharacterOverlay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: 'info',
      sideInfoIsOpen: false
    }

    this.changeTab = this.changeTab.bind(this)
    this.toggleSideInfo = this.toggleSideInfo.bind(this)
  }

  componentDidMount() {
    const id = this.props.match.params.characterID;

    if (this.props.characters.length === 0) return this.props.loadOne(id);

    const newChar = this.props.characters.filter(char => char._id === id);

    if (newChar.length === 0) return this.props.loadOne(id);

    this.props.changeCharacter(newChar[0]._id)
  }

  changeTab(tab) {
    this.setState({
      selectedTab: tab
    })
  }

  toggleSideInfo() {
    this.setState({
      sideInfoIsOpen: !this.state.sideInfoIsOpen
    })
  }

  render() {
    const { selectedTab, sideInfoIsOpen } = this.state;
    const {
      character, update,
      updateData, revertData,
      toggleSideNav, syncData,
      openModal, closeModal
    } = this.props;

    if (!character) return null

    return (
      <Container>

        <Header
          leftClick={toggleSideNav} title={selectedTab}
          RightComponent={() => <SideInfoButton onClick={this.toggleSideInfo} />}
        />

        <DesktopTabs selectedTab={selectedTab} changeTab={this.changeTab} />

        <ViewContainer>
          <TabContainer>
            {
              (selectedTab === 'info') ? <InfoTab char={character} syncData={syncData} openModal={openModal} closeModal={closeModal} /> :

              (selectedTab === 'skills') ? <SkillsTab char={character} syncData={syncData} openModal={openModal} closeModal={closeModal} /> :

              (selectedTab === 'spells') ? <SpellsTab char={character} syncData={syncData} openModal={openModal} closeModal={closeModal} /> :

              (selectedTab === 'equipment') ? <EquipmentTab char={character} syncData={syncData} openModal={openModal} closeModal={closeModal}  /> :

              (selectedTab === 'combat') ? <CombatTab char={character} update={update} editItem={editItem}
              updateData={updateData} revertData={revertData} /> :

              (selectedTab === 'features') ? <FeaturesAndTraits char={character} syncData={syncData} openModal={openModal} closeModal={closeModal} /> : ''
            }
          </TabContainer>

          <SideInfo char={character} open={sideInfoIsOpen} requestClose={this.toggleSideInfo} syncData={syncData} openModal={openModal} closeModal={closeModal} />
        </ViewContainer>

        <Footer selectedTab={selectedTab} changeTab={this.changeTab} />
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    characters: state.characters.characters,
    editing: state.ui.editing,
    character: state.characters.character,
    update: state.characters.update.data,
    empty: state.characters.update.empty
  }
}

export default withRouter(connect(mapStateToProps, {
  loadOne, changeCharacter, addSpell,
  showAddItem, editItem, updateData, revertData,
  toggleSideNav, syncData, openModal, closeModal
})(CharacterOverlay));