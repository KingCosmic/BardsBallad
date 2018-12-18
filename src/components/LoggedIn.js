import React, { Component } from 'react';

import Navbar from './Navbar';

import Characters from '../views/Characters';

import styles from '../css/LoggedIn.module.scss'

class LoggedIn extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.contentContainer}>
          <Characters />
        </div>
      </div>
    )
  }
}

export default LoggedIn;