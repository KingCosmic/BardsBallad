import React, { Component } from 'react';

import styles from '../css/Navbar.module.scss';

class Sidebar extends Component {
  render() {
    return (
      <div className={styles.container}>
        <p className={styles.title}>Cappers Crate</p>
      </div>
    )
  }
}

export default Sidebar;