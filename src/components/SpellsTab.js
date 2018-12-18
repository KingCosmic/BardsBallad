import React, { Component } from 'react';

import StatBox from './StatBox';

import styles from '../css/SpellsTab.module.scss';

class SpellsTab extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.statContainer}>
          <p>SPELLCASTING CLASS</p>

          <p>SPELLCASTING ABILITY</p>

          <p>SPELL SAVE DC</p>

          <p>SPELL ATTACK BONUS</p>
        </div>
      </div>
    )
  }
}

export default SpellsTab;