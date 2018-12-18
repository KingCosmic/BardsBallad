import React, { Component } from 'react';

import styles from '../css/CharacterHeader.module.scss';

class CharacterHeader extends Component {
  render() {
    const { name, classInfo, race, alignment } = this.props;

    return (
      <header className={styles.container}>

        <section className={styles.nameContainer + ' ' + styles.section}>
          <p className={styles.title}>{name}</p>
          <p className={styles.description}>CHARACTER NAME</p>
        </section>

        <section className={styles.classContainer + ' ' + styles.section}>
          <p className={styles.title}>{classInfo}</p>
          <p className={styles.description}>CLASS & LEVEL</p>
        </section>

        <section className={styles.raceContainer + ' ' + styles.section}>
          <p className={styles.title}>{race.name}</p>
          <p className={styles.description}>RACE</p>
        </section>

        <section className={styles.alignmentContainer + ' ' + styles.section}>
          <p className={styles.title}>{alignment}</p>
          <p className={styles.description}>ALIGNMENT</p>
        </section>

      </header>
    )
  }
}

export default CharacterHeader;