import React from 'react';
import classnames from 'classnames';

import styles from '../css/StatBox.module.scss';

const determinBuff = (val) => {
  const buff = Math.round((val - 10.1) / 2);

  return (val < 10) ? buff : `+${buff}`;
}

const StatBox = (props) => {


  return (
    <div className={styles.statContainer}>
      <p className={styles.title}>{props.stat}</p>
      <p className={styles.stat}>{props.val}</p>
      { props.buff ? <p className={classnames(styles.bonus, { [styles.negative]: props.val < 10 })}>({determinBuff(props.val)})</p> : ''}
    </div>
  )
}

export default StatBox;