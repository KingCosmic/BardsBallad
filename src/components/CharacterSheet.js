import React, { Component } from 'react';

import Header from './CharacterHeader';
import Stats from './CharacterStats';

import styles from '../css/CharacterSheet.module.scss';

class CharacterSheet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'GoblinSlayer',
      classInfo: 'Fighter(5)',
      race: {
        name: 'Human',

      },
      alignment: 'nuetral Good',
      stats: {
        str: {
          stat: 20,
          bonus: 5
        },
        dex: {
          stat: 16,
          bonus: 3
        },
        con: {
          stat: 16,
          bonus: 3
        },
        int: {
          stat: 12,
          bonus: 1
        },
        wis: {
          stat: 14,
          bonus: 2
        },
        cha: {
          stat: 18,
          bonus: 4
        }
      }
    }

  }

  render() {
    return (
      <div className={styles.container}>

        <div className={styles.sheet}>
          <Header {...this.state} />
          
          <div className={styles.bottomHalf}>
            <Stats {...this.state}/>
          </div>
        </div>
      </div>
    )
  }
}

export default CharacterSheet;