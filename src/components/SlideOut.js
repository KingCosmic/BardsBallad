import React, { Component } from 'react';
import classnames from 'classnames';

import Title from '../atoms/Title';

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
        <Title padding='5px'>Bards Ballad</Title>
      </div>
    )
  }
}

export default SlideOut;