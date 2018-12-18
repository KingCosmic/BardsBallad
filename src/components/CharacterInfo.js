import React, { Component } from 'react';
import classnames from 'classnames';

import StatBox from './StatBox';
import InfoTab from './InfoTab';
import SkillsTab from './SkillsTab';
import SpellsTab from './SpellsTab';
import InventoryTab from './InventoryTab';

import styles from '../css/CharacterInfo.module.scss';

class CharacterInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 2
    }
  }

  render() {
    const { currentTab } = this.state;

    return (
      <div className={styles.container}>

        <div className={styles.tabs}>
          <p className={classnames(styles.tab, { [styles.active]: currentTab === 0 })}>info</p>

          <p className={classnames(styles.tab, { [styles.active]: currentTab === 1 })}>skills</p>

          <p className={classnames(styles.tab, { [styles.active]: currentTab === 2 })}>spells</p>

          <p className={classnames(styles.tab, { [styles.active]: currentTab === 3 })}>inventory</p>
        </div>

        <div className={styles.info}>
          {
            (currentTab === 0) ? <InfoTab /> :
            (currentTab === 1) ? <SkillsTab /> :
            (currentTab === 2) ? <SpellsTab /> :
            (currentTab === 3) ? <InventoryTab /> : <div />
          }
        </div>

        <div className={styles.bottomContainer}>
          <div className={styles.topBar}>
            <p className={styles.name}>Goblin Slayer</p>

            <div className={styles.hpBar}>
              <div className={styles.hpBackground} />
              <p className={styles.hp}>49/49</p>
            </div>
          </div>

          <div className={styles.bottomBar}>
            <p className={styles.quote}>Don't be so quick to throw away your life. No matter how disgraceful or embarrassing it might be, you need to keep struggling to find your way out until the very end.</p>
          
            <div className={styles.statsContainer}>
              <StatBox stat='STR' val={20} buff/>
              <StatBox stat='DEX' val={13} buff/>
              <StatBox stat='CON' val={16} buff/>
              <StatBox stat='INT' val={14} buff/>
              <StatBox stat='WIS' val={16} buff/>
              <StatBox stat='CHA' val={15} buff/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CharacterInfo;