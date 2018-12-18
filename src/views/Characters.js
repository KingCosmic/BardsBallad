import React, { Component } from 'react';

import CharacterInfo from '../components/CharacterInfo';

import styles from '../css/Characters.module.scss';

class Characters extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.characters}>
          <div className={styles.character}>

            <img className={styles.icon} alt='class' src='http://media.wizards.com/2015/images/dnd/ClassSymb_Fighter.png' />

            <div className={styles.info}>
              <p className={styles.characterName}>Goblin Slayer</p>
              <p className={styles.level}>Fighter: 5</p>
            </div>
          </div>
        </div>


        <CharacterInfo />
      </div>
    )
  }
}

export default Characters;