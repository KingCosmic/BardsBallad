import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Text from '../atoms/Text';

import InfoTab from '../components/InfoTab';
import SkillsTab from '../components/SkillsTab';
import SpellsTab from '../components/SpellsTab';
import InventoryTab from '../components/InventoryTab';

import CharacterStats from '../components/CharacterStats';

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
      currentTab: 3
    }

    this.changeTab = this.changeTab.bind(this);
  }

  changeTab(tab) {
    this.setState({
      currentTab: tab
    })
  }

  render() {
    const { currentTab } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.tabs}>
          <Tab active={currentTab === 0 } onClick={() => this.changeTab(0)}>info</Tab>

          <Tab active={currentTab === 1 } onClick={() => this.changeTab(1)}>skills</Tab>

          <Tab active={currentTab === 2 } onClick={() => this.changeTab(2)}>spells</Tab>

          <Tab active={currentTab === 3 } onClick={() => this.changeTab(3)}>inventory</Tab>
        </div>

        <div className={styles.bottomContainer}>
          <div className={styles.tabContainer}>
            {
              (currentTab === 0) ? <InfoTab /> :
              
              (currentTab === 1) ? <SkillsTab /> :
              
              (currentTab === 2) ? <SpellsTab /> :

              (currentTab === 3) ? <InventoryTab /> : ''
            }
          </div>

          <CharacterStats />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CharacterOverlay));