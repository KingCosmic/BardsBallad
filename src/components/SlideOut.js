import React, { Component } from 'react';
import classnames from 'classnames';

import styles from '../css/SlideOut.module.scss';

class SlideOut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }
  }

  render() {
    const { open } = this.state;

    return (
      <div className={classnames(styles.container, { [styles.open]: open })}>
        <p className={styles.title}>Characters</p>
      </div>
    )
  }
}

export default SlideOut;