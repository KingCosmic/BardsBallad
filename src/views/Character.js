import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Container from '../atoms/Container';
import Text from '../atoms/Text';

// import EditOverlay from '../components/EditOverlay';

import InfoTab from '../components/InfoTab';
import SkillsTab from '../components/SkillsTab';
import SpellsTab from '../components/SpellsTab';
import InventoryTab from '../components/InventoryTab';

import DataOptions from '../components/DataOptions';

import CharacterStats from '../components/CharacterStats';

import { loadOne, changeCharacter } from '../reducers/characters';

import styles from '../css/CharacterOverlay.module.scss';

const Tab = styled(Text)`
  color: ${props => props.theme.text};
  margin: 0;
  padding: 0 5px 10px;

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

    if (!this.props.character) return null

    const char = this.props.character;

    return (
      <div className={styles.container}>
        { /* <EditOverlay /> */ }

        <Container padding='0 15px'>

          <div className={styles.tabs}>
            <Tab active={currentTab === 0 } onClick={() => this.changeTab(0)}>info</Tab>

            <Tab active={currentTab === 1 } onClick={() => this.changeTab(1)}>skills</Tab>

            <Tab active={currentTab === 2 } onClick={() => this.changeTab(2)}>spells</Tab>

            <Tab active={currentTab === 3 } onClick={() => this.changeTab(3)}>inventory</Tab>
          </div>

          <DataOptions />

        </Container>


        <div className={styles.bottomContainer}>
          <div className={styles.tabContainer}>
            {
              (currentTab === 0) ? <InfoTab char={char} /> :
              
              (currentTab === 1) ? <SkillsTab char={char} /> :
              
              (currentTab === 2) ? <SpellsTab char={char} /> :

              (currentTab === 3) ? <InventoryTab char={char} /> : ''
            }
          </div>

          <CharacterStats char={char} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    characters: state.characters.characters,
    character: state.characters.character
  }
}

export default withRouter(connect(mapStateToProps, { loadOne, changeCharacter })(CharacterOverlay));