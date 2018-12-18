import React, { Component } from 'react';

import styles from '../css/CharacterStats.module.scss'

class CharacterStats extends Component {
  render() {
    const { str, dex, con, int, wis, cha } = this.props.stats;

    return (
      <div className={styles.container}>

        <section className={styles.statContainer}>
          <p className={styles.title}>STRENGTH</p>
          <p className={styles.bonus}>{str.bonus}</p>
          <p className={styles.stat}>{str.stat}</p>
        </section>

        <section className={styles.statContainer}>
          <p className={styles.title}>DEXTERITY</p>
          <p className={styles.bonus}>{dex.bonus}</p>
          <p className={styles.stat}>{dex.stat}</p>
        </section>

        <section className={styles.statContainer}>
          <p className={styles.title}>CONSTITUTION</p>
          <p className={styles.bonus}>{con.bonus}</p>
          <p className={styles.stat}>{con.stat}</p>
        </section>

        <section className={styles.statContainer}>
          <p className={styles.title}>INTELLIGENCE</p>
          <p className={styles.bonus}>{int.bonus}</p>
          <p className={styles.stat}>{int.stat}</p>
        </section>

        <section className={styles.statContainer}>
          <p className={styles.title}>WISDOM</p>
          <p className={styles.bonus}>{wis.bonus}</p>
          <p className={styles.stat}>{wis.stat}</p>
        </section>

        <section className={styles.statContainer}>
          <p className={styles.title}>CHARISMA</p>
          <p className={styles.bonus}>{cha.bonus}</p>
          <p className={styles.stat}>{cha.stat}</p>
        </section>
        
      </div>
    )
  }
}

export default CharacterStats;